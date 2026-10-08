import type { OrderStatus } from "@/shared/constants/orderStatus"

export interface ChangeOrderStatus {
  orderId: number
  orderStatus: OrderStatus
}
