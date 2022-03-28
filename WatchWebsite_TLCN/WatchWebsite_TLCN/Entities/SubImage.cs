using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace WatchWebsite_TLCN.Entities
{
    public class SubImage
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string ProductId { get; set; }

        public string Image { get; set; }

        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; }
    }
}
