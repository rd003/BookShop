import type { QueryParameters } from "@/shared/types/queryParameters";
import usePublishers from "./hooks/usePublishers"
import type { ReadPublisher } from "./types/readPublisher";
import PublisherList from "./ui/PublisherList";

const DEFAULT_SORTBY = 'name';

export default function PublisherPage() {
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

    return (<>
      <h1 className="text-2xl">Publishers</h1>

     <PublisherList
     publishers={publishers}
     onEdit={handleEdit}
     onDelete={handleDelete}
     className="mt-2"
     />
    </>)
}