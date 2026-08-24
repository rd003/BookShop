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
using Microsoft.EntityFrameworkCore;

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
    public async Task<IActionResult> Signup(SignupModel model)
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
        return Ok();
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
        if (!isValidPassword)
        {
            throw new UnAuthorizedException("Invalid user");
        }

        var userRoles = await _userManager.GetRolesAsync(user);

        // new line
        var authClaims = _tokenService.GenerateClaims(user.UserName, userRoles.ToArray());

        // generating access token
        var token = _tokenService.GenerateAccessToken(authClaims);

        string refreshToken = _tokenService.GenerateRefreshToken();

        //save refreshToken with exp date in the database
        var tokenInfo = await _context.TokenInfos.
                    SingleOrDefaultAsync(a => a.Username == user.UserName);

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

        // new lines
        // set token cookies
        var tokenModel = new TokenModel
        {
            AccessToken = token,
            RefreshToken = refreshToken
        };
        _tokenService.SetTokenCookies(tokenModel, HttpContext);

        return Ok(tokenModel);
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh(TokenModel tokenModel)
    {
        // Console.WriteLine("=== ALL COOKIES ===");
        // foreach (var cookie in HttpContext.Request.Cookies)
        // {
        //     Console.WriteLine($"Cookie: {cookie.Key} = {cookie.Value}");
        // }
        // Console.WriteLine("===================");

        // I can not do auto validation, since I don't need to pass any payload in req body, if I am using it http only cookies
        // But, if this api is used by mobile app client, then we must both value in req body
        tokenModel ??= new TokenModel();

        HttpContext.Request.Cookies.TryGetValue("refreshToken", out var refreshToken);

        if (!string.IsNullOrEmpty(refreshToken))
        {
            tokenModel.RefreshToken = refreshToken;
        }
        // If no cookies, tokenModel should have values from request body (mobile client)
        else if (string.IsNullOrEmpty(tokenModel.RefreshToken))
        {
            throw new BadRequestException("No valid tokens found in cookies or request body");
        }

        var tokenInfo = await _context.TokenInfos.SingleOrDefaultAsync(a => a.RefreshToken == tokenModel.RefreshToken);

        if (tokenInfo == null || tokenInfo.ExpiredAt <= DateTime.UtcNow)
        {
            throw new BadRequestException("Invalid refresh token. Please login again.");
        }

        var user = await _userManager.FindByNameAsync(tokenInfo.Username);

        if (user == null)
        {
            throw new BadRequestException("Invalid refresh token. Please login again.");
        }

        var userRoles = await _userManager.GetRolesAsync(user);

        var claims = _tokenService.GenerateClaims(user.UserName, userRoles.ToArray());

        var newAccessToken = _tokenService.GenerateAccessToken(claims);
        var newRefreshToken = _tokenService.GenerateRefreshToken();

        tokenInfo.RefreshToken = newRefreshToken; // rotating the refresh token
        await _context.SaveChangesAsync();

        var newTokenData = new TokenModel
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken
        };

        // set token cookies

        _tokenService.SetTokenCookies(newTokenData, HttpContext);

        // also sending it as a response, because cookie don't work with mobile app clients
        return Ok(newTokenData);

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

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        string? username = User.Identity?.Name;
        if (string.IsNullOrEmpty(username))
        {
            throw new UnAuthorizedException("You are not authorized.");
        }

        // remove token info from database
        await _context.TokenInfos.Where(t => t.Username == username).ExecuteDeleteAsync();

        // remove token cookies
        Response.Cookies.Delete("accessToken", new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            Path = "/",
            SameSite = SameSiteMode.None // TODO: change to strict/lax in production
        });

        Response.Cookies.Delete("refreshToken", new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            Path = "/",
            SameSite = SameSiteMode.None // TODO: change to strict/lax in production
        });

        return NoContent();
    }
}