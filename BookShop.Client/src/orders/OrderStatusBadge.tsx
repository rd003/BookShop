// src/features/orders/components/OrderStatusBadge.tsx
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/shared/constants/orderStatus";

const config: Record<OrderStatus, { label: string; className: string }> = {
    Pending: { label: "Pending", className: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-orange-300" },
    Confirmed: { label: "Confirmed", className: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" },
    Processing: { label: "Processing", className: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" },
    Shipped: { label: "Shipped", className: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300" },
    Delivered: { label: "Delivered", className: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300" },
    Cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300" },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
    const { label, className } = config[status];
    return (
        <Badge variant="secondary" className={cn("border-0 font-medium", className)}>
            {label}
        </Badge>
    );
}