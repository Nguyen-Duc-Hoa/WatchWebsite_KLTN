using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using WatchWebsite_TLCN.Models;

namespace WatchWebsite_TLCN.IRepository
{
    public interface IGenericRepository<T> where T: class
    {
        Task<Tuple<List<T>, Pagination>> GetAllWithPagination(
            Expression<Func<T, bool>> expression = null,
            Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
            List<string> includes = null,
            Pagination pagination = null,
            bool isDescending = true);

        Task<List<T>> GetAll(
            Expression<Func<T, bool>> expression = null,
            Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
            List<string> includes = null,
            bool isDescending = true);

        Task<T> Get(
            Expression<Func<T, bool>> expression = null,
            List<string> includes = null);

        Task Insert(T entity);
        Task InsertRange(IEnumerable<T> entities);
        Task Delete<A>(A id);
        void DeleteRange(IEnumerable<T> entities);
        void Update(T entity);
        Task<bool> IsExist<A>(A id);
    }
}
