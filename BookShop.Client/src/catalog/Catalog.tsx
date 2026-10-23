import type { ReadGenre } from "@/genres/types/readGenre";
import { useSearchParams } from "react-router-dom";
import GenreSidebar from "./GenreSidebar";
import BookGrid from "./BookGrid";
import useGenreQuery from "../genres/hooks/useGenreQuery";
import { useInfiniteScroll } from "./hooks/useInfinitScroll";
import type { AddCartItemRequest } from "@/cart/types/addCartItemRequest";
import { useAddCartItem } from "./hooks/useCartMutation";
import { toast } from "@/components/ui/toast";
import type { QueryParameters } from "@/shared/types/queryParameters";
import { useBooksQuery } from "@/book/hooks/useBooksQuery";
import type { BookQueryParameters } from "@/book/types/bookQueryParameters";

export default function Books() {
    const genreQueryParameters: QueryParameters = {
        pageNumber: 1,
        pageSize: 1000,
        sortBy: null,
        searchTerm: null
    };
    const genreQuery = useGenreQuery(genreQueryParameters);

    const {
        data,
    } = genreQuery;

    const allGenres = data?.items ?? [];

    const [searchParams, setSearchParams] = useSearchParams();

   const selectedGenreIds = searchParams.getAll("genreIds").map(Number).filter(n => !Number.isNaN(n));

    const bookQueryParam: BookQueryParameters = {
        pageNumber: 1,
        pageSize: 1000,
        sortBy: null,
        searchTerm: searchParams.get('search') ?? null,
        genreIds: selectedGenreIds.length > 0 ? selectedGenreIds : undefined
    };
    const { books, status, error, fetchNextPage, hasNextPage, isFetchingNextPage,
    refetch } = useBooksQuery(bookQueryParam);

    const hasFilters = selectedGenreIds.length > 0 || !!bookQueryParam.searchTerm;

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

    function getSelectedGenre(): ReadGenre[]{
        const ids = searchParams.getAll('genreIds').map(Number).filter(n => !Number.isNaN(n));
        return allGenres.filter(g=> ids.includes(g.id));
    }

    function toggleGenre(genre: ReadGenre) {
        updateSearchParams((p)=>{
            const current = p.getAll("genreIds");
            const id = String(genre.id);

            p.delete("genreIds");

            const next = current.includes(id) ? current.filter(x=>x!==id)
            : [...current,id];

            next.forEach(x=> p.append("genreIds",x));
        });
    }

    function clearFilters() {
       updateSearchParams((p)=>{
           p.delete("genreIds");
           p.delete("search");
       });
    }

    function updateSearchParams(mutate: (p:URLSearchParams)=>void, options?:{replace?:boolean}){
        setSearchParams((prev)=>{
            const next = new URLSearchParams(prev);
            mutate(next);
            return next;
        },options)
    }

    return (
        <div className="mx-auto max-w-6xl px-4 py-10">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]">
                {
                    addCartMutation.status === "error" ? <p>{addCartMutation.error.message}</p> : null
                }
                <GenreSidebar
                    allGenres={allGenres}
                    genreQuery={genreQuery}
                    selectedGenres={getSelectedGenre()}
                    onToggleGenre={toggleGenre}
                    onClearFilters={clearFilters}
                />

                <BookGrid
                    disableCartButton={disableCartButton}
                    onAddToCart={handleAddToCart}
                     query={{ status, data: books, error, refetch }}
                     hasFilters={hasFilters}
                     onClearFilters={clearFilters}
                />

            </div>
            <div ref={loadMoreRef} className="h-1" />
            {isFetchingNextPage && (
                <p className="text-center text-sm text-stone-500 py-4">Loading more...</p>
            )}
        </div >
    );
}