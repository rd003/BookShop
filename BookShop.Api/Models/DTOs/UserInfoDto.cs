namespace BookShop.Api.Models.DTOs;

public record UserInfoDto(
    string Name,
    string Username,
    string Email,
    IEnumerable<string> Roles
);