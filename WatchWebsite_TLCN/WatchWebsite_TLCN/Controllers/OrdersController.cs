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
using WatchWebsite_TLCN.Utilities;

namespace WatchWebsite_TLCN.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IUserOrder _userOrder;

        public OrdersController(IUnitOfWork unitOfWork, IMapper mapper, IUserOrder userOrder)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _userOrder = userOrder;
        }

        // GET: api/Orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Entities.Order>>> GetOrders()
        {
            return await _unitOfWork.Orders.GetAll();
        }

        // GET: api/Orders/GetOrdersWithPagination
        [Route("GetOrdersWithPagination")]
        [HttpGet]
        [Authorize(Roles = "Admin,Employee")]
        public async Task<ActionResult<Entities.Order>> GetOrder(int currentPage)
        {
            var result = await _unitOfWork.Orders.GetAllWithPagination(
                expression: null,
                orderBy: x => x.OrderByDescending(a => a.OrderDate),
                pagination: new Pagination { CurrentPage = currentPage }
                );
            return Ok(new
            {
                Orders = result.Item1,
                CurrentPage = result.Item2.CurrentPage,
                TotalPage = result.Item2.TotalPage
            });
        }

        // DELETE: api/Orders/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Entities.Order>> DeleteOrder(int id)
        {
            var order = await _unitOfWork.Orders.Get(o => o.OrderId == id);
            if (order == null)
            {
                return NotFound();
            }

            await _unitOfWork.Orders.Delete(id);
            await _unitOfWork.Save();

            return order;
        }

        // POST: /api/Orders/CreateOrder
        [HttpPost]
        [Authorize]
        [Route("CreateOrder")]
        public async Task<IActionResult> PostOrder(OrderDTO orderDTO)
        {
            try
            {
                float discount = 0;
                orderDTO.OrderDate = DateTime.Now.AddHours(7); ;
                var order = _mapper.Map<Entities.Order>(orderDTO);
                if(orderDTO.CodeVoucher != -1)
                {
                    var voucher = await _unitOfWork.Vouchers.Get(expression: v => v.VoucherId == orderDTO.CodeVoucher);
                    if(voucher != null)
                    {
                        discount = voucher.Discount;
                        order.VoucherName = voucher.Name;
                        order.Discount = voucher.Discount;
                    }
                }
                order.PaymentMethod = Constant.stripeMethod;
                order.Total = await CalculateOrderAmount(orderDTO.Products) / 100 - discount;

                // Create order
                await _unitOfWork.Orders.Insert(order);
                await _unitOfWork.Save();

                // Create order detail and update product sold, amound columns
                foreach (var item in orderDTO.Products)
                {
                    var product = await _unitOfWork.Products.Get(p => p.Id == item.Id);
                    product.Sold = product.Sold + item.Quantity;
                    product.Amount = product.Amount - item.Quantity;
                    _unitOfWork.Products.Update(product);

                    var orderDetail = new OrderDetail()
                    {
                        OrderId = order.OrderId,
                        ProductId = item.Id,
                        Count = item.Quantity,
                        Price = product.Price,
                        ProductName = product.Name
                    };
                    var rate = new Rate() { ProductId = item.Id, UserId = order.UserId };

                    await _unitOfWork.OrderDetails.Insert(orderDetail);

                    var dbRate = await _unitOfWork.Rates.Get(expression: r => r.UserId == rate.UserId && r.ProductId == rate.ProductId);
                    if(dbRate != null)
                    {
                        _unitOfWork.Rates.Update(rate);
                    }
                    else
                    {
                        await _unitOfWork.Rates.Insert(rate);
                    }
                }

                // Delete all cart items of user
                var cartItems = await _unitOfWork.Carts.GetAll(c => c.UserId == order.UserId);
                _unitOfWork.Carts.DeleteRange(cartItems);

                await _unitOfWork.Save();

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error. Please  try again error!!");
            }
        }

        // POST: /api/Orders/Payment
        [Authorize]
        [HttpPost]
        [Route("Payment")]
        public async Task<IActionResult> Create(PaymentIntentCreateRequest request)
        {
            var paymentIntents = new PaymentIntentService();
            DateTime now = DateTime.Now;
            try
            {
                float discount = 0;
                if (request.voucherCode.Trim() != "")
                {
                    var voucher = await _unitOfWork.Vouchers.Get(expression: v => v.Code == request.voucherCode && v.VoucherId == request.voucherId && v.StartDate >= now && v.EndDate <= now && v.State == true);
                    if(voucher != null)
                    {
                        discount = voucher.Discount;
                    }
                }
                float amount = await CalculateOrderAmount(request.Products);
                if(amount <= discount)
                {
                    amount = 1;
                }
                else
                {
                    amount = amount - discount;
                }
                if(amount < 1)
                {
                    amount = 1;
                }
                var paymentIntent = paymentIntents.Create(new PaymentIntentCreateOptions
                {
                    Amount = (long?)amount,
                    Currency = "usd",
                    PaymentMethodTypes = new List<string> { "card" }
                });
                return Ok(new { clientSecret = paymentIntent.ClientSecret });
            }
            catch
            {
                return StatusCode(500, "Internal server error. Please  try again error!!");
            }
        }
        private async Task<float> CalculateOrderAmount(List<ProductItem> products)
        {
            float total = 0;
            foreach (var item in products)
            {
                var prod = await _unitOfWork.Products.Get(p => p.Id == item.Id);
                total = total + prod.Price * item.Quantity;
            }
            return total * 100;
        }

        [HttpGet]
        [Route("GetByUser/{userid}")]
        public IEnumerable<Entities.Order> GetByUser(int userid)
        {
            var order = _userOrder.GetByUser(userid);
            return order;
        }

        // Lich su mua hang tren trang user
        // Get: api/orders/history?currentPage=1&userid=1
        [Authorize]
        [HttpGet]
        [Route("History")]
        public async Task<IActionResult> GetHistory(int currentPage, int userid)
        {

            var result = await _unitOfWork.Orders.GetAllWithPagination(
                expression: p => p.UserId == userid,
                orderBy: x => x.OrderByDescending(a => a.OrderDate),
                pagination: new Pagination { CurrentPage = currentPage }
                );


            var listHistories = _mapper.Map<List<ListOrderDTO>>(result.Item1);

            return Ok(new
            {
                Histories = listHistories,
                CurrentPage = result.Item2.CurrentPage,
                TotalPage = result.Item2.TotalPage
            });
        }

        // xem detail don hang tren trang user
        // get: api/orders/getorderdetail?orderid=1
        [Authorize]
        [HttpGet]
        [Route("GetOrderDetail")]
        public async Task<IActionResult> GetOrderDetail(int orderid, int userid)
        {
            // Thong tin cua order
            var order = await _unitOfWork.Orders.Get(x => x.OrderId == orderid && x.UserId == userid);

            if (order != null)
            {

                //Lay danh sach cac san pham trong order
                var orderDetails = _userOrder.GetOrderDetails(orderid);
                return Ok(new
                {
                    OrderId = order.OrderId,
                    Address = order.Address,
                    Phone = order.Phone,
                });
            }

            return NotFound();

        }

        [Authorize]
        [HttpGet]
        [Route("AdminGetOrderDetail")]
        public async Task<IActionResult> GetOrderDetail(int orderid)
        {
            // Thong tin cua order
            var order = await _unitOfWork.Orders.Get(expression: x => x.OrderId == orderid, includes: new List<string> { "OrderDetails" });

            if (order != null)
            {
                return Ok(order);
            }

            return NotFound();
        }


        [HttpPut]
        [Authorize(Roles = "Admin,Employee")]
        [Route("UpdateStatus")]
        public async Task<IActionResult> UpdateStatus(OrderUpdateState order)
        {
            var dbOrder = await _unitOfWork.Orders.Get(o => o.OrderId == order.OrderId);
            if (dbOrder != null)
            {
                dbOrder.DeliveryStatus = order.DeliveryStatus;
                _unitOfWork.Orders.Update(dbOrder);
                await _unitOfWork.Save();
                return Ok();
            }
            return NotFound();
        }

    }
}
