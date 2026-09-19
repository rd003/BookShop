import DobPicker from "@/components/DobPicker"
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Search, RotateCcw } from "lucide-react"
import type { OrderStatus } from "@/shared/constants/orderStatus";
import { orderStatusSelectItems } from "@/shared/constants/orderStatus";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SelectBasic from "@/components/SelectBasic";

export interface OrderFilter {
    dateFrom: Date | undefined;
    dateTo: Date | undefined;
    orderStatus: OrderStatus | null;
}

interface OrderFilterProp {
    onClick: (values: OrderFilter) => void;
    onClearFilter: () => void;
}



export default function OrderFilters({
    onClick,
    onClearFilter,
}: OrderFilterProp) {
    const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
    const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
    const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);

    function handleClear() {
        setDateFrom(undefined);
        setDateTo(undefined);
        setOrderStatus(null);
        onClearFilter();
    }
    return (
        <div className="w-full max-w-3xl my-2">
            <div className="flex flex-wrap items-end gap-2">
                <div className="min-w-35 flex-1">
                    <DobPicker label="From" date={dateFrom} onChange={setDateFrom} />
                </div>

                <div className="min-w-35 flex-1">
                    <DobPicker label="To" date={dateTo} onChange={setDateTo} />
                </div>

                <div className="min-w-35 flex-1">
                    <SelectBasic
                        items={orderStatusSelectItems}
                        value={orderStatus}
                        onChange={(val) => setOrderStatus(val)}
                        placeHolder="Order Status"
                    />
                </div>

                <Button
                    variant="secondary"
                    onClick={() => onClick({ dateFrom, dateTo, orderStatus })}
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