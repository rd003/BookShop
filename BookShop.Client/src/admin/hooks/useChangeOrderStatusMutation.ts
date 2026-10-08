import { useMutation, useQueryClient } from "@tanstack/react-query"
import { changeOrderStatus } from "../api/adminOrderApi"
import type { ChangeOrderStatus } from "../types/changeOrderStatus"

export function useChangeOrderStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ChangeOrderStatus) => changeOrderStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] })
    },
  })
}
