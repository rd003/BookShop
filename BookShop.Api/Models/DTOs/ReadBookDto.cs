namespace BookShop.Api.Models.DTOs;

public class ReadBookDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Isbn { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public string CoverImageUrl { get; set; } = string.Empty;

    public int PublisherId { get; set; }

    public string PublisherName { get; set; } = string.Empty;
    public IEnumerable<ReadGenreDto> Genres { get; set; } = [];
    public IEnumerable<ReadAuthorDto> Authors { get; set; } = [];

}