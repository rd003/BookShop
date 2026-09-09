import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

export default function CartIcon() {
    const cartCount = 0;
    return (<Button
        variant="ghost"
        size="icon"
        className="relative ml-auto md:ml-2"
        aria-label="Cart"
        nativeButton={false}
        render={<Link to="/cart" />}
    >
        <ShoppingCart className="h-5 w-5 text-stone-700" />
        {cartCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 min-w-5 justify-center rounded-full bg-[#8A2E2E] px-1 text-[10px] text-white hover:bg-[#8A2E2E]">
                {cartCount}
            </Badge>
        )}
    </Button>)
}