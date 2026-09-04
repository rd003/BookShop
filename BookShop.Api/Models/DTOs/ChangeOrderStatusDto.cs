using System.ComponentModel.DataAnnotations;
using BookShop.Api.Constants;

namespace BookShop.Api.Models.DTOs;

public class ChangeOrderStatusDto
{
    [Required]
    public int OrderId { get; set; }

    [Required]
    [EnumDataType(typeof(OrderStatus))]
    public OrderStatus? OrderStatus { get; set; }
}