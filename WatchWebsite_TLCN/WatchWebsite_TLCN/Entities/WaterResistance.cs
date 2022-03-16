using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace WatchWebsite_TLCN.Entities
{
    [Table("WaterResistance")]
    public class WaterResistance
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int WaterId { get; set; }
        [Required]
        public string WaterValue { get; set; }

        public virtual ICollection<Product> Products { get; set; }
    }
}
