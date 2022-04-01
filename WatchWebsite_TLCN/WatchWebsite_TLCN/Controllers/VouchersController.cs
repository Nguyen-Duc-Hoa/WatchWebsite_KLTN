using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;
using WatchWebsite_TLCN.Entities;
using WatchWebsite_TLCN.IRepository;
using Newtonsoft.Json;
using WatchWebsite_TLCN.Models;
using WatchWebsite_TLCN.DTO;
using AutoMapper;
using WatchWebsite_TLCN.Intefaces;
using Microsoft.AspNetCore.Authorization;


namespace WatchWebsite_TLCN.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VouchersController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        

        public VouchersController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<Voucher>>> GetVoucher()
        {
            DateTime now = DateTime.Now;

            var lstVoucher = await _unitOfWork.Vouchers.GetAll(
                expression: p => p.StartDate <= now && p.EndDate >= now && p.State == true);
            if (lstVoucher == null) return NotFound();

            return lstVoucher;
        }

        [HttpGet]
        [Route("GetVouchers")]
        public async Task<IActionResult> GetVouchers(int currentPage)
        {
            var result = await _unitOfWork.Vouchers.GetAllWithPagination(
                expression: null,
                orderBy: x => x.OrderBy(a => a.VoucherId),
                pagination: new Pagination { CurrentPage = currentPage }
                );

            List<Voucher> listVoucher = new List<Voucher>();
            foreach(var item in result.Item1)
            {
                listVoucher.Add(item);
            }
            return Ok(new
            {
                Vouchers = listVoucher,
                CurrentPage = result.Item2.CurrentPage,
                TotalPage = result.Item2.TotalPage
            });
        }

        [HttpGet("Detail")]
        public async Task<IActionResult> GetDetail(int voucherId)
        {
            try
            {
                Voucher voucher = await _unitOfWork.Vouchers.Get(expression: v => v.VoucherId == voucherId);
                return Ok(voucher);
            }
            catch
            {
                return StatusCode(500);
            }
        }

        [HttpPost]
        public async Task<IActionResult> PostVoucher(Voucher voucher)
        {
            try
            {
                await _unitOfWork.Vouchers.Insert(voucher);
                await _unitOfWork.Save();
                return Ok();
            }
            catch
            {
                return StatusCode(500);
            }
        }

        [HttpPut]
        public async Task<IActionResult> PutVoucher(Voucher voucher)
        {
            try
            {
                _unitOfWork.Vouchers.Update(voucher);
                await _unitOfWork.Save();
                return Ok();
            }
            catch
            {
                return StatusCode(500);
            }
        }
    }
}
