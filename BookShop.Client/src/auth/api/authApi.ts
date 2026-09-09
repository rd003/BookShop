import { apiFetch } from "@/lib/apiClient";
import type { LoginRequest } from "../types/loginRequest";

export async function login(loginReq: LoginRequest) {
    return apiFetch("/auth/login", {
        method: 'POST',
        body: JSON.stringify(loginReq)
    })
}

export function getUserInfo() {
    return apiFetch("auth/me")
}

export function logout() {
    return apiFetch("auth/logout", {
        method: 'POST'
    });
}

export function revokeToken() {
    return apiFetch("auth/token/revoke", {
        method: 'POST'
    });
}