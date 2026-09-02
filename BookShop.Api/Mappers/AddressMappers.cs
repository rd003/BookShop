using BookShop.Api.Models.DTOs;
using BookShop.Api.Models.Entities;

namespace BookShop.Api.Mappers;

public static class AddressMappers
{
    public static ReadAddressDto ToDto(this Address address)
    {
        return new ReadAddressDto
        {
            Id = address.Id,
            FullName = address.FullName,
            City = address.City,
            Country = address.Country,
            IsDefault = address.IsDefault,
            Line1 = address.Line1,
            Line2 = address.Line2,
            Phone = address.Phone,
            PostalCode = address.PostalCode,
            State = address.State
        };
    }

    public static Address ToDomain(this CreateAddressDto address)
    {
        return new Address
        {
            FullName = address.FullName,
            City = address.City,
            Country = address.Country,
            IsDefault = address.IsDefault,
            Line1 = address.Line1,
            Line2 = address.Line2,
            Phone = address.Phone,
            PostalCode = address.PostalCode,
            State = address.State
        };
    }

    public static Address ToDomain(this UpdateAddressDto address)
    {
        return new Address
        {
            Id = address.Id,
            FullName = address.FullName,
            City = address.City,
            Country = address.Country,
            IsDefault = address.IsDefault,
            Line1 = address.Line1,
            Line2 = address.Line2,
            Phone = address.Phone,
            PostalCode = address.PostalCode,
            State = address.State
        };
    }
}