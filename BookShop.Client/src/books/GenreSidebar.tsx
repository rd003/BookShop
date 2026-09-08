import type { ReadGenre } from "@/genres/types/readGenre";
import GenresFilter from "./GenresFilter";
import { X } from "lucide-react";

type GenreSidebarProps = {
    allGenres: ReadGenre[],
    selectedGenres: ReadGenre[],
    onClearFilters: () => void,
    genreStatus: "pending" | "error" | "success",
    genreError: Error | null,
    onToggleGenre: (genre: ReadGenre) => void
}

export default function GenreSidebar({ allGenres, selectedGenres, genreStatus, onToggleGenre, genreError, onClearFilters }: GenreSidebarProps) {
    return <aside>
        <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-stone-900">Genres</h2>
            {selectedGenres.length > 0 && (
                <button
                    onClick={onClearFilters}
                    className="text-xs text-stone-400 hover:text-stone-700 flex items-center gap-1"
                >
                    <X className="h-3 w-3" /> Clear
                </button>
            )}
        </div>

        {/* genres */}
        {genreStatus === 'pending' && <p className="text-xs text-stone-400">Loading genres...</p>}

        {genreStatus === 'error' && <p className="text-xs text-red-500">{genreError?.message}</p>}

        <GenresFilter allGenres={allGenres} selectedGenres={selectedGenres} toggleGenre={onToggleGenre} />

    </aside>
}