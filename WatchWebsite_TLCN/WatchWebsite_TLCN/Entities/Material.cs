using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace WatchWebsite_TLCN.Entities
{
    [Table("Material")]
    public class Material
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MaterialId { get; set; }
        [Required]
        public string MaterialValue { get; set; }

        public virtual ICollection<Product> Products { get; set; }


    }
}
