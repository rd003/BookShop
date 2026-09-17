using BookShop.Api.Constants;

namespace BookShop.Api.Models.DTOs;

public class GetUserOrderDto
{
    public string OrderNumber { get; set; } = null!;
    public DateTimeOffset OrderDate { get; set; }
    public OrderStatus OrderStatus { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public PaymentStatus PaymentStatus { get; set; }
    public ReadAddressDto ShippingAddress { get; set; } = null!;
    public IEnumerable<ReadOrderItemDto> OrderItems { get; set; } = [];
    public decimal OrderTotal { get; set; }
}