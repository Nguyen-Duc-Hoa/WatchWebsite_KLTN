using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WatchWebsite_TLCN.Models
{
    public class FilterProduct
    {
        public string SortBy { get; set; }
        public int Gender { get; set; } = -1;
        public string Prices { get; set; }
        public string[] Brands { get; set; }
        public string Search { get; set; }
    }
}
