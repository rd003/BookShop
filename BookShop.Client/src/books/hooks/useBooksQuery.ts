import { useInfiniteQuery } from "@tanstack/react-query";
import type { ReadBook } from "../types/readBook";
import type { PagedList } from "@/shared/types/pagedList";
import { fetchBooks } from "../booksApi";

export function useBooksQuery(searchTerm: string, genreIds: number[]) {
    const bookQueryParam = { pageNumber: 1, pageSize: 10, searchTerm, sortBy: '' };

    const { data,
        status,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage } = useInfiniteQuery<PagedList<ReadBook>, Error>({
            queryKey: ['books', bookQueryParam, genreIds],
            queryFn: ({ pageParam }) => fetchBooks({ ...bookQueryParam, pageNumber: pageParam as number }, genreIds),
            initialPageParam: 1,
            getNextPageParam: (lastPage) => lastPage.hasNext ? lastPage.pageNumber + 1 : undefined,
            staleTime: 30_000,
            gcTime: 5 * 60_000
        });
    const books: ReadBook[] = data?.pages.flatMap(page => page.items) ?? [];
    return {
        books,
        status,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    }
}