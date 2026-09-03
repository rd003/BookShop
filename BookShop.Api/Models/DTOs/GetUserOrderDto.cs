namespace BookShop.Api.Models.DTOs;

public class GetUserOrderDto
{
    public string OrderNumber { get; set; } = null!;
    public DateTime OrderDate { get; set; }
    public IEnumerable<ReadOrderItemDto> OrderItems { get; set; } = [];
    public decimal OrderTotal { get => OrderItems.Sum(oi => oi.ItemTotalPrice); }
}