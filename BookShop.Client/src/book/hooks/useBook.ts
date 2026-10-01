import { useQuery } from "@tanstack/react-query"
import { getBook } from "../api/booksApi"
import { bookKeys } from "../types/bookKeys"

export default function useBook(id: number) {
  return useQuery({
    queryFn: () => getBook(id),
    queryKey: bookKeys.detail(id),
    staleTime: 30_000,
    enabled: Number.isFinite(id),
    retry: (failureCount, error) => {
      const s = (error as { response?: { status?: number } })?.response?.status
      if (s && s < 500) return false // never retry 4xx (e.g. 404)
      return failureCount < 2
    },
  })
}
