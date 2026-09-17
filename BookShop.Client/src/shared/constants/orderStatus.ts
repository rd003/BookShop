export const OrderStatus = {
    Pending: "Pending",
    Confirmed: "Confirmed",
    Processing: "Processing",
    Shipped: "Shipped",
    Delivered: "Delivered",
    Cancelled: "Cancelled",
    Returned: "Returned"
} as const;
export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];