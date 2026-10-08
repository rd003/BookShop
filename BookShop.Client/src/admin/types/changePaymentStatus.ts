import type { PaymentStatus } from "@/shared/constants/paymentStatus"

export interface ChangePaymentStatus {
  orderId: number
  paymentStatus: PaymentStatus
}
