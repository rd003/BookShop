using BookShop.Api.Constants;
using BookShop.Api.Exceptions;
using BookShop.Api.Helpers;
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
public class OrdersController(AppDbContext context, UserManager<ApplicationUser> userManager, SortHelper<Order> sortHelper) : ControllerBase
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
        context.Orders.Add(order);

        // remove cart items
        foreach (var item in cartItems)
        {
            context.CartItems.Remove(item);
        }

        try
        {
            await context.SaveChangesAsync();
            await tran.CommitAsync();
            GetUserOrderDto orderDto = await GetUserOrderAsync(order.OrderNumber);
            return CreatedAtRoute(nameof(GetOrder), new { orderNumber = order.OrderNumber }, orderDto);
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

    [HttpGet("{orderNumber}", Name = nameof(GetOrder))]
    public async Task<IActionResult> GetOrder(string orderNumber)
    {
        if (string.IsNullOrWhiteSpace(orderNumber))
        {
            throw new BadRequestException("Please Provide OrderNumber");
        }
        GetUserOrderDto order = await GetUserOrderAsync(orderNumber);
        return Ok(order);
    }

    [HttpGet]
    public async Task<IActionResult> GetOrders([FromQuery] QueryParameters queryParameters, [FromQuery] DateTime? startingOrderDate, [FromQuery] DateTime? endingOrderDate)
    {
        string[] allowedSortColumns = ["OrderDate"];
        var sortColumns = queryParameters.SortBy?.Trim().Split(',');
        var invalidColumns = sortColumns?
            .Select(s => s.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries)[0])
            .Where(col => !allowedSortColumns.Contains(col, StringComparer.OrdinalIgnoreCase))
            .ToList() ?? [];

        if (invalidColumns.Count > 0)
        {
            throw new BadRequestException($"Sorting not allowed on: {string.Join(", ", invalidColumns)}");
        }

        // Reject an inverted range explicitly — feeding it straight to the query
        // would just silently return zero rows, which reads as "no orders" rather
        // than "you asked for something impossible"
        if (startingOrderDate.HasValue && endingOrderDate.HasValue && startingOrderDate > endingOrderDate)
        {
            throw new BadRequestException("startingOrderDate cannot be after endingOrderDate");
        }

        string userId = await GetUserIdAsync();

        IQueryable<Order> ordersQuery = context.Orders
            .Where(o => o.UserId == userId)
            .AsNoTracking();

        // Each bound applied independently — supports open-ended ranges
        // (only "from" or only "to") instead of requiring both
        if (startingOrderDate.HasValue)
        {
            ordersQuery = ordersQuery.Where(o => o.OrderDate.Date >= startingOrderDate.Value.Date);
        }
        if (endingOrderDate.HasValue)
        {
            ordersQuery = ordersQuery.Where(o => o.OrderDate.Date <= endingOrderDate.Value.Date);
        }

        if (!string.IsNullOrEmpty(queryParameters.SortBy))
        {
            ordersQuery = sortHelper.ApplySort(ordersQuery, queryParameters.SortBy);
        }

        ordersQuery = ordersQuery
            .Include(o => o.OrderItems).ThenInclude(oi => oi.Book).ThenInclude(b => b!.BookAuthors).ThenInclude(ba => ba.Author)
            .Include(o => o.OrderItems).ThenInclude(oi => oi.Book).ThenInclude(b => b!.BookGenres).ThenInclude(bg => bg.Genre);

        var pagedOrders = await PagedList<Order>.ToPagedListAsync(ordersQuery, queryParameters.PageNumber, queryParameters.PageSize);

        var pagedOrderDtos = pagedOrders.ToPagedList(o => new GetUserOrderDto
        {
            OrderDate = o.OrderDate,
            OrderStatus = o.Status,
            OrderNumber = o.OrderNumber,
            OrderTotal = o.TotalAmount,
            OrderItems = o.OrderItems.Select(oi => new ReadOrderItemDto
            {
                BookId = oi.BookId,
                BookTitle = oi.Book!.Title,
                UnitPrice = oi.UnitPrice,
                Quantity = oi.Quantity,
                Authors = oi.Book!.BookAuthors.Select(ba => ba.Author!.Name).ToList(),
                Genres = oi.Book.BookGenres.Select(bg => bg.Genre!.Name).ToList()
            })
        });

        return Ok(pagedOrderDtos);
    }

    private async Task<GetUserOrderDto> GetUserOrderAsync(string orderNumber)
    {
        orderNumber = orderNumber.Trim().ToUpperInvariant();
        string userId = await GetUserIdAsync();
        var order = await context.Orders
                    .Where(o => o.UserId == userId && o.OrderNumber == orderNumber)
                    .AsNoTracking()
                    .Select(o => new GetUserOrderDto
                    {
                        OrderDate = o.OrderDate,
                        OrderStatus = o.Status,
                        OrderNumber = o.OrderNumber,
                        OrderTotal = o.TotalAmount,
                        OrderItems = o.OrderItems.Select(oi => new ReadOrderItemDto
                        {
                            BookId = oi.BookId,
                            BookTitle = oi.Book!.Title,
                            UnitPrice = oi.UnitPrice,
                            Quantity = oi.Quantity,
                            Authors = oi.Book.BookAuthors.Select(ba => ba.Author!.Name).ToList(),
                            Genres = oi.Book.BookGenres.Select(ba => ba.Genre!.Name).ToList()
                        })
                    })
                    .SingleOrDefaultAsync();
        if (order is null)
        {
            throw new NotFoundException("Order not found");
        }
        return order;
    }

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