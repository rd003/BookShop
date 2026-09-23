import { cn } from "cn";
import type { ReadGenre } from "../types/readGenre";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface Props {
    genres: ReadGenre[];
    onEdit: (genre: ReadGenre) => void;
    onDelete: (genreId: number) => void;
    className?: string;
}

export default function GenreList({
    genres,
    onEdit,
    onDelete,
    className
}: Props) {
    return (
        <Table className={cn("w-100", className)}>
            <TableHeader>
                <TableRow>
                    <TableHead>Genre</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {genres.map(g =>
                    <TableRow key={g.id}>
                        <TableCell>{g.name}</TableCell>
                        <TableCell className="flex gap-1">
                            <Button variant="default" onClick={() => onEdit(g)}><Pencil /></Button>
                            <Button variant="destructive" onClick={() => onDelete(g.id)}><Trash2 /></Button>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}