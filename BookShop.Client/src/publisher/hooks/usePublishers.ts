import type { QueryParameters } from "@/shared/types/queryParameters"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getPublishers } from "../api/publisherApi"

export default function usePublishers(queryParams: QueryParameters) {
  return useQuery({
    queryFn: () => getPublishers(queryParams),
    queryKey: ["publishers", queryParams],
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    placeholderData: keepPreviousData,
    retry: (failureCount, error) => {
      const s = (error as { response?: { status?: number } })?.response?.status
      if (s && s < 500) return false // never retry 4xx
      return failureCount < 2 // retry network and 5xx twice
    },
  })
}
