import type { LoginRequest } from "../types/loginRequest";

const baseUrl = import.meta.env.VITE_API_BASE_URL + "/auth";

// Set cookie
export async function login(loginReq: LoginRequest) {
    const url = baseUrl + "/login";
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(loginReq)
    });
    if (!res.ok) {
        throw new Error("Failed to loging.")
    }
    return res.json();
}

export function getUserInfo() {
    const url = baseUrl + "/me";
    // i will work on this later.
}