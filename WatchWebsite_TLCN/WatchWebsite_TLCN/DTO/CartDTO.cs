using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WatchWebsite_TLCN.DTO
{
    public class CartDTO
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public byte[] Image { get; set; }
        public double Price { get; set; }
        public int Quantity { get; set; }
        public string BrandName { get; set; }
        public int Amount { get; set; }
    }
}
