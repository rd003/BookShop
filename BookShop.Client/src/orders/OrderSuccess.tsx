import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    CheckCircle2,
    Copy,
    Check,
    ShoppingBag,
    MapPin,
    Banknote,
    Calendar,
    ArrowRight,
    AlertCircle,
    Package,
} from "lucide-react";

import { formatCurrency, formatDateTime } from "@/lib/format";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import useOrder from "./hooks/useOrder";
import type { ReadOrderItem } from "./types/readOrderItem";
import type { ReadAddress } from "@/addresses/types/readAddress";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import type { OrderStatus } from "@/shared/constants/orderStatus";

export default function OrderSuccess() {
    const { orderNumber } = useParams<{ orderNumber: string }>();
    const navigate = useNavigate();
    const { data: order, isLoading, isError } = useOrder(orderNumber);

    useEffect(() => {
        if (!orderNumber) navigate("/", { replace: true });
    }, [orderNumber, navigate]);

    if (isLoading) return <OrderSuccessSkeleton />;
    if (isError || !order) return <NotFoundState orderNumber={orderNumber} />;

    return (
        <div className="container mx-auto max-w-4xl px-4 py-10 md:py-16">
            <SuccessHeader orderNumber={order.orderNumber} status={order.orderStatus} />

            <div className="mt-10 space-y-6">
                {/* Meta bar */}
                <div className="grid gap-4 rounded-xl border bg-card p-5 sm:grid-cols-3">
                    <MetaItem
                        icon={Calendar}
                        label="Order placed"
                        value={formatDateTime(order.orderDate)}
                    />
                    {/* <MetaItem
                        icon={Package}
                        label="Estimated delivery"
                        value={
                            order.estimatedDelivery
                                ? formatDateTime(order.estimatedDelivery)
                                : "Calculating…"
                        }
                    /> */}
                    <MetaItem
                        icon={Banknote}
                        label="Payment"
                        value="Cash on Delivery"
                    />
                </div>

                {/* Delivery + Payment */}
                <div className="grid gap-6 md:grid-cols-2">
                    <ShippingCard address={order.shippingAddress} />
                    <PaymentCard total={order.orderTotal} />
                </div>

                {/* Items */}
                <ItemsCard items={order.orderItems} />

                {/* Summary */}
                {/* <SummaryCard
                    subtotal={order.subtotal}
                    shipping={order.shipping}
                    tax={order.tax}
                    total={order.total}
                /> */}

                {/* Actions */}
                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                    <Button nativeButton={false} render={<Link to="/catalog" />} variant="outline" size="lg">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Continue Shopping

                    </Button>
                    <Button nativeButton={false} render={<Link to={`/orders/${order.orderNumber}`} />} size="lg">
                        View Order Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}


function SuccessHeader({
    orderNumber,
    status,
}: {
    orderNumber: string;
    status: string;
}) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        await navigator.clipboard.writeText(orderNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/60">
                <CheckCircle2 className="h-9 w-9 text-green-600 dark:text-green-500" strokeWidth={2.2} />
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                Thank you for your order
            </h1>
            <p className="mt-2 text-sm text-muted-foreground md:text-base">
                Your order has been placed successfully. We'll send you an email confirmation shortly.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-4 py-1.5">
                    <span className="text-xs text-muted-foreground">Order</span>
                    <span className="font-mono text-sm font-semibold">#{orderNumber}</span>
                    <button
                        onClick={copy}
                        aria-label="Copy order number"
                        className="ml-1 rounded-md p-1 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                    >
                        {copied ? (
                            <Check className="h-3.5 w-3.5 text-green-600" />
                        ) : (
                            <Copy className="h-3.5 w-3.5" />
                        )}
                    </button>
                </div>
                <OrderStatusBadge status={status as OrderStatus} />
            </div>
        </div>
    );
}

function MetaItem({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
                <p className="truncate text-sm font-medium">{value}</p>
            </div>
        </div>
    );
}

