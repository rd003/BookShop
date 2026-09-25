import { useState } from "react";
import AuthorFilter from "./ui/AuthorFilter";
import { useSearchParams } from "react-router-dom";
import type { ReadAuthor } from "./types/readAuthor";
import AuthorList from "./ui/AuthorList";

export default function AuthorPage() {
    const [resetFilterSignal, setResetFilterSignal] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();

    const authors: ReadAuthor[] = [
        { id: 1, name: 'Satyendra', bio: 'tagda author' },
        { id: 2, name: 'naveen', bio: 'bahut saari kitab likhi hai isne.....12345678901234567890   1234567890 213123 234234234' },
        { id: 3, name: 'John doe', bio: null },
    ];

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

    function handleEdit(author: ReadAuthor) {
        console.log(author);
    }

    function handleDelete(id: number) {
        console.log(id);
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

        <AuthorList
            className="mt-2"
            authors={authors}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
    </>)
}