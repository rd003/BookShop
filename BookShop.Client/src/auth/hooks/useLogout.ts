import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../api/authApi";

export default function useLogout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            console.trace("Logout onSuccess navigate ('/') firing");
        }
    });
}