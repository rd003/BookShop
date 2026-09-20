import { formatCurrency, formatDateTime } from "@/lib/format";
import { Button } from "@/components/ui/button";
import PaymentStatusBadge from "@/components/PaymentStatusBadge";
import PaymentMethodBadge from "@/components/PaymentMethodBadge";
import { Link } from "react-router-dom";
import type { GetUserOrder } from "./types/getUserOrder";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";

export default function OrderList({ orders, className }: { orders: GetUserOrder[], className?: string }) {
    return (
        <Table className={className}>
            <TableCaption>A list of your recent orders</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-25">Order#</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Order Status</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead >Amount</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {orders.map(o => <TableRow>
                    <TableCell key={o.orderNumber} className="font-medium">{o.orderNumber}</TableCell>
                    <TableCell>{formatDateTime(o.orderDate)}</TableCell>
                    <TableCell>
                        <OrderStatusBadge status={o.orderStatus} />
                    </TableCell>
                    <TableCell>
                        <PaymentMethodBadge paymentMethod={o.paymentMethod} />
                    </TableCell>
                    <TableCell>
                        <PaymentStatusBadge status={o.paymentStatus} />
                    </TableCell>
                    <TableCell className="font-semibold">
                        {formatCurrency(o.orderTotal)}
                    </TableCell>
                    <TableCell>
                        <Button variant="outline" nativeButton={false}
                            render={<Link to={`/orders/${o.orderNumber}`}>Detail</Link>} />
                    </TableCell>

                </TableRow>)
                }
            </TableBody>
        </Table>
    )
}