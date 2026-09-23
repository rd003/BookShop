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

export default function GenrePage() {
    const [selectedGenre, setSelectedGenre] = useState<UpdateGenre | null>(null);
    const [resetSignal, setResetSignal] = useState<number>(0);
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

    const genreQuery = useGenreQuery(queryParams);

    const {
        data,
        status: genreStatus,
        error: genreError,
        isFetching,
        isPlaceholderData
    } = genreQuery;

    const allGenres = data?.items ?? [];
    const hasNext = data?.hasNext;
    const hasPrev = data?.hasPrevious;
    const totalPages = data?.totalPages;

    const isLoading = genreStatus === 'pending';

    const submitting: boolean = false; // TODO: derive it from mutation status

    function handleSubmit(genre: UpdateGenre) {
        // console.log(genre);
        setResetSignal(prev => prev + 1);
        setSelectedGenre(null);
    }

    function handleFormEdit(genre: ReadGenre) {
        setSelectedGenre(genre as UpdateGenre);
    }

    function handleDelete(genreId: number) {
        setDeleteTargetId(genreId);
    }

    function confirmDeleteGenre() {
        console.log(`deleted: ${deleteTargetId}`)
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

    function updateSearchParams(mutate: (p: URLSearchParams) => void, options?: {
        replace?: boolean
    }) {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            mutate(next);
            return next;
        }, options)
    }

    function handleSortToggle(column: string, multi = false) {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set("sortBy", serializeSort(toggleSort(sortItems, column, multi)));
            next.set("pageNumber", "1");
            return next;
        });
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
        Define skeleton, handle error
        <GenreFilter
            onSearch={handleOnSearch}
            onClear={handleClearFilter}
            className="mt-4"
        />

        <GenreList
            genres={allGenres}
            onEdit={handleFormEdit}
            onDelete={handleDelete}
            className="mt-2"
            sort={sortItems}
            onSortToggle={handleSortToggle}
        />

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