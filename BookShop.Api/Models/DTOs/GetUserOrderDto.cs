using BookShop.Api.Constants;

namespace BookShop.Api.Models.DTOs;

public class GetUserOrderDto
{
    public string OrderNumber { get; set; } = null!;
    public OrderStatus OrderStatus { get; set; }
    public DateTime OrderDate { get; set; }
    public IEnumerable<ReadOrderItemDto> OrderItems { get; set; } = [];
    public decimal OrderTotal { get; set; }
}