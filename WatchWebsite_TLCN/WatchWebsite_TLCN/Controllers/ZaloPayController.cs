using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;
using WatchWebsite_TLCN.Entities;
using WatchWebsite_TLCN.IRepository;
using Newtonsoft.Json;
using WatchWebsite_TLCN.Models;
using WatchWebsite_TLCN.DTO;
using AutoMapper;
using WatchWebsite_TLCN.Intefaces;
using Microsoft.AspNetCore.Authorization;
using ZaloPay.Helper; // HmacHelper, RSAHelper, HttpHelper, Utils (tải về ở mục DOWNLOADS)
using ZaloPay.Helper.Crypto;
using System.Net.Http;
using WatchWebsite_TLCN.Utilities;

namespace WatchWebsite_TLCN.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ZaloPayController : ControllerBase
    {

        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ZaloPayController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        static string appid = "2553";
        static string key1 = "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL";
        static string createOrderUrl = "https://sb-openapi.zalopay.vn/v2/create";

        [HttpPost]
        [Route("createOrder")]
        public async Task<IActionResult> ZaloPayAsync([FromBody] PaymentZalo info)
        {
            string app_id = "2553";
            string key1 = "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL";
            string create_order_url = "https://sb-openapi.zalopay.vn/v2/create";

            Random rnd = new Random();
            var param = new Dictionary<string, string>();
            var app_trans_id = rnd.Next(1000000); // Generate a random order's ID.

            object[] product = await CalculateOrderAmount(info.Products,
                info.VoucherCode, info.VoucherId);
            var items = new List<ZaloItem>();
            string amount = "0";
            string amountUSD = "0";
            if (product != null && product[0] != null)
            {
                amount = product[1].ToString();
                items = (List<ZaloItem>)product[0];
                amountUSD = product[2].ToString();
            }

            param.Add("app_id", app_id);
            param.Add("app_user", info.Name);
            param.Add("app_time", Utils.GetTimeStamp().ToString());
            param.Add("amount", amount);
            param.Add("app_trans_id", DateTime.Now.ToString("yyMMdd") + "_" + app_trans_id); // mã giao dich có định dạng yyMMdd_xxxx
            param.Add("embed_data", JsonConvert.SerializeObject(new
            {
                userid = info.UserId,
                voucherid = info.VoucherId,
                phone = info.Phone,
                address = info.Address,
                total = amountUSD
            }));
            param.Add("item", JsonConvert.SerializeObject(items));
            param.Add("description", "Minimix payment");
            param.Add("bank_code", "zalopayapp");

            var data = app_id + "|" + param["app_trans_id"] + "|" + param["app_user"] + "|" + param["amount"] + "|"
                + param["app_time"] + "|" + param["embed_data"] + "|" + param["item"];
            param.Add("mac", HmacHelper.Compute(ZaloPayHMAC.HMACSHA256, key1, data));

            var result = await HttpHelper.PostFormAsync(create_order_url, param);

            return Ok(result);
        }

        private string key2 = "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf";

        [HttpPost]
        [Route("callback")]
        public async Task<IActionResult> Callback([FromBody] dynamic cbdata)
        {
            var result = new Dictionary<string, object>();
            var dataStr1 = Convert.ToString(cbdata["data"]);

            var dataJson1 = JsonConvert.DeserializeObject<Dictionary<string, object>>(dataStr1);
            var emb = JsonConvert.DeserializeObject<Dictionary<string, object>>(dataJson1["embed_data"]);
            
            var item = JsonConvert.DeserializeObject<IList<ZaloItem>>(dataJson1["item"]);

            Entities.Order order = new Entities.Order();
            List<ProductItem> products = new List<ProductItem>();
            foreach(var i in item)
            {
                ProductItem prod = new ProductItem();
                prod.Id = i.itemid;
                prod.Quantity = i.itemquantity;

                products.Add(prod);
            }
            order.Transaction = dataJson1["app_trans_id"];
            order.Phone = emb["phone"];
            order.Name = dataJson1["app_user"];
            order.UserId = Convert.ToInt32(emb["userid"]);
            order.Total = (float)Convert.ToDouble(emb["total"]);
            order.Address = emb["address"];

            float discount = 0;
            order.OrderDate = DateTime.Now.AddHours(7);
            if (emb["voucherid"] != null)
            {
                int voucherId = Convert.ToInt32(emb["voucherid"]);
                var voucher = await _unitOfWork.Vouchers.Get(expression: v => v.VoucherId == voucherId);
                if (voucher != null)
                {
                    discount = voucher.Discount;
                    order.VoucherName = voucher.Name;
                    order.Discount = voucher.Discount;
                }
            }
            order.PaymentMethod = Constant.zaloPayMethod;
            order.PaymentStatus = "succeeded";

            // Create order
            await _unitOfWork.Orders.Insert(order);
            await _unitOfWork.Save();

            foreach (var prod in products)
            {
                var product = await _unitOfWork.Products.Get(p => p.Id == prod.Id);
                product.Sold = product.Sold + prod.Quantity;
                product.Amount = product.Amount - prod.Quantity;
                _unitOfWork.Products.Update(product);

                var orderDetail = new OrderDetail()
                {
                    OrderId = order.OrderId,
                    ProductId = prod.Id,
                    Count = prod.Quantity,
                    Price = product.Price,
                    ProductName = product.Name
                };
                var rate = new Rate() { ProductId = prod.Id, UserId = order.UserId };

                await _unitOfWork.OrderDetails.Insert(orderDetail);

                var dbRate = await _unitOfWork.Rates.Get(expression: r => r.UserId == rate.UserId && r.ProductId == rate.ProductId);
                if (dbRate != null)
                {
                    _unitOfWork.Rates.Update(rate);
                }
                else
                {
                    await _unitOfWork.Rates.Insert(rate);
                }
            }

            // Delete all cart items of user
            var cartItems = await _unitOfWork.Carts.GetAll(c => c.UserId == order.UserId);
            _unitOfWork.Carts.DeleteRange(cartItems);

            await _unitOfWork.Save();
            
            return Ok();
        }

        private async Task<object[]> CalculateOrderAmount(List<ProductItem> products, 
            string voucherCode, int? voucherId)
        {
            float total = 0;
            DateTime now = DateTime.Now;
            List<ZaloItem> items = new List<ZaloItem>();
            float discount = 0;
            Voucher voucher = new Voucher();
            if (voucherCode.Trim() != "")
            {
                voucher = await _unitOfWork.Vouchers.Get(expression: v => v.Code == voucherCode && v.VoucherId == voucherId && v.StartDate <= now && v.EndDate >= now && v.State == true);
                if (voucher != null)
                {
                    discount = voucher.Discount;
                }
            }

            string convertCurrencyApi = "https://api.fastforex.io/fetch-one?from=USD&to=VND&api_key=9ef3bf076c-6045f23d0b-rf1srh";
            CurrencyTransfer currencyTransfer = new CurrencyTransfer();
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.GetAsync(convertCurrencyApi))
                {
                    string apiResponse = await response.Content.ReadAsStringAsync();
                    currencyTransfer = JsonConvert.DeserializeObject<CurrencyTransfer>(apiResponse);
                }
            }

            foreach (var item in products)
            {
                var prod = await _unitOfWork.Products.Get(p => p.Id == item.Id);

                items.Add(new ZaloItem
                {
                    itemid = prod.Id,
                    itemname = prod.Name,
                    itemprice = prod.Price * currencyTransfer.result.VND,
                    itemquantity = item.Quantity,
                    itemvouchercode = voucherCode,
                    itemvoucherdiscount = voucher != null ? voucher.Discount : 0
                });
                total = total + prod.Price * item.Quantity;
            }
            float totalUSD = total - discount;
            total = (float)Math.Truncate((total - discount) * currencyTransfer.result.VND);
            if (total < currencyTransfer.result.VND)
            {
                total = currencyTransfer.result.VND;
            }
            return new object[] { items, total, totalUSD };
        }

        public class VNDCurrency
        {
            public float VND { get; set; }
        }
        public class CurrencyTransfer
        {
            public string Base { get; set; }
            public string Updated { get; set; }
            public float Ms { get; set; }
            public VNDCurrency result { get; set; }
        }
    }

}
