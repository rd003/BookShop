import BookList from "./BookList";
import type { ReadBook } from "./types/readBook";

type BookGridProps = {
    books: ReadBook[],
    status: "error" | "success" | "pending",
    error: Error | null,
    onAddToCart: (bookId: number) => void
}
export default function BookGrid({ books, error, status, onAddToCart }: BookGridProps) {
    return (
        <section>
            {status === 'pending' && <p className="text-sm text-stone-500 py-12 text-center">Loading books...</p>}

            {status === 'error' && <p className="text-sm text-red-500 py-12 text-center">{error?.message}</p>}

            {status === 'success' && (
                <>
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
                                <BookList key={book.id} book={book} onAddToCart={onAddToCart} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </section>
    );
}