import { useMutation, useQueryClient } from "@tanstack/react-query"
import { changePaymentStatus } from "../api/adminOrderApi"
import type { ChangePaymentStatus } from "../types/changePaymentStatus"

export function useChangePaymentStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ChangePaymentStatus) => changePaymentStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] })
    },
  })
}
