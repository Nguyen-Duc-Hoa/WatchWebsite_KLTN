using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WatchWebsite_TLCN.DTO;
using WatchWebsite_TLCN.Entities;
using WatchWebsite_TLCN.Intefaces;

namespace WatchWebsite_TLCN.Repository
{
    public class UserOrderRepository : IUserOrder
    {
        private readonly MyDBContext _context;
        public UserOrderRepository(MyDBContext context)
        {
            _context = context;
        }
        public IEnumerable<Order> GetByUser(int userid)
        {
            var order = _context.Orders.Where(x => x.UserId == userid && x.DeliveryStatus == "Complete").AsQueryable();
            return order;
        }

        public IEnumerable<OrderDetailDTO> GetOrderDetails(int orderid)
        {
            var orderDetail = (from o in _context.OrderDetails
                               join p in _context.Products on o.ProductId equals p.Id
                               join b in _context.Brands on p.BrandId equals b.BrandId
                               where o.OrderId == orderid
                               select new OrderDetailDTO
                               {
                                   OrderId = o.OrderId,
                                   ProductId = o.ProductId,
                                   ProductName = o.ProductName,
                                   Brand = b.Name,
                                   Count = o.Count,
                                   Price = o.Price,
                                   Image = p.Image
                               }).ToList();

            return orderDetail;
        }

        public Order UpdateStatus(int orderid)
        {
            var order = _context.Orders.Where(x => x.OrderId == orderid).FirstOrDefault();
            string status = null;

            if (order != null)
            {
                status = order.DeliveryStatus.ToString();
                switch (status)
                {
                    case "Waiting":
                        status = "Confirmed";
                        break;
                    case "Confirmed":
                        status = "Delivering";
                        break;
                    case "Delivering":
                        status = "Complete";
                        break;
                    case "Complete":
                        status = null;
                        break;
                    default:
                        status = null;
                        break;                       
                }

                if (status != null)
                {
                    try
                    {
                        (from p in _context.Orders
                         where p.OrderId == orderid
                         select p).ToList()
                                .ForEach(x => x.DeliveryStatus = status);

                        _context.SaveChanges();
                        
                        
                        return order;
                    }
                    catch
                    {
                        return null;
                    }
                    
                }
                
            }
            return null;

        }
    }
}
