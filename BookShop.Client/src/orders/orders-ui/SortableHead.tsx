import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { TableHead } from "@/components/ui/table";
import type { SortDirection } from "@/shared/types/SortDirection";

interface Props {
    label: string;
    direction: SortDirection | null;      // null = this column is not sorted
    onToggle: (multi: boolean) => void;   // multi = Shift held
}

export default function SortableHead({ label, direction, onToggle }: Props) {
    const Icon = direction === "asc" ? ArrowUp : direction === "desc" ? ArrowDown : ArrowUpDown;
    return (
        <TableHead
            aria-sort={direction === "asc" ? "ascending" : direction === "desc" ? "descending" : "none"}
        >
            <button type="button" onClick={e => onToggle(e.shiftKey)} className="flex items-center gap-1 hover:underline">
                {label}
                <Icon className="h-4 w-4" />
            </button>
        </TableHead>
    );
}