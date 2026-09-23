import { useState } from "react";
import type { UpdateGenre } from "./types/updateGenre";
import GenreForm from "./ui/GenreForm";
import type { ReadGenre } from "./types/readGenre";
import GenreList from "./ui/GenreList";

export default function GenrePage() {
    const [selectedGenre, setSelectedGenre] = useState<UpdateGenre | null>(null);
    const [resetSignal, setResetSignal] = useState<number>(0);
    const genres: ReadGenre[] = [
        { id: 1, name: "Genre1" },
        { id: 2, name: "Genre2" },
        { id: 3, name: "Genre3" },
        { id: 4, name: "Genre4" }
    ];
    const submitting: boolean = false;

    function handleSubmit(genre: UpdateGenre) {
        console.log(genre);
        setResetSignal(prev => prev + 1);
        setSelectedGenre(null);
    }

    function handleFormEdit(genre: ReadGenre) {
        setSelectedGenre(genre as UpdateGenre);
    }

    function handleDelete(genre: ReadGenre) {
        console.log('delete', genre);
    }

    return (<div>
        <h1 className="text-2xl">Genres</h1>

        <GenreForm
            selectedGenre={selectedGenre}
            onSubmit={handleSubmit}
            submitting={submitting}
            resetSignal={resetSignal}
        />

        <GenreList
            genres={genres}
            onEdit={handleFormEdit}
            onDelete={handleDelete}
            className="mt-4"
        />
    </div>)
}