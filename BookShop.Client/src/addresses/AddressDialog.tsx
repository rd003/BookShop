import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { AddressForm } from "./AddressForm";
import type { UpdateAddress } from "./types/updateAddress";

interface AddressDialogProps {
    title: string;
    isSubmitting: boolean;
    submitLabel: string;
    dialogButtonTitle?: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    defaultValues?: UpdateAddress | null;
    onSubmit: (values: UpdateAddress) => void
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
            </div>
        </DialogContent>
    </Dialog >);
}