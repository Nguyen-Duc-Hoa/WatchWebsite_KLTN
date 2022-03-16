using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WatchWebsite_TLCN.DTO
{
    public class UserOrderDTO
    {
        public int OrderId { get; set; }

        public int UserId { get; set; }

        public DateTime OrderDate { get; set; }

        public float Total { get; set; }

        public string Transaction { get; set; }

        public string PaymentStatus { get; set; }

        public string Address { get; set; }

        public string Name { get; set; }

        public string Phone { get; set; }

        public string DeliveryStatus { get; set; }
    }
}
