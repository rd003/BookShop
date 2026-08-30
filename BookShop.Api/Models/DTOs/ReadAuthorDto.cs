namespace BookShop.Api.Models.DTOs;

public class ReadAuthorDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
}