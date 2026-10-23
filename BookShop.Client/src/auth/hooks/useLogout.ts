import { useMutation, useQueryClient } from "@tanstack/react-query"
import { logout } from "../api/authApi"

export default function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      //queryClient.invalidateQueries({ queryKey: ["user"] })
      await queryClient.cancelQueries({ queryKey: ["user"] }) // ADDED: stop in-flight /me
      queryClient.setQueryData(["user"], null)
    },
  })
}
