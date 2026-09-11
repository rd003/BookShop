import { useUser } from "@/auth/hooks/useUser";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function RequireAuth() {
    const { data: user, isLoading } = useUser();
    const location = useLocation();

    if (isLoading) return null;

    if (!user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
}