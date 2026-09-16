export const PaymentMethod = {
    cashOnDelivery: "CashOnDelivery"
}

export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod]