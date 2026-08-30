using System.ComponentModel.DataAnnotations;

namespace BookShop.Api.Models.DTOs;

public class CreatePublisherDto
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
}