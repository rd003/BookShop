import type { SortDirection } from "@/shared/types/SortDirection";

export interface SortItem {
    column: string;
    direction: SortDirection;
}

// "orderDate desc,amount" -> [{orderDate, desc}, {amount, asc}]
export function parseSort(sortBy: string | null | undefined): SortItem[] {
    if (!sortBy) return [];
    return sortBy
        .split(",")
        .map(p => p.trim())
        .filter(Boolean)
        .map((p): SortItem => {
            const [column, dir] = p.split(/\s+/);
            return { column, direction: dir?.toLowerCase() === "desc" ? "desc" : "asc" };
        });
}

// Inverse of parseSort. Ascending has no suffix, as in your API contract.
export function serializeSort(items: SortItem[]): string {
    return items.map(i => (i.direction === "desc" ? `${i.column} desc` : i.column)).join(",");
}

// Current direction for one column; null if the column is not sorted.
export function getDirection(items: SortItem[], column: string): SortDirection | null {
    return items.find(i => i.column === column)?.direction ?? null;
}

// multi = false: sort by this column only (asc <-> desc).
// multi = true: add the column, or flip it in place, keeping the other sorts.
export function toggleSort(items: SortItem[], column: string, multi = false): SortItem[] {
    const current = getDirection(items, column);
    const next: SortDirection = current === "asc" ? "desc" : "asc";
    if (!multi) return [{ column, direction: next }];
    if (current === null) return [...items, { column, direction: "asc" }];
    return items.map(i => (i.column === column ? { ...i, direction: next } : i));
}