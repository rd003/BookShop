export const OrderStatus = {
    Pending: "Pending",
    Confirmed: "Confirmed",
    Shipped: "Confirmed",
    Delivered: "Confirmed",
    Cancelled: "Confirmed",
    Returned: "Confirmed"
} as const;
export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];