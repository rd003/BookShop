import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGenre } from "../genreApi";
import type { CreateGenre } from "../types/createGenre";

export function useAddGenre(genre: CreateGenre) {
    return useMutation({
        mutationFn: () => createGenre(genre),
        onSuccess: () => {
            const queryClient = useQueryClient();
            queryClient.invalidateQueries({ queryKey: ['genres'] })
        }
    })
}