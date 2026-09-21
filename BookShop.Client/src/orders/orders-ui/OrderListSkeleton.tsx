export default function OrderListSkeleton({ rows }: { rows: number }) {
    return (
        <div role="status" aria-label="Loading orders" className="mt-2 space-y-2">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-md bg-gray-200" />
            ))}
        </div>
    );
}
