export const PaymentStatuses = {
    Pending: "Pending",
    Paid: "Paid",
    Failed: "Failed"
}

export type PaymentStatus = typeof PaymentStatuses[keyof typeof PaymentStatuses]