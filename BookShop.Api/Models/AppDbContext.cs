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
        builder.Entity<Genre>().HasQueryFilter(k => k.Deleted == null);
        builder.Entity<Publisher>().HasQueryFilter(k => k.Deleted == null);
        builder.Entity<Author>().HasQueryFilter(k => k.Deleted == null);
        builder.Entity<Book>().HasQueryFilter(k => k.Deleted == null);
        builder.Entity<Address>().HasQueryFilter(k => k.Deleted == null);
        builder.Entity<Cart>().HasQueryFilter(k => k.Deleted == null);
        builder.Entity<CartItem>().HasQueryFilter(k => k.Deleted == null);
        builder.Entity<Order>().HasQueryFilter(k => k.Deleted == null);
        builder.Entity<OrderItem>().HasQueryFilter(k => k.Deleted == null);
        builder.Entity<BookAuthor>().HasQueryFilter(k => k.Deleted == null);
        builder.Entity<BookGenre>().HasQueryFilter(k => k.Deleted == null);

        builder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

        // seeding data
        var seedDate = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        builder.Entity<Genre>().HasData(
            new Genre { Id = 1, Name = "Fiction", Created = seedDate, Updated = seedDate },
            new Genre { Id = 2, Name = "Fantasy", Created = seedDate, Updated = seedDate },
            new Genre { Id = 3, Name = "Science Fiction", Created = seedDate, Updated = seedDate }
        );

        builder.Entity<Author>().HasData(
            new Author { Id = 1, Name = "J.R.R. Tolkien", Bio = "English writer, best known for The Lord of the Rings.", Created = seedDate, Updated = seedDate },
            new Author { Id = 2, Name = "Frank Herbert", Bio = "American science fiction author, best known for Dune.", Created = seedDate, Updated = seedDate }
        );

        builder.Entity<Publisher>().HasData(
            new Publisher { Id = 1, Name = "HarperCollins", Created = seedDate, Updated = seedDate },
            new Publisher { Id = 2, Name = "Ace Books", Created = seedDate, Updated = seedDate }
        );

        builder.Entity<Book>().HasData(
            new Book
            {
                Id = 1,
                Title = "The Fellowship of the Ring",
                Description = "The first volume of The Lord of the Rings.",
                Isbn = "9780618346257",
                Price = 12.99m,
                StockQuantity = 50,
                CoverImageUrl = "",
                Created = seedDate,
                Updated = seedDate,
                PublisherId = 1
            },
            new Book
            {
                Id = 2,
                Title = "Dune",
                Description = "A science fiction novel set on the desert planet Arrakis.",
                Isbn = "9780441172719",
                Price = 15.99m,
                StockQuantity = 40,
                CoverImageUrl = "",
                Created = seedDate,
                Updated = seedDate,
                PublisherId = 2
            }
        );

        builder.Entity<BookAuthor>().HasData(
            new BookAuthor { BookId = 1, AuthorId = 1 },
            new BookAuthor { BookId = 2, AuthorId = 2 }
        );

        builder.Entity<BookGenre>().HasData(
            new BookGenre { BookId = 1, GenreId = 2 }, // Fellowship - Fantasy
            new BookGenre { BookId = 1, GenreId = 1 }, // Fellowship - Fiction
            new BookGenre { BookId = 2, GenreId = 3 }, // Dune - Science Fiction
            new BookGenre { BookId = 2, GenreId = 1 }  // Dune - Fiction
        );

        base.OnModelCreating(builder);
    }
}