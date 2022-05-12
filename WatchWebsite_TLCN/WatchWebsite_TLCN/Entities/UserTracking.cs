using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace WatchWebsite_TLCN.Entities
{
    [Table("UserTracking")]
    public class UserTracking
    {
        public string Cookie { get; set; }

        public string ProductId { get; set; }

        public int ClickCart { get; set; }

        public double Time { get; set; }

        public int Order { get; set; }

        public int ClickDetail { get; set; }

    }
}
