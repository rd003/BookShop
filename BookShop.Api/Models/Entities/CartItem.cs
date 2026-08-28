namespace BookShop.Api.Models.Entities;

public class CartItem : EntityBase
{
    public int Id { get; set; }

    public int CartId { get; set; }
    public Cart Cart { get; set; } = null!;

    public int BookId { get; set; }
    public Book Book { get; set; } = null!;

    public int Quantity { get; set; }
}