using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WatchWebsite_TLCN.Entities;
using WatchWebsite_TLCN.IRepository;

namespace WatchWebsite_TLCN.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubImagesController : ControllerBase
    {

        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public SubImagesController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        // GET: api/Products
        [Route("Get")]
        [HttpGet]
        public async Task<List<SubImage>> GetSubImageAsync(string productId)
        {
            List<SubImage> lstSubImage = await _unitOfWork.SubImages.GetAll(
                expression: x => x.ProductId == productId);
            return lstSubImage;
        }
    }
}
