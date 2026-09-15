import { useEffect, useState } from "react";
import AddressDialog from "./AddressDialog";
import { AddressList } from "./AddressList";
import useAddress from "./hooks/useAddress";
import type { ReadAddress } from "./types/readAddress";
import type { UpdateAddress } from "./types/updateAddress";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAddAddress, useDeleteAddress, useUpdateAddress } from "./hooks/useAddressMutation";
import { getUserFacingError } from "@/lib/getUserFacingError";
import { toast } from "@/components/ui/toast";
import { Spinner } from "@/components/ui/spinner";

export default function Addresses() {
    const { addresses, addressQueryStatus, addressQueryError } = useAddress();
    const addAddressMutation = useAddAddress();
    const updateAddressMutation = useUpdateAddress();
    const deleteAddressMutation = useDeleteAddress();

    const isSubmitting = addAddressMutation.status === 'pending' || updateAddressMutation.status === 'pending';

    const isLoading = addressQueryStatus === 'pending' || updateAddressMutation.status === 'pending' || deleteAddressMutation.status === 'pending';

    useEffect(() => {
        if (addressQueryStatus === 'error') {
            toast.add({
                type: 'error',
                description: getUserFacingError(addressQueryError)
            })
        }
    }
        , [addressQueryStatus, addressQueryStatus])

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
            updateAddressMutation.mutate(values, {
                onSuccess: () => toast.add(
                    {
                        type: 'success',
                        description: 'Address is updated.'
                    }),
                onError: (err) => toast.add(
                    {
                        type: 'error',
                        description: getUserFacingError(err.message)
                    })
            });

        }
        else {
            const { id, ...newAddress } = values;
            addAddressMutation.mutate(newAddress, {
                onSuccess: () => toast.add(
                    {
                        type: 'success',
                        description: 'Address is added.'
                    }),
                onError: (err) => toast.add(
                    {
                        type: 'error',
                        description: getUserFacingError(err.message)
                    })
            });
        }
    }

    function handleChangeDefaultAddress(id: number) {
        console.log("set default", id)
    }

    function handleDeleteAddress(id: number) {
        deleteAddressMutation.mutate(id, {
            onSuccess: () => toast.add(
                {
                    type: 'success',
                    description: 'Address is deleted.'
                }),
            onError: (err) => toast.add(
                {
                    type: 'error',
                    description: getUserFacingError(err.message)
                })
        });
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="mb-6 text-2xl font-semibold">My Addresses</h1>

            {isLoading && <Spinner />}

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
                isLoading={isLoading}
            />
        </div>
    )
}