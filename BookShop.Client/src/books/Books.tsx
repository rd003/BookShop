import { useState } from "react";
import type { ReadGenre } from "@/genres/types/readGenre";
import { useSearchParams } from "react-router-dom";
import GenreSidebar from "./GenreSidebar";
import BookGrid from "./BookGrid";
import useGenreQuery from "./hooks/useGenreQuery";
import { useBooksQuery } from "./hooks/useBooksQuery";
import { useInfiniteScroll } from "./hooks/useInfinitScroll";
import type { AddCartItemRequest } from "@/cart/types/addCartItemRequest";
import { useAddCartItem } from "./hooks/useCartMutation";
import { toast } from "@/components/ui/toast";

export default function Books() {
    const { allGenres, genreError, genreStatus } = useGenreQuery();
    const [searchParams] = useSearchParams();

    const [selectedGenres, setSelectedGenres] = useState<ReadGenre[]>([]);
    const genreIds = selectedGenres.map(g => g.id);

    const searchTerm = searchParams.get('search') ?? '';

    const { books,
        status,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage } = useBooksQuery(searchTerm, genreIds);

    const loadMoreRef = useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage });

    const addCartMutation = useAddCartItem();

    const disableCartButton = addCartMutation.status === 'pending';

    function handleAddToCart(bookId: number) {
        const cartItemReq: AddCartItemRequest = {
            bookId,
            quantity: 1
        };
        addCartMutation.mutate(cartItemReq);
        toast.add({
            title: "Added to cart",
            type: "success"
        })
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
                {
                    addCartMutation.status === "error" ? <p>{addCartMutation.error.message}</p> : null
                }
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
                    disableCartButton={disableCartButton}
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