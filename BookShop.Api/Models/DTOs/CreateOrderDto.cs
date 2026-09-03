using System.ComponentModel.DataAnnotations;

namespace BookShop.Api.Models.DTOs;

public class CreateOrderDto
{
    [Required]
    public int ShippingAddressId { get; set; }
}