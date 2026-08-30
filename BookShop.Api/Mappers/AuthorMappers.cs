using BookShop.Api.Models.DTOs;
using BookShop.Api.Models.Entities;

namespace BookShop.Api.Mappers;

public static class AuthorMappers
{
    public static ReadAuthorDto ToDto(this Author author)
    {
        return new ReadAuthorDto
        {
            Id = author.Id,
            Name = author.Name,
            Bio = author.Bio
        };
    }

    public static Author ToDomain(this CreateAuthorDto author)
    {
        return new Author
        {
            Name = author.Name,
            Bio = author.Bio
        };
    }

    public static Author ToDomain(this UpdateAuthorDto author)
    {
        return new Author
        {
            Id = author.Id,
            Name = author.Name,
            Bio = author.Bio
        };
    }
}