namespace BookShop.Api.Models.DTOs;

public class GetUserCartDto
{
    public int CartId { get; set; }
    public IEnumerable<ReadCartItemDto> CartItems { get; set; } = [];
    public decimal TotalAmount { get => CartItems.Sum(ci => ci.TotalPrice); }
    public int TotalItems { get => CartItems.Sum(ci => ci.Quantity); }
}