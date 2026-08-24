using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BookShop.Api.Models.DTOs;
using Microsoft.IdentityModel.Tokens;

namespace BookShop.Api.Services;

public class TokenService(IConfiguration configuration)
{
    private readonly IConfiguration _configuration = configuration;

    public string GenerateAccessToken(IEnumerable<Claim> claims)
    {
        var tokenHandler = new JwtSecurityTokenHandler();

        // Create a symmetric security key using the secret key from the configuration.
        var authSigningKey = new SymmetricSecurityKey
        (Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Issuer = _configuration["JWT:ValidIssuer"],
            Audience = _configuration["JWT:ValidAudience"],
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.Now.AddMinutes(1), // 1 minute for testing only
            SigningCredentials = new SigningCredentials
        (authSigningKey, SecurityAlgorithms.HmacSha256)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }

    public ClaimsPrincipal GetPrincipalFromExpiredToken(string accessToken)
    {
        // Define the token validation parameters used to validate the token.
        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidAudience = _configuration["JWT:ValidAudience"],
            ValidIssuer = _configuration["JWT:ValidIssuer"],
            ValidateLifetime = false,
            ClockSkew = TimeSpan.Zero,
            IssuerSigningKey = new SymmetricSecurityKey
        (Encoding.UTF8.GetBytes(_configuration["JWT:secret"]))
        };

        var tokenHandler = new JwtSecurityTokenHandler();

        // Validate the token and extract the claims principal and the security token.
        var principal = tokenHandler.ValidateToken(accessToken, tokenValidationParameters, out SecurityToken securityToken);

        // Cast the security token to a JwtSecurityToken for further validation.

        var jwtSecurityToken = securityToken as JwtSecurityToken;

        // Ensure the token is a valid JWT and uses the HmacSha256 signing algorithm.
        // If no throw new SecurityTokenException
        if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals
        (SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
        {
            throw new SecurityTokenException("Invalid token");
        }

        // return the principal
        return principal;
    }

    public string GenerateRefreshToken()
    {
        return Guid.NewGuid().ToString("N");
    }

    public IEnumerable<Claim> GenerateClaims(string username, string[] roles)
    {
        List<Claim> claims = [
            new (ClaimTypes.Name, username),  // claim to store name
            new (JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        // unique identifier for jwt
        ];

        // adding role to claims

        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }
        return claims;
    }

    public void SetTokenCookies(TokenModel tokenModel, HttpContext context)
    {
        context.Response.Cookies.Append("accessToken", tokenModel.AccessToken, new CookieOptions
        {
            Expires = DateTime.UtcNow.AddMinutes(1),  // TODO : set to 15 min
            HttpOnly = true,
            IsEssential = true,
            Secure = true,
            Path = "/",
            SameSite = SameSiteMode.None // TODO: set it to strict or lax for production
        });

        context.Response.Cookies.Append("refreshToken", tokenModel.RefreshToken, new CookieOptions
        {
            Expires = DateTime.UtcNow.AddMinutes(2),  // TODO : set to atleast 7 days
            HttpOnly = true,
            IsEssential = true,
            Secure = true,
            Path = "/",
            SameSite = SameSiteMode.None // TODO: set it to strict or lax for production
        });
    }
}