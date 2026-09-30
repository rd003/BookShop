import { useInfiniteQuery } from "@tanstack/react-query"
import type { PagedList } from "@/shared/types/pagedList"
import type { ReadBook } from "../types/readBook"
import { fetchBooks } from "../api/booksApi"
import type { BookQueryParameters } from "../types/bookQueryParameters"

export function useBooksQuery(bookQueryParam: BookQueryParameters) {
  const {
    data,
    status,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage, remove this infinite query
  } = useInfiniteQuery<PagedList<ReadBook>, Error>({
    queryKey: ["books", bookQueryParam, bookQueryParam.genreIds],
    queryFn: () => fetchBooks(bookQueryParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.pageNumber + 1 : undefined,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  })
  const books: ReadBook[] = data?.pages.flatMap((page) => page.items) ?? []
  return {
    books,
    status,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  }
}
