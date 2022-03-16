using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WatchWebsite_TLCN.DTO;
using WatchWebsite_TLCN.Entities;
using WatchWebsite_TLCN.IRepository;
using WatchWebsite_TLCN.Models;

namespace WatchWebsite_TLCN.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BrandsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public BrandsController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        // GET: api/Brands
        [Authorize(Roles = "Admin")]
        [Route("GetBrandsWithPagination")]
        [HttpGet]
        public async Task<ActionResult> GetBrands(int currentPage)
        {

            var result = await _unitOfWork.Brands.GetAllWithPagination(
                expression: null,
                orderBy: x => x.OrderBy(a => a.BrandId),
                pagination: new Pagination { CurrentPage = currentPage });
            List<Brand> list = new List<Brand>();

            foreach (var item in result.Item1)
            {
                list.Add(item);
            }
            var listBrandDTO = _mapper.Map<List<BrandDTO>>(list);

            return Ok(new
            {
                Brands = listBrandDTO,
                CurrentPage = result.Item2.CurrentPage,
                TotalPage = result.Item2.TotalPage
            });
        }

        // GET: api/Brands/GetAll
        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> GetBrands()
        {
            var result = await _unitOfWork.Brands.GetAll();
            var listBrandDTO = _mapper.Map<List<BrandDTO>>(result);
            return Ok(new { Brands = listBrandDTO });
        }


        // GET: api/Brands?id=5
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<Brand>> GetBrand(int id)
        {
            var brand = await _unitOfWork.Brands.Get(b => b.BrandId == id);
            if (brand == null)
            {
                return NotFound();
            }

            return brand;
        }

        // PUT: api/Brands/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<IActionResult> PutBrand(Brand brand)
        {
            _unitOfWork.Brands.Update(brand);

            try
            {
                await _unitOfWork.Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!(await BrandExists(brand.BrandId)))
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

        // POST: api/Brands
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Brand>> PostBrand(Brand brand)
        {
            try
            {
                await _unitOfWork.Brands.Insert(brand);
                await _unitOfWork.Save();

                return Ok();
            }
            catch
            {
                return StatusCode(500);
            }
        }

        // DELETE: api/Brands/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Brand>> DeleteBrand(int id)
        {
            var brand = await _unitOfWork.Brands.Get(b => b.BrandId == id);
            if (brand == null)
            {
                return NotFound();
            }

            await _unitOfWork.Brands.Delete(id);
            await _unitOfWork.Save();

            return brand;
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete ]
        [Route("Delete")]
        public async Task<ActionResult<Brand>> DeleteBrand(List<int> id)
        {
            foreach (int item in id)
            {
                try
                {
                    var brand = await _unitOfWork.Brands.Get(b => b.BrandId == item, new List<string> { "Products" });
                    if (brand == null || brand.Products.Count != 0)
                    {
                        return BadRequest("Something was wrong!");
                    }

                    await _unitOfWork.Brands.Delete(item);
                    await _unitOfWork.Save();
                }
                catch (Exception e)
                {
                    return BadRequest(e.ToString());
                }

            }

            return Ok();
        }

        private Task<bool> BrandExists(int id)
        {
            return _unitOfWork.Brands.IsExist<int>(id);
        }

    }
}
