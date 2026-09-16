import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "../api/orderApi";

export default function useCreateOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createOrder,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] })
    })
}