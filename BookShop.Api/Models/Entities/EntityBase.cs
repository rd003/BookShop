namespace BookShop.Api.Models.Entities;

public abstract class EntityBase
{
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public DateTime Updated { get; set; } = DateTime.UtcNow;
    public DateTime? Deleted { get; set; }
}