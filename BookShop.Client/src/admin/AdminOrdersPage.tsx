import { parseSort, serializeSort, toggleSort } from "@/lib/sort";
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
import { orderStatusSelectItems } from "@/shared/constants/orderStatus";
import {paymentStatusSelectItems} from "@/shared/constants/paymentStatus";
import type { ChangeOrderStatus } from "./types/changeOrderStatus";
import type { ChangePaymentStatus } from "./types/changePaymentStatus";
import { useState } from "react";
import { useChangeOrderStatusMutation } from "./hooks/useChangeOrderStatusMutation";
import { useChangePaymentStatusMutation } from "./hooks/useChangePaymentStatusMutation";
import { toast } from "@/components/ui/toast";

const DEFAULT_SORTBY = "orderDate";

export default function AdminOrdersPage() {
 const [searchParams,setSearchParams] = useSearchParams();
 const [resetChangeOrderStatusSignal, setResetChangeOrderStatusSignal] = useState(0);
 const [resetChangePaymentStatusSignal, setResetChangePaymentStatusSignal] = useState(0);

 const changeOrderStatusMutation = useChangeOrderStatusMutation();
 const changePaymentStatusMutation = useChangePaymentStatusMutation();

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
    const orders = data?.items ?? [];
    const hasNext = data?.hasNext;
    const hasPrev  = data?.hasPrevious;
    const totalPages = data?.totalPages;


  function handleSortToggle(column: string, multi = false){
    console.log(column);
     updateSearchParams((p) => {
                    p.set("sortBy", serializeSort(toggleSort(sortItems, column, multi)));
                    p.set("pageNumber", "1");
                })
  }

  function handleSetFilter(values: AdminOrderFilter){
       updateSearchParams(p=>{
        if(values.startingDate){
            p.set("startingOrderDate",values.startingDate.toISOString());
        }else{
            p.delete("startingOrderDate")
        }

        if(values.endingDate){
            p.set("endingOrderDate",values.endingDate.toISOString());
        }else{
            p.delete("endingOrderDate")
        }

         p.set("pageNumber","1");
       })
    }

    function handleClearFilter() {
        updateSearchParams((p)=>{
          ["startingOrderDate","endingOrderDate"].forEach((val)=>{
             p.delete(val);
          })
          p.set("pageNumber","1");
        });
    }

    function handlePageSelect(page: number): void {
        updateSearchParams(p=>{
            p.set("pageNumber",String(page));
        })
    }

    function handleLimitSelect(limit: number): void {
        updateSearchParams(p=>{
            p.set("pageSize",String(limit));
            p.set("pageNumber","1");
        })
    }

    function handleChangeOrderStatus(data:ChangeOrderStatus){
        changeOrderStatusMutation.mutate(data,{
            onSuccess:()=>{
              setResetChangeOrderStatusSignal(s=>s+1);
              toastSuccess("Order status is updated");
            },
            onError:(error)=>{
              console.log(error);
              toastError("Error on updating order status");
            }
        })
    }

    function handleChangePaymentStatus(data:ChangePaymentStatus){
        changePaymentStatusMutation.mutate(data,{
            onSuccess:()=>{
              setResetChangePaymentStatusSignal(s=>s+1);
              toastSuccess("Order status is updated");
            },
            onError:(error)=>{
              console.log(error);
              toastError("Error on updating order status");
            }
        })
    }

        function toastSuccess(description: string) {
        toast.add({
            type: "success",
            description
        })
    }

    function toastError(description: string) {
        toast.add({
            type: 'error',
            description
        })
    }

    function updateSearchParams(mutate:(p:URLSearchParams)=>void,options?:{replace?:boolean}){
        setSearchParams((prev)=>{
            const next = new URLSearchParams(prev);
            mutate(next);
            return next;
        },options)
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
                            orderStatuses={orderStatusSelectItems}
                            paymentStatuses={paymentStatusSelectItems}
                            resetOrderStausSignal={resetChangeOrderStatusSignal}
                            resetPaymentStatusSignal={resetChangePaymentStatusSignal}
                            onChangeOrderStatus={handleChangeOrderStatus}
                            onChangePaymentStatus={handleChangePaymentStatus}
                            onSortToggle={handleSortToggle}/>
                    }
        </QueryState>
      </div>

    {orderQuery.status !== 'pending' && orders.length > 0 &&
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