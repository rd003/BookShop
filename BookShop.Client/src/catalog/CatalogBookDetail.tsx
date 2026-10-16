import useBook from "@/book/hooks/useBook";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useParams } from "react-router-dom";
import { useAddCartItem } from "./hooks/useCartMutation";
import { formatCurrency } from "@/lib/format";
import { toast } from "@/components/ui/toast";
import type { AddCartItemRequest } from "@/cart/types/addCartItemRequest";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  ShoppingCart,
  Package,
  Building2,
  Tag,
  Users,
  Loader2,
} from "lucide-react";

export default function CatalogBookDetail() {
  const { id } = useParams();
  const location = useLocation();
  const from = (location?.state as { from?: string } | null)?.from;
  const backUrl = from ? from : "/catalog";

  const bookQuery = useBook(Number(id));
  const addCartMutation = useAddCartItem();

  const book = bookQuery.data;
  const disableCartButton =
    addCartMutation.status === "pending" || !book?.stockQuantity;

  function handleAddToCart(bookId: number | undefined) {
    if (!bookId) return;

    const cartItemReq: AddCartItemRequest = {
      bookId,
      quantity: 1,
    };
    addCartMutation.mutate(cartItemReq);
    toast.add({
      title: "Added to cart",
      type: "success",
    });
  }

  if (bookQuery.isLoading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Skeleton className="mb-6 h-9 w-32" />
        <div className="grid gap-8 md:grid-cols-[320px_1fr]">
          <Skeleton className="aspect-300/440 w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </div>
    );
  }

  if (bookQuery.isError || !book) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold">Book not found</h2>
        <p className="mt-2 text-muted-foreground">
          The book you're looking for doesn't exist or was removed.
        </p>
        <Button
          className="mt-6"
          variant="outline"
          nativeButton={false}
          render={<Link to={backUrl} />}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to catalog
        </Button>
      </div>
    );
  }

  const inStock = (book.stockQuantity ?? 0) > 0;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <Button
        className="mb-6"
        variant="ghost"
        size="sm"
        nativeButton={false}
        render={<Link to={backUrl} />}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid gap-10 md:grid-cols-[320px_1fr] lg:gap-14">
        {/* Cover Image */}
        <div className="mx-auto w-full max-w-[320px] md:mx-0">
          <div className="overflow-hidden rounded-xl border bg-muted shadow-sm">
            <img
              src={book.coverImageUrl || "https://placehold.co/300x440?text=Book"}
              alt={book.title}
              className="aspect-300/440 w-full object-cover"
            />
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                {book.title}
              </h1>
              {book.authors.length > 0 && (
                <p className="mt-2 text-lg text-muted-foreground">
                  by {book.authors.map((a) => a.name).join(", ")}
                </p>
              )}
            </div>
            <Badge variant={inStock ? "default" : "destructive"}>
              {inStock ? `${book.stockQuantity} in stock` : "Out of stock"}
            </Badge>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-3xl font-semibold">
              {formatCurrency(book.price!)}
            </span>
            {book.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {book.genres.map((g) => (
                  <Badge key={g.name} variant="secondary">
                    {g.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator className="my-6" />

          {/* Description */}
          {book.description && (
            <div className="mb-6">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Description
              </h2>
              <p className="leading-relaxed text-foreground/90">
                {book.description}
              </p>
            </div>
          )}

          {/* Meta info */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            <MetaRow
              icon={<Building2 className="h-4 w-4" />}
              label="Publisher"
              value={book.publisherName}
            />
            <MetaRow
              icon={<Tag className="h-4 w-4" />}
              label="ISBN"
              value={book.isbn}
            />
            <MetaRow
              icon={<Users className="h-4 w-4" />}
              label="Authors"
              value={book.authors.map((a) => a.name).join(", ")}
            />
            <MetaRow
              icon={<Package className="h-4 w-4" />}
              label="Stock"
              value={String(book.stockQuantity ?? 0)}
            />
          </div>

          {/* CTA */}
          <div className="mt-auto flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              disabled={disableCartButton}
              onClick={() => handleAddToCart(book.id)}
            >
              {addCartMutation.status === "pending" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ShoppingCart className="mr-2 h-4 w-4" />
              )}
              {inStock ? "Add to cart" : "Out of stock"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border bg-card p-3">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="truncate text-sm font-medium">{value || "—"}</p>
      </div>
    </div>
  );
}