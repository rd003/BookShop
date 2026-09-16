import { Check, MapPin, Phone, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { ReadAddress } from "@/addresses/types/readAddress";

interface AddressCardProps {
    address: ReadAddress;
    selected: boolean;
    onSelect: (id: number) => void;
}

export function AddressCard({ address, selected, onSelect }: AddressCardProps) {
    return (
        <button
            type="button"
            onClick={() => onSelect(address.id)}
            className={cn(
                "group relative w-full rounded-xl border-2 p-4 text-left transition-all duration-200",
                "hover:border-primary/50 hover:shadow-md",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                selected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-card"
            )}
        >
            {/* Selection indicator */}
            <div
                className={cn(
                    "absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all",
                    selected
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/30 bg-background group-hover:border-primary/50"
                )}
            >
                {selected && <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} />}
            </div>

            <div className="space-y-3 pr-8">
                {/* Name + Default badge */}
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                        <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-foreground">{address.fullName}</span>
                        {address.isDefault && (
                            <Badge variant="secondary" className="text-xs">
                                Default
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-2 pl-1">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <p className="text-sm leading-relaxed text-muted-foreground">
                        {address.line1}
                        {address.line2 && `, ${address.line2}`}
                        <br />
                        {address.city}, {address.state} {address.postalCode}
                        <br />
                        {address.country}
                    </p>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-2 pl-1">
                    <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{address.phone}</span>
                </div>
            </div>
        </button>
    );
}