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
        <TableHeader>
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
            <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell className="flex gap-1">
                    <Button variant="default" onClick={()=>onEdit(p)}><PencilIcon/></Button>
                    <Button variant="destructive" onClick={()=>onDelete(p.id)}><Trash/></Button>
                </TableCell>
            </TableRow>))}
        </TableBody>
    </Table>
  )
}
