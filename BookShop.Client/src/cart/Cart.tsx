import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "./hooks/useCart";


export default function Cart() {
    const { cart, status, error } = useCart();

    function updateQuantity(cartItemId: number, delta: number) {

    }

    function removeItem(cartItemId: number) {

    }

    if (status === 'error') {
        return (<p className="text-red-500">{error ? error.message : "Something went wrong!"}</p>)
    }

    if (status === 'pending') {
        return (<p>Loading...</p>)
    }


    if (cart === null || cart?.cartItems.length === 0) {
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
                {cart?.cartItems.map((item) => (
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
                <p className="text-sm text-stone-500">{cart ? cart.totalItems : 0} items</p>
                <p className="text-lg font-medium text-stone-900">Total: ₹{cart ? cart.totalAmount : 0}</p>
                <button className="mt-3 rounded-md bg-[#8A2E2E] px-6 py-2 text-sm font-medium text-white hover:bg-[#732626]">
                    Proceed to checkout
                </button>
            </div>
        </div>
    );
}