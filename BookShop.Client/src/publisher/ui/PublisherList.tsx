import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PencilIcon, Trash } from "lucide-react";
import type { ReadPublisher } from "../types/readPublisher";
import { cn } from "cn";
import { getDirection, type SortItem } from "@/lib/sort";
import SortableHead from "@/components/SortableHead";

interface Props{
    publishers: ReadPublisher[],
    onEdit: (publisher:ReadPublisher)=>void
    onDelete: (id:number)=>void,
    className?: string,
    onSortToggle: (column: string, multi?: boolean) => void;
    sort: SortItem[];
}
export default function PublisherList({
    publishers,
    onEdit,
    onDelete,
    className,
    onSortToggle,
    sort
}:Props) {
  return (
    <Table className={cn("",className)}>
        <TableHeader className="bg-muted/50">
            <TableRow>
                <SortableHead
                  label="Name"
                  direction={getDirection(sort, "name")}
                  onToggle={multi => onSortToggle("name", multi)}
                />
                <TableHead>Actions</TableHead>
            </TableRow>
        </TableHeader>

        <TableBody>
            {publishers.map(p=>(
            <TableRow key={p.id} className="bg-muted/40">
                <TableCell>{p.name}</TableCell>
                <TableCell>
                        <div className="flex gap-1">
                            <Button variant="ghost" size="icon" aria-label="Edit publisher" onClick={() => onEdit(p)}>
                                <PencilIcon className="size-4" />
                            </Button>
                            <Button variant="ghost" size="icon" aria-label="Delete publisher"
                                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                onClick={() => onDelete(p.id)}>
                                <Trash className="size-4" />
                            </Button>
                        </div>
                </TableCell>
            </TableRow>))}
        </TableBody>
    </Table>
  )
}
