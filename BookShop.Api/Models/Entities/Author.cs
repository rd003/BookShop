namespace BookShop.Api.Models.Entities;

public class Author : EntityBase
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;

    public List<BookAuthor> BookAuthors { get; set; } = [];
}