using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WatchWebsite_TLCN.DTO
{
    public class OrderDetailDTO
    {
        public int OrderId { get; set; }
        public string ProductId { get; set; }
        public int Count { get; set; }
        public float Price { get; set; }
        public string ProductName { get; set; }
        public string Brand { get; set; }
        public byte[] Image { get; set; }
    }
}
