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
            //var transid = Guid.NewGuid().ToString();
            //object[] product = await CalculateOrderAmount(info.Products, 
            //    info.VoucherCode, info.VoucherId);
            //var items = new List<ZaloItem>();
            //string amount = "0";
            //if (product != null && product[0] != null)
            //{
            //    amount = product[1].ToString();
            //    items = (List<ZaloItem>)product[0];
            //}
            //var param = new Dictionary<string, string>();

            //param.Add("app_id", appid);
            //param.Add("app_user", info.Name);
            //param.Add("app_time", Utils.GetTimeStamp().ToString());
            //param.Add("amount", amount);
            //param.Add("app_trans_id", DateTime.Now.ToString("yyMMdd") + "_" + transid); // mã giao dich có định dạng yyMMdd_xxxx
            //param.Add("embed_data", JsonConvert.SerializeObject(new { 
            //    userid = info.UserId,
            //    voucherid = info.VoucherId,
            //    phone = info.Phone,
            //    address = info.Address
            //}));
            //param.Add("item", JsonConvert.SerializeObject(items));
            //param.Add("description", "MiniMix Payment");
            //param.Add("bank_code", "zalopayapp");
            //param.Add("phone", info.Phone);
            //param.Add("address", info.Address);

            //var data = appid + "|" + param["app_trans_id"] + "|" + param["app_user"] + "|" + param["amount"] + "|"
            //    + param["app_time"] + "|" + param["embed_data"] + "|" + param["item"];
            //param.Add("mac", HmacHelper.Compute(ZaloPayHMAC.HMACSHA256, key1, data));

            //var result = await HttpHelper.PostFormAsync(createOrderUrl, param);

            string app_id = "2553";
            string key1 = "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL";
            string create_order_url = "https://sb-openapi.zalopay.vn/v2/create";

            Random rnd = new Random();
            var embed_data = new { };
            var param = new Dictionary<string, string>();
            var app_trans_id = rnd.Next(1000000); // Generate a random order's ID.

            object[] product = await CalculateOrderAmount(info.Products,
                info.VoucherCode, info.VoucherId);
            var items = new List<ZaloItem>();
            string amount = "0";
            if (product != null && product[0] != null)
            {
                amount = product[1].ToString();
                items = (List<ZaloItem>)product[0];
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
                address = info.Address
            }));
            param.Add("item", JsonConvert.SerializeObject(items));
            param.Add("description", "Lazada - Thanh toán đơn hàng #" + app_trans_id);
            param.Add("bank_code", "zalopayapp");

            var data = app_id + "|" + param["app_trans_id"] + "|" + param["app_user"] + "|" + param["amount"] + "|"
                + param["app_time"] + "|" + param["embed_data"] + "|" + param["item"];
            param.Add("mac", HmacHelper.Compute(ZaloPayHMAC.HMACSHA256, key1, data));

            var result = await HttpHelper.PostFormAsync(create_order_url, param);

            return Ok(result);
        }

        private string key2 = "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf";

        [HttpPost]
        public async Task<IActionResult> Callback([FromBody] dynamic cbdata)
        {
            var result = new Dictionary<string, object>();
            var dataStr1 = Convert.ToString(cbdata["data"]);

            var dataJson1 = JsonConvert.DeserializeObject<Dictionary<string, object>>(dataStr1);
            var emb = JsonConvert.DeserializeObject<Dictionary<string, object>>(dataJson1["embed_data"]);
            
            var item = JsonConvert.DeserializeObject<IList<ZaloItem>>(dataJson1["item"]);

            OrderDTO order = new OrderDTO();
            List<ProductItem> products = new List<ProductItem>();
            foreach(var i in item)
            {
                ProductItem prod = new ProductItem();
                prod.Id = i.itemid;
                prod.Quantity = i.itemquantity;

                products.Add(prod);
            }
            order.Products = products;
            order.Phone = emb["phone"];
            order.Name = dataJson1["appuser"];
            order.UserId = Convert.ToInt32(emb["userid"]);
            order.OrderDate = DateTime.Now;
            if (emb["voucherid"] != null)
                order.CodeVoucher = Convert.ToInt32(emb["voucherid"]);
            else
                order.CodeVoucher = null;
            order.Address = emb["address"];
            var saveOrder = await PostOrder(order);

            try
            {
                var dataStr = Convert.ToString(cbdata["data"]);
                var reqMac = Convert.ToString(cbdata["mac"]);

                var mac = HmacHelper.Compute(ZaloPayHMAC.HMACSHA256, key1, dataStr);

                Console.WriteLine("mac = {0}", mac);

                // kiểm tra callback hợp lệ (đến từ ZaloPay server)
                if (!reqMac.Equals(mac))
                {
                    // callback không hợp lệ
                    result["returncode"] = -1;
                    result["returnmessage"] = "mac not equal";
                }
                else
                {
                    // thanh toán thành công
                    // merchant cập nhật trạng thái cho đơn hàng
                    var dataJson = JsonConvert.DeserializeObject<Dictionary<string, object>>(dataStr);
                    //var saveOrder = await PostOrder(order);
                    if(saveOrder)
                    {
                        result["returncode"] = 1;
                        result["returnmessage"] = "success";
                    }    
                    Console.WriteLine("update order's status = success where apptransid = {0}", dataJson["apptransid"]);
                }
            }
            catch (Exception ex)
            {
                result["returncode"] = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
                result["returnmessage"] = ex.Message;
            }

            // thông báo kết quả cho ZaloPay server
            return Ok(result);
        }

        private async Task<object[]> CalculateOrderAmount(List<ProductItem> products, 
            string voucherCode, int? voucherId)
        {
            float total = 0;
            DateTime now = DateTime.Now;
            List<ZaloItem> items = new List<ZaloItem>();
            float discount = 0;
            Dictionary<string, float> dataJson = new Dictionary<string, float>();
            Voucher voucher = new Voucher();
            if (voucherCode.Trim() != "")
            {
                voucher = await _unitOfWork.Vouchers.Get(expression: v => v.Code == voucherCode && v.VoucherId == voucherId && v.StartDate <= now && v.EndDate >= now && v.State == true);
                if (voucher != null)
                {
                    discount = voucher.Discount;
                }
            }
            try
            {
                //using (var httpClient = new HttpClient())
                //{
                //    using (var response = await httpClient.GetAsync("https://free.currconv.com/api/v7/convert?q=USD_VND&compact=ultra&apiKey=0850bbd4eefdb86b5aed"))
                //    {
                //        string apiResponse = await response.Content.ReadAsStringAsync();
                //        dataJson = JsonConvert.DeserializeObject<Dictionary<string, float>>(apiResponse);
                //    }
                //}
                dataJson.Add("USD_VND", 23000);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            foreach (var item in products)
            {
                var prod = await _unitOfWork.Products.Get(p => p.Id == item.Id);

                items.Add(new ZaloItem
                {
                    itemid = prod.Id,
                    itemname = prod.Name,
                    itemprice = prod.Price * dataJson["USD_VND"],
                    itemquantity = item.Quantity,
                    itemvouchercode = voucherCode,
                    itemvoucherdiscount = voucher != null ? voucher.Discount : 0
                });
                total = total + prod.Price * item.Quantity;
            }
            total = (float)Math.Truncate((total - discount) * dataJson["USD_VND"]);
            if (total <= 0)
            {
                total = dataJson["USD_VND"];
            }
            return new object[] { items, total };
        }

        public async Task<bool> PostOrder(OrderDTO orderDTO)
        {
            try
            {
                float discount = 0;
                DateTime now = DateTime.Now;
                //DateTime timeVN = now.AddHours(15);
                //orderDTO.OrderDate = timeVN;
                orderDTO.OrderDate = DateTime.Now;
                var order = _mapper.Map<Entities.Order>(orderDTO);
                if (orderDTO.CodeVoucher != -1)
                {
                    var voucher = await _unitOfWork.Vouchers.Get(expression: v => v.VoucherId == orderDTO.CodeVoucher);
                    if (voucher != null)
                    {
                        discount = voucher.Discount;
                        order.VoucherName = voucher.Name;
                        order.Discount = voucher.Discount;
                    }
                }
                order.PaymentMethod = Constant.zaloPayMethod;
                order.Total = await CalculateOrderAmount1(orderDTO.Products) / 100 - discount;

                // Create order
                await _unitOfWork.Orders.Insert(order);
                await _unitOfWork.Save();

                // Create order detail and update product sold, amound columns
                foreach (var item in orderDTO.Products)
                {
                    var product = await _unitOfWork.Products.Get(p => p.Id == item.Id);
                    product.Sold = product.Sold + item.Quantity;
                    product.Amount = product.Amount - item.Quantity;
                    _unitOfWork.Products.Update(product);

                    var orderDetail = new OrderDetail()
                    {
                        OrderId = order.OrderId,
                        ProductId = item.Id,
                        Count = item.Quantity,
                        Price = product.Price,
                        ProductName = product.Name
                    };
                    var rate = new Rate() { ProductId = item.Id, UserId = order.UserId };

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

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        private async Task<float> CalculateOrderAmount1(List<ProductItem> products)
        {
            float total = 0;
            foreach (var item in products)
            {
                var prod = await _unitOfWork.Products.Get(p => p.Id == item.Id);
                total = total + prod.Price * item.Quantity;
            }
            return total * 100;
        }

    }

}
