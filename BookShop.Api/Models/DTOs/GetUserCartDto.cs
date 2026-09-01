namespace BookShop.Api.Models.DTOs;

public class GetUserCartDto
{
    public IEnumerable<ReadCartItemDto> CartItems { get; set; } = [];
    public decimal TotalQuantity { get => CartItems.Sum(ci => ci.TotalPrice); }
}