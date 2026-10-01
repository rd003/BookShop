import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { parseSort, serializeSort, toggleSort } from "@/lib/sort";
import type { QueryParameters } from "@/shared/types/queryParameters";
import { parsePositiveInt } from "@/lib/parsePositiveInt";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, PAGE_SIZES } from "@/shared/constants/pagination";
import useBooks from "./hooks/useBooks";
import BookList from "./ui/BookList";
import { toast } from "@/components/ui/toast";
import type { ReadBook } from "./types/readBook";
import QueryState from "@/components/QueryState";
import Paginator from "@/components/Paginator";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyRecords from "@/components/EmptyRecords";
import { useState } from "react";

const DEFAULT_SORTBY = "title";

export default function BookPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [resetFilterSignal,setResetFilterSignal] = useState(0);

    const queryParams: QueryParameters = {
                pageNumber: parsePositiveInt(searchParams.get("pageNumber"), DEFAULT_PAGE_NUMBER),
                pageSize: (() => {
                    const s = parsePositiveInt(searchParams.get("pageSize"), DEFAULT_PAGE_SIZE);
                    return PAGE_SIZES.includes(s) ? s : DEFAULT_PAGE_SIZE;
                })(),
                searchTerm: searchParams.get("searchTerm"),
                sortBy: searchParams.get("sortBy") ?? DEFAULT_SORTBY
            }

    const sortItems = parseSort(queryParams.sortBy);
    const hasFilters = !!(queryParams.searchTerm);

    const bookQuery = useBooks(queryParams);

    const {data,isFetching,isPlaceholderData} = bookQuery;
    const books = data?.items || [];
    const hasNext = data?.hasNext;
    const hasPrev  = data?.hasPrevious;
    const totalPages = data?.totalPages;



    function handleEdit(publisher: ReadBook): void {
       console.log(publisher);
    }

    function handleDelete(id: number): void {
        console.log(id);
    }

    function handleSortToggle(column: string, multi = false) {
            updateSearchParams((p) => {
                p.set("sortBy", serializeSort(toggleSort(sortItems, column, multi)));
                p.set("pageNumber", "1");
            })
    }

    function updateSearchParams(mutate: (param:URLSearchParams)=>void, options?:{replace?:boolean}){
        setSearchParams((prev)=>{
         const next = new URLSearchParams(prev);
         mutate(next);
         return next;
        },options)
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


    function handleClearFilter() {
        throw new Error("Function not implemented.");
    }

    function handlePageSelect(page: number): void {
        throw new Error("Function not implemented.");
    }

    function handleLimitSelect(limit: number): void {
        throw new Error("Function not implemented.");
    }

    return (<>

    <div className="flex items-end justify-between">
        <div>
            <h1 className="text-3xl font-semibold tracking-tight">Publishers</h1>
            <p className="text-sm text-muted-foreground">Manage the publishers available in your catalog.</p>
        </div>
        {data?.totalCount !== undefined && (
            <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium">
                {data.totalCount} total
            </span>
        )}


    </div>

    <Button variant="default" className="mt-2"><Plus className="size-4"/> Add</Button>

    <div aria-busy={isFetching} className={isPlaceholderData ? "opacity-60 transition-opacity" : ""}>
                <QueryState
                    query={bookQuery}
                    isEmpty={d => d.items.length === 0}
                    skeleton={<LoadingSkeleton label="Loading publishers" rows={queryParams.pageSize} />}
                    empty={<EmptyRecords
                        filtered={hasFilters}
                        onClear={()=>{handleClearFilter();setResetFilterSignal(s=>s+1)}}
                        message="No publishers match the selected filters"
                    />}>
                    {d => <BookList
        books={books}
        onDelete={handleDelete}
        onEdit={handleEdit}
        sort={sortItems}
        onSortToggle={handleSortToggle}
        />}
                </QueryState>
            </div>

            {bookQuery.status !== 'pending' && books.length > 0 &&
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