namespace BookShop.Api.Models.Entities;

public class Cart : EntityBase
{
    public int Id { get; set; }
    public string UserId { get; set; } = null!;

    public List<CartItem> CartItems { get; set; } = [];
}