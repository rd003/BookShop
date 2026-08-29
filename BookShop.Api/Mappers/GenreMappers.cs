using BookShop.Api.Models.DTOs;
using BookShop.Api.Models.Entities;

namespace BookShop.Api.Mappers;

public static class GenreMappers
{
    public static ReadGenreDto ToDto(this Genre genre)
    {
        return new ReadGenreDto
        {
            Id = genre.Id,
            Name = genre.Name
        };
    }

    public static Genre ToDomain(this CreateGenreDto genre)
    {
        return new Genre
        {
            Name = genre.Name
        };
    }

    public static Genre ToDomain(this UpdateGenreDto genre)
    {
        return new Genre
        {
            Id = genre.Id,
            Name = genre.Name
        };
    }
}