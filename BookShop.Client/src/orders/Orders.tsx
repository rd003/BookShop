import type { OrdersQueryParameters } from "@/shared/types/queryParameters";
import { useOrders } from "./hooks/useOrders"
import { useState } from "react";
import { getUserFacingError } from "@/lib/getUserFacingError";
import { formatCurrency, formatDateTime } from "@/lib/format";
import OrderFilters, { type OrderFilter } from "./OrderFilters";
import type { OrderStatus } from "@/shared/constants/orderStatus";

export default function Orders() {
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [pageNumber, setPageNumber] = useState<number | null>(null);
    const [pageSize, setPageSize] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState<string | null>(null);
    const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);

    const queryParams: OrdersQueryParameters = {
        pageNumber: pageNumber ?? 1,
        pageSize: pageSize ?? 3,
        sortBy,
        startDate,
        endDate,
        orderStatus
    }

    const { data, status, error } = useOrders(queryParams);

    function handleOrderFilterClick(filterValues: OrderFilter) {
        const { dateFrom, dateTo, orderStatus } = filterValues;
        TODO: orders filter should be in query parameters
        if (dateFrom) {
            setStartDate(dateFrom.toISOString());
        }
        if (dateTo) {
            setEndDate(dateTo.toISOString());
        }
        if (orderStatus) {
            setOrderStatus(orderStatus);
        }
    }

    function handleCrearFilter() {
        setStartDate(null);
        setEndDate(null);
        setOrderStatus(null);
    }

    if (status === 'pending') {
        return (<p>Loadin</p>)
    }
    if (status === 'error') {
        return (<p>{getUserFacingError({ error })}</p>)
    }
    return (<>
        <h1 className="text-3xl">Orders</h1>

        <OrderFilters
            onClick={handleOrderFilterClick}
            onClearFilter={handleCrearFilter}
        />
        <ul>
            {data.items.map(o => <li key={o.orderNumber}>
                {formatDateTime(o.orderDate)}
                | {o.orderNumber}
                | {o.orderStatus}
                | {o.paymentMethod}
                | {o.paymentStatus}
                | {formatCurrency(o.orderTotal)}
            </li>)}
        </ul>
    </>)
}