// src/cart/hooks/useCartCount.ts (new file)
import { useQuery } from "@tanstack/react-query";
import { getCart } from "../cartApi";

export function useCartCount() {
    const { data } = useQuery({
        queryKey: ['cart'],
        queryFn: getCart,
        select: (cart) => cart.totalItems // only this hook's subscribers re-render when count changes
    });
    return data ?? 0;
}