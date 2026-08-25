namespace BookShop.Api.Models.Entities;

public class BookAuthor : EntityBase
{
    public int BookId { get; set; }
    public Book Book { get; set; } = new();

    public int AuthorId { get; set; }
    public Author Author { get; set; } = new();
}