function ShippingCard({ address }: { address: ReadAddress }) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    Shipping Address
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
                <p className="font-medium">{address.fullName}</p>
                <p className="text-muted-foreground">{address.phone}</p>
                <p className="pt-2 leading-relaxed text-muted-foreground">
                    {address.line1}
                    {address.line2 && `, ${address.line2}`}
                    <br />
                    {address.city}, {address.state} {address.postalCode}
                    <br />
                    {address.country}
                </p>
            </CardContent>
        </Card>
    );
}

function PaymentCard({ total }: { total: number }) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <Banknote className="h-4 w-4 text-muted-foreground" />
                    Payment Method
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                    <span className="font-medium">Cash on Delivery</span>
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">
                        COD
                    </span>
                </div>
                <p className="text-muted-foreground">
                    Please have{" "}
                    <strong className="text-foreground">{formatCurrency(total)}</strong> ready
                    when your order arrives.
                </p>
            </CardContent>
        </Card>
    );
}

function ItemsCard({ items }: { items: ReadOrderItem[] }) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    Items ({items.length})
                </CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
                {items.map((item) => (
                    <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                        <img
                            src={item.coverImageUrl || "https://placehold.co/300x440?text=Book"}
                            alt={item.bookTitle}
                            className="h-16 w-16 shrink-0 rounded-lg border object-cover"
                        />
                        <div className="flex min-w-0 flex-1 items-start justify-between gap-4">
                            <div className="min-w-0">
                                <p className="truncate font-medium">{item.bookTitle}</p>
                                <p className="mt-0.5 text-sm text-muted-foreground">
                                    Qty {item.quantity} · {formatCurrency(item.unitPrice)} each
                                </p>
                            </div>
                            <span className="shrink-0 font-medium">
                                {formatCurrency(item.itemTotalPrice)}
                            </span>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

// function SummaryCard({
//     subtotal,
//     shipping,
//     tax,
//     total,
// }: {
//     subtotal: number;
//     shipping: number;
//     tax: number;
//     total: number;
// }) {
//     return (
//         <Card>
//             <CardContent className="space-y-3 pt-6">
//                 <InfoRow label="Subtotal" value={formatCurrency(subtotal)} />
//                 <InfoRow
//                     label="Shipping"
//                     value={shipping === 0 ? "Free" : formatCurrency(shipping)}
//                 />
//                 <InfoRow label="Tax" value={formatCurrency(tax)} />
//                 <Separator />
//                 <div className="flex items-center justify-between text-base font-semibold">
//                     <span>Total</span>
//                     <span>{formatCurrency(total)}</span>
//                 </div>
//             </CardContent>
//         </Card>
//     );
// }

/* ---------- Loading / Error states ---------- */

function OrderSuccessSkeleton() {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-10 md:py-16">
            <div className="flex flex-col items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <Skeleton className="h-8 w-72" />
                <Skeleton className="h-4 w-96 max-w-full" />
                <Skeleton className="h-9 w-56 rounded-full" />
            </div>
            <Skeleton className="mt-10 h-24 w-full rounded-xl" />
            <div className="mt-6 grid gap-6 md:grid-cols-2">
                <Skeleton className="h-48 rounded-xl" />
                <Skeleton className="h-48 rounded-xl" />
            </div>
            <Skeleton className="mt-6 h-56 rounded-xl" />
            <Skeleton className="mt-6 h-40 rounded-xl" />
        </div>
    );
}

function NotFoundState({ orderNumber }: { orderNumber?: string }) {
    return (
        <div className="container mx-auto max-w-2xl px-4 py-16">
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Order not found</AlertTitle>
                <AlertDescription className="mt-2 space-y-4">
                    <p>
                        We couldn't find order{" "}
                        <strong className="font-mono">#{orderNumber}</strong>. Please check
                        your confirmation email or contact support.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <Button nativeButton={false} render={<Link to="/catalog" />} size="sm">
                            Continue Shopping
                        </Button>
                        <Button nativeButton={false} render={<Link to="/orders" />} variant="outline" size="sm">
                            My Orders
                        </Button>
                    </div>
                </AlertDescription>
            </Alert>
        </div>
    );
}