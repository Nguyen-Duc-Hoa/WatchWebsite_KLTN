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
        public async Task<ActionResult<tmpUserTracking>> AddEditUserTracking(tmpUserTracking model)
        {
            try
            {
                UserTracking newTrac = new UserTracking()
                {
                    Cookie = model.Cookie,
                    ProductId = model.ProductId,
                    ClickCart = 0,
                    ClickDetail = 0,
                    Order = 0,
                    Time =0

                };

                UserTracking userTrac = await _unitOfWork.UserTrackings.Get(p => p.Cookie == model.Cookie && p.ProductId == model.ProductId);
                if (userTrac != null)
                {
                    newTrac = userTrac;
                }

                switch (model.Behavior)
                {
                    case "Order":
                        newTrac.Order += 1;
                        break;
                    case "ClickDetail":
                        newTrac.ClickDetail += 1;
                        break;
                    case "ClickCart":
                        newTrac.ClickCart += 1;
                        break;
                    case "ViewDetail":
                        newTrac.Time += 1;
                        break;
                    default:
                        break;
                }

                if(userTrac == null)
                {
                    await _unitOfWork.UserTrackings.Insert(newTrac);
                }
                else
                {
                    _unitOfWork.UserTrackings.Update(newTrac);
                }
                await _unitOfWork.Save();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
            return Ok();


        }

    }

    public class tmpUserTracking
    {
        public string Cookie { get; set; }
        public string ProductId { get; set; }
        public string Behavior { get; set; }
    }
}
