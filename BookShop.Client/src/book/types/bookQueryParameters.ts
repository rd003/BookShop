export interface BookQueryParameters {
  pageSize: number
  pageNumber: number
  sortBy?: string | null
  searchTerm?: string | null
  genreIds?: number[]
}
