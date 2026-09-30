export interface CreateBook {
  title: string
  description: string
  isbn: string
  price: number
  stockQuantity: number
  coverImageUrl: string
  publisherId: number | null
  newPublisherName: string | null
  existingGenreIds: number[]
  newGenreNames: string[]
  existingAuthorIds: number[]
  newAuthorNames: string[]
}
