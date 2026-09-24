import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateAuthor } from "../types/updateAuthor";
import { updateAuthor } from "../api/authorApi";

export default function useUpdateAuthor() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (author: UpdateAuthor) => updateAuthor(author),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['authors'] })
        }
    })
}