import type { OrdersQueryParameters } from "@/shared/types/queryParameters";
import { useOrders } from "./hooks/useOrders"
import { getUserFacingError } from "@/lib/getUserFacingError";
import { formatCurrency, formatDateTime } from "@/lib/format";
import OrderFilters, { type OrderFilter } from "./OrderFilters";
import type { OrderStatus } from "@/shared/constants/orderStatus";
import { useSearchParams } from "react-router-dom";

export default function Orders() {
    const [searchParams, setSearchParams] = useSearchParams();

    const queryParams: OrdersQueryParameters = {
        pageNumber: Number(searchParams.get("pageNumber")) || 1,
        pageSize: Number(searchParams.get("pageSize")) || 3,
        sortBy: searchParams.get("sortBy"),
        startDate: searchParams.get("startDate"),
        endDate: searchParams.get("endDate"),
        orderStatus: searchParams.get("orderStatus") as OrderStatus | null
    }

    const { data, status, error } = useOrders(queryParams);

    function handleOrderFilterClick(filterValues: OrderFilter) {
        const { dateFrom, dateTo, orderStatus } = filterValues;
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            if (dateFrom) next.set("startDate", dateFrom.toISOString());
            if (dateTo) next.set("endDate", dateTo.toISOString());
            if (orderStatus) next.set("orderStatus", orderStatus);
            return next;
        })
    }

    function handleCrearFilter() {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.delete("startDate");
            next.delete("endDate");
            next.delete("orderStatus");
            return next;
        })
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