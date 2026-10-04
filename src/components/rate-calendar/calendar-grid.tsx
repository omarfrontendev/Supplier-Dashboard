import { AlertTriangle, Ban, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RoomType, SupplyContract } from "@/lib/demo-data";
import { resolveRateCell, type RateCellOverride } from "@/lib/portal-store";
import { calendarBaseRates, calendarIso, rateCellKey, type CalendarLens, type RoomOffer } from "@/lib/rate-calendar-data";
import { cn } from "@/lib/utils";

interface Copy {
  child: string; cta: string; closedArrival: string; minNights: string; roomsSold: string; last7Days: string;
  sar: string; available: string; minStay: string; noChanged: string; noChangedBody: string; roomOffer: string;
  rooms: string; doubleClick: string; stop: string;
}

interface CalendarGridProps {
  contract: SupplyContract;
  rooms: RoomType[];
  offers: RoomOffer[];
  days: Date[];
  lens: CalendarLens;
  compact: boolean;
  highlightWeekends: boolean;
  changedOnly: boolean;
  selected: string[];
  published: Record<string, RateCellOverride>;
  draft: Record<string, RateCellOverride>;
  lang: "ar" | "en";
  copy: Copy;
  onToggle: (key: string) => void;
  onInlineEdit: (key: string, value: number) => void;
}

export function CalendarGrid({ contract, rooms, offers, days, lens, compact, highlightWeekends, changedOnly, selected, published, draft, lang, copy, onToggle, onInlineEdit }: CalendarGridProps) {
  const locale = lang === "ar" ? "ar-SA" : "en-GB";
  const number = new Intl.NumberFormat(locale);
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "short" });
  const month = new Intl.DateTimeFormat(locale, { month: "short" });
  const todayIso = calendarIso(new Date());
  const visibleOffers = changedOnly ? offers.filter((offer) => days.some((day) => draft[rateCellKey(contract.id, offer.id, calendarIso(day))])) : offers;

  const cellValue = (offer: RoomOffer, day: Date, dayIndex: number): RateCellOverride & { rate: number; inventory: number; minStay: number; stopSale: boolean } => {
    const key = rateCellKey(contract.id, offer.id, calendarIso(day));
    const weekend = day.getUTCDay() === 5 || day.getUTCDay() === 6;
    const seed = calendarBaseRates[offer.roomName] ?? 420;
    const base: { rate: number; inventory: number; minStay: number; stopSale: boolean } = {
      rate: seed + offer.adjustment + (weekend ? 60 : 0) + (dayIndex % 4) * 10,
      inventory: Math.max(0, contract.allotment - ((dayIndex + offer.id.length) % 9)),
      minStay: weekend ? 2 : 1,
      stopSale: dayIndex === 11 && offer.id.includes("triple"),
    };
    return resolveRateCell(base, published[key], draft[key]);
  };

  const display = (value: ReturnType<typeof cellValue>, dayIndex: number) => {
    if (lens === "children") return <><strong>{number.format(value.childrenRate ?? 65)}</strong><span>{copy.child}</span></>;
    if (lens === "restrictions") return <><strong>{value.restriction === "closed-arrival" ? copy.cta : value.minStay}</strong><span>{value.restriction === "closed-arrival" ? copy.closedArrival : copy.minNights}</span></>;
    if (lens === "sold") return <><strong>{number.format((dayIndex * 2 + 3) % 11)}</strong><span>{copy.roomsSold}</span></>;
    if (lens === "pickup") return <><strong className="inline-flex items-center gap-1"><TrendingUp className="h-3 w-3" />+{number.format((dayIndex % 4) + 1)}</strong><span>{copy.last7Days}</span></>;
    return <><strong>{number.format(value.rate)} <small>{copy.sar}</small></strong><span>{number.format(value.inventory)} {copy.available}</span><span>{copy.minStay} {number.format(value.minStay)}</span></>;
  };

  if (!visibleOffers.length) return <div className="grid min-h-56 place-items-center border border-border-default bg-surface-default p-8 text-center"><div><AlertTriangle className="mx-auto mb-3 h-6 w-6 text-text-muted"/><p className="font-semibold text-text-primary">{copy.noChanged}</p><p className="mt-1 text-sm text-text-muted">{copy.noChangedBody}</p></div></div>;

  return <div className="overflow-hidden border border-border-default bg-surface-default">
    <div className="overflow-x-auto" data-testid="rate-grid-scroll">
      <div className="min-w-[1342px]">
        <div className="grid grid-cols-[254px_repeat(16,68px)] border-b border-border-default bg-surface-subtle">
          <div className="sticky start-0 z-20 flex items-end border-e border-border-default bg-surface-subtle px-4 py-3 text-[10px] font-bold uppercase text-text-muted shadow-[4px_0_12px_var(--calendar-sticky-shadow)]">{copy.roomOffer}</div>
          {days.map((day) => { const iso = calendarIso(day); const weekend = day.getUTCDay() === 5 || day.getUTCDay() === 6; return <div key={iso} className={cn("border-e border-border-subtle py-2 text-center", highlightWeekends && weekend && "bg-cell-weekend-bg", iso === todayIso && "shadow-[inset_0_3px_0_var(--cell-today-border)]")}><p className="text-[9px] font-semibold uppercase text-text-muted">{weekday.format(day)}</p><p className="font-data text-sm font-semibold text-text-primary">{day.getUTCDate()}</p><p className="text-[9px] text-text-muted">{month.format(day)}</p></div>})}
        </div>
        {rooms.map((room) => {
          const roomOffers = visibleOffers.filter((offer) => offer.roomName === room.name);
          if (!roomOffers.length) return null;
          return <div key={room.name}>
            <div className="grid grid-cols-[254px_repeat(16,68px)] border-b border-border-default bg-surface-subtle/60">
              <div className="sticky start-0 z-10 border-e border-border-default bg-surface-subtle px-4 py-2 shadow-[4px_0_12px_var(--calendar-sticky-shadow)]"><p className="text-xs font-semibold text-text-primary">{lang === "ar" ? room.nameAr : room.name}</p><p className="text-[10px] text-text-muted">{room.units} {copy.rooms}</p></div>
              {days.map((day, index) => { const matching = roomOffers[0]; if (!matching) return <div key={calendarIso(day)} />; const value = cellValue(matching, day, index); return <div key={calendarIso(day)} className={cn("flex items-center justify-center border-e border-border-subtle text-[11px] font-semibold text-text-secondary", value.inventory <= 2 && "bg-cell-low-inventory-bg", value.inventory === 0 && "bg-cell-zero-inventory-bg")}>{value.inventory}</div>})}
            </div>
            {roomOffers.map((offer) => <div key={offer.id} className="grid grid-cols-[254px_repeat(16,68px)] border-b border-border-subtle">
              <div className={cn("sticky start-0 z-10 border-e border-border-default bg-surface-default px-4 shadow-[4px_0_12px_var(--calendar-sticky-shadow)]", compact ? "py-2" : "py-3")}><p className="text-xs font-semibold text-text-primary">{lang === "ar" ? offer.nameAr : offer.name}</p><p className="mt-0.5 text-[10px] text-text-muted">{lang === "ar" ? offer.mealPlanAr : offer.mealPlan}</p></div>
              {days.map((day, index) => {
                const iso = calendarIso(day); const key = rateCellKey(contract.id, offer.id, iso); const value = cellValue(offer, day, index); const edited = Boolean(draft[key]); const isSelected = selected.includes(key); const weekend = day.getUTCDay() === 5 || day.getUTCDay() === 6;
                return <Button key={key} variant="ghost" onClick={() => onToggle(key)} onDoubleClick={() => onInlineEdit(key, value.rate + 10)} aria-pressed={isSelected} title={copy.doubleClick} className={cn("relative h-auto min-h-16 w-[68px] rounded-none border-e border-border-subtle p-1 text-center", !compact && "min-h-[84px]", highlightWeekends && weekend && "bg-cell-weekend-bg", value.inventory <= 2 && !value.stopSale && "bg-cell-low-inventory-bg", value.inventory === 0 && "bg-cell-zero-inventory-bg", value.stopSale && "bg-cell-stop-sale-bg", edited && "shadow-[inset_0_0_0_2px_var(--cell-edited-border)]", isSelected && "bg-cell-selected-bg ring-2 ring-inset ring-brand-deep")}>
                  <span className="flex flex-col items-center gap-1 text-[10px] font-normal leading-tight text-text-muted">{value.stopSale ? <><Ban className="h-4 w-4 text-status-danger"/><em className="not-italic text-status-danger">{copy.stop}</em></> : display(value, index)}</span>
                  {edited && <span className="absolute end-1 top-1 h-1.5 w-1.5 rounded-full bg-cell-draft" />}
                </Button>;
              })}
            </div>)}
          </div>;
        })}
      </div>
    </div>
  </div>;
}