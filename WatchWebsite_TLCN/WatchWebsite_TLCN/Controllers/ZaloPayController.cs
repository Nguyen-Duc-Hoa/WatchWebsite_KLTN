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
using Newtonsoft.Json; // https://www.newtonsoft.com/json

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

        static string appid = "553";
        static string key1 = "9phuAOYhan4urywHTh0ndEXiV3pKHr5Q";
        static string createOrderUrl = "https://sandbox.zalopay.com.vn/v001/tpe/createorder";

        [HttpGet]
        public async Task<IActionResult> ZaloPayAsync([FromBody] PaymentZalo info)
        {
            var transid = Guid.NewGuid().ToString();
            var embeddata = new { merchantinfo = "embeddata123" };
            object[] product = await CalculateOrderAmount(info.Products);
            var items = new List<ZaloItem>();
            string amount = "0";
            if(product != null && product[0] != null)
            {
                amount = product[1].ToString();
                items = (List<ZaloItem>)product[0];
            }
            var param = new Dictionary<string, string>();

            param.Add("appid", appid);
            param.Add("appuser", info.Name);
            param.Add("apptime", Utils.GetTimeStamp().ToString());
            param.Add("amount", amount);
            param.Add("apptransid", DateTime.Now.ToString("yyMMdd") + "_" + transid); // mã giao dich có định dạng yyMMdd_xxxx
            param.Add("embeddata", JsonConvert.SerializeObject(embeddata));
            param.Add("item", JsonConvert.SerializeObject(items));
            param.Add("description", "MiniMix Payment");
            param.Add("bankcode", "zalopayapp");
            param.Add("phone", info.Phone);
            param.Add("address", info.Address);

            var data = appid + "|" + param["apptransid"] + "|" + param["appuser"] + "|" + param["amount"] + "|"
                + param["apptime"] + "|" + param["embeddata"] + "|" + param["item"];
            param.Add("mac", HmacHelper.Compute(ZaloPayHMAC.HMACSHA256, key1, data));

            var result = await HttpHelper.PostFormAsync(createOrderUrl, param);

            foreach (var entry in result)
            {
                Console.WriteLine("{0} = {1}", entry.Key, entry.Value);
            }

            return Ok(result);
        }

        private string key2 = "eG4r0GcoNtRGbO8";

        [HttpPost]
        public IActionResult Callback([FromBody] dynamic cbdata)
        {
            var result = new Dictionary<string, object>();

            try
            {
                var dataStr = Convert.ToString(cbdata["data"]);
                var reqMac = Convert.ToString(cbdata["mac"]);

                var mac = HmacHelper.Compute(ZaloPayHMAC.HMACSHA256, key2, dataStr);

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
                    Console.WriteLine("update order's status = success where apptransid = {0}", dataJson["apptransid"]);

                    result["returncode"] = 1;
                    result["returnmessage"] = "success";
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

        private async Task<object[]> CalculateOrderAmount(List<ProductItem> products)
        {
            float total = 0;
            List<ZaloItem> items = new List<ZaloItem>();
            foreach (var item in products)
            {
                var prod = await _unitOfWork.Products.Get(p => p.Id == item.Id);

                items.Add(new ZaloItem
                {
                    itemid = prod.Id,
                    itemname = prod.Name,
                    itemprice = prod.Price,
                    itemquantity = item.Quantity
                });
                total = total + prod.Price * item.Quantity;
            }
            return new object[] { items, total };
        }

    }

}
