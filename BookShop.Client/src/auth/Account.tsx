import { useUser } from "./hooks/useUser"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Mail, User, AtSign } from "lucide-react"

export default function Account() {
    const { data: user, isLoading } = useUser();

    if (isLoading) {
        return (
            <div className="container max-w-2xl mx-auto p-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-16 w-16 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-40" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="container max-w-2xl mx-auto p-6">
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="rounded-full bg-muted p-4 mb-4">
                            <User className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <CardTitle className="text-xl mb-2">No data found</CardTitle>
                        <CardDescription>
                            We couldn't find any account information.
                        </CardDescription>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const initials = user.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="container max-w-2xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Account</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your account information and preferences.
                </p>
            </div>

            <Card className="overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
                <CardHeader className="-mt-12">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                        <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                            <AvatarImage src={`https://avatar.vercel.sh/${user.username}`} alt={user.name} />
                            <AvatarFallback className="text-lg font-semibold">
                                {initials || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 pb-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <CardTitle className="text-2xl">{user.name}</CardTitle>
                                <Badge variant="secondary" className="font-normal">
                                    Active
                                </Badge>
                            </div>
                            <CardDescription className="mt-1">
                                @{user.username}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <Separator />

                <CardContent className="pt-6">
                    <dl className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-muted p-2.5">
                                <User className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <dt className="text-sm font-medium text-muted-foreground">
                                    Full Name
                                </dt>
                                <dd className="text-sm font-medium truncate">
                                    {user.name}
                                </dd>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-muted p-2.5">
                                <AtSign className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <dt className="text-sm font-medium text-muted-foreground">
                                    Username
                                </dt>
                                <dd className="text-sm font-medium truncate">
                                    {user.username}
                                </dd>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-muted p-2.5">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <dt className="text-sm font-medium text-muted-foreground">
                                    Email
                                </dt>
                                <dd className="text-sm font-medium truncate">
                                    {user.email}
                                </dd>
                            </div>
                        </div>
                    </dl>
                </CardContent>
            </Card>
        </div>
    )
}