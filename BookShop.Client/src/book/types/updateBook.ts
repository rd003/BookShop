export interface UpdateBook {
  title: string | null
  description: string | null
  isbn: string | null
  price: number | null
  stockQuantity: number | null
  coverImageUrl: string | null
  publisherId: number | null
  newPublisherName: string | null
  genreIds: number[] | null
  newGenreNames: string[] | null
  authorIds: number[] | null
  newAuthorNames: string[] | null
}
