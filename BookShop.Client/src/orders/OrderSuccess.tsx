import { Link, useParams } from "react-router-dom";

export default function OrderSuccess() {
    const { orderNumber } = useParams<{ orderNumber: string }>();
    return (<>
        <p>Your order with order number {orderNumber} is generated/

            You can check your order status <Link to="orders/${orderNumber}">here</Link> or visit to <Link to="/catalog">catalog</Link> for more shopping
        </p>
    </>)
}