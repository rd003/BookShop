using BookShop.Api.Constants;
using Microsoft.AspNetCore.Mvc;

namespace BookShop.Api.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class EnumsController : ControllerBase
{
    [HttpGet("order-statuses")]
    public IActionResult GetOrderStatus() => Ok(GetEnumValues<OrderStatus>());

    [HttpGet("payment-statuses")]
    public IActionResult GetPaymentStatuses() => Ok(GetEnumValues<PaymentStatus>());

    [HttpGet("payment-methods")]
    public IActionResult GetPaymentMethods() => Ok(GetEnumValues<PaymentMethod>());

    private static IEnumerable<object> GetEnumValues<TEnum>() where TEnum : struct, Enum =>
        Enum.GetValues<TEnum>().Select(e => new { Name = e.ToString(), Value = Convert.ToInt32(e) });
}