import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";

const SESSION_EXPIRED_MSG = "Session expired. Please log in again.";

function handleAuthError(error: unknown, query?: { meta?: Record<string, unknown> }) {
    if (query?.meta?.skipGlobalAuthRedirect) return;

    if (error instanceof Error && error.message === SESSION_EXPIRED_MSG) {
        if (window.location.pathname !== "/login") {
            window.location.href = "/login";
        }
    }
}

export const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (error, query) => handleAuthError(error, query),
    }),
    mutationCache: new MutationCache({
        onError: (error) => handleAuthError(error),
    }),
});