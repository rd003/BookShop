import { useState } from "react";
import type { UpdateGenre } from "./types/updateGenre";
import GenreForm from "./ui/GenreForm";


export default function GenrePage() {
    const [selectedGenre, setSelectedGenre] = useState<UpdateGenre | null>(null);
    const submitting: boolean = false;

    function handleSubmit(genre: UpdateGenre) {
        console.log(genre);
        setSelectedGenre(null);
    }

    return (<div>
        <h1 className="text-xl">Genre</h1>

        <GenreForm
            selectedGenre={selectedGenre}
            onSubmit={handleSubmit}
            submitting={submitting}
        />
    </div>)
}