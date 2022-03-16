using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using WatchWebsite_TLCN.Entities;
using WatchWebsite_TLCN.IRepository;
using WatchWebsite_TLCN.Models;

namespace WatchWebsite_TLCN.Repository
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        private readonly MyDBContext _context;
        private readonly DbSet<T> _db;
        public GenericRepository(MyDBContext context)
        {
            this._context = context;
            this._db = _context.Set<T>();
        }

        public async Task Delete<A>(A id)
        {
            var entity = await _db.FindAsync(id);
            _db.Remove(entity);
        }

        public void DeleteRange(IEnumerable<T> entities)
        {
            _db.RemoveRange(entities);
        }

        public async Task<T> Get(Expression<Func<T, bool>> expression = null, List<string> includes = null)
        {
            IQueryable<T> query = _db;
            if(includes != null)
            {
                // Include foreign key
                foreach(var include in includes)
                {
                    query = query.Include(include);
                }
            }
            return await query.AsNoTracking().FirstOrDefaultAsync(expression);
        }

        public async Task<List<T>> GetAll(
            Expression<Func<T, bool>> expression = null, 
            Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null, 
            List<string> includes = null,
            bool isDescending = true)
        {
            IQueryable<T> query = _db;

            if(expression != null)
            {
                query = query.Where(expression);
            }

            if (includes != null)
            {
                // Include foreign key
                foreach (var include in includes)
                {
                    query = query.Include(include);
                }
            }

            if (orderBy != null)
            {
                query = orderBy(query);
            }

            // AsNoTracking : disconnect with context
            return await query.AsNoTracking().ToListAsync();
        }

        public async Task<Tuple<List<T>, Pagination>> GetAllWithPagination(
            Expression<Func<T, bool>> expression = null, 
            Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null, 
            List<string> includes = null, 
            Pagination pagination = null,
            bool isDescending = true)
        {
            IQueryable<T> query = _db;

            if (expression != null)
            {
                query = query.Where(expression);
            }

            if (includes != null)
            {
                foreach (var include in includes)
                {
                    query = query.Include(include);
                }
            }

            if (orderBy != null)
            {
                query = orderBy(query);
            }

            Pagination pagingInfo = new Pagination();
            int count = query.AsNoTracking().Count();
            if (pagination != null)
            {
                query = query.Skip((pagination.CurrentPage - 1) * pagination.ItemsPerPage).Take(pagination.ItemsPerPage);

                pagingInfo.CurrentPage = pagination.CurrentPage > 0 ? pagination.CurrentPage : 1;
                pagingInfo.TotalItem = count;
            }

            var list = await query.AsNoTracking().ToListAsync();

            return new Tuple<List<T>, Pagination>(list, pagingInfo);
        }

        public async Task Insert(T entity)
        {
            await _db.AddAsync(entity);
        }

        public async Task InsertRange(IEnumerable<T> entities)
        {
            await _db.AddRangeAsync(entities);
        }

        public async Task<bool> IsExist<A>(A id)
        {
            var entities = await _db.FindAsync(id);
            if(entities != null)
            {
                return true;
            }
            return false;
        }

        public void Update(T entity)
        {
            _db.Update(entity);
        }
    }
}
