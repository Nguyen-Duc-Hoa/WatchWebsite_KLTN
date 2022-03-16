using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WatchWebsite_TLCN.DTO;
using WatchWebsite_TLCN.Intefaces;
using WatchWebsite_TLCN.Models;

namespace WatchWebsite_TLCN.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatisController : ControllerBase
    {
        private readonly IStatis _statis;

        public StatisController(IStatis statis)
        {
            _statis = statis;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        [Route("Chart1")]
        public IEnumerable<Chart1DTO> GetChart1([FromBody]Statis statis)
        {
            /*1: theo ngay
              2: theo thang
              3: theo nam
             */
            switch(statis.typeDate)
            {
                case "day":
                    return _statis.Statis1ByDate(statis);
                case "month":
                    return _statis.Statis1ByMonth(statis);
                case "year":
                    return _statis.Statis1ByYear(statis);

                default:
                    return null;
            }

        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        [Route("Chart2")]
        public IEnumerable<Chart2DTO> GetChart2([FromBody] Statis statis)
        {
            switch (statis.typeDate)
            {
                case "month":
                    return _statis.Statis2ByMonth(statis);
                case "year":
                    return _statis.Statis2ByYear(statis);

                default:
                    return null;
            }

        }
    }
}
