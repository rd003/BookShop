import { useState } from "react";
import AuthorFilter from "./ui/AuthorFilter";
import { useSearchParams } from "react-router-dom";
import type { ReadAuthor } from "./types/readAuthor";
import AuthorList from "./ui/AuthorList";
import { parseSort, serializeSort, toggleSort } from "@/lib/sort";
import { toast } from "@/components/ui/toast";
import type { UpdateAuthor } from "./types/updateAuthor";
import AuthorDialog from "./ui/AuthorDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import Paginator from "@/components/Paginator";
import type { QueryParameters } from "@/shared/types/queryParameters";
import { parsePositiveInt } from "@/lib/parsePositiveInt";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, PAGE_SIZES } from "@/shared/constants/pagination";
import useAuthors from "./hooks/useAuthors";
import QueryState from "@/components/QueryState";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyRecords from "@/components/EmptyRecords";

const DEFAULT_SORT = "name";

export default function AuthorPage() {
    const [resetFilterSignal, setResetFilterSignal] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();
    const [editing, setEditing] = useState<ReadAuthor | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

    const queryParams:QueryParameters = {
        pageNumber: parsePositiveInt(searchParams.get("pageNumber"), DEFAULT_PAGE_NUMBER),
                pageSize: (() => {
                    const s = parsePositiveInt(searchParams.get("pageSize"), DEFAULT_PAGE_SIZE);
                    return PAGE_SIZES.includes(s) ? s : DEFAULT_PAGE_SIZE;
                })(),
                searchTerm: searchParams.get("searchTerm"),
                sortBy: searchParams.get("sortBy") ?? DEFAULT_SORT
    }

    const authorQuery = useAuthors(queryParams);
    const {isFetching,isPlaceholderData} = authorQuery;

    const isLoading = authorQuery.isPending;
    const authors:ReadAuthor[] = authorQuery.data?.items || [];
    const hasNext = authorQuery.data?.hasNext;
    const hasPrev = authorQuery.data?.hasPrevious;
    const totalPages = authorQuery.data?.totalPages;
    const authorStatus: string = authorQuery.status;
    const hasFilters = !!(queryParams.searchTerm);

    const submitting = false; //Todo: calculate it from author add/update mutation

    function handleSubmit(author: UpdateAuthor) {
        console.log(author);
    }

    const sortItems = parseSort(queryParams.sortBy);

    function handleSearch(searchTerm: string): void {
        if (!searchTerm || searchTerm.trim().length === 0) {
            return;
        }
        updateParams((p) => {
            p.set("searchTerm", searchTerm);
            p.set("pageNumber", "1");
        })
    }

    function handleFilterClear(): void {
        setResetFilterSignal(s => s + 1);
        updateParams((p) => {
            p.delete("searchTerm");
            p.set("pageNumber", "1");
        })
    }

    function handleAddAuthor() {
        setEditing(null);
        setDialogOpen(true);
    }

    function handleEdit(author: ReadAuthor) {
        setEditing(author);
        setDialogOpen(true);
    }

    function handleDelete(id: number) {
        setDeleteTargetId(id);
    }

    function confirmDelete() {
        // delete author with id: deleteTargeId
    }

    function handlePageSelect(page: number) {
        updateParams(p => {
            p.set("pageNumber", page.toString())
        })
    }

    function handleLimitSelect(limit: number) {
        updateParams((p) => {
            p.set("pageSize", limit.toString());
            p.set("pageNumber", "1");
        })
    }

    function handleSortToggle(column: string, multi = false) {
        updateParams((p) => {
            p.set("sortBy", serializeSort(toggleSort(sortItems, column, multi)));
            p.set("pageNumber", "1");
        })
    }

    function updateParams(mutate: (params: URLSearchParams) => void, options?: {
        replace?: boolean
    }) {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            mutate(next);
            return next;
        }, options)
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
        <h1 className="text-2xl my-2">Manage Authors</h1>

        <div className="mb-1.5">
            <Button variant="outline" onClick={handleAddAuthor}>Add <Plus /> </Button>
        </div>

        <AuthorFilter
            className="mt-2"
            onClear={handleFilterClear}
            onSearch={handleSearch}
            resetSignal={resetFilterSignal}
        />

<div aria-busy={isFetching} className={isPlaceholderData ? "opacity-60 transition-opacity" : ""}>
            <QueryState
                query={authorQuery}
                isEmpty={d => d.items.length === 0}
                skeleton={<LoadingSkeleton label="Loading genres" rows={queryParams.pageSize} />}
                empty={<EmptyRecords
                    filtered={hasFilters}
                    onClear={handleFilterClear}
                    message="No genres match the selected filters"
                />}>
                {d => <AuthorList
            className="mt-2"
            authors={authors}
            onEdit={handleEdit}
            onDelete={handleDelete}
            sort={sortItems}
            onSortToggle={handleSortToggle}
        />
}
            </QueryState>
        </div>

        {authorStatus !== 'pending' && authors.length > 0 &&
            <Paginator
                currentPage={queryParams.pageNumber}
                currentPageLimit={queryParams.pageSize}
                pageSizes={PAGE_SIZES}
                hasNext={hasNext!}
                hasPrevious={hasPrev!}
                totalPages={totalPages!}
                onPageSelect={handlePageSelect}
                onLimitSelect={handleLimitSelect}
                className="mt-2"
            />}

        <AuthorDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            title={editing ? "Edit address" : "Add new address"}
            submitting={submitting}
            submitLabel={editing ? "Save" : "Add"}
            defaultValues={editing as UpdateAuthor | null}
            onSubmit={handleSubmit}
            isLoading={isLoading}
        />

        <ConfirmDialog
            open={deleteTargetId !== null}
            onOpenChange={(open) => !open && setDeleteTargetId(null)}
            title="Delete this author?"
            description="This action cannot be undone."
            isConfirming={false}
            onConfirm={confirmDelete}
        />
    </>)
}