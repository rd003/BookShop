import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGenre } from "../genreApi";

export default function useDeleteGenre() {
    return useMutation({
        mutationFn: (id: number) => deleteGenre(id),
        onSuccess: () => {
            const queryClient = useQueryClient();
            queryClient.invalidateQueries({ queryKey: ['genres'] })
        }
    })
}