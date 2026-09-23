import { getGenres } from "@/genres/genreApi";
import type { ReadGenre } from "@/genres/types/readGenre";
import type { PagedList } from "@/shared/types/pagedList";
import type { QueryParameters } from "@/shared/types/queryParameters";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export default function useGenreQuery(queryParams: QueryParameters) {
    return useQuery<PagedList<ReadGenre>, Error>({
        queryKey: ['genres', queryParams],
        queryFn: () => getGenres(queryParams),
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        placeholderData: keepPreviousData,
        retry: (failureCount, error) => {
            const s = (error as { response?: { status?: number } })?.response?.status;
            if (s && s < 500) return false;    // never retry 4xx
            return failureCount < 2;           // retry network and 5xx twice
        },
    });

}