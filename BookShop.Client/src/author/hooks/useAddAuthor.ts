import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAuthor } from "../api/authorApi";
import type { CreateAuthor } from "../types/createAuthor";

export default function useAddAuthor() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (author: CreateAuthor) => createAuthor(author),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['authors'] })
        }
    })
}