import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateGenre } from "../genreApi";
import type { UpdateGenre } from "../types/updateGenre";

export function useUpdateGenre() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (genre: UpdateGenre) => updateGenre(genre),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['genres'] })
        }
    })
}