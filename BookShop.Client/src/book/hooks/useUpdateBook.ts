import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateBook } from "../api/booksApi"
import type { UpdateBook } from "../types/updateBook"

export default function useUpdateBook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (obj: { id: number; data: UpdateBook }) =>
      updateBook(obj.id, obj.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] })
    },
  })
}
