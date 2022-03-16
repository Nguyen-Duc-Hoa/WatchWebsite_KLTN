using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using WatchWebsite_TLCN.Entities;
using WatchWebsite_TLCN.Models;

namespace WatchWebsite_TLCN
{
    public class JwtAuthenticationManager : IJwtAuthenticationManager
    {        
        public readonly string tokenKey;
        public IDictionary<string, string> UsersRefreshTokens { get; set; }

        //tokenKey is private key to encode
        public JwtAuthenticationManager(string tokenKey, IRefreshTokenGenerator refreshTokenGenerator)
        {
            this.tokenKey = tokenKey;
            UsersRefreshTokens = new Dictionary<string, string>();
        }

        public AuthenticationResponse Authenticate(int userid, string username, string password, List<string> roles)
        {
            var signingCredentials = GetSigningCredentials();

            var claims = GetClaims(username, roles);
            var token = GenerateTokenOptions(signingCredentials, claims);

            return new AuthenticationResponse
            {
                JwtToken = new JwtSecurityTokenHandler().WriteToken(token)
            };
        }

        private JwtSecurityToken GenerateTokenOptions(SigningCredentials signingCredentials, List<Claim> claims)
        {
            // create expire time
            var expiration = DateTime.UtcNow.AddHours(1);

            var token = new JwtSecurityToken(
                issuer: "WatchshopAPI",
                claims: claims,
                expires: expiration,
                signingCredentials: signingCredentials
                );

            return token;
        }

        private List<Claim> GetClaims(string username, List<string> roles)
        {
            var claims = new List<Claim>
             {
                 new Claim(ClaimTypes.Name, username)
             };


            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            return claims;
        }

        private SigningCredentials GetSigningCredentials()
        {
            // Biểu diễn lớp cơ sở trừu tượng cho tất cả các khóa được tạo bằng thuật toán đối xứng.
            var secret = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey));

            // Đại diện cho mật mã, thuật toán
            return new SigningCredentials(secret, SecurityAlgorithms.HmacSha256);
        }
    }
}
