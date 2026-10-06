import * as React from "react";
import {
  Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput,
  ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList,
  ComboboxValue, useComboboxAnchor,
} from "@/components/ui/combobox";
import type { ISelectItem } from "@/shared/types/ISelectItem";

interface Props<T extends React.Key> {
  id: string;
  items: ISelectItem<T>[];
  value: T[] | null;
  onChange: (val: T[]) => void;
  placeHolder: string;
  className?: string;
}

export default function MultiCombobox<T extends React.Key>({
  id, items, value, onChange, placeHolder, className,
}: Props<T>) {
  const anchor = useComboboxAnchor();

  // Combobox (multiple) expects the selected ITEM objects, not ids, so map ids -> items.
  // useMemo so this does not recompute on every keystroke with a large list.
  const selected = React.useMemo(() => {
    const ids = new Set(value ?? []);
    return items.filter((i) => ids.has(i.value));
  }, [items, value]);

  return (
    <Combobox
      multiple
      autoHighlight
      items={items}
      value={selected}
      // Convert selected items back to ids for the form
      onValueChange={(vals: ISelectItem<T>[]) => onChange(vals.map((v) => v.value))}
      itemToStringLabel={(i: ISelectItem<T>) => i.label}   // used for search matching
      isItemEqualToValue={(a: ISelectItem<T>, b: ISelectItem<T>) => a.value === b.value}
    >
      <ComboboxChips ref={anchor} className={className}>
        <ComboboxValue>
          {(vals: ISelectItem<T>[]) => (
            <>
              {vals.map((v) => (
                <ComboboxChip key={v.value}>{v.label}</ComboboxChip>
              ))}
              <ComboboxChipsInput id={id} placeholder={vals.length ? "" : placeHolder} />
            </>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item: ISelectItem<T>) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}