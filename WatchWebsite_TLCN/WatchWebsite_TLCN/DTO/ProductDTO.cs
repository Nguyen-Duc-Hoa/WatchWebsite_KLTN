using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WatchWebsite_TLCN.Entities;

namespace WatchWebsite_TLCN.DTO
{
    public class ProductDTO
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public float Price { get; set; }
    }

    public class ProductResponseDTO : ProductDTO
    {
        public int Amount { get; set; }
        public string Brand { get; set; }
        public int Gender { get; set; }
    }
}
