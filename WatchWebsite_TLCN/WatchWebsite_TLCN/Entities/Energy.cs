using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace WatchWebsite_TLCN.Entities
{
    [Table("Energy")]
    public class Energy
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int EnergyId { get; set; }

        [Required]
        public string EnergyValue { get; set; }

        public virtual ICollection<Product> Products { get; set; }

    }
}
