using BookShop.Api.Constants;
using BookShop.Api.Models;
using BookShop.Api.Models.Entities;
using Microsoft.AspNetCore.Identity;

namespace BookShop.Api.Data;

public class DbSeeder
{
    public static async Task SeedData(IApplicationBuilder app)
    { // Create a scoped service provider to resolve dependencies
        using var scope = app.ApplicationServices.CreateScope();

        // resolve the logger service
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<DbSeeder>>();
        var userManager = scope.ServiceProvider.GetService<UserManager<ApplicationUser>>();
        var roleManager = scope.ServiceProvider.GetService<RoleManager<IdentityRole>>();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        try
        {
            await SeedAdminData(userManager, roleManager, logger);
            await SeedBooksData(context, logger);
        }

        catch (Exception ex)
        {
            logger.LogCritical(ex.Message);
        }
    }

    private static async Task SeedAdminData(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, ILogger logger)
    {
        // Check if any users exist to prevent duplicate seeding
        if (userManager.Users.Any() == false)
        {
            var user = new ApplicationUser
            {
                Name = "Admin",
                UserName = "admin@example.com",
                Email = "admin@example.com",
                EmailConfirmed = true,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            // Create Admin role if it doesn't exist
            if ((await roleManager.RoleExistsAsync(Roles.Admin)) == false)
            {
                logger.LogInformation("Admin role is creating");
                var roleResult = await roleManager
                  .CreateAsync(new IdentityRole(Roles.Admin));

                if (roleResult.Succeeded == false)
                {
                    var roleErros = roleResult.Errors.Select(e => e.Description);
                    logger.LogError($"Failed to create admin role. Errors : {string.Join(",", roleErros)}");

                    return;
                }
                logger.LogInformation("Admin role is created");
            }

            // Attempt to create admin user
            var createUserResult = await userManager
                  .CreateAsync(user: user, password: "Admin@123");

            // Validate user creation
            if (createUserResult.Succeeded == false)
            {
                var errors = createUserResult.Errors.Select(e => e.Description);
                logger.LogError(
                    $"Failed to create admin user. Errors: {string.Join(", ", errors)}"
                );
                return;
            }

            // adding role to user
            var addUserToRoleResult = await userManager
                            .AddToRoleAsync(user: user, role: Roles.Admin);

            if (addUserToRoleResult.Succeeded == false)
            {
                var errors = addUserToRoleResult.Errors.Select(e => e.Description);
                logger.LogError($"Failed to add admin role to user. Errors : {string.Join(",", errors)}");
            }
            logger.LogInformation("Admin user is created");
        }
    }
    private static async Task SeedBooksData(AppDbContext context, ILogger logger)
    {
        // Skip if catalog already seeded
        if (context.Books.Any())
            return;

        var fiction = new Genre { Name = "Fiction", Updated = DateTime.UtcNow };
        var fantasy = new Genre { Name = "Fantasy", Updated = DateTime.UtcNow };
        var scienceFiction = new Genre { Name = "Science Fiction", Updated = DateTime.UtcNow };

        var author1 = new Author { Name = "J.R.R. Tolkien", Bio = "English writer, best known for The Lord of the Rings.", Updated = DateTime.UtcNow };
        var author2 = new Author { Name = "Frank Herbert", Bio = "American science fiction author, best known for Dune.", Updated = DateTime.UtcNow };

        var publisher1 = new Publisher { Name = "HarperCollins", Updated = DateTime.UtcNow };
        var publisher2 = new Publisher { Name = "Ace Books", Updated = DateTime.UtcNow };

        // Insert lookups first so their generated Ids are available for the join entities below
        context.Genres.AddRange(fiction, fantasy, scienceFiction);
        context.Authors.AddRange(author1, author2);
        context.Publishers.AddRange(publisher1, publisher2);
        await context.SaveChangesAsync();

        var book1 = new Book
        {
            Title = "The Fellowship of the Ring",
            Description = "The first volume of The Lord of the Rings.",
            Isbn = "9780618346257",
            Price = 12.99m,
            StockQuantity = 50,
            CoverImageUrl = "",
            Updated = DateTime.UtcNow,
            PublisherId = publisher1.Id
        };

        var book2 = new Book
        {
            Title = "Dune",
            Description = "A science fiction novel set on the desert planet Arrakis.",
            Isbn = "9780441172719",
            Price = 15.99m,
            StockQuantity = 40,
            CoverImageUrl = "",
            Created = DateTime.UtcNow,
            Updated = DateTime.UtcNow,
            PublisherId = publisher2.Id
        };

        context.Books.AddRange(book1, book2);
        await context.SaveChangesAsync();

        // Join rows — needs Book/Author/Genre Ids, so this runs after both are saved
        context.BookAuthors.AddRange(
            new BookAuthor { BookId = book1.Id, AuthorId = author1.Id },
            new BookAuthor { BookId = book2.Id, AuthorId = author2.Id }
        );

        context.BookGenres.AddRange(
            new BookGenre { BookId = book1.Id, GenreId = fantasy.Id },
            new BookGenre { BookId = book1.Id, GenreId = fiction.Id },
            new BookGenre { BookId = book2.Id, GenreId = scienceFiction.Id },
            new BookGenre { BookId = book2.Id, GenreId = fiction.Id }
        );

        await context.SaveChangesAsync();
        logger.LogInformation("Book catalog seed data created");
    }
}