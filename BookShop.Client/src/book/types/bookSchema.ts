import z, { array  } from "zod"

export const bookSchema = z.object({
  id: z.number().optional(),
  title: z
    .string()
    .min(2, "Title is required")
    .max(200, "Full name can not exceed 200 characters."),
  description: z
  .string()
  .max(500,"Description can not exceed 500 characters.")
  .optional(),
  isbn: z
  .string()
  .min(2,"ISBN is required.")
  .max(20, "ISBN can not exceed 20 characters"),
  price: z
  .number()
  .nonnegative()
  .nonoptional(), // TODO: is nooptional make it required and what about non negetive number
  stockQuantity: z
  .number()
  .min(1,"Stock can not be less than 1")
  .nonnegative("Stock can not be negetive")
  .nonoptional("Stock is required"),
  coverImageUrl: z.
  string()
  .optional(),
  publisherId: z
  .number()
  .nonnegative("Publisher can not be negetive")
  .nonoptional("Publisher is required"),
  newPublisherName: z
  .string()
  .max(200,"New publisher can not exceed")
  .optional(),
  existingGenreIds:
  array, // how to define array of string
  newGenreNames: z
  .string()
  .max(200,"New genre can not exceed 200 characters")
  .,
  existingAuthorIds: ,
  newAuthorNames: ,
  })

export type BookFormValues = z.infer<typeof bookSchema>
