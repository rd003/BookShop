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
public class CartsController(AppDbContext context, UserManager<ApplicationUser> userManager) : ControllerBase
{

    // POST: api/carts/items
    [HttpPost("items")]
    public async Task<IActionResult> AddCartItem(AddCartItemDto cartItemDto)
    {
        string userId = await GetUserIdAsync();

        using var tran = await context.Database.BeginTransactionAsync();

        // validate book
        Book? book = await context.Books.FindAsync(cartItemDto.BookId) ?? throw new BadRequestException("Invalid BookId");

        // create cart if not exist
        Cart? cart = await context.Carts.SingleOrDefaultAsync(c => c.UserId == userId);

        if (cart is null)
        {
            cart = new Cart
            {
                UserId = userId
            };
            context.Carts.Add(cart);
            await context.SaveChangesAsync();
        }
        cart.Updated = DateTime.UtcNow;

        // add item to cart if not exists
        var existingCartItem = await context.CartItems
        .IgnoreQueryFilters()
        .SingleOrDefaultAsync(ci => ci.CartId == cart.Id && ci.BookId == cartItemDto.BookId);

        // validate quantity against current stock
        int currentQuantityInCart = (existingCartItem?.Deleted is null) ? (existingCartItem?.Quantity ?? 0) : 0;
        int resultingQuantity = currentQuantityInCart + cartItemDto.Quantity;

        if (resultingQuantity > book.StockQuantity)
        {
            throw new BadRequestException("Not sufficient quantity");
        }

        if (existingCartItem is null)
        {
            var newCartItem = new CartItem
            {
                CartId = cart.Id,
                BookId = cartItemDto.BookId,
                Quantity = cartItemDto.Quantity
            };
            context.CartItems.Add(newCartItem);
        }
        // resurrect soft-deleted row, instead of creating a duplicate
        else if (existingCartItem.Deleted is not null)
        {
            existingCartItem.Deleted = null;
            existingCartItem.Quantity = cartItemDto.Quantity;
        }
        // else update cart item
        else
        {
            existingCartItem.Quantity += cartItemDto.Quantity;
        }

        try
        {
            await context.SaveChangesAsync();
            await tran.CommitAsync();
        }
        catch (DbUpdateException)
        {
            await tran.RollbackAsync();
            throw new ConflictException("This item was just modified by another request. Please retry.");
        }
        return NoContent(); // TODO: Or should I return a user cart?
    }

    // Note: this handles increment and decrement, but client need to handle. If client pass quantity:0, cartItem will be deleted
    [HttpPut("items/{cartItemId:int}")]
    public async Task<IActionResult> UpdateCartItemQuantity(int cartItemId, [FromBody] UpdateCartItemDto cartItemDto)
    {
        string userId = await GetUserIdAsync();

        var cartItem = await context.CartItems
        .Include(ci => ci.Book)
        .Include(ci => ci.Cart)
        .FirstOrDefaultAsync(ci => ci.Id == cartItemId && ci.Cart!.UserId == userId) ?? throw new BadRequestException("Invalid cartItemId");

        if (cartItemDto.Quantity > cartItem.Book!.StockQuantity)
        {
            throw new BadRequestException("Insufficient quantity");
        }
        cartItem.Quantity = cartItemDto.Quantity;
        if (cartItemDto.Quantity == 0)
        {
            cartItem.Deleted = DateTime.UtcNow;
        }
        cartItem.Cart!.Updated = DateTime.UtcNow;
        await context.SaveChangesAsync();
        return NoContent(); //TODO: shoud I return a userCart?
    }

    [HttpDelete("items")]
    public async Task<IActionResult> EmptyCart()
    {
        var userId = await GetUserIdAsync();

        // I am opting out soft delete, I think it was a bad design choice
        await context.CartItems
        .Where(ci => ci.Cart.UserId == userId)
        .ExecuteDeleteAsync();

        return NoContent();
    }

    [HttpGet("items")]
    public async Task<IActionResult> GetUserCart()
    {
        return NoContent();
    }

    // private  GetCartAsync(string userId)
    // {

    // }

    private async Task<string> GetUserIdAsync()
    {
        var username = User.Identity?.Name ?? throw new UnAuthorizedException("User is not authorized");
        var currentUser = await userManager.FindByNameAsync(username) ?? throw new UnAuthorizedException("User is not authorized");
        return currentUser.Id;
    }

}