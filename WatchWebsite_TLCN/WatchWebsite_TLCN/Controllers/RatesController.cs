using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WatchWebsite_TLCN.DTO;
using WatchWebsite_TLCN.IRepository;

namespace WatchWebsite_TLCN.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RatesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        public RatesController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        [HttpGet]
        public async Task<IActionResult> GetRate(int userId, string productId)
        {
            try
            {
                if (await IsAvailable(userId, productId))
                {
                    return Ok(new
                    {
                        ratable = true
                    });
                }

                var rates = await _unitOfWork.Rates.GetAll(expression: r => r.ProductId == productId);
                if (rates.Count == 0)
                {
                    return Ok(new
                    {
                        rateValue = 0,
                        numOfRate = rates.Count
                    });
                }
                var totalStar = 0;
                var numOfRate = 0;
                foreach (var item in rates)
                {
                    if (item.Value >= 0)
                    {
                        totalStar = totalStar + item.Value;
                        numOfRate++;
                    }
                }
                var finalRate = totalStar / rates.Count;
                return Ok(new
                {
                    rateValue = finalRate,
                    numOfRate = numOfRate
                });
            }
            catch
            {
                return StatusCode(500);
            }
        }
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Rate(RateDTO rateDTO)
        {
            try
            {
                var rate = await _unitOfWork.Rates.Get(expression: r => r.UserId == rateDTO.UserId
                 && r.ProductId == rateDTO.ProductId);
                rate.Value = rateDTO.Value;
                rate.IsRated = true;
                _unitOfWork.Rates.Update(rate);
                await _unitOfWork.Save();
                var rates = await _unitOfWork.Rates.GetAll(expression: r => r.ProductId == rateDTO.ProductId);
                if (rates.Count == 0)
                {
                    return Ok(new
                    {
                        rateValue = 0,
                        numOfRate = rates.Count
                    });
                }
                var totalStar = 0;
                var numOfRate = 0;
                foreach (var item in rates)
                {
                    if (item.Value >= 0)
                    {
                        totalStar = totalStar + item.Value;
                        numOfRate++;
                    }
                }
                var finalRate = Math.Ceiling((decimal)(totalStar / rates.Count));
                return Ok(new
                {
                    rateValue = finalRate,
                    numOfRate = numOfRate
                });
            }
            catch
            {
                return StatusCode(500);
            }
        }
        private async Task<bool> IsAvailable(int userId, string productId)
        {
            var rate = await _unitOfWork.Rates.Get(expression: r => r.UserId == userId
            && r.ProductId == productId && r.LimitDate > DateTime.Now
            && r.IsRated == false);
            if (rate != null)
            {
                return true;
            }
            return false;
        }
    }
}
