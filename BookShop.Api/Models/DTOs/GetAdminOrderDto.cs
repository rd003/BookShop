using BookShop.Api.Constants;

namespace BookShop.Api.Models.DTOs;

public class GetAdminOrderDto
{
    public int OrderId { get; set; }
    public string CustomerEmail { get; set; } = null!;
    public string OrderNumber { get; set; } = null!;
    public DateTime OrderDate { get; set; }
    public OrderStatus OrderStatus { get; set; }
    public PaymentMethod PyamentMethod { get; set; }
    public PaymentStatus PyamentStatus { get; set; }
    public IEnumerable<ReadOrderItemDto> OrderItems { get; set; } = [];
    public decimal OrderTotal { get; set; }
}
