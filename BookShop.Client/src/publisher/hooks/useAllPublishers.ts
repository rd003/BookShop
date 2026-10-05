import { useQuery } from "@tanstack/react-query"
import { getAllPublishers } from "../api/publisherApi"

export function useAllPublishers() {
  return useQuery({
    queryFn: getAllPublishers,
    queryKey: ["publishers", "all"],
    gcTime: 30_000,
    staleTime: 5 * 60_000,
    retry: (failureCount, error) => {
      const s = (error as { response?: { status?: number } })?.response?.status
      if (s && s < 500) return false // never retry 4xx
      return failureCount < 2 // retry network and 5xx twice
    },
  })
}
