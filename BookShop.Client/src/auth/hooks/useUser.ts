import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "../api/authApi";

export function useUser() {
    return useQuery({
        queryKey: ['user'],
        queryFn: getUserInfo,
        retry: false,
        meta: { skipGlobalAuthRedirect: true }, // tells queryClient's onError not to force-redirect on this query's failure
    });
}