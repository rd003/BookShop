using BookShop.Api.Models.DTOs;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using BookShop.Api.Models;
using System.ComponentModel;
using BookShop.Api.Exceptions;

namespace BookShop.Api.Services;

public class AuthService : IAuthService
{
    readonly IConfiguration _configuration;
    readonly UserManager<ApplicationUser> _userManager;
    readonly RoleManager<IdentityRole> _roleManager;

    public AuthService(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _configuration = configuration;
    }

    public async Task Register(SignupModel signup, string role)
    {
        // check user exists or not
        var user = await _userManager.FindByEmailAsync(signup.Email);
        if (user != null)
        {
            throw new ConflictException("User already exists");
        }
        ApplicationUser appUser = new()
        {
            Name = signup.Name,
            UserName = signup.Email,
            Email = signup.Email,
            SecurityStamp = Guid.NewGuid().ToString()
        };
        var createdUserResult = await _userManager.CreateAsync(appUser, signup.Password);
        if (!createdUserResult.Succeeded)
        {
            throw new InvalidOperationException(string.Join("; ", createdUserResult.Errors.Select(e => e.Description)));
        }
        // create role if does not exists
        bool isRoleExists = await _roleManager.RoleExistsAsync(role);
        if (!isRoleExists)
        {
            await _roleManager.CreateAsync(new IdentityRole(role));
        }
        // add user's role
        await _userManager.AddToRoleAsync(appUser, role);
    }

    public async Task<string> Login(LoginModel model)
    {
        ApplicationUser? user = await _userManager.FindByEmailAsync(model.Username);

        if (user == null)
        {
            throw new UnauthorizedAccessException("Invalid user");
        }
        // match password
        bool isPasswordValid = await _userManager.CheckPasswordAsync(user, model.Password);
        if (!isPasswordValid)
        {
            throw new UnAuthorizedException("Invalid Username or Password");
        }

        // get user's roles
        IList<string> userRoles = await _userManager.GetRolesAsync(user);

        // create claims
        List<Claim> claims = [
            new Claim(ClaimTypes.Name,user.UserName),
            new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString()),
        ];
        foreach (string role in userRoles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }
        string token = GenerateToken(claims);
        // generate token
        return token;
    }

    private string GenerateToken(IEnumerable<Claim> claims)
    {
        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Issuer = _configuration["JWT:ValidIssuer"],
            Audience = _configuration["JWT:ValidAudience"],
            Expires = DateTime.UtcNow.AddMinutes(2), // expires in 2 minutes
            SigningCredentials = new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256),
            Subject = new ClaimsIdentity(claims)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}

public interface IAuthService
{
    Task Register(SignupModel signup, string role);
    Task<string> Login(LoginModel model);
}