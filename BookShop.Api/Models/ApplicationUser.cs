using Microsoft.AspNetCore.Identity;

namespace BookShop.Api.Models;

public class ApplicationUser : IdentityUser
{
    public required string Name { get; set; }
}