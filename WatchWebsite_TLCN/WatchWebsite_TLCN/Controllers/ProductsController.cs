using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
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
        private readonly MyDBContext _context;

        public ProductsController(IUnitOfWork unitOfWork, IProductsRepository product, IMapper mapper, MyDBContext context)
        {
            _unitOfWork = unitOfWork;
            _product = product;
            _mapper = mapper;
            _context = context;
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
                includes: new List<string> { "Brand", "Size", "Energy", "GetWaterResistance", "Material", "SubImages" });

            if (product == null)
            {
                return NotFound();
            }

            //ProductDetail productDetail = await GetProductDetailLogicAsync(product);
            return product;
        }

        [HttpGet]
        [Route("FullTextSearch")]
        public async Task<IActionResult> FullTextSearch(string text)
        {

            string[] words = text.Split(' ');
            string textsearch = words[0];
            foreach (var word in words)
            {
                if (word != "")
                    textsearch = textsearch + " OR (" + word + ")";
            }
            var results = _context.Products.FromSqlRaw("SELECT a.* FROM[dbo].[Product] AS a FULL JOIN Brand b ON a.BrandId = b.BrandId FULL JOIN CONTAINSTABLE(Product, (Name, Description), '" + textsearch + "') AS TBL ON a.Id = TBL.[KEY] FULL JOIN CONTAINSTABLE(Brand, Name, '" + textsearch + "') akt ON b.BrandId = akt.[Key] WHERE TBL.RANK is not null OR  akt.RANK is not null ORDER BY(TBL.RANK + akt.RANK) / 2 DESC, TBL.RANK DESC, akt.RANK DESC").ToList();
            var productDTO = _mapper.Map<List<ProductSearchResponse>>(results);
            return Ok(productDTO);
        }


        //[Authorize(Roles = "Admin,Employee")]
        [HttpPut]
        public async Task<IActionResult> PutProduct(PutProduct value)
        {
            _unitOfWork.Products.Update(value.product);

            var lstSubImage = await _unitOfWork.SubImages.GetAll(p => p.ProductId == value.product.Id);
            if (lstSubImage.Count() > 0)
            {
                foreach (var item in lstSubImage)
                    await _unitOfWork.SubImages.Delete(item.Id);
            }
            try
            {
                foreach (var item in value.subImages)
                {
                    SubImage image = new SubImage();
                    image.Image = item;
                    image.ProductId = value.product.Id;
                    await _unitOfWork.SubImages.Insert(image);
                }
                await _unitOfWork.Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!(await ProductExists(value.product.Id)))
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
        public async Task<ActionResult<Product>> PostProduct(PutProduct value)
        {
            await _unitOfWork.Products.Insert(value.product);

            try
            {
                await _unitOfWork.Save();

                var subImages = await _unitOfWork.SubImages.GetAll(expression: si => si.ProductId == value.product.Id);

                _unitOfWork.SubImages.DeleteRange(subImages);

                foreach (string item in value.subImages)
                {
                    SubImage image = new SubImage();
                    image.ProductId = value.product.Id;
                    image.Image = item;
                    await _unitOfWork.SubImages.Insert(image);
                }

                await _unitOfWork.Save();
            }
            catch (DbUpdateException)
            {
                if (!(await ProductExists(value.product.Id)))
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
                    var lstSubImage = await _unitOfWork.SubImages.GetAll(p => p.ProductId == item);
                    var lstOrder = await _unitOfWork.OrderDetails.GetAll(p => p.ProductId == item);
                    var lstCart = await _unitOfWork.Carts.GetAll(p => p.ProductId == item);
                    if (lstOrder.Count() == 0 && lstCart.Count()==0)
                    {
                        await _unitOfWork.Products.Delete<string>(item);

                        if (lstSubImage.Count() > 0)
                        {
                            foreach (var subiamge in lstSubImage)
                                await _unitOfWork.SubImages.Delete(subiamge.Id);
                        }
                    }
                    else
                        return BadRequest();
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
                includes: new List<string> { "Brand" },
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

            if (filter.Search.Trim() != "")
            {
                string[] words = filter.Search.Split(' ');
                string textsearch = words[0];
                foreach (var word in words)
                {
                    if (word != "")
                        textsearch = textsearch + " OR (" + word + ")";
                }
                var results = _context.Products.FromSqlRaw("SELECT a.* FROM[dbo].[Product] AS a FULL JOIN Brand b ON a.BrandId = b.BrandId FULL JOIN CONTAINSTABLE(Product, (Name, Description), '" + textsearch + "') AS TBL ON a.Id = TBL.[KEY] FULL JOIN CONTAINSTABLE(Brand, Name, '" + textsearch + "') akt ON b.BrandId = akt.[Key] WHERE TBL.RANK is not null OR  akt.RANK is not null ORDER BY(TBL.RANK + akt.RANK) / 2 DESC, TBL.RANK DESC, akt.RANK DESC").ToList();
                var productDTO = _mapper.Map<List<ProductSearchResponse>>(results);
                if (productDTO.Count > 0)
                {
                    var lstIDProduct = new List<String> { };
                    foreach (var item in productDTO)
                    {
                        lstIDProduct.Add(item.Id);
                    }
                    expression = expression.And(p => lstIDProduct.Contains(p.Id));
                }
            }

            // Filter search
            //expression = expression.And(p => p.Name.Contains(filter.Search));

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

            if (filter.Brands != null && filter.Brands.Length != 0)
            {
                foreach (var item in result)
                {
                    if (CheckBrands(item, filter.Brands))
                    {
                        productList.Add(item);
                    }
                }
            }
            else
            {
                productList = result;
            }

            Pagination pagination = new Pagination();
            var listProductPaging = productList.Skip((currentPage - 1) * pagination.ItemsPerPage).Take(pagination.ItemsPerPage);

            var listProductDTO = _mapper.Map<List<ProductResponseDTO>>(listProductPaging);


            return Ok(new
            {
                Products = listProductDTO,
                CurrentPage = currentPage,
                TotalPage = Math.Ceiling((double)productList.Count / pagination.ItemsPerPage)
            });
        }

        private bool CheckBrands(Product product, string[] filter)
        {
            foreach (var f in filter)
            {
                if (f == product.Brand.Name)
                {
                    return true;
                }
            }
            return false;
        }

        [HttpGet("senddata")]
        public async Task<IActionResult> SendProductsToRecom()
        {
            //string apikey = "0f3f519d372126a2fae86f0ff3723f61";
            string apikey = "2e0894b7fa55d7060d50f6101f713de9";
            var result = (from p in _context.Products
                          select new
                          {
                              p.Id,
                              p.Name,
                              p.Amount,
                              p.Price,
                              p.Description,
                              p.Sold,
                              p.BrandId,
                              p.Gender,
                              p.MaterialId,
                              p.WaterResistanceId,
                              p.SizeId,
                              p.EnergyId,
                          }).ToList();

            //var result = await _unitOfWork.Products.GetAll();
            var json = JsonConvert.SerializeObject(result);
            var data = new StringContent(json, Encoding.UTF8, "application/json");
            var url = "https://recom.fpt.vn/api/v0.1/recommendation/dataset/data/overwrite";
            using var client = new HttpClient();
            client.DefaultRequestHeaders.Add("Authorization", apikey);
            client.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json"));
            var response = await client.PostAsync(url, data);
            return Ok();
        }

        [HttpGet("getRecom")]
        public async Task<IActionResult> GetProductRecom(string productId)
        {
            string restApi = "https://recom.fpt.vn/api/v0.1/recommendation/api/result/getResult/330?input={itemId}&key=ECr16CLWjgNRmSbrI1wrMQJB53tYanAuV2mLhYyVv7aD4eNVWdCA1iNyZUlfz6f9OLj5SgxfC9UDmxatl7GQrjQy5j1RJGSEdlr2";
            restApi = restApi.Replace("{itemId}", productId);
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    HttpResponseMessage response = await client.GetAsync(restApi);

                    if (response.IsSuccessStatusCode)
                    {
                        var ObjResponse = response.Content.ReadAsStringAsync().Result;
                        var data = JsonConvert.DeserializeObject<Dictionary<string, object>>(ObjResponse);
                        var lstProduct = JsonConvert.DeserializeObject<List<Product>>(data["data"].ToString());
                        List<String> lstID = new List<string>();
                        foreach (var item in lstProduct)
                        {
                            lstID.Add(item.Id);
                        }

                        var resullt = await _unitOfWork.Products.GetAll(p => lstID.Contains(p.Id));
                        return Ok(resullt);
                    }
                    else
                    {
                        Console.Write("Failure");
                        return BadRequest("Dont have product");
                    }
                }
            }
            catch (Exception e)
            {
                throw e;
            }

        }

        [HttpGet("sendProductUser")]
        public async Task<IActionResult> SendProductsUserToRecom()
        {
            string apikey = "2e0894b7fa55d7060d50f6101f713de9";
            //var result = (from users in _context.Users
            //              from mappings in _context.Rates
            //                   .Where(mapping => mapping.UserId == users.Id)
            //                   .DefaultIfEmpty() // <== makes join left join
            //              from groups in _context.Products
            //                   .Where(gruppe => gruppe.Id == mappings.ProductId)
            //                   .DefaultIfEmpty() // <== makes join left join
            //              select new
            //              {
            //                  UserId = users.Id,
            //                  Value = mappings.Value,
            //                  ProductId = groups.Id == null ? "null" : groups.Id
            //              }).ToList();

            var result = (from u in _context.UserTrackings
                          select new
                          {
                              UserId = u.Cookie,
                              ProductId = u.ProductId,
                              Value = Convert.ToInt32(u.ClickDetail * 1 + u.ClickCart * 5 + u.Order * 8 + u.Time * 1)
                          }).ToList();

            //var result = await _unitOfWork.Products.GetAll();
            var json = JsonConvert.SerializeObject(result);
            var data = new StringContent(json, Encoding.UTF8, "application/json");
            var url = "https://recom.fpt.vn/api/v0.1/recommendation/dataset/data1/overwrite";
            using var client = new HttpClient();
            client.DefaultRequestHeaders.Add("Authorization", apikey);
            client.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json"));
            var response = await client.PostAsync(url, data);
            return Ok();
        }


        [HttpGet("getRecomUser")]
        public async Task<IActionResult> GetProductUserRecom(string cookie)
        {
            string restApi = "https://recom.fpt.vn/api/v0.1/recommendation/api/result/getResult/359?input={itemId}&key=ZbB2O5szTfWnLV7qVihCsb20gSrsWlQS3Vf1QB89Rzrx6D0GfAzMtYMDAzu3m6ATBBo7RH369ll73qEBsPMr3MeLxM19H4Hl1iTO";
            restApi = restApi.Replace("{itemId}", cookie);
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    HttpResponseMessage response = await client.GetAsync(restApi);

                    if (response.IsSuccessStatusCode)
                    {
                        var ObjResponse = response.Content.ReadAsStringAsync().Result;
                        var data = JsonConvert.DeserializeObject<Dictionary<string, object>>(ObjResponse);
                        if (data["message"].ToString() == "Success")
                        {
                            var lstId = JsonConvert.DeserializeObject<List<tmpRecUser>>(data["data"].ToString());
                            List<string> lstID = new List<string>();
                            foreach (var item in lstId)
                            {
                                lstID.Add(item.Id);
                            }
                            var resullt = await _unitOfWork.Products.GetAll(p => lstID.Contains(p.Id));
                            return Ok(resullt);
                        }
                        return BadRequest("Not found data");
                    }
                    else
                    {
                        return BadRequest("Dont have product");
                    }
                }
            }
            catch (Exception e)
            {
                throw e;
            }

        }

    }

    public class tmpRecUser
    {
        public string Id { get; set; }
    }
}