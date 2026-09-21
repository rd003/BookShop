import SelectBasic from "@/components/SelectBasic"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import type { ISelectItem } from "@/shared/types/ISelectItem"
import { cn } from "cn";
import { PAGE_SIZES } from "@/shared/constants/pagination";

interface PaginatorProps {
    hasNext: boolean;
    hasPrevious: boolean;
    totalPages: number;
    currentPage: number;
    pageSizes?: number[];
    currentPageLimit: number;
    onPageSelect: (page: number) => void;
    onLimitSelect: (limit: number) => void;
    className?: string
}
function getPageWindow(current: number, total: number): (number | "ellipsis")[] {
    const pages = new Set([1, total, current - 1, current, current + 1]);
    const sorted = [...pages].filter(p => p >= 1 && p <= total).sort((a, b) => a - b);
    const result: (number | "ellipsis")[] = [];
    sorted.forEach((p, i) => {
        if (i > 0 && p - sorted[i - 1] > 1) result.push("ellipsis");
        result.push(p);
    });
    return result;
}

export default function Paginator({
    hasNext,
    hasPrevious,
    totalPages,
    currentPage,
    currentPageLimit,
    pageSizes = PAGE_SIZES,
    onPageSelect,
    onLimitSelect,
    className = "w-full"
}: PaginatorProps) {
    const pageLimitItems: ISelectItem<number>[] = pageSizes.map(p => ({ label: String(p), value: p }));

    return (<div className={cn("flex justify-end items-center gap-4 p-2", className)}>
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

                    {getPageWindow(currentPage, totalPages).map((page, i) =>
                        page === "ellipsis" ? (
                            <PaginationItem key={`e${i}`}><PaginationEllipsis /></PaginationItem>
                        ) : (
                            <PaginationItem key={page}>
                                <PaginationLink isActive={currentPage === page} onClick={() => onPageSelect(page)}>{page}</PaginationLink>
                            </PaginationItem>
                        )
                    )}

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