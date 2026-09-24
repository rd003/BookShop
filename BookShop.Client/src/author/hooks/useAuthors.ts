import type { QueryParameters } from "@/shared/types/queryParameters";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAuthors } from "../api/authorApi";

export default function useAuthors(params: QueryParameters) {
    return useQuery({
        queryFn: () => getAuthors(params),
        queryKey: ['authors', params],
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        placeholderData: keepPreviousData,
        retry: (failureCount, error) => {
            const s = (error as { response?: { status?: number } })?.response?.status;
            if (s && s < 500) return false;    // never retry 4xx
            return failureCount < 2;           // retry network and 5xx twice
        },
    })
}