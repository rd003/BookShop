using BookShop.Api.Constants;
using BookShop.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

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

        if (context.Database.GetPendingMigrations().Count() > 0)
        {
            await context.Database.MigrateAsync();
        }

        try
        {
            await SeedAdminData(userManager, roleManager, logger);
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
}