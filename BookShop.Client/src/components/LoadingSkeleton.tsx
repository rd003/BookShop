type Props = {
    rows: number;
    label: string;
    variant?: "row" | "card";
};

export default function LoadingSkeleton({ rows, label, variant = "row" }: Props) {
    if (variant === "card") {
        return (
            <div role="status" aria-label={label} className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="animate-pulse space-y-3">
                        <div className="aspect-[2/3] rounded-md bg-gray-200" /> {/* cover */}
                        <div className="h-4 w-3/4 rounded bg-gray-200" />      {/* title */}
                        <div className="h-3 w-1/2 rounded bg-gray-200" />      {/* author/price */}
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div role="status" aria-label={label} className="mt-2 space-y-2">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-md bg-gray-200" />
            ))}
        </div>
    );
}