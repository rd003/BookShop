import { formatCurrency, formatDateTime } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
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

export default function OrderList({ orders }: { orders: GetUserOrder[] }) {
    return (
        <ul>
            {orders.map(o => <li key={o.orderNumber}>
                {formatDateTime(o.orderDate)}
                | {o.orderNumber}
                | <OrderStatusBadge status={o.orderStatus} />
                | <PaymentMethodBadge paymentMethod={o.paymentMethod} />
                | <PaymentStatusBadge status={o.paymentStatus} />
                | {formatCurrency(o.orderTotal)}
                | <Button variant="outline" nativeButton={false}
                    render={<Link to={`/orders/${o.orderNumber}`}>Detail</Link>} />
            </li>)}

            <Table>
                <TableCaption>A list of your recent orders</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-25">Order#</TableHead>
                        <TableHead>Order Date</TableHead>
                        <TableHead>Order Status</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead>Payment Status</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {orders.map(o => <TableRow>
                        <TableCell className="font-medium">{o.orderNumber}</TableCell>
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
                        <TableCell>
                            {formatCurrency(o.orderTotal)}
                        </TableCell>
                        <TableCell className="text-right">{o.orderTotal}</TableCell>
                        <TableCell>
                            <Button variant="outline" nativeButton={false}
                                render={<Link to={`/orders/${o.orderNumber}`}>Detail</Link>} />
                        </TableCell>

                    </TableRow>)
                    }
                </TableBody>
            </Table>
        </ul>
    )
}