import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"

interface DobPickerProps {
    label?: string | null;
    date: Date | undefined;
    onChange: (date: Date | undefined) => void;
}
export default function DobPicker({
    label = "Select Date",
    date,
    onChange
}: DobPickerProps) {
    const [open, setOpen] = useState(false)
    return (<Field className="mx-auto w-44">
        <FieldLabel htmlFor="date">{label}</FieldLabel>
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger render={<Button variant="outline" id="date" className="justify-start font-normal">{date ? date.toLocaleDateString() : "Select date"}</Button>} />
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    defaultMonth={date}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                        onChange(date)
                        setOpen(false)
                    }}
                />
            </PopoverContent>
        </Popover>
    </Field>)
}