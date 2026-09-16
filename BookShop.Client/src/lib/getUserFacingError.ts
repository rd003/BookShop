// src/lib/getUserFacingError.ts
export function getUserFacingError(error: unknown): string {
    console.error("[getUserFacingError] raw error:", error);
    const status = (error as { response?: { status?: number } })?.response?.status;
    switch (status) {
        case 400: return (error as any).message || "Please check the values you are providing and try again.";
        case 401: return "Your session has expired. Please log in again.";
        case 404: return "This resource no longer exists.";
        case 405: return "This action isn't supported right now. Please try again later.";
        case 409: return "This resource was already updated elsewhere. Please refresh.";
        case 500: return "Something went wrong on our end. Please try again.";
        default: return "Unable to complete this action. Please try again.";
    }
}