using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using BookShop.Api.Constants;
using BookShop.Api.Exceptions;
using BookShop.Api.Models;
using BookShop.Api.Models.DTOs;
using BookShop.Api.Models.Entities;
using BookShop.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BookShop.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthenticationController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly ILogger<AuthenticationController> _logger;
    private readonly TokenService _tokenService; // new code
    private readonly AppDbContext _context; // new code

    public AuthenticationController(UserManager<ApplicationUser> userManager,
                 RoleManager<IdentityRole> roleManager,
                 ILogger<AuthenticationController> logger,
                 TokenService tokenService, AppDbContext context)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _logger = logger;
        _tokenService = tokenService;  // new code
        _context = context; // new code
    }

    [HttpPost("signup")]
    public async Task Signup(SignupModel model)
    {

        var existingUser = await _userManager.FindByNameAsync(model.Email);
        if (existingUser != null)
        {
            throw new ConflictException("User already exists");
        }

        // Create User role if it doesn't exist
        if ((await _roleManager.RoleExistsAsync(Roles.User)) == false)
        {
            var roleResult = await _roleManager
                  .CreateAsync(new IdentityRole(Roles.User));

            if (roleResult.Succeeded == false)
            {
                var roleErros = roleResult.Errors.Select(e => e.Description);
                _logger.LogError($"Failed to create user role. Errors : {string.Join(",", roleErros)}");
                throw new BadRequestException($"Failed to create user role");
            }
        }

        ApplicationUser user = new()
        {
            Email = model.Email,
            SecurityStamp = Guid.NewGuid().ToString(),
            UserName = model.Email,
            Name = model.Name,
            EmailConfirmed = true
        };

        // Attempt to create a user
        var createUserResult = await _userManager.CreateAsync(user, model.Password);

        // Validate user creation. If user is not created, log the error and
        // return the BadRequest along with the errors
        if (createUserResult.Succeeded == false)
        {
            var errors = createUserResult.Errors.Select(e => e.Description);
            _logger.LogError(
                $"Failed to create user. Errors: {string.Join(", ", errors)}"
            );
            throw new BadRequestException($"Failed to create a user.");
        }

        // adding role to user
        var addUserToRoleResult = await _userManager.AddToRoleAsync(user: user, role: Roles.User);

        if (addUserToRoleResult.Succeeded == false)
        {
            var errors = addUserToRoleResult.Errors.Select(e => e.Description);
            _logger.LogError($"Failed to add role to the user. Errors : {string.Join(",", errors)}");
            throw new BadRequestException($"Failed to add role to the user. Errors : {string.Join(",", errors)}"); //TODO: Am I exposing any security?
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginModel model)
    {

        var user = await _userManager.FindByNameAsync(model.Username);
        if (user == null)
        {
            throw new UnAuthorizedException("Invalid user");
        }

        bool isValidPassword = await _userManager.CheckPasswordAsync(user, model.Password);
        if (isValidPassword == false)
        {
            throw new UnAuthorizedException("Invalid user");
        }

        // creating the necessary claims
        List<Claim> authClaims = [
                new (ClaimTypes.Name, user.UserName),
                new (JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                // unique id for token
        ];

        var userRoles = await _userManager.GetRolesAsync(user);

        // adding roles to the claims. So that we can get the user role from the token.
        foreach (var userRole in userRoles)
        {
            authClaims.Add(new Claim(ClaimTypes.Role, userRole));
        }

        // generating access token
        var token = _tokenService.GenerateAccessToken(authClaims);

        string refreshToken = _tokenService.GenerateRefreshToken();

        //save refreshToken with exp date in the database
        var tokenInfo = _context.TokenInfos.
                    FirstOrDefault(a => a.Username == user.UserName);

        // If tokenInfo is null for the user, create a new one
        if (tokenInfo == null)
        {
            var ti = new TokenInfo
            {
                Username = user.UserName,
                RefreshToken = refreshToken,
                ExpiredAt = DateTime.UtcNow.AddMinutes(2)
            };
            _context.TokenInfos.Add(ti);
        }
        // Else, update the refresh token and expiration
        else
        {
            tokenInfo.RefreshToken = refreshToken;
            tokenInfo.ExpiredAt = DateTime.UtcNow.AddMinutes(2);
        }

        await _context.SaveChangesAsync();

        return Ok(new TokenModel
        {
            AccessToken = token,
            RefreshToken = refreshToken
        });
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh(TokenModel tokenModel)
    {
        var principal = _tokenService.GetPrincipalFromExpiredToken(tokenModel.AccessToken);
        var username = principal.Identity.Name;

        var tokenInfo = _context.TokenInfos.SingleOrDefault(u => u.Username == username);
        if (tokenInfo == null
        || tokenInfo.RefreshToken != tokenModel.RefreshToken
        || tokenInfo.ExpiredAt <= DateTime.UtcNow)
        {
            throw new BadRequestException("Invalid refresh token. Please login again.");
        }

        var newAccessToken = _tokenService.GenerateAccessToken(principal.Claims);
        var newRefreshToken = _tokenService.GenerateRefreshToken();

        tokenInfo.RefreshToken = newRefreshToken; // rotating the refresh token
        await _context.SaveChangesAsync();

        return Ok(new TokenModel
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken
        });
    }

    [HttpPost("token/revoke")]
    [Authorize]
    public async Task<IActionResult> Revoke()
    {
        var username = User.Identity.Name;

        var user = _context.TokenInfos.SingleOrDefault(u => u.Username == username);
        if (user == null)
        {
            throw new BadRequestException("Invalid user");
        }

        user.RefreshToken = string.Empty;
        await _context.SaveChangesAsync();
        return Ok();
    }
}