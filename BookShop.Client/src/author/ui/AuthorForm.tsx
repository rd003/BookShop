import { cn } from "cn";
import type { UpdateAuthor } from "../types/updateAuthor";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authorSchema, type AuthorFormValues } from "../types/AuthorSchema";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Props {
    className?: string;
    defaultValues: UpdateAuthor | null,
    onSubmit: (author: UpdateAuthor) => void,
    submitting: boolean,
    submitLabel: string
}
export default function AuthorForm({
    className,
    defaultValues,
    onSubmit,
    submitting = false,
    submitLabel = "Add"
}: Props
) {
    const form = useForm<AuthorFormValues>({
        resolver: zodResolver(authorSchema),
        defaultValues: defaultValues ?? {
            id: 0,
            name: undefined,
            bio: undefined
        }
    });

    function onFormSubmit(data: AuthorFormValues) {
        onSubmit(data as UpdateAuthor);
    }

    return (<form className={cn("rounded-lg border border-gray-200 bg-white p-6 shadow-sm", className)} onSubmit={form.handleSubmit(onFormSubmit)}>
        <FieldGroup >
            <Controller
                name="id"
                control={form.control}
                render={({ field }) => (
                    <Field>
                        <Input {...field} id="id" type="hidden" />
                    </Field>
                )}
            />

            <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel
                            htmlFor="name"
                        >Name</FieldLabel>
                        <Input {...field} id="name" aria-invalid={fieldState.invalid} type="text" />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            <Controller
                name="bio"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel htmlFor="bio">Bio</FieldLabel>
                        <Textarea {...field} aria-invalid={fieldState.invalid} id="bio" />

                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />
        </FieldGroup>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={() => form.reset()} disabled={submitting}>Clear</Button>

            <Button
                variant="default"
                type="submit"
                disabled={submitting}
            >
                {submitting ? 'Saving...' : submitLabel}
            </Button>
        </div>
    </form>)
}