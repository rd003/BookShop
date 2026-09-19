export const PaymentMethods = {
    CashOnDelivery: "CashOnDelivery"
}

export type PaymentMethod = typeof PaymentMethods[keyof typeof PaymentMethods]