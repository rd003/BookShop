import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { fetchBooks } from "../api/booksApi"
import type { BookQueryParameters } from "../types/bookQueryParameters"
import { bookKeys } from "../types/bookKeys"

export default function useBooks(bookQueryParam: BookQueryParameters) {
  return useQuery({
    queryFn: () => fetchBooks(bookQueryParam),
    queryKey: bookKeys.list(bookQueryParam),
    gcTime: 5 * 60_000,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
    retry: (failureCount, error) => {
      const s = (error as { response?: { status?: number } })?.response?.status
      if (s && s < 500) return false // never retry 4xx
      return failureCount < 2 // retry network and 5xx twice
    },
  })
}
