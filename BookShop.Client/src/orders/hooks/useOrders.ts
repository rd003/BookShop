import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOrders } from "../api/orderApi";
import type { OrdersQueryParameters } from "@/shared/types/queryParameters";

export function useOrders(queryParams: OrdersQueryParameters) {
    return useQuery({
        queryKey: ['orders', 'list', queryParams],
        queryFn: () => getOrders(queryParams),
        placeholderData: keepPreviousData,
        staleTime: 30_000,
        retry: (failureCount, error) => {
            const s = (error as { response?: { status?: number } })?.response?.status;
            if (s && s < 500) return false;    // never retry 4xx
            return failureCount < 2;           // retry network and 5xx twice
        },
    });
}