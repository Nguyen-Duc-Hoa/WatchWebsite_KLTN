using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using WatchWebsite_TLCN.Models;

namespace WatchWebsite_TLCN.Methods
{
    public class TokenRefresher : ITokenRefresher
    {
        private readonly byte[] key;
        private readonly IJwtAuthenticationManager jwtAuthenticationManager;

        public TokenRefresher(byte[] key, IJwtAuthenticationManager jwtAuthenticationManager)
        {
            this.key = key;
            this.jwtAuthenticationManager = jwtAuthenticationManager;
        }
        /*public AuthenticationResponse Refresh(RefreshCred refreshCred)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken validatedToken;

            var pricipal = tokenHandler.ValidateToken(refreshCred.JwtToken,
                new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false
                }, out validatedToken);

            var jwtToken = validatedToken as JwtSecurityToken;
            if (jwtToken == null || jwtToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            {
                throw new SecurityTokenException("Invalid token passed");
            }

            var userName = pricipal.Identity.Name;
            if( refreshCred.RefreshToken != jwtAuthenticationManager.UsersRefreshTokens[userName])
            {
                throw new SecurityTokenException("Invalid token passed");
            }

            return jwtAuthenticationManager.Authenticate(userName, pricipal.Claims.ToArray());
        }*/
    }
}
