using BookShop.Api.Models.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BookShop.Api.Models;

public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> op) : base(op)
    {

    }
    public DbSet<TokenInfo> TokenInfos { get; set; }
    public DbSet<Author> Authors { get; set; }
    public DbSet<Genre> Genres { get; set; }
    public DbSet<Publisher> Publishers { get; set; }
    public DbSet<Book> Books { get; set; }
    public DbSet<BookAuthor> BookAuthors { get; set; }
    public DbSet<BookGenre> BookGenres { get; set; }
    public DbSet<Address> Addresses { get; set; }
    public DbSet<Cart> Carts { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<Genre>().HasQueryFilter(k => k.Deleted != null);
        builder.Entity<Publisher>().HasQueryFilter(k => k.Deleted != null);
        builder.Entity<Author>().HasQueryFilter(k => k.Deleted != null);
        builder.Entity<Book>().HasQueryFilter(k => k.Deleted != null);
        builder.Entity<Address>().HasQueryFilter(k => k.Deleted != null);
        builder.Entity<Cart>().HasQueryFilter(k => k.Deleted != null);
        builder.Entity<CartItem>().HasQueryFilter(k => k.Deleted != null);
        builder.Entity<Order>().HasQueryFilter(k => k.Deleted != null);
        builder.Entity<OrderItem>().HasQueryFilter(k => k.Deleted != null);


        builder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        base.OnModelCreating(builder);
    }
}