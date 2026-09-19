import type { PaymentMethod } from "@/shared/constants/paymentMethod";
import { Badge } from "./ui/badge";
import { cn } from "cn";

const config: Record<PaymentMethod, { label: string, className: string }> = {
    CashOnDelivery: { label: "Cash on Delivery", className: "bg-stone-100 text-stone-700 dark:bg-stone-900 dark:text-stone-300" }
}

export default function PaymentMethodBadge({ paymentMethod }: { paymentMethod: PaymentMethod }) {
    const { label, className } = config[paymentMethod];
    return (<Badge variant="outline" className={cn("border-0 font-medium", className)}>{label}</Badge>)
}