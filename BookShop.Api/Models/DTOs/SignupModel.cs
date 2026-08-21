using System.ComponentModel.DataAnnotations;

namespace BookShop.Api.Models.DTOs;

public class SignupModel
{
    [Required(ErrorMessage = "Name is required")]
    public required string Name { get; set; }

    [EmailAddress]
    [Required(ErrorMessage = "Email is required")]
    public required string Email { get; set; }

    [Required(ErrorMessage = "Password is required")]
    public required string? Password { get; set; }
}