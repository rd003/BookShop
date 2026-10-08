import { parseSort } from "@/lib/sort";
import AdminOrderList from "./ui/AdminOrderList";
import { parsePositiveInt } from "@/lib/parsePositiveInt";
import { useSearchParams } from "react-router-dom";
import type { AdminOrderQueryParameters } from "./types/adminOrderQueryParameters";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, PAGE_SIZES } from "@/shared/constants/pagination";
import { useAdminOrders } from "./hooks/useAdminOrders";
import QueryState from "@/components/QueryState";
import EmptyRecords from "@/components/EmptyRecords";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import Paginator from "@/components/Paginator";
import AdminOrderFilters, { type AdminOrderFilter } from "./ui/AdminOrderFilter";

const DEFAULT_SORTBY = "orderDate";

export default function AdminOrdersPage() {
 const [searchParams,setSearchParams] = useSearchParams();

const queryParams: AdminOrderQueryParameters = {
    pageNumber: parsePositiveInt(searchParams.get("pageNumber"), DEFAULT_PAGE_NUMBER),
    pageSize: (() => {
                const s = parsePositiveInt(searchParams.get("pageSize"), DEFAULT_PAGE_SIZE);
                return PAGE_SIZES.includes(s) ? s : DEFAULT_PAGE_SIZE;
            })(),
    sortBy: searchParams.get("sortBy") ?? DEFAULT_SORTBY,
    startingOrderDate: searchParams.get("startingOrderDate") ?? null,
    endingOrderDate: searchParams.get("endingOrderDate") ?? null,
  }

    const sortItems = parseSort(queryParams.sortBy);
    const hasFilters = !!(queryParams.startingOrderDate || queryParams.endingOrderDate);

    const orderQuery = useAdminOrders(queryParams);

    const {data,isFetching,isPlaceholderData} = orderQuery;
    const publishers = data?.items || [];
    const hasNext = data?.hasNext;
    const hasPrev  = data?.hasPrevious;
    const totalPages = data?.totalPages;

    const orders = data?.items ?? [];

  function handleSortToggle(column: string, multi = false){
    console.log(column);
    //  updateSearchParams((p) => {
    //                 p.set("sortBy", serializeSort(toggleSort(sortItems, column, multi)));
    //                 p.set("pageNumber", "1");
    //             })
  }
    function handleSetFilter(values: AdminOrderFilter){
       console.log(values);
    }

    function handleClearFilter() {
        throw new Error("Function not implemented.");
    }

    function handlePageSelect(page: number): void {
        console.log(page);
    }

    function handleLimitSelect(limit: number): void {
        console.log(limit)
    }

    return (<>
      <h1 className="text-2xl">Orders</h1>

      <AdminOrderFilters
      onClick={handleSetFilter}
      onClearFilter={handleClearFilter}
      />

      <div aria-busy={isFetching} className={isPlaceholderData ? "opacity-60 transition-opacity" : ""}>
                <QueryState
                    query={orderQuery}
                    isEmpty={d => d.items.length === 0}
                    skeleton={<LoadingSkeleton label="Loading orders" rows={queryParams.pageSize} />}
                    empty={<EmptyRecords
                        filtered={hasFilters}
                        onClear={()=>{handleClearFilter();}}
                        message="No orders match the selected filters"
                    />}>
                    {d => <AdminOrderList
                            orders={orders}
                            sort={sortItems}
                            onSortToggle={handleSortToggle}/>
                    }
        </QueryState>
      </div>

    {orderQuery.status !== 'pending' && publishers.length > 0 &&
        <Paginator
            currentPage={queryParams.pageNumber}
            currentPageLimit={queryParams.pageSize}
            pageSizes={PAGE_SIZES}
            hasNext={hasNext! && !isPlaceholderData}
            hasPrevious={hasPrev! && !isPlaceholderData}
            totalPages={totalPages!}
            onPageSelect={handlePageSelect}
            onLimitSelect={handleLimitSelect}
            className="mt-2"
        />}

    </>)
}