import { useState } from "react";
import AuthorFilter from "./ui/AuthorFilter";

export default function AuthorPage() {
    const [resetFilterSignal, setResetFilterSignal] = useState(0);

    function handleSearch(searchTerm: string): void {
        console.log(searchTerm);
    }

    function handleFilterClear(): void {
        throw new Error("Function not implemented.");
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