import { useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { X } from "lucide-react";

const MOCK_BOOKS: any[] = [
    { id: 1, title: "The Midnight Library", authors: ["Matt Haig"], genres: ["Fiction", "Fantasy"], price: 399, cover: "https://placehold.co/300x440?text=Book" },
    { id: 2, title: "Sapiens", authors: ["Yuval Noah Harari"], genres: ["Non-Fiction", "History"], price: 549, cover: "https://placehold.co/300x440?text=Book" },
    { id: 3, title: "Project Hail Mary", authors: ["Andy Weir"], genres: ["Sci-Fi", "Fiction"], price: 449, cover: "https://placehold.co/300x440?text=Book" },
    { id: 4, title: "Good Omens", authors: ["Terry Pratchett", "Neil Gaiman"], genres: ["Fantasy", "Comedy"], price: 375, cover: "https://placehold.co/300x440?text=Book" },
    { id: 5, title: "Atomic Habits", authors: ["James Clear"], genres: ["Non-Fiction", "Self-Help"], price: 425, cover: "https://placehold.co/300x440?text=Book" },
    { id: 6, title: "Dune", authors: ["Frank Herbert"], genres: ["Sci-Fi"], price: 499, cover: "https://placehold.co/300x440?text=Book" },
];


function getAllGenres(books: any) {
    return [...new Set(books.flatMap((b: any) => b.genres))].sort();
}

export default function Books() {
    const books: any[] = MOCK_BOOKS;
    const allGenres: any = useMemo(() => getAllGenres(books), [books]);
    const [selectedGenres, setSelectedGenres] = useState<any[]>([]);

    function onAddToCart(book: any) {

    }

    function toggleGenre(genre: any) {
        setSelectedGenres((prev: any) =>
            prev.includes(genre) ? prev.filter((g: any) => g !== genre) : [...prev, genre]
        );
    }

    function clearFilters() {
        setSelectedGenres([]);
    }

    // A book matches if it has ANY of the selected genres (OR filter).
    // Swap .some for .every if you want books matching ALL selected genres instead.
    const filteredBooks = useMemo(() => {
        if (selectedGenres.length === 0) return books;
        return books.filter((book) =>
            book.genres.some((g: any) => selectedGenres.includes(g))
        );
    }, [books, selectedGenres]);

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
                        {allGenres.map((genre: any) => (
                            <li key={genre} className="flex items-center gap-2">
                                <Checkbox
                                    id={`genre-${genre}`}
                                    checked={selectedGenres.includes(genre)}
                                    onCheckedChange={() => toggleGenre(genre)}
                                />
                                <label
                                    htmlFor={`genre-${genre}`}
                                    className="text-sm text-stone-600 cursor-pointer select-none"
                                >
                                    {genre}
                                </label>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* Book grid */}
                <section>
                    <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm text-stone-500">
                            {filteredBooks.length} {filteredBooks.length === 1 ? "book" : "books"}
                        </p>
                    </div>

                    {filteredBooks.length === 0 ? (
                        <p className="text-sm text-stone-500 py-12 text-center">
                            No books match the selected genres.
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                            {filteredBooks.map((book: any) => (
                                <Card key={book.id} className="overflow-hidden border-stone-200 py-0 gap-0">
                                    <img
                                        src={book.cover}
                                        alt={book.title}
                                        className="h-56 w-full object-cover"
                                    />
                                    <CardContent className="p-3">
                                        <h3 className="text-sm font-medium text-stone-900 line-clamp-2">
                                            {book.title}
                                        </h3>
                                        <p className="text-xs text-stone-500 mt-0.5">
                                            {book.authors.join(", ")}
                                        </p>
                                        <div className="mt-2 flex flex-wrap gap-1">
                                            {book.genres.map((g: any) => (
                                                <Badge
                                                    key={g}
                                                    variant="secondary"
                                                    className="text-[10px] bg-stone-100 text-stone-600"
                                                >
                                                    {g}
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