import * as React from "react";
import {
  Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput,
  ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList,
  ComboboxValue, useComboboxAnchor,
} from "@/components/ui/combobox";
import type { ISelectItem } from "@/shared/types/ISelectItem";

// value === 0 with isNew === true means "not saved yet, create on submit"
type Option = ISelectItem<number> & { isNew?: boolean };

interface Props {
  id: string;
  items: ISelectItem<number>[];
  selectedIds: number[];                                   // existing ids
  newNames: string[];                                      // pending new names
  onChange: (ids: number[], newNames: string[]) => void;   // writes both values atomically
  placeHolder: string;
  className?: string;
}

export default function CreatableMultiCombobox({
  id, items, selectedIds, newNames, onChange, placeHolder, className,
}: Props) {
  const anchor = useComboboxAnchor();
  const [input, setInput] = React.useState("");

  // Pending new names as options
  const pending: Option[] = React.useMemo(
    () => newNames.map((n) => ({ value: 0, label: n, isNew: true })),
    [newNames]
  );

  // Selected = existing items matching ids + pending new items
  const selected: Option[] = React.useMemo(() => {
    const ids = new Set(selectedIds);
    return [...items.filter((i) => ids.has(i.value)), ...pending];
  }, [items, selectedIds, pending]);

  const options: Option[] = React.useMemo(() => {
    const typed = input.trim().toLowerCase();
    const exists =
      items.some((i) => i.label.toLowerCase() === typed) ||
      pending.some((p) => p.label.toLowerCase() === typed);
    // Offer "Create" only when no case-insensitive match exists (prevents duplicates)
    const create: Option[] = typed && !exists ? [{ value: 0, label: input.trim(), isNew: true }] : [];
    // Pending items stay in the list so they remain valid selected values
    return [...items, ...pending, ...create];
  }, [items, pending, input]);

  return (
    <Combobox
      multiple
      autoHighlight
      items={options}
      value={selected}
      // Split the selection: existing -> ids, new -> names
      onValueChange={(vals: Option[]) =>
        onChange(
          vals.filter((v) => !v.isNew).map((v) => v.value),
          vals.filter((v) => v.isNew).map((v) => v.label)
        )
      }
      onInputValueChange={(text: string) => setInput(text)}
      itemToStringLabel={(i: Option) => i.label}
      isItemEqualToValue={(a: Option, b: Option) =>
        !!a.isNew === !!b.isNew && (a.isNew ? a.label === b.label : a.value === b.value)
      }
    >
      <ComboboxChips ref={anchor} className={className}>
        <ComboboxValue>
          {(vals: Option[]) => (
            <>
              {vals.map((v) => (
                <ComboboxChip key={v.isNew ? `new:${v.label}` : v.value}>
                  {v.isNew ? `${v.label} (new)` : v.label}
                </ComboboxChip>
              ))}
              <ComboboxChipsInput id={id} placeholder={vals.length ? "" : placeHolder} />
            </>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
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