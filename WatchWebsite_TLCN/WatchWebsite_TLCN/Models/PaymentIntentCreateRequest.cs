using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WatchWebsite_TLCN.Models
{
    public class PaymentIntentCreateRequest
    {
        public List<ProductItem> Products { get; set; }
    }
    public class ProductItem
    {
        public string Id { get; set; }
        public int Quantity { get; set; }
    }
}
