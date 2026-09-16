import { useParams } from "react-router-dom"

export default function Order() {
    const { orderNumber } = useParams<{ orderNumber: string }>();
    return (<>
        <p>Order details of #${orderNumber}</p>
    </>)
}