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
import PublisherForm from "./ui/PublisherForm";
import type { UpdatePublisher } from "./types/updatePublisher";
import { parseSort, serializeSort, toggleSort } from "@/lib/sort";
import useAddPublisher from "./hooks/useAddPublisher";
import useUpdatePublisher from "./hooks/useUpdatePublisher";
import useDeletePublisher from "./hooks/useDeletePublisher";
import type { CreatePublisher } from "./types/createPublisher";
import { toast } from "@/components/ui/toast";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const DEFAULT_SORTBY = 'name';

export default function PublisherPage() {
    const [resetFilterSignal, setResetFilterSignal]= useState(0);
    const [searchParams,setSearchParams] = useSearchParams();
    const [resetFormSignal, setResetFormSignal] = useState<number>(0);
    const [editingValues, setEditingValues] = useState<UpdatePublisher|null>(null);
    const [sheetOpen,setSheetOpen] = useState(false);

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
    const publisherQuery = usePublishers(queryParams);
    const {data,isFetching,isPlaceholderData} = publisherQuery;
    const publishers = data?.items || [];
    const hasNext = data?.hasNext;
    const hasPrev  = data?.hasPrevious;
    const totalPages = data?.totalPages;

    const addPublisherMutation = useAddPublisher();
    const updatePublisherMutation = useUpdatePublisher();
    const deletePublisherMutation = useDeletePublisher();

    const submitting = addPublisherMutation.status==='pending' || updatePublisherMutation.status==='pending';

    function onSheetOpenChange(){
          setSheetOpen(false);
    }

    function handleFormSubmit(data: UpdatePublisher) {
        if(data.id===0){
            const {id, ...createPayload} = data;
            addPublisher(createPayload);
        }
        else updatePublisher(data);
    }

    function addPublisher(data:CreatePublisher){
        addPublisherMutation.mutate(data,{
          onSuccess:()=>{
             toastSuccess("Publisher is created.");
             setResetFormSignal(s=>s+1);
             setSheetOpen(false);
          },
          onError:()=>{
              toastError("Error on creating publisher");
          }
        });
    }

    function updatePublisher(data:UpdatePublisher){
        updatePublisherMutation.mutate(data,{
          onSuccess:()=>{
             toastSuccess("Publisher is updated.");
             setResetFormSignal(s=>s+1);
             setSheetOpen(false);
          },
          onError:()=>{
              toastError("Error on updating publisher");
          }
        });
    }

    function handleEdit(data:ReadPublisher){
        setEditingValues(data as UpdatePublisher);
        setSheetOpen(true);
    }

    function handleDelete(id:number){
        const toastId = toast.add({
        type: "warning",
        title: "Delete this publisher?",
        description: "This action cannot be undone.",
        timeout: 0,
        actionProps: {
            children: "Delete",
            onClick: () => {
                toast.close(toastId);
                confirmDelete(id);
            },
        },
    });

    }

    function confirmDelete(id: number) {
        deletePublisherMutation.mutate(id, {
            onSuccess: () => toastSuccess("Publisher is deleted."),
            onError: () => toastError("Error on deleting publisher"),
        });
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


    function handleFormClear() {
        setEditingValues(null);
        setResetFormSignal(s=>s+1);
    }

    function handleSortToggle(column: string, multi = false) {
            updateSearchParams((p) => {
                p.set("sortBy", serializeSort(toggleSort(sortItems, column, multi)));
                p.set("pageNumber", "1");
            })
    }

    function updateSearchParams(mutate:(searchParam:URLSearchParams)=>void, options?:{replace?:boolean}){
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

    <Button variant="default" className="mt-2" onClick={()=>{setEditingValues(null);setSheetOpen(true);}}><Plus className="size-4"/> Add</Button>

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
                skeleton={<LoadingSkeleton label="Loading publishers" rows={queryParams.pageSize} />}
                empty={<EmptyRecords
                    filtered={hasFilters}
                    onClear={()=>{handleClearFilter();setResetFilterSignal(s=>s+1)}}
                    message="No publishers match the selected filters"
                />}>
                {d => <PublisherList
                        publishers={publishers}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        className="mt-2"
                        sort={sortItems}
                        onSortToggle={handleSortToggle}
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

        <Sheet open={sheetOpen} onOpenChange={onSheetOpenChange}>
            <SheetContent>
               <PublisherForm
                editingValues={editingValues}
                onClear={handleFormClear}
                onSubmit={handleFormSubmit}
                resetSignal={resetFormSignal}
                submitting={submitting}
              />
            </SheetContent>
        </Sheet>
    </>)
}