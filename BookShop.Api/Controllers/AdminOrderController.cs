using BookShop.Api.Constants;
using BookShop.Api.Exceptions;
using BookShop.Api.Helpers;
using BookShop.Api.Models;
using BookShop.Api.Models.DTOs;
using BookShop.Api.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookShop.Api.Controllers;

//TODO: uncoment it
// [Authorize(Roles = Roles.Admin)]
[ApiController]
[Route("/api/admin/orders")]
public class AdminOrderController(AppDbContext context, SortHelper<Order> sortHelper) : ControllerBase
{
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

        if (startingOrderDate.HasValue && endingOrderDate.HasValue && startingOrderDate > endingOrderDate)
        {
            throw new BadRequestException("startingOrderDate cannot be after endingOrderDate");
        }

        IQueryable<Order> ordersQuery = context.Orders
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
            .Include(o => o.User)
            .Include(o => o.OrderItems).ThenInclude(oi => oi.Book).ThenInclude(b => b!.BookAuthors).ThenInclude(ba => ba.Author)
            .Include(o => o.OrderItems).ThenInclude(oi => oi.Book).ThenInclude(b => b!.BookGenres).ThenInclude(bg => bg.Genre);

        var pagedOrders = await PagedList<Order>.ToPagedListAsync(ordersQuery, queryParameters.PageNumber, queryParameters.PageSize);

        var pagedOrderDtos = pagedOrders.ToPagedList(o => new GetAdminOrderDto
        {
            OrderId = o.Id,
            OrderDate = o.OrderDate,
            OrderStatus = o.Status,
            OrderNumber = o.OrderNumber,
            OrderTotal = o.TotalAmount,
            PyamentMethod = o.PaymentMethod,
            PyamentStatus = o.PaymentStatus,
            CustomerEmail = o.User != null ? o.User.Email ?? "N/A" : "N/A",
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

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetOrders(int id)
    {
        var order = await context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems).ThenInclude(oi => oi.Book).ThenInclude(b => b!.BookAuthors).ThenInclude(ba => ba.Author)
            .Include(o => o.OrderItems).ThenInclude(oi => oi.Book).ThenInclude(b => b!.BookGenres).ThenInclude(bg => bg.Genre)
            .AsNoTracking()
            .Select(
                o => new GetAdminOrderDto
                {
                    OrderId = o.Id,
                    OrderDate = o.OrderDate,
                    OrderStatus = o.Status,
                    OrderNumber = o.OrderNumber,
                    OrderTotal = o.TotalAmount,
                    PyamentMethod = o.PaymentMethod,
                    PyamentStatus = o.PaymentStatus,
                    CustomerEmail = o.User != null ? o.User.Email ?? "N/A" : "N/A",
                    OrderItems = o.OrderItems.Select(oi => new ReadOrderItemDto
                    {
                        BookId = oi.BookId,
                        BookTitle = oi.Book!.Title,
                        UnitPrice = oi.UnitPrice,
                        Quantity = oi.Quantity,
                        Authors = oi.Book!.BookAuthors.Select(ba => ba.Author!.Name).ToList(),
                        Genres = oi.Book.BookGenres.Select(bg => bg.Genre!.Name).ToList()
                    })
                }
            ).SingleOrDefaultAsync(o => o.OrderId == id);
        if (order is null)
        {
            throw new NotFoundException("Order not found");
        }
        return Ok(order);
    }

    [HttpPost("change-payment-status")]
    public async Task<IActionResult> ChangePaymentStatus(ChangePaymentStatusDto paymentStatusDto)
    {
        var order = await context.Orders.FindAsync(paymentStatusDto.OrderId) ?? throw new NotFoundException("Order not found");

        order.PaymentStatus = paymentStatusDto.PaymentStatus!.Value;

        await context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("change-order-status")]
    public async Task<IActionResult> ChangeOrderStatus(ChangeOrderStatusDto orderStatusDto)
    {
        var order = await context.Orders.FindAsync(orderStatusDto.OrderId) ?? throw new NotFoundException("Order not found");

        order.Status = orderStatusDto.OrderStatus!.Value;

        await context.SaveChangesAsync();
        return NoContent();
    }

}