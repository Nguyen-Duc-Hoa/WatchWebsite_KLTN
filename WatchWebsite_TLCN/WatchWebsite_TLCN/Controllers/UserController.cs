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
using WatchWebsite_TLCN.Utilities;

namespace WatchWebsite_TLCN.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public UserController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        // GET: api/User/SearchEmployee?currentPage=1&searchKey=abc
        [Authorize(Roles = "Admin")]
        [HttpGet]
        [Route("SearchEmployee")]
        public async Task<ActionResult<IEnumerable<User>>> SearchEmployee(int currentPage, string searchKey)
        {
            if (String.IsNullOrEmpty(searchKey)) searchKey = "";
            try
            {
                var result = await _unitOfWork.UserRole.GetAllWithPagination(
                    expression: ur => ur.Role.RoleName == Constant.employeeRole && 
                        (ur.User.Name.Contains(searchKey) || 
                        ur.User.Address.Contains(searchKey) ||
                        ur.User.Phone.Contains(searchKey)),
                    includes: new List<string> { "User" },
                    pagination: new Pagination { CurrentPage = currentPage });

                List<User> employeeList = new List<User>();
                foreach (var user in result.Item1)
                {
                    employeeList.Add(user.User);
                }

                var employeeListDTO = _mapper.Map<List<UserDTO>>(employeeList);
                return Ok(new
                {
                    Users = employeeListDTO,
                    CurrentPage = result.Item2.CurrentPage,
                    TotalPage = result.Item2.TotalPage
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // GET: api/User/SearchCustomer?currentPage=1&searchKey=abc
        [Authorize(Roles = "Admin,Employee")]
        [HttpGet]
        [Route("SearchCustomer")]
        public async Task<ActionResult<IEnumerable<User>>> SearchCustomer(int currentPage, string searchKey)
        {
            if (String.IsNullOrEmpty(searchKey)) searchKey = "";
            try
            {
                var result = await _unitOfWork.UserRole.GetAllWithPagination(
                    expression: ur => ur.Role.RoleName == Constant.customerRole &&
                        (ur.User.Name.Contains(searchKey) ||
                        ur.User.Address.Contains(searchKey) ||
                        ur.User.Phone.Contains(searchKey)),
                    includes: new List<string> { "User" },
                    pagination: new Pagination { CurrentPage = currentPage });

                List<User> customerList = new List<User>();
                foreach (var user in result.Item1)
                {
                    customerList.Add(user.User);
                }

                var customerListDTO = _mapper.Map<List<UserDTO>>(customerList);
                return Ok(new
                {
                    Users = customerListDTO,
                    CurrentPage = result.Item2.CurrentPage,
                    TotalPage = result.Item2.TotalPage
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // GET: api/User
        [HttpGet]
        public async Task<ActionResult<UserDTO>> GetUser(int id)
        {
            var user = await _unitOfWork.Users.Get(u => u.Id == id);

            if (user == null)
            {
                return NotFound();
            }
            var userDTO = _mapper.Map<UserDTO>(user);
            return userDTO;
        }

        // POST: api/User/UpdateStateEmployee?currentPage=1&searchKey=123
        [Authorize(Roles = "Admin, Employee")]
        [HttpPut]
        [Route("UpdateStateEmployee")]
        public async Task<IActionResult> UpdateStateEmployee(UserDTO userDTO)
        {
            try
            {
                var user = await _unitOfWork.Users.Get(u => u.Id == userDTO.Id);
                user.State = !user.State;
                _unitOfWork.Users.Update(user);
                await _unitOfWork.Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!(await UserExists(userDTO.Id)))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok();
        }


        [HttpPut]
        public async Task<IActionResult> UpdateInfo(UserRequest userReq)
        {
            try
            {
                var user = await _unitOfWork.Users.Get(u => u.Id == userReq.Id);
                user.Name = userReq.Name;
                user.Address = userReq.Address;
                user.Email = userReq.Email;
                user.Phone = userReq.Phone;
                user.Birthday = userReq.Birthday;
                user.Avatar = userReq.Avatar;
                _unitOfWork.Users.Update(user);
                await _unitOfWork.Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!(await UserExists(userReq.Id)))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok();
        }

        [HttpPut]
        [Route("ChangePassword")]
        public async Task<IActionResult> ChangePassword(UserChangePassword userChangePass)
        {
            try
            {
                var user = await _unitOfWork.Users.Get(u => u.Id == userChangePass.Id);
                if(userChangePass.CurrentPassword == user.Password)
                {
                    user.Password = userChangePass.NewPassword;
                    _unitOfWork.Users.Update(user);
                    await _unitOfWork.Save();
                }
                else
                {
                    return NotFound();
                }
                
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!(await UserExists(userChangePass.Id)))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok();
        }

        // POST: api/User/CreateEmployee
        [Authorize(Roles = "Admin")]
        [HttpPost]
        [Route("CreateEmployee")]
        public async Task<ActionResult<User>> CreateEmployee(User user)
        {
            try
            {
                await _unitOfWork.Users.Insert(user);
                await _unitOfWork.Save();

                var employeeRole = await _unitOfWork.Roles.Get(role => role.RoleName == "Employee");

                await _unitOfWork.UserRole.Insert(
                    new User_Role { UserId = user.Id, RoleId = employeeRole.RoleId });
                await _unitOfWork.Save();

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // DELETE: api/User/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<User>> DeleteUser(int id)
        {
            var user = await _unitOfWork.Users.Get(u => u.Id == id);
            if (user == null)
            {
                return NotFound();
            }

            await _unitOfWork.Users.Delete(user);
            await _unitOfWork.Save();

            return user;
        }

        private Task<bool> UserExists(int id)
        {
            return _unitOfWork.Users.IsExist<int>(id);
        }
    }
}
