import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addBook } from "../api/booksApi"
import type { CreateBook } from "../types/createBook"

export default function useAddBook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateBook) => addBook(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] })
      queryClient.invalidateQueries({ queryKey: ["genres"] })
      queryClient.invalidateQueries({ queryKey: ["authors"] })
      queryClient.invalidateQueries({ queryKey: ["publishers"] })
    },
  })
}
