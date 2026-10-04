import { useEffect, useRef, useState } from "react";
import { arabicDigits } from "@/components/ui/date-field";
import { cn } from "@/lib/utils";
import { fill, useLanguage } from "@/lib/i18n";
import {
  WEEKDAYS_AR,
  WEEKDAYS_EN,
  WEEKEND_DAYS,
  gridMonths,
  gridRows,
  type GridMonth,
  type GridRow,
  type InventoryModel,
} from "@/lib/rate-grid-data";

export type GridRowKind = "rate" | "inventory" | "status" | "restrictions" | "release";

/**
 * Every number the grid prints, in the reader's own digits.
 *
 * The chrome around this table was already Arabic - the month, the
 * pickers, the overlays it opens - while the table itself printed 400 and
 * 30. A price is the one number on the screen a supplier actually reads,
 * so it was the worst place left to keep western digits.
 */
const figure = (value: string | number, ar: boolean) =>
  typeof value === "number"
    ? /* A four-figure price carries its separator, as the frames print it. */
      value.toLocaleString(ar ? "ar-EG" : "en-US")
    : arabicDigits(value, ar);

/** The two meal lines "+ meals" opens under a rate row. */
/** UI 04.1M names each meal line with the room's own guest count. */
const MEAL_LINES = [
  { name: "B&B", nameAr: "إفطار", add: 45 },
  { name: "Half Board", nameAr: "نصف إقامة", add: 90 },
];

/**
 * The rate grid of Figma UI 04.1: a month of nights across the top, the
 * shared contract pool, then one block per offer with the row types the
 * viewer chose to show.
 */
