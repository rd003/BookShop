import type { QueryParameters } from "@/shared/types/queryParameters";
import usePublishers from "./hooks/usePublishers";
import type { ReadPublisher } from "./types/readPublisher";
import PublisherList from "./ui/PublisherList";
import PublisherFilter from "./ui/PublisherFilter";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const DEFAULT_SORTBY = 'name';

export default function PublisherPage() {
    const [resetFilterSignal, setResetFilterSigner]= useState(0);
    const [searchParams,setSearchParams] = useSearchParams();

    const queryParams:QueryParameters = {
        pageNumber:1,
        pageSize:2,
        searchTerm:null,
        sortBy: DEFAULT_SORTBY
    }
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
        console.log(id);
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

    return (<>
      <h1 className="text-2xl">Publishers</h1>

     <PublisherFilter
     className="mt-2"
     onClear={handleClearFilter}
     onSubmit={handleSetFilter}
     resetSignal={resetFilterSignal}
     />

     <PublisherList
     publishers={publishers}
     onEdit={handleEdit}
     onDelete={handleDelete}
     className="mt-2"
     />
    </>)
}