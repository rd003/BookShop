import { apiFetch } from "@/lib/apiClient"
import type { CreatePublisher } from "../types/createPublisher"
import type { ReadPublisher } from "../types/readPublisher"
import type { UpdatePublisher } from "../types/updatePublisher"
import type { QueryParameters } from "@/shared/types/queryParameters"
import type { PagedList } from "@/shared/types/pagedList"

const url = "/publishers"

export async function getAllPublishers() {
  return apiFetch<ReadPublisher[]>(`${url}/all`)
}

export async function createPublisher(publisher: CreatePublisher) {
  return await apiFetch<ReadPublisher>(url, {
    method: "POST",
    body: JSON.stringify(publisher),
  })
}

export async function updatePublisher(publisher: UpdatePublisher) {
  await apiFetch<void>(url + "/" + publisher.id, {
    method: "PUT",
    body: JSON.stringify(publisher),
  })
}

export async function deletePublisher(id: number) {
  await apiFetch<void>(url + "/" + id, {
    method: "DELETE",
  })
}

export async function getPublishers(queryParams: QueryParameters) {
  const params = new URLSearchParams({
    pageNumber: String(queryParams.pageNumber),
    pageSize: String(queryParams.pageSize),
  })

  if (queryParams.searchTerm) {
    params.set("searchTerm", queryParams.searchTerm)
  }

  if (queryParams.sortBy) {
    params.set("sortBy", queryParams.sortBy)
  }

  return await apiFetch<PagedList<ReadPublisher>>(`${url}?${params.toString()}`)
}
