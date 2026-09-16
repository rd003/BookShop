export function InfoRow({
    label,
    value,
    emphasize,
}: {
    label: string;
    value: React.ReactNode;
    emphasize?: boolean;
}) {
    return (
        <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className={emphasize ? "font-semibold text-foreground" : "font-medium"}>
                {value}
            </span>
        </div>
    );
}