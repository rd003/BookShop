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
import { useEffect, useState } from "react";
import type { ISelectItem } from "@/shared/types/ISelectItem";
import { type PaymentStatus } from "@/shared/constants/paymentStatus";
import type { OrderStatus } from "@/shared/constants/orderStatus";
import type { ChangeOrderStatus } from "../types/changeOrderStatus";
import type { ChangePaymentStatus } from "../types/changePaymentStatus";

interface Props{
    orders: GetAdminOrder[],
    className?: string,
    onSortToggle: (column: string, multi?: boolean) => void;
    sort: SortItem[];
    paymentStatuses: ISelectItem<PaymentStatus>[];
    orderStatuses: ISelectItem<OrderStatus>[];
    onChangeOrderStatus: (data:ChangeOrderStatus)=>void;
    onChangePaymentStatus: (data:ChangePaymentStatus)=>void;
    resetOrderStausSignal: number;
    resetPaymentStatusSignal: number;
}

export default function AdminOrderList({
    orders,
    className,
    onSortToggle,
    sort,
    paymentStatuses,
    orderStatuses,
    onChangeOrderStatus,
    onChangePaymentStatus,
    resetOrderStausSignal,
    resetPaymentStatusSignal
}:Props) {
    const [editingOrderStatusId, setEditingOrderStatusId] = useState<number|null>(null);
    const [editingPaymentStatusId, setEditingPaymentStatusId] = useState<number|null>(null);
    const [orderStatus, setOrderStatus] = useState<OrderStatus|null>(null);
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus|null>(null);

    useEffect(()=>{
       cancelOrderStatusUpdate();
    },[resetOrderStausSignal]);

    useEffect(()=>{
        cancelPaymentStatusUpdate();
    },[resetPaymentStatusSignal]);

    function startOrderStatusEdit(order:GetAdminOrder){
        setEditingOrderStatusId(order.orderId);
        setOrderStatus(order.orderStatus);
    }

    function startPaymentStatusEdit(order:GetAdminOrder){
        setEditingPaymentStatusId(order.orderId);
        setPaymentStatus(order.pyamentStatus);
    }


    function handleUpdateOrderStatus(orderId:number): void {
        if(!orderStatus) return;
        const data: ChangeOrderStatus = {orderId,orderStatus};
        onChangeOrderStatus(data);
    }

    function cancelOrderStatusUpdate(): void {
        setEditingOrderStatusId(null);
        setOrderStatus(null);
    }

    function handleUpdatePaymentStatus(orderId:number): void {
        if(!paymentStatus) return;
        const data: ChangePaymentStatus = {orderId,paymentStatus};
        onChangePaymentStatus(data);
    }

    function cancelPaymentStatusUpdate(): void {
        setEditingPaymentStatusId(null);
        setPaymentStatus(null);
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
                {editingOrderStatusId!==o.orderId ? (
                    <>
                <OrderStatusBadge status={o.orderStatus}/>
                <Button variant="outline" onClick={()=>startOrderStatusEdit(o)}>Change</Button>
                </>
                ) :(
                    <div className="flex gap-2">
                    <SelectBasic
                    id={`orderStatus-${o.orderId}`}
                    items={orderStatuses}
                    onChange={(val)=>setOrderStatus(val)}
                    placeHolder="Order Status"
                    value={orderStatus ?? o.orderStatus}
                    className=""
                    key={`orderStatus-${o.orderId}`}
                    />
                   <Button variant="default" onClick={()=>handleUpdateOrderStatus(o.orderId)}>Update</Button>
                   <Button variant="destructive" onClick={()=>cancelOrderStatusUpdate()}>Cancel</Button>
                </div>
                )}
            </TableCell>
            <TableCell>
                {o.orderId !== editingPaymentStatusId ? (<>
                <PaymentStatusBadge status={o.pyamentStatus}/>
                {o.pyamentMethod === PaymentMethods.CashOnDelivery && <Button variant="outline" onClick={()=>startPaymentStatusEdit(o)}>Change</Button>}
                </>): (<div className="flex gap-2">
                    <SelectBasic
                    id={`paymentStatus-${o.orderId}`}
                    items={paymentStatuses}
                    onChange={(val)=>setPaymentStatus(val)}
                    placeHolder="Payment Status"
                    value={paymentStatus ?? o.pyamentStatus}
                    className=""
                    key={`orderStatus-${o.orderId}`}
                    />
                   <Button variant="default" onClick={()=>handleUpdatePaymentStatus(o.orderId)}>Update</Button>
                   <Button variant="destructive" onClick={()=>cancelPaymentStatusUpdate()}>Cancel</Button>
                </div>)}

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