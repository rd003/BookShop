// src/pages/CheckoutPage.tsx
import type { ReadAddress } from "@/addresses/types/readAddress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { OrderFormValues } from "./types/createOrderSchema";
import OrderForm from "./OrderForm";
import { replace, useNavigate } from "react-router-dom";
import useCreateOrder from "./hooks/useCreateOrder";
import type { CreateOrder } from "./types/createOrder";
import { toast } from "../components/ui/toast";
import { getUserFacingError } from "@/lib/getUserFacingError";

const mockAddresses: ReadAddress[] = [
    {
        id: 1,
        fullName: "John Doe",
        phone: "+1 555-0101",
        line1: "123 Main Street",
        line2: "Apt 4B",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "United States",
        isDefault: true,
    },
    {
        id: 2,
        fullName: "John Doe",
        phone: "+1 555-0101",
        line1: "456 Work Avenue",
        line2: null,
        city: "New York",
        state: "NY",
        postalCode: "10002",
        country: "United States",
        isDefault: false,
    },
];

export default function Checkout() {
    const navigate = useNavigate();
    const createOrderMutation = useCreateOrder();

    async function handleSubmit(data: OrderFormValues) {
        navigate(`/order-success/ORD-20260916-33FB6
`, { replace: true });
        // createOrderMutation.mutate(data as CreateOrder, {
        //     onSuccess: (createdOrder) => {
        //         toast.add({
        //             type: 'success',
        //             description: "Order is success full"
        //         });
        //         navigate(`/order-success/${createdOrder.orderNumber}`,{replace:true});
        //     },
        //     onError: (err) => {
        //         toast.add({
        //             type: 'error',
        //             description: getUserFacingError(err)
        //         });
        //     }
        // });
    }

    function handleAddNewAddress() {
        navigate("/account/addresses")
    }

    return (
        <div className="container mx-auto max-w-3xl py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Checkout</CardTitle>
                </CardHeader>
                <CardContent>
                    <OrderForm
                        addresses={mockAddresses}
                        onSubmit={handleSubmit}
                        onAddNewAddress={handleAddNewAddress}
                    />
                </CardContent>
            </Card>
        </div>
    );
}