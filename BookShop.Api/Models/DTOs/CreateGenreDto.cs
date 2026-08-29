using System.ComponentModel.DataAnnotations;

namespace BookShop.Api.Models.DTOs;

public class CreateGenreDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
}