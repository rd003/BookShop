using System.ComponentModel.DataAnnotations;

namespace BookShop.Api.Models.DTOs;

public class ReadGenreDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}