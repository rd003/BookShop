import { Link, useLocation, useParams } from "react-router-dom";
import useBook from "../hooks/useBook";
import { getUserFacingError } from "@/lib/getUserFacingError";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  Hash,
  ImageOff,
  Package,
  Tag,
  Users,
} from "lucide-react";

export default function BookDetail() {
  const { id } = useParams();
  const { data: book, isLoading, error } = useBook(Number(id));
  const location = useLocation();
  const from = (location?.state as { from?: string } | null)?.from;
  const backUrl = from ? from : "/admin/books";

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Loading book details…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {getUserFacingError(error)}
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="p-6">
        <div className="rounded-lg border bg-muted/30 p-6 text-center">
          <p className="text-muted-foreground">No book found.</p>
          <Button
            nativeButton={false}
            variant="outline"
            className="mt-4"
            render={<Link to={backUrl} />}
          >
            <ArrowLeft className="size-4" /> Back to books
          </Button>
        </div>
      </div>
    );
  }

  const inStock = book.stockQuantity > 0;

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            nativeButton={false}
            variant="outline"
            size="icon"
            render={<Link to={backUrl} />}
            aria-label="Back"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {book.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              Book ID #{book.id}
            </p>
          </div>
        </div>

        <Badge variant={inStock ? "default" : "destructive"}>
          {inStock ? `In stock · ${book.stockQuantity}` : "Out of stock"}
        </Badge>
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[260px_1fr]">
        {/* Cover image */}
        <div className="space-y-3">
          <div className="overflow-hidden rounded-lg border bg-muted">
            {book.coverImageUrl ? (
              <img
                src={book.coverImageUrl}
                alt={book.title}
                className="aspect-[3/4] w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[3/4] w-full items-center justify-center text-muted-foreground">
                <ImageOff className="size-8" />
              </div>
            )}
          </div>

          <div className="rounded-lg border bg-card p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Price
            </p>
            <p className="mt-1 text-2xl font-semibold">
              {formatCurrency(book.price)}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          {/* Meta grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoItem icon={<Hash className="size-4" />} label="ISBN">
              {book.isbn}
            </InfoItem>
            <InfoItem icon={<Building2 className="size-4" />} label="Publisher">
              {book.publisherName || "—"}
            </InfoItem>
            <InfoItem icon={<Package className="size-4" />} label="Stock">
              {book.stockQuantity}
            </InfoItem>
            <InfoItem icon={<BookOpen className="size-4" />} label="Genres">
              {book.genres.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {book.genres.map((g) => (
                    <Badge key={g.id ?? g.name} variant="secondary">
                      {g.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                "—"
              )}
            </InfoItem>
          </div>

          {/* Authors */}
          <Section icon={<Users className="size-4" />} title="Authors">
            {book.authors.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {book.authors.map((a) => (
                  <Badge key={a.id ?? a.name} variant="outline">
                    {a.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No authors listed.</p>
            )}
          </Section>

          {/* Description */}
          <Section icon={<Tag className="size-4" />} title="Description">
            {book.description ? (
              <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                {book.description}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                No description provided.
              </p>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
}

/* ---------- Small presentational helpers ---------- */

function InfoItem({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <div className="mt-2 text-sm font-medium">{children}</div>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
        {icon}
        <span>{title}</span>
      </div>
      {children}
    </div>
  );
}