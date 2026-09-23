import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import type { UpdateGenre } from "../types/updateGenre";

interface Props {
    selectedGenre: UpdateGenre | null,
    onSubmit: (genre: UpdateGenre) => void,
    submitting: boolean;
    resetSignal: number;
}

export default function GenreForm({
    selectedGenre = null,
    onSubmit,
    submitting = false,
    resetSignal
}: Props) {
    const [name, setName] = useState<string>('');
    const [validationError, setValidationError] = useState<string | null>();
    const [id, setId] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (selectedGenre) {
            setId(selectedGenre.id);
            setName(selectedGenre.name);
        }
    }, [selectedGenre])

    useEffect(() => {
        handleReset();
    }, [resetSignal])

    function handleReset() {
        setName('');
        setId(undefined);
    }

    function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        if (!isNameValid(name)) return;
        onSubmit({ id, name } as UpdateGenre)
    }

    function isNameValid(val: string): boolean {
        if (val === null || val.trim().length == 0) {
            setValidationError("Name can not be empty");
            return false;
        }
        if (val !== null && val.length >= 100) {
            setValidationError("Name can not exceed 100 characters");
            return false;
        }
        return true;
    }

    return (
        <form className="flex gap-1" onSubmit={(e) => handleSubmit(e)}>
            <input type="hidden" value={id} />
            <div className="flex gap-1">
                <label htmlFor="name">Name</label>
                <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                {validationError && <p className="text-red-500">{validationError}</p>}
            </div>
            <Button type="reset" variant="outline" onClick={handleReset}>Reset</Button>
            <Button type="submit" variant="default" disabled={submitting}>Save</Button>
        </form>
    )
}