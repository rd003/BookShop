import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGenre } from "../genreApi";

export default function useDeleteGenre(id: number) {
    return useMutation({
        mutationFn: () => deleteGenre(id),
        onSuccess: () => {
            const queryClient = useQueryClient();
            queryClient.invalidateQueries({ queryKey: ['genres'] })
        }
    })
}