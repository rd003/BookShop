import type { OrderStatusSelectItem } from "@/orders/types/orderStatusSelectItem";
import { object } from "zod";

export const orderStatuses = {
    Pending: "Pending",
    Confirmed: "Confirmed",
    Processing: "Processing",
    Shipped: "Shipped",
    Delivered: "Delivered",
    Cancelled: "Cancelled",
    Returned: "Returned"
} as const;

export type OrderStatus = typeof orderStatuses[keyof typeof orderStatuses];

export const orderStatusSelectItems: OrderStatusSelectItem[] = Object.values(orderStatuses).map(status => ({
    label: status,
    value: status
}))