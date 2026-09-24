import { apiFetch } from "@/lib/apiClient";
import type { CreateAuthor } from "../types/createAuthor";
import type { PagedList } from "@/shared/types/pagedList";
import type { ReadAuthor } from "../types/readAuthor";
import type { QueryParameters } from "@/shared/types/queryParameters";
import type { UpdateAuthor } from "../types/updateAuthor";

const url = "/authors";

export async function getAuthors(queryParams: QueryParameters) {
    const params = new URLSearchParams({
        pageNumber: String(queryParams.pageNumber),
        pageSize: String(queryParams.pageSize),
    });
    if (queryParams.searchTerm) {
        params.set("searchTerm", queryParams.searchTerm);
    }
    if (queryParams.sortBy) {
        params.set("sortBy", queryParams.sortBy);
    }

    return await apiFetch<PagedList<ReadAuthor>>(`${url}?${params}`);
}

export async function createAuthor(author: CreateAuthor) {
    return await apiFetch<ReadAuthor>(url, {
        method: 'POST',
        body: JSON.stringify(author)
    })
}

export async function updateAuthor(author: UpdateAuthor) {
    await apiFetch<void>(url + "/" + author.id, {
        method: 'PUT',
        body: JSON.stringify(author)
    })
}

export async function deleteAuthor(id: number) {
    await apiFetch<void>(url + "/" + id, {
        method: 'DELETE'
    })
}