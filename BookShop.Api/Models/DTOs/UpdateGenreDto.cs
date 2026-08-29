using System.ComponentModel.DataAnnotations;

namespace BookShop.Api.Models.DTOs;

public class UpdateGenreDto
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
}