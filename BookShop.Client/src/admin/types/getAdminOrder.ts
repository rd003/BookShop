import type { ReadOrderItem } from "@/orders/types/readOrderItem"
import type { OrderStatus } from "@/shared/constants/orderStatus"
import type { PaymentMethod } from "@/shared/constants/paymentMethod"
import type { PaymentStatus } from "@/shared/constants/paymentStatus"

export interface GetAdminOrder {
  orderId: number
  customerEmail: string
  orderNumber: string
  orderDate: string
  orderStatus: OrderStatus
  pyamentMethod: PaymentMethod
  pyamentStatus: PaymentStatus
  orderItems: ReadOrderItem[]
  orderTotal: number
}
