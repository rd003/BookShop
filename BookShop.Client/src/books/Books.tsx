import { useEffect, useRef, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

import { X } from "lucide-react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { PagedList } from "@/shared/types/pagedList";
import type { ReadBook } from "./types/readBook";
import { fetchBooks } from "./booksApi";
import type { ReadGenre } from "@/genres/types/readGenre";
import { getGenres } from "@/genres/genreApi";
import { useSearchParams } from "react-router-dom";
import BookList from "./BookList";

export default function Books() {
    const { data: genreData, status: genreStatus, error: genreError, isFetching: isGenreFetching } = useQuery<PagedList<ReadGenre>, Error>({
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

    function handAddToCart(bookId: number) {
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
                {/* Genre filter sidebar */}
                <aside>
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-medium text-stone-900">Genres</h2>
                        {selectedGenres.length > 0 && (
                            <button
                                onClick={clearFilters}
                                className="text-xs text-stone-400 hover:text-stone-700 flex items-center gap-1"
                            >
                                <X className="h-3 w-3" /> Clear
                            </button>
                        )}
                    </div>

                    {/* genres */}
                    {genreStatus === 'pending' && <p className="text-xs text-stone-400">Loading genres...</p>}

                    {genreStatus === 'error' && <p className="text-xs text-red-500">{genreError?.message}</p>}

                    <ul className="mt-3 space-y-2">
                        {allGenres.map((genre: ReadGenre) => (
                            <li key={genre.id} className="flex items-center gap-2">
                                <Checkbox
                                    id={`genre-${genre.id}`}
                                    checked={selectedGenres.some((g) => g.id === genre.id)}
                                    onCheckedChange={() => toggleGenre(genre)}
                                />
                                <label
                                    htmlFor={`genre-${genre.id}`}
                                    className="text-sm text-stone-600 cursor-pointer select-none"
                                >
                                    {genre.name}
                                </label>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* Book grid */}
                {status === 'pending' && <p className="text-sm text-stone-500 py-12 text-center">Loading books...</p>}

                {status === 'error' && <p className="text-sm text-red-500 py-12 text-center">{error?.message}</p>}

                <section>
                    <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm text-stone-500">
                            {books.length} {books.length === 1 ? "book" : "books"}
                        </p>
                    </div>

                    {books.length === 0 ? (
                        <p className="text-sm text-stone-500 py-12 text-center">
                            No books match the selected genres.
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                            {books.map((book: ReadBook) => (
                                <BookList key={book.id} book={book} onAddToCart={handAddToCart} />
                            ))}
                        </div>

                    )}
                </section>
            </div>
            <div ref={loadMoreRef} className="h-1" />
            {isFetchingNextPage && (
                <p className="text-center text-sm text-stone-500 py-4">Loading more...</p>
            )}
        </div >
    );
}