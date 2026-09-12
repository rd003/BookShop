import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAddress, deleteAddress, updateAddress } from "../apis/addressApi";

function useInvalidateCart() {
    const query = useQueryClient();
    return query.invalidateQueries({ queryKey: ['addresses'] });
}

export function useAddAddress() {
    return useMutation({
        mutationFn: createAddress,
        onSuccess: useInvalidateCart
    });
}

export function useUpdateAddress() {
    return useMutation({
        mutationFn: updateAddress,
        onSuccess: useInvalidateCart
    });
}

export function useDeleteAddress() {
    return useMutation({
        mutationFn: deleteAddress,
        onSuccess: useInvalidateCart
    })
}