import { useQuery } from "@tanstack/react-query"
import { getAdminOrderDetail } from "../api/adminOrderApi"

export default function useAdminOrderDetail(orderId: number) {
  return useQuery({
    queryFn: () => getAdminOrderDetail(orderId),
    queryKey: ["adminOrders", "detail", orderId],
  })
}
