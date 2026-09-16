import type { OrderStatus } from "@/shared/constants/orderStatus";
import type { PaymentMethod } from "@/shared/constants/paymentMethod";
import type { PaymentStatus } from "@/shared/constants/paymentStatus";
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