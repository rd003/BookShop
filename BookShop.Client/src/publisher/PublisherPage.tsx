import type { QueryParameters } from "@/shared/types/queryParameters";
import usePublishers from "./hooks/usePublishers";
import type { ReadPublisher } from "./types/readPublisher";
import PublisherList from "./ui/PublisherList";
import PublisherFilter from "./ui/PublisherFilter";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, PAGE_SIZES } from "@/shared/constants/pagination";
import { parsePositiveInt } from "@/lib/parsePositiveInt";
import QueryState from "@/components/QueryState";
import Paginator from "@/components/Paginator";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyRecords from "@/components/EmptyRecords";
import { ConfirmDialog } from "@/components/ConfirmDialog";

const DEFAULT_SORTBY = 'name';

export default function PublisherPage() {
    const [resetFilterSignal, setResetFilterSignal]= useState(0);
    const [searchParams,setSearchParams] = useSearchParams();
    const [deleteTargetId, setDeleteTargetId] = useState<number|null>(null);

     const queryParams: QueryParameters = {
            pageNumber: parsePositiveInt(searchParams.get("pageNumber"), DEFAULT_PAGE_NUMBER),
            pageSize: (() => {
                const s = parsePositiveInt(searchParams.get("pageSize"), DEFAULT_PAGE_SIZE);
                return PAGE_SIZES.includes(s) ? s : DEFAULT_PAGE_SIZE;
            })(),
            searchTerm: searchParams.get("searchTerm"),
            sortBy: searchParams.get("sortBy") ?? DEFAULT_SORTBY
        }
    const hasFilters = !!(queryParams.searchTerm);
    const publisherQuery = usePublishers(queryParams);
    const {data,isFetching,isPlaceholderData} = publisherQuery;
    const publishers = data?.items || [];
    const hasNext = data?.hasNext;
    const hasPrev  = data?.hasPrevious;
    const totalPages = data?.totalPages;

    function handleEdit(data:ReadPublisher){
        console.log(data);
    }

    function handleDelete(id:number){
        setDeleteTargetId(id);
    }

    function handleSetFilter(searchTerm:string){
          if(searchTerm && searchTerm.trim().length > 0){
            updateSearchParams(p=>{
                p.set("searchTerm",searchTerm);
                p.set("pageNumber","1");
            })
          }
    }

    function handleClearFilter(){
          updateSearchParams(p=>{
            p.delete("searchTerm");
            p.set("pageNumber","1");
          })
    }

    function updateSearchParams(mutate:(searchParam:URLSearchParams)=>void, options?:{replace?:boolean}){
        setSearchParams((prev)=>{
            const next = new URLSearchParams(prev);
            mutate(next);
            return next;
        },options)
    }

    function handlePageSelect(page: number): void {
       updateSearchParams(p=>{
        p.set("pageNumber",String(page))
       })
    }

    function handleLimitSelect(limit: number): void {
        updateSearchParams(p=>{
        p.set("pageNumber","1");
        p.set("pageSize",String(limit))
       })
    }

    function confirmDelete(): void {
       // deleteTargetId
    }

    return (<>
      <h1 className="text-2xl">Publishers</h1>

     <PublisherFilter
     className="mt-2"
     onClear={handleClearFilter}
     onSubmit={handleSetFilter}
     resetSignal={resetFilterSignal}
     />

<div aria-busy={isFetching} className={isPlaceholderData ? "opacity-60 transition-opacity" : ""}>
            <QueryState
                query={publisherQuery}
                isEmpty={d => d.items.length === 0}
                skeleton={<LoadingSkeleton label="Loading genres" rows={queryParams.pageSize} />}
                empty={<EmptyRecords
                    filtered={hasFilters}
                    onClear={()=> setResetFilterSignal(s=>s+1)}
                    message="No publishers match the selected filters"
                />}>
                {d => <PublisherList
                        publishers={publishers}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        className="mt-2"
                    />}
            </QueryState>
        </div>

        {publisherQuery.status !== 'pending' && publishers.length > 0 &&
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

       <ConfirmDialog
                   open={deleteTargetId !== null}
                   onOpenChange={(open) => !open && setDeleteTargetId(null)}
                   title="Delete this publisher?"
                   description="This action cannot be undone."
                   isConfirming={false}
                   onConfirm={confirmDelete}
        />
    </>)
}