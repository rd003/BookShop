using BookShop.Api.Constants;
using BookShop.Api.Exceptions;
using BookShop.Api.Models;
using BookShop.Api.Models.DTOs;
using BookShop.Api.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookShop.Api.Controllers;

[Authorize]
[ApiController]
[Route("/api/[controller]")]
public class OrdersController(AppDbContext context, UserManager<ApplicationUser> userManager) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CreateOrder(CreateOrderDto createOrderDto)
    {
        string userId = await GetUserIdAsync();
        using var tran = await context.Database.BeginTransactionAsync();

        // confirm it is the logged-in user's address and valid
        var isValidAddress = await context.Addresses.AnyAsync(a => a.UserId == userId && a.Id == createOrderDto.ShippingAddressId);
        if (!isValidAddress)
        {
            throw new BadRequestException("Invalid ShippingAddress");
        }

        var cartItems = await context
        .CartItems
        .Include(c => c.Cart)
        .Include(c => c.Book)
        .Where(a => a.Cart!.UserId == userId)
        .ToListAsync();

        if (cartItems.Count == 0)
        {
            throw new NotFoundException("Cart not found");
        }

        // create order from cart
        var order = new Order
        {
            OrderNumber = GenerateOrderNumber(),
            OrderDate = DateTime.UtcNow,
            PaymentMethod = PaymentMethod.CashOnDelivery,
            ShippingAddressId = createOrderDto.ShippingAddressId,
            UserId = userId,
            Status = OrderStatus.Pending
        };
        foreach (var cartItem in cartItems)
        {
            var rowsAffected = await context.Books
        .Where(b => b.Id == cartItem.BookId && b.StockQuantity >= cartItem.Quantity)
        .ExecuteUpdateAsync(s => s.SetProperty(b => b.StockQuantity, b => b.StockQuantity - cartItem.Quantity));

            if (rowsAffected == 0)
            {
                await tran.RollbackAsync();
                throw new BadRequestException($"Insufficient stock for '{cartItem.Book!.Title}'");
            }

            var orderItem = new OrderItem
            {
                OrderId = order.Id,
                BookId = cartItem.BookId,
                Quantity = cartItem.Quantity,
                UnitPrice = cartItem.Book!.Price
            };
            order.OrderItems.Add(orderItem);
        }
        order.TotalAmount = order.OrderItems.Sum(oi => oi.UnitPrice * oi.Quantity);

        // remove cart items
        foreach (var item in cartItems)
        {
            context.CartItems.Remove(item);
        }

        try
        {
            await context.SaveChangesAsync();
            await tran.CommitAsync();
            return Ok(); // Todo: create createdAtRout later
        }
        catch (DbUpdateConcurrencyException)
        {
            await tran.RollbackAsync();
            throw new BadRequestException("Your cart was already checked out.");
        }
        catch (Microsoft.Data.Sqlite.SqliteException ex) when (ex.SqliteErrorCode == 5) // SQLITE_BUSY
        {
            await tran.RollbackAsync();
            throw new BadRequestException("System busy, please retry.");
        }
    }

    [HttpGet]
    private async Task<IActionResult> GetOrder()
    {
        string userId = await GetUserIdAsync();
        return Ok();
    }

    // private async Task<GetUserOrderDto> GetUserOrder(string orderNumber)
    // {

    // }

    private async Task<string> GetUserIdAsync()
    {
        var username = User.Identity?.Name ?? throw new UnAuthorizedException("User is not authorized");
        var currentUser = await userManager.FindByNameAsync(username) ?? throw new UnAuthorizedException("User is not authorized");
        return currentUser.Id;
    }

    private static string GenerateOrderNumber()
    {
        var datePart = DateTime.UtcNow.ToString("yyyyMMdd");
        var randomPart = Guid.NewGuid().ToString("N")[..5].ToUpperInvariant();
        return $"ORD-{datePart}-{randomPart}";
    }
}