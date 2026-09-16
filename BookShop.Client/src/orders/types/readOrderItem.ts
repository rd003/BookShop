export interface ReadOrderItem {
    bookId: number;
    bookTitle: string;
    authors: string[];
    genres: string[];
    quantity: string[]
    unitPrice: number
    itemTotalPrice: number
}