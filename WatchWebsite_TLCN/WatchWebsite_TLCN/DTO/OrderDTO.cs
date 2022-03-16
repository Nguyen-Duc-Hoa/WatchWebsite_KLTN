using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WatchWebsite_TLCN.Models;

namespace WatchWebsite_TLCN.DTO
{
    public class OrderDTO
    {
        public int UserId { get; set; }
        public DateTime OrderDate { get; set; }
        public string Transaction { get; set; }
        public string PaymentStatus { get; set; }
        public string Address { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public List<ProductItem> Products { get; set; }
    }
    public class OrderUpdateState
    {
        public int OrderId { get; set; }
        public string DeliveryStatus { get; set; }
    }
}
