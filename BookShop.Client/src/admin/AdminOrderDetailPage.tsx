import { useParams } from "react-router-dom";
import useAdminOrderDetail from "./hooks/useAdminOrderDetail";
import { getUserFacingError } from "@/lib/getUserFacingError";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import PaymentMethodBadge from "@/components/PaymentMethodBadge";
import PaymentStatusBadge from "@/components/PaymentStatusBadge";

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const orderQuery = useAdminOrderDetail(Number(id));
  const order = orderQuery.data;

  if (orderQuery.status === "pending") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <p className="text-sm text-muted-foreground">Loading order details…</p>
        </div>
      </div>
    );
  }

  if (orderQuery.status === "error") {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm font-medium text-destructive">
            {getUserFacingError(orderQuery.error)}
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <div className="rounded-lg border border-dashed p-10 text-center">
          <p className="text-muted-foreground">No record(s) found</p>
        </div>
      </div>
    );
  }

  const itemCount = order.orderItems.reduce((sum, oi) => sum + oi.quantity, 0);

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Orders
          </p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Order #{order.orderNumber}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Placed on {formatDateTime(order.orderDate)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <OrderStatusBadge status={order.orderStatus} />
          <PaymentStatusBadge status={order.pyamentStatus} />
        </div>
      </header>

      {/* Summary cards */}
      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Customer" value={order.customerEmail} />
        <SummaryCard
          label="Payment Method"
          value={<PaymentMethodBadge paymentMethod={order.pyamentMethod} />}
        />
        <SummaryCard label="Items" value={`${itemCount} item${itemCount === 1 ? "" : "s"}`} />
        <SummaryCard
          label="Order Total"
          value={
            <span className="text-lg font-semibold text-foreground">
              {formatCurrency(order.orderTotal)}
            </span>
          }
        />
      </section>

      {/* Items */}
      <section className="rounded-xl border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b px-4 py-3 sm:px-6">
          <h2 className="text-base font-semibold">Order Items</h2>
          <span className="text-xs text-muted-foreground">
            {order.orderItems.length} line item{order.orderItems.length === 1 ? "" : "s"}
          </span>
        </div>

        <ul className="divide-y">
          {order.orderItems.map((oi) => (
            <li
              key={oi.id}
              className="flex flex-col gap-3 p-4 transition-colors hover:bg-muted/40 sm:p-6"
            >
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-medium">{oi.bookTitle}</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    by {oi.authors.join(", ")}
                  </p>
                </div>
                <p className="shrink-0 text-base font-semibold">
                  {formatCurrency(oi.itemTotalPrice)}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {oi.genres.map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              <dl className="grid grid-cols-2 gap-3 border-t pt-3 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-xs text-muted-foreground">Unit Price</dt>
                  <dd className="font-medium">{formatCurrency(oi.unitPrice)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Quantity</dt>
                  <dd className="font-medium">{oi.quantity}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Line Total</dt>
                  <dd className="font-medium">{formatCurrency(oi.itemTotalPrice)}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>

        {/* Footer total */}
        <div className="flex items-center justify-between border-t bg-muted/30 px-4 py-4 sm:px-6">
          <span className="text-sm font-medium text-muted-foreground">Order Total</span>
          <span className="text-lg font-semibold">{formatCurrency(order.orderTotal)}</span>
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="mt-1.5 truncate text-sm font-medium">{value}</div>
    </div>
  );
}