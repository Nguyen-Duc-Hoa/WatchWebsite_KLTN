using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WatchWebsite_TLCN.Entities;
using WatchWebsite_TLCN.IRepository;

namespace WatchWebsite_TLCN.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        private bool disposedValue;
        private readonly MyDBContext _context;
        private IGenericRepository<Brand> _brands;
        private IGenericRepository<Cart> _carts;
        private IGenericRepository<Comment> _comments;
        private IGenericRepository<Energy> _energies;
        private IGenericRepository<Material> _materials;
        private IGenericRepository<OrderDetail> _orderDetails;
        private IGenericRepository<Order> _orders;
        private IGenericRepository<Product> _products;
        private IGenericRepository<Size> _sizes;
        private IGenericRepository<User> _users;
        private IGenericRepository<WaterResistance> _waterResistances;
        private IGenericRepository<Role> _roles;
        private IGenericRepository<User_Role> _userRole;
        public UnitOfWork(MyDBContext context)
        {
            _context = context;
        }
        public IGenericRepository<Role> Roles
        {
            get
            {
                if (_roles == null)
                {
                    _roles = new GenericRepository<Role>(_context);
                }
                return _roles;
            }
        }
        public IGenericRepository<User_Role> UserRole
        {
            get
            {
                if(_userRole == null)
                {
                    _userRole = new GenericRepository<User_Role>(_context);
                }
                return _userRole;
            }
        }
        public IGenericRepository<Brand> Brands
        {
            get
            {
                if(_brands == null)
                {
                    _brands = new GenericRepository<Brand>(_context);
                }
                return _brands;
            }
        }

        public IGenericRepository<Cart> Carts
        {
            get
            {
                if (_carts == null)
                {
                    _carts = new GenericRepository<Cart>(_context);
                }
                return _carts;
            }
        }

        public IGenericRepository<Comment> Comments
        {
            get
            {
                if (_comments == null)
                {
                    _comments = new GenericRepository<Comment>(_context);
                }
                return _comments;
            }
        }

        public IGenericRepository<Energy> Energies
        {
            get
            {
                if (_energies == null)
                {
                    _energies = new GenericRepository<Energy>(_context);
                }
                return _energies;
            }
        }

        public IGenericRepository<Material> Materials
        {
            get
            {
                if (_materials == null)
                {
                    _materials = new GenericRepository<Material>(_context);
                }
                return _materials;
            }
        }

        public IGenericRepository<OrderDetail> OrderDetails
        {
            get
            {
                if (_orderDetails == null)
                {
                    _orderDetails = new GenericRepository<OrderDetail>(_context);
                }
                return _orderDetails;
            }
        }

        public IGenericRepository<Order> Orders
        {
            get
            {
                if (_orders == null)
                {
                    _orders = new GenericRepository<Order>(_context);
                }
                return _orders;
            }
        }

        public IGenericRepository<Product> Products
        {
            get
            {
                if (_products == null)
                {
                    _products = new GenericRepository<Product>(_context);
                }
                return _products;
            }
        }

        public IGenericRepository<Size> Sizes
        {
            get
            {
                if (_sizes == null)
                {
                    _sizes = new GenericRepository<Size>(_context);
                }
                return _sizes;
            }
        }

        public IGenericRepository<User> Users
        {
            get
            {
                if (_users == null)
                {
                    _users = new GenericRepository<User>(_context);
                }
                return _users;
            }
        }

        public IGenericRepository<WaterResistance> WaterResistances
        {
            get
            {
                if (_waterResistances == null)
                {
                    _waterResistances = new GenericRepository<WaterResistance>(_context);
                }
                return _waterResistances;
            }
        }

        public async Task Save()
        {
            await _context.SaveChangesAsync();
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    // TODO: dispose managed state (managed objects)
                }

                // TODO: free unmanaged resources (unmanaged objects) and override finalizer
                // TODO: set large fields to null
                disposedValue = true;
            }
        }

        // // TODO: override finalizer only if 'Dispose(bool disposing)' has code to free unmanaged resources
        // ~UnitOfWork()
        // {
        //     // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
        //     Dispose(disposing: false);
        // }

        public void Dispose()
        {
            // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
            Dispose(disposing: true);
            GC.SuppressFinalize(this);
        }
    }
}
