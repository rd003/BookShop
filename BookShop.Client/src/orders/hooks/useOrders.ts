import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOrders } from "../api/orderApi";
import type { OrdersQueryParameters } from "@/shared/types/queryParameters";

export function useOrders(queryParams: OrdersQueryParameters) {
    return useQuery({
        queryKey: ['orders', 'list', queryParams],
        queryFn: () => getOrders(queryParams),
        placeholderData: keepPreviousData,
        staleTime: 30_000
    });
}