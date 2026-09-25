import { useState } from "react";
import AuthorFilter from "./ui/AuthorFilter";
import { useSearchParams } from "react-router-dom";

export default function AuthorPage() {
    const [resetFilterSignal, setResetFilterSignal] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();

    function handleSearch(searchTerm: string): void {
        if (!searchTerm || searchTerm.trim().length === 0) {
            return;
        }
        updateParams((p) => {
            p.set("searchTerm", searchTerm);
            p.set("pageNumber", "1");
        })
    }

    function handleFilterClear(): void {
        updateParams((p) => {
            p.delete("searchTerm");
            p.set("pageNumber", "1");
        })
    }

    function updateParams(mutate: (params: URLSearchParams) => void, options?: {
        replace?: boolean
    }) {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            mutate(next);
            return next;
        }, options)
    }

    return (<>
        <h1 className="text-2xl">Manage Authors</h1>

        <AuthorFilter
            className="mt-2"
            onClear={handleFilterClear}
            onSearch={handleSearch}
            resetSignal={resetFilterSignal}
        />
    </>)
}