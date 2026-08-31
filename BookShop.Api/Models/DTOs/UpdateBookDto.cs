using System.ComponentModel.DataAnnotations;

namespace BookShop.Api.Models.DTOs;

public class UpdateBookDto
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string Isbn { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public string CoverImageUrl { get; set; } = string.Empty;

    public int? PublisherId { get; set; }

    // In case, if you want to create a new publisher
    public string? NewPublisherName { get; set; }

    public List<int> ExistingGenreIds { get; set; } = [];
    public IEnumerable<string> NewGenreNames { get; set; } = [];
    public List<int> ExistingAuthorIds { get; set; } = [];
    public IEnumerable<string> NewAuthorNames { get; set; } = [];
}