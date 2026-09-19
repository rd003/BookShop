import SelectBasic from "@/components/SelectBasic"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import type { ISelectItem } from "@/shared/types/ISelectItem"
import { cn } from "cn";

interface PaginatorProps {
    hasNext: boolean;
    hasPrevious: boolean;
    totalPages: number;
    currentPage: number;
    currentPageLimit: number;
    onPageSelect: (page: number) => void;
    onLimitSelect: (limit: number) => void;
    className?: string
}

export default function Paginator({
    hasNext,
    hasPrevious,
    totalPages,
    currentPage,
    currentPageLimit,
    onPageSelect,
    onLimitSelect,
    className = "w-full"
}: PaginatorProps) {
    const pageLimitItems: ISelectItem<number>[] = [
        { label: "3", value: 3 },
        { label: "10", value: 10 },
        { label: "20", value: 20 },
        { label: "100", value: 100 }
    ];

    return (<div className={cn("flex justify-start items-center gap-4", className)}>
        <div className="flex gap-1 items-center" >
            <span>Per page: </span>
            <SelectBasic
                items={pageLimitItems}
                value={currentPageLimit}
                onChange={onLimitSelect}
                placeHolder="Pages"
                className="w-20"
            />
        </div>

        <div>
            <Pagination>
                <PaginationContent>
                    {hasPrevious && <PaginationItem>
                        <PaginationPrevious onClick={() => onPageSelect(currentPage - 1)} />
                    </PaginationItem>}

                    {Array.from({ length: totalPages }, (_, v) => v + 1).map((page) => (<PaginationItem key={page}>
                        <PaginationLink isActive={currentPage === page} onClick={() => onPageSelect(page)} >{page}</PaginationLink>
                    </PaginationItem>))}

                    {/* <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem> */}
                    {
                        hasNext &&
                        <PaginationItem>
                            <PaginationNext onClick={() => onPageSelect(currentPage + 1)} />
                        </PaginationItem>
                    }
                </PaginationContent>
            </Pagination>
        </div>
    </div >
    )
}