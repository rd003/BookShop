export interface ReadCart {
    cartId: number;
    cartItems: ReadCartItems[];
    totalAmount: number;
    totalItems: number;
}

export interface ReadCartItems {
    cartItemId: number;
    bookId: number;
    bookTitle: string;
    authors: string[];
    genres: string[];
    unitPrice: number;
    quantity: number;
    totalPrice: number;
}