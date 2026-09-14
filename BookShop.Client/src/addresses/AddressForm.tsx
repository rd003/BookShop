import type { UpdateAddress } from "./types/updateAddress";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { addressSchema, type AddressFormValues } from "./types/addressSchema";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface AddressFormProps {
    defaultValues?: UpdateAddress | null;
    onSubmit: (values: UpdateAddress) => void;
    isSubmitting?: boolean;
    submitLabel?: string;
}

export function AddressForm({
    defaultValues = null,
    onSubmit,
    isSubmitting = false,
    submitLabel = "Save",
}: AddressFormProps) {
    const form = useForm<AddressFormValues>({
        resolver: zodResolver(addressSchema),
        defaultValues: defaultValues ?? {
            id: 0,
            fullName: "",
            phone: "",
            line1: "",
            line2: "",
            city: "",
            state: "",
            postalCode: "",
            country: "",
            isDefault: false,
        },
    });

    function onFormSubmit(data: AddressFormValues) {
        console.log(data);
    }

    return (
        <form
            onSubmit={form.handleSubmit(onFormSubmit)}
            className="mx-auto w-full max-w-2xl space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8"
        >
            <div className="space-y-1">
                <h2 className="text-xl font-semibold tracking-tight">
                    Address Information
                </h2>
                <p className="text-sm text-muted-foreground">
                    Please enter your shipping address details below.
                </p>
            </div>

            <FieldGroup className="space-y-5">
                <Controller
                    name="id"
                    control={form.control}
                    render={({ field }) => (
                        <Field>
                            <Input {...field} id="id" type="hidden" />
                        </Field>
                    )}
                />

                {/* Full Name & Phone */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Controller
                        name="fullName"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                                <Input
                                    {...field}
                                    id="fullName"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="John Doe"
                                    autoComplete="name"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="phone"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                                <Input
                                    {...field}
                                    id="phone"
                                    type="tel"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="+1 555 000 0000"
                                    autoComplete="tel"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </div>

                {/* Address Line 1 */}
                <Controller
                    name="line1"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel htmlFor="line1">Address Line 1</FieldLabel>
                            <Input
                                {...field}
                                id="line1"
                                aria-invalid={fieldState.invalid}
                                placeholder="123 Main Street"
                                autoComplete="address-line1"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                {/* Address Line 2 */}
                <Controller
                    name="line2"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel htmlFor="line2">
                                Address Line 2{" "}
                                <span className="text-muted-foreground">(optional)</span>
                            </FieldLabel>
                            <Input
                                {...field}
                                value={field.value ?? ""}
                                id="line2"
                                aria-invalid={fieldState.invalid}
                                placeholder="Apartment, suite, unit, etc."
                                autoComplete="address-line2"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                {/* City, State, Postal */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <Controller
                        name="city"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel htmlFor="city">City</FieldLabel>
                                <Input
                                    {...field}
                                    id="city"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="New York"
                                    autoComplete="address-level2"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="state"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel htmlFor="state">State</FieldLabel>
                                <Input
                                    {...field}
                                    id="state"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="NY"
                                    autoComplete="address-level1"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="postalCode"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel htmlFor="postalCode">Postal Code</FieldLabel>
                                <Input
                                    {...field}
                                    id="postalCode"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="10001"
                                    autoComplete="postal-code"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </div>

                {/* Country */}
                <Controller
                    name="country"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel htmlFor="country">Country</FieldLabel>
                            <Input
                                {...field}
                                id="country"
                                aria-invalid={fieldState.invalid}
                                placeholder="United States"
                                autoComplete="country-name"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                {/* isDefault */}
                <Controller
                    name="isDefault"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4">
                                <Checkbox
                                    id="isDefault"
                                    checked={field.value}
                                    onCheckedChange={(checked) =>
                                        field.onChange(checked === true)
                                    }
                                />
                                <div className="space-y-0.5">
                                    <FieldLabel
                                        htmlFor="isDefault"
                                        className="cursor-pointer font-medium"
                                    >
                                        Set as default address
                                    </FieldLabel>
                                    <p className="text-xs text-muted-foreground">
                                        Use this address by default at checkout.
                                    </p>
                                </div>
                            </div>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
            </FieldGroup>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                    disabled={isSubmitting}
                    className="sm:w-auto"
                >
                    Clear
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="sm:w-auto"
                >
                    {isSubmitting ? "Saving..." : submitLabel}
                </Button>
            </div>
        </form>
    );
}