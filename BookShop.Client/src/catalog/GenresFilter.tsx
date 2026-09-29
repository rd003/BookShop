import type { ReadGenre } from "@/genres/types/readGenre";
import { Checkbox } from "@/components/ui/checkbox";

interface GenreFilterProp {
    allGenres: ReadGenre[],
    selectedGenres: ReadGenre[],
    toggleGenre: (genre: ReadGenre) => void
};

export default function GenresFilter({ allGenres, selectedGenres, toggleGenre }: GenreFilterProp) {
    return (
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
    );
}