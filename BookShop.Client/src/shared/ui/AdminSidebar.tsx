import { NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Library,
    Users,
    Building2,
    BookOpen,
    ShoppingCart,
    KeyRound,
    LogOut,
    BookMarked,
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import useLogout from "@/auth/hooks/useLogout";

const menuItems = [
    { title: "Dashboard", url: "/admin", icon: LayoutDashboard, end: true },
    { title: "Genres", url: "/admin/genres", icon: Library },
    { title: "Authors", url: "/admin/authors", icon: Users },
    { title: "Publishers", url: "/admin/publishers", icon: Building2 },
    { title: "Books", url: "/admin/books", icon: BookOpen },
    { title: "Orders", url: "/admin/orders", icon: ShoppingCart },
];

export function AdminSidebar() {
    const navigate = useNavigate();
    const logoutMutation = useLogout();
    const handleLogout = () => {
        logoutMutation.mutate(undefined, {
            onSuccess: () => {
                navigate("/login");
            }
        })
    };

    return (
        <Sidebar collapsible="icon">
            {/* Brand */}
            <SidebarHeader className="flex h-14 items-center px-4">
                <div className="flex items-center gap-2 overflow-hidden">
                    <BookMarked className="h-6 w-6 shrink-0 text-primary" />
                    <span className="truncate font-semibold group-data-[collapsible=icon]:hidden">
                        Bookstore Admin
                    </span>
                </div>
            </SidebarHeader>

            {/* Main nav */}
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton isActive={false} render={<NavLink
                                        to={item.url}
                                        end={item.end}
                                        className={({ isActive }) =>
                                            isActive ? "bg-accent text-accent-foreground font-medium" : ""
                                        }
                                    />}>
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer: change password + logout */}
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton render={<NavLink
                            to="/admin/change-password"
                            className={({ isActive }) =>
                                isActive ? "bg-accent text-accent-foreground font-medium" : ""
                            }
                        />}>
                            <KeyRound className="h-4 w-4" />
                            <span>Change Password</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <Button
                            variant="ghost"
                            className="w-full justify-start px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={handleLogout}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span className="group-data-[collapsible=icon]:hidden">Logout</span>
                        </Button>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar >
    );
}