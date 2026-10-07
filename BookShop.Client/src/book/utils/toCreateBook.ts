import type { BookFormValues } from "../types/bookSchema"
import type { CreateBook } from "../types/createBook"

export function toCreateBook(data: BookFormValues): CreateBook {
  return {
    title: data.title,
    price: data.price,
    isbn: data.isbn,
    stockQuantity: data.stockQuantity,
    coverImageUrl: data.coverImageUrl ?? "",
    description: data.description ?? "",
    existingGenreIds: data.genreIds,
    newGenreNames: data.newGenreNames,
    publisherId: data.publisherId,
    newPublisherName: data.newPublisherName ?? null,
    existingAuthorIds: data.authorIds,
    newAuthorNames: data.newAuthorNames,
  }
}
