using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace RuddIO.Server.Auth.Services.Abstraction
{
    public interface ITokenService
    {
        ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
        string GenerateRefreshToken();
        JwtSecurityToken CreateAccessToken(IEnumerable<Claim> authClaims);
    }
}
