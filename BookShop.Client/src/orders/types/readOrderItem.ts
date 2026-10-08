export interface ReadOrderItem {
  id: number
  bookId: number
  bookTitle: string
  coverImageUrl: string | null
  authors: string[]
  genres: string[]
  quantity: number
  unitPrice: number
  itemTotalPrice: number
}
