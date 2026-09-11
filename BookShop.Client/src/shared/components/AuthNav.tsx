import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useUser } from "@/auth/hooks/useUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "@/auth/api/authApi";

export default function AuthNav() {
    const { data: user, isLoading } = useUser();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const logoutMutation = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            console.trace("Logout onSuccess navigate ('/') firing");
            navigate('/');
        }
    })

    function handleLogoutClick() {
        logoutMutation.mutate();
    }

    if (isLoading) return null;

    if (user) {
        return (
            <div className="hidden md:flex items-center gap-2 ml-2">
                <div className="md:flex items-center gap-0.5">
                    <Button render={<Link to="/account" />} variant="ghost" size="icon" aria-label="Account" nativeButton={false}>
                        <User className="h-5 w-5 text-stone-700" />
                    </Button>
                    <span className="text-sm text-stone-700 block">{user.username}</span>
                </div>
                <Button
                    variant="default"
                    size="sm"
                    onClick={handleLogoutClick}
                    disabled={logoutMutation.isPending}
                >
                    Log out
                </Button>
            </div>
        );
    }

    return (
        <div className="hidden md:flex items-center gap-2 ml-2">
            <Link to="/login"
                className="text-sm text-stone-600 hover:text-stone-900 transition-colors"
            >
                Login
            </Link>
            <Button size="sm" render={<Link to="/signup" />} className="bg-[#8A2E2E] hover:bg-[#732626]" nativeButton={false}>
                Sign Up
            </Button>
        </div>
    );
}