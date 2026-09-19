import type { ISelectItem } from "../types/ISelectItem";

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

export const orderStatusSelectItems: ISelectItem<OrderStatus>[] = Object.values(orderStatuses).map(status => ({
    label: status,
    value: status
}))