import type { ISelectItem } from "../types/ISelectItem"

export const PaymentStatuses = {
  Pending: "Pending",
  Paid: "Paid",
  Failed: "Failed",
}

export type PaymentStatus =
  (typeof PaymentStatuses)[keyof typeof PaymentStatuses]

export const paymentStatusSelectItems: ISelectItem<PaymentStatus>[] =
  Object.values(PaymentStatuses).map((status) => ({
    label: status,
    value: status,
  }))
