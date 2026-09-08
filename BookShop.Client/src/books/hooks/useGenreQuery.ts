import { getGenres } from "@/genres/genreApi";
import type { ReadGenre } from "@/genres/types/readGenre";
import type { PagedList } from "@/shared/types/pagedList";
import { useQuery } from "@tanstack/react-query";

export default function useGenreQuery() {
    const { data, status, error } = useQuery<PagedList<ReadGenre>, Error>({
        queryKey: ['genres'],
        queryFn: () => getGenres({ pageNumber: 1, pageSize: 1000, searchTerm: '', sortBy: '' }),
        staleTime: 30_000,
        gcTime: 5 * 60_000
    });
    return {
        allGenres: data?.items ?? [],
        genreStatus: status,
        genreError: error
    }
}