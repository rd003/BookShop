import { useState } from "react";
import type { UpdateGenre } from "./types/updateGenre";
import GenreForm from "./ui/GenreForm";
import type { ReadGenre } from "./types/readGenre";
import GenreList from "./ui/GenreList";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import useGenreQuery from "./hooks/useGenreQuery";
import Paginator from "@/components/Paginator";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, PAGE_SIZES } from "@/shared/constants/pagination";
import type { QueryParameters } from "@/shared/types/queryParameters";
import { useSearchParams } from "react-router-dom";
import { parsePositiveInt } from "@/lib/parsePositiveInt";
import GenreFilter from "./ui/GenreFilter";
import { parseSort, serializeSort, toggleSort } from "@/lib/sort";
import QueryState from "@/components/QueryState";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyRecords from "@/components/EmptyRecords";
import { useAddGenre } from "./hooks/useAddGenre";
import type { CreateGenre } from "./types/createGenre";
import { useUpdateGenre } from "./hooks/useUpdateGenre";
import useDeleteGenre from "./hooks/useDeleteGenre";
import { toast } from "@/components/ui/toast";

export default function GenrePage() {
    const [selectedGenre, setSelectedGenre] = useState<UpdateGenre | null>(null);
    const [resetSignal, setResetSignal] = useState<number>(0);
    const [resetFilterSignal, setResetFilterSignal] = useState<number>(0);
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const DEFAULT_SORT = "name";

    const queryParams: QueryParameters = {
        pageNumber: parsePositiveInt(searchParams.get("pageNumber"), DEFAULT_PAGE_NUMBER),
        pageSize: (() => {
            const s = parsePositiveInt(searchParams.get("pageSize"), DEFAULT_PAGE_SIZE);
            return PAGE_SIZES.includes(s) ? s : DEFAULT_PAGE_SIZE;
        })(),
        searchTerm: searchParams.get("searchTerm"),
        sortBy: searchParams.get("sortBy") ?? DEFAULT_SORT
    }
    const sortItems = parseSort(queryParams.sortBy);

    const genresQuery = useGenreQuery(queryParams);

    const {
        data,
        status: genreStatus,
        isFetching,
        isPlaceholderData
    } = genresQuery;

    const allGenres = data?.items ?? [];
    const hasNext = data?.hasNext;
    const hasPrev = data?.hasPrevious;
    const totalPages = data?.totalPages;

    // const isLoading = genreStatus === 'pending';
    const hasFilters = !!(queryParams.searchTerm);

    const addGenreMutation = useAddGenre();
    const updateGenreMutation = useUpdateGenre();
    const deleteGenreMutation = useDeleteGenre();

    const submitting: boolean = addGenreMutation.status === 'pending';

    function handleSubmit(genre: UpdateGenre) {
        console.log(genre);
        if (genre.id === 0) createGenre(genre);
        else updateGenre(genre)
    }

    function createGenre(genre: UpdateGenre) {
        console.log("create");
        const createGenre: CreateGenre = { name: genre.name };
        addGenreMutation.mutate(createGenre, {
            onSuccess: () => {
                setResetSignal(prev => prev + 1);
                setSelectedGenre(null);
                toastSuccess("Record is added!");
            },
            onError: () => toastError("Record could not added!")
        });
    }

    function updateGenre(genre: UpdateGenre) {
        console.log("create");
        updateGenreMutation.mutate(genre, {
            onSuccess: () => {
                setResetSignal(prev => prev + 1);
                setSelectedGenre(null);
                toastSuccess("Record is updated!");
            },
            onError: () => {
                toastError("Record could not updated!");
            }
        })
    }

    function handleFormEdit(genre: ReadGenre) {
        setSelectedGenre(genre as UpdateGenre);
    }

    function handleDelete(genreId: number) {
        setDeleteTargetId(genreId);
    }

    function confirmDeleteGenre() {
        if (deleteTargetId) {
            deleteGenreMutation.mutate(deleteTargetId, {
                onSuccess: () => {
                    toastSuccess("Record is deleted successfully!");
                    setDeleteTargetId(null);
                },
                onError: () => toastError("Record could not deleted!")
            })
        }
    }

    function handlePageSelect(page: number) {
        updateSearchParams(p => {
            p.set("pageNumber", page.toString())
        })
    }

    function handleLimitSelect(limit: number) {
        updateSearchParams((p) => {
            p.set("pageSize", limit.toString());
            p.set("pageNumber", "1");
        })
    }

    function handleOnSearch(term: string) {
        console.log({ term });
        if (term && term.trim().length > 0) {
            updateSearchParams((p) => {
                p.set("searchTerm", term);
                p.set("pageNumber", "1");
            })
        }
    }

    function handleClearFilter() {
        updateSearchParams((p) => {
            p.delete("searchTerm");
            p.set("pageNumber", "1");
        });
    }

    function hadleResetGenreFilter() {
        setResetFilterSignal(s => s + 1);
        handleClearFilter();
    }

    function handleSortToggle(column: string, multi = false) {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set("sortBy", serializeSort(toggleSort(sortItems, column, multi)));
            next.set("pageNumber", "1");
            return next;
        });
    }
    function updateSearchParams(mutate: (p: URLSearchParams) => void, options?: {
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

    return (<div>
        <h1 className="text-2xl">Manage Genres</h1>

        <GenreForm
            selectedGenre={selectedGenre}
            onSubmit={handleSubmit}
            submitting={submitting}
            resetSignal={resetSignal}
            className="mt-2 mb-4"
        />

        <hr />

        <GenreFilter
            onSearch={handleOnSearch}
            onClear={handleClearFilter}
            className="mt-4"
            resetSignal={resetFilterSignal}
        />
        <div aria-busy={isFetching} className={isPlaceholderData ? "opacity-60 transition-opacity" : ""}>
            <QueryState
                query={genresQuery}
                isEmpty={d => d.items.length === 0}
                skeleton={<LoadingSkeleton label="Loading genres" rows={queryParams.pageSize} />}
                empty={<EmptyRecords
                    filtered={hasFilters}
                    onClear={hadleResetGenreFilter}
                    message="No genres match the selected filters"
                />}>
                {d => <GenreList
                    genres={allGenres}
                    onEdit={handleFormEdit}
                    onDelete={handleDelete}
                    className="mt-2"
                    sort={sortItems}
                    onSortToggle={handleSortToggle}
                />}
            </QueryState>
        </div>


        {genreStatus !== 'pending' && allGenres.length > 0 &&
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
            title="Delete this genre?"
            description="This action cannot be undone."
            isConfirming={false}
            onConfirm={confirmDeleteGenre}
        />
    </div>)
}