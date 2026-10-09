import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ISelectItem } from "@/shared/types/ISelectItem";

interface SelectBasicProps<T extends React.Key> {
    items: ISelectItem<T>[],
    value: T | null,
    onChange: (val: T) => void,
    placeHolder: string,
    className?: string,
    id:string,
}

export default function SelectBasic<T extends React.Key>({
    items,
    value,
    onChange,
    placeHolder,
    className = 'w-45',
    id
}: SelectBasicProps<T>) {
    return (<Select items={items} onValueChange={(val) => onChange(val as T)} value={value ?? undefined} id={id}>
        <SelectTrigger className={className}>
            <SelectValue placeholder={placeHolder} />
        </SelectTrigger>
        <SelectContent>
            <SelectGroup>
                {items.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                        {item.label}
                    </SelectItem>
                ))}
            </SelectGroup>
        </SelectContent>
    </Select>)
}