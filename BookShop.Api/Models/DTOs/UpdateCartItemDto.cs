using System.ComponentModel.DataAnnotations;

namespace BookShop.Api.Models.DTOs;

public class UpdateCartItemDto
{
    [Range(0, int.MaxValue, ErrorMessage = "Quantity must be atleast 0.")]
    public int Quantity { get; set; }
}