using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using WatchWebsite_TLCN.Utilities;

namespace WatchWebsite_TLCN.Entities
{
    public class Voucher
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int VoucherId { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        public float Discount { get; set; }

        [Required]
        public string Code { get; set; }

        //[Required]
        public bool State { get; set; } = true;

        public virtual ICollection<Order> Orders { get; set; }
    }
}
