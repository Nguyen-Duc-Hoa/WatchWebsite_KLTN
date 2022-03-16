using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using WatchWebsite_TLCN.Utilities;

namespace WatchWebsite_TLCN.Entities
{
    [Table("Order")]
    public class Order
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int OrderId { get; set; }

        [Required]
        public int UserId { get; set; }

        //[Required]
        public DateTime OrderDate { get; set; }

        //[Required]
        public float Total { get; set; }

        public string Transaction { get; set; }

        //[Required]
        public string PaymentStatus { get; set; } 

        //[Required]
        public string Address { get; set; }

        public string Name { get; set; }

        //[Required]
        public string Phone { get; set; }

        //[Required]
        public string DeliveryStatus { get; set; } = Constant.status[0];

        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        public virtual ICollection<OrderDetail> OrderDetails { get; set; }

    }
}
