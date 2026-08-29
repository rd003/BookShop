namespace BookShop.Api.Models.Entities;

public class Book : EntityBase
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Isbn { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public string CoverImageUrl { get; set; } = string.Empty;

    public int PublisherId { get; set; }

    public Publisher? Publisher { get; set; }

    public List<BookAuthor> BookAuthors { get; set; } = [];
    public List<BookGenre> BookGenres { get; set; } = [];
}