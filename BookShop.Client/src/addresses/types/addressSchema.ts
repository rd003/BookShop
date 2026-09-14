import z from "zod";

export const addressSchema = z.object({
    id: z.number().optional(),
    fullName: z.string()
        .min(2, "Full name is required")
        .max(200, "Full name can not exceed 200 characters."),
    phone: z.string()
        .min(5, "Phone is required")
        .max(20, "Phone can not exceed 20 characters."),
    line1: z.string()
        .min(3, "Address line 1 is required")
        .max(200, "Address line1 can not exceed 200 characters."),
    line2: z.string()
        .max(200, "Address line 2 can not exceed 200 characters.")
        .optional().nullable(),
    city: z.string()
        .min(1, "City is required")
        .max(100, "City can not exceed 100 characters."),
    state: z.string()
        .min(1, "State is required")
        .max(100, "State can not exceed 100 characters."),
    postalCode: z.string()
        .min(1, "Postal code is required")
        .max(20, "Postal code can not exceed 20 characters."),
    country: z.string()
        .min(1, "Country is required")
        .max(100, "Country can not exceed 100 characters."),
    isDefault: z.boolean(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;