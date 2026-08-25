namespace BookShop.Api.Models.Entities;

public class Genre : EntityBase
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    public List<BookGenre> BookGenres { get; set; } = [];
}