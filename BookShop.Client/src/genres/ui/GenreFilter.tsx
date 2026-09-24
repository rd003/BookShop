import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "cn";
import { useEffect, useState } from "react";

interface Props {
    className?: string;
    onSearch: (term: string) => void;
    onClear: () => void;
    resetSignal: number;
}
export default function GenreFilter({
    className,
    onSearch,
    onClear,
    resetSignal
}: Props) {
    const [term, setTerm] = useState<string>('');

    useEffect(() => {
        setTerm('');
    }, [resetSignal])

    function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        if (term.trim()) {
            onSearch(term);
        }
    }

    function handleClear() {
        setTerm('');
        onClear();
    }

    return (
        <form className={cn("w-full flex gap-2 align-middle justify-start", className)} onSubmit={handleSubmit}>
            <Input type="text" className="w-60" value={term} onChange={(e) => setTerm(e.target.value)} placeholder="search by genre" />

            <Button type="submit" variant="default">Search</Button>

            <Button type="button" variant="secondary" onClick={handleClear}>Clear</Button>
        </form>)
}