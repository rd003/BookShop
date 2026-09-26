import z from "zod";

export const authorSchema = z.object({
    id: z.number().optional(),
    name: z.string()
        .min(2, "Author name is required")
        .max(100, "Author name can not exceed 100 characters."),
    bio: z.string()
        .max(200, "Bio can not exceed 200 characters.")
        .optional(),
});

export type AuthorFormValues = z.infer<typeof authorSchema>;