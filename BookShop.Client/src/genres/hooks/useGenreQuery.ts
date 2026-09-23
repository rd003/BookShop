import { getGenres } from "@/genres/genreApi";
import type { ReadGenre } from "@/genres/types/readGenre";
import type { PagedList } from "@/shared/types/pagedList";
import type { QueryParameters } from "@/shared/types/queryParameters";
import { useQuery } from "@tanstack/react-query";

export default function useGenreQuery(queryParams: QueryParameters) {
    const { data, status, error } = useQuery<PagedList<ReadGenre>, Error>({
        queryKey: ['genres', queryParams],
        queryFn: () => getGenres(queryParams),
        staleTime: 30_000,
        gcTime: 5 * 60_000
    });
    return {
        allGenres: data?.items ?? [],
        hasNext: data?.hasNext,
        hasPrev: data?.hasPrevious,
        totalPages: data?.totalPages,
        totalCount: data?.totalCount,
        genreStatus: status,
        genreError: error
    }
}