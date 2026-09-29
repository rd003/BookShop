import { addCartItem, clearCart, updateCartItem } from "@/cart/cartApi";
import type { ReadCart } from "@/cart/types/readCart";
import type { UpdateCartItemRequest } from "@/cart/types/updateCartItemRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export type UpdateCartItemVariables = {
    cartItemId: number;
    cartItemReq: UpdateCartItemRequest;
};
function useInvalidateCart() {
    const queryClient = useQueryClient();
    return () => queryClient.invalidateQueries({ queryKey: ['cart'] });
}

export function useAddCartItem() {
    const invalidateCart = useInvalidateCart();
    return useMutation({
        mutationFn: addCartItem,
        onSuccess: invalidateCart
    });
}

export function useUpdateCartItem() {
    const invalidateCart = useInvalidateCart();
    return useMutation<ReadCart, Error, UpdateCartItemVariables>({
        mutationFn: ({ cartItemId, cartItemReq }) => updateCartItem(cartItemId, cartItemReq),
        onSuccess: invalidateCart,
    });
}

export function useClearCart() {
    const invalidateCart = useInvalidateCart();
    return useMutation({
        mutationFn: clearCart,
        onSuccess: invalidateCart
    });
}