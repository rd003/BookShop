import type { OrdersQueryParameters } from "@/shared/types/queryParameters";
import { useOrders } from "./hooks/useOrders"
import { getUserFacingError } from "@/lib/getUserFacingError";
import OrderFilters, { type OrderFilter } from "./OrderFilters";
import type { OrderStatus } from "@/shared/constants/orderStatus";
import { useSearchParams } from "react-router-dom";
import Paginator from "../components/Paginator";
import { useEffect } from "react";
import OrderList from "./OrderList";

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 3;

export default function Orders() {
    const [searchParams, setSearchParams] = useSearchParams();

    const queryParams: OrdersQueryParameters = {
        pageNumber: Number(searchParams.get("pageNumber")) || DEFAULT_PAGE_NUMBER,
        pageSize: Number(searchParams.get("pageSize")) || DEFAULT_PAGE_SIZE,
        sortBy: searchParams.get("sortBy"),
        startDate: searchParams.get("startDate"),
        endDate: searchParams.get("endDate"),
        orderStatus: searchParams.get("orderStatus") as OrderStatus | null
    }

    useEffect(() => {
        if (!searchParams.has("pageNumber") || !searchParams.has("pageSize")) {
            setSearchParams(prev => {
                const next = new URLSearchParams(prev);
                if (!next.has("pageNumber")) next.set("pageNumber", String(DEFAULT_PAGE_NUMBER));
                if (!next.has("pageSize")) next.set("pageSize", String(DEFAULT_PAGE_SIZE));
                return next;
            }, { replace: true })
        }
    }, [searchParams, setSearchParams])

    const { data, status, error } = useOrders(queryParams);


    function handleOrderFilterClick(filterValues: OrderFilter) {
        const { dateFrom, dateTo, orderStatus } = filterValues;
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            if (dateFrom) next.set("startDate", dateFrom.toISOString()); else next.delete("startDate");
            if (dateTo) next.set("endDate", dateTo.toISOString()); else next.delete("endDate");
            if (orderStatus) next.set("orderStatus", orderStatus); else next.delete("orderStatus");
            next.set("pageNumber", "1");
            return next;
        })
    }

    function handlePageSelect(page: number) {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set("pageNumber", page.toString());
            return next;
        })
    }

    function handleLimitSelect(limit: number) {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set("pageSize", limit.toString());
            next.set("pageNumber", "1"); // reset current page
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
    return (<div>
        <h1 className="text-xl">My orders</h1>

        <OrderFilters
            onClick={handleOrderFilterClick}
            onClearFilter={handleCrearFilter}
        />

        <OrderList orders={data.items} className="mt-2" />

        <Paginator
            currentPage={queryParams.pageNumber}
            currentPageLimit={queryParams.pageSize}
            hasNext={data.hasNext}
            hasPrevious={data.hasPrevious}
            totalPages={data.totalPages}
            onPageSelect={handlePageSelect}
            onLimitSelect={handleLimitSelect}
        />

    </div>)
}