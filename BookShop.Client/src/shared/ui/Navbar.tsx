import React, { useState } from "react";
import { Search, ShoppingCart, Menu, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Link, NavLink, type NavLinkRenderProps } from "react-router-dom";
import type { LinkType } from "../types/LinkType";

const NAV_LINKS: LinkType[] = [
    { label: "Catalog", href: "/" },
    { label: "About", href: "/about" },
    { label: "New arrivals", href: "new-arrivals" },
];

// cartCount is a prop so the real app can wire it to actual cart state
export default function Navbar({ cartCount = 0, isLoggedIn = false }) {
    const [query, setQuery] = useState("");
    const { theme, setTheme } = useTheme();

    const navLinkClass = (base: string) => ({ isActive }: NavLinkRenderProps) =>
        `${base} ${isActive ? "text-stone-900 font-medium" : "text-stone-600"}`;

    function handleSearchSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        console.log("search:", query);
    }

    return (
        <header className="sticky top-0 z-40 border-b border-stone-200 bg-[#FBF8F3]/95 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
                {/* Logo */}
                <NavLink to="/" className="flex items-center gap-2 shrink-0">
                    <BookOpen className="h-6 w-6 text-[#8A2E2E]" strokeWidth={1.75} />
                    <span className="font-serif text-lg tracking-tight text-stone-900">
                        Chapter & Verse
                    </span>
                </NavLink>

                {/* Desktop nav links */}
                <nav className="hidden md:flex items-center gap-6 ml-4">
                    {NAV_LINKS.map((link) => (
                        <NavLink
                            key={link.href}
                            to={link.href}
                            className={navLinkClass("text-sm hover:text-stone-900 transition-colors")}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Search - desktop */}
                <form
                    onSubmit={handleSearchSubmit}
                    className="hidden md:flex flex-1 max-w-sm ml-auto relative"
                >
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search titles, authors, ISBN..."
                        className="pl-9 bg-white"
                    />
                </form>

                {/* Theme button */}
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="ghost" size="icon" aria-label="Toggle theme">
                            {theme === "dark" ? (
                                <Moon className="h-5 w-5 text-stone-700" />
                            ) : theme === "light" ? (
                                <Sun className="h-5 w-5 text-stone-700" />
                            ) : (
                                <Monitor className="h-5 w-5 text-stone-700" />
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                            <Sun className="mr-2 h-4 w-4" /> Light
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                            <Moon className="mr-2 h-4 w-4" /> Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                            <Monitor className="mr-2 h-4 w-4" /> System
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* login/signup */}
                {isLoggedIn ? (
                    <Button variant="ghost" size="icon" aria-label="Account">
                        <a href="/account">
                            <User className="h-5 w-5 text-stone-700" />
                        </a>
                    </Button>
                ) : (
                    <div className="hidden md:flex items-center gap-2 ml-2">
                        <Link to="/login"
                            className="text-sm text-stone-600 hover:text-stone-900 transition-colors"
                        >
                            Login
                        </Link>
                        <Button size="sm" render={<Link to="/signup" />} className="bg-[#8A2E2E] hover:bg-[#732626]">
                            Sign Up
                        </Button>
                    </div>
                )}


                {/* Cart */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative ml-auto md:ml-2"
                    aria-label="Cart"
                    render={<Link to="/cart" />}
                >
                    <ShoppingCart className="h-5 w-5 text-stone-700" />
                    {cartCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 min-w-5 justify-center rounded-full bg-[#8A2E2E] px-1 text-[10px] text-white hover:bg-[#8A2E2E]">
                            {cartCount}
                        </Badge>
                    )}
                </Button>

                {/* Mobile menu */}
                <Sheet>
                    <SheetTrigger>
                        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="bg-[#FBF8F3]">
                        <div className="mt-8 flex flex-col gap-4">
                            <form onSubmit={handleSearchSubmit} className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                                <Input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search titles..."
                                    className="pl-9 bg-white"
                                />
                            </form>
                            {NAV_LINKS.map((link) => (
                                <NavLink
                                    key={link.href}
                                    to={link.href}
                                    className={navLinkClass("text-base hover:text-stone-900")}
                                >
                                    {link.label}
                                </NavLink>
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header >
    );
}