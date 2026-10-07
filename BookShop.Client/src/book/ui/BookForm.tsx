import { Controller, useForm, useWatch } from "react-hook-form";
import type { UpdateBook } from "../types/updateBook";
import { type BookFormValues, bookSchema } from "../types/bookSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ReadAuthor } from "@/author/types/readAuthor";
import { Button } from "@/components/ui/button";
import type { ReadPublisher } from "@/publisher/types/readPublisher";
import type { ReadGenre } from "@/genres/types/readGenre";
import type { ISelectItem } from "@/shared/types/ISelectItem";
import { toFormValues } from "../toFormValues";
import CreatableCombobox from "@/components/CreatableCombobox";
import CreatableMultiCombobox from "@/components/CreatableMultiCombobox";
import { useEffect } from "react";

interface Props {
    defaultValues?: UpdateBook | null;
    onSubmit: (values: BookFormValues) => void;
    isSubmitting?: boolean;
    submitLabel?: string;
    publishers: ReadPublisher[],
    genres: ReadGenre[],
    authors: ReadAuthor[]
}

const emptyValues: BookFormValues = {
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
};

export default function BookForm({
    defaultValues = null,
    onSubmit,
    isSubmitting = false,
    submitLabel = "Save",
    publishers,
    genres,
    authors
}:Props) {
  const form = useForm<BookFormValues>({
    resolver:zodResolver(bookSchema),
    defaultValues: defaultValues ? toFormValues(defaultValues) : emptyValues
  });

  useEffect(() => {
  if (defaultValues) {
    form.reset(defaultValues ? toFormValues(defaultValues) : emptyValues);
  }
}, [defaultValues]);

  const newPublisherName = useWatch({ control: form.control, name: "newPublisherName" });
  const newGenreNames = useWatch({ control: form.control, name: "newGenreNames" });
  const newAuthorNames = useWatch({ control: form.control, name: "newAuthorNames" })

  const publisherItems = publishers.map(p => ({ label: p.name, value: p.id } as ISelectItem<number>));

  const genreItems = genres.map(g=>({label:g.name,value:g.id} as ISelectItem<number>));

  const authorItems = authors.map(a=>({label:a.name,value:a.id} as ISelectItem<number>));

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
                  <FieldLabel htmlFor="title">Title *</FieldLabel>
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
               name={field.name}
               ref={field.ref}
               onBlur={field.onBlur}
               value={field.value ?? ""}
               autoComplete="off"
               onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)}
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
               name={field.name}
               ref={field.ref}
               onBlur={field.onBlur}
               value={field.value ?? ""}
               onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)}
               autoComplete="off"
               id="stockQuantity"
               aria-invalid={fieldState.invalid}
               placeholder="eg. 25"
               type="number"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
             </Field>)}
            />

            <Controller
  name="publisherId"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field>
      <FieldLabel htmlFor="publisherId">Publisher *</FieldLabel>
      <CreatableCombobox
        id="publisherId"
        items={publisherItems}
        selectedId={field.value}
        newName={newPublisherName ?? null}
        onChange={(id, name) => {
          field.onChange(id);
          form.setValue("newPublisherName", name, { shouldDirty: true });
          form.trigger("publisherId");
        }}
        placeHolder="Select or type a new publisher"
        invalid={fieldState.invalid}
        onBlur={field.onBlur}
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>

<Controller
  name="genreIds"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field>
      <FieldLabel htmlFor="genreIds">Genres *</FieldLabel>
      <CreatableMultiCombobox
        id="genreIds"
        items={genreItems}
        selectedIds={field.value}
        newNames={newGenreNames ?? []}
        onChange={(ids, names) => {
          field.onChange(ids);
          form.setValue("newGenreNames", names, { shouldDirty: true });
          form.trigger("genreIds")
        }}
        placeHolder="Select or type a new genre"
        className=""
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>

<Controller
  name="authorIds"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field>
      <FieldLabel htmlFor="authorIds">Authors *</FieldLabel>
      <CreatableMultiCombobox
        id="authorIds"
        items={authorItems}
        selectedIds={field.value}
        newNames={newAuthorNames ?? []}
        onChange={(ids, names) => {
          field.onChange(ids);
          form.setValue("newAuthorNames", names, { shouldDirty: true });
          form.trigger("authorIds");
        }}
        placeHolder="Select or type a new author"
        className=""
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
          </FieldGroup>

          <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset(emptyValues)}
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
  )
}
