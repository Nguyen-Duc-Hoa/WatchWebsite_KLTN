using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WatchWebsite_TLCN.Entities;

namespace WatchWebsite_TLCN.IRepository
{
    public interface IUnitOfWork: IDisposable
    {
        IGenericRepository<Brand> Brands { get; }
        IGenericRepository<Cart> Carts { get; }
        IGenericRepository<Comment> Comments { get; }
        IGenericRepository<Energy> Energies { get; }
        IGenericRepository<Material> Materials { get; }
        IGenericRepository<OrderDetail> OrderDetails { get; }
        IGenericRepository<Order> Orders { get; }
        IGenericRepository<Product> Products { get; }
        IGenericRepository<Size> Sizes { get; }
        IGenericRepository<User> Users { get; }
        IGenericRepository<WaterResistance> WaterResistances { get; }
        IGenericRepository<Role> Roles { get; }
        IGenericRepository<User_Role> UserRole { get; }
        Task Save();
    }
}
