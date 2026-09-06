import type { PagedList } from "@/shared/types/pagedList";
import type { ReadBook } from "./types/readBook";
import type { QueryParameters } from "@/shared/types/queryParameters";

const BASE_URL = import.meta.env.VITE_API_BASE_URL + "/books";

export async function fetchPeople(): Promise<[]> {
    const res = await fetch(BASE_URL);
    if (!res.ok) {
        throw new Error(`Failed to fetch people: ${res.status}`);
    }
    return res.json();
}

export async function fetchBooks(queryParams: QueryParameters): Promise<PagedList<ReadBook>> {
    const res = await fetch(`${BASE_URL}?pageSize=${queryParams.pageSize}&pagNumber=${queryParams.pageNumber}&searchTerm=${queryParams.searchTerm}&sortBy=${queryParams.sortBy}`);

    if (!res.ok) {
        throw new Error("Failed to fetch books.");
    }
    return res.json();
}