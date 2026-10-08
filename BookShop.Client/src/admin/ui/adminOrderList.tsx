import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import type { GetAdminOrder } from "../types/getAdminOrder";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import PaymentMethodBadge from "@/components/PaymentMethodBadge";
import PaymentStatusBadge from "@/components/PaymentStatusBadge";

interface Props{
    orders: GetAdminOrder[],
}

export default function AdminOrderList({
    orders,
}:Props) {
  return (
    <Table>
       <TableHead>
          <TableRow>
             <TableHead>Order#</TableHead>
             <TableHead>Date</TableHead>
              <TableHead>Email</TableHead>
             <TableHead>Order Status</TableHead>
             <TableHead>Payment Status</TableHead>
             <TableHead>Payment Method</TableHead>
             <TableHead>Total</TableHead>
          </TableRow>
       </TableHead>

       <TableBody>
        { orders.map(o=><TableRow key={o.orderId}>
            <TableCell>{o.orderNumber}</TableCell>
            <TableCell>{formatDateTime(o.orderDate)}</TableCell>
            <TableCell>{o.customerEmail}</TableCell>
            <TableCell><OrderStatusBadge status={o.orderStatus}/></TableCell>
            <TableCell><PaymentStatusBadge status={o.pyamentStatus}/></TableCell>
            <TableCell><PaymentMethodBadge paymentMethod={o.pyamentMethod}/></TableCell>
            <TableCell>{formatCurrency(o.orderTotal)}</TableCell>
        </TableRow>)  }
       </TableBody>
    </Table>
  )
}
