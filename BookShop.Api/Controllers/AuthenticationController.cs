using BookShop.Api.Constants;
using BookShop.Api.Models.DTOs;
using BookShop.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace BookShop.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthenticationController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthenticationController> _logger;
    public AuthenticationController(IAuthService authService, ILogger<AuthenticationController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    [HttpPost("signup")]
    public async Task<IActionResult> Signup(SignupModel model)
    {
        await _authService.Register(model, UserRoles.User);
        return Ok();
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginModel model)
    {
        string token = await _authService.Login(model);
        return Ok(new LoginResponse(AccessToken: token));
    }
}