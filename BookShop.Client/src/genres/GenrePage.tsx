import { useState } from "react";
import type { UpdateGenre } from "./types/updateGenre";
import GenreForm from "./ui/GenreForm";

export default function GenrePage() {
    const [selectedGenre, setSelectedGenre] = useState<UpdateGenre | null>(null);
    const [resetSignal, setResetSignal] = useState<number>(0);

    const submitting: boolean = false;

    function handleSubmit(genre: UpdateGenre) {
        console.log(genre);
        setResetSignal(prev => prev + 1);
        setSelectedGenre(null);
    }

    function handleFormEdit(genre: UpdateGenre) {
        setSelectedGenre(genre);
    }

    return (<div>
        <h1 className="text-xl">Genre</h1>

        <GenreForm
            selectedGenre={selectedGenre}
            onSubmit={handleSubmit}
            submitting={submitting}
            resetSignal={resetSignal}
        />
    </div>)
}