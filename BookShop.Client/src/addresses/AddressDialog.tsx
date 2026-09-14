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

interface AddressDialogProps {
    title: string;
    isSubmitting: boolean;
    submitLabel: string;
    dialogButtonTitle: string
}

export default function AddressDialog({ title = "Add new address", isSubmitting = false, submitLabel = "Add", dialogButtonTitle = "Add +" }: AddressDialogProps) {
    return (<Dialog>
        <DialogTrigger render={<Button variant="outline" />}>{dialogButtonTitle}</DialogTrigger>
        <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            <div className="-mx-6 flex-1 overflow-y-auto px-6">
                <AddressForm
                    onSubmit={(val) => console.log(val)}
                    isSubmitting={isSubmitting}
                    submitLabel={submitLabel}
                />
            </div>
            <DialogFooter className="sm:justify-start">
                <DialogClose render={<Button type="button">Close</Button>} />
            </DialogFooter>
        </DialogContent>
    </Dialog >);
}