using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WatchWebsite_TLCN.Models
{
    public class PaymentIntentCreateRequest
    {
        public List<ProductItem> Products { get; set; }
        public string voucherCode { get; set; } = "";
        public int? voucherId { get; set; }
    }
    public class ProductItem
    {
        public string Id { get; set; }
        public int Quantity { get; set; }
    }

    public class ZaloItem
    {
        public string itemid { get; set; }
        public string itemname { get; set; }
        public float itemprice { get; set; }
        public int itemquantity { get; set; }
        public string itemvouchercode { get; set; }
        public float itemvoucherdiscount { get; set; }
    }
}
