import { useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PagedList } from "@/shared/types/pagedList";
import type { ReadBook } from "./types/readBook";
import { fetchBooks } from "./booksApi";
import type { ReadGenre } from "@/genres/types/readGenre";

export default function Books() {
    const { data, status, error, isFetching, refetch } = useQuery<PagedList<ReadBook>, Error>({
        queryKey: ['books'],
        queryFn: () => fetchBooks({ pageNumber: 1, pageSize: 10, searchTerm: '', sortBy: '' }),
        staleTime: 30_000,
        gcTime: 5 * 60_000
    });

    const books: ReadBook[] = data?.items ?? [];

    const allGenres: ReadGenre[] = [
        { id: 1, name: "Fiction" },
        { id: 2, name: "Sci-Fi" },
        { id: 3, name: "Action" },
    ];
    const [selectedGenres, setSelectedGenres] = useState<ReadGenre[]>([]);

    function onAddToCart(book: any) {

    }

    function toggleGenre(genre: ReadGenre) {
        console.log(genre);
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
                    <ul className="mt-3 space-y-2">
                        {allGenres.map((genre: ReadGenre) => (
                            <li key={genre.id} className="flex items-center gap-2">
                                <Checkbox
                                    id={`genre-${genre.id}`}
                                    checked={selectedGenres.some((g) => g.id === genre.id)} // was .includes(genre) — object reference comparison never matched
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
                                <Card key={book.id} className="overflow-hidden border-stone-200 py-0 gap-0">
                                    <img
                                        src={book.coverImageUrl || "https://placehold.co/300x440?text=Book"}
                                        alt={book.title}
                                        className="h-56 w-full object-cover"
                                    />
                                    <CardContent className="p-3">
                                        <h3 className="text-sm font-medium text-stone-900 line-clamp-2">
                                            {book.title}
                                        </h3>
                                        <p className="text-xs text-stone-500 mt-0.5">
                                            {book.authors.map((a) => a.name).join(", ")}
                                        </p>
                                        <div className="mt-2 flex flex-wrap gap-1">
                                            {book.genres.map((g: ReadGenre) => (
                                                <Badge
                                                    key={g.id}
                                                    variant="secondary"
                                                    className="text-[10px] bg-stone-100 text-stone-600"
                                                >
                                                    {g.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex items-center justify-between p-3 pt-0">
                                        <span className="text-sm font-medium text-stone-900">
                                            ₹{book.price}
                                        </span>
                                        <Button
                                            size="sm"
                                            className="bg-[#8A2E2E] hover:bg-[#732626]"
                                            onClick={() => onAddToCart?.(book)}
                                        >
                                            Add
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}