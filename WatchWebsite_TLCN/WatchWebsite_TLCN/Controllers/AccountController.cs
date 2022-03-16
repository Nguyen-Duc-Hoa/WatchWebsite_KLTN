using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WatchWebsite_TLCN.Entities;
using WatchWebsite_TLCN.Methods;
using WatchWebsite_TLCN.Models;
using WatchWebsite_TLCN.Utilities;

namespace WatchWebsite_TLCN.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly MyDBContext _context;
        private readonly IJwtAuthenticationManager _jwtAuthenticationManager;
        private readonly ITokenRefresher _tokenRefresher;

        public AccountController(IJwtAuthenticationManager jwtAuthenticationManager, ITokenRefresher tokenRefresher, MyDBContext context)
        {
            _context = context;
            _jwtAuthenticationManager = jwtAuthenticationManager;
            _tokenRefresher = tokenRefresher;
        }


        [AllowAnonymous]
        [HttpPost]
        [Route("Register")]
        public async Task<IActionResult> Register([FromBody] Register model)
        {
            var user = new User { Username = model.Username, Password = model.Password, Phone = model.Phone, Email = model.Email, State = true };
            try
            {
                _context.Users.Add(user);
                var result = await _context.SaveChangesAsync();


                if (result.Equals(1))
                {
                    string customerRole = Constant.customerRole;
                    Role dbRole = _context.Roles.FirstOrDefault(r => r.RoleName == customerRole);
                    User_Role usrRole = new User_Role { RoleId = dbRole.RoleId, UserId = user.Id };
                    _context.User_Roles.Add(usrRole);
                    await _context.SaveChangesAsync();
                    return Ok();
                }
                else
                {
                    return BadRequest("Dang ki khong thanh cong");
                }
            }
            catch
            {
                return BadRequest();
            }
        }


        //post: api/account/login   {"Username": "Hoa", "Password":"123"} 
        [AllowAnonymous]
        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login([FromBody] Login model)
        {
            string username = model.Username;
            string password = model.Password;
            int userid = 0;

            List<string> listRole = new List<string>();
            List<int> listRoleId = new List<int>();

            User user = _context.Users.Where(x => x.Username == username && x.Password == password && x.State == true).FirstOrDefault();
           
            if (user == null)
            {
                username = null;
                password = null;
            }
            else
            {
                userid = user.Id;
                var user_role = (from u in _context.User_Roles
                                 join r in _context.Roles on u.RoleId equals r.RoleId
                                 where u.UserId == userid
                                 select new
                                 {
                                     r.RoleId,
                                     r.RoleName
                                 }).ToList();

                foreach(var item in user_role)
                {
                    listRole.Add(item.RoleName);
                    listRoleId.Add(item.RoleId);
                }

            }

            //var token = _jwtAuthenticationManager.Authenticate(username, password);

            var token = _jwtAuthenticationManager.Authenticate(userid, username, password, listRole);

            if (token == null)
            {
                return Unauthorized();
            }

            string avatar = null;
            try
            {
                avatar = Convert.ToBase64String(user.Avatar);
            }
            catch { }

            return Ok(new
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Name = user.Name,
                Address = user.Address,
                Phone = user.Phone,
                Birthday = user.Birthday,
                Avatar = avatar,
                Role = listRole,
                Token = token.JwtToken
            });

        }


        //post: api/account/resetpassword?email=abc@gmail.com
        [AllowAnonymous]
        [HttpPost]
        [Route("ResetPassword")]
        public async Task<IActionResult> ResetPassword(string email)
        {

            // query id tu email va password de kiem tra dang nhap

            var user = _context.Users.Where(x => x.Email == email).FirstOrDefault();
            string oldPass = user.Password.ToString();

            if (user != null)
            {
                
                string web_email = "nhomltweb@gmail.com";
                // Cau hinh thong tin gmail
                var mail = new SmtpClient("smtp.gmail.com", 25)
                {
                    Credentials = new NetworkCredential(web_email, "123456789a@"),
                    EnableSsl = true
                };
                // tao gmail
                var message = new MailMessage();
                message.From = new MailAddress(web_email);
                message.ReplyToList.Add(web_email);
                message.To.Add(new MailAddress(email));

                // Create a random 6-digits number for verification code
                Random random = new Random();
                int code = random.Next(100000, 999999);
                

                message.Subject = "Reset Watch-Website Password";
                message.Body = code + " is your account password.";

                try
                {
                    //Update Password
                    (from p in _context.Users
                     where (p.Email == email)
                     select p).ToList()
                                        .ForEach(x => x.Password = code.ToString());

                    _context.SaveChanges();

                    // gui gmail    
                    mail.Send(message);

                    return Ok("Check your email");
                }
                catch(Exception e)
                {
                    try
                    {
                        //tra lai Password cu
                        (from p in _context.Users
                         where (p.Email == email)
                         select p).ToList()
                                            .ForEach(x => x.Password = oldPass);

                        _context.SaveChanges();
                    }
                    catch { }
                    return BadRequest(e.ToString());
                }
                
            }
            else
            {
                return StatusCode(500);
            }
        }

    }
}
