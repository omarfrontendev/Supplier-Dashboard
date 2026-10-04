import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Ban,
  Bed,
  Check,
  ChevronDown,
  Eye,
  Info,
  Layers,
  Lightbulb,
  PanelsTopLeft,
  SlidersHorizontal,
  Sparkles,
  Tag,
  Upload,
  type LucideIcon,
} from "lucide-react";
import {
  BackLink,
  PageShell,
  SectionCard,
  StatusPill,
} from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { DatePicker, dateOf } from "@/components/ui/date-picker";
import { datePickerCopy } from "@/lib/date-picker-copy";
import {
  ContractPickerOverlay,
  ReviewPublishDrawer,
  ExportOverlay,
  HotelPickerOverlay,
  MonthPickerOverlay,
  NightStatusOverlay,
  OneNightOverlay,
  PoolBreakdownOverlay,
  PricesForOverlay,
} from "@/components/rate-calendar/rate-overlays";
import {
  ColourKeyDialog,
  ThresholdDialog,
} from "@/components/rate-calendar/colour-key";
import {
  RateGrid,
  type GridRowKind,
} from "@/components/rate-calendar/rate-grid";
import { cn } from "@/lib/utils";
import { winLines } from "@/lib/win-list-data";
import { BulkRangeOverlay } from "@/components/rate-calendar/bulk-range-overlay";
import { Gated } from "@/components/system/permission-gate";
import { fill, useLanguage } from "@/lib/i18n";
import { hotels } from "@/lib/demo-data";
import {
  calendarGroups,
  groupRate,
  hasGroupPrices,
  pricesForCopy,
  type CalendarGroupId,
} from "@/lib/nationality-calendar";
import { usePortal } from "@/lib/portal-store";
import { arNum, monthPicker, selectionBar } from "@/lib/rate-overlay-data";
import {
  WEEKEND_DAYS,
  fixedPriceRows,
  gridContracts,
  gridMonths,
  gridRows,
  dateOfNight,
  rowsForMonth,
  seasonOf,
  windowFor,
} from "@/lib/rate-grid-data";

export const Route = createFileRoute("/rate-calendar")({
  validateSearch: (
    search: Record<string, unknown>
  ): {
    contract?: string;
    state?: "draft" | "published";
    rooms?: "unpriced";
  } => ({
    ...(typeof search["contract"] === "string"
      ? { contract: search["contract"] }
      : {}),
    ...(search["state"] === "draft" || search["state"] === "published"
      ? { state: search["state"] }
      : {}),
    ...(search["rooms"] === "unpriced" ? { rooms: "unpriced" as const } : {}),
  }),
  head: () => ({
    meta: [
      { title: "Rates & Availability · Hoteliana Supplier Portal" },
      {
        name: "description",
        content:
          "Set nightly rates, inventory, stop sales, restrictions and release for every offer in a supply contract.",
      },
      {
        property: "og:title",
        content: "Rates & Availability · Hoteliana Supplier Portal",
      },
      {
        property: "og:description",
        content: "The nightly grid behind a Hoteliana supply contract.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RateCalendarPage,
});

/** OV 04.4 / 04.5 / 04.6 name the weekday in full the way the frames do. */
const DAY_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_AR = [
  "الأحد",
  "الإثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];

/** Figma UI 04.1 — Rates & Availability for one contract and one month. */
function RateCalendarPage() {
  const { c, lang } = useLanguage();
  const t = c.rateGrid;
  const ar = lang === "ar";
  const k = ar ? "ar" : "en";
  const { contract: contractParam, state, rooms: roomsParam } = Route.useSearch();
  const navigate = useNavigate();
  const { contracts } = usePortal();

  // The grid is drawn per contract shape (UI 04.1, F, P, S, Q, E).
  const grid =
    gridContracts.find((item) => item.key === contractParam) ?? gridContracts[0]!;
  const [monthKey, setMonthKey] = useState(grid.month ?? "2026-09");
  const unpricedOnly = roomsParam === "unpriced";
  /* The grid starts and ends on a day, so From and To pick days. */
  const [span, setSpan] = useState(() => wholeMonth(grid.month ?? "2026-09"));
  const month = windowFor(span.start, span.end);
  const holdsNothing =
    grid.model === "free" || grid.model === "onRequest";
  const monthRows = grid.fixedPrice
    ? fixedPriceRows
    : month.key === "2026-09"
      ? gridRows
      : rowsForMonth(month);
  // UI 04.1U — priced rooms first, the ones with no rate underneath them.
  const unpriced = grid.unpriced ?? [];
  const allRows = unpriced.length
    ? [
        ...monthRows.filter((row) => !unpriced.includes(row.name)),
        ...monthRows.filter((row) => unpriced.includes(row.name)),
      ].map((row) =>
        unpriced.includes(row.name)
          ? { ...row, meta: t.noRateYet, metaAr: t.noRateYet, unpriced: true }
          : { ...row, meta: row.base ? `BASE · ${t.seasonPriced}` : `${row.meta.split(" · ")[0]} · ${t.seasonPriced}` }
      )
    : monthRows;
  const contract =
    contracts.find((item) => item.id === grid.key) ??
    contracts.find((item) => item.state === "active");
  const hotel = hotels.find((item) => item.id === contract?.hotelId) ?? hotels[0];

  const [show, setShow] = useState<Record<GridRowKind, boolean>>({
    rate: true,
    inventory: true,
    status: true,
    restrictions: true,
    release: true,
  });
  const [visibleRooms, setVisibleRooms] = useState<string[]>(
    allRows.map((row) => row.name)
  );
  const [openMeals, setOpenMeals] = useState<string[]>([]);
  const [colourKey, setColourKey] = useState(false);
  const [threshold, setThreshold] = useState(4);
  const [thresholdOpen, setThresholdOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [hidePast, setHidePast] = useState(false);
  const [pickup, setPickup] = useState(false);
  const [selectCells, setSelectCells] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [filter, setFilter] = useState("all");
  const [includeEnded, setIncludeEnded] = useState(false);
  /* OV 04.1A / 04.2 / 04.3 / 04.4 / 04.5 / 04.6 — one overlay at a time. */
  const [overlay, setOverlay] = useState<
    | "bulk"
    | "stopSale"
    | "release"
    | "restrictions"
    | "night"
    | "status"
    | "pool"
    | "hotel"
    | "contract"
    | "months"
    | "export"
    | "review"
    | "prices"
    | null
  >(null);
  /* OV 04.1PN - whose prices the grid is showing. Everyone, until asked. */
  const [priceGroup, setPriceGroup] = useState<CalendarGroupId>("everyone");
  /*
   * OV 04.6B / 04.6C - the nights the Change prices overlay is pricing,
   * when they were picked in its own field rather than on the grid. It
   * outranks the cells, because it is the later answer to the same
   * question, and it goes when the overlay does.
   */
  const [typedNights, setTypedNights] = useState<number[] | null>(null);
  const [nightCell, setNightCell] = useState<{
    room: string;
    roomAr: string;
    night: number;
    base: boolean;
  } | null>(null);

  /*
   * OV 04.4 / 04.5 / 04.6 — the cell that was tapped reads as its date,
   * and the date is asked for rather than counted: on a custom window the
   * column index is not the day of the month, and the label came out as
   * "Fri 1 5 – –" when it was treated as one.
   */
  const nightOn = nightCell ? dateOfNight(month, nightCell.night) : null;
  const nightWeekend = nightOn ? WEEKEND_DAYS.includes(nightOn.getDay()) : false;
  const nightDate = nightOn
    ? ar
      ? `${DAY_AR[nightOn.getDay()]} ${arNum(nightOn.getDate())} ${
          datePickerCopy.ar.monthsShort[nightOn.getMonth()]
        } ${arNum(nightOn.getFullYear())}`
      : `${DAY_EN[nightOn.getDay()]} ${nightOn.getDate()} ${
          datePickerCopy.en.monthsShort[nightOn.getMonth()]
        } ${nightOn.getFullYear()}`
    : undefined;

  /** UI 04.1VS — the rooms and the nights the picked cells cover. */
  const pickedRooms = [...new Set(selected.map((key) => key.split("|")[0]!))];
  const pickedNights = selected
    .map((key) => Number(key.split("|")[1]))
    .sort((a, b) => a - b);
  /*
   * OV 04.6H / 04.6N - what the nights being priced already carry, read
   * off the month itself rather than assumed: which of them were edited,
   * how many rooms are already booked on them, and whether they sit in a
   * season. Each band on the overlay only appears when its answer is yes.
   */
  const overlayNights =
    typedNights ??
    (pickedNights.length
      ? pickedNights
      : nightCell
        ? [nightCell.night]
        : []);
  const nightSeason = overlayNights.length
    ? seasonOf(dateOfNight(month, overlayNights[0]!))
    : null;
  /*
   * OV 04.6G / 04.6O - a run of nights can cross a season boundary. The
   * spans are collected in the order the nights run, so the band can name
   * each season with the nights that belong to it.
   */
  const seasonSpans = overlayNights.reduce<
    Array<{ name: { en: string; ar: string } | null; nights: number[] }>
  >((spans, night) => {
    const season = seasonOf(dateOfNight(month, night));
    const last = spans[spans.length - 1];
    if (last && last.name?.en === (season?.en ?? undefined)) {
      last.nights.push(night);
      return spans;
    }
    if (last && !last.name && !season) {
      last.nights.push(night);
      return spans;
    }
    spans.push({ name: season, nights: [night] });
    return spans;
  }, []);
  /* What the picked nights are, written the way the field prints them. */
  const overlaySummary = overlayNights.length
    ? (() => {
        const first = dateOfNight(month, overlayNights[0]!);
        const last = dateOfNight(month, overlayNights[overlayNights.length - 1]!);
        const short = (date: Date) =>
          ar
            ? datePickerCopy.ar.monthsShort[date.getMonth()]
            : datePickerCopy.en.monthsShort[date.getMonth()];
        const day = (date: Date) =>
          ar ? arNum(date.getDate()) : String(date.getDate());
        const name = (date: Date) =>
          ar ? DAY_AR[date.getDay()] : DAY_EN[date.getDay()];
        const sameMonth = first.getMonth() === last.getMonth();
        const year = ar ? arNum(last.getFullYear()) : String(last.getFullYear());
        const weekend = overlayNights
          .map((night) => dateOfNight(month, night))
          .filter((date) => WEEKEND_DAYS.includes(date.getDay()))
          .map((date) =>
            ar
              ? `${DAY_AR[date.getDay()]} ${day(date)}`
              : `${DAY_EN[date.getDay()]} ${day(date)}`
          );
        /* OV 04.6L - the weekday is named too, not only counted. */
        const weekdayList = overlayNights
          .map((night) => dateOfNight(month, night))
          .filter((date) => !WEEKEND_DAYS.includes(date.getDay()))
          .map((date) =>
            ar
              ? `${DAY_AR[date.getDay()]} ${day(date)}`
              : `${DAY_EN[date.getDay()]} ${day(date)}`
          );
        return {
          /* OV 04.6B / 04.6C / 04.6L - the frames name the day, because
             "24 - 26" is a range and "Thu 24 - Sat 26" is a weekend. */
          range: `${name(first)} ${day(first)}${
            sameMonth ? "" : ` ${short(first)}`
          } - ${name(last)} ${day(last)} ${short(last)} ${year}`,
          weekdays: overlayNights.length - weekend.length,
          weekend,
          weekdayList,
        };
      })()
    : null;

  const namedSpans = seasonSpans
    .filter((span) => span.name !== null)
    .map((span) => ({
      name: span.name!,
      from: dateOfNight(month, span.nights[0]!).getDate(),
      to: dateOfNight(month, span.nights[span.nights.length - 1]!).getDate(),
      nights: span.nights.length,
    }));
  const nightLabel = (night: number) => {
    const on = dateOfNight(month, night);
    return ar
      ? `${DAY_AR[on.getDay()]} ${arNum(on.getDate())}`
      : `${DAY_EN[on.getDay()]} ${on.getDate()}`;
  };
  const already = {
    changed: overlayNights
      .filter((night) => month.editedNights.includes(night))
      .map((night) => ({
        when: { en: nightLabel(night), ar: nightLabel(night) },
        price: month.base[night - 1] ?? 0,
      })),
    /* The grid carries no per-night stop sale yet, so this stays empty
       until it does - the band simply does not draw. */
    closed: [] as Array<{ en: string; ar: string }>,
    booked: overlayNights.reduce(
      (sum, night) => sum + (month.baseSold[night - 1] ?? 0),
      0
    ),
  };

  const pickedRange = pickedNights.length
    ? `${ar ? arNum(pickedNights[0]!) : pickedNights[0]} - ${
        ar
          ? arNum(pickedNights[pickedNights.length - 1]!)
          : pickedNights[pickedNights.length - 1]
      } ${ar ? month.pickerAr.split(" ")[0] : month.picker.slice(0, 3)}`
    : "";

  /*
   * UI 04.1TGCC / TIM / TPK - the same grid, priced for one nationality.
   * Only the rate line changes: inventory, stop sale, restrictions and
   * release belong to the room, not to who is sleeping in it (BR-03-94).
   */
  const rows = allRows
    .filter(
      (row) =>
        visibleRooms.includes(row.name) &&
        (!unpricedOnly || unpriced.includes(row.name))
    )
    .map((row) =>
      priceGroup === "everyone"
        ? row
        : {
            ...row,
            rate: row.rate.map((value, index) => {
              const on = dateOfNight(month, index + 1);
              return groupRate(
                priceGroup,
                row.name,
                on,
                WEEKEND_DAYS.includes(on.getDay()),
                value
              );
            }),
          }
    );

  /* OV 04.1PN0 - a window with no season priced by nationality. */
  const seasoned = hasGroupPrices(
    Array.from({ length: month.base.length }, (_, index) =>
      dateOfNight(month, index + 1)
    )
  );
  const group =
    calendarGroups.find((item) => item.id === priceGroup) ?? calendarGroups[0]!;

  const counts = {
    all: allRows.length,
    ...(month.key === "2026-09" ? grid.counts : month.counts),
  };

  return (
    <PageShell>
      {/* UI 04.1 - back, title and publish share one 44px row. */}
      <header className="mb-5 flex flex-wrap items-center gap-4">
        {/*
          * The frame draws no back link: Rates & Availability is a place of
          * its own, reached from the nav. It only earns one when you came
          * from a contract - which is what `?contract=` says - so that the
          * way back is the way you came.
          */}
        {contractParam && (
          <BackLink
            inline
            to="/rate-contracts"
            label={fill(t.back, { contract: ar ? grid.nameAr : grid.name })}
          />
        )}
        {/* `flex-1` alone lets a wrapping row squeeze text to its
            narrowest word. The basis makes it claim a line instead. */}
        <div className="min-w-0 flex-1 basis-60">
          <p className="text-overline text-text-muted">
            {fill(t.meta, {
              hotel: ar ? grid.hotelAr : grid.hotel,
              id: grid.ref,
            })}
          </p>
          <div className="mt-0.5 flex flex-wrap items-center gap-3">
            <h1 className="text-[28px] font-semibold leading-7 text-text-primary">
              {t.title}
            </h1>
            <StatusPill status={grid.status}>
              {ar ? grid.statusAr : grid.status}
            </StatusPill>
          </div>
        </div>
        {/* Flow 04-W - the Win list, with this week's open lines. */}
        <Gated permission="rates.view" instead={null}>
          <Link to="/rates/win-list" search={{}}>
            <Button variant="outline">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {ar ? "قائمة الفرص" : "Win list"}
              <span className="rounded-full bg-primary-subtle px-1.5 text-[10px] font-semibold text-brand-deep">
                {winLines.length}
              </span>
            </Button>
          </Link>
        </Gated>
        {grid.readOnly ? (
          <StatusPill tone="neutral">
            {ar ? grid.publishStateAr : grid.publishState}
          </StatusPill>
        ) : (
          <Gated
            permission="rates.publish"
            ask={{ hotel: grid.hotel }}
            instead={
              <p className="max-w-[220px] text-xs leading-5 text-text-muted">
                {ar
                  ? "اطلب من شخص يملك صلاحية النشر."
                  : "Ask someone who can publish."}
              </p>
            }
          >
            <Button onClick={() => setOverlay("review")}>
              {state === "draft"
                ? t.draftState
                : state === "published"
                  ? t.publishedState
                  : ar
                    ? grid.publishStateAr
                    : grid.publishState}
            </Button>
          </Gated>
        )}
      </header>

      {grid.readOnly && (
        <div className="mb-4 rounded-xl border border-border-subtle bg-surface-subtle p-4">
          <p className="text-sm leading-relaxed text-text-secondary">
            {t.endedBanner}
          </p>
        </div>
      )}

      {grid.notStarted && (
        <div className="mb-4 rounded-xl border border-status-info/25 bg-status-info-bg p-4">
          <p className="text-sm leading-relaxed text-text-secondary">
            {t.notStarted}
          </p>
        </div>
      )}

      {state === "published" && (
        <div className="mb-4 flex gap-3 rounded-xl border border-status-success/25 bg-status-success-bg p-4">
          <Check
            className="mt-0.5 h-5 w-5 shrink-0 text-status-success"
            aria-hidden="true"
          />
          <p className="text-sm leading-relaxed text-text-secondary">
            {t.publishedBanner}
          </p>
        </div>
      )}

      {state === "draft" && (
        <div className="mb-4 flex flex-wrap items-center gap-4 rounded-xl border border-status-info/25 bg-status-info-bg p-4">
          <p className="min-w-0 flex-1 basis-60 text-sm leading-relaxed text-text-secondary">
            {t.savedDraft}
          </p>
          <Button size="sm" variant="outline">
            {t.undo}
          </Button>
        </div>
      )}

      <SectionCard className="mb-5" bodyClassName="p-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[230px_300px_170px_170px_190px_minmax(0,1fr)]">
          {/* OV 04.10 / 04.9 / 04.8 - each field opens the frame behind it. */}
          <PickerField
            label={t.hotel}
            value={(ar ? hotel?.nameAr : hotel?.nameEn) ?? ""}
            onClick={() => setOverlay("hotel")}
          />
          <PickerField
            label={t.contract}
            value={`${grid.ref} · ${ar ? grid.nameAr : grid.name}`}
            onClick={() => setOverlay("contract")}
          />
          <DayField
            label={t.from}
            value={span.start}
            span={span}
            onPick={(next) => setSpan(next)}
          />
          <DayField
            label={t.to}
            value={span.end}
            span={span}
            onPick={(next) => setSpan(next)}
          />
          {/* OV 04.1PN - the field that opens the nationality menu. */}
          <PickerField
            label={pricesForCopy.label[k]}
            value={group.name[k]}
            onClick={() => setOverlay("prices")}
          />
          <label className="flex h-11 cursor-pointer items-center gap-2.5 self-end px-3">
            <input
              type="checkbox"
              checked={includeEnded}
              onChange={(e) => setIncludeEnded(e.target.checked)}
              className="h-[18px] w-[18px] rounded accent-[var(--brand-deep)]"
            />
            <span className="text-sm leading-[18px] text-text-secondary">
              {t.includeEnded}
            </span>
          </label>
        </div>

        {/* UI 04.1 — the contract's terms read as one band under the pickers. */}
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-surface-subtle px-3 py-2.5">
          <span className="text-overline me-1.5 text-text-muted">
            {t.fromContract}
          </span>
          {(ar ? grid.summaryAr : grid.summary)
            .map((line, index, all) =>
              index === all.length - 1 && !grid.readOnly
                ? ar
                  ? month.seasonLineAr
                  : month.seasonLine
                : line
            )
            .map((line) => (
              <span
                key={line}
                className="rounded-full bg-surface-default px-3 py-1.5 text-xs text-text-secondary"
              >
                {line}
              </span>
            ))}
          <Link
            to="/rate-contracts/$contractId"
            params={{ contractId: contract?.id ?? grid.key }}
            className="px-1 text-xs font-medium text-text-primary hover:underline"
          >
            {t.openContract}
          </Link>
        </div>
      </SectionCard>

      {/*
        * UI 04.1TGCC / TIM / TPK - the band that says what is on screen.
        * It reads as a whole sentence because half of it is the part people
        * get wrong: the group's price stops when the season does.
        */}
      {group.banner && (
        <div className="mb-5 rounded-xl bg-[#edffd6] p-3.5">
          <p className="text-[12.5px] font-semibold text-text-primary">
            {group.banner.title[k]}
          </p>
          <p className="mt-0.5 text-[12px] leading-5 text-text-body">
            {group.banner.body[k]}
          </p>
        </div>
      )}

      {/*
        * UI 04.1 - the panel that decides what the calendar shows. It asks
        * three separate questions - which rows, which rooms, how the grid
        * is drawn - so each gets its own icon, its own sentence and its own
        * column, with a rule between them. Read as one long strip of
        * checkboxes they blur together; read as three they are obvious.
        */}
      <SectionCard className="mb-5" bodyClassName="px-6 py-5">
        {/* The floors are the widest pill each question has to hold:
            204px is "Pickup - last 7 days", and 32fr gives the rows
            question the 378px its first line needs to break where
            the frame breaks it. */}
        <div className="grid gap-x-6 gap-y-5 lg:grid-cols-[minmax(240px,32fr)_1px_minmax(0,51fr)_1px_minmax(204px,17fr)]">
          <PanelSection
            icon={PanelsTopLeft}
            title={t.showRows}
            hint={t.showRowsHint}
          >
            {/* Sized to their labels: these five are not a column of equals. */}
            <div className="flex flex-wrap gap-x-2.5 gap-y-3">
              {(
                [
                  ["rate", t.rowRates],
                  /* UI 04.1S / 04.1Q - both rows stay, named for what they
                     cannot do on a contract that holds no rooms. */
                  [
                    "inventory",
                    holdsNothing ? t.rowInventoryUnused : t.rowInventory,
                  ],
                  ["status", t.rowStatus],
                  ["restrictions", t.rowRestrictions],
                  [
                    "release",
                    holdsNothing ? t.rowReleaseUnused : t.rowRelease,
                  ],
                ] as Array<[GridRowKind, string]>
              ).map(([key, label]) => (
                <CheckRow
                  key={key}
                  checked={show[key]}
                  onChange={() => setShow((prev) => ({ ...prev, [key]: !prev[key] }))}
                  label={label}
                />
              ))}
            </div>
          </PanelSection>

          <PanelRule />

          <PanelSection
            icon={Bed}
            title={t.showRooms}
            hint={t.showRoomsHint}
            stacked
          >
            {/*
              * Nine rooms and an All, in a grid so the names line up in
              * columns instead of ragging after the longest one.
              *
              * How many columns is decided by the longest name, not by a
              * breakpoint: "Deluxe Room - Partial Haram View" needs 244px
              * of pill, so the track floor is 244px and the column fits as
              * many as it can hold - three where the frame draws three, two
              * at 1440, one when the panel is a stack on a phone. Sized off
              * a breakpoint instead, the same name was cut in half at three
              * different widths, and a room name you cannot read is worse
              * than a panel one row taller. Logged in roadmap.md.
              */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(244px,1fr))] gap-x-2 gap-y-3">
              <CheckRow
                checked={visibleRooms.length === allRows.length}
                onChange={() =>
                  setVisibleRooms(
                    visibleRooms.length === allRows.length
                      ? []
                      : allRows.map((row) => row.name)
                  )
                }
                label={fill(t.allRooms, { count: allRows.length })}
              />
              {allRows.map((row) => (
                <CheckRow
                  key={row.name}
                  checked={visibleRooms.includes(row.name)}
                  onChange={() =>
                    setVisibleRooms((prev) =>
                      prev.includes(row.name)
                        ? prev.filter((name) => name !== row.name)
                        : [...prev, row.name]
                    )
                  }
                  label={ar ? row.nameAr : row.name}
                />
              ))}
            </div>
          </PanelSection>

          <PanelRule />

          <PanelSection icon={Eye} title={t.view} hint={t.viewHint} stacked>
            {/* One under another, each the full width of the column. */}
            <div className="grid gap-3">
              <CheckRow checked={compact} onChange={() => setCompact(!compact)} label={t.compact} />
              <CheckRow checked={hidePast} onChange={() => setHidePast(!hidePast)} label={t.hidePast} />
              <CheckRow checked={pickup} onChange={() => setPickup(!pickup)} label={t.pickup} />
              <CheckRow checked={selectCells} onChange={() => setSelectCells(!selectCells)} label={t.selectCells} />
            </div>
          </PanelSection>
        </div>
      </SectionCard>

      {/*
        * UI 04.1 - the toolbar, as one card with two rows and a rule
        * between them: what you can do to the calendar on top, what you
        * can narrow it to underneath. At the end of each row, past a
        * divider, sits the one control that changes nothing - Export
        * above, the colour key below. That divider is the whole idea:
        * everything before it acts on the grid, everything after it only
        * looks at it.
        *
        * It used to be two bare rows on the canvas, which left the filters
        * floating between the panel above and the grid below, belonging to
        * neither.
        */}
      <SectionCard className="mb-5" bodyClassName="px-5 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="dark"
            className="rounded-full"
            onClick={() => setOverlay("bulk")}
          >
            <Layers className="h-[18px] w-[18px]" aria-hidden="true" />
            {t.bulkRates}
          </Button>
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => setOverlay("stopSale")}
          >
            <Ban className="h-[18px] w-[18px]" aria-hidden="true" />
            {t.bulkStatus}
          </Button>
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => setOverlay("release")}
          >
            <Tag className="h-[18px] w-[18px]" aria-hidden="true" />
            {t.bulkRelease}
          </Button>
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => setOverlay("restrictions")}
          >
            <SlidersHorizontal className="h-[18px] w-[18px]" aria-hidden="true" />
            {t.bulkRestrictions}
          </Button>

          {/* Pushed to the end where there is a row to push it along;
              on a phone it simply follows, rather than taking a line of
              its own with nothing beside it. */}
          <div className="flex items-center gap-3 sm:ms-auto">
            <span
              className="hidden h-6 w-px bg-border-subtle sm:block"
              aria-hidden="true"
            />
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => setOverlay("export")}
            >
              <Upload className="h-[18px] w-[18px]" aria-hidden="true" />
              {t.export}
            </Button>
          </div>
        </div>

        <div className="my-4 h-px bg-border-subtle" aria-hidden="true" />

        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              ["all", t.filterAll, counts.all],
              ["soldOut", t.filterSoldOut, counts.soldOut],
              ["fewer", t.filterFewer.replace("4", String(threshold)), counts.fewer],
              ["stopSale", t.filterStopSale, counts.stopSale],
              ["onRequest", t.filterOnRequest, counts.onRequest],
              ["notPublished", t.filterNotPublished, state === "published" ? 0 : counts.notPublished],
              /* The guide fixes the filter row at seven. Not priced used to
                 disappear at zero while Stop sale stayed and showed its 0,
                 which made the row change shape for no reason. */
              ["notPriced", t.filterNotPriced, unpriced.length],
            ] as Array<[string, string, number]>
          ).map(([key, label, count]) => (
            <FilterChip
              key={key}
              tone={CHIP_TONE[key] ?? "warning"}
              active={filter === key}
              onClick={() => setFilter(filter === key ? "all" : key)}
              label={label}
              clearLabel={t.filterAll}
              {...(key === "all" ? {} : { count: ar ? arNum(count) : count })}
            />
          ))}

          <div className="flex items-center gap-3 sm:ms-auto">
            <span
              className="hidden h-6 w-px bg-border-subtle sm:block"
              aria-hidden="true"
            />
            <Button
              variant="ghost"
              className="rounded-full px-3"
              onClick={() => setColourKey(true)}
            >
              <Info className="h-[18px] w-[18px]" aria-hidden="true" />
              {t.colourKey}
            </Button>
          </div>
        </div>
      </SectionCard>

      {unpriced.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-4 rounded-xl border border-status-warning/25 bg-status-warning-bg p-4">
          <Lightbulb
            className="h-5 w-5 shrink-0 text-status-warning"
            aria-hidden="true"
          />
          <div className="min-w-0 flex-1 basis-60">
            <p className="text-overline text-status-warning">
              {fill(t.priced, {
                done: allRows.length - unpriced.length,
                total: allRows.length,
              })}
            </p>
            <p className="mt-0.5 text-sm text-text-secondary">
              {unpricedOnly
                ? fill(t.pricedBody, { count: unpriced.length })
                : fill(t.pricedLeft, { count: unpriced.length })}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              navigate({
                to: "/rate-calendar",
                search: unpricedOnly
                  ? { ...(contractParam ? { contract: contractParam } : {}) }
                  : {
                      ...(contractParam ? { contract: contractParam } : {}),
                      rooms: "unpriced" as const,
                    },
              })
            }
          >
            {unpricedOnly ? t.showAllRooms : t.showOnlyUnpriced}
          </Button>
        </div>
      )}

      {grid.counts.fewer > 0 && month.key === "2026-09" && !unpriced.length && (
      <div className="mb-4 rounded-xl border border-status-info/25 bg-status-info-bg px-4 py-3">
          {/*
            * One row on a wide screen, as the frame draws it. On a phone
            * the sentence takes the width and the two actions share the
            * line below. It used to be a single wrapping row, and `flex-1`
            * on the sentence let it shrink to its narrowest word - at 393
            * the banner was 499px tall with one letter per line.
            */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
            <p className="min-w-0 text-[13px] leading-[1.45] text-text-secondary lg:flex-1">
              <span className="text-overline me-2 tracking-[0.02em] text-status-info">
                {t.worthDoing}
              </span>
              {t.worthDoingBody}
            </p>
            <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
              <Button
                variant="outline"
                className="flex-1 lg:flex-none"
                onClick={() =>
                  setSelected(
                    rows.flatMap((row) => [`${row.name}|24`, `${row.name}|25`])
                  )
                }
              >
                {t.selectThose}
              </Button>
              <Button
                variant="dark"
                className="flex-1 lg:flex-none"
                onClick={() => setOverlay("bulk")}
              >
                {t.raiseWeekend}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* UI 04.1VS — what was picked, and the three things to do with it. */}
      {selected.length > 0 && (
        <div className="mb-3 flex flex-col gap-3 rounded-xl bg-surface-subtle px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center">
          <p className="min-w-0 text-[12.5px] font-medium text-text-primary sm:flex-1 sm:basis-60">
            {fill(
              pickedRooms.length === 1
                ? selectionBar.countOneRoom[k]
                : selectionBar.count[k],
              {
                count: ar ? arNum(selected.length) : selected.length,
                rooms: ar ? arNum(pickedRooms.length) : pickedRooms.length,
                range: pickedRange,
              }
            )}
          </p>
          {/* The three things to do with a selection stay together and
              wrap among themselves, rather than each claiming a row. */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                setOverlay(pickedRooms.length === 1 ? "night" : "bulk")
              }
            >
              {selectionBar.setRate[k]}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setOverlay("bulk")}>
              {selectionBar.adjust[k]}
            </Button>
            <Button size="sm" variant="outline">
              {selectionBar.minimumStay[k]}
            </Button>
            <button
              type="button"
              onClick={() => setSelected([])}
              className="px-1 text-xs font-medium text-text-link hover:underline"
            >
              {selectionBar.clear[k]}
            </button>
          </div>
        </div>
      )}

      <RateGrid
        rows={rows}
        show={show}
        compact={compact}
        hidePast={hidePast}
        model={grid.model}
        fixedPrice={Boolean(grid.fixedPrice)}
        pool={grid.pool}
        perRoomCaps={grid.perRoomCaps}
        month={month}
        openMeals={openMeals}
        onOpenMeals={(room) =>
          setOpenMeals((prev) =>
            prev.includes(room)
              ? prev.filter((name) => name !== room)
              : [...prev, room]
          )
        }
        selected={selected}
        selecting={selectCells}
        pickup={pickup}
        onToggle={(key) =>
          setSelected((prev) =>
            prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
          )
        }
        onOpenNight={(row, night) => {
          setNightCell({
            room: row.name,
            roomAr: row.nameAr,
            night,
            base: row.base === true,
          });
          setOverlay("night");
        }}
        onOpenStatus={(row, night) => {
          setNightCell({
            room: row.name,
            roomAr: row.nameAr,
            night,
            base: row.base === true,
          });
          setOverlay("status");
        }}
        onOpenPool={(night) => {
          setNightCell({ room: "", roomAr: "", night, base: false });
          setOverlay("pool");
        }}
      />

      <div className="mt-5 rounded-xl border border-border-subtle bg-surface-subtle p-4">
        <p className="text-overline text-text-muted">{t.goodToKnow}</p>
        <ul className="mt-2 space-y-1.5">
          {[
            ...(ar ? grid.legendAr : grid.legend),
            /* UI 04.1T / H / J — a season month says where its price comes from. */
            ...((ar ? month.legendLineAr : month.legendLine)
              ? [(ar ? month.legendLineAr : month.legendLine) as string]
              : []),
          ].map((line) => (
            <li key={line} className="text-xs leading-5 text-text-secondary">
              •&nbsp;&nbsp;{line}
            </li>
          ))}
        </ul>
      </div>

      {colourKey && (
        <ColourKeyDialog
          threshold={threshold}
          onClose={() => setColourKey(false)}
          onChangeThreshold={() => {
            setColourKey(false);
            setThresholdOpen(true);
          }}
        />
      )}

      {thresholdOpen && (
        <ThresholdDialog
          value={threshold}
          onClose={() => setThresholdOpen(false)}
          onSave={setThreshold}
        />
      )}

      {/* OV 04.BP* / 04.BS* / 04.BR* / 04.BX* - one shell, four middles.
          Bulk rates joined them: the frames give it the same nights row,
          the same rooms grid and the same list, and only its middle and
          what happens at Review differ. */}
      {(overlay === "bulk" ||
        overlay === "stopSale" ||
        overlay === "release" ||
        overlay === "restrictions") && (
        <BulkRangeOverlay
          kind={overlay === "bulk" ? "bulkRates" : overlay}
          contract={(ar ? grid.nameAr : grid.name).toUpperCase()}
          onClose={() => setOverlay(null)}
          onEditContract={() => {
            setOverlay(null);
            navigate({
              to: "/rate-contracts/$contractId",
              params: { contractId: contract?.id ?? grid.key },
            });
          }}
        />
      )}

      {overlay === "night" && (
        <OneNightOverlay
          room={nightCell ? (ar ? nightCell.roomAr : nightCell.room) : undefined}
          date={nightDate}
          base={nightCell?.base ?? false}
          weekend={nightWeekend}
          /*
           * OV 04.5R / 04.6B — the overlay prices whatever run it is on,
           * whether the cells were picked on the grid or the nights were
           * picked in its own field.
           */
          nights={Math.max(overlayNights.length, 1)}
          fixed={Boolean(grid.fixedPrice)}
          /* The field's own pick, mapped back onto the nights on screen. */
          onNights={(range) => {
            const from = dateOf(range.start);
            const to = dateOf(range.end ?? range.start);
            const picked: number[] = [];
            for (let night = 1; night <= month.base.length; night += 1) {
              const on = dateOfNight(month, night);
              if (on >= from && on <= to) picked.push(night);
            }
            if (picked.length) {
              setTypedNights(picked);
              setSelected([]);
            }
          }}
          {...(overlayNights.length === 1
            ? { current: month.base[(overlayNights[0] ?? 1) - 1] ?? 0 }
            : {})}
          {...(nightSeason
            ? {
                season: nightSeason,
                seasonPrice: month.base[(overlayNights[0] ?? 1) - 1] ?? 0,
              }
            : {})}
          {...(overlaySummary ? { summary: overlaySummary } : {})}
          {...(namedSpans.length > 1 ? { spans: namedSpans } : {})}
          already={already}
          onClose={() => {
            setOverlay(null);
            setTypedNights(null);
          }}
          onSave={() => {
            setOverlay(null);
            setTypedNights(null);
            setSelected([]);
            navigate({
              to: "/rate-calendar",
              search: {
                ...(contractParam ? { contract: contractParam } : {}),
                state: "draft" as const,
              },
            });
          }}
          onBreakdown={() => setOverlay("pool")}
          onStatus={() => setOverlay("status")}
        />
      )}

      {overlay === "status" && (
        <NightStatusOverlay
          room={nightCell ? (ar ? nightCell.roomAr : nightCell.room) : undefined}
          date={nightDate}
          fixed={Boolean(grid.fixedPrice)}
          onClose={() => setOverlay(null)}
        />
      )}

      {overlay === "hotel" && (
        <HotelPickerOverlay onClose={() => setOverlay(null)} />
      )}

      {overlay === "prices" && (
        <PricesForOverlay
          value={priceGroup}
          seasoned={seasoned}
          onPick={setPriceGroup}
          onClose={() => setOverlay(null)}
        />
      )}

      {overlay === "contract" && (
        <ContractPickerOverlay
          value={gridContracts.findIndex((item) => item.key === grid.key)}
          onPick={(index) =>
            navigate({
              to: "/rate-calendar",
              search: {
                contract: gridContracts[index]?.key ?? gridContracts[0]!.key,
              },
            })
          }
          onClose={() => setOverlay(null)}
        />
      )}

      {overlay === "months" && (
        <MonthPickerOverlay
          value={Math.max(monthPicker.keys.indexOf(monthKey), 0)}
          onPick={(index) => {
            const next = monthPicker.keys[index] ?? monthKey;
            setMonthKey(next);
            setSpan(wholeMonth(next));
          }}
          onClose={() => setOverlay(null)}
        />
      )}

      {overlay === "review" && (
        <ReviewPublishDrawer onClose={() => setOverlay(null)} />
      )}

      {overlay === "export" && (
        <ExportOverlay onClose={() => setOverlay(null)} />
      )}

      {overlay === "pool" && (
        <PoolBreakdownOverlay
          date={nightDate}
          fixed={Boolean(grid.fixedPrice)}
          onClose={() => setOverlay(null)}
        />
      )}
    </PageShell>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg border px-3 py-1.5 text-xs transition-colors",
        active
          ? "border-brand-deep bg-primary-subtle font-medium text-text-primary"
          : "border-border-default text-text-secondary hover:bg-surface-subtle"
      )}
    >
      {children}
    </button>
  );
}

/** A field that looks like a Select but opens the frame's own picker. */
/** The whole of a yyyy-mm month, which is what the grid opens on. */
function wholeMonth(key: string) {
  const [year, month] = key.split("-").map(Number);
  const last = new Date(year ?? 2026, month ?? 1, 0).getDate();
  const pad = (value: number) => String(value).padStart(2, "0");
  return {
    start: `${year}-${pad(month ?? 1)}-01`,
    end: `${year}-${pad(month ?? 1)}-${pad(last)}`,
  };
}

/**
 * UI 04.1 — From and To. Each opens the same picker on the span the grid
 * is showing, and applying it moves both ends at once.
 */
function DayField({
  label,
  value,
  span,
  onPick,
}: {
  label: string;
  value: string;
  span: { start: string; end: string };
  onPick: (next: { start: string; end: string }) => void;
}) {
  const { lang } = useLanguage();
  const t = datePickerCopy[lang === "ar" ? "ar" : "en"];
  const [open, setOpen] = useState(false);
  const holder = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const away = (event: MouseEvent) => {
      if (!holder.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", away);
    return () => document.removeEventListener("mousedown", away);
  }, [open]);

  const shown = (() => {
    const date = dateOf(value);
    const digits = (input: number) =>
      lang === "ar"
        ? String(input).replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]!)
        : String(input);
    return `${digits(date.getDate())} ${t.monthsShort[date.getMonth()]} ${digits(date.getFullYear())}`;
  })();

  return (
    <div className="w-full" ref={holder}>
      <span className="mb-2 block text-[13px] font-medium leading-[15px] text-text-primary">
        {label}
      </span>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex min-h-11 w-full items-center gap-2 rounded-[10px] border border-border-default bg-surface-default px-4 py-2 text-start transition-colors hover:border-border-strong"
        >
          <span className="min-w-0 flex-1 truncate text-sm text-text-primary">
            {shown}
          </span>
          <ChevronDown
            className="h-4 w-4 shrink-0 text-text-muted"
            aria-hidden="true"
          />
        </button>
        {open && (
          <div className="absolute z-50 mt-2 w-[393px] max-w-[calc(100vw-4rem)] start-0">
            <DatePicker
              className="w-full"
              value={{ start: span.start, end: span.end }}
              onCancel={() => setOpen(false)}
              onApply={(next) => {
                onPick({ start: next.start, end: next.end ?? next.start });
                setOpen(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function PickerField({
  label,
  value,
  onClick,
}: {
  label: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <div className="w-full">
      <span className="mb-2 block text-[13px] font-medium text-text-primary">
        {label}
      </span>
      <button
        type="button"
        onClick={onClick}
        className="flex min-h-11 w-full items-center gap-2 rounded-[10px] border border-border-default bg-surface-default px-4 py-2 text-start transition-colors hover:border-border-strong"
      >
        <span className="min-w-0 flex-1 truncate text-sm text-text-primary">
          {value}
        </span>
        <ChevronDown
          className="h-4 w-4 shrink-0 text-text-muted"
          aria-hidden="true"
        />
      </button>
    </div>
  );
}

/** UI 04.1 — the Show rows / rooms / view columns are checkboxes, not chips. */
/**
 * One of the three questions in the panel above the calendar: an icon in a
 * mist circle, the question, the sentence that says what answering it does,
 * and the controls underneath.
 */
function PanelSection({
  icon: Icon,
  title,
  hint,
  stacked,
  children,
}: {
  icon: LucideIcon;
  title: string;
  hint: string;
  /* On a narrow screen the columns become a stack, and a section that is
     no longer beside a rule needs one above it instead. */
  stacked?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "min-w-0",
        stacked && "border-t border-border-subtle pt-5 lg:border-t-0 lg:pt-0"
      )}
    >
      <div className="flex items-start gap-3.5">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-brand-mist text-brand-mid"
          aria-hidden="true"
        >
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <h3 className="text-[13px] font-semibold uppercase leading-[1.25] tracking-[0.05em] text-text-primary">
            {title}
          </h3>
          <p className="mt-1 text-xs leading-[1.35] text-text-muted">{hint}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

/**
 * The hairline between two questions. It stretches to the tallest column
 * on its own, being a grid item; on a narrow screen it goes away and the
 * sections carry their own rule above them.
 */
function PanelRule() {
  return (
    <span className="hidden w-px bg-border-subtle lg:block" aria-hidden="true" />
  );
}

/**
 * A switch in that panel. It is a bordered pill rather than a bare
 * checkbox: the pills line up into columns, the label cannot drift from
 * its box, and the whole pill is the target - which is what makes this
 * usable on a phone.
 *
 * The box is drawn rather than left to `accent-color`, because the frame
 * gives it a 5px radius and a filled brand green that no browser default
 * matches. The real input stays, invisible, so the keyboard and screen
 * readers still get a checkbox.
 */
function CheckRow({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label
      className={cn(
        "flex min-w-0 cursor-pointer select-none items-center gap-2 rounded-lg border bg-surface-default px-2.5 py-2 transition-colors",
        checked
          ? "border-border-default"
          : "border-border-subtle hover:border-border-default"
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-border-focus peer-focus-visible:ring-offset-1",
          checked
            ? "border-brand-deep bg-brand-deep"
            : "border-border-default bg-surface-default"
        )}
        aria-hidden="true"
      >
        {checked && (
          <Check className="h-2.5 w-2.5 text-white" strokeWidth={4} />
        )}
      </span>
      <span className="truncate text-xs leading-4 text-text-primary" title={label}>
        {label}
      </span>
    </label>
  );
}

/**
 * UI 04.1 - every chip is tinted by what it counts, and the tones are
 * semantic rather than decorative: red for a night that cannot be sold,
 * amber for one that needs looking at. "All" is green because it is the
 * absence of a filter, and it is the only one with no dot and no count.
 */
const CHIP_TONE: Record<string, "success" | "danger" | "warning"> = {
  all: "success",
  soldOut: "danger",
  fewer: "warning",
  stopSale: "danger",
  onRequest: "warning",
  notPublished: "warning",
  notPriced: "warning",
};

/**
 * A filter chip. Off, it is a light pill in its own semantic tone, and the
 * tone is the point: red for what cannot sell, amber for what needs a look.
 *
 * On, it fills dark and the dot keeps its colour - so the one filter doing
 * something reads as a single dark object in a row of quiet ones, and
 * carries the ✕ that turns it off. "All" is the absence of a filter, so off
 * it is plain text rather than a pill: there is nothing to un-set.
 */
function FilterChip({
  tone,
  active,
  onClick,
  label,
  count,
  clearLabel,
}: {
  tone: "success" | "danger" | "warning";
  active: boolean;
  onClick: () => void;
  label: string;
  count?: string | number;
  clearLabel: string;
}) {
  const isAll = tone === "success";
  const dot =
    isAll
      ? "bg-status-success"
      : tone === "danger"
        ? "bg-status-danger"
        : "bg-status-warning";
  const idle = isAll
    ? "text-text-secondary hover:bg-surface-subtle"
    : tone === "danger"
      ? "bg-status-danger-bg text-status-danger"
      : "bg-status-warning-bg text-status-warning";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      title={active ? clearLabel : label}
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-3.5 text-sm font-medium leading-none transition-colors",
        active
          ? isAll
            ? "bg-status-success-bg text-status-success"
            : "bg-surface-inverse text-text-inverse"
          : idle
      )}
    >
      {/* All carries a dot only while it is the filter in force - off, it
          is the plain way back rather than a state of its own. */}
      {(!isAll || active) && (
        <span
          className={cn(
            "h-2 w-2 shrink-0 rounded-full",
            /* The dot keeps its colour on the dark fill - it is what says
               which filter is on without reading the label. */
            active ? dot : "bg-current"
          )}
          aria-hidden="true"
        />
      )}
      {label}
      {/* The count sits in its own badge, a deeper wash of whatever the
          chip is already printing - so it works on the tint and on the
          dark fill without a second rule. */}
      {count !== undefined && (
        <span className="rounded-full bg-current/15 px-1.5 py-0.5 text-[11px] font-semibold leading-none">
          {count}
        </span>
      )}
      {active && !isAll && (
        <span className="text-[13px] leading-none opacity-80" aria-hidden="true">
          {"✕"}
        </span>
      )}
    </button>
  );
}
