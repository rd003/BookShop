export const OrderStatus = {
    pending: "Pending",
    confirmed: "Confirmed",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
    returned: "Returned"
} as const;
export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];