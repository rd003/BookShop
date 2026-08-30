using BookShop.Api.Models.DTOs;
using BookShop.Api.Models.Entities;

namespace BookShop.Api.Mappers;

public static class PublisherMappers
{
    public static ReadPublisherDto ToDto(this Publisher publisher)
    {
        return new ReadPublisherDto
        {
            Id = publisher.Id,
            Name = publisher.Name
        };
    }

    public static Publisher ToDomain(this CreatePublisherDto publisher)
    {
        return new Publisher
        {
            Name = publisher.Name
        };
    }

    public static Publisher ToDomain(this UpdatePublisherDto publisher)
    {
        return new Publisher
        {
            Id = publisher.Id,
            Name = publisher.Name
        };
    }
}