using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;


namespace WatchWebsite_TLCN.Entities
{
    public class Rate
    {
        public int UserId { get; set; }

        public string ProductId { get; set; }

        public int Value { get; set; } = -1;

        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; }
    }
}
