using BookShop.Api.Models.DTOs;
using BookShop.Api.Models.Entities;

namespace BookShop.Api.Mappers;

public static class BookMappers
{
    public static Book ToDomain(this CreateBookDto book)
    {
        return new Book
        {
            Title = book.Title,
            Isbn = book.Isbn,
            PublisherId = book.PublisherId ?? 0,
            Updated = DateTime.UtcNow,
            Description = book.Description,
            CoverImageUrl = book.CoverImageUrl,
            Price = book.Price,
            StockQuantity = book.StockQuantity
        };
    }
}