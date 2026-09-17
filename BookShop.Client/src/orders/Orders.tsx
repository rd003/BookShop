import type { OrdersQueryParameters } from "@/shared/types/queryParameters";
import { useOrders } from "./hooks/useOrders"
import { useState } from "react";
import { getUserFacingError } from "@/lib/getUserFacingError";
import { formatDateTime } from "@/lib/format";

export default function Orders() {
    const queryParams: OrdersQueryParameters = {
        pageNumber: 1,
        pageSize: 3,
        sortBy: ""
    }
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const { data, status, error } = useOrders(queryParams, startDate, endDate);

    if (status === 'pending') {
        return (<p>Loadin</p>)
    }
    if (status === 'error') {
        return (<p>{getUserFacingError({ error })}</p>)
    }
    return (<>
        <h1 className="text-3xl">Orders</h1>
        <ul>
            {data.items.map(o => <li key={o.orderNumber}>
                {formatDateTime(o.orderDate)}
                | {o.orderNumber}
                | {o.orderStatus}
            </li>)}
        </ul>
    </>)
}