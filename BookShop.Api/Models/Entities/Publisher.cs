namespace BookShop.Api.Models.Entities;

public class Publisher : EntityBase
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    public List<Book> Books { get; set; } = [];
}