using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WatchWebsite_TLCN.Entities;
using WatchWebsite_TLCN.IRepository;

namespace WatchWebsite_TLCN.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserTrackingController : ControllerBase
    {

        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly MyDBContext _context;

        public UserTrackingController(IUnitOfWork unitOfWork, IMapper mapper, MyDBContext context)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _context = context;
        }

        [HttpPost]
        public async Task <ActionResult<UserTracking>> AddEditUserTracking(UserTracking model)
        {
            try
            {
                UserTracking userTrac = await _unitOfWork.UserTrackings.Get(p => p.Cookie == model.Cookie && p.ProductId == model.ProductId);
                if (userTrac == null)
                {
                    await _unitOfWork.UserTrackings.Insert(model);
                }
                else
                {
                    userTrac.Order += model.Order;
                    userTrac.Time += model.Time;
                    userTrac.ClickCart += model.ClickCart;
                    userTrac.ClickDetail += model.ClickDetail;

                    _unitOfWork.UserTrackings.Update(userTrac);
                }
                await _unitOfWork.Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                return BadRequest();
            }
            return Ok();


        }
    }
}
