using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WatchWebsite_TLCN.DTO;
using WatchWebsite_TLCN.Entities;
using WatchWebsite_TLCN.Intefaces;
using WatchWebsite_TLCN.IRepository;
using WatchWebsite_TLCN.Models;
using WatchWebsite_TLCN.Utilities;

namespace WatchWebsite_TLCN.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IProductsRepository _product;

        public ProductsController(IUnitOfWork unitOfWork, IProductsRepository product, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _product = product;
            _mapper = mapper;
        }

        // GET: api/Products
        [Route("GetAll")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _unitOfWork.Products.GetAll();
        }

        // GET: api/Products/5
        [HttpGet]
        public async Task<ActionResult<Product>> GetProduct(string id)
        {
            var product = await _unitOfWork.Products.Get(p => p.Id == id);
            
            if (product == null)
            {
                return NotFound();
            }

            return product;
        }

        [HttpGet]
        [Route("ProductDetail")]
        public async Task<ActionResult<Product>> GetProductDetail(string id)
        {
            var product = await _unitOfWork.Products.Get(
                expression: p => p.Id == id, 
                includes: new List<string> { "Brand", "Size", "Energy", "GetWaterResistance", "Material" }) ;

            if (product == null)
            {
                return NotFound();
            }

            return product;
        }


        //[Authorize(Roles = "Admin,Employee")]
        [HttpPut]
        public async Task<IActionResult> PutProduct(Product product)
        {
            _unitOfWork.Products.Update(product);

            try
            {
                await _unitOfWork.Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!(await ProductExists(product.Id)))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return Ok();
        }

        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct(Product product)
        {
            await _unitOfWork.Products.Insert(product);
            try
            {
                await _unitOfWork.Save();
            }
            catch (DbUpdateException)
            {
                if (!(await ProductExists(product.Id)))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Ok();
        }

        // DELETE: api/Products/Delete/5
        [HttpDelete]
        [Route("Delete")]
        public async Task<ActionResult<Product>> DeleteProduct(List<string> id)
        {
            try
            {
                foreach (string item in id)
                {
                    await _unitOfWork.Products.Delete<string>(item);
                }
                await _unitOfWork.Save();
                return Ok();
            }
            catch
            {
                return BadRequest("Something was wrong");
            }
        }

        private Task<bool> ProductExists(string id)
        {
            return _unitOfWork.Products.IsExist<string>(id);
        }

        [HttpGet]
        [Route("PopularProduct")]
        public IEnumerable<ProductResponseDTO> GetPopularProducts()
        {
            var product = _product.GetPopularProduct().ToList();
            var productDTO = _mapper.Map<List<ProductResponseDTO>>(product);
            return productDTO;
        }

        // GET: /api/Products/SearchProducts&currentPage=1&searchKey=abc
        [HttpGet]
        [Route("Search")]
        public async Task<IActionResult> SearchProducts(int currentPage, string searchKey)
        {
            if (String.IsNullOrEmpty(searchKey)) searchKey = "";
            Expression<Func<Product, bool>> expression = null;
            expression = p => p.Name.Contains(searchKey);

            var result = await _unitOfWork.Products.GetAllWithPagination(
                expression: expression,
                orderBy: p => p.OrderBy(x => x.Name),
                includes: new List<string> { "Brand"},
                pagination: new Pagination { CurrentPage = currentPage });

            var listProductDTO = _mapper.Map<List<ProductResponseDTO>>(result.Item1);

            return Ok(new
            {
                Products = listProductDTO,
                CurrentPage = result.Item2.CurrentPage,
                TotalPage = result.Item2.TotalPage
            });
        }

        // POST: /api/Products&currentPage=1
        [HttpPost]
        [Route("FilterProduct")]
        public async Task<IActionResult> Filter(int currentPage, [FromBody] FilterProduct filter)
        {
            Expression<Func<Product, bool>> expression = PredicateBuilder.True<Product>();

            if (String.IsNullOrEmpty(filter.Search))
            {
                filter.Search = "";
            }

            // Filter search
            expression = expression.And(p => p.Name.Contains(filter.Search));

            // Specify Max, Min
            double[] limit = new double[2];
            limit[0] = 0;
            limit[1] = int.MaxValue;
            if (filter.Prices != null)
            {
                /*
                 * Ex:
                 * 30/90 (tu 30 toi 90)
                 * 90/200 (tu 90 toi 200)
                 * 200/-1 (lon hon 200)
                 */
                limit = Array.ConvertAll(filter.Prices.Split('-'), Double.Parse);
                if (limit[1] == -1)
                {
                    limit[1] = int.MaxValue;
                }
            }

            // Filter price
            if (filter.Prices != null)
            {
                expression = expression.And(p => p.Price > limit[0] && p.Price <= limit[1]);
            }

            // Filter gender (1: Male, 0: Female)
            if (filter.Gender != -1)
            {
                expression = expression.And(p => p.Gender == filter.Gender);
            }

            //Fitler sort by
            Func<IQueryable<Product>, IOrderedQueryable<Product>> orderBy = null;

            switch (filter.SortBy)
            {
                case Constant.alphabetically:
                    orderBy = p => p.OrderBy(x => x.Name);
                    break;
                case Constant.nonAlphabetically:
                    orderBy = p => p.OrderByDescending(x => x.Name);
                    break;
                case Constant.priceAscending:
                    orderBy = p => p.OrderBy(x => x.Price);
                    break;
                case Constant.priceDesending:
                    orderBy = p => p.OrderByDescending(x => x.Price);
                    break;
                default:
                    orderBy = p => p.OrderByDescending(x => x.Sold);
                    break;
            }

            var result = await _unitOfWork.Products.GetAll(
                expression: expression,
                orderBy: orderBy,
                includes: new List<String>() { "Brand" });

            List<Product> productList = new List<Product>();

            if(filter.Brands != null && filter.Brands.Length != 0 )
            {
                foreach(var item in result)
                {
                    if(CheckBrands(item, filter.Brands))
                    {
                        productList.Add(item);
                    }
                }
            }
            else
            {
                productList = result;
            }

            var listProductPaging = productList.Skip((currentPage - 1) * 5).Take(5);

            var listProductDTO = _mapper.Map<List<ProductResponseDTO>>(listProductPaging);


            return Ok(new
            {
                Products = listProductDTO,
                CurrentPage = currentPage,
                TotalPage = Math.Ceiling((double)productList.Count / 5)
            });
        }

        private bool CheckBrands(Product product, string[] filter)
        {
            foreach(var f in filter)
            {
                if(f == product.Brand.Name)
                {
                    return true;
                }
            }
            return false;
        }
    }
}