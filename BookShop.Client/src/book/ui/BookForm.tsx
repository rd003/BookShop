import { Controller, useForm } from "react-hook-form";
import type { UpdateBook } from "../types/updateBook";
import { type BookFormValues, bookSchema } from "../types/bookSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import type { ReadAuthor } from "@/author/types/readAuthor";
import { Button } from "@/components/ui/button";

interface Props {
    defaultValues?: UpdateBook | null;
    onSubmit: (values: BookFormValues) => void;
    isSubmitting?: boolean;
    submitLabel?: string;
    authors: ReadAuthor[]
}

const toFormValues = (book: UpdateBook): BookFormValues => ({
  id: book.id,
  title: book.title ?? "",
  description: book.description ?? "",
  coverImageUrl: book.coverImageUrl ?? "",
  isbn: book.isbn ?? "",
  price: book.price ?? 0,
  stockQuantity: book.stockQuantity ?? 0,
  publisherId: book.publisherId ?? 0,
  newPublisherName: book.newPublisherName ?? "",
  genreIds: book.genreIds ?? [],
  newGenreNames: book.newGenreNames ?? [],
  authorIds: book.authorIds ?? [],
  newAuthorNames: book.newAuthorNames ?? [],
});

export default function BookForm({
  defaultValues = null,
    onSubmit,
    isSubmitting = false,
    submitLabel = "Save",
    authors,
}:Props) {
  const form = useForm<BookFormValues>({
    resolver:zodResolver(bookSchema),
    defaultValues: defaultValues ? toFormValues(defaultValues) : {
      id: 0,
      title: "",
      description: "",
      coverImageUrl: "",
      isbn: "",
      price: 0,
      stockQuantity: 0,
      publisherId: 0,
      newPublisherName: "",
      genreIds: [],
      newGenreNames: [],
      authorIds: [],
      newAuthorNames: [],
    },
  });
  return (
    <form
            onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
               name="id"
               control={form.control}
               render={({field})=>(<Input
                {...field}
                id="id"
                type="hidden"
               />)}
              />

               <Controller
               name="title"
               control={form.control}
               render={
                ({field,fieldState})=>(
                  <Field>
                  <FieldLabel>Title *</FieldLabel>
                  <Input
                  {...field}
                  id="title"
                  aria-invalid={fieldState.invalid}
                  placeholder="Clean Code"
                  autoComplete="off"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                </Field>
                )
              }
               />

               <Controller
               name="title"
               control={form.control}
               render={
                ({field,fieldState})=>(
                  <Field>
                  <FieldLabel htmlFor="isbn">Title *</FieldLabel>
                  <Input
                  {...field}
                  id="title"
                  aria-invalid={fieldState.invalid}
                  placeholder="Clean Code"
                  autoComplete="off"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                </Field>
                )
              }
               />

            <Controller
             name="isbn"
             control={form.control}
             render={({field,fieldState})=>(<Field>
              <FieldLabel htmlFor="isbn">Isbn *</FieldLabel>
              <Input
               {...field}
               autoComplete="off"
               id="isbn"
               aria-invalid={fieldState.invalid}
               placeholder="ABCX2354XX"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
             </Field>)}
            />

            <Controller
            name="description"
            control={form.control}
            render={({field})=>(<Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
              aria-multiline="true"
              id="description"
              {...field}
              placeholder="eg. Something about this boook"
              />
            </Field>)}
            />
          <Controller
             name="price"
             control={form.control}
             render={({field,fieldState})=>(<Field>
              <FieldLabel htmlFor="price">Price *</FieldLabel>
              <Input
               type="number"
               {...field}
               autoComplete="off"
               id="price"
               aria-invalid={fieldState.invalid}
               placeholder="eg. 130"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
             </Field>)}
            />

            <Controller
             name="stockQuantity"
             control={form.control}
             render={({field,fieldState})=>(<Field>
              <FieldLabel htmlFor="stockQuantity">Stock *</FieldLabel>
              <Input
               {...field}
               autoComplete="off"
               id="stockQuantity"
               aria-invalid={fieldState.invalid}
               placeholder="eg. 25"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
             </Field>)}
            />

            <Controller
             name="publisherId"
             control={form.control}
             render={({field,fieldState})=>(<Field>
              <FieldLabel htmlFor="stockQuantity">Publisher</FieldLabel>
              <Select
               {...field}
               autoComplete="off"
               id="publisherId"
               aria-invalid={fieldState.invalid}
              >
                <option value="">Select or enter the publisher</option>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
             </Field>)}
            />

           <Controller
             name="newPublisherName"
             control={form.control}
             render={({field,fieldState})=>(<Field>
              <FieldLabel htmlFor="newPublisherName">Enter publisher if not on list</FieldLabel>
              <Combobox
               id="newPublisherName"
               {...field}
               aria-invalid={fieldState.invalid}
               items={authors} >
                  <ComboboxInput placeholder="Select the author" />
                  <ComboboxContent>
                    <ComboboxEmpty>No items found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item:ReadAuthor) => (
                        <ComboboxItem key={item.id} value={item.name}>
                          {item.name}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
              </Combobox>

              {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
             </Field>)}
            />
          </FieldGroup>

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
    </form>
  )
}
