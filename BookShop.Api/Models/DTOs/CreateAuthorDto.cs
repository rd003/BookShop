using System.ComponentModel.DataAnnotations;

namespace BookShop.Api.Models.DTOs;

public class CreateAuthorDto
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(200)]
    public string Bio { get; set; } = string.Empty;
}