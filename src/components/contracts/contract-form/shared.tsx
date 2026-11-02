import { useDispatch, useSelector } from "react-redux";
import { Check, Minus } from "lucide-react";

import {
  useLinkedHotelRooms,
  type LinkedHotelRoom,
} from "@/api/modules/hotels/useLinkedHotelRooms";
import { Input, type InputProps } from "@/components/ui/input";
import type { Dict } from "@/lib/dict";
import { contractRoomLabel } from "@/lib/contract-room-label";
import { isAmountInput } from "@/store/features/contracts/contract-payload";
import { CHILD_MAX_AGE } from "@/store/features/contracts/types";
import { cn } from "@/lib/utils";
import type { AppDispatch, RootState } from "@/store";

export const useContractDraft = () => useSelector((state: RootState) => state.contractDraft);

export const useAppDispatch = () => useDispatch<AppDispatch>();

type Form = Dict["builder"]["form"];

export function roomLabel(room: LinkedHotelRoom, lang: string, _f: Form) {
  return contractRoomLabel(room, lang);
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
  indeterminate = false,
  locked,
  label,
  onToggle,
}: {
  on: boolean;
  indeterminate?: boolean;
  locked: boolean;
  label: string;
  onToggle: () => void;
}) {
  const checked = on || indeterminate;
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : on}
      aria-label={label}
      disabled={locked}
      onClick={onToggle}
      className={cn(
        "grid size-[22px] place-items-center rounded-md transition-colors",
        checked
          ? "bg-brand-deep text-primary"
          : "border-[1.5px] border-border-strong bg-surface-default",
        locked ? "cursor-not-allowed opacity-70" : "cursor-pointer",
      )}
    >
      {on && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
      {indeterminate && <Minus className="h-3.5 w-3.5" aria-hidden="true" />}
    </button>
  );
}

export function useChildAgeLimit(hotelId: number | null) {
  const { rooms } = useLinkedHotelRooms(hotelId);
  const ages = rooms
    .map((room) => room.maxChildAge)
    .filter((age): age is number => typeof age === "number" && age > 0);
  return ages.length > 0 ? Math.min(CHILD_MAX_AGE, Math.max(...ages)) : CHILD_MAX_AGE;
}
