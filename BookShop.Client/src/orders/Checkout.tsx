import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { OrderFormValues } from "./types/createOrderSchema";
import OrderForm from "./OrderForm";
import { useNavigate } from "react-router-dom";
import useCreateOrder from "./hooks/useCreateOrder";
import type { CreateOrder } from "./types/createOrder";
import { toast } from "../components/ui/toast";
import { getUserFacingError } from "@/lib/getUserFacingError";
import useAddress from "@/addresses/hooks/useAddress";

export default function Checkout() {
    const navigate = useNavigate();
    const createOrderMutation = useCreateOrder();
    const { addresses, addressQueryStatus, addressQueryError } = useAddress();

    async function handleSubmit(data: OrderFormValues) {
        createOrderMutation.mutate(data as CreateOrder, {
            onSuccess: (createdOrder) => {
                navigate(`/order-success/${createdOrder.orderNumber}`, { replace: true });
            },
            onError: (err) => {
                toast.add({
                    type: 'error',
                    description: getUserFacingError(err)
                });
            }
        });
    }

    function handleAddNewAddress() {
        navigate("/account/addresses")
    }
    if (addressQueryStatus === 'pending') {
        return (<p>Wait....</p>)
    }
    if (addressQueryStatus === 'error') {
        return (<p className="text-red-500">{getUserFacingError(addressQueryError)}</p>)
    }
    return (
        <div className="container mx-auto max-w-3xl py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Checkout</CardTitle>
                </CardHeader>
                <CardContent>
                    <OrderForm
                        addresses={addresses}
                        onSubmit={handleSubmit}
                        onAddNewAddress={handleAddNewAddress}
                    />
                </CardContent>
            </Card>
        </div>
    );
}