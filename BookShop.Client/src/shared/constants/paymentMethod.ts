export const PaymentMethod = {
    CashOnDelivery: "CashOnDelivery"
}

export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod]