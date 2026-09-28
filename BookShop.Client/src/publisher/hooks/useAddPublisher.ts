import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { CreatePublisher } from "../types/createPublisher"
import { createPublisher } from "../api/publisherApi"

export default function useAddPublisher() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePublisher) => createPublisher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publishers"] })
    },
  })
}
