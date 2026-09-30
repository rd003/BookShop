import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { ReadBook } from "./types/readBook";
import type { PagedList } from "@/shared/types/pagedList";

export default function ManageBookPage() {
    const data:PagedList<ReadBook> = {
        items: [],
        hasNext:false,
        hasPrevious:false,
        pageNumber:1,
        totalCount:0,
        pageSize:1,
        totalPages:0
    };
    return (<>

    <div className="flex items-end justify-between">
        <div>
            <h1 className="text-3xl font-semibold tracking-tight">Publishers</h1>
            <p className="text-sm text-muted-foreground">Manage the publishers available in your catalog.</p>
        </div>
        {data?.totalCount !== undefined && (
            <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium">
                {data.totalCount} total
            </span>
        )}
    </div>

    <Button variant="default" className="mt-2"><Plus className="size-4"/> Add</Button>

    </>)
}