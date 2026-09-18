import type { OrderStatus } from "../constants/orderStatus";

export interface QueryParameters {
    pageSize: number;
    pageNumber: number;
    sortBy?: string | null;
    searchTerm?: string | null;
}

export interface OrdersQueryParameters {
    pageSize: number;
    pageNumber: number;
    sortBy?: string | null;
    orderStatus?: OrderStatus | null;
    startDate?: string | null;
    endDate?: string | null
}