import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGenre } from "../genreApi";
import type { CreateGenre } from "../types/createGenre";

export function useAddGenre() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (genre: CreateGenre) => createGenre(genre),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['genres'] })
        }
    })
}