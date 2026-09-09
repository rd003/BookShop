import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useUser } from "@/auth/hooks/useUser";

export default function AuthNav() {
    const { data: user, isLoading } = useUser();

    if (isLoading) return null;

    if (user) {
        return (
            <>
                <Button render={<Link to="/account" />} variant="ghost" size="icon" aria-label="Account" nativeButton={false}>
                    <User className="h-5 w-5 text-stone-700" />
                </Button>
                <span>({user.username})</span>
            </>
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