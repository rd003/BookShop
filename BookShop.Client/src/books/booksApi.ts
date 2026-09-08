import type { PagedList } from "@/shared/types/pagedList";
import type { ReadBook } from "./types/readBook";
import type { QueryParameters } from "@/shared/types/queryParameters";

const BASE_URL = import.meta.env.VITE_API_BASE_URL + "/books";

export async function fetchBooks(queryParams: QueryParameters, genreIds: number[]): Promise<PagedList<ReadBook>> {
    let url = `${BASE_URL}?pageSize=${queryParams.pageSize}&pageNumber=${queryParams.pageNumber}&searchTerm=${queryParams.searchTerm}&sortBy=${queryParams.sortBy}`;
    for (let genreId of genreIds) {
        url += `&genreIds=${genreId}`;
    }
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error("Failed to fetch books.");
    }
    return res.json();
}