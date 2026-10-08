export interface AdminOrderQueryParameters {
  pageSize: number
  pageNumber: number
  sortBy?: string | null
  startingOrderDate?: string | null
  endingOrderDate?: string | null
}
