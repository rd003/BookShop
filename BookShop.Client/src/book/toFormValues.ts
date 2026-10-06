import type { BookFormValues } from "./types/bookSchema"
import type { UpdateBook } from "./types/updateBook"

export function toFormValues(book: UpdateBook): BookFormValues {
  return {
    id: book.id,
    title: book.title ?? "",
    description: book.description ?? "",
    coverImageUrl: book.coverImageUrl ?? "",
    isbn: book.isbn ?? "",
    price: book.price ?? 0,
    stockQuantity: book.stockQuantity ?? 0,
    publisherId: book.publisherId ?? 0,
    newPublisherName: book.newPublisherName ?? "",
    genreIds: book.genreIds ?? [],
    newGenreNames: book.newGenreNames ?? [],
    authorIds: book.authorIds ?? [],
    newAuthorNames: book.newAuthorNames ?? [],
  }
}
