import type { OrderStatus } from "@/shared/constants/OrderStatus";
import type { PaymentMethod } from "@/shared/constants/PaymentMethod";
import type { PaymentStatus } from "@/shared/constants/PaymentStatus";
import type { ReadOrderItem } from "./readOrderItem";

export interface GetUserOrder {
    orderNumber: string;
    orderDate: string;
    orderStatus: OrderStatus;
    pyamentMethod: PaymentMethod;
    pyamentStatus: PaymentStatus;
    orderItems: ReadOrderItem[];
    orderTotal: number;
}