import { useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { ReadCart, ReadCartItems } from "./types/readCart";

// Replace with the real GET /api/cart response.
const MOCK_CART: ReadCart = {
    cartId: 1,
    totalAmount: 1273,
    totalItems: 3,
    cartItems: [
        {
            cartItemId: 101,
            bookId: 1,
            bookTitle: "The Midnight Library",
            authors: ["Matt Haig"],
            genres: ["Fiction", "Fantasy"],
            unitPrice: 399,
            quantity: 1,
            totalPrice: 399,
        },
        {
            cartItemId: 102,
            bookId: 3,
            bookTitle: "Project Hail Mary",
            authors: ["Andy Weir"],
            genres: ["Sci-Fi", "Fiction"],
            unitPrice: 449,
            quantity: 1,
            totalPrice: 449,
        },
        {
            cartItemId: 103,
            bookId: 5,
            bookTitle: "Atomic Habits",
            authors: ["James Clear"],
            genres: ["Non-Fiction", "Self-Help"],
            unitPrice: 425,
            quantity: 1,
            totalPrice: 425,
        },
    ],
};

// Recomputes totalItems/totalAmount from cartItems — call after any quantity/remove change.
function recalculateCart(cartItems: ReadCartItems[], cartId: number): ReadCart {
    return {
        cartId,
        cartItems,
        totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        totalAmount: cartItems.reduce((sum, item) => sum + item.totalPrice, 0),
    };
}

export default function Cart() {
    const [cart, setCart] = useState<ReadCart>(MOCK_CART);

    function updateQuantity(cartItemId: number, delta: number) {
        const updatedItems = cart.cartItems
            .map((item) =>
                item.cartItemId === cartItemId
                    ? {
                        ...item,
                        quantity: Math.max(1, item.quantity + delta),
                        totalPrice: Math.max(1, item.quantity + delta) * item.unitPrice,
                    }
                    : item
            );
        setCart(recalculateCart(updatedItems, cart.cartId));
    }

    function removeItem(cartItemId: number) {
        const updatedItems = cart.cartItems.filter((item) => item.cartItemId !== cartItemId);
        setCart(recalculateCart(updatedItems, cart.cartId));
    }

    if (cart.cartItems.length === 0) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
                <p className="text-stone-600">Your cart is empty.</p>
                <Link to="/" className="mt-3 text-sm text-[#8A2E2E] font-medium hover:underline">
                    Browse the catalog
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl px-4 py-10">
            <h1 className="font-serif text-2xl text-stone-900">Your Cart</h1>

            <div className="mt-6 flex flex-col gap-4">
                {cart.cartItems.map((item) => (
                    <div
                        key={item.cartItemId}
                        className="flex items-center gap-4 rounded-lg border border-stone-200 bg-white p-4"
                    >
                        <div className="h-20 w-14 shrink-0 rounded bg-stone-200" />

                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-stone-900 truncate">{item.bookTitle}</h3>
                            <p className="text-xs text-stone-500 mt-0.5">{item.authors.join(", ")}</p>
                            <p className="text-xs text-stone-400 mt-0.5">{item.genres.join(" · ")}</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => updateQuantity(item.cartItemId, -1)}
                                className="rounded border border-stone-300 p-1 hover:bg-stone-100"
                                aria-label="Decrease quantity"
                            >
                                <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-6 text-center text-sm">{item.quantity}</span>
                            <button
                                onClick={() => updateQuantity(item.cartItemId, 1)}
                                className="rounded border border-stone-300 p-1 hover:bg-stone-100"
                                aria-label="Increase quantity"
                            >
                                <Plus className="h-3.5 w-3.5" />
                            </button>
                        </div>

                        <p className="w-16 shrink-0 text-right text-sm font-medium text-stone-900">
                            ₹{item.totalPrice}
                        </p>

                        <button
                            onClick={() => removeItem(item.cartItemId)}
                            className="shrink-0 text-stone-400 hover:text-[#8A2E2E]"
                            aria-label="Remove item"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex flex-col items-end gap-1 border-t border-stone-200 pt-6">
                <p className="text-sm text-stone-500">{cart.totalItems} items</p>
                <p className="text-lg font-medium text-stone-900">Total: ₹{cart.totalAmount}</p>
                <button className="mt-3 rounded-md bg-[#8A2E2E] px-6 py-2 text-sm font-medium text-white hover:bg-[#732626]">
                    Proceed to checkout
                </button>
            </div>
        </div>
    );
}