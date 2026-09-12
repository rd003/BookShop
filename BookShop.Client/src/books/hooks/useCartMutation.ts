import { addCartItem, clearCart, updateCartItem } from "@/cart/cartApi";
import type { ReadCart } from "@/cart/types/readCart";
import type { UpdateCartItemRequest } from "@/cart/types/updateCartItemRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
type UpdateCartItemVariables = {
    cartId: number;
    cartItem: UpdateCartItemRequest;
};
export function useUpdateCartItem() {
    const invalidateCart = useInvalidateCart();
    return useMutation<ReadCart, Error, UpdateCartItemVariables>({
        mutationFn: ({ cartId, cartItem }) => updateCartItem(cartId, cartItem),
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