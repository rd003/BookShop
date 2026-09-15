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
import { ConfirmDialog } from "@/components/ConfirmDialog";

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
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
    const [editing, setEditing] = useState<ReadAddress | null>(null);

    function handleAddAddress() {
        setEditing(null);
        setDialogOpen(true);
    }

    function handleEditAddress(address: ReadAddress) {
        setEditing(address);
        setDialogOpen(true);
    }

    // This method is going to be used by handleSubmit and handleChangeDefaultAddress
    function updateAddressMutate(values: UpdateAddress) {
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
    function handleSubmit(values: UpdateAddress) {
        if (editing) {
            updateAddressMutate(values);
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

    function handleChangeDefaultAddress(readAddress: ReadAddress) {
        const updateAddress: UpdateAddress = { ...readAddress, isDefault: !readAddress.isDefault };
        updateAddressMutate(updateAddress);
    }

    function handleDeleteAddress(id: number) {
        setDeleteTargetId(id);
    }

    function confirmDeleteAddress() {
        if (deleteTargetId === null) return;
        deleteAddressMutation.mutate(deleteTargetId, {
            onSuccess: () => {
                toast.add({ type: 'success', description: 'Address is deleted.' });
                setDeleteTargetId(null); // close dialog on success
            },
            onError: (err) => toast.add({ type: 'error', description: getUserFacingError(err) })
            // dialog stays open on error, so user can retry or cancel
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

            <ConfirmDialog
                open={deleteTargetId !== null}
                onOpenChange={(open) => !open && setDeleteTargetId(null)}
                title="Delete this address?"
                description="This action cannot be undone."
                isConfirming={deleteAddressMutation.status === 'pending'}
                onConfirm={confirmDeleteAddress}
            />
        </div>
    )
}