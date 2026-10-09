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
import { PaymentMethods } from "@/shared/constants/paymentMethod";
import SelectBasic from "@/components/SelectBasic";
import { useState } from "react";

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
  const [changeOrderStatus, setChangeOrderStatus] = useState(false);

  function handleCancelOrderStatusChange(){
    setChangeOrderStatus(false);
  }

  function handleUpdateOrderStatus(){
    setChangeOrderStatus(false);
  }

  return (
    <Table className={cn("",className)}>
       <TableHeader>
          <TableRow>
             <TableHead>Order#</TableHead>
             <SortableHead
                               label="OrderDate"
                               direction={getDirection(sort, "orderDate")}
                               onToggle={multi => onSortToggle("orderDate", multi)}
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
            <TableCell>
                {!changeOrderStatus &&
                <>
                <OrderStatusBadge status={o.orderStatus}/>
                <Button variant="outline" onClick={()=>setChangeOrderStatus(true)}>Change</Button>
                </>
                }
                {changeOrderStatus &&
                <div className="flex gap-2">
                    <SelectBasic
                    id={`orderStatus-${o.orderId}`}
                    items={}
                    onChange={}
                    placeHolder="select order status"
                    value={}
                    className=""
                    key={`orderStatus-${o.orderId}`}
                    />
                   <Button variant="default" onClick={()=>handleUpdateOrderStatus()}>Update</Button>
                   <Button variant="destructive" onClick={handleCancelOrderStatusChange}>Cancel</Button>
                </div>
              }
            </TableCell>
            <TableCell>
                <PaymentStatusBadge status={o.pyamentStatus}/>
                {o.pyamentMethod === PaymentMethods.CashOnDelivery && <Button variant="outline">Change</Button>}
            </TableCell>
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