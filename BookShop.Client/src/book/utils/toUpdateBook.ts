import type { BookFormValues } from "../types/bookSchema"
import type { UpdateBook } from "../types/updateBook"

export function toUpdateBook(data: BookFormValues): UpdateBook {
  return {
    id: data.id ?? 0,
    title: data.title,
    price: data.price,
    isbn: data.isbn,
    stockQuantity: data.stockQuantity,
    coverImageUrl: data.coverImageUrl ?? null,
    description: data.description ?? null,
    genreIds: data.genreIds,
    newGenreNames: data.newGenreNames,
    publisherId: data.publisherId,
    newPublisherName: data.newPublisherName ?? null,
    authorIds: data.authorIds,
    newAuthorNames: data.newAuthorNames,
  }
}
