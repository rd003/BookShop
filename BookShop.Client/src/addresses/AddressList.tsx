import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReadAddress } from "./types/readAddress";
import AddressCard from "./AddressCard";

interface AddressListProps {
    addresses: ReadAddress[];
    onEdit?: (address: ReadAddress) => void;
    onDelete?: (id: number) => void;
    onSetDefault?: (id: number) => void;
    className?: string;
}

export function AddressList({
    addresses,
    onEdit,
    onDelete,
    onSetDefault,
    className,
}: AddressListProps) {
    if (!addresses.length) {
        return (
            <div
                className={cn(
                    "flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center",
                    className
                )}
            >
                <MapPin className="text-muted-foreground mb-3 h-10 w-10" />
                <p className="text-muted-foreground text-sm">No addresses found.</p>
            </div>
        );
    }

    return (
        <div
            className={cn(
                "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
                className
            )}
        >
            {addresses.map((address) => (
                <AddressCard
                    key={address.id}
                    address={address}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onSetDefault={onSetDefault}
                />
            ))}
        </div>
    );
}

