import { keepPreviousData, useQuery } from "@tanstack/react-query"
import type { AdminOrderQueryParameters } from "../types/adminOrderQueryParameters"
import { getAdminOrders } from "../api/adminOrderApi"

export function useAdminOrders(queryParams: AdminOrderQueryParameters) {
  return useQuery({
    queryFn: () => getAdminOrders(queryParams),
    queryKey: ["adminOrders", queryParams],
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
