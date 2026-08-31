using System.ComponentModel.DataAnnotations;

namespace BookShop.Api.Models.DTOs;

public class UpdateBookDto
{
    [MaxLength(200)]
    public string? Title { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }

    [MaxLength(20)]
    public string? Isbn { get; set; }

    public decimal? Price { get; set; }
    public int? StockQuantity { get; set; }
    public string? CoverImageUrl { get; set; }

    public int? PublisherId { get; set; }
    public string? NewPublisherName { get; set; }

    // null = don't touch genres/authors at all; provided (even empty) = replace with this set
    public List<int>? GenreIds { get; set; }
    public IEnumerable<string>? NewGenreNames { get; set; }
    public List<int>? AuthorIds { get; set; }
    public IEnumerable<string>? NewAuthorNames { get; set; }
}