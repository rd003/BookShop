import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import type { UpdateGenre } from "../types/updateGenre";
import { cn } from "cn";

interface Props {
    selectedGenre: UpdateGenre | null,
    onSubmit: (genre: UpdateGenre) => void,
    submitting: boolean;
    resetSignal: number;
    className?: string
}

export default function GenreForm({
    selectedGenre = null,
    onSubmit,
    submitting = false,
    resetSignal,
    className
}: Props) {
    const [name, setName] = useState<string>('');
    const [validationError, setValidationError] = useState<string | null>();
    const [id, setId] = useState<number>(0);

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
        setId(0);
        setValidationError(null);
    }

    function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        if (!isNameValid(name)) return;
        onSubmit({ id, name } as UpdateGenre)
        setValidationError(null);
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
        <form className={cn("flex gap-1", className)} onSubmit={(e) => handleSubmit(e)}>
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