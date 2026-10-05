import { z } from "zod"

export const bookSchema = z
  .object({
    id: z.number().optional(),

    title: z
      .string()
      .min(2, "Title is required")
      .max(200, "Title can not exceed 200 characters."), // CHANGED: message said "Full name"

    description: z
      .string()
      .max(500, "Description can not exceed 500 characters.")
      .optional(),

    isbn: z
      .string()
      .min(2, "ISBN is required.")
      .max(20, "ISBN can not exceed 20 characters"),

    price: z
      .number("Price is required")
      .nonnegative("Price can not be negative"),

    stockQuantity: z
      .number("Stock is required")
      .int("Stock must be a whole number")
      .nonnegative("Stock can not be negative"),

    coverImageUrl: z
      .union([z.url("Enter a valid URL"), z.literal("")])
      .optional(),

    publisherId: z
      .number("Publisher is required")
      .int()
      .nonnegative("Publisher can not be negative"),

    newPublisherName: z
      .string()
      .max(200, "New publisher can not exceed 200 characters.")
      .optional(),

    genreIds: z.array(z.number().int().positive()),

    newGenreNames: z.array(
      z.string().trim().min(1, "Name can not be empty").max(100)
    ),

    authorIds: z.array(z.number().int().positive()),
    newAuthorNames: z.array(
      z.string().trim().min(1, "Name can not be empty").max(100)
    ),
  })

  .refine(
    (data) =>
      data.publisherId > 0 || (data.newPublisherName?.trim().length ?? 0) > 0,
    {
      message: "Select a publisher or enter a new publisher name",
      path: ["publisherId"],
    }
  )

export type BookFormValues = z.infer<typeof bookSchema>
