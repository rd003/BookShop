import type { PagedList } from "@/shared/types/pagedList";
import type { QueryParameters } from "@/shared/types/queryParameters";
import type { ReadGenre } from "./types/readGenre";
import { apiFetch } from "@/lib/apiClient";
import type { CreateGenre } from "./types/createGenre";
import type { UpdateGenre } from "./types/updateGenre";

const url = "/genres";
export async function getGenres(queryParams: QueryParameters): Promise<PagedList<ReadGenre>> {
    const params = new URLSearchParams({
        pageNumber: String(queryParams.pageNumber),
        pageSize: String(queryParams.pageSize)
    });

    if (queryParams.sortBy) {
        params.set("sortBy", queryParams.sortBy);
    }

    return await apiFetch<PagedList<ReadGenre>>(`${url}?${params.toString()}`);
}

export async function createGenre(genre: CreateGenre): Promise<ReadGenre> {
    return await apiFetch<ReadGenre>(url, {
        method: 'POST',
        body: JSON.stringify(genre)
    })
}

export async function updateGenre(genre: UpdateGenre): Promise<void> {
    await apiFetch<void>(url + "/" + genre.id, {
        method: 'PUT',
        body: JSON.stringify(genre)
    })
}

export async function deleteGenre(id: number): Promise<void> {
    await apiFetch<void>(url + "/" + id, {
        method: 'DELETE'
    })
}