import { useQuery } from "@tanstack/react-query";
import { getCart } from "../cartApi";

export function useCart() {
    const { data, status, error } = useQuery({
        queryKey: ['cart'],
        queryFn: getCart
    })
    return {
        cart: data,
        status,
        error
    }
}