export async function apiFetch<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const url = import.meta.env.VITE_API_BASE_URL + path;
    const res = await fetch(url, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    });
    if (!res.ok) {
        throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    }
    if (res.status === 204) {
        return undefined as T;
    }
    return res.json();
}