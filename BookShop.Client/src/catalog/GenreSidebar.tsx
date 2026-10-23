import type { ReadGenre } from "@/genres/types/readGenre";
import GenresFilter from "./GenresFilter";
import { X } from "lucide-react";
import type { QueryLike } from "@/components/QueryState";
import QueryState from "@/components/QueryState";

type GenreSidebarProps = {
    allGenres: ReadGenre[],
    selectedGenres: ReadGenre[],
    onClearFilters: () => void,
   genreQuery: QueryLike<{ items: ReadGenre[] }>,
    onToggleGenre: (genre: ReadGenre) => void
}

export default function GenreSidebar({ allGenres, selectedGenres, genreQuery, onToggleGenre,  onClearFilters }: GenreSidebarProps) {
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


        <QueryState
            query={genreQuery}
            isEmpty={d => d.items.length === 0}
            skeleton={<p className="text-xs text-stone-400">Loading genres...</p>} // or a compact skeleton
            empty={<p className="text-xs text-stone-400">No genres found.</p>}>
            {() => <GenresFilter allGenres={allGenres} selectedGenres={selectedGenres} toggleGenre={onToggleGenre} />}
        </QueryState>

    </aside>
}