using System.ComponentModel.DataAnnotations;

namespace BookShop.Api.Models.DTOs;

public class LoginModel
{
    [Required(ErrorMessage = "Username is required")]
    [MaxLength(30)]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required")]
    [MaxLength(30)]
    public string Password { get; set; } = string.Empty;
}