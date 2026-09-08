import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { ReadBook } from "./types/readBook";
import type { ReadGenre } from "@/genres/types/readGenre";

interface BookListProps {
    book: ReadBook,
    onAddToCart: (bookId: number) => void
}
export default function BookList({ book, onAddToCart }: BookListProps) {
    return (
        <Card className="overflow-hidden border-stone-200 py-0 gap-0">
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
                    onClick={() => onAddToCart?.(book.id)}
                >
                    Add
                </Button>
            </CardFooter>
        </Card>
    );
}