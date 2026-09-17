import { useQuery } from "@tanstack/react-query";
import { getOrder } from "../api/orderApi";
import type { GetUserOrder } from "../types/getUserOrder";

export default function useOrder(orderNumber: string | undefined) {
    return useQuery<GetUserOrder>({
        queryKey: ['orders', 'detail', orderNumber],
        queryFn: () => getOrder(orderNumber ?? ""),
        enabled: !!orderNumber,
        retry: 1
    })
}