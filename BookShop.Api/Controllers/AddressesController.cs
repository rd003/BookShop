using BookShop.Api.Models;
using BookShop.Api.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookShop.Api.Controllers;

[Authorize]
[ApiController]
[Route("/api/[controller]")]
public class AddressesController(AppDbContext context) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> CreateAddress(CreateAddressDto createAddressDto)
    {
        return Ok();
    }
}