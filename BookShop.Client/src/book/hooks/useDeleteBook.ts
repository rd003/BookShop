import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteBook } from "../api/booksApi"

export default function useDeleteBook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}
