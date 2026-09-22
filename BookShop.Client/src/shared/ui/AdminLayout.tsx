import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AdminSidebar } from "./AdminSidebar";

export function AdminLayout() {
    return (
        <SidebarProvider>
            <AdminSidebar />
            <SidebarInset>
                <header className="flex h-14 items-center gap-3 border-b px-4 lg:px-6">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="h-5" />
                    <h1 className="text-sm font-medium text-muted-foreground">Admin Panel</h1>
                </header>
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}