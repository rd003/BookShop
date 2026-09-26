import { useState } from "react";
import AuthorFilter from "./ui/AuthorFilter";
import { useSearchParams } from "react-router-dom";
import type { ReadAuthor } from "./types/readAuthor";
import AuthorList from "./ui/AuthorList";
import { parseSort, serializeSort, toggleSort } from "@/lib/sort";
import { toast } from "@/components/ui/toast";
import AuthorForm from "./ui/AuthorForm";
import type { UpdateAuthor } from "./types/updateAuthor";
import AuthorDialog from "./ui/AuthorDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const DEFAULT_SORT = "name";

export default function AuthorPage() {
    const [resetFilterSignal, setResetFilterSignal] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();
    const [editing, setEditing] = useState<ReadAuthor | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const submitting = false; //Todo: remove this hardcode
    const isLoading = false; //Todo: remove this hardcode

    function handleSubmit(author: UpdateAuthor) {
        console.log(author);
    }

    // Todo: remove this hardcode
    const authors: ReadAuthor[] = [
        { id: 1, name: 'Satyendra', bio: 'tagda author' },
        { id: 2, name: 'naveen', bio: 'bahut saari kitab likhi hai isne.....12345678901234567890   1234567890 213123 234234234' },
        { id: 3, name: 'John doe', bio: null },
    ];

    // const sortItems = parseSort(queryParams.sortBy);  
    const sortItems = parseSort(DEFAULT_SORT);  // TODO: remove hardcoded

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

    function handleAddAuthor() {
        setEditing(null);
        setDialogOpen(true);
    }

    function handleEdit(author: ReadAuthor) {
        setEditing(author);
        setDialogOpen(true);
    }

    function handleDelete(id: number) {
        console.log(id);
    }

    function handleSortToggle(column: string, multi = false) {
        updateParams((p) => {
            p.set("sortBy", serializeSort(toggleSort(sortItems, column, multi)));
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

    function toastSuccess(description: string) {
        toast.add({
            type: "success",
            description
        })
    }

    function toastError(description: string) {
        toast.add({
            type: 'error',
            description
        })
    }

    return (<>
        <h1 className="text-2xl my-2">Manage Authors</h1>

        <div className="mb-1.5">
            <Button variant="outline" onClick={handleAddAuthor}>Add <Plus /> </Button>
        </div>

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
            sort={sortItems}
            onSortToggle={handleSortToggle}
        />

        <AuthorDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            title={editing ? "Edit address" : "Add new address"}
            submitting={submitting}
            submitLabel={editing ? "Save" : "Add"}
            defaultValues={editing as UpdateAuthor | null}
            onSubmit={handleSubmit}
            isLoading={isLoading}
        />
    </>)
}