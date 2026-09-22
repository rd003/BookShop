import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useUser } from "@/auth/hooks/useUser";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import useLogout from "@/auth/hooks/useLogout";

export default function AuthNav() {
    const { data: user, isLoading } = useUser();
    const navigate = useNavigate();
    const logoutMutation = useLogout();

    function handleLogoutClick() {
        logoutMutation.mutate(undefined, {
            onSuccess: () => {
                console.trace("Logout onSuccess navigate ('/') firing");
                navigate("/")
            }
        });
    }

    if (isLoading) return null;

    if (user) {
        return (
            <div className="hidden md:flex items-center gap-2 ml-2">
                <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="flex items-center gap-1.5" />}>
                        <User className="h-5 w-5 text-stone-700" />
                        <span className="text-sm text-stone-700">{user.username}</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate('/account')}>
                            My Account
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/account/change-password')}>
                            Change Password
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/account/orders')}>
                            My Orders
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/account/addresses')}>
                            My Addresses
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handleLogoutClick}
                            disabled={logoutMutation.isPending}
                            variant="destructive"
                        >
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
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