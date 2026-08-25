using BookShop.Api.Constants;

namespace BookShop.Api.Models.Entities;

public class Order : EntityBase
{
    public int Id { get; set; }
    public string UserId { get; set; } = null!;
    public DateTime OrderDate { get; set; }
    public decimal TotalAmount { get; set; }

    public OrderStatus Status { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public PaymentStatus PaymentStatus { get; set; }

    public int ShippingAddressId { get; set; }
    public Address ShippingAddress { get; set; } = null!;

    public List<OrderItem> OrderItems { get; set; } = [];
}