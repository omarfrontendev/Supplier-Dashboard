import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useSelector } from "react-redux";
import { ChevronRight } from "lucide-react";

import { PickerOverlay, TermOverlay, WeekendOverlay } from "@/components/contracts/create-overlays";
import { readableDay } from "@/components/ui/date-field";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/i18n";
import {
  currencyPanel,
  hotelPickerPanel,
  weekendPanel,
  type PickerPanel,
} from "@/lib/contract-overlay-data";
import { fetchHotels } from "@/store/features/hotels/hotels.slice";
import { updateBasics } from "@/store/features/contracts/contract-draft.slice";
import { WEEKDAYS, type ContractCurrency, type Weekday } from "@/store/features/contracts/types";
import type { RootState } from "@/store";
import { useAppDispatch, useContractDraft } from "./shared";

const CURRENCIES: ContractCurrency[] = ["SAR", "USD", "EUR"];

const toPanelDay = (day: Weekday) =>
  weekendPanel.days.find((d) => d.label.toLowerCase() === day)!.label;
const fromPanelDay = (label: string) => label.toLowerCase() as Weekday;

function FieldButton({
  label,
  value,
  placeholder,
  onClick,
}: {
  label: string;
  value: string;
  placeholder: string;
  onClick: () => void;
}) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-text-primary">{label}</p>
      <button
        type="button"
        onClick={onClick}
        className="flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-border-default bg-surface-default px-3 text-start text-sm text-text-primary hover:bg-surface-subtle"
      >
        <span className={value ? "truncate" : "truncate text-text-muted"}>
          {value || placeholder}
        </span>
        <ChevronRight
          className="h-4 w-4 shrink-0 text-text-muted rtl:rotate-180"
          aria-hidden="true"
        />
      </button>
    </div>
  );
}

export function BasicsFields() {
  const { c, lang } = useLanguage();
  const t = c.builder;
  const f = t.form;
  const dispatch = useAppDispatch();
  const { basics } = useContractDraft();
  const { hotels, loading } = useSelector((state: RootState) => state.hotels);
  const [picker, setPicker] = useState<"hotel" | "term" | "currency" | "weekend" | null>(null);

  useEffect(() => {
    dispatch(fetchHotels({ page: 1, limit: 100, status: "approved" }));
  }, [dispatch]);

  const linked = hotels.filter((item) => item.hotel);
  const hotel = linked.find((item) => item.hotelId === basics.hotelId)?.hotel;
  const hotelName = (h: { nameEn: string; nameAr: string }) =>
    lang === "ar" ? h.nameAr || h.nameEn : h.nameEn || h.nameAr;

  const hotelPanel = useMemo<PickerPanel>(() => {
    const { note: _note, noteAr: _noteAr, ...panel } = hotelPickerPanel;
    return {
      ...panel,
      options: linked.map((item) => ({
        label: item.hotel.nameEn,
        labelAr: item.hotel.nameAr || item.hotel.nameEn,
        hint: `${item.hotel.city} · ${item.hotel.starRating ?? "-"}★`,
        hintAr: `${item.hotel.city} · ${item.hotel.starRating ?? "-"}★`,
      })),
    };
  }, [linked]);

  const term =
    basics.startDate && basics.endDate
      ? `${readableDay(basics.startDate, lang)} – ${readableDay(basics.endDate, lang)}`
      : "";
  const weekend = WEEKDAYS.filter((day) => basics.weekendDays.includes(day))
    .map((day) => f.days[day])
    .join(" · ");

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <FieldButton
            label={f.hotel}
            value={hotel ? hotelName(hotel) : ""}
            placeholder={loading ? f.hotelLoading : t.hotelPh}
            onClick={() => setPicker("hotel")}
          />
          {!basics.hotelId && (
            <p className="mt-1.5 text-xs text-text-muted">
              {!loading && linked.length === 0 ? f.noHotels : t.hotelHint}
            </p>
          )}
        </div>
        <Input
          label={t.name}
          placeholder={t.namePh}
          value={basics.name}
          onChange={(e) => dispatch(updateBasics({ name: e.target.value }))}
        />
        <FieldButton
          label={t.term}
          value={term}
          placeholder={t.termPh}
          onClick={() => setPicker("term")}
        />
        <FieldButton
          label={f.currency}
          value={basics.currency ? f.currencies[basics.currency] : ""}
          placeholder={f.currencyPh}
          onClick={() => setPicker("currency")}
        />
        <FieldButton
          label={f.weekendDays}
          value={weekend}
          placeholder={t.selectPh}
          onClick={() => setPicker("weekend")}
        />
      </div>

      {!basics.hotelId && (
        <Link
          to="/hotels"
          className="mt-4 inline-block text-xs font-medium text-text-link hover:underline"
        >
          {t.hotelMissing}
        </Link>
      )}

      {picker === "hotel" && (
        <PickerOverlay
          panel={hotelPanel}
          icon="hotel"
          onClose={() => setPicker(null)}
          onConfirm={(index) => {
            const picked = linked[index];
            if (picked) dispatch(updateBasics({ hotelId: picked.hotelId }));
            setPicker(null);
          }}
        />
      )}
      {picker === "term" && (
        <TermOverlay
          initialStart={basics.startDate}
          initialEnd={basics.endDate}
          onClose={() => setPicker(null)}
          onConfirm={(startDate, endDate) => {
            dispatch(updateBasics({ startDate, endDate }));
            setPicker(null);
          }}
        />
      )}
      {picker === "currency" && (
        <PickerOverlay
          panel={currencyPanel}
          icon="currency"
          onClose={() => setPicker(null)}
          onConfirm={(index) => {
            dispatch(updateBasics({ currency: CURRENCIES[index] ?? "SAR" }));
            setPicker(null);
          }}
        />
      )}
      {picker === "weekend" && (
        <WeekendOverlay
          initial={basics.weekendDays.map(toPanelDay)}
          onClose={() => setPicker(null)}
          onConfirm={(days) => {
            dispatch(updateBasics({ weekendDays: days.map(fromPanelDay) }));
            setPicker(null);
          }}
        />
      )}
    </>
  );
}
