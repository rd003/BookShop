export const formatCurrency = (amount: number, currency = "USD") =>
    new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);

export const formatDate = (date: string) =>
    new Intl.DateTimeFormat("en-US", {
        dateStyle: "long",
        timeStyle: "short",
    }).format(new Date(date));