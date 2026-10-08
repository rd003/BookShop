import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { GetAdminOrder } from "../types/getAdminOrder";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import PaymentMethodBadge from "@/components/PaymentMethodBadge";
import PaymentStatusBadge from "@/components/PaymentStatusBadge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "cn";
import { getDirection, type SortItem } from "@/lib/sort";
import SortableHead from "@/components/SortableHead";

interface Props{
    orders: GetAdminOrder[],
    className?: string,
    onSortToggle: (column: string, multi?: boolean) => void;
    sort: SortItem[];
}

export default function AdminOrderList({
    orders,
    className,
    onSortToggle,
    sort,
}:Props) {
  return (
    <Table className={cn("",className)}>
       <TableHeader>
          <TableRow>
             <TableHead>Order#</TableHead>
             <SortableHead
                               label="OrderDate"
                               direction={getDirection(sort, "orderDate")}
                               onToggle={multi => onSortToggle("name", multi)}
             />
             <TableHead>Email</TableHead>
             <TableHead>Order Status</TableHead>
             <TableHead>Payment Status</TableHead>
             <TableHead>Payment Method</TableHead>
             <TableHead>Total</TableHead>
             <TableHead>Actions</TableHead>
          </TableRow>
       </TableHeader>

       <TableBody>
        { orders.map(o=>
        <TableRow key={o.orderId}>
            <TableCell>{o.orderNumber}</TableCell>
            <TableCell>{formatDateTime(o.orderDate)}</TableCell>
            <TableCell>{o.customerEmail}</TableCell>
            <TableCell><OrderStatusBadge status={o.orderStatus}/></TableCell>
            <TableCell><PaymentStatusBadge status={o.pyamentStatus}/></TableCell>
            <TableCell><PaymentMethodBadge paymentMethod={o.pyamentMethod}/></TableCell>
            <TableCell>{formatCurrency(o.orderTotal)}</TableCell>
            <TableCell>
                <Button variant="default" nativeButton={false} render={<Link to={`/admin/orders/${o.orderId}`}/>}>Detail</Button>
            </TableCell>
        </TableRow>)  }
       </TableBody>
    </Table>
  )
}