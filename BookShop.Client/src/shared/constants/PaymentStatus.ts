export const PaymentStatus = {
    Pending: "Pending",
    Paid: "Paid",
    Failed: "Failed"
}

export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus]