using System.ComponentModel.DataAnnotations;
using BookShop.Api.Constants;

namespace BookShop.Api.Models.DTOs;

public class ChangePaymentStatusDto
{
    [Required]
    public int OrderId { get; set; }

    [Required]
    [EnumDataType(typeof(PaymentStatus))]
    public PaymentStatus? PaymentStatus { get; set; }
}