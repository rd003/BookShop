namespace BookShop.Api.Models.Entities;

public class BookGenre
{
    public int BookId { get; set; }
    public Book? Book { get; set; }

    public int GenreId { get; set; }
    public Genre? Genre { get; set; }
    public DateTime? Deleted { get; set; }
}