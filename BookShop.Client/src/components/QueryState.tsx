import type { UseQueryResult } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { getUserFacingError } from "@/lib/getUserFacingError";
import ListError from "./ListError";

type Props<T> = {
    query: UseQueryResult<T>;
    isEmpty: (data: T) => boolean;
    skeleton: ReactNode;
    empty: ReactNode;
    children: (data: T) => ReactNode;
};

export default function QueryState<T>({ query, isEmpty, skeleton, empty, children }: Props<T>) {
    if (query.status === "pending") return <>{skeleton}</>;
    if (query.status === "error")
        return <ListError message={getUserFacingError(query.error)} onRetry={() => query.refetch()} />;
    if (isEmpty(query.data)) return <>{empty}</>;
    return <>{children(query.data)}</>;
}