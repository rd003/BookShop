import { apiFetch } from "@/lib/apiClient";
import type { LoginRequest } from "../types/loginRequest";
import type { UserInfo } from "../types/UserInfo";
import type { TokenInfoRequest } from "../types/tokenInfoRequest";

export async function login(loginReq: LoginRequest) {
    return apiFetch("/auth/login", {
        method: 'POST',
        body: JSON.stringify(loginReq)
    })
}

export async function refresh() {
    const tokenInfoReq: TokenInfoRequest = {
        accessToken: null,
        refreshToken: null
    }
    return apiFetch("/auth/refresh", {
        method: 'POST',
        body: JSON.stringify(tokenInfoReq),
        skipAuthRetry: true
    });
}

export async function getUserInfo(): Promise<UserInfo> {
    return apiFetch("/auth/me")
}

export async function logout() {
    return apiFetch("/auth/logout", {
        method: 'POST'
    });
}

export async function revokeToken() {
    return apiFetch("/auth/token/revoke", {
        method: 'POST'
    });
}