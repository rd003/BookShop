namespace BookShop.Api.Models.DTOs;

public class ReadCartItemDto
{
    public int CartItemId { get; set; }
    public int BookId { get; set; }
    public string BookTitle { get; set; } = string.Empty;
    public IEnumerable<string> Authors { get; set; } = [];
    public IEnumerable<string> Genres { get; set; } = [];
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
    public decimal TotalPrice { get => UnitPrice * Quantity; }
}