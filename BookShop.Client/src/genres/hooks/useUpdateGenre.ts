import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateGenre } from "../genreApi";
import type { UpdateGenre } from "../types/updateGenre";

export function useUpdateGenre(genre: UpdateGenre) {
    return useMutation({
        mutationFn: () => updateGenre(genre),
        onSuccess: () => {
            const queryClient = useQueryClient();
            queryClient.invalidateQueries({ queryKey: ['genres'] })
        }
    })
}