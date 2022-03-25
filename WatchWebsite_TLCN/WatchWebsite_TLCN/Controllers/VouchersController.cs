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
    }
}
