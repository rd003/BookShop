import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { AddressForm } from "./AddressForm";
import type { UpdateAddress } from "./types/updateAddress";
import { Spinner } from "@/components/ui/spinner";

interface AddressDialogProps {
    title: string;
    isSubmitting: boolean;
    submitLabel: string;
    dialogButtonTitle?: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    defaultValues?: UpdateAddress | null;
    onSubmit: (values: UpdateAddress) => void,
    isLoading: boolean,
}

export default function AddressDialog({
    title = "Add new address",
    isSubmitting = false,
    submitLabel = "Add",
    dialogButtonTitle,
    open,
    onOpenChange,
    defaultValues = null,
    onSubmit,
    isLoading = false
}: AddressDialogProps) {
    return (<Dialog open={open} onOpenChange={onOpenChange}>
        {dialogButtonTitle && (
            <DialogTrigger render={<Button variant="outline" />}>
                {dialogButtonTitle}
            </DialogTrigger>
        )}
        <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            <div className="-mx-6 flex-1 overflow-y-auto px-6">
                <AddressForm
                    defaultValues={defaultValues}
                    onSubmit={onSubmit}
                    isSubmitting={isSubmitting}
                    submitLabel={submitLabel}
                />
                {/* {error && <p className="text-red-500">{error}</p>}

                {successMessage && <p className="text-green-500">{successMessage}</p>} */}
                {isLoading && <Spinner />}

            </div>
        </DialogContent>
    </Dialog >);
}