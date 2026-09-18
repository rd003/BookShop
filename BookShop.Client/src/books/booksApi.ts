import type { PagedList } from "@/shared/types/pagedList";
import type { ReadBook } from "./types/readBook";
import type { QueryParameters } from "@/shared/types/queryParameters";
import { apiFetch } from "@/lib/apiClient";

export async function fetchBooks(queryParams: QueryParameters, genreIds: number[]): Promise<PagedList<ReadBook>> {
    const params = new URLSearchParams({
        pageNumber: String(queryParams.pageNumber),
        pageSize: String(queryParams.pageSize)
    });

    if (queryParams.sortBy) {
        params.set("sortBy", queryParams.sortBy);
    }

    for (let genreId of genreIds) {
        params.append("genreIds", genreId.toString());
    }
    return apiFetch<PagedList<ReadBook>>(`/books?${params.toString()}`);
}