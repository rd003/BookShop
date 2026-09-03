namespace BookShop.Api.Models.DTOs;

public class ReadOrderItemDto
{
    public int BookId { get; set; }
    public string BookTitle { get; set; } = null!;
    public IEnumerable<string> Authors { get; set; } = [];
    public IEnumerable<string> Genres { get; set; } = [];
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal ItemTotalPrice { get => UnitPrice * Quantity; }
}