import { useInfiniteQuery } from "@tanstack/react-query"
import type { ReadBook } from "../types/readBook"
import { fetchBooks } from "../api/booksApi"
import type { BookQueryParameters } from "../types/bookQueryParameters"
import { bookKeys } from "../types/bookKeys"

export function useBooksQuery(bookQueryParam: BookQueryParameters) {
  const { pageNumber: _startPage, ...filters } = bookQueryParam
  const {
    data,
    status,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: bookKeys.infinite(filters),
    queryFn: ({ pageParam }) =>
      fetchBooks({ ...bookQueryParam, pageNumber: pageParam }),
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
