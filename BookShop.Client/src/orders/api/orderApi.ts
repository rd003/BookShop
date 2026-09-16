import type { PagedList } from "@/shared/types/pagedList";
import type { GetUserOrder } from "../types/getUserOrder";
import { apiFetch } from "@/lib/apiClient";
import type { QueryParameters } from "@/shared/types/queryParameters";
import type { CreateOrder } from "../types/createOrder";

const url = "/orders"

export async function createOrder(createOrder: CreateOrder): Promise<GetUserOrder> {
    const data = await apiFetch<GetUserOrder>(url, {
        method: 'POST',
        body: JSON.stringify(createOrder)
    })
    return data;
}

export async function getOrders(queryParams: QueryParameters, startDate: string | null, endDate: string | null): Promise<PagedList<GetUserOrder>> {
    const orderUrl = `${url}?pageNumber=${queryParams.pageNumber}&pageSize=$
    {queryParams.pageSize}&sortBy=${queryParams.sortBy}&startingOrderDate=${startDate}&endingOrderDate=${endDate}`;

    const orders = await apiFetch<PagedList<GetUserOrder>>(orderUrl)
    return orders;
}

export async function getOrder(orderNumber: string): Promise<GetUserOrder> {
    const order = await apiFetch<GetUserOrder>(`${url}?orderNumber=${orderNumber}`);
    return order;
}