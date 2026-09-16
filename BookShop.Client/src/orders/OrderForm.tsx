import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Plus, Loader2 } from "lucide-react";
import { useEffect, useMemo } from "react";

import { createOrderSchema, type OrderFormValues } from "./types/createOrderSchema";

import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { ReadAddress } from "@/addresses/types/readAddress";
import { AddressCard } from "./AddressCard";

interface OrderFormProps {
    addresses?: ReadAddress[];
    isLoading?: boolean;
    onSubmit?: (data: OrderFormValues) => void | Promise<void>;
    onAddNewAddress?: () => void;
    isSubmitting?: boolean;
}

export default function OrderForm({
    addresses = [],
    isLoading = false,
    onSubmit,
    onAddNewAddress,
    isSubmitting = false,
}: OrderFormProps) {
    const form = useForm<OrderFormValues>({
        resolver: zodResolver(createOrderSchema),
        defaultValues: {
            shippingAddressId: 0,
        },
    });

    // Preselect default address (or first one)
    const defaultAddressId = useMemo(() => {
        if (addresses.length === 0) return 0;
        const defaultAddr = addresses.find((a) => a.isDefault);
        return defaultAddr?.id ?? addresses[0].id;
    }, [addresses]);

    useEffect(() => {
        if (defaultAddressId) {
            form.setValue("shippingAddressId", defaultAddressId, {
                shouldValidate: true,
            });
        }
    }, [defaultAddressId, form]);

    async function onSubmitData(data: OrderFormValues) {
        await onSubmit?.(data);
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-6 w-40" />
                <div className="space-y-3">
                    <Skeleton className="h-40 w-full rounded-xl" />
                    <Skeleton className="h-40 w-full rounded-xl" />
                </div>
            </div>
        );
    }

    // Empty state
    if (addresses.length === 0) {
        return (
            <Alert>
                <MapPin className="h-4 w-4" />
                <AlertTitle>No shipping address found</AlertTitle>
                <AlertDescription className="mt-2 space-y-3">
                    <p>Please add a shipping address to continue with your order.</p>
                    {onAddNewAddress && (
                        <Button type="button" size="sm" onClick={onAddNewAddress}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Address
                        </Button>
                    )}
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmitData)} className="space-y-6">
            <FieldGroup>
                <Controller
                    name="shippingAddressId"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <FieldLabel className="text-base font-semibold">
                                        Shipping Address
                                    </FieldLabel>
                                    <p className="text-sm text-muted-foreground">
                                        Select where you'd like your order delivered
                                    </p>
                                </div>
                                {onAddNewAddress && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={onAddNewAddress}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add New
                                    </Button>
                                )}
                            </div>

                            <div
                                role="radiogroup"
                                aria-label="Shipping address"
                                className="grid gap-3"
                            >
                                {addresses.map((address) => (
                                    <AddressCard
                                        key={address.id}
                                        address={address}
                                        selected={field.value === address.id}
                                        onSelect={(id) =>
                                            field.onChange(id)
                                        }
                                    />
                                ))}
                            </div>

                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
            </FieldGroup>

            <Separator />

            <div className="flex justify-end">
                <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting || !form.formState.isValid}
                    className="min-w-40"
                >
                    {isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Place Order
                </Button>
            </div>
        </form>
    );
}