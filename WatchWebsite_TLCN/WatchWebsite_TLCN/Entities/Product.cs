using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace WatchWebsite_TLCN.Entities
{
    [Table("Product")]
    public class Product
    {
        [Key]
        public string Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public int Amount { get; set; }

        [Required]
        public float Price { get; set; }

        //[Required]
        public byte[] Image { get; set; }

        public string Description { get; set; }

        public int Sold { get; set; } = 0;

        //[Required]
        public int BrandId { get; set; }

        //[Required]
        public int Gender { get; set; }

        //[Required]
        public int MaterialId { get; set; }

        //[Required]
        public int WaterResistanceId { get; set; }

        //[Required]
        public int SizeId { get; set; }

        //[Required]
        public int EnergyId { get; set; }

        [ForeignKey("BrandId")]
        public virtual Brand Brand { get; set; }

        [ForeignKey("MaterialId")]
        public virtual Material Material { get; set; }

        [ForeignKey("WaterResistanceId")]
        public virtual WaterResistance GetWaterResistance { get; set; }

        [ForeignKey("SizeId")]
        public virtual Size Size { get; set; }

        [ForeignKey("EnergyId")]
        public virtual Energy Energy { get; set; }

        public virtual ICollection<Cart> Carts { get; set; }
        public virtual ICollection<OrderDetail> OrderDetails { get; set; }



    }
}
