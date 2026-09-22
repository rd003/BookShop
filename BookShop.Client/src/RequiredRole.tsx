import { useUser } from "@/auth/hooks/useUser";
import { Navigate, Outlet, useLocation } from "react-router-dom";

interface RequireRoleProps {
    roles: string[];
}

export default function RequireRole({ roles }: RequireRoleProps) {
    const { data: user, isLoading } = useUser();
    const location = useLocation();

    if (isLoading) return null;

    if (!user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // Case-insensitive check: normalize both sides
    const normalizedRoles = roles.map((r) => r.toLowerCase());
    const userRoles = user.roles.map((r) => r.toLowerCase());

    const hasRole = normalizedRoles.some((role) => userRoles.includes(role));
    if (!hasRole) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}