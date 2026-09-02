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
    [HttpGet]
    public async Task<IActionResult> GetAddresses()
    {
        var userId = await GetUserIdAsync();
        var addresses = await context.Addresses.AsNoTracking().Where(a => a.UserId == userId).ToListAsync();
        return Ok(addresses);
    }

    [HttpGet("{id:int}", Name = nameof(GetAddress))]
    public async Task<IActionResult> GetAddress(int id)
    {
        var userId = await GetUserIdAsync();
        var address = await context.Addresses.AsNoTracking().SingleOrDefaultAsync(a => a.Id == id && a.UserId == userId) ?? throw new NotFoundException("Address not found");
        return Ok(address.ToDto());
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

    [HttpPatch("{id:int}")]
    public async Task<IActionResult> UpdateAddress(int id, [FromBody] UpdateAddressDto updateAddressDto)
    {
        var userId = await GetUserIdAsync();
        if (id != updateAddressDto.Id)
        {
            throw new BadRequestException("Id in uri and body does not match.");
        }

        var address = await context.Addresses.FindAsync(id) ?? throw new NotFoundException("Address not found");

        if (address.UserId != userId)
        {
            throw new UnAuthorizedException("You are not authorized to update the address");
        }

        // capture original value before any mutation, needed to detect default-status transitions below
        bool wasDefault = address.IsDefault;

        //  block unsetting the only default address — enforce "always at least one default" rule
        if (wasDefault && !updateAddressDto.IsDefault)
        {
            throw new BadRequestException("Cannot unset the default address. Set another address as default instead.");
        }

        address.Updated = DateTime.UtcNow;

        if (updateAddressDto.FullName != address.FullName)
        {
            address.FullName = updateAddressDto.FullName;
        }
        if (updateAddressDto.IsDefault != address.IsDefault)
        {
            address.IsDefault = updateAddressDto.IsDefault;
        }
        if (updateAddressDto.City != address.City)
        {
            address.City = updateAddressDto.City;
        }
        if (updateAddressDto.State != address.State)
        {
            address.State = updateAddressDto.State;
        }
        if (updateAddressDto.Country != address.Country)
        {
            address.Country = updateAddressDto.Country;
        }
        if (updateAddressDto.Line1 != address.Line1)
        {
            address.Line1 = updateAddressDto.Line1;
        }
        if (updateAddressDto.Line2 != address.Line2)
        {
            address.Line2 = updateAddressDto.Line2;
        }
        if (updateAddressDto.PostalCode != address.PostalCode)
        {
            address.PostalCode = updateAddressDto.PostalCode;
        }
        if (updateAddressDto.Phone != address.Phone)
        {
            address.Phone = updateAddressDto.Phone;
        }

        // only clear other default when this address is newly becoming default (was: unconditional)

        if (address.IsDefault && !wasDefault)
        {
            var otherDefaultAddress = await context.Addresses
                .SingleOrDefaultAsync(a => a.UserId == userId && a.Id != id && a.IsDefault);

            if (otherDefaultAddress is not null)
            {
                otherDefaultAddress.IsDefault = false;
            }
        }

        await context.SaveChangesAsync();

        return NoContent();
    }

    private async Task<string> GetUserIdAsync()
    {
        var username = User.Identity?.Name ?? throw new UnAuthorizedException("User is not authorized");
        var currentUser = await userManager.FindByNameAsync(username) ?? throw new UnAuthorizedException("User is not authorized");
        return currentUser.Id;
    }
}