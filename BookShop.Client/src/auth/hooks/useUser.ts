import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "../api/authApi";

export function useUser() {
    return useQuery({
        queryKey: ['user'],
        queryFn: getUserInfo,
        retry: false,
    });
}