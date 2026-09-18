import DobPicker from "@/components/DobPicker"
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Search, RotateCcw } from "lucide-react"

export interface OrderFilter {
    dateFrom: Date | undefined;
    dateTo: Date | undefined;
}

interface OrderFilterProp {
    onClick: (values: OrderFilter) => void;
    onClearFilter: () => void
}

export default function OrderFilters({ onClick, onClearFilter }: OrderFilterProp) {
    const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
    const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

    function handleClear() {
        setDateFrom(undefined);
        setDateTo(undefined);
        onClearFilter();
    }
    return (
        <div className="w-full max-w-xl my-2">
            <div className="flex flex-wrap items-end gap-2">
                <div className="min-w-35 flex-1">
                    <DobPicker label="From" date={dateFrom} onChange={setDateFrom} />
                </div>
                <div className="min-w-35 flex-1">
                    <DobPicker label="To" date={dateTo} onChange={setDateTo} />
                </div>

                <Button
                    variant="secondary"
                    onClick={() => onClick({ dateFrom, dateTo })}
                    className="shrink-0 gap-2"
                >
                    <Search className="h-4 w-4" />
                    Search
                </Button>

                <Button variant="secondary" className="shrink-0 gap-2" onClick={handleClear}>
                    <RotateCcw className="h-4 w-4" />
                    Clear
                </Button>
            </div>
        </div >
    )
}