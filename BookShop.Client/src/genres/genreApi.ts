import type { PagedList } from "@/shared/types/pagedList";
import type { QueryParameters } from "@/shared/types/queryParameters";
import type { ReadGenre } from "./types/readGenre";

const BASE_URL = import.meta.env.VITE_API_BASE_URL + "/genres";

export async function getGenres(queryParams: QueryParameters): Promise<PagedList<ReadGenre>> {
    const res = await fetch(`${BASE_URL}?pageSize=${queryParams.pageSize}&pagNumber=${queryParams.pageNumber}&searchTerm=${queryParams.searchTerm}&sortBy=${queryParams.sortBy}`);
    if (!res.ok) {
        throw new Error("Failed to fetch genres.");
    }
    return res.json();
}