import type { PagedList } from "@/shared/types/pagedList"
import type { ReadBook } from "../types/readBook"
import { apiFetch } from "@/lib/apiClient"
import type { CreateBook } from "../types/createBook"
import type { UpdateBook } from "../types/updateBook"
import type { BookQueryParameters } from "../types/bookQueryParameters"

const url = "/books"

export async function fetchBooks(
  queryParams: BookQueryParameters
): Promise<PagedList<ReadBook>> {
  const params = new URLSearchParams({
    pageNumber: String(queryParams.pageNumber),
    pageSize: String(queryParams.pageSize),
  })

  if (queryParams.sortBy) {
    params.set("sortBy", queryParams.sortBy)
  }

  for (let genreId of queryParams.genreIds ?? []) {
    params.append("genreIds", genreId.toString())
  }

  return apiFetch<PagedList<ReadBook>>(`${url}?${params.toString()}`)
}

export async function getBook(id: number) {
  return apiFetch<ReadBook>(`${url}/${id}`)
}

export async function addBook(book: CreateBook) {
  return await apiFetch<ReadBook>(url, {
    method: "POST",
    body: JSON.stringify(book),
  })
}

export async function updateBook(id: number, book: UpdateBook) {
  return await apiFetch<ReadBook>(`${url}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(book),
  })
}

export async function deleteBook(id: number) {
  await apiFetch<void>(`${url}/${id}`, {
    method: "DELETE",
  })
}
