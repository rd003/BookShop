using BookShop.Api.Exceptions;
using BookShop.Api.Mappers;
using BookShop.Api.Models;
using BookShop.Api.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace BookShop.Api.Controllers;

[Authorize]
[ApiController]
[Route("/api/[controller]")]
public class AddressesController(AppDbContext context, UserManager<ApplicationUser> userManager) : ControllerBase
{

    [HttpGet("{id:int}", Name = nameof(GetAddress))]
    public async Task<IActionResult> GetAddress(int id)
    {
        return Ok();
    }

    [HttpPost]
    public async Task<IActionResult> CreateAddress(CreateAddressDto createAddressDto)
    {
        var userId = await GetUserIdAsync();
        var address = createAddressDto.ToDomain();
        address.UserId = userId;

        // if user has no default address, make this one default
        // In this way user has atleast one default address
        bool hasAnyDefaultAddress = await context.Addresses.AnyAsync(a => a.UserId == userId && a.IsDefault);

        if (!address.IsDefault && !hasAnyDefaultAddress)
        {
            address.IsDefault = true;
        }
        context.Add(address);
        try
        {
            await context.SaveChangesAsync();
            return CreatedAtRoute(nameof(GetAddress), new { id = address.Id }, address);
        }
        catch (DbUpdateException ex) when (ex.InnerException is SqliteException { SqliteErrorCode: 19 })
        {
            throw new ConflictException("User already has a default address.");
        }

    }



    private async Task<string> GetUserIdAsync()
    {
        var username = User.Identity?.Name ?? throw new UnAuthorizedException("User is not authorized");
        var currentUser = await userManager.FindByNameAsync(username) ?? throw new UnAuthorizedException("User is not authorized");
        return currentUser.Id;
    }
}