import { Button } from "@/components/ui/button";
import { Input } from "@base-ui/react";
import { cn } from "cn";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Props {
    resetSignal: number;
    onSearch: (searchTerm: string) => void;
    onClear: () => void;
    className?: string;
}
export default function AuthorFilter({
    resetSignal,
    onSearch,
    onClear,
    className
}: Props) {
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setSearchTerm('');
    }, [resetSignal])

    function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        onSearch(searchTerm);
    }

    function handleClear() {
        setSearchTerm('');
        onClear();
    }

    return (<form onSubmit={handleSubmit} className={cn("flex gap-2", className)}>
        <Input placeholder="search author" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

        <Button variant="default" type="submit"><Search /> Search</Button>
        <Button variant="outline" type="button" onClick={handleClear}>Clear</Button>
    </form>)
}