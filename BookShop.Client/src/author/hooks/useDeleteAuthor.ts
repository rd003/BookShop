import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAuthor } from "../api/authorApi";

export default function useDeleteAuthor() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteAuthor(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['authors'] });
        }
    });
}