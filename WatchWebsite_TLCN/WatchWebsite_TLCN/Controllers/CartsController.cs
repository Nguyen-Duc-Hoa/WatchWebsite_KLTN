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
using WatchWebsite_TLCN.Intefaces;
using WatchWebsite_TLCN.IRepository;

namespace WatchWebsite_TLCN.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly MyDBContext _context;
        private readonly IMapper _mapper;
        private readonly ICartsRepository _cart;

        public CartsController(IUnitOfWork unitOfWork, IMapper mapper, ICartsRepository cart, MyDBContext context)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _cart = cart;
            _context = context;
        }

        // GET: api/Carts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cart>>> GetCarts()
        {
            return await _unitOfWork.Carts.GetAll();
        }

        // GET: api/Carts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Cart>> GetCart(int id)
        {
            var cart = await _unitOfWork.Carts.Get(p => p.UserId == id);

            if (cart == null)
            {
                return NotFound();
            }

            return cart;
        }

        // PUT: api/Carts/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCart(int id, Cart cart)
        {
            if (id != cart.UserId)
            {
                return BadRequest();
            }

            _unitOfWork.Carts.Update(cart);
            try
            {
                await _unitOfWork.Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await CartExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Carts
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Cart>> PostCart(Cart cart)
        {
            _ = _unitOfWork.Carts.Insert(cart);
            try
            {
                await _unitOfWork.Save();
            }
            catch (DbUpdateException)
            {
                if (await CartExists(cart.UserId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetCart", new { id = cart.UserId }, cart);
        }

        // DELETE: api/Carts/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Cart>> DeleteCart(int id)
        {
            var cart = await _unitOfWork.Carts.Get(p => p.UserId == id);
            if (cart == null)
            {
                return NotFound();
            }

            await _unitOfWork.Carts.Delete(id);
            await _unitOfWork.Save();

            return cart;
        }

        private Task<bool> CartExists(int id)
        {
            return _unitOfWork.Carts.IsExist<int>(id);
        }

        [HttpGet]
        [Authorize]
        [Route("GetCart/{userId}")]
        public IEnumerable<CartDTO> GetByUser(int userId)
        {
            return _cart.GetCart(userId);
        }

        [HttpPost]
        [Route("AddToCart")]
        [Authorize]
        public ActionResult AddToCart([FromBody] Cart cart)
        {
            if (_cart.AddToCart(cart))
                return Ok();
            return BadRequest("Something was wrong");
        }

        [HttpPut]
        [Route("UpdateQuantity")]
        [Authorize]
        public async Task<IActionResult> UpdateQuantity(Cart cart)
        {
            if (_cart.UpdateQuantity(cart))
                return Ok();
                        return BadRequest("Can not increase quantity");
        }

        
    }

}

