import { useEffect, useRef, useState } from "react";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { PagedList } from "@/shared/types/pagedList";
import type { ReadBook } from "./types/readBook";
import { fetchBooks } from "./booksApi";
import type { ReadGenre } from "@/genres/types/readGenre";
import { getGenres } from "@/genres/genreApi";
import { useSearchParams } from "react-router-dom";
import GenreSidebar from "./GenreSidebar";
import BookGrid from "./BookGrid";

export default function Books() {
    const { data: genreData, status: genreStatus, error: genreError } = useQuery<PagedList<ReadGenre>, Error>({
        queryKey: ['genres'],
        queryFn: () => getGenres({ pageNumber: 1, pageSize: 1000, searchTerm: '', sortBy: '' }),
        staleTime: 30_000,
        gcTime: 5 * 60_000
    });

    const allGenres = genreData?.items ?? [];
    const [selectedGenres, setSelectedGenres] = useState<ReadGenre[]>([]);
    const genreIds = selectedGenres.map(g => g.id);

    const [searchParams] = useSearchParams();
    const searchTerm = searchParams.get('search') ?? '';
    const bookQueryParam = { pageNumber: 1, pageSize: 2, searchTerm, sortBy: '' };

    const { data,
        status,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage } = useInfiniteQuery<PagedList<ReadBook>, Error>({
            queryKey: ['books', bookQueryParam, genreIds],
            queryFn: ({ pageParam }) => fetchBooks({ ...bookQueryParam, pageNumber: pageParam as number }, genreIds),
            initialPageParam: 1,
            getNextPageParam: (lastPage) => lastPage.hasNext ? lastPage.pageNumber + 1 : undefined,
            staleTime: 30_000,
            gcTime: 5 * 60_000
        });
    const books: ReadBook[] = data?.pages.flatMap(page => page.items) ?? [];

    const loadMoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = loadMoreRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 1.0 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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