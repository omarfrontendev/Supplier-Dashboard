import { useDispatch, useSelector } from "react-redux";

import type { LinkedHotelRoom } from "@/api/modules/hotels/useLinkedHotelRooms";
import { Input, type InputProps } from "@/components/ui/input";
import type { Dict } from "@/lib/dict";
import { isAmountInput } from "@/store/features/contracts/contract-payload";
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