export function RateGrid({
  rows = gridRows,
  show,
  compact = false,
  hidePast = false,
  selected,
  onToggle,
  model = "pool",
  pool,
  perRoomCaps,
  openMeals = [],
  onOpenMeals,
  fixedPrice = false,
  month = gridMonths[0]!,
  selecting = false,
  pickup = false,
  onOpenNight,
  onOpenStatus,
  onOpenPool,
}: {
  rows?: GridRow[];
  show: Record<GridRowKind, boolean>;
  compact?: boolean;
  hidePast?: boolean;
  selected: string[];
  onToggle: (key: string) => void;
  /** Where the rooms come from — a pool, a number per room, or neither. */
  model?: InventoryModel;
  pool?: number | undefined;
  perRoomCaps?: Record<string, number> | undefined;
  openMeals?: string[];
  onOpenMeals?: (room: string) => void;
  /** UI 04.1F — a fixed-price room carries its meal in the row name. */
  fixedPrice?: boolean;
  month?: GridMonth;
  /** While cells are being picked a tap selects; otherwise it opens. */
  selecting?: boolean;
  /** UI 04.1VU — the inventory row counts what sold, not what is left. */
  pickup?: boolean;
  /** OV 04.5 / 04.4 / 04.6 — what a tap on a cell opens. */
  onOpenNight?: (room: GridRow, night: number) => void;
  onOpenStatus?: (room: GridRow, night: number) => void;
  onOpenPool?: (night: number) => void;
}) {
  const { c, lang } = useLanguage();
  const t = c.rateGrid;
  const ar = lang === "ar";

  const nights = Array.from({ length: month.nights }, (_, index) => index + 1).filter(
    (night) => !hidePast || !month.today || night >= month.today
  );
  const weekdayOf = (night: number) => (month.firstWeekday + night - 1) % 7;
  const isWeekend = (night: number) => WEEKEND_DAYS.includes(weekdayOf(night));

  // UI 04.1 - a night is a 38x26 cell; the row padding holds the rest.
  const cell = compact ? "h-5 min-w-[34px]" : "h-[26px] min-w-[34px]";
  // UI 04.1 mutes every night before today and marks what was changed.
  const isPast = (night: number) => Boolean(month.today) && night < month.today;
  /*
   * The frame's row-name column is 218px, which is a desktop number: on a
   * 393px phone it took three fifths of the screen and left room for one
   * night. It narrows with the screen instead - the width lives in a
   * variable on the scroll box so every sticky cell reads the same one.
   */
  const label =
    "sticky start-0 z-10 bg-surface-default w-[var(--label)] min-w-[var(--label)] max-w-[var(--label)]";

  const box = useRef<HTMLDivElement>(null);
  const todayCell = useRef<HTMLTableCellElement>(null);
  const [ring, setRing] = useState<{ start: number; width: number } | null>(
    null
  );

  /*
   * UI 04.1 - today is ringed in 2px from the month bar to the last row.
   *
   * The ring used to be placed with `calc((100% - 218px) / nights)`, which
   * is the column's width only while the whole month fits - and on a phone
   * it never does. At 393 that arithmetic drew it 5px wide over the wrong
   * night. It is measured off the cell now, in the scroll box's own
   * content coordinates, so it lands on today at every width and in both
   * directions.
   */
  useEffect(() => {
    const cellEl = todayCell.current;
    const scroller = box.current;
    if (!cellEl || !scroller) {
      setRing(null);
      return;
    }
    const place = () => {
      /*
       * How far today sits from the table's own starting edge, measured
       * with `offsetLeft` - which ignores scrolling, unlike a rect.
       *
       * It is placed with `inset-inline-start`, and the two agree in both
       * directions for the same reason: an absolute child of a scroll box
       * measures `left` from the left of the visible area and `right`
       * from the right of it, and each of those is the edge the content
       * starts at, because the overflow runs the other way. Measuring in
       * `left` for both drew the ring 900px away from today in Arabic.
       */
      const tableWidth = cellEl.closest("table")?.offsetWidth ?? 0;
      const width = cellEl.offsetWidth;
      const start =
        getComputedStyle(scroller).direction === "rtl"
          ? tableWidth - cellEl.offsetLeft - width
          : cellEl.offsetLeft;
      /* Only when it actually moved - this runs from an observer, and a
         fresh object every time would loop. */
      setRing((prev) =>
        prev && prev.start === start && prev.width === width
          ? prev
          : { start, width }
      );
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(scroller);
    window.addEventListener("resize", place);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", place);
    };
  }, [nights.length, compact, month.today, ar]);

  return (
    <div
      ref={box}
      className="relative overflow-x-auto rounded-2xl border border-border-subtle bg-surface-default [--label:150px] sm:[--label:186px] lg:[--label:218px]"
    >
      {ring && (
        <span
          aria-hidden="true"
          /* Under the sticky name column, over everything else - so it
             slides behind the names rather than across them. */
          className="pointer-events-none absolute inset-y-0 z-[5] border-2 border-[#8fd14f]"
          style={{ insetInlineStart: ring.start, width: ring.width }}
        />
      )}
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">{ar ? month.labelAr : month.label}</caption>
        <thead>
          <tr>
            <th
              className={cn(
                label,
                "bg-brand-deep ps-3.5 pe-2.5 py-1 text-start text-[11.5px] font-semibold leading-[14px] text-text-inverse"
              )}
            >
              {ar ? month.labelAr : month.label}
            </th>
            {/* One dark segment per month, so a span says where it turns. */}
            {month.segments && month.segments.length > 1 ? (
              month.segments.map((segment, index) => (
                <th
                  key={`${segment.label}-${index}`}
                  colSpan={segment.nights}
                  className="border-s border-white/15 bg-surface-inverse py-1 text-center text-[10px] font-semibold uppercase leading-[14px] text-text-inverse"
                >
                  {ar ? segment.labelAr : segment.label}
                </th>
              ))
            ) : (
              <th colSpan={nights.length} className="bg-surface-inverse py-1" />
            )}
          </tr>
          <tr>
            <th
              className={cn(
                label,
                "border-b border-border-subtle ps-3.5 pe-2.5 py-2 align-middle text-start text-[10px] font-medium leading-[13px] text-text-secondary"
              )}
            >
              {t.roomNight}
            </th>
            {nights.map((night) => (
              <th
                key={night}
                ref={night === month.today ? todayCell : undefined}
                className={cn(
                  "border-b border-border-subtle px-0.5 py-1 align-bottom text-center",
                  cell,
                  isWeekend(night)
                    ? "bg-cell-weekend-bg"
                    : isPast(night) && "bg-cell-past-bg",
                  night === month.today && "bg-primary-subtle"
                )}
              >
                <span className="block text-[9px] font-medium leading-[11px] text-text-muted">
                  {(ar ? WEEKDAYS_AR : WEEKDAYS_EN)[weekdayOf(night)]}
                </span>
                <span className="font-data block text-xs font-semibold leading-[15px] text-text-primary">
                  {figure(month.days ? month.days[night - 1] ?? night : night, ar)}
                </span>
                {night === month.today && (
                  <span className="block text-[7.5px] font-medium leading-[9px] text-brand-mid">
                    {t.todayLabel}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          <tr className="border-t border-border-subtle">
            <th className={cn(label, "ps-3.5 pe-2.5 py-[7px] text-start align-top")}>
              <span className="block text-[10px] font-medium leading-[13px] text-text-primary">
                {t.season}
              </span>
            </th>
            <td colSpan={nights.length} className="ps-2 pe-1 py-1">
              {!month.seasonBand && (
                <span className="block text-[9px] font-medium leading-[11px] text-text-muted">
                  {t.noSeason}
                </span>
              )}
              {month.seasonBand && (
                <div className="rounded bg-primary-subtle px-2 py-1 text-[10px] font-medium text-brand-deep">
                  {ar ? month.seasonBandAr : month.seasonBand}
                </div>
              )}
              {month.seasonBand && month.seasonHint && (
                <p className="mt-1 px-2 text-[10px] text-text-muted">
                  {ar ? month.seasonHintAr : month.seasonHint}
                </p>
              )}
            </td>
          </tr>

          {model === "pool" && (
            <tr className="border-t border-border-subtle bg-surface-subtle/50">
              <th className={cn(label, "ps-3.5 pe-2.5 py-2 text-start align-top")}>
                <span className="block text-[11.5px] font-semibold leading-[14px] text-text-primary">
                  {t.poolTitle}
                </span>
                <span className="block text-[10px] leading-[13px] tracking-[-0.04em] text-text-muted">
                  {t.poolMeta.replace("50", String(pool ?? 50))}
                </span>
              </th>
              <td colSpan={nights.length} />
            </tr>
          )}

          {model === "pool" && (
            <tr className="border-t border-border-subtle">
              <th className={cn(label, "ps-3.5 pe-2.5 py-2 text-start align-top")}>
                <span className="block text-[11.5px] font-medium leading-[14px] text-text-primary">
                  {t.poolLeft}
                </span>
                <span className="block text-[10px] leading-[13px] tracking-[-0.04em] text-text-muted">
                  {t.poolLeftHint}
                </span>
              </th>
              {nights.map((night) => {
                const left = month.poolLeft[night - 1] ?? 0;
                return (
                  <td
                    key={night}
                    className={cn(
                      "border-s border-border-subtle px-0 py-2",
                      isWeekend(night)
                    ? "bg-cell-weekend-bg"
                    : isPast(night) && "bg-cell-past-bg"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => onOpenPool?.(night)}
                      className={cn(
                        "flex w-full items-center justify-center",
                        cell
                      )}
                    >
                      <span
                        className={cn(
                          "font-data flex h-[18px] w-8 items-center justify-center rounded-[5px] text-[10.5px] font-semibold",
                          isPast(night)
                            ? "bg-surface-subtle text-cell-past-text"
                            : left === 0
                              ? "bg-status-danger-bg text-status-danger"
                              : left <= 4
                                ? "bg-status-warning-bg text-status-warning"
                                : "bg-status-success-bg text-status-success"
                        )}
                      >
                        {left}
                      </span>
                    </button>
                  </td>
                );
              })}
            </tr>
          )}

          {rows.map((row) => (
            <RoomBlock
              key={row.name}
              row={row}
              nights={nights}
              show={show}
              cell={cell}
              labelClass={label}
              ar={ar}
              t={t}
              selected={selected}
              onToggle={onToggle}
              model={model}
              month={month}
              isWeekend={isWeekend}
              perRoomCap={perRoomCaps?.[row.name]}
              mealsOpen={openMeals.includes(row.name)}
              fixedPrice={fixedPrice}
              onOpenMeals={onOpenMeals}
              selecting={selecting}
              pickup={pickup}
              onOpenNight={onOpenNight}
              onOpenStatus={onOpenStatus}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RoomBlock({
  row,
  nights,
  show,
  cell,
  labelClass,
  ar,
  t,
  selected,
  onToggle,
  model,
  month,
  isWeekend,
  perRoomCap,
  mealsOpen = false,
  onOpenMeals,
  fixedPrice = false,
  selecting = false,
  pickup = false,
  onOpenNight,
  onOpenStatus,
}: {
  row: GridRow;
  nights: number[];
  show: Record<GridRowKind, boolean>;
  cell: string;
  labelClass: string;
  ar: boolean;
  t: ReturnType<typeof useLanguage>["c"]["rateGrid"];
  selected: string[];
  onToggle: (key: string) => void;
  model: InventoryModel;
  month: GridMonth;
  isWeekend: (night: number) => boolean;
  perRoomCap?: number | undefined;
  mealsOpen?: boolean;
  onOpenMeals?: ((room: string) => void) | undefined;
  fixedPrice?: boolean;
  selecting?: boolean;
  pickup?: boolean;
  onOpenNight?: ((room: GridRow, night: number) => void) | undefined;
  onOpenStatus?: ((room: GridRow, night: number) => void) | undefined;
}) {
  const isPast = (night: number) => Boolean(month.today) && night < month.today;
  return (
    <>
      <tr className="border-t-2 border-border-default bg-surface-subtle/60">
        <th className={cn(labelClass, "ps-3.5 pe-2.5 py-2 text-start align-top")}>
          <span className="block text-xs font-semibold leading-[15px] text-text-primary">
            {ar ? row.nameAr : row.name}
          </span>
          <span className="block text-[10px] leading-[13px] tracking-[-0.04em] text-text-muted">
            {ar ? row.metaAr : row.meta}
          </span>
        </th>
        <td colSpan={nights.length} />
      </tr>

      {show.rate && (
        <tr className="border-t border-border-subtle">
          <th className={cn(labelClass, "ps-3.5 pe-2.5 py-2 text-start align-top")}>
            <span className="block text-[11.5px] font-medium leading-[14px] text-text-primary">
              {fixedPrice ? t.rateRowFixed : t.rateRow}
            </span>
            {!fixedPrice && (
              <button
                type="button"
                onClick={() => onOpenMeals?.(row.name)}
                className="block text-[10px] leading-[13px] tracking-[-0.04em] text-text-link hover:underline"
              >
                {mealsOpen ? t.hideMeals : t.plusMeals}
              </button>
            )}
          </th>
          {nights.map((night) => {
            const key = `${row.name}|${night}`;
            const isSelected = selected.includes(key);
            return (
              <td
                key={night}
                className={cn(
                  "border-s border-border-subtle px-0 py-2",
                  isWeekend(night)
                    ? "bg-cell-weekend-bg"
                    : isPast(night) && "bg-cell-past-bg"
                )}
              >
                <button
                  type="button"
                  onClick={() =>
                    selecting ? onToggle(key) : onOpenNight?.(row, night)
                  }
                  className={cn(
                    "font-data w-full text-center text-[11px] font-medium",
                    cell,
                    isPast(night) ? "text-cell-past-text" : "text-text-primary",
                    changedRate(row, night, month) &&
                      "border border-dashed border-status-warning/70 bg-status-warning-bg font-semibold text-status-warning",
                    isSelected && "bg-primary-subtle ring-1 ring-inset ring-brand-deep"
                  )}
                >
                  {figure(row.rate[night - 1] ?? 0, ar)}
                </button>
              </td>
            );
          })}
        </tr>
      )}

      {mealsOpen &&
        MEAL_LINES.map((line) => (
          <tr key={line.name} className="border-t border-border-subtle">
            <th className={cn(labelClass, "ps-3.5 pe-2.5 py-1.5 text-start")}>
              <span className="block text-[11px] text-text-secondary">
                {ar
                  ? `${line.nameAr} · لـ${row.guests} ضيوف`
                  : `${line.name} · for ${row.guests} guests`}
              </span>
              <span className="mt-0.5 block text-[10px] text-text-muted">
                {fill(t.mealMeta, { add: line.add, guests: row.guests })}
              </span>
            </th>
            {nights.map((night) => (
              <td
                key={night}
                className={cn(
                  "font-data border-s border-border-subtle px-1 py-1.5 text-center text-[11px] text-text-secondary",
                  isWeekend(night)
                    ? "bg-cell-weekend-bg"
                    : isPast(night) && "bg-cell-past-bg"
                )}
              >
                {figure((row.rate[night - 1] ?? 0) + line.add * row.guests, ar)}
              </td>
            ))}
          </tr>
        ))}

      {show.inventory && model !== "free" && model !== "onRequest" && (
        <tr className="border-t border-border-subtle">
          <th className={cn(labelClass, "ps-3.5 pe-2.5 py-2 text-start align-top")}>
            <span className="block text-[11.5px] font-medium leading-[14px] text-text-primary">
              {pickup
                ? t.pickupRow
                : model === "perRoom"
                  ? t.leftOf.replace("{count}", figure(perRoomCap ?? 0, ar))
                  : row.inventoryLabel === "left"
                    ? t.leftUnderCap
                    : t.sold}
            </span>
            <span className="block text-[10px] leading-[13px] tracking-[-0.04em] text-text-muted">
              {pickup
                ? t.pickupNote
                : model === "perRoom"
                  ? t.heldForRoom
                  : row.inventoryLabel === "left"
                    ? t.ofCap.replace("{count}", figure(row.cap ?? 0, ar))
                    : ar
                      ? month.soldNoteAr
                      : month.soldNote}
            </span>
          </th>
          {nights.map((night) => {
            const value = row.inventory[night - 1] ?? 0;
            const low = row.inventoryLabel === "left" && value <= 4;
            return (
              <td
                key={night}
                className={cn(
                  "font-data h-[42px] border-s border-border-subtle px-1 text-center text-[11px]",
                  cell,
                  isWeekend(night)
                    ? "bg-cell-weekend-bg"
                    : isPast(night) && "bg-cell-past-bg",
                  value === 0 && row.inventoryLabel === "left"
                    ? "font-semibold text-status-danger"
                    : low
                      ? "font-semibold text-status-warning"
                      : "text-text-secondary"
                )}
              >
                {figure(value, ar)}
              </td>
            );
          })}
        </tr>
      )}

      {show.status && (
        <tr className="border-t border-border-subtle">
          <th className={cn(labelClass, "ps-3.5 pe-2.5 py-[7px] text-start align-top")}>
            <span className="block text-[11.5px] font-medium leading-[14px] text-text-primary">
              {model === "onRequest" ? t.statusRowRequest : t.statusRow}
            </span>
            {model === "onRequest" && (
              <span className="block text-[10px] leading-[13px] tracking-[-0.04em] text-text-muted">
                {t.statusNoteRequest}
              </span>
            )}
          </th>
          {nights.map((night) => {
            const value = row.status[night - 1] ?? "·";
            return (
              <td
                key={night}
                className={cn(
                  "border-s border-border-subtle px-0 py-px",
                  isWeekend(night)
                    ? "bg-cell-weekend-bg"
                    : isPast(night) && "bg-cell-past-bg"
                )}
              >
                <button
                  type="button"
                  onClick={() => onOpenStatus?.(row, night)}
                  className={cn(
                    "h-[26px] w-full px-1 text-center text-[11px] font-medium",
                    value === "SS"
                      ? "bg-status-danger-bg text-status-danger"
                      : value === "RQ"
                        ? "bg-status-info-bg text-status-info"
                        : "text-border-default"
                  )}
                >
                  {value}
                </button>
              </td>
            );
          })}
        </tr>
      )}

      {show.restrictions && (
        <tr className="border-t border-border-subtle">
          <th className={cn(labelClass, "ps-3.5 pe-2.5 py-[7px] text-start align-top")}>
            <span className="block text-[11.5px] font-medium leading-[14px] text-text-primary">
              {t.minNights}
            </span>
            {month.noRule && (
              <span className="block text-[10px] leading-[13px] tracking-[-0.04em] text-text-muted">
                {t.noRuleMonth}
              </span>
            )}
          </th>
          {nights.map((night) => {
            const value = month.minNights[night - 1] ?? "";
            return (
              <td
                key={night}
                className={cn(
                  "font-data h-7 border-s border-border-subtle px-1 text-center text-[11px] font-medium",
                  isWeekend(night)
                    ? "bg-cell-weekend-bg"
                    : isPast(night) && "bg-cell-past-bg",
                  value === "no in"
                    ? "bg-status-warning-bg font-semibold text-status-warning"
                    : "text-text-secondary"
                )}
              >
                {value === "no in" ? t.noCheckIn : figure(value, ar)}
              </td>
            );
          })}
        </tr>
      )}

      {show.release && model !== "free" && model !== "onRequest" && (
        <tr className="border-t border-border-subtle">
          <th className={cn(labelClass, "ps-3.5 pe-2.5 py-[7px] text-start")}>
            <span className="block text-[11.5px] font-medium leading-[14px] text-text-primary">
              {t.releaseRow}
            </span>
          </th>
          {nights.map((night) => (
            <td
              key={night}
              className={cn(
                "font-data h-7 border-s border-border-subtle px-1 text-center text-[11px] font-medium",
                isWeekend(night)
                    ? "bg-cell-weekend-bg"
                    : isPast(night) && "bg-cell-past-bg",
                row.release[night - 1] !== CONTRACT_RELEASE_DAYS
                  ? "font-semibold text-status-warning"
                  : isPast(night)
                    ? "text-text-muted"
                    : "text-text-secondary"
              )}
            >
              {figure(row.release[night - 1] ?? 0, ar)}
            </td>
          ))}
        </tr>
      )}
    </>
  );
}

/** The release the contract sets, against which a night reads as changed. */
const CONTRACT_RELEASE_DAYS = 3;

/** UI 04.1 — a rate that no longer matches the contract's base is marked. */
function changedRate(row: GridRow, night: number, month: GridMonth) {
  return row.base === true && month.editedNights.includes(night);
}
