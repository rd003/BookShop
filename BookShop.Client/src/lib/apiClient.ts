import { refresh } from "@/auth/api/authApi";

let refreshPromise: Promise<unknown> | null = null; // dedupes concurrent refreshes

export async function apiFetch<T>(
    path: string,
    options: RequestInit & { withCredentials?: boolean; skipAuthRetry?: boolean } = {}
): Promise<T> {
    const { withCredentials = true, skipAuthRetry = false, ...fetchOptions } = options;
    const url = import.meta.env.VITE_API_BASE_URL + path;
    const res = await fetch(url, {
        credentials: withCredentials ? 'include' : 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            ...fetchOptions.headers
        },
        ...fetchOptions
    });

    if (res.status === 401 && !skipAuthRetry) { // attempt refresh once, then retry original call
        if (!refreshPromise) {
            refreshPromise = refresh().finally(() => { refreshPromise = null; });
        }
        try {
            await refreshPromise;
        } catch {
            throw new Error("Session expired. Please log in again."); // refresh itself failed
        }
        return apiFetch<T>(path, { ...options, skipAuthRetry: true }); // retry once, guard against loop
    }

    if (!res.ok) {
        throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    }
    if (res.status === 204) {
        return undefined as T;
    }
    return res.json();
}