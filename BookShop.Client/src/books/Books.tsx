import { useEffect, useRef, useState } from "react";
import type { ReadGenre } from "@/genres/types/readGenre";
import { useSearchParams } from "react-router-dom";
import GenreSidebar from "./GenreSidebar";
import BookGrid from "./BookGrid";
import useGenreQuery from "./hooks/useGenreQuery";
import { useBooksQuery } from "./hooks/useBooksQuery";
import { useInfiniteScroll } from "./hooks/useInfinitScroll";

export default function Books() {
    const { allGenres, genreError, genreStatus } = useGenreQuery();

    const [selectedGenres, setSelectedGenres] = useState<ReadGenre[]>([]);
    const genreIds = selectedGenres.map(g => g.id);

    const [searchParams] = useSearchParams();
    const searchTerm = searchParams.get('search') ?? '';

    const { books,
        status,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage } = useBooksQuery(searchTerm, genreIds);

    const loadMoreRef = useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage });

    function handleAddToCart(bookId: number) {
        console.log(bookId);
    }

    function toggleGenre(genre: ReadGenre) {
        setSelectedGenres(prev => prev.some(g => g.id === genre.id) ? prev.filter(g => g.id !== genre.id) : [...prev, genre]);
    }

    function clearFilters() {
        setSelectedGenres([]);
    }

    return (
        <div className="mx-auto max-w-6xl px-4 py-10">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]">
                <GenreSidebar
                    allGenres={allGenres}
                    genreStatus={genreStatus}
                    genreError={genreError}
                    selectedGenres={selectedGenres}
                    onToggleGenre={toggleGenre}
                    onClearFilters={clearFilters}
                />

                <BookGrid
                    books={books}
                    status={status}
                    error={error}
                    onAddToCart={handleAddToCart}
                />
            </div>
            <div ref={loadMoreRef} className="h-1" />
            {isFetchingNextPage && (
                <p className="text-center text-sm text-stone-500 py-4">Loading more...</p>
            )}
        </div >
    );
}