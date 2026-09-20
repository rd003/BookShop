import { Separator } from "@/components/ui/separator";
import { XCircle, CheckCircle2, CircleDashed } from "lucide-react";

const FLOW = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];

export default function OrderTimeline({ status }: { status: string }) {
    if (status === "CANCELLED") {
        return (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                <XCircle className="h-5 w-5" /> This order was cancelled.
            </div>
        );
    }

    const currentIdx = Math.max(FLOW.indexOf(status), 0);

    return (
        <ol className="flex items-center">
            {FLOW.map((step, i) => {
                const done = i < currentIdx;
                const active = i === currentIdx;
                return (
                    <li key={step} className="flex flex-1 items-center last:flex-none">
                        <div className="flex flex-col items-center gap-1.5">
                            <span
                                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors ${done
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : active
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-muted bg-muted text-muted-foreground"
                                    }`}
                            >
                                {done ? (
                                    <CheckCircle2 className="h-5 w-5" />
                                ) : (
                                    <CircleDashed className="h-5 w-5" />
                                )}
                            </span>
                            <span
                                className={`text-xs font-medium ${done || active ? "text-foreground" : "text-muted-foreground"
                                    }`}
                            >
                                {step.charAt(0) + step.slice(1).toLowerCase()}
                            </span>
                        </div>
                        {i < FLOW.length - 1 && (
                            <Separator
                                className={`mx-2 mb-5 flex-1 ${done ? "bg-primary" : "bg-muted"}`}
                            />
                        )}
                    </li>
                );
            })}
        </ol>
    );
}