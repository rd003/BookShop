import { useState } from "react";
import AddressDialog from "./AddressDialog";
import { AddressList } from "./AddressList";
import useAddress from "./hooks/useAddress";
import type { ReadAddress } from "./types/readAddress";
import type { UpdateAddress } from "./types/updateAddress";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Addresses() {
    const { addresses, addressQueryStatus, addressQueryError } = useAddress();
    const isSubmitting = false;

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<ReadAddress | null>(null);

    function handleAddAddress() {
        setEditing(null);
        setDialogOpen(true);
    }

    function handleEditAddress(address: ReadAddress) {
        setEditing(address);
        setDialogOpen(true);
    }

    function handleSubmit(values: UpdateAddress) {
        if (editing) {
            console.log("update", values);
        }
        else {
            console.log("add", values);
        }
    }

    function handleDeleteAddress(id: number) {
        console.log("delete", id);
    }

    function handleChangeDefaultAddress(id: number) {
        console.log("set default", id)
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="mb-6 text-2xl font-semibold">My Addresses</h1>

            {addressQueryStatus === 'pending' && <p>Loading...</p>}

            {addressQueryStatus === 'error' && <p>{addressQueryError?.message ?? 'Error on loading addresses!'}</p>}

            <div className="mb-1.5">
                <Button variant="outline" onClick={handleAddAddress}>Add <Plus /> </Button>
            </div>

            <AddressList
                addresses={addresses}
                onEdit={handleEditAddress}
                onDelete={handleDeleteAddress}
                onSetDefault={handleChangeDefaultAddress}
            />

            <AddressDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                title={editing ? "Edit address" : "Add new address"}
                isSubmitting={isSubmitting}
                submitLabel={editing ? "Save" : "Add"}
                defaultValues={editing}
                onSubmit={handleSubmit}
            />
        </div>
    )
}