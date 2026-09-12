import { MapPin, Phone, User, Check, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import type { ReadAddress } from "./types/readAddress";
import { cn } from "@/lib/utils";

interface AddressCardProps {
    address: ReadAddress;
    onEdit?: (address: ReadAddress) => void;
    onDelete?: (id: number) => void;
    onSetDefault?: (id: number) => void;
}

export default function AddressCard({
    address,
    onEdit,
    onDelete,
    onSetDefault,
}: AddressCardProps) {
    const {
        id,
        fullName,
        phone,
        line1,
        line2,
        city,
        state,
        postalCode,
        country,
        isDefault,
    } = address;

    return (
        <Card
            className={cn(
                "relative flex flex-col transition-colors",
                isDefault && "border-primary/60 ring-primary/20 ring-1"
            )}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <User className="text-muted-foreground h-4 w-4 shrink-0" />
                        <span className="truncate font-medium">{fullName}</span>
                    </div>
                    {isDefault && (
                        <Badge variant="default" className="gap-1 shrink-0">
                            <Check className="h-3 w-3" />
                            Default
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-2 text-sm">
                <div className="text-muted-foreground flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                    <address className="not-italic leading-relaxed">
                        <div>{line1}</div>
                        {line2 && <div>{line2}</div>}
                        <div>
                            {city}, {state} {postalCode}
                        </div>
                        <div>{country}</div>
                    </address>
                </div>

                <div className="text-muted-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4 shrink-0" />
                    <span>{phone}</span>
                </div>
            </CardContent>

            <CardFooter className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
                {!isDefault && onSetDefault ? (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSetDefault(id)}
                    >
                        Set as default
                    </Button>
                ) : (
                    <span />
                )}

                <div className="flex items-center gap-1">
                    {onEdit && (
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Edit address"
                            onClick={() => onEdit(address)}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                    )}
                    {onDelete && (
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Delete address"
                            onClick={() => onDelete(id)}
                            className="text-destructive hover:text-destructive"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}