using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
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
    public class WaterResistancesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public WaterResistancesController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        // GET: api/WaterResistances
        [HttpGet]
        public async Task<IActionResult> GetWaterResistances(int currentPage)
        {
            var result = await _unitOfWork.WaterResistances.GetAllWithPagination(
                expression: null,
                orderBy: x => x.OrderBy(a => a.WaterId),
                pagination: new Pagination { CurrentPage = currentPage }
                );
           
            var listWaterDTO = _mapper.Map<List<WaterResistancesDTO>>(result.Item1);

            return Ok(new
            {
                WaterRes = listWaterDTO,
                CurrentPage = result.Item2.CurrentPage,
                TotalPage = result.Item2.TotalPage
            });
        }

        // GET: api/WaterResistances/GetAll
        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> GetWaterResistances()
        {
            var result = await _unitOfWork.WaterResistances.GetAll();
            var listWaterResDTO = _mapper.Map<List<WaterResistancesDTO>>(result);
            return Ok(listWaterResDTO);
        }

        // GET: api/WaterResistances/5
        [HttpGet("{id}")]
        public async Task<ActionResult<WaterResistance>> GetWaterResistance(int id)
        {
            var waterResistance = await _unitOfWork.WaterResistances.Get(x => x.WaterId == id);

            if (waterResistance == null)
            {
                return NotFound();
            }

            return waterResistance;
        }

        // PUT: api/WaterResistances/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut]
        public async Task<IActionResult> PutWaterResistance(int id, WaterResistance waterResistance)
        {
            _unitOfWork.WaterResistances.Update(waterResistance);

            try
            {
                await _unitOfWork.Save();
                return Ok();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await WaterResistanceExists(waterResistance.WaterId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
        }

        // POST: api/WaterResistances
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<WaterResistance>> PostWaterResistance(WaterResistance waterResistance)
        {
            try
            {
                await _unitOfWork.WaterResistances.Insert(waterResistance);
                await _unitOfWork.Save();
                return Ok();
            }
            catch
            {
                return StatusCode(500);
            }
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(List<int> id)
        {
            try
            {
                foreach (int item in id)
                {
                    var waterRes = await _unitOfWork.WaterResistances.Get(b => b.WaterId == item, new List<string> { "Products" });
                    if (waterRes == null || waterRes.Products.Count != 0)
                    {
                        return BadRequest("Something was wrong!");
                    }
                    await _unitOfWork.WaterResistances.Delete<int>(item);
                }
                await _unitOfWork.Save();
                return Ok();
            }
            catch
            {
                return BadRequest("Something was wrong");
            }
        }

        private Task<bool> WaterResistanceExists(int id)
        {
            return _unitOfWork.WaterResistances.IsExist<int>(id);
        }
    }
}
