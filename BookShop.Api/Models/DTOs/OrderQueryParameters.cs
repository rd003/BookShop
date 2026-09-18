using BookShop.Api.Constants;

namespace BookShop.Api.Models.DTOs;

public class OrderQueryParameters
{
    private int _pageSize = 5;
    private int _pageNumber = 1;
    private string? _sortBy;
    private const int MaxPageSize = 50;

    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = value > MaxPageSize ? MaxPageSize : value;
    }

    public int PageNumber
    {
        get => _pageNumber;
        set => _pageNumber = value <= 0 ? 1 : value;
    }

    public string? SortBy
    {
        get => _sortBy;
        set =>
            _sortBy = (value == null) ? value : value.ToLower();
    }

    public DateTimeOffset? StartingOrderDate { get; set; }
    public DateTimeOffset? EndingOrderDate { get; set; }
    public OrderStatus? OrderStatus { get; set; }
}