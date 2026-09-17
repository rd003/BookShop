export interface ReadOrderItem {
    id: number;
    bookId: number;
    bookTitle: string;
    coverImageUrl: string;
    authors: string[];
    genres: string[];
    quantity: number;
    unitPrice: number;
    itemTotalPrice: number;
}