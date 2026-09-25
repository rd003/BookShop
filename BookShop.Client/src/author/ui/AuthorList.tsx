import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2Icon } from "lucide-react";
import type { ReadAuthor } from "../types/readAuthor";
import { cn } from "cn";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Props {
    authors: ReadAuthor[],
    onEdit: (author: ReadAuthor) => void,
    onDelete: (authorId: number) => void,
    className?: string
}
export default function AuthorList({
    authors,
    onEdit,
    onDelete,
    className
}: Props) {
    return (<Table className={cn("", className)}>
        <TableHeader>
            <TableRow>
                <TableHead>Author</TableHead>
                <TableHead>Bio</TableHead>
                <TableHead>Actions</TableHead>

            </TableRow>
        </TableHeader>
        <TableBody>
            {authors.map(a => (<TableRow key={a.id}>
                <TableCell>{a.name}</TableCell>
                <TableCell>
                    {a.bio ? (
                        <Popover>
                            <PopoverTrigger render={<button className="text-left hover:underline" />}>
                                {a.bio.length > 60 ? `${a.bio.slice(0, 60)}...` : a.bio}
                            </PopoverTrigger>
                            <PopoverContent className="w-80 text-sm">
                                {a.bio}
                            </PopoverContent>
                        </Popover>
                    ) : "—"}
                </TableCell>

                <TableCell>
                    <Button variant="default" onClick={() => onEdit(a)}><Pencil /></Button>
                    <Button variant="destructive" onClick={() => onDelete(a.id)}><Trash2Icon /></Button>
                </TableCell>
            </TableRow>))}
        </TableBody>
    </Table>)
}