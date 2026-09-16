import z from "zod";

export const createOrderSchema = z.object({
    shippingAddressId: z.number().min(1, "Shipping Address is required")
});

export type OrderFormValues = z.infer<typeof createOrderSchema>;