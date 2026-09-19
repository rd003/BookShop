import type { PaymentStatus } from "@/shared/constants/paymentStatus"
import { Badge } from "./ui/badge";
import { cn } from "cn";
const config: Record<PaymentStatus, { label: string, className: string }> = {
    Pending: { label: "Pending", className: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" },
    Paid: { label: "Paid", className: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300" },
    Failed: { label: "Failed", className: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300" }
}

export default function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
    const { label, className } = config[status];

    return (<Badge variant="outline" className={cn("border-0 font-medium", className)}>{label}</Badge>)
}