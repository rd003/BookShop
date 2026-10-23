import BookList from "./BookList";
import type { ReadBook } from "../book/types/readBook";
import type { QueryLike } from "@/components/QueryState";
import QueryState from "@/components/QueryState";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyRecords from "@/components/EmptyRecords";

type BookGridProps = {
    query: QueryLike<ReadBook[]>,
    hasFilters: boolean,
    onClearFilters: () => void,
    disableCartButton: boolean,
    onAddToCart: (bookId: number) => void
}
export default function BookGrid({ query, hasFilters, onClearFilters, disableCartButton, onAddToCart }: BookGridProps) {
    return (
         <section>
            <QueryState
                query={query}
                isEmpty={books => books.length === 0}
                skeleton={<LoadingSkeleton label="Loading books" rows={6} />}
                empty={<EmptyRecords
                    filtered={hasFilters}
                    onClear={onClearFilters}
                    message="No books match the selected filters"
                    emptyMessage="No books available yet."
                />}>
                {books => (
                    <>
                        <div className="mb-4 flex items-center justify-between">
                            <p className="text-sm text-stone-500">
                                {books.length} {books.length === 1 ? "book" : "books"}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                            {books.map((book: ReadBook) => (
                                <BookList disableCartButton={disableCartButton} key={book.id} book={book} onAddToCart={onAddToCart} />
                            ))}
                        </div>
                    </>
                )}
            </QueryState>
        </section>
    );
}