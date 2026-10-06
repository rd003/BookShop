import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "cn";
import type { ReadBook } from "../types/readBook";
import { Button } from "@/components/ui/button";
import { getDirection, type SortItem } from "@/lib/sort";
import SortableHead from "@/components/SortableHead";
import { Pencil, Trash } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { Link, useLocation } from "react-router-dom";

interface Props{
  books:ReadBook[];
  onEdit: (publisher:ReadBook)=>void
  onDelete: (id:number)=>void,
  className?: string,
  onSortToggle: (column: string, multi?: boolean) => void;
  sort: SortItem[];
}
export default function BookList({
    books,
    onEdit,
    onDelete,
    className,
    onSortToggle,
    sort
}:Props){
    const location = useLocation();
  return(<Table className={cn("",className)}>
        <TableHeader>
            <TableRow>
                <SortableHead
                    label="Title"
                    direction={getDirection(sort, "title")}
                    onToggle={multi => onSortToggle("title", multi)}
                />
                <TableHead>Isbn</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-end">Actions</TableHead>
            </TableRow>
        </TableHeader>

        <TableBody>
           {books.map(b=><TableRow key={b.id}>
                <TableCell>{b.title}</TableCell>
                <TableCell>{b.isbn}</TableCell>
                <TableCell>
                    <img src={b.coverImageUrl || "https://placehold.co/300x440?text=Book"} alt={b.title} className="h-15 w-full object-cover"/>
                </TableCell>
                <TableCell>{formatCurrency(b.price)}</TableCell>
                <TableCell>{b.stockQuantity}</TableCell>
                <TableCell className="flex justify-end">
                      <Button type="button" onClick={()=>onEdit(b)} variant="ghost" aria-label="Edit book"><Pencil className="s-4"/></Button>

                      <Button type="button" variant="ghost" onClick={()=>onDelete(b.id)}
                       className="text-destructive hover:bg-destructive/10 hover:text-destructive"><Trash className="s-4"/></Button>

                      <Button
                      type="button"
                      nativeButton={false}
                      render={<Link to={`/admin/books/${b.id}`}
                         state={{from:`${location.pathname}/${location.search}`}}
                      />}

                      >
                        Detail
                      </Button>
                </TableCell>
            </TableRow>)}
        </TableBody>
  </Table>)
}