import { apiFetch } from "@/lib/apiClient";
import type { AddCartItemRequest } from "./types/addCartItemRequest";
import type { ReadCart } from "./types/readCart";
import type { UpdateCartItemRequest } from "./types/updateCartItemRequest";

const url = "/cart";

export async function addCartItem(cartItem: AddCartItemRequest): Promise<ReadCart> {
    const cart = await apiFetch<ReadCart>(url + "/items", {
        method: 'post',
        body: JSON.stringify(cartItem)
    })
    return cart;
}

export async function updateCartItem(cartId: number, cartItem: UpdateCartItemRequest) {
    const cart = await apiFetch<ReadCart>(`${url}/items/${cartId}`, {
        method: 'PUT',
        body: JSON.stringify(cartItem)
    });
    return cart;
}

export async function getCart() {
    const cart = await apiFetch<ReadCart>(url)
    return cart;
}

export async function clearCart() {
    await apiFetch(`${url}/items`,
        {
            method: 'DELETE'
        }
    )
}