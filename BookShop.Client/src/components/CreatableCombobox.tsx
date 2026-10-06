import * as React from "react";
import {
  Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList,
} from "@/components/ui/combobox";
import type { ISelectItem } from "@/shared/types/ISelectItem";

// value === 0 and isNew === true means "not saved yet, create on submit"
type Option = ISelectItem<number> & { isNew?: boolean };

interface Props {
  id: string;
  items: ISelectItem<number>[];
  selectedId: number;            // existing id, or 0
  newName: string | null;        // pending new name, or ""/null
  onChange: (id: number, newName: string) => void;  // writes both values atomically
  placeHolder: string;
  invalid?: boolean;
  onBlur?: () => void;
}

export default function CreatableCombobox({
  id, items, selectedId, newName, onChange, placeHolder, invalid, onBlur,
}: Props) {
  const [input, setInput] = React.useState("");

  const selected: Option | null = React.useMemo(() => {
    if (newName?.trim()) return { value: 0, label: newName.trim(), isNew: true };
    return items.find((i) => i.value === selectedId) ?? null;
  }, [items, selectedId, newName]);

  const options: Option[] = React.useMemo(() => {
    const typed = input.trim();
    const exact = items.some((i) => i.label.toLowerCase() === typed.toLowerCase());
    // Offer "Create" only when typed text has no case-insensitive exact match (prevents duplicates)
    if (typed && !exact) return [...items, { value: 0, label: typed, isNew: true }];
    // Keep a pending new item in the list so it stays a valid selected value
    if (selected?.isNew) return [...items, selected];
    return items;
  }, [items, input, selected]);

  return (
    <Combobox
      items={options}
      value={selected}
      onValueChange={(item: Option | null) =>
        item?.isNew ? onChange(0, item.label) : onChange(item?.value ?? 0, "")
      }
      onInputValueChange={(text: string) => setInput(text)}
      itemToStringLabel={(i: Option) => i.label}
      isItemEqualToValue={(a: Option, b: Option) =>
        !!a.isNew === !!b.isNew && a.value === b.value && (!a.isNew || a.label === b.label)
      }
    >
      <ComboboxInput id={id} placeholder={placeHolder} aria-invalid={invalid} onBlur={onBlur} />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item: Option) => (
            <ComboboxItem key={item.isNew ? `new:${item.label}` : item.value} value={item}>
              {item.isNew ? <>Create "{item.label}"</> : item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}