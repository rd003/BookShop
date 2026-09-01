using System.ComponentModel.DataAnnotations;

namespace BookShop.Api.Models.DTOs;

public class AddCartItemDto
{
    [Range(1, int.MaxValue, ErrorMessage = "BookId must have valid positive value.")]
    public int BookId { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be atleast 1.")]
    public int Quantity { get; set; }
}