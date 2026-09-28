import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PencilIcon, Trash } from "lucide-react";
import type { ReadPublisher } from "../types/readPublisher";
import { cn } from "cn";

interface Props{
    publishers: ReadPublisher[],
    onEdit: (publisher:ReadPublisher)=>void
    onDelete: (id:number)=>void,
    className?: string
}
export default function PublisherList({
    publishers,
    onEdit,
    onDelete,
    className
}:Props) {
  return (
    <Table className={cn("",className)}>
        <TableHeader>
            <TableRow>
                <TableHead>Name</TableHead>
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
