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
    public class SizesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public SizesController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        // GET: api/Sizes
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetSizes(int currentPage)
        {
            var result = await _unitOfWork.Sizes.GetAllWithPagination(
                expression: null,
                orderBy: x => x.OrderBy(a => a.SizeId),
                pagination: new Pagination { CurrentPage = currentPage }
                );

            var listSizeDTO = _mapper.Map<List<SizeDTO>>(result.Item1);

            return Ok(new
            {
                Sizes = listSizeDTO,
                CurrentPage = result.Item2.CurrentPage,
                TotalPage = result.Item2.TotalPage
            });
        }

        // GET: api/Sizes/GetAll
        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> GetSizes()
        {
            var result = await _unitOfWork.Sizes.GetAll();
            var listSizesDTO = _mapper.Map<List<SizeDTO>>(result);
            return Ok(listSizesDTO);
        }

        // GET: api/Sizes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Size>> GetSize(int id)
        {
            var size = await _unitOfWork.Sizes.Get(x => x.SizeId == id);

            if (size == null)
            {
                return NotFound();
            }

            return size;
        }

        // PUT: api/Sizes/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<IActionResult> PutSize(Size size)
        {
            _unitOfWork.Sizes.Update(size);

            try
            {
                await _unitOfWork.Save();
                return Ok();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await SizeExists(size.SizeId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
        }

        // POST: api/Sizes
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Size>> PostSize(Size size)
        {
            try
            {
                await _unitOfWork.Sizes.Insert(size);
                await _unitOfWork.Save();
                return Ok();
            }
            catch
            {
                return StatusCode(500);
            }
        }

        // DELETE: api/Sizes/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Size>> DeleteSize(int id)
        {
            var size = await _unitOfWork.Sizes.Get(x => x.SizeId == id, new List<string> { "Products" });
            if (size == null)
            {
                return NotFound();
            }

            if (size.Products.Count != 0)
            {
                return BadRequest("Something was wrong");
            }

            await _unitOfWork.Sizes.Delete(id);
            await _unitOfWork.Save();

            return size;
        }

        [HttpDelete]
        [Authorize(Roles = "Admin")]
        [Route("Delete")]
        public async Task<ActionResult<Brand>> DeleteSize(List<int> id)
        {
            try
            {
                foreach (int item in id)
                {
                    var size = await _unitOfWork.Sizes.Get(x => x.SizeId == item, new List<string> { "Products" });
                    if (size.Products.Count != 0)
                    {
                        return BadRequest("Something was wrong");
                    }
                    await _unitOfWork.Sizes.Delete<int>(item);
                }
                await _unitOfWork.Save();
                return Ok();
            }
            catch
            {
                return BadRequest("Something was wrong");
            }
        }


        private Task<bool> SizeExists(int id)
        {
            return _unitOfWork.Sizes.IsExist<int>(id);
        }
    }
}
