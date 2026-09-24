import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGenre } from "../genreApi";

export default function useDeleteGenre() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteGenre(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['genres'] })
        }
    })
}