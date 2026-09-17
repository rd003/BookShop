import type { OrderStatus } from "@/shared/constants/orderStatus";
import type { PaymentMethod } from "@/shared/constants/paymentMethod";
import type { PaymentStatus } from "@/shared/constants/paymentStatus";
import type { ReadOrderItem } from "./readOrderItem";
import type { ReadAddress } from "@/addresses/types/readAddress";

export interface GetUserOrder {
    orderNumber: string;
    orderDate: string;
    orderStatus: OrderStatus;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    orderItems: ReadOrderItem[];
    shippingAddress: ReadAddress;
    orderTotal: number;
}