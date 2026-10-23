import type { ReactNode } from "react";
import { getUserFacingError } from "@/lib/getUserFacingError";
import ListError from "./ListError";

export type QueryLike<T> = {
    status: "pending" | "error" | "success";
    data: T | undefined;
    error: unknown;
    refetch: () => unknown;
};

type Props<T> = {
    query: QueryLike<T>;
    isEmpty: (data: T) => boolean;
    skeleton: ReactNode;
    empty: ReactNode;
    children: (data: T) => ReactNode;
};

export default function QueryState<T>({ query, isEmpty, skeleton, empty, children }: Props<T>) {
    if (query.status === "pending") return <>{skeleton}</>;
    if (query.status === "error")
        return <ListError message={getUserFacingError(query.error)} onRetry={() => query.refetch()} />;
    const data = query.data as T;
    if (isEmpty(data)) return <>{empty}</>;
    return <>{children(data)}</>;
}