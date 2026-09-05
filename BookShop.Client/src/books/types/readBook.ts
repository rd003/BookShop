import type { ReadAuthor } from "@/author/types/readAuthor";
import type { ReadGenre } from "@/genres/types/readGenre";

export interface ReadBook {
    id: number;
    title: string;
    description: string;
    isbn: string;
    price: number;
    stockQuantity: number;
    coverImageUrl: string;
    publisherId: number;
    publisherName: string;
    genres: ReadGenre[];
    authors: ReadAuthor[];
}