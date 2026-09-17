import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOrders } from "../api/orderApi";
import type { OrdersQueryParameters } from "@/shared/types/queryParameters";

export function useOrders(queryParams: OrdersQueryParameters, startDate: string | null = null, endDate: string | null = null) {
    const filters = { ...queryParams, startDate, endDate };
    return useQuery({
        queryKey: ['orders', 'list', filters],
        queryFn: () => getOrders(queryParams, startDate, endDate),
        placeholderData: keepPreviousData,
        staleTime: 30_000
    });
}