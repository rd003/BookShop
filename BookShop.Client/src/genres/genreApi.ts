import type { PagedList } from "@/shared/types/pagedList";
import type { QueryParameters } from "@/shared/types/queryParameters";
import type { ReadGenre } from "./types/readGenre";
import { apiFetch } from "@/lib/apiClient";

export async function getGenres(queryParams: QueryParameters): Promise<PagedList<ReadGenre>> {
    const params = new URLSearchParams({
        pageNumber: String(queryParams.pageNumber),
        pageSize: String(queryParams.pageSize)
    });

    if (queryParams.sortBy) {
        params.set("sortBy", queryParams.sortBy);
    }

    return apiFetch<PagedList<ReadGenre>>(`/genres?${params.toString()}`);
}