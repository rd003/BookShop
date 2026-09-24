import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGenre } from "../genreApi";
import type { CreateGenre } from "../types/createGenre";

export function useAddGenre() {
    return useMutation({
        mutationFn: (genre: CreateGenre) => createGenre(genre),
        onSuccess: () => {
            const queryClient = useQueryClient();
            queryClient.invalidateQueries({ queryKey: ['genres'] })
        }
    })
}