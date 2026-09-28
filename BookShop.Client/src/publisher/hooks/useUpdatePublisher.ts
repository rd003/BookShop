import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { UpdatePublisher } from "../types/updatePublisher"
import { updatePublisher } from "../api/publisherApi"

export default function useUpdatePublisher() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdatePublisher) => updatePublisher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publishers"] })
    },
  })
}
