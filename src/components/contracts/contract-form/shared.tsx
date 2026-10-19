import { useDispatch, useSelector } from "react-redux";
import { Check } from "lucide-react";

import type { LinkedHotelRoom } from "@/api/modules/hotels/useLinkedHotelRooms";
import { Input, type InputProps } from "@/components/ui/input";
import type { Dict } from "@/lib/dict";
import { isAmountInput } from "@/store/features/contracts/contract-payload";
import { cn } from "@/lib/utils";
import type { AppDispatch, RootState } from "@/store";

export const useContractDraft = () => useSelector((state: RootState) => state.contractDraft);

export const useAppDispatch = () => useDispatch<AppDispatch>();

type Form = Dict["builder"]["form"];

export function roomLabel(room: LinkedHotelRoom, lang: string, f: Form) {
  const name = (lang === "ar" ? room.nameAr : room.nameEn) || room.nameEn || room.nameAr;
  return room.view ? `${name} · ${f.views[room.view]}` : name;
}

export function formatAmount(amount: number, lang: string, currency: string | null) {
  const number = amount.toLocaleString(lang === "ar" ? "ar-EG" : "en-US", {
    maximumFractionDigits: 2,
  });
  return currency ? `${number} ${currency}` : number;
}

export function AmountInput({
  value,
  onValue,
  ...props
}: Omit<InputProps, "onChange" | "value"> & {
  value: string;
  onValue: (value: string) => void;
}) {
  return (
    <Input
      {...props}
      inputMode="decimal"
      value={value}
      onChange={(event) => {
        const next = event.target.value.replace(",", ".");
        if (isAmountInput(next)) onValue(next);
      }}
    />
  );
}

export function RoomTick({
  on,
  locked,
  label,
  onToggle,
}: {
  on: boolean;
  locked: boolean;
  label: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={on}
      aria-label={label}
      disabled={locked}
      onClick={onToggle}
      className={cn(
        "grid size-[22px] place-items-center rounded-md transition-colors",
        on
          ? "bg-brand-deep text-primary"
          : "border-[1.5px] border-border-strong bg-surface-default",
        locked ? "cursor-not-allowed opacity-70" : "cursor-pointer",
      )}
    >
      {on && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
    </button>
  );
}
