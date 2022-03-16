using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WatchWebsite_TLCN.Entities;
using WatchWebsite_TLCN.Intefaces;
using WatchWebsite_TLCN.Models;
using WatchWebsite_TLCN.Utilities;

namespace WatchWebsite_TLCN.Repository
{
    public class ProductsRepository : IProductsRepository
    {
        private readonly MyDBContext _context;

        public ProductsRepository(MyDBContext context)
        {
            _context = context;
        }

        public IEnumerable<Product> GetPopularProduct()
        {
            //Tinh so luong ban theo tung san pham

            var product = (from p in _context.Products
                           join c in (from orderDetails in _context.OrderDetails
                                      group orderDetails by orderDetails.ProductId into g
                                      select new CountSellProduct()
                                      {
                                          ProductId = g.Key,
                                          Count = g.Sum(x => x.Count)
                                      })
                                      on p.Id equals c.ProductId
                           orderby c.Count descending
                           select p).Include(p => p.Brand).Take(10).ToList();

            return product;
        }

        public ProductDetail GetProductDetail(string id)
        {

            var productDetail = (from p in _context.Products
                                 join b in _context.Brands on p.BrandId equals b.BrandId
                                 join s in _context.Sizes on p.SizeId equals s.SizeId
                                 join w in _context.WaterResistances on p.WaterResistanceId equals w.WaterId
                                 join m in _context.Materials on p.MaterialId equals m.MaterialId
                                 join e in _context.Enegies on p.EnergyId equals e.EnergyId
                                 where p.Id == id
                                 select new ProductDetail()
                                 {
                                     Id = p.Id,
                                     Name = p.Name,
                                     //Price = p.Price,
                                     Amount = p.Amount,
                                     Image = p.Image,
                                     Description = p.Description,
                                     Brand = b.Name,
                                     Gender = p.Gender,
                                     Material = m.MaterialValue,
                                     WaterResistance = w.WaterValue,
                                     Size = s.SizeValue,
                                     Energy = e.EnergyValue
                                 });
            return productDetail.FirstOrDefault();
        }
    }
}
