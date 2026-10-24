import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createOrder } from "../api/orderApi"

export default function useCreateOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["orders"] }),
        queryClient.invalidateQueries({ queryKey: ["cart"] }),
      ]),
  })
}
