import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner";
import type { UpdateAuthor } from "../types/updateAuthor";
import AuthorForm from "./AuthorForm";

interface Props {
    title: string;
    submitting: boolean;
    submitLabel: string;
    dialogButtonTitle?: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    defaultValues: UpdateAuthor | null;
    onSubmit: (values: UpdateAuthor) => void,
    isLoading: boolean,
}

export default function AuthorDialog({
    title = "Add new author",
    submitting = false,
    submitLabel = "Add",
    dialogButtonTitle,
    open,
    onOpenChange,
    defaultValues = null,
    onSubmit,
    isLoading = false
}: Props) {
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
                <AuthorForm
                    defaultValues={defaultValues}
                    onSubmit={onSubmit}
                    submitting={submitting}
                    submitLabel={submitLabel}
                />

                {isLoading && <Spinner />}
            </div>
        </DialogContent>
    </Dialog >);
}