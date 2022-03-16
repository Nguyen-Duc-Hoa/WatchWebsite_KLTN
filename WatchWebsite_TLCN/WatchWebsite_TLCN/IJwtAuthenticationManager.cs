using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using WatchWebsite_TLCN.Entities;
using WatchWebsite_TLCN.Models;

namespace WatchWebsite_TLCN
{
    public interface IJwtAuthenticationManager
    {
        AuthenticationResponse Authenticate(int userid, string username, string password, List<string> role);

        IDictionary<string, string> UsersRefreshTokens { get; set; }
    }
}
