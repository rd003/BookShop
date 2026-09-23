import type { OrdersQueryParameters } from "@/shared/types/queryParameters";
import { useOrders } from "./hooks/useOrders"
import OrderFilters, { type OrderFilter } from "./OrderFilters";
import type { OrderStatus } from "@/shared/constants/orderStatus";
import { useSearchParams } from "react-router-dom";
import Paginator from "../components/Paginator";
import { useEffect } from "react";
import OrderList from "./OrderList";
import EmptyOrders from "./orders-ui/EmptyOrders";
import OrderListSkeleton from "./orders-ui/OrderListSkeleton";
import QueryState from "@/components/QueryState";
import { parseSort, serializeSort, toggleSort } from "@/lib/sort";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, PAGE_SIZES } from "@/shared/constants/pagination";
import { parsePositiveInt } from "@/lib/parsePositiveInt";

const DEFAULT_SORT = "orderDate desc"

export default function Orders() {
    const [searchParams, setSearchParams] = useSearchParams();

    const queryParams: OrdersQueryParameters = {
        pageNumber: parsePositiveInt(searchParams.get("pageNumber"), DEFAULT_PAGE_NUMBER),
        pageSize: (() => {
            const s = parsePositiveInt(searchParams.get("pageSize"), DEFAULT_PAGE_SIZE);
            return PAGE_SIZES.includes(s) ? s : DEFAULT_PAGE_SIZE;
        })(),
        sortBy: searchParams.get("sortBy") ?? DEFAULT_SORT,
        startDate: searchParams.get("startDate"),
        endDate: searchParams.get("endDate"),
        orderStatus: searchParams.get("orderStatus") as OrderStatus | null
    }
    const ordersQuery = useOrders(queryParams);
    const { data, status, isFetching, isPlaceholderData } = ordersQuery;

    const hasFilters = !!(queryParams.startDate || queryParams.endDate || queryParams.orderStatus);

    const sortItems = parseSort(queryParams.sortBy);

    useEffect(() => {
        if (data && data.totalPages > 0 && queryParams.pageNumber > data.totalPages) {
            setSearchParams(prev => {
                const next = new URLSearchParams(prev);
                next.set("pageNumber", String(data.totalPages));
                return next;
            }, { replace: true });
        }
    }, [data, queryParams.pageNumber, setSearchParams]);

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

    function handleSortToggle(column: string, multi = false) {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set("sortBy", serializeSort(toggleSort(sortItems, column, multi)));
            next.set("pageNumber", "1");
            return next;
        });
    }

    function handlePageSelect(page: number) {
        updateParams(p => p.set("pageNumber", String(page)));
    }

    function handleLimitSelect(limit: number) {
        updateParams(p => {
            p.set("pageSize", String(limit));
            p.set("pageNumber", "1");
        });
    }

    function handleClearFilter() {
        updateParams(p => {
            ["startDate", "endDate", "orderStatus"].forEach(k => p.delete(k));
            p.set("pageNumber", "1");
        });
    }

    function updateParams(mutate: (p: URLSearchParams) => void, options?: { replace?: boolean }) {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            mutate(next);
            return next;
        }, options);
    }

    return (
        <div>
            <h1 className="text-xl">My orders</h1>

            <OrderFilters onClick={handleOrderFilterClick} onClearFilter={handleClearFilter} />

            {/* List region: the only part that switches state */}
            <div aria-busy={isFetching} className={isPlaceholderData ? "opacity-60 transition-opacity" : ""}>
                <QueryState
                    query={ordersQuery}
                    isEmpty={d => d.items.length === 0}
                    skeleton={<OrderListSkeleton rows={queryParams.pageSize} />}
                    empty={<EmptyOrders filtered={hasFilters} onClear={handleClearFilter} />}
                >
                    {d => <OrderList
                        orders={d.items}
                        sort={sortItems}
                        onSortToggle={handleSortToggle}
                        className="mt-2" />}
                </QueryState>
            </div>

            {status === "success" && data.items.length > 0 && (
                <Paginator
                    currentPage={queryParams.pageNumber}
                    currentPageLimit={queryParams.pageSize}
                    hasNext={data.hasNext && !isPlaceholderData}
                    hasPrevious={data.hasPrevious && !isPlaceholderData}
                    totalPages={data.totalPages}
                    pageSizes={PAGE_SIZES}
                    onPageSelect={handlePageSelect}
                    onLimitSelect={handleLimitSelect}
                />
            )}
        </div>
    );
}