import type { PagedList } from "@/shared/types/pagedList";
import type { GetUserOrder } from "../types/getUserOrder";
import { apiFetch } from "@/lib/apiClient";
import type { OrdersQueryParameters } from "@/shared/types/queryParameters";
import type { CreateOrder } from "../types/createOrder";

const url = "/orders"

export async function createOrder(createOrder: CreateOrder): Promise<GetUserOrder> {
    const data = await apiFetch<GetUserOrder>(url, {
        method: 'POST',
        body: JSON.stringify(createOrder)
    })
    return data;
}

export async function getOrders(queryParams: OrdersQueryParameters, startDate: string | null, endDate: string | null): Promise<PagedList<GetUserOrder>> {
    const params = new URLSearchParams({
        pageNumber: String(queryParams.pageNumber),
        pageSize: String(queryParams.pageSize),
        sortBy: queryParams.sortBy
    });
    if (startDate) params.set("startingOrderDate", startDate);
    if (endDate) params.set("endingOrderDate", endDate);

    return apiFetch<PagedList<GetUserOrder>>(`${url}?${params.toString()}`);
}

export async function getOrder(orderNumber: string): Promise<GetUserOrder> {
    const order = await apiFetch<GetUserOrder>(`${url}/${orderNumber}`);
    return order;
}