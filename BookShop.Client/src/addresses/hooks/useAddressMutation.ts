import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAddress, deleteAddress, updateAddress } from "../apis/addressApi";

function useInvalidateAddress() {
    const queryClient = useQueryClient();
    return () => queryClient.invalidateQueries({ queryKey: ['addresses'] });
}

export function useAddAddress() {
    const invalidateAddress = useInvalidateAddress();
    return useMutation({
        mutationFn: createAddress,
        onSuccess: invalidateAddress
    });
}

export function useUpdateAddress() {
    const invalidateAddress = useInvalidateAddress();
    return useMutation({
        mutationFn: updateAddress,
        onSuccess: invalidateAddress
    });
}

export function useDeleteAddress() {
    const invalidateAddress = useInvalidateAddress();
    return useMutation({
        mutationFn: deleteAddress,
        onSuccess: invalidateAddress
    })
}