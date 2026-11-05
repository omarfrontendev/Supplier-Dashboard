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
import { BackLink, PageShell, SectionCard, StatusPill } from "@/components/layout/page-shell";
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
import { ColourKeyDialog, ThresholdDialog } from "@/components/rate-calendar/colour-key";
import { RateGrid, type GridRowKind } from "@/components/rate-calendar/rate-grid";
import { cn } from "@/lib/utils";
import { winLines } from "@/lib/win-list-data";
import { BulkRangeOverlay } from "@/components/rate-calendar/bulk-range-overlay";
import { Gated } from "@/components/system/permission-gate";
import { fill, useLanguage } from "@/lib/i18n";
import {
  calendarGroups,
  groupRate,
  hasGroupPrices,
  pricesForCopy,
  type CalendarGroupId,
} from "@/lib/nationality-calendar";
import { usePortal } from "@/lib/portal-store";
import {
  arNum,
  contractPicker,
  hotelPicker,
  liveGrid,
  monthPicker,
  selectionBar,
} from "@/lib/rate-overlay-data";
import { useRatesHotels } from "@/api/modules/rates-availability/useRatesHotels";
import { useRatesMetadata } from "@/api/modules/rates-availability/useRatesMetadata";
import { useRestrictionsContext } from "@/api/modules/rates-availability/useRestrictions";
import {
  useSaveSellControls,
  useSellControlTargets,
  useSellControls,
  useSellControlsContext,
} from "@/api/modules/rates-availability/useSellControls";
import { useRatesHotelContracts } from "@/api/modules/rates-availability/useRatesContracts";
import {
  useRateTargets,
  useRateOverrides,
  useRatesContractDetail,
  useRatesContext,
  useSupplementsContext,
  useSaveRateOverrides,
} from "@/api/modules/rates-availability/useRates";
import type { AlreadySet } from "@/lib/bulk-range-data";
import type {
  SellControlOperation,
  SellControlRule,
  RateOverrideRow,
  RateTarget,
  RateTargetsData,
  RatesContractDetail,
} from "@/api/modules/rates-availability/types";
import { getApiErrorMessage } from "@/lib/api-error";
import { notify } from "@/lib/notify";
import { exportRows } from "@/lib/export-rows";
import {
  WEEKEND_DAYS,
  fixedPriceRows,
  gridContracts,
  gridMonths,
  gridRows,
  dateOfNight,
  rowsForMonth,
  type GridRow,
  seasonOf,
  windowFor,
} from "@/lib/rate-grid-data";

