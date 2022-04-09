using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WatchWebsite_TLCN.DTO
{
    public class RateDTO
    {
        public int UserId { get; set; }

        public string ProductId { get; set; }

        public int Value { get; set; } = -1;
    }
}
