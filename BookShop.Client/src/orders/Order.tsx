import { Link, useLocation, useParams } from "react-router-dom";
import {
    ArrowLeft, CalendarDays, CreditCard, MapPin, Package,
    Truck, XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import useOrder from "./hooks/useOrder";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { OrderStatus } from "@/shared/constants/orderStatus";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import OrderTimeline from "./OrderTimeLine";


export default function Order() {
    const { orderNumber } = useParams<{ orderNumber: string }>();
    const { data: order, error, status } = useOrder(orderNumber);
    const location = useLocation();
    const from = (location.state as { from?: string } | null)?.from;
    const backUrl = from?.startsWith("/account/orders") ? from : "/account/orders";

    if (status === "pending") return <OrderSkeleton />;

    if (status === "error") {
        return (
            <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-24 text-center">
                <XCircle className="h-12 w-12 text-destructive" />
                <h2 className="text-xl font-semibold">Couldn't load this order</h2>
                <p className="text-muted-foreground">
                    {error instanceof Error ? error.message : "Something went wrong."}
                </p>
                <Button nativeButton={false} variant="outline" render={<Link to={backUrl} />}>
                    Back to orders
                </Button>
            </div >
        );
    }

    if (!order) return null;

    const subtotal = order.orderItems.reduce((s, i) => s + i.itemTotalPrice, 0);

    return (
        <div className="mx-auto max-w-4xl space-y-6 p-6">
            {/* header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                    <Button variant="ghost" size="sm" nativeButton={false} className="-ml-2 mb-1" render={<Link to={backUrl} />}>
                        <ArrowLeft className="mr-1 h-4 w-4" /> Back to orders
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Order #{order.orderNumber}
                    </h1>
                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <CalendarDays className="h-4 w-4" />
                        Placed on {formatDateTime(order.orderDate)}
                    </p>
                </div>
                <OrderStatusBadge status={order.orderStatus} />
            </div>

            {/* timeline */}
            <Card>
                <CardContent className="pt-6">
                    <OrderTimeline status={order.orderStatus} />
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-3">
                {/* items */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Package className="h-5 w-5" />
                            Items ({order.orderItems.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {order.orderItems.map((item) => (
                            <div key={item.id} className="flex gap-4">
                                <img
                                    src={item.coverImageUrl || "https://placehold.co/300x440?text=Book"}
                                    alt={item.bookTitle}
                                    className="h-24 w-16 rounded-md border object-cover"
                                />
                                <div className="min-w-0 flex-1 space-y-1">
                                    <p className="truncate font-medium">{item.bookTitle}</p>
                                    <p className="truncate text-sm text-muted-foreground">
                                        by {item.authors.join(", ")}
                                    </p>
                                    <div className="flex flex-wrap gap-1 pt-0.5">
                                        {item.genres.map((g) => (
                                            <Badge key={g} variant="outline" className="text-xs">
                                                {g}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className="text-right text-sm">
                                    <p className="font-medium">{formatCurrency(item.itemTotalPrice)}</p>
                                    <p className="text-muted-foreground">
                                        {item.quantity} × {formatCurrency(item.unitPrice)}
                                    </p>
                                </div>
                            </div>
                        ))}
                        <Separator />
                        <div className="space-y-1.5 text-sm">
                            <div className="flex justify-between text-muted-foreground">
                                <span>Subtotal</span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Shipping</span>
                                <span>
                                    {order.orderTotal - subtotal > 0
                                        ? formatCurrency(order.orderTotal - subtotal)
                                        : "Free"}
                                </span>
                            </div>
                            <div className="flex justify-between pt-1 text-base font-semibold">
                                <span>Total</span>
                                <span>{formatCurrency(order.orderTotal)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* sidebar: address + payment */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <MapPin className="h-5 w-5" /> Shipping address
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm leading-6">
                            <p className="font-medium">{order.shippingAddress.fullName}</p>
                            <p className="text-muted-foreground">
                                {order.shippingAddress.line1}<br />
                                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                                {order.shippingAddress.country}
                            </p>
                            {order.shippingAddress.phone && (
                                <p className="mt-2 text-muted-foreground">{order.shippingAddress.phone}</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <CreditCard className="h-5 w-5" /> Payment
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Method</span>
                                <span className="font-medium">{order.paymentMethod}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Status</span>
                                <OrderStatusBadge status={order.paymentStatus as OrderStatus} />
                            </div>
                        </CardContent>
                    </Card>

                    {["SHIPPED", "DELIVERED"].includes(order.orderStatus) && (
                        <Button className="w-full" variant="outline">
                            <Truck className="mr-2 h-4 w-4" /> Track shipment
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}


/* ---------- loading skeleton ---------- */

function OrderSkeleton() {
    return (
        <div className="mx-auto max-w-4xl space-y-6 p-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-40 w-full" />
        </div>
    );
}