export const Route = createFileRoute("/rate-calendar")({
  validateSearch: (
    search: Record<string, unknown>,
  ): {
    contract?: string;
    state?: "draft" | "published";
    rooms?: "unpriced";
  } => ({
    ...(typeof search["contract"] === "string" ? { contract: search["contract"] } : {}),
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
const DAY_NAMES = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const DAY_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_AR = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

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
  const grid = gridContracts.find((item) => item.key === contractParam) ?? gridContracts[0]!;
  const [monthKey, setMonthKey] = useState(grid.month ?? "2026-09");
  const unpricedOnly = roomsParam === "unpriced";
  /* The grid starts and ends on a day, so From and To pick days. */
  const [span, setSpan] = useState(() => wholeMonth(grid.month ?? "2026-09"));
  const month = windowFor(span.start, span.end);
  const holdsNothing = grid.model === "free" || grid.model === "onRequest";
  const hotelsQuery = useRatesHotels();
  const metadataQuery = useRatesMetadata();
  const ratesHotels = hotelsQuery.data ?? [];
  const [hotelId, setHotelId] = useState<number | null>(null);
  const pickedHotel = ratesHotels.find((item) => item.id === hotelId) ?? ratesHotels[0];
  const contractsQuery = useRatesHotelContracts(pickedHotel?.id);
  const hotelContracts = contractsQuery.data ?? [];
  const [contractId, setContractId] = useState<number | null>(null);
  const [includeEnded, setIncludeEnded] = useState(false);
  const shownContracts = hotelContracts.filter(
    (item) => includeEnded || (item.status !== "expired" && item.status !== "terminated"),
  );
  const pickedContract =
    shownContracts.find((item) => item.id === contractId) ?? shownContracts[0];
  const targetsQuery = useRateTargets(pickedContract?.id);
  const rateTargets = targetsQuery.data;
  const live = rateTargets !== undefined && rateTargets.targets.length > 0;
  const weekendDays = live
    ? (rateTargets.weekendDays ?? [])
        .map((day) => DAY_NAMES.indexOf(day.toLowerCase()))
        .filter((day) => day >= 0)
    : WEEKEND_DAYS;
  const detail = useRatesContractDetail(pickedContract?.id).data;
  const liveDetail = live && detail?.id === pickedContract?.id ? detail : undefined;
  const livePools = liveDetail?.inventory.pools ?? [];
  const nightsOf = (variationId: number | null) => {
    const pool =
      livePools.find((item) => item.variationId === variationId) ??
      (variationId === null ? livePools[0] : undefined);
    return new Map((pool?.nights ?? []).map((night) => [night.stayDate, night]));
  };
  const liveModel = liveDetail
    ? liveDetail.bookingType === "on_request"
      ? ("onRequest" as const)
      : liveDetail.inventoryRules?.mode === "free_sale"
        ? ("free" as const)
        : liveDetail.inventoryRules?.mode === "per_room_type"
          ? ("perRoom" as const)
          : ("pool" as const)
    : undefined;
  const fixedPrice = live ? rateTargets.pricingModel === "fixed_per_room" : Boolean(grid.fixedPrice);

  useEffect(() => {
    if (!pickedContract) return;
    const end = wholeMonth(pickedContract.startDate.slice(0, 7)).end;
    setSpan({
      start: pickedContract.startDate,
      end: end < pickedContract.endDate ? end : pickedContract.endDate,
    });
  }, [pickedContract?.id]);

  const monthDates = Array.from({ length: month.base.length }, (_, index) =>
    isoDay(dateOfNight(month, index + 1)),
  );
  const termDates = rateTargets
    ? monthDates.filter((day) => day >= rateTargets.startDate && day <= rateTargets.endDate)
    : [];
  const contextQuery = useRatesContext(
    pickedContract?.id,
    live && termDates.length
      ? {
          targets: rateTargets.targets.map((target) => ({
            variationId: target.variationId,
            ...(target.mealPlan ? { mealPlan: target.mealPlan } : {}),
          })),
          startDate: termDates[0]!,
          endDate: termDates[termDates.length - 1]!,
        }
      : null,
  );
  const supplementsQuery = useSupplementsContext(
    pickedContract?.id,
    live && !fixedPrice && termDates.length
      ? {
          targets: [...new Set(rateTargets.targets.map((target) => target.variationId))].map(
            (variationId) => ({ variationId }),
          ),
          startDate: termDates[0]!,
          endDate: termDates[termDates.length - 1]!,
        }
      : null,
  );
  const saveRates = useSaveRateOverrides(pickedContract?.id);
  const seasonDays = new Set(
    (contextQuery.data?.nights ?? [])
      .filter((night) => night.source === "season")
      .map((night) => night.stayDate),
  ).size;
  const liveSeason = {
    seasonBand: seasonDays ? fill(liveGrid.seasonNights.en, { count: seasonDays }) : null,
    seasonBandAr: seasonDays ? fill(liveGrid.seasonNights.ar, { count: arNum(seasonDays) }) : null,
    seasonHint: null,
    seasonHintAr: null,
  };
  const sellQuery = useSellControlsContext(
    pickedContract?.id,
    live && termDates.length
      ? { allRooms: true, startDate: termDates[0]!, endDate: termDates[termDates.length - 1]! }
      : null,
  );
  const restrictionsQuery = useRestrictionsContext(
    pickedContract?.id,
    live && termDates.length
      ? { allRooms: true, startDate: termDates[0]!, endDate: termDates[termDates.length - 1]! }
      : null,
  );
  const restrictionAt = new Map(
    (restrictionsQuery.data?.cells ?? []).map((cell) => [
      `${cell.variationId}|${cell.stayDate}`,
      cell.restrictions,
    ]),
  );
  const sellAt = new Map(
    (sellQuery.data?.cells ?? []).map((cell) => [`${cell.variationId}|${cell.stayDate}`, cell.override]),
  );
  const liveMeals = (variationId: number, days: string[], rates: number[]) => {
    const nights = (supplementsQuery.data?.nights ?? []).filter(
      (night) => night.variationId === variationId,
    );
    if (!nights.length) return {};
    const byDay = new Map(nights.map((night) => [night.stayDate, night]));
    const types = [
      ...new Set(nights.flatMap((night) => night.meals.filter((meal) => meal.enabled).map((meal) => meal.type))),
    ];
    if (!types.length) return {};
    const guests = 2;
    const short = (lang: "en" | "ar") =>
      types.map((type) => liveGrid.mealShort[type]?.[lang] ?? type).join(lang === "ar" ? "، " : ", ");
    return {
      mealLabel: {
        en: fill(liveGrid.plusMealsLive.en, { meals: short("en") }),
        ar: fill(liveGrid.plusMealsLive.ar, { meals: short("ar") }),
      },
      meals: types.map((type) => {
        const first = nights.flatMap((night) => night.meals).find((meal) => meal.type === type && meal.enabled);
        const price = first?.price ?? 0;
        const perPerson = first?.pricingBasis !== "per_room";
        const name = (lang: "en" | "ar") =>
          fill(liveGrid.mealFor[lang], {
            meal: liveGrid.meals[type]?.[lang] ?? type,
            guests: lang === "ar" ? arNum(guests) : guests,
          });
        const meta = (lang: "en" | "ar") =>
          fill((perPerson ? liveGrid.mealPerPerson : liveGrid.mealPerRoom)[lang], {
            price: lang === "ar" ? arNum(price) : price,
            guests: lang === "ar" ? arNum(guests) : guests,
          });
        return {
          key: type,
          name: { en: name("en"), ar: name("ar") },
          meta: { en: meta("en"), ar: meta("ar") },
          totals: days.map((day, index) => {
            const meal = byDay.get(day)?.meals.find((item) => item.type === type);
            if (!meal?.enabled || meal.price === null) return null;
            return (rates[index] ?? 0) + (meal.pricingBasis === "per_room" ? meal.price : meal.price * guests);
          }),
        };
      }),
    };
  };
  const liveRows: GridRow[] = live
    ? rateTargets.targets.map((target) => {
        const nights = (contextQuery.data?.nights ?? []).filter(
          (night) =>
            night.variationId === target.variationId &&
            (night.mealPlan ?? undefined) === target.mealPlan,
        );
        const byDay = new Map(nights.map((night) => [night.stayDate, night]));
        const view = liveGrid.views[target.view];
        const meal = target.mealPlan ? liveGrid.meals[target.mealPlan] : undefined;
        const name = (lang: "en" | "ar") =>
          [
            (lang === "ar" ? target.roomNameAr : target.roomNameEn) ||
              target.roomNameEn ||
              target.roomNameAr ||
              `#${target.roomId}`,
            meal?.[lang],
            view?.[lang] ?? target.view,
          ]
            .filter(Boolean)
            .join(" · ");
        const supplement = nights[0]?.roomSupplement.amount ?? 0;
        const roomNights = liveModel === "perRoom" ? nightsOf(target.variationId) : null;
        const cap = liveDetail?.inventory.caps.find((item) => item.variationId === target.variationId);
        const capByDay = new Map((cap?.nights ?? []).map((night) => [night.stayDate, night.maxRooms]));
        const contractPrice = liveDetail?.resolvedRoomPrices?.find(
          (item) =>
            item.variationId === target.variationId &&
            (!target.mealPlan || !item.mealPlan || item.mealPlan === target.mealPlan),
        )?.price;
        const meta = (lang: "en" | "ar") => {
          const num = (value: number) => (lang === "ar" ? arNum(value) : String(value));
          if (!liveDetail)
            return fill(
              (target.kind === "base"
                ? liveGrid.base
                : fixedPrice
                  ? liveGrid.fixed
                  : liveGrid.supplement)[lang],
              { currency: rateTargets.currency, amount: num(supplement) },
            );
          const lead =
            target.kind === "base"
              ? liveGrid.baseLine[lang]
              : fixedPrice
                ? liveGrid.fixedLine[lang]
                : fill(liveGrid.supplementLine[lang], { amount: num(supplement) });
          const price = contractPrice
            ? "weekday" in contractPrice
              ? fill(liveGrid.weekdayWeekend[lang], {
                  weekday: num(contractPrice.weekday),
                  weekend: num(contractPrice.weekend),
                })
              : fill(liveGrid.everyNight[lang], { amount: num(contractPrice.amount) })
            : null;
          const capped = cap?.nights[0]
            ? fill(liveGrid.cappedAt[lang], { count: num(cap.nights[0].maxRooms) })
            : null;
          return [lead, price, capped].filter(Boolean).join(" · ");
        };
        return {
          name: name("en"),
          nameAr: name("ar"),
          meta: meta("en"),
          metaAr: meta("ar"),
          base: target.kind === "base",
          supplement,
          guests: 2,
          rate: monthDates.map((day) => byDay.get(day)?.roomAmount ?? 0),
          edited: monthDates.flatMap((day, index) =>
            byDay.get(day)?.source === "daily_override" ? [index + 1] : [],
          ),
          ...liveMeals(
            target.variationId,
            monthDates,
            monthDates.map((day) => byDay.get(day)?.roomAmount ?? 0),
          ),
          inventoryLabel: cap && !roomNights ? ("left" as const) : ("sold" as const),
          ...(cap && !roomNights ? { cap: cap.nights[0]?.maxRooms ?? 0 } : {}),
          inventory: monthDates.map((day) =>
            roomNights
              ? (roomNights.get(day)?.capacity ?? 0)
              : cap
                ? (capByDay.get(day) ?? 0)
                : 0,
          ),
          status: monthDates.map((day) => {
            const override = sellAt.get(`${target.variationId}|${day}`);
            return override?.status === "stop_sale" ? "SS" : override?.status === "on_request" ? "RQ" : "·";
          }),
          release: monthDates.map(() => 0),
          ...(restrictionsQuery.data
            ? {
                minNights: monthDates.map((day) => {
                  const rule = restrictionAt.get(`${target.variationId}|${day}`);
                  if (!rule) return "-";
                  if (rule.checkIn === "closed") return "no in";
                  if (rule.checkOut === "closed") return "no out";
                  return rule.minNights > 0 ? String(rule.minNights) : "-";
                }),
              }
            : {}),
          target: {
            variationId: target.variationId,
            ...(target.mealPlan ? { mealPlan: target.mealPlan } : {}),
          },
        };
      })
    : [];
  const monthRows = live
    ? liveRows
    : grid.fixedPrice
      ? fixedPriceRows
      : month.key === "2026-09"
        ? gridRows
        : rowsForMonth(month);
  // UI 04.1U — priced rooms first, the ones with no rate underneath them.
  const unpriced = live ? [] : (grid.unpriced ?? []);
  const allRows = unpriced.length
    ? [
        ...monthRows.filter((row) => !unpriced.includes(row.name)),
        ...monthRows.filter((row) => unpriced.includes(row.name)),
      ].map((row) =>
        unpriced.includes(row.name)
          ? { ...row, meta: t.noRateYet, metaAr: t.noRateYet, unpriced: true }
          : {
              ...row,
              meta: row.base
                ? `BASE · ${t.seasonPriced}`
                : `${row.meta.split(" · ")[0]} · ${t.seasonPriced}`,
            },
      )
    : monthRows;
  const contract =
    contracts.find((item) => item.id === grid.key) ??
    contracts.find((item) => item.state === "active");

  const [show, setShow] = useState<Record<GridRowKind, boolean>>({
    rate: true,
    inventory: true,
    status: true,
    restrictions: true,
    release: true,
  });
  const [visibleRooms, setVisibleRooms] = useState<string[]>(allRows.map((row) => row.name));
  const rowNames = allRows.map((row) => row.name).join("|");
  const roomsKey = live ? `rates-calendar-rooms:${pickedContract!.id}` : null;
  useEffect(() => {
    const names = rowNames ? rowNames.split("|") : [];
    setVisibleRooms(names);
    if (!roomsKey) return;
    try {
      const kept = JSON.parse(localStorage.getItem(roomsKey) ?? "null");
      if (Array.isArray(kept)) setVisibleRooms(names.filter((name) => kept.includes(name)));
    } catch {
      return;
    }
  }, [rowNames, roomsKey]);
  const pickRooms = (next: string[] | ((prev: string[]) => string[])) =>
    setVisibleRooms((prev) => {
      const value = typeof next === "function" ? next(prev) : next;
      if (roomsKey) {
        try {
          localStorage.setItem(roomsKey, JSON.stringify(value));
        } catch {
          return value;
        }
      }
      return value;
    });
  const [openMeals, setOpenMeals] = useState<string[]>([]);
  const [colourKey, setColourKey] = useState(false);
  const [threshold, setThreshold] = useState(4);
  const [thresholdOpen, setThresholdOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [hidePast, setHidePast] = useState(false);
  const [pickup, setPickup] = useState(false);
  const [selectCells, setSelectCells] = useState(false);
  const hasPast = month.today > 1;
  const [selected, setSelected] = useState<string[]>([]);
  const [filter, setFilter] = useState("all");
  const hotelLabel = pickedHotel
    ? (ar ? pickedHotel.nameAr : pickedHotel.nameEn) || pickedHotel.nameEn || pickedHotel.nameAr || ""
    : hotelsQuery.isPending
      ? hotelPicker.loading[k]
      : "";
  const contractLabel = pickedContract
    ? pickedContract.name
    : contractsQuery.isFetching
      ? contractPicker.loading[k]
      : "";
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
  const overridesQuery = useRateOverrides(pickedContract?.id, live && overlay === "bulk");
  const sellTargets = useSellControlTargets(
    live && (overlay === "stopSale" || overlay === "status") ? pickedContract?.id : undefined,
  );
  const sellRules = useSellControls(pickedContract?.id, live && overlay === "stopSale");
  const saveSell = useSaveSellControls(pickedContract?.id);
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
  const nightWeekend = nightOn ? weekendDays.includes(nightOn.getDay()) : false;
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
  const pickedNights = selected.map((key) => Number(key.split("|")[1])).sort((a, b) => a - b);
  const nightRow = allRows.find((row) => row.name === (pickedRooms[0] ?? nightCell?.room));
  const pickedTargets = () =>
    allRows
      .filter((row) => (pickedRooms.length ? pickedRooms : [nightCell?.room]).includes(row.name))
      .flatMap((row) => (row.target ? [row.target as RateTarget] : []));
  /*
   * OV 04.6H / 04.6N - what the nights being priced already carry, read
   * off the month itself rather than assumed: which of them were edited,
   * how many rooms are already booked on them, and whether they sit in a
   * season. Each band on the overlay only appears when its answer is yes.
   */
  const overlayNights =
    typedNights ?? (pickedNights.length ? pickedNights : nightCell ? [nightCell.night] : []);
  const nightSeason =
    !live && overlayNights.length ? seasonOf(dateOfNight(month, overlayNights[0]!)) : null;
  /*
   * OV 04.6G / 04.6O - a run of nights can cross a season boundary. The
   * spans are collected in the order the nights run, so the band can name
   * each season with the nights that belong to it.
   */
  const seasonSpans = overlayNights.reduce<
    Array<{ name: { en: string; ar: string } | null; nights: number[] }>
  >((spans, night) => {
    const season = live ? null : seasonOf(dateOfNight(month, night));
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
        const day = (date: Date) => (ar ? arNum(date.getDate()) : String(date.getDate()));
        const name = (date: Date) => (ar ? DAY_AR[date.getDay()] : DAY_EN[date.getDay()]);
        const sameMonth = first.getMonth() === last.getMonth();
        const year = ar ? arNum(last.getFullYear()) : String(last.getFullYear());
        const weekend = overlayNights
          .map((night) => dateOfNight(month, night))
          .filter((date) => weekendDays.includes(date.getDay()))
          .map((date) =>
            ar ? `${DAY_AR[date.getDay()]} ${day(date)}` : `${DAY_EN[date.getDay()]} ${day(date)}`,
          );
        /* OV 04.6L - the weekday is named too, not only counted. */
        const weekdayList = overlayNights
          .map((night) => dateOfNight(month, night))
          .filter((date) => !weekendDays.includes(date.getDay()))
          .map((date) =>
            ar ? `${DAY_AR[date.getDay()]} ${day(date)}` : `${DAY_EN[date.getDay()]} ${day(date)}`,
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
  const nightFacts = (row: GridRow) => {
    const nightsShown = overlayNights.length ? overlayNights : [1];
    const first = nightsShown[0]!;
    const day = isoDay(dateOfNight(month, first));
    const num = (value: number) => (ar ? arNum(value) : String(value));
    const contract =
      liveDetail?.resolvedRoomPrices?.find(
        (item) =>
          item.variationId === row.target!.variationId &&
          (!row.target!.mealPlan || !item.mealPlan || item.mealPlan === row.target!.mealPlan),
      )?.price ?? null;
    const meals = (supplementsQuery.data?.nights ?? []).find(
      (night) => night.variationId === row.target!.variationId && night.stayDate === day,
    );
    const capacity = nightsOf(null).get(day)?.capacity ?? null;
    const statusCode = row.status[first - 1];
    const minValue = row.minNights?.[first - 1] ?? "-";
    const unit = (basis: string | null) =>
      basis === "per_room" ? liveGrid.perRoomUnit[k] : liveGrid.perPersonUnit[k];
    return {
      contract: contract as { weekday: number; weekend: number } | { amount: number } | null,
      supplements: (meals?.meals ?? [])
        .filter((meal) => meal.enabled && meal.price !== null)
        .map((meal) => ({
          label: liveGrid.meals[meal.type]?.[k] ?? meal.type,
          value: `+${num(meal.price ?? 0)} ${rateTargets?.currency ?? ""} ${unit(meal.pricingBasis)}`,
        })),
      pool:
        capacity === null
          ? liveGrid.noStock[k]
          : fill(liveGrid.poolOfNight[k], { count: num(capacity) }),
      status:
        statusCode === "SS"
          ? liveGrid.stopSaleValue[k]
          : statusCode === "RQ"
            ? liveGrid.onRequestValue[k]
            : liveGrid.openSaleValue[k],
      minNights:
        minValue === "no in"
          ? liveGrid.checkInClosed[k]
          : minValue === "no out"
            ? liveGrid.checkOutClosed[k]
            : minValue === "-"
              ? liveGrid.poolNone[k]
              : num(Number(minValue)),
      release: contractTerms(liveDetail!, rateTargets!, k)[3]!,
    };
  };
  const overlayRow = allRows.find((row) => row.name === (pickedRooms[0] ?? nightCell?.room));
  const already = {
    changed: overlayNights
      .filter((night) =>
        live ? (overlayRow?.edited ?? []).includes(night) : month.editedNights.includes(night),
      )
      .map((night) => ({
        when: { en: nightLabel(night), ar: nightLabel(night) },
        price: (live ? overlayRow?.rate[night - 1] : month.base[night - 1]) ?? 0,
      })),
    /* The grid carries no per-night stop sale yet, so this stays empty
       until it does - the band simply does not draw. */
    closed: [] as Array<{ en: string; ar: string }>,
    booked: live
      ? 0
      : overlayNights.reduce((sum, night) => sum + (month.baseSold[night - 1] ?? 0), 0),
  };

  const pickedRange = pickedNights.length
    ? (() => {
        const first = dateOfNight(month, pickedNights[0]!);
        const last = dateOfNight(month, pickedNights[pickedNights.length - 1]!);
        const day = (date: Date) => (ar ? arNum(date.getDate()) : String(date.getDate()));
        const short = (date: Date) => datePickerCopy[k].monthsShort[date.getMonth()];
        return first.getTime() === last.getTime()
          ? `${day(first)} ${short(first)}`
          : first.getMonth() === last.getMonth()
            ? `${day(first)} - ${day(last)} ${short(last)}`
            : `${day(first)} ${short(first)} - ${day(last)} ${short(last)}`;
      })()
    : "";

  /*
   * UI 04.1TGCC / TIM / TPK - the same grid, priced for one nationality.
   * Only the rate line changes: inventory, stop sale, restrictions and
   * release belong to the room, not to who is sleeping in it (BR-03-94).
   */
  const rows = allRows
    .filter(
      (row) => visibleRooms.includes(row.name) && (!unpricedOnly || unpriced.includes(row.name)),
    )
    .map((row) =>
      priceGroup === "everyone"
        ? row
        : {
            ...row,
            rate: row.rate.map((value, index) => {
              const on = dateOfNight(month, index + 1);
              return groupRate(priceGroup, row.name, on, weekendDays.includes(on.getDay()), value);
            }),
          },
    );

  /* OV 04.1PN0 - a window with no season priced by nationality. */
  const seasoned = hasGroupPrices(
    Array.from({ length: month.base.length }, (_, index) => dateOfNight(month, index + 1)),
  );
  const group = calendarGroups.find((item) => item.id === priceGroup) ?? calendarGroups[0]!;

  const gridModel = liveModel ?? grid.model;
  const poolLeftAt = (night: number) =>
    gridModel !== "pool"
      ? null
      : liveDetail
        ? (nightsOf(null).get(monthDates[night - 1]!)?.capacity ?? null)
        : (month.poolLeft[night - 1] ?? null);
  const roomLeftAt = (row: GridRow, night: number) =>
    gridModel === "perRoom" || row.inventoryLabel === "left" ? (row.inventory[night - 1] ?? null) : null;
  const isLow = (left: number | null, key: string) =>
    left !== null && (key === "soldOut" ? left === 0 : left > 0 && left <= threshold);
  const cellMatches = (key: string, night: number, row?: GridRow) => {
    if (key === "soldOut" || key === "fewer")
      return isLow(poolLeftAt(night), key) || (row ? isLow(roomLeftAt(row, night), key) : false);
    if (!row) return false;
    if (key === "stopSale") return row.status[night - 1] === "SS";
    if (key === "onRequest") return row.status[night - 1] === "RQ";
    if (key === "notPublished") return !live && month.editedNights.includes(night);
    if (key === "notPriced") return unpriced.includes(row.name);
    return true;
  };
  const shownNights = Array.from({ length: month.nights }, (_, index) => index + 1).filter(
    (night) => !month.today || night >= month.today,
  );
  const nightsMatching = (key: string) =>
    shownNights.filter(
      (night) => cellMatches(key, night) || allRows.some((row) => cellMatches(key, night, row)),
    ).length;
  const counts = {
    all: allRows.length,
    ...(liveDetail
      ? {
          soldOut: nightsMatching("soldOut"),
          fewer: nightsMatching("fewer"),
          stopSale: nightsMatching("stopSale"),
          onRequest: nightsMatching("onRequest"),
          notPublished: 0,
        }
      : month.key === "2026-09"
        ? grid.counts
        : month.counts),
  };
  const activeCount =
    filter === "all"
      ? null
      : filter === "notPriced"
        ? unpriced.length
        : counts[filter as keyof typeof counts];
  const fade =
    filter === "all"
      ? undefined
      : (night: number, room?: string) => {
          const row = room ? allRows.find((item) => item.name === room) : undefined;
          return !(cellMatches(filter, night) || (row ? cellMatches(filter, night, row) : false));
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
              hotel: live ? hotelLabel : ar ? grid.hotelAr : grid.hotel,
              id: live ? `#${pickedContract!.id}` : grid.ref,
            })}
          </p>
          <div className="mt-0.5 flex flex-wrap items-center gap-3">
            <h1 className="text-[28px] font-semibold leading-7 text-text-primary">{t.title}</h1>
            {live ? (
              <StatusPill status={contractPicker.status[pickedContract!.status].en}>
                {contractPicker.status[pickedContract!.status][k]}
              </StatusPill>
            ) : (
              <StatusPill status={grid.status}>{ar ? grid.statusAr : grid.status}</StatusPill>
            )}
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
        {live ? null : grid.readOnly ? (
          <StatusPill tone="neutral">{ar ? grid.publishStateAr : grid.publishState}</StatusPill>
        ) : (
          <Gated
            permission="rates.publish"
            ask={{ hotel: grid.hotel }}
            instead={
              <p className="max-w-[220px] text-xs leading-5 text-text-muted">
                {ar ? "اطلب من شخص يملك صلاحية النشر." : "Ask someone who can publish."}
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
          <p className="text-sm leading-relaxed text-text-secondary">{t.endedBanner}</p>
        </div>
      )}

      {grid.notStarted && (
        <div className="mb-4 rounded-xl border border-status-info/25 bg-status-info-bg p-4">
          <p className="text-sm leading-relaxed text-text-secondary">{t.notStarted}</p>
        </div>
      )}

      {state === "published" && (
        <div className="mb-4 flex gap-3 rounded-xl border border-status-success/25 bg-status-success-bg p-4">
          <Check className="mt-0.5 h-5 w-5 shrink-0 text-status-success" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-text-secondary">{t.publishedBanner}</p>
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
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[260px_340px_210px_minmax(0,1fr)]">
          {/* OV 04.10 / 04.9 / 04.8 - each field opens the frame behind it. */}
          <PickerField
            label={t.hotel}
            value={hotelLabel}
            onClick={() => setOverlay("hotel")}
          />
          <PickerField
            label={t.contract}
            value={contractLabel}
            onClick={() => setOverlay("contract")}
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
            <span className="text-sm leading-[18px] text-text-secondary">{t.includeEnded}</span>
          </label>
        </div>

        {/* UI 04.1 — the contract's terms read as one band under the pickers. */}
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-surface-subtle px-3 py-2.5">
          <span className="text-overline me-1.5 text-text-muted">{t.fromContract}</span>
          {(liveDetail && rateTargets
            ? contractTerms(liveDetail, rateTargets, k)
            : (ar ? grid.summaryAr : grid.summary)
          )
            .map((line, index, all) =>
              index === all.length - 1 && !grid.readOnly && !liveDetail
                ? ar
                  ? month.seasonLineAr
                  : month.seasonLine
                : line,
            )
            .map((line) => (
              <span
                key={line}
                className="rounded-full bg-surface-default px-3 py-1.5 text-xs text-text-secondary"
              >
                {line}
              </span>
            ))}
          {live ? (
            <Link
              to="/rate-contracts/$contractId/edit"
              params={{ contractId: String(pickedContract!.id) }}
              className="px-1 text-xs font-medium text-text-primary hover:underline"
            >
              {t.openContract}
            </Link>
          ) : (
            <Link
              to="/rate-contracts/$contractId"
              params={{ contractId: contract?.id ?? grid.key }}
              className="px-1 text-xs font-medium text-text-primary hover:underline"
            >
              {t.openContract}
            </Link>
          )}
        </div>
      </SectionCard>

      {/*
       * UI 04.1TGCC / TIM / TPK - the band that says what is on screen.
       * It reads as a whole sentence because half of it is the part people
       * get wrong: the group's price stops when the season does.
       */}
      {group.banner && (
        <div className="mb-5 rounded-xl bg-[#edffd6] p-3.5">
          <p className="text-[12.5px] font-semibold text-text-primary">{group.banner.title[k]}</p>
          <p className="mt-0.5 text-[12px] leading-5 text-text-body">{group.banner.body[k]}</p>
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
          <PanelSection icon={PanelsTopLeft} title={t.showRows} hint={t.showRowsHint}>
            {/* Sized to their labels: these five are not a column of equals. */}
            <div className="flex flex-wrap gap-x-2.5 gap-y-3">
              {(
                [
                  ["rate", t.rowRates],
                  /* UI 04.1S / 04.1Q - both rows stay, named for what they
                     cannot do on a contract that holds no rooms. */
                  ["inventory", holdsNothing ? t.rowInventoryUnused : t.rowInventory],
                  ["status", t.rowStatus],
                  ["restrictions", t.rowRestrictions],
                  ["release", holdsNothing ? t.rowReleaseUnused : t.rowRelease],
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

          <PanelSection icon={Bed} title={t.showRooms} hint={t.showRoomsHint} stacked>
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
                  pickRooms(
                    visibleRooms.length === allRows.length ? [] : allRows.map((row) => row.name),
                  )
                }
                label={fill(t.allRooms, { count: allRows.length })}
              />
              {allRows.map((row) => (
                <CheckRow
                  key={row.name}
                  checked={visibleRooms.includes(row.name)}
                  onChange={() =>
                    pickRooms((prev) =>
                      prev.includes(row.name)
                        ? prev.filter((name) => name !== row.name)
                        : [...prev, row.name],
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
              <CheckRow
                checked={hidePast && hasPast}
                onChange={() => setHidePast(!hidePast)}
                label={t.hidePast}
                disabled={!hasPast}
                hint={hasPast ? undefined : liveGrid.noPastNights[k]}
              />
              <CheckRow
                checked={pickup && !live}
                onChange={() => setPickup(!pickup)}
                label={t.pickup}
                disabled={live}
                hint={live ? liveGrid.noBookingData[k] : undefined}
              />
              <CheckRow
                checked={selectCells}
                onChange={() => setSelectCells(!selectCells)}
                label={t.selectCells}
              />
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
          <Button variant="dark" className="rounded-full" onClick={() => setOverlay("bulk")}>
            <Layers className="h-[18px] w-[18px]" aria-hidden="true" />
            {t.bulkRates}
          </Button>
          <Button variant="outline" className="rounded-full" onClick={() => setOverlay("stopSale")}>
            <Ban className="h-[18px] w-[18px]" aria-hidden="true" />
            {t.bulkStatus}
          </Button>
          <Button variant="outline" className="rounded-full" onClick={() => setOverlay("release")}>
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
            <span className="hidden h-6 w-px bg-border-subtle sm:block" aria-hidden="true" />
            <Button variant="outline" className="rounded-full" onClick={() => setOverlay("export")}>
              <Upload className="h-[18px] w-[18px]" aria-hidden="true" />
              {t.export}
            </Button>
          </div>
        </div>

        <div className="my-4 h-px bg-border-subtle" aria-hidden="true" />

        <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:w-[360px] lg:grid-cols-[repeat(2,minmax(0,1fr))]">
          <DayField
            label={t.from}
            value={span.start}
            span={span}
            weekend={weekendDays}
            onPick={(next) => setSpan(next)}
          />
          <DayField
            label={t.to}
            value={span.end}
            span={span}
            weekend={weekendDays}
            onPick={(next) => setSpan(next)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              ["all", t.filterAll, counts.all],
              ["soldOut", t.filterSoldOut, counts.soldOut],
              ["fewer", t.filterFewer.replace("4", String(threshold)), counts.fewer],
              ["stopSale", t.filterStopSale, counts.stopSale],
              ["onRequest", t.filterOnRequest, counts.onRequest],
              [
                "notPublished",
                t.filterNotPublished,
                state === "published" ? 0 : counts.notPublished,
              ],
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
            <span className="hidden h-6 w-px bg-border-subtle sm:block" aria-hidden="true" />
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
          <Lightbulb className="h-5 w-5 shrink-0 text-status-warning" aria-hidden="true" />
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

      {!live && filter === "all" && grid.counts.fewer > 0 && month.key === "2026-09" && !unpriced.length && (
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
                  setSelected(rows.flatMap((row) => [`${row.name}|24`, `${row.name}|25`]))
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
            {fill(pickedRooms.length === 1 ? selectionBar.countOneRoom[k] : selectionBar.count[k], {
              count: ar ? arNum(selected.length) : selected.length,
              rooms: ar ? arNum(pickedRooms.length) : pickedRooms.length,
              range: pickedRange,
            })}
          </p>
          {/* The three things to do with a selection stay together and
              wrap among themselves, rather than each claiming a row. */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setOverlay(pickedRooms.length === 1 ? "night" : "bulk")}
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

      {activeCount === 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-3 rounded-xl bg-surface-subtle px-4 py-3">
          <p className="min-w-0 flex-1 text-[12.5px] text-text-secondary">{liveGrid.nothingMatches[k]}</p>
          <button
            type="button"
            onClick={() => setFilter("all")}
            className="px-1 text-xs font-medium text-text-link hover:underline"
          >
            {liveGrid.clearFilter[k]}
          </button>
        </div>
      )}

      <RateGrid
        rows={rows}
        fade={fade}
        show={
          live
            ? {
                ...show,
                inventory: show.inventory && liveDetail !== undefined,
                status: show.status && sellQuery.data !== undefined,
                restrictions: show.restrictions && restrictionsQuery.data !== undefined,
                release: false,
              }
            : show
        }
        compact={compact}
        hidePast={hidePast && hasPast}
        model={gridModel}
        fixedPrice={fixedPrice}
        currency={rateTargets?.currency}
        weekendDays={weekendDays}
        poolNote={liveDetail && livePools.length === 0 ? liveGrid.noStock[k] : undefined}
        pool={liveDetail ? liveDetail.inventoryRules?.roomsPerNight : grid.pool}
        perRoomCaps={
          liveDetail
            ? Object.fromEntries(
                allRows.map((row) => [
                  row.name,
                  row.target ? (nightsOf(row.target.variationId).values().next().value?.capacity ?? 0) : 0,
                ]),
              )
            : grid.perRoomCaps
        }
        month={
          liveDetail
            ? {
                ...month,
                poolLeft: monthDates.map((day) => nightsOf(null).get(day)?.capacity ?? -1),
                ...liveSeason,
              }
            : month
        }
        openMeals={openMeals}
        onOpenMeals={(room) =>
          setOpenMeals((prev) =>
            prev.includes(room) ? prev.filter((name) => name !== room) : [...prev, room],
          )
        }
        selected={selected}
        selecting={selectCells}
        pickup={pickup && !live}
        onToggle={(key) =>
          setSelected((prev) =>
            prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
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
          {(liveDetail && rateTargets
            ? [
                fill(liveGrid.knowPrices[k], { currency: rateTargets.currency }),
                fill(liveGrid.knowWeekend[k], {
                  days: weekendDays
                    .map((day) => liveGrid.terms.days[DAY_NAMES[day]!]?.[k] ?? "")
                    .join(ar ? " و" : ", "),
                }),
                contractTerms(liveDetail, rateTargets, k)[3]!,
                liveGrid.knowEdited[k],
              ]
            : [
                ...(ar ? grid.legendAr : grid.legend),
                /* UI 04.1T / H / J — a season month says where its price comes from. */
                ...((ar ? month.legendLineAr : month.legendLine)
                  ? [(ar ? month.legendLineAr : month.legendLine) as string]
                  : []),
              ]
          ).map((line) => (
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
          contract={(live ? pickedContract!.name : ar ? grid.nameAr : grid.name).toUpperCase()}
          {...(live && overlay === "bulk"
            ? {
                roomOptions: allRows.map((row) => ({ en: row.name, ar: row.nameAr })),
                existing: overrideRuns(overridesQuery.data ?? [], allRows, rateTargets.currency),
                onRemoveExisting: async (row) => {
                  const run = row.id ? JSON.parse(row.id) : null;
                  if (!run) return;
                  try {
                    await saveRates.mutateAsync([
                      {
                        action: "remove",
                        targets: [
                          {
                            variationId: run.variationId,
                            ...(run.mealPlan ? { mealPlan: run.mealPlan } : {}),
                          },
                        ],
                        dates: run.dates,
                      },
                    ]);
                    notify.success(liveGrid.restored[k]);
                  } catch (error) {
                    notify.error(getApiErrorMessage(error));
                  }
                },
                onApplyRates: async (value) => {
                  if (!rateTargets.eligible) {
                    notify.error(liveGrid.notEligible[k]);
                    throw new Error("not eligible");
                  }
                  try {
                    await saveRates.mutateAsync([
                      {
                        action: "set",
                        basis: fixedPrice ? "selected_room_total" : "base_plus_room_supplement",
                        rate: value.rate,
                        targets: allRows
                          .filter((row) => value.rooms.includes(row.name))
                          .flatMap((row) => (row.target ? [row.target as RateTarget] : [])),
                        startDate: value.range.start,
                        endDate: value.range.end ?? value.range.start,
                        ...(value.weekdays.length < 7 ? { weekdays: value.weekdays } : {}),
                      },
                    ]);
                    notify.success(liveGrid.saved[k]);
                  } catch (error) {
                    notify.error(getApiErrorMessage(error));
                    throw error;
                  }
                },
              }
            : {})}
          {...(live && overlay === "stopSale"
            ? {
                roomOptions: allRows
                  .filter(
                    (row, index, list) =>
                      list.findIndex((item) => item.target?.variationId === row.target?.variationId) === index,
                  )
                  .map((row) => ({ en: row.name, ar: row.nameAr })),
                needsSla: !sellTargets.data?.onRequestSettings,
                existing: sellRuleRows(sellRules.data ?? [], allRows),
                onRemoveExisting: async (row) => {
                  try {
                    await saveSell.mutateAsync([{ action: "remove", ruleId: Number(row.id) }]);
                    notify.success(liveGrid.sellSaved[k]);
                  } catch (error) {
                    notify.error(getApiErrorMessage(error));
                  }
                },
                onApplyStatus: async (lines) => {
                  if (!sellTargets.data?.eligible) {
                    notify.error(liveGrid.notEligible[k]);
                    throw new Error("not eligible");
                  }
                  const ids = (names: string[]) => [
                    ...new Set(
                      allRows
                        .filter((row) => names.includes(row.name))
                        .flatMap((row) => (row.target ? [row.target.variationId] : [])),
                    ),
                  ];
                  const operations: SellControlOperation[] = lines.flatMap((line): SellControlOperation[] => {
                    if (line.ruleId !== undefined) {
                      if (line.status === "openSale")
                        return [{ action: "remove" as const, ruleId: line.ruleId }];
                      const dates = [
                        ...new Set(
                          line.ranges.flatMap((range) => {
                            const out: string[] = [];
                            const day = new Date(`${range.start}T00:00:00`);
                            const last = new Date(`${range.end ?? range.start}T00:00:00`);
                            while (day <= last) {
                              if (line.weekdays.includes(day.getDay())) out.push(isoDay(day));
                              day.setDate(day.getDate() + 1);
                            }
                            return out;
                          }),
                        ),
                      ].sort();
                      return [
                        {
                          action: "edit" as const,
                          ruleId: line.ruleId,
                          status: line.status === "stopSale" ? ("stop_sale" as const) : ("on_request" as const),
                          ...(line.allRooms ? { allRooms: true as const } : { variationIds: ids(line.rooms) }),
                          dates,
                          ...(line.sla ? { onRequestSettings: line.sla } : {}),
                        },
                      ];
                    }
                    return line.ranges.map((range) => {
                      const scope = {
                        ...(line.allRooms ? { allRooms: true as const } : { variationIds: ids(line.rooms) }),
                        startDate: range.start,
                        endDate: range.end ?? range.start,
                        ...(line.weekdays.length < 7 ? { weekdays: line.weekdays } : {}),
                      };
                      return line.status === "openSale"
                        ? { action: "open_sale" as const, ...scope }
                        : {
                            action: "create" as const,
                            status: line.status === "stopSale" ? ("stop_sale" as const) : ("on_request" as const),
                            ...scope,
                            ...(line.sla ? { onRequestSettings: line.sla } : {}),
                          };
                    });
                  });
                  try {
                    await saveSell.mutateAsync(operations);
                    notify.success(liveGrid.sellSaved[k]);
                  } catch (error) {
                    notify.error(getApiErrorMessage(error));
                    throw error;
                  }
                },
              }
            : {})}
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
          fixed={fixedPrice}
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
          {...(live && nightRow
            ? {
                current:
                  nightRow.rate[
                    (overlayNights.find((night) =>
                      overlayNights.length === 1
                        ? true
                        : weekendDays.includes(dateOfNight(month, night).getDay()),
                    ) ?? overlayNights[0] ?? 1) - 1
                  ] ?? 0,
                currentWeekday:
                  nightRow.rate[
                    (overlayNights.find(
                      (night) => !weekendDays.includes(dateOfNight(month, night).getDay()),
                    ) ?? overlayNights[0] ?? 1) - 1
                  ] ?? 0,
              }
            : overlayNights.length === 1
              ? { current: month.base[(overlayNights[0] ?? 1) - 1] ?? 0 }
              : {})}
          saving={saveRates.isPending}
          currency={rateTargets?.currency}
          {...(live && nightRow?.target && liveDetail ? { live: nightFacts(nightRow) } : {})}
          {...(live
            ? {
                weekendNames: {
                  en: weekendDays.map((day) => liveGrid.terms.days[DAY_NAMES[day]!]?.en ?? "").join(", "),
                  ar: weekendDays.map((day) => liveGrid.terms.days[DAY_NAMES[day]!]?.ar ?? "").join(" و"),
                },
              }
            : {})}
          {...(live && !rateTargets.eligible ? { saveBlocked: liveGrid.notEligible[k] } : {})}
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
          onSave={(value) => {
            if (live) {
              const targets = pickedTargets();
              saveRates.mutate(
                [
                  {
                    action: "set",
                    basis: "selected_room_total",
                    rate: value.rate,
                    targets,
                    dates: overlayNights
                      .map((night) => dateOfNight(month, night))
                      .filter((date) => value.weekdays.includes(date.getDay()))
                      .map(isoDay),
                  },
                ],
                {
                  onSuccess: () => {
                    notify.success(liveGrid.saved[k]);
                    setOverlay(null);
                    setTypedNights(null);
                    setSelected([]);
                  },
                  onError: (error) => notify.error(getApiErrorMessage(error)),
                },
              );
              return;
            }
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
          {...(live
            ? {
                onUndo: () =>
                  saveRates.mutate(
                    [
                      {
                        action: "remove",
                        targets: pickedTargets(),
                        dates: overlayNights.map((night) => isoDay(dateOfNight(month, night))),
                      },
                    ],
                    {
                      onSuccess: () => {
                        notify.success(liveGrid.restored[k]);
                        setOverlay(null);
                        setTypedNights(null);
                        setSelected([]);
                      },
                      onError: (error) => notify.error(getApiErrorMessage(error)),
                    },
                  ),
              }
            : {})}
          onBreakdown={() => setOverlay("pool")}
          onStatus={() => setOverlay("status")}
        />
      )}

      {overlay === "status" && (
        <NightStatusOverlay
          room={nightCell ? (ar ? nightCell.roomAr : nightCell.room) : undefined}
          date={nightDate}
          fixed={fixedPrice}
          onClose={() => setOverlay(null)}
          {...(live && nightRow?.target && nightCell
            ? {
                current:
                  nightRow.status[nightCell.night - 1] === "SS"
                    ? ("stop" as const)
                    : nightRow.status[nightCell.night - 1] === "RQ"
                      ? ("request" as const)
                      : ("open" as const),
                needsSla: !sellTargets.data?.onRequestSettings,
                saving: saveSell.isPending,
                onApply: (state, sla) => {
                  const scope = {
                    variationIds: [nightRow.target!.variationId],
                    dates: [isoDay(dateOfNight(month, nightCell.night))],
                  };
                  saveSell.mutate(
                    [
                      state === "open"
                        ? { action: "open_sale", ...scope }
                        : {
                            action: "create",
                            status: state === "stop" ? "stop_sale" : "on_request",
                            ...scope,
                            ...(sla ? { onRequestSettings: sla } : {}),
                          },
                    ],
                    {
                      onSuccess: () => {
                        notify.success(liveGrid.sellSaved[k]);
                        setOverlay(null);
                      },
                      onError: (error) => notify.error(getApiErrorMessage(error)),
                    },
                  );
                },
              }
            : {})}
        />
      )}

      {overlay === "hotel" && (
        <HotelPickerOverlay
          countries={metadataQuery.data?.countries ?? []}
          hotels={ratesHotels}
          loading={hotelsQuery.isPending}
          error={hotelsQuery.isError}
          onRetry={() => void hotelsQuery.refetch()}
          value={pickedHotel?.id ?? null}
          onPick={(id) => {
            if (id !== pickedHotel?.id) setContractId(null);
            setHotelId(id);
          }}
          onClose={() => setOverlay(null)}
        />
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
          hotelName={hotelLabel}
          contracts={hotelContracts}
          loading={contractsQuery.isPending && pickedHotel !== undefined}
          error={contractsQuery.isError}
          onRetry={() => void contractsQuery.refetch()}
          value={pickedContract?.id ?? null}
          includeEnded={includeEnded}
          onIncludeEnded={setIncludeEnded}
          onPick={setContractId}
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

      {overlay === "review" && <ReviewPublishDrawer onClose={() => setOverlay(null)} />}

      {overlay === "export" &&
        (live ? (
          <ExportOverlay
            formats={["csv"]}
            note={false}
            overline={[
              contractLabel,
              fill(liveGrid.exportRooms[k], { count: ar ? arNum(rows.length) : rows.length }),
              `${span.start} - ${span.end}`,
            ].join(" · ")}
            onClose={() => setOverlay(null)}
            onDownload={() => {
              const shown = monthDates
                .map((day, index) => ({ day, night: index + 1 }))
                .filter(({ day, night }) => termDates.includes(day) && (!hidePast || !month.today || night >= month.today));
              let email = "";
              try {
                email = JSON.parse(localStorage.getItem("userData") ?? "null")?.email ?? "";
              } catch {
                email = "";
              }
              exportRows({
                head: liveGrid.exportHead[k],
                rows: rows.flatMap((row) =>
                  shown.map(({ day, night }) => [
                    ar ? row.nameAr : row.name,
                    day,
                    String(row.rate[night - 1] ?? ""),
                    rateTargets.currency,
                    row.edited?.includes(night) ? liveGrid.exportEdited[k] : liveGrid.exportContract[k],
                    String(poolLeftAt(night) ?? roomLeftAt(row, night) ?? ""),
                  ]),
                ),
                filename: `rates-${pickedContract!.id}-${span.start}-${span.end}.csv`,
                lang,
                email,
              });
            }}
          />
        ) : (
          <ExportOverlay onClose={() => setOverlay(null)} />
        ))}

      {overlay === "pool" && (
        <PoolBreakdownOverlay
          date={nightDate}
          fixed={fixedPrice}
          onClose={() => setOverlay(null)}
          {...(liveDetail && nightCell
            ? (() => {
                const day = isoDay(dateOfNight(month, nightCell.night));
                const pool = nightsOf(null).get(day);
                return {
                  live: {
                    capacity: pool?.capacity ?? null,
                    overbooking: pool?.overbookingLimit ?? 0,
                    caps: liveDetail.inventory.caps.flatMap((cap) => {
                      const max = cap.nights.find((night) => night.stayDate === day)?.maxRooms;
                      const row = allRows.find((item) => item.target?.variationId === cap.variationId);
                      return max === undefined || !row
                        ? []
                        : [{ room: { en: row.name, ar: row.nameAr }, max }];
                    }),
                  },
                };
              })()
            : {})}
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
          : "border-border-default text-text-secondary hover:bg-surface-subtle",
      )}
    >
      {children}
    </button>
  );
}

/** A field that looks like a Select but opens the frame's own picker. */
/** The whole of a yyyy-mm month, which is what the grid opens on. */
function isoDay(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

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
export function DayField({
  label,
  value,
  span,
  onPick,
  weekend,
}: {
  label: string;
  value: string;
  span: { start: string; end: string };
  onPick: (next: { start: string; end: string }) => void;
  weekend?: number[] | undefined;
}) {
  const { lang } = useLanguage();
  const t = datePickerCopy[lang === "ar" ? "ar" : "en"];
  const [open, setOpen] = useState(false);
  const holder = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (!holder.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [open]);

  const shown = value
    ? (() => {
        const date = dateOf(value);

        const digits = (input: number) =>
          lang === "ar"
            ? String(input).replace(/[0-9]/g, (digit) => "٠١٢٣٤٥٦٧٨٩"[Number(digit)]!)
            : String(input);

        return `${digits(date.getDate())} ${
          t.monthsShort[date.getMonth()]
        } ${digits(date.getFullYear())}`;
      })()
    : lang === "ar"
      ? "اختر التاريخ"
      : "Select date";

  return (
    <div className="w-full" ref={holder}>
      <span className="mb-2 block text-[13px] font-medium leading-[15px] text-text-primary">
        {label}
      </span>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((previous) => !previous)}
          className="flex min-h-11 w-full items-center gap-2 rounded-[10px] border border-border-default bg-surface-default px-4 py-2 text-start transition-colors hover:border-border-strong"
          aria-expanded={open}
        >
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-sm",
              value ? "text-text-primary" : "text-text-muted",
            )}
          >
            {shown}
          </span>

          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-text-muted transition-transform",
              open && "rotate-180",
            )}
            aria-hidden="true"
          />
        </button>

        {open && (
          <div className="absolute z-50 mt-2 w-[393px] max-w-[calc(100vw-2rem)] start-0">
            <DatePicker
              className="w-full"
              {...(weekend ? { weekend } : {})}
              value={{
                start: span.start,
                end: span.end || span.start,
              }}
              onCancel={() => setOpen(false)}
              onApply={(next) => {
                onPick({
                  start: next.start,
                  end: next.end ?? next.start,
                });

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
      <span className="mb-2 block text-[13px] font-medium text-text-primary">{label}</span>
      <button
        type="button"
        onClick={onClick}
        className="flex min-h-11 w-full items-center gap-2 rounded-[10px] border border-border-default bg-surface-default px-4 py-2 text-start transition-colors hover:border-border-strong"
      >
        <span className="min-w-0 flex-1 truncate text-sm text-text-primary">{value}</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" />
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
        stacked && "border-t border-border-subtle pt-5 lg:border-t-0 lg:pt-0",
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
  return <span className="hidden w-px bg-border-subtle lg:block" aria-hidden="true" />;
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
  disabled = false,
  hint,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  disabled?: boolean;
  hint?: string | undefined;
}) {
  return (
    <label
      title={hint}
      className={cn(
        "flex min-w-0 select-none items-center gap-2 rounded-lg border bg-surface-default px-2.5 py-2 transition-colors",
        disabled
          ? "cursor-not-allowed border-border-subtle opacity-50"
          : checked
            ? "cursor-pointer border-border-default"
            : "cursor-pointer border-border-subtle hover:border-border-default",
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="peer sr-only"
      />
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-border-focus peer-focus-visible:ring-offset-1",
          checked ? "border-brand-deep bg-brand-deep" : "border-border-default bg-surface-default",
        )}
        aria-hidden="true"
      >
        {checked && <Check className="h-2.5 w-2.5 text-white" strokeWidth={4} />}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-xs leading-4 text-text-primary" title={label}>
          {label}
        </span>
        {hint && <span className="block text-[10.5px] leading-[14px] text-text-muted">{hint}</span>}
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
  const dot = isAll
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
          : idle,
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
            active ? dot : "bg-current",
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

function contractTerms(detail: RatesContractDetail, targets: RateTargetsData, k: "en" | "ar") {
  const terms = liveGrid.terms;
  const num = (value: number) => (k === "ar" ? arNum(value) : String(value));
  const base = targets.targets.find((target) => target.kind === "base") ?? targets.targets[0];
  const room = base
    ? [
        (k === "ar" ? base.roomNameAr : base.roomNameEn) || base.roomNameEn || base.roomNameAr,
        liveGrid.views[base.view]?.[k] ?? base.view,
      ]
        .filter(Boolean)
        .join(" ")
    : "";
  const rate = detail.pricing?.baseRoom?.rate;
  const pricing =
    detail.pricingModel === "fixed_per_room"
      ? terms.fixed[k]
      : rate && "weekday" in rate
        ? fill(terms.basePlus[k], {
            room,
            weekday: num(rate.weekday),
            weekend: num(rate.weekend),
            currency: detail.currency,
          })
        : fill(terms.basePlusFlat[k], {
            room,
            amount: num(rate && "amount" in rate ? rate.amount : 0),
            currency: detail.currency,
          });
  const weekendDays = detail.weekPricing?.weekendDays ?? [];
  const weekend =
    detail.weekPricing?.mode === "weekday_weekend" && weekendDays.length
      ? fill(terms.weekend[k], {
          days: weekendDays.map((day) => terms.days[day]?.[k] ?? day).join(k === "ar" ? " و" : ", "),
        })
      : terms.sameEveryNight[k];
  const rules = detail.inventoryRules;
  const overbooking = rules?.whenSoldOut?.overbookingLimitPerNight;
  const inventory =
    detail.bookingType === "on_request"
      ? terms.onRequest[k]
      : rules?.mode === "free_sale"
        ? terms.freeSale[k]
        : rules?.mode === "per_room_type"
          ? terms.perRoom[k]
          : fill(terms.pool[k], { count: num(rules?.roomsPerNight ?? 0) }) +
            (overbooking ? fill(terms.overbooking[k], { count: num(overbooking) }) : "");
  const policy = detail.releasePolicy;
  const release = !policy
    ? terms.noRelease[k]
    : policy.type === "same_day"
      ? fill(terms.releaseSameDay[k], { time: policy.releaseTime })
      : fill(terms.releaseDays[k], {
          count: num(policy.daysBeforeCheckIn ?? 0),
          time: policy.releaseTime,
        });
  const tier = detail.cancellationPolicy?.tiers[0];
  const cancel = tier
    ? fill(tier.charge.kind === "free" ? terms.cancelFree[k] : terms.cancelCharged[k], {
        count: num(tier.daysBefore),
      })
    : null;
  const restrictions = detail.restrictions.length
    ? fill(terms.restrictions[k], { count: num(detail.restrictions.length) })
    : terms.noRestrictions[k];
  const day = (iso: string) => {
    const on = new Date(`${iso}T00:00:00`);
    const month = datePickerCopy[k].monthsShort[on.getMonth()];
    return `${num(on.getDate())} ${month} ${num(on.getFullYear())}`;
  };
  return [
    pricing,
    weekend,
    inventory,
    release,
    ...(cancel ? [cancel] : []),
    restrictions,
    fill(terms.term[k], { from: day(detail.startDate), to: day(detail.endDate) }),
  ];
}

function overrideRuns(overrides: RateOverrideRow[], rows: GridRow[], currency: string): AlreadySet[] {
  const sorted = [...overrides].sort(
    (a, b) =>
      a.variationId - b.variationId ||
      (a.mealPlan ?? "").localeCompare(b.mealPlan ?? "") ||
      a.stayDate.localeCompare(b.stayDate),
  );
  const runs: Array<{ variationId: number; mealPlan: string | null; amount: number; dates: string[] }> = [];
  for (const item of sorted) {
    const last = runs[runs.length - 1];
    const next = last ? new Date(`${last.dates[last.dates.length - 1]}T00:00:00`) : null;
    next?.setDate(next.getDate() + 1);
    if (
      last &&
      next &&
      last.variationId === item.variationId &&
      last.mealPlan === item.mealPlan &&
      last.amount === item.amount &&
      isoDay(next) === item.stayDate
    ) {
      last.dates.push(item.stayDate);
      continue;
    }
    runs.push({ variationId: item.variationId, mealPlan: item.mealPlan, amount: item.amount, dates: [item.stayDate] });
  }
  const label = (iso: string, lang: "en" | "ar") => {
    const on = new Date(`${iso}T00:00:00`);
    const num = (value: number) => (lang === "ar" ? arNum(value) : String(value));
    return `${num(on.getDate())} ${datePickerCopy[lang].monthsShort[on.getMonth()]} ${num(on.getFullYear())}`;
  };
  const span = (dates: string[], lang: "en" | "ar") =>
    dates.length === 1 ? label(dates[0]!, lang) : `${label(dates[0]!, lang)} - ${label(dates[dates.length - 1]!, lang)}`;
  return runs.map((run) => {
    const row = rows.find(
      (item) =>
        item.target?.variationId === run.variationId &&
        (item.target.mealPlan ?? null) === run.mealPlan,
    );
    return {
      id: JSON.stringify({ variationId: run.variationId, mealPlan: run.mealPlan, dates: run.dates }),
      when: { en: span(run.dates, "en"), ar: span(run.dates, "ar") },
      rooms: { en: row?.name ?? `#${run.variationId}`, ar: row?.nameAr ?? `#${run.variationId}` },
      value: { en: `${run.amount} ${currency}`, ar: `${arNum(run.amount)} ${currency}` },
    };
  });
}

function sellRuleRows(rules: SellControlRule[], rows: GridRow[]): AlreadySet[] {
  const label = (iso: string, lang: "en" | "ar") => {
    const on = new Date(`${iso}T00:00:00`);
    const num = (value: number) => (lang === "ar" ? arNum(value) : String(value));
    return `${num(on.getDate())} ${datePickerCopy[lang].monthsShort[on.getMonth()]} ${num(on.getFullYear())}`;
  };
  const segments = (dates: string[], lang: "en" | "ar") => {
    const runs: string[][] = [];
    for (const day of [...new Set(dates)].sort()) {
      const last = runs[runs.length - 1];
      const next = last ? new Date(`${last[last.length - 1]}T00:00:00`) : null;
      next?.setDate(next.getDate() + 1);
      if (last && next && isoDay(next) === day) last.push(day);
      else runs.push([day]);
    }
    return runs
      .map((run) => (run.length === 1 ? label(run[0]!, lang) : `${label(run[0]!, lang)} - ${label(run[run.length - 1]!, lang)}`))
      .join(lang === "ar" ? "، " : ", ");
  };
  const names = (ids: number[], lang: "en" | "ar") =>
    [...new Set(ids)]
      .map((id) => {
        const row = rows.find((item) => item.target?.variationId === id);
        return row ? (lang === "ar" ? row.nameAr : row.name) : `#${id}`;
      })
      .join(lang === "ar" ? "، " : ", ");
  return rules
    .filter((rule) => rule.live)
    .map((rule) => {
      const dates = rule.cells.map((cell) => cell.stayDate);
      const ids = rule.cells.map((cell) => cell.variationId);
      const value = rule.status === "stop_sale" ? liveGrid.stopSaleValue : liveGrid.onRequestValue;
      const uniqueIds = [...new Set(ids)];
      const allIds = [
        ...new Set(rows.flatMap((row) => (row.target ? [row.target.variationId] : []))),
      ];
      const runs: string[][] = [];
      for (const day of [...new Set(dates)].sort()) {
        const last = runs[runs.length - 1];
        const next = last ? new Date(`${last[last.length - 1]}T00:00:00`) : null;
        next?.setDate(next.getDate() + 1);
        if (last && next && isoDay(next) === day) last.push(day);
        else runs.push([day]);
      }
      return {
        id: String(rule.id),
        edit: {
          ruleId: rule.id,
          status: rule.status === "stop_sale" ? ("stopSale" as const) : ("onRequest" as const),
          ranges: runs.map((run) => ({ start: run[0]!, end: run[run.length - 1]! })),
          rooms: uniqueIds.flatMap((id) => {
            const row = rows.find((item) => item.target?.variationId === id);
            return row ? [row.name] : [];
          }),
          allRooms: allIds.length > 0 && allIds.every((id) => uniqueIds.includes(id)),
        },
        when: { en: segments(dates, "en"), ar: segments(dates, "ar") },
        rooms: { en: names(ids, "en"), ar: names(ids, "ar") },
        value: { en: value.en, ar: value.ar },
        tone: rule.status === "stop_sale" ? ("danger" as const) : ("warning" as const),
      };
    });
}
