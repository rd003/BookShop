import DobPicker from "@/components/DobPicker"
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Search, RotateCcw } from "lucide-react"

export interface AdminOrderFilter {
    startingDate: Date | undefined;
    endingDate: Date | undefined;
}

interface Prop {
    onClick: (values: AdminOrderFilter) => void;
    onClearFilter: () => void;
}

export default function OrderFilters({
    onClick,
    onClearFilter,
}: Prop) {
    const [startingDate, setStartingDate] = useState<Date | undefined>(undefined);
    const [endingDate, setEndingDate] = useState<Date | undefined>(undefined);

    function handleClear() {
        setStartingDate(undefined);
        setEndingDate(undefined);
        onClearFilter();
    }
    return (
        <div className="w-full max-w-3xl my-2">
            <div className="flex flex-wrap items-end gap-2">
                <div className="min-w-35 flex-1">
                    <DobPicker label="From" date={startingDate} onChange={setStartingDate} />
                </div>

                <div className="min-w-35 flex-1">
                    <DobPicker label="To" date={endingDate} onChange={setEndingDate} />
                </div>

                <Button
                    variant="secondary"
                    onClick={() => onClick({ startingDate, endingDate })}
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