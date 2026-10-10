import { useParams } from "react-router-dom"
import useAdminOrderDetail from "./hooks/useAdminOrderDetail";
import { getUserFacingError } from "@/lib/getUserFacingError";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import PaymentMethodBadge from "@/components/PaymentMethodBadge";
import PaymentStatusBadge from "@/components/PaymentStatusBadge";

export default function AdminOrderDetailPage() {
  const {id} = useParams<{id:string}>();
  const orderQuery = useAdminOrderDetail(Number(id));
  const order = orderQuery.data;

  if(orderQuery.status==='pending') return (<p>Loading...</p>)

  if(!order) return (<p>No record(s) found</p>)

  return (
    <>
      <h1 className="text-2xl">Order detail of #{order.orderNumber}</h1>

      {orderQuery.status === 'error' && <p className="text-destructive">{getUserFacingError(orderQuery.error)}</p>}

      <div>
         <p className="font-semibold">Order#: {order.orderNumber}</p>
         <p>Order Date: {formatDateTime(order.orderDate)}</p>
         <p>Email: {order.customerEmail}</p>
         <p>Order Status: <OrderStatusBadge status={order.orderStatus}/></p>
         <p>Payment Status: <PaymentStatusBadge status={order.pyamentStatus}/></p>
         <p>Payment Method: <PaymentMethodBadge paymentMethod={order.pyamentMethod}/></p>

         <p className="font-semibold">Order Total: {formatCurrency(order.orderTotal)}</p>

         <h3 className="text-3xl">Items</h3>

         <ul>
            {order.orderItems.map((oi)=>(
              <li key={oi.id}>
                <p>Book: {oi.bookTitle}</p>
                <p>Authors: {oi.authors.join(', ')}</p>
                <p>Genres: {oi.genres.join(', ')}</p>
                <p>Unit price: {oi.unitPrice}</p>
                <p>Quantity: {oi.quantity}</p>
                <p>Total: {oi.itemTotalPrice}</p>
            </li>))}
         </ul>
      </div>
    </>
  )
}
