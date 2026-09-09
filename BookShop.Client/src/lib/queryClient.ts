// New or existing file: src/lib/queryClient.ts
import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";

const SESSION_EXPIRED_MSG = "Session expired. Please log in again."; // must match apiClient.ts throw message

function handleAuthError(error: unknown) {
    if (error instanceof Error && error.message === SESSION_EXPIRED_MSG) {
        if (window.location.pathname !== "/login") {
            window.location.href = "/login";
        }
    }
}

export const queryClient = new QueryClient({
    queryCache: new QueryCache({ onError: handleAuthError }),
    mutationCache: new MutationCache({ onError: handleAuthError }),
});