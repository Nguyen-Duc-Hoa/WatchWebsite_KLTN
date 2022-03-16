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
    public class MaterialsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public MaterialsController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        // GET: api/Materials
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetMaterials(int currentPage)
        {
            var result = await _unitOfWork.Materials.GetAllWithPagination(
                expression: null,
                orderBy: x => x.OrderBy(a => a.MaterialId),
                pagination: new Pagination { CurrentPage = currentPage }
                );

            var listMaterialDTO = _mapper.Map<List<MaterialDTO>>(result.Item1);

            return Ok(new
            {
                Materials = listMaterialDTO,
                CurrentPage = result.Item2.CurrentPage,
                TotalPage = result.Item2.TotalPage
            });
        }

        // GET: api/Materials/GetAll
        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> GetMaterials()
        {
            var result = await _unitOfWork.Materials.GetAll();
            var listMaeterialsDTO = _mapper.Map<List<MaterialDTO>>(result);
            return Ok(listMaeterialsDTO);
        }

        // GET: api/Materials/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Material>> GetMaterial(int id)
        {
            var material = await _unitOfWork.Materials.Get( x=>x.MaterialId == id);

            if (material == null)
            {
                return NotFound();
            }

            return material;
        }

        // PUT: api/Materials/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<IActionResult> PutMaterial(Material material)
        {
            _unitOfWork.Materials.Update(material);

            try
            {
                await _unitOfWork.Save();
                return Ok();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await MaterialExists(material.MaterialId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
        }

        // POST: api/Materials
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Material>> PostMaterial(Material material)
        {
            try
            {
                await _unitOfWork.Materials.Insert(material);
                await _unitOfWork.Save();
                return Ok();
            }
            catch
            {
                return StatusCode(500);
            }
        }

        // DELETE: api/Materials/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Material>> DeleteMaterial(int id)
        {
            var material = await _unitOfWork.Materials.Get(x=> x.MaterialId == id);
            if (material == null)
            {
                return NotFound();
            }

            await _unitOfWork.Materials.Delete(material);
            await _unitOfWork.Save();

            return material;
        }

        [HttpDelete]
        [Authorize(Roles = "Admin")]
        [Route("Delete")]
        public async Task<ActionResult<Brand>> DeleteMaterial(List<int> id)
        {
            try
            {
                foreach (int item in id)
                {
                    var material = await _unitOfWork.Materials.Get(b => b.MaterialId == item, new List<string> { "Products" });
                    if (material == null || material.Products.Count != 0)
                    {
                        return BadRequest("Something was wrong!");
                    }
                    await _unitOfWork.Materials.Delete<int>(item);
                }
                await _unitOfWork.Save();
                return Ok();
            }
            catch
            {
                return BadRequest("Something was wrong");
            }
        }


        private Task<bool> MaterialExists(int id)
        {
            return _unitOfWork.Materials.IsExist<int>(id);
        }
    }
}
