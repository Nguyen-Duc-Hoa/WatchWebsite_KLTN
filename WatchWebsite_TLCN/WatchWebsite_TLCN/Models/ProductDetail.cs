using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WatchWebsite_TLCN.Models
{
    public class ProductDetail
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public int Amount { get; set; }

        public byte[] Image { get; set; }

        public string Description { get; set; }

        public string Brand { get; set; }

        public int Gender { get; set; }

        public string Material { get; set; }

        public string WaterResistance { get; set; }

        public float Size { get; set; }

        public string Energy { get; set; }
    }
}
