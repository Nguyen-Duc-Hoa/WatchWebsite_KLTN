using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WatchWebsite_TLCN.DTO;
using WatchWebsite_TLCN.Entities;
using WatchWebsite_TLCN.Intefaces;
using WatchWebsite_TLCN.IRepository;

namespace WatchWebsite_TLCN.Repository
{
    public class CartsRepository : ICartsRepository
    {
        private readonly MyDBContext _context;
        private readonly IMapper _mapper;

        public CartsRepository(MyDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public IEnumerable<CartDTO> GetCart(int userId)
        {

            var cartItem = (from p in _context.Products
                            join c in _context.Carts on p.Id equals c.ProductId
                            where c.UserId == userId
                            select new CartDTO()
                            {
                                Id = p.Id,
                                Name = p.Name,
                                Image = p.Image,
                                Price = c.Count * p.Price,
                                Quantity = c.Count,
                                BrandName = p.Brand.Name,
                                Amount = p.Amount
                            }).ToList();
                              
            return cartItem;
        }

        public bool AddToCart(Cart cart)
        {
            //chua co san pham trong cart thi them san pham
            if(!ProductExists(cart))
            {
                if(CheckQuantity(cart))
                {
                    _context.Carts.Add(cart);
                    return Save();
                }
            }
            //Co san pham trong cart thi tang so luong
            else
            {

                var cartItem = _context.Carts.Find(cart.UserId, cart.ProductId);
                if (cartItem != null)
                {
                    cart.Count += cartItem.Count;
                    //_context.Carts.Update(cart);
                    //return Save();
                    if (CheckQuantity(cart))
                    {
                        (from p in _context.Carts
                         where (p.UserId == cart.UserId) && (p.ProductId == cart.ProductId)
                         select p).ToList()
                                        .ForEach(x => x.Count = cart.Count);
                        return Save();
                    }
                    
                }
            }
            return false;
            
        }

        public bool UpdateQuantity(Cart cart)
        {
            Cart cartdb = _context.Carts.FirstOrDefault(c => c.ProductId == cart.ProductId && c.UserId == cart.UserId);
            if(cart.Count == 0)
            {
                _context.Carts.Remove(cartdb);
            }
            else
            {
                var product = _context.Products.FirstOrDefault(p => p.Id == cart.ProductId);
                if(cart.Count <= product.Amount)
                {
                    cartdb.Count = cart.Count;
                    _context.Carts.Update(cartdb);
                }
            }
            return Save();

        }

        public bool ProductExists(Cart cart)
        {
            bool value = _context.Carts.Any(a => a.UserId == cart.UserId && a.ProductId == cart.ProductId);
            return value;
        }

        public bool CheckQuantity(Cart cart)
        {
            try
            {
                var product = _context.Products.Where(x => x.Id == cart.ProductId).FirstOrDefault();
                if (cart.Count <= product.Amount) return true;
            }
            catch
            { }

            return false;
        }

        public bool Save()
        {
            return _context.SaveChanges() > 0 ? true: false;
        }
    }
}
