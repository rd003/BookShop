namespace BookShop.Api.Helpers;

public static class PagedListExtension
{
    // Maps PagedList<TSource> -> PagedList<TDest> using the given mapper func (e.g. GenreMappers.ToDto)
    public static PagedList<TDest> ToPagedList<TSource, TDest>(
        this PagedList<TSource> source, Func<TSource, TDest> mapper)
        where TSource : class
        where TDest : class
    {
        var mappedItems = source.Items.Select(mapper).ToList();
        return new PagedList<TDest>(mappedItems, source.TotalCount, source.PageNumber, source.PageSize);
    }
}