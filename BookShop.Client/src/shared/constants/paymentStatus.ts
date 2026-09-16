export const PaymentStatus = {
    pending: "Pending",
    paid: "Paid",
    failed: "Failed"
}

export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus]