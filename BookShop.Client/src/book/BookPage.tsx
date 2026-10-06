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
import BookFilter from "./ui/BookFilter";
import { useAllPublishers } from "@/publisher/hooks/useAllPublishers";
import BookForm from "./ui/BookForm";
import type { UpdateBook } from "./types/updateBook";
import type { BookFormValues } from "./types/bookSchema";
import { useAllGenres } from "@/genres/hooks/useAllGenres";
import { useAllAuthors } from "@/author/hooks/useAllAuthors";

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
    const allPublishersQuery = useAllPublishers();
    const allGenresQuery = useAllGenres();
    const allAuthorsQuery = useAllAuthors();

    const sortItems = parseSort(queryParams.sortBy);
    const hasFilters = !!(queryParams.searchTerm);

    const bookQuery = useBooks(queryParams);

    const {data,isFetching,isPlaceholderData} = bookQuery;
    const books = data?.items || [];
    const hasNext = data?.hasNext;
    const hasPrev  = data?.hasPrevious;
    const totalPages = data?.totalPages;
    const isSubmitting = false; // Todo: calculate it
    const [editingBook,setEditingBook] =  useState<UpdateBook | null>(null);

    function handlOnBookSubmit(bookValues: BookFormValues){
      console.log(bookValues);
    }

    function handleEdit(book: ReadBook): void {
       const updateBook:UpdateBook = {
        id: book.id,
        title: book.title,
        isbn: book.isbn,
        coverImageUrl: book.coverImageUrl,
        price: book.price,
        description: book.description,
        publisherId: book.publisherId,
        stockQuantity: book.stockQuantity,
        authorIds:book.authors.map(a=>a.id),
        genreIds:book.genres.map(g=>g.id),
        newAuthorNames: [],
        newPublisherName:"",
        newGenreNames:[],
       };
       setEditingBook(updateBook);
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

    function handleSearch(searchTerm:string){
        if(searchTerm.trim().length===0) return;
        updateSearchParams((p)=>{
            p.set("searchTerm",searchTerm),
            p.set("pageNumber","1")
        })
    }

    function handleClearFilter() {
        setResetFilterSignal(s=>s+1);
        updateSearchParams((p)=>{
            p.delete("searchTerm");
            p.set("pageNumber","1");
        })
    }

    function handlePageSelect(page: number): void {
        updateSearchParams((p)=>{
            p.set("pageNumber",page.toString());
        })
    }

    function handleLimitSelect(limit: number): void {
        updateSearchParams((p)=>{
            p.set("pageSize",limit.toString());
            p.set("pageNumber","1");
        })
    }

    function handleGenreChange(genreIds:number[]){
       console.log(genreIds);
    }

    function handleAuthorChange(authorIds:number[]){
       console.log(authorIds);
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

    function updateSearchParams(mutate: (param:URLSearchParams)=>void, options?:{replace?:boolean}){
        setSearchParams((prev)=>{
         const next = new URLSearchParams(prev);
         mutate(next);
         return next;
        },options)
    }

    return (<>

    <div className="flex items-end justify-between">
        <div>
            <h1 className="text-3xl font-semibold tracking-tight">Books</h1>
            <p className="text-sm text-muted-foreground">Manage the books available in your catalog.</p>
        </div>
        {data?.totalCount !== undefined && (
            <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium">
                {data.totalCount} total
            </span>
        )}
    </div>

    <Button variant="default" className="mt-2"><Plus className="size-4"/> Add</Button>

    <BookForm
    key={editingBook?.id ?? "new"}
    defaultValues={editingBook}
    onSubmit={handlOnBookSubmit}
    publishers={allPublishersQuery.data??[]}
    authors={allAuthorsQuery.data ?? []}
    genres={allGenresQuery.data ?? []}
    isSubmitting={isSubmitting}
    submitLabel={editingBook ? 'Edit': 'add'}
    onGenreChange={handleGenreChange}
    onAuthorChange={handleAuthorChange}
    />

    <BookFilter
    className="mt-2"
    resetSignal={resetFilterSignal}
    onClear={handleClearFilter}
    onSearch={handleSearch}
    />

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