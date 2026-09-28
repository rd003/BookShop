import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deletePublisher } from "../api/publisherApi"

export default function useDeletePublisher() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deletePublisher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publishers"] })
    },
  })
}
