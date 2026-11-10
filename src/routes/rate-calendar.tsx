import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Ban,
  Bed,
  Check,
  ChevronDown,
  Eye,
  FileText,
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
import { readableDay } from "@/components/ui/date-field";
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
  rateReviewCopy,
  type RateReviewState,
} from "@/components/rate-calendar/rate-overlays";
import { ColourKeyDialog, ThresholdDialog } from "@/components/rate-calendar/colour-key";
import { RateGrid, type GridRowKind } from "@/components/rate-calendar/rate-grid";
import { cn } from "@/lib/utils";
import { winLines } from "@/lib/win-list-data";
import {
  BulkRangeOverlay,
  type LiveReleaseProps,
  type LiveRestrictionsProps,
  type LiveRoomType,
  type SupplementDefaults,
} from "@/components/rate-calendar/bulk-range-overlay";
import {
  describeReleaseTiming,
  type ReleaseInheritedPolicy,
} from "@/components/rate-calendar/release-live";
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
  liveRelease,
  liveRestrictions,
  monthPicker,
  selectionBar,
} from "@/lib/rate-overlay-data";
import { useRatesAvailabilityHotels } from "@/api/modules/rates&availability/useRatesAvailabilityHotels";
import { useRatesAvailabilityMetadata } from "@/api/modules/rates&availability/useRatesAvailabilityMetadata";
import { useRatesAvailabilityContracts } from "@/api/modules/rates&availability/useRatesAvailabilityContracts";
import { useDebounce } from "@/routes/my-hotels";
import {
  usePreviewRestrictionOverrides,
  useRestrictionOverrides,
  useRestrictionTargets,
  useRestrictionsContext,
  useSaveRestrictionOverrides,
} from "@/api/modules/rates-availability/useRestrictions";
import {
  checksAreWeekdayUniform,
  describeRestriction,
  summarizeChecks,
  weekdayOfIso,
  type NightChecks,
} from "@/lib/restriction-format";
import {
  usePreviewReleaseOverrides,
  useReleaseOverrides,
  useReleaseTargets,
  useSaveReleaseOverrides,
} from "@/api/modules/rates-availability/useRelease";
import {
  isReleaseDays,
  isReleaseIsoDate,
  isReleaseTime,
  ownedNonpastReleaseCells,
  RELEASE_LIMITS,
} from "@/lib/release-format";
import {
  useSaveSellControls,
  useSellControlTargets,
  useSellControls,
  useSellControlsContext,
} from "@/api/modules/rates-availability/useSellControls";
import {
  useRateTargets,
  useRateOverrides,
  useRatesContractDetail,
  useRatesContext,
  useSupplementsContext,
  usePreviewRateOverrides,
  useSaveReviewedRateOverrides,
  rateBatchBody,
} from "@/api/modules/rates-availability/useRates";
import type { AlreadySet } from "@/lib/bulk-range-data";
import type {
  ReleaseRule,
  RestrictionInheritedRule,
  RestrictionRule,
  SellControlSla,
  SellControlOperation,
  SellControlRule,
  RateAmount,
  RateOperation,
  SupplementOperation,
  RateOverrideRow,
  RateTarget,
  RateTargetsData,
  RatesMealPlan,
  RatesContract,
  RatesContractDetail,
  RatesHotel,
} from "@/api/modules/rates-availability/types";
import { getApiErrorMessage } from "@/lib/api-error";
import { notify } from "@/lib/notify";
import { exportRows } from "@/lib/export-rows";
import {
  WEEKEND_DAYS,
  gridContracts,
  gridMonths,
  dateOfNight,
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
/** Guide p.11: a contract with no configured weekend uses Thursday and Friday. */
const RESTRICTION_WEEKEND_FALLBACK = [4, 5];

/**
 * Release only: today as YYYY-MM-DD in the contract's published time zone,
 * or null when that zone is missing or invalid - never the browser's own day.
 */
function releaseTodayIn(timezone: string | null | undefined): string | null {
  if (!timezone) return null;
  try {
    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
    return isReleaseIsoDate(today) ? today : null;
  } catch {
    return null;
  }
}

/** Today as YYYY-MM-DD in the hotel's published time zone, for read-only past nights. */
function todayIn(timezone: string | null): string {
  if (timezone) {
    try {
      return new Intl.DateTimeFormat("en-CA", {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date());
    } catch {
      /* An unknown zone falls through to the browser's own day. */
    }
  }
  return isoDay(new Date());
}

/** Hotel and contract pickers: server page size and search debounce. */
const PICKER_LIMIT = 10;
const SEARCH_DEBOUNCE_MS = 450;

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
  // Hotel and contract pickers search and page on the backend.
  const [hotelSearch, setHotelSearch] = useState("");
  const [hotelPage, setHotelPage] = useState(1);
  const debouncedHotelSearch = useDebounce(hotelSearch.trim(), SEARCH_DEBOUNCE_MS);
  const hotelsQuery = useRatesAvailabilityHotels({
    page: hotelPage,
    limit: PICKER_LIMIT,
    search: debouncedHotelSearch,
  });
  const metadataQuery = useRatesAvailabilityMetadata();
  const ratesHotels = hotelsQuery.hotels as RatesHotel[];
  // No default hotel: contracts wait for the user's pick. The picked row is
  // kept whole, since a later search or page may not contain it.
  const [pickedHotel, setPickedHotel] = useState<RatesHotel | null>(null);
  const hotelId = pickedHotel?.id ?? null;
  const [contractSearch, setContractSearch] = useState("");
  const [contractPage, setContractPage] = useState(1);
  const debouncedContractSearch = useDebounce(contractSearch.trim(), SEARCH_DEBOUNCE_MS);
  // The picker's date range and Include ended contracts are sent to the backend.
  const [contractDates, setContractDates] = useState<{ start: string; end: string } | null>(null);
  const [includeEnded, setIncludeEnded] = useState(false);
  const contractsQuery = useRatesAvailabilityContracts({
    hotelId,
    page: contractPage,
    limit: PICKER_LIMIT,
    search: debouncedContractSearch,
    from: contractDates?.start,
    to: contractDates?.end,
    includeExpired: includeEnded,
  });
  const hotelContracts = contractsQuery.contracts as RatesContract[];
  const [chosenContract, setChosenContract] = useState<RatesContract | null>(null);
  // No default contract either; an ended pick hides when ended ones are excluded.
  const pickedContract =
    chosenContract &&
    (includeEnded ||
      (chosenContract.status !== "expired" && chosenContract.status !== "terminated"))
      ? chosenContract
      : undefined;
  const targetsQuery = useRateTargets(pickedContract?.id);
  const rateTargets = targetsQuery.data;
  const live = rateTargets !== undefined && rateTargets.targets.length > 0;
  const weekendDays = live
    ? (rateTargets.weekendDays ?? [])
        .map((day) => DAY_NAMES.indexOf(day.toLowerCase()))
        .filter((day) => day >= 0)
    : WEEKEND_DAYS;
  const detailQuery = useRatesContractDetail(pickedContract?.id);
  const detail = detailQuery.data;
  // Seasons come only from the picked contract's details, never from rate targets.
  const contractSeasons = detail && detail.id === pickedContract?.id ? detail.seasons : undefined;
  const liveDetail = live && detail?.id === pickedContract?.id ? detail : undefined;
  // Inventory needs only the contract details, so a contract with no rate
  // targets still shows its own pool instead of the demo one.
  const inventoryDetail = detail?.id === pickedContract?.id ? detail : undefined;
  const livePools = inventoryDetail?.inventory.pools ?? [];
  const nightsOf = (variationId: number | null) => {
    const pool =
      livePools.find((item) => item.variationId === variationId) ??
      (variationId === null ? livePools[0] : undefined);
    return new Map((pool?.nights ?? []).map((night) => [night.stayDate, night]));
  };
  const liveModel = inventoryDetail
    ? inventoryDetail.bookingType === "on_request"
      ? ("onRequest" as const)
      : inventoryDetail.inventoryRules?.mode === "free_sale"
        ? ("free" as const)
        : inventoryDetail.inventoryRules?.mode === "per_room_type"
          ? ("perRoom" as const)
          : ("pool" as const)
    : undefined;
  const fixedPrice = live
    ? rateTargets.pricingModel === "fixed_per_room"
    : Boolean(grid.fixedPrice);

  // From and To come from the picked contract's details, and stay empty until
  // the details for that contract have arrived.
  const contractDetails =
    detail && pickedContract && detail.id === pickedContract.id ? detail : undefined;
  const detailStart = contractDetails?.startDate.slice(0, 10);
  const detailEnd = contractDetails?.endDate.slice(0, 10);
  const contractTerm =
    detailStart && detailEnd ? { start: detailStart, end: detailEnd } : undefined;

  useEffect(() => {
    if (!detailStart || !detailEnd) return;
    setSpan({ start: detailStart, end: detailEnd });
  }, [contractDetails?.id, detailStart, detailEnd]);

  const monthDates = Array.from({ length: month.base.length }, (_, index) =>
    isoDay(dateOfNight(month, index + 1)),
  );
  // Each night takes the season whose date range holds it; a month can hold several.
  const nightSeasons = monthDates.map(
    (day) =>
      contractSeasons?.find(
        (season) => day >= season.startDate.slice(0, 10) && day <= season.endDate.slice(0, 10),
      ) ?? null,
  );
  const seasonNote = detailQuery.isError
    ? liveGrid.seasonsError[k]
    : contractSeasons
      ? undefined
      : liveGrid.seasonsLoading[k];
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
  /* Guide p.3: preview is the review screen; only the supplier's confirm saves. */
  const previewRates = usePreviewRateOverrides(pickedContract?.id);
  const saveReviewedRates = useSaveReviewedRateOverrides(pickedContract?.id);
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
    (sellQuery.data?.cells ?? []).map((cell) => [
      `${cell.variationId}|${cell.stayDate}`,
      cell.override,
    ]),
  );
  const liveMeals = (variationId: number, days: string[], rates: number[]) => {
    const nights = (supplementsQuery.data?.nights ?? []).filter(
      (night) => night.variationId === variationId,
    );
    if (!nights.length) return {};
    const byDay = new Map(nights.map((night) => [night.stayDate, night]));
    const types = [
      ...new Set(
        nights.flatMap((night) =>
          night.meals.filter((meal) => meal.enabled).map((meal) => meal.type),
        ),
      ),
    ];
    if (!types.length) return {};
    const guests = 2;
    const short = (lang: "en" | "ar") =>
      types
        .map((type) => liveGrid.mealShort[type]?.[lang] ?? type)
        .join(lang === "ar" ? "، " : ", ");
    return {
      mealLabel: {
        en: fill(liveGrid.plusMealsLive.en, { meals: short("en") }),
        ar: fill(liveGrid.plusMealsLive.ar, { meals: short("ar") }),
      },
      meals: types.map((type) => {
        const first = nights
          .flatMap((night) => night.meals)
          .find((meal) => meal.type === type && meal.enabled);
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
            return (
              (rates[index] ?? 0) +
              (meal.pricingBasis === "per_room" ? meal.price : meal.price * guests)
            );
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
            (lang === "ar" ? target.roomSizeNameAr : target.roomSizeNameEn) ||
              target.roomSizeNameEn ||
              target.roomSizeNameAr ||
              `#${target.roomId}`,
            meal?.[lang],
            view?.[lang] ?? target.view,
          ]
            .filter(Boolean)
            .join(" · ");
        const supplement = nights[0]?.roomSupplement.amount ?? 0;
        const roomNights = liveModel === "perRoom" ? nightsOf(target.variationId) : null;
        const cap = liveDetail?.inventory.caps.find(
          (item) => item.variationId === target.variationId,
        );
        const capByDay = new Map(
          (cap?.nights ?? []).map((night) => [night.stayDate, night.maxRooms]),
        );
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
            roomNights ? (roomNights.get(day)?.capacity ?? 0) : cap ? (capByDay.get(day) ?? 0) : 0,
          ),
          status: monthDates.map((day) => {
            const override = sellAt.get(`${target.variationId}|${day}`);
            return override?.status === "stop_sale"
              ? "SS"
              : override?.status === "on_request"
                ? "RQ"
                : "·";
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
  // Rooms come only from the rate targets API: no static rooms, no placeholders.
  const monthRows = liveRows;
  // UI 04.1U — priced rooms first, the ones with no rate underneath them.
  const unpriced: string[] = [];
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
    ? (ar ? pickedHotel.nameAr : pickedHotel.nameEn) ||
      pickedHotel.nameEn ||
      pickedHotel.nameAr ||
      ""
    : "";
  const contractLabel = pickedContract ? pickedContract.name : "";
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
  const bulkFirstNight = (() => {
    if (!rateTargets) return null;
    const today = todayIn(rateTargets.timezone);
    const start = rateTargets.startDate.slice(0, 10);
    const first = today > start ? today : start;
    return first <= rateTargets.endDate.slice(0, 10) ? first : null;
  })();
  const [bulkPicked, setBulkPicked] = useState<{ start: string; end: string } | null>(null);
  const bulkWindow = (() => {
    const start = bulkPicked?.start ?? bulkFirstNight;
    if (!rateTargets || !start) return null;
    const week = new Date(`${start}T00:00:00`);
    week.setDate(week.getDate() + 6);
    const termEnd = rateTargets.endDate.slice(0, 10);
    const wanted = bulkPicked && bulkPicked.end > isoDay(week) ? bulkPicked.end : isoDay(week);
    return { startDate: start, endDate: wanted < termEnd ? wanted : termEnd };
  })();
  const bulkSupplementsQuery = useSupplementsContext(
    pickedContract?.id,
    live && overlay === "bulk" && bulkWindow
      ? {
          targets: [...new Set(rateTargets.targets.map((target) => target.variationId))].map(
            (variationId) => ({ variationId }),
          ),
          ...bulkWindow,
        }
      : null,
  );
  const bulkRatesQuery = useRatesContext(
    pickedContract?.id,
    live && overlay === "bulk" && bulkWindow
      ? {
          targets: rateTargets.targets.map((target) => ({
            variationId: target.variationId,
            ...(target.mealPlan ? { mealPlan: target.mealPlan } : {}),
          })),
          ...bulkWindow,
        }
      : null,
  );
  /* The first weekday and first weekend night in the window, as they stand now. */
  const bulkNow = (variationId: number | undefined, mealPlan?: RatesMealPlan) => {
    const nights = (bulkRatesQuery.data?.nights ?? [])
      .filter(
        (night) => night.variationId === variationId && (!mealPlan || night.mealPlan === mealPlan),
      )
      .sort((a, b) => a.stayDate.localeCompare(b.stayDate));
    if (!nights.length) return null;
    return {
      weekday: nights.find((night) => !night.isWeekend)?.roomAmount ?? null,
      weekend: nights.find((night) => night.isWeekend)?.roomAmount ?? null,
    };
  };
  const bulkBaseVariation = allRows.find((row) => row.base)?.target?.variationId;
  const bulkSupplementNow = (variationId: number | undefined) => {
    const room = bulkNow(variationId);
    const base = bulkNow(bulkBaseVariation);
    if (!room || !base) return null;
    if (room.weekday !== null && base.weekday !== null) return room.weekday - base.weekday;
    if (room.weekend !== null && base.weekend !== null) return room.weekend - base.weekend;
    return null;
  };
  const bulkRoomTypes: LiveRoomType[] = live
    ? [...new Set(rateTargets.targets.map((target) => target.variationId))].flatMap(
        (variationId) => {
          const offers = rateTargets.targets.filter(
            (target) => target.variationId === variationId && target.mealPlan,
          );
          const first = rateTargets.targets.find((target) => target.variationId === variationId)!;
          const name = (lang: "en" | "ar") =>
            [
              (lang === "ar" ? first.roomSizeNameAr : first.roomSizeNameEn) ||
                first.roomSizeNameEn ||
                first.roomSizeNameAr ||
                `#${first.roomId}`,
              liveGrid.views[first.view]?.[lang] ?? first.view,
            ].join(" · ");
          return offers.length
            ? [
                {
                  name: { en: name("en"), ar: name("ar") },
                  variationId,
                  offers: offers.map((offer) => ({
                    mealPlan: offer.mealPlan!,
                    meal: liveGrid.meals[offer.mealPlan!],
                    contract: (() => {
                      const now = bulkNow(variationId, offer.mealPlan);
                      if (!now) return null;
                      if (now.weekday !== null && now.weekend !== null)
                        return { weekday: now.weekday, weekend: now.weekend };
                      const amount = now.weekday ?? now.weekend;
                      return amount === null ? null : { amount };
                    })(),
                  })),
                },
              ]
            : [];
        },
      )
    : [];
  const bulkSupplementDefaults = (variationId: number | undefined): SupplementDefaults | null => {
    const night = [...(bulkSupplementsQuery.data?.nights ?? [])]
      .sort((a, b) => a.stayDate.localeCompare(b.stayDate))
      .find((item) => item.variationId === variationId);
    return night
      ? {
          base: fixedPrice ? null : bulkNow(bulkBaseVariation),
          meals: night.meals
            .filter((meal) => meal.enabled)
            .map((meal) => ({
              type: meal.type,
              price: meal.price,
              pricingBasis: meal.pricingBasis,
            })),
          children: (night.childPricing ?? []).map((band) => ({
            category: band.category,
            from: band.from,
            to: band.to,
            price: band.price,
          })),
        }
      : null;
  };
  const sellTargets = useSellControlTargets(
    live && (overlay === "stopSale" || overlay === "status") ? pickedContract?.id : undefined,
  );
  const sellRules = useSellControls(pickedContract?.id, live && overlay === "stopSale");
  const saveSell = useSaveSellControls(pickedContract?.id);
  /* Unknown contract SLA is never "no SLA": On Request waits for loaded targets. */
  const sellSlaReady = sellTargets.isSuccess;
  const contractSla = sellTargets.data?.onRequestSettings ?? null;
  const sellNeedsSla = sellSlaReady && sellTargets.data?.bookingType !== "on_request";
  const sellNotReady = () => {
    if (sellSlaReady) return false;
    if (sellTargets.isError) notify.error(getApiErrorMessage(sellTargets.error));
    return true;
  };
  const restrictionsOpen = live && overlay === "restrictions";
  const restrictionTargets = useRestrictionTargets(
    restrictionsOpen ? pickedContract?.id : undefined,
  );
  const restrictionRules = useRestrictionOverrides(pickedContract?.id, restrictionsOpen);
  const previewRestrictions = usePreviewRestrictionOverrides(pickedContract?.id);
  const saveRestrictions = useSaveRestrictionOverrides(pickedContract?.id);
  /* The contract's weekend from restriction targets; unset falls back to Thu/Fri, as the backend does. */
  const restrictionWeekend = (() => {
    const days = (restrictionTargets.data?.weekendDays ?? [])
      .map((day) => DAY_NAMES.indexOf(day.toLowerCase()))
      .filter((day) => day >= 0);
    return days.length ? days : RESTRICTION_WEEKEND_FALLBACK;
  })();
  const restrictionToday = todayIn(restrictionTargets.data?.timezone ?? null);
  /* All rooms = the contract's configured Room/Views from restriction targets, never a guess. */
  const restrictionVariationIds = (restrictionTargets.data?.targets ?? []).map(
    (target) => target.variationId,
  );
  const restrictionOverrideRows =
    restrictionsOpen && restrictionRules.data
      ? restrictionRuleRows(
          restrictionRules.data,
          allRows,
          restrictionWeekend,
          restrictionToday,
          restrictionVariationIds,
        )
      : [];
  /* Manage Release: targets and rules load only while its overlay is open on a live contract. */
  const releaseOpen = live && overlay === "release";
  const releaseTargets = useReleaseTargets(releaseOpen ? pickedContract?.id : undefined);
  const releaseRules = useReleaseOverrides(pickedContract?.id, releaseOpen);
  const previewRelease = usePreviewReleaseOverrides(pickedContract?.id);
  const saveRelease = useSaveReleaseOverrides(pickedContract?.id);
  const releaseData = releaseOpen ? releaseTargets.data : undefined;
  const releaseToday = releaseTodayIn(releaseData?.timezone);
  /* Room + View names come from rate targets by variationId; the list itself from release targets. */
  const releaseRoomName = (variationId: number) => {
    const rate = rateTargets?.targets.find((item) => item.variationId === variationId);
    const view =
      rate?.view ?? releaseData?.targets.find((item) => item.variationId === variationId)?.view;
    return bothLanguages((lang) =>
      [
        rate
          ? (lang === "ar" ? rate.roomSizeNameAr : rate.roomSizeNameEn) ||
            rate.roomSizeNameEn ||
            rate.roomSizeNameAr ||
            `#${variationId}`
          : `#${variationId}`,
        view ? (liveGrid.views[view]?.[lang] ?? view) : null,
      ]
        .filter(Boolean)
        .join(" · "),
    );
  };
  const releaseVariationIds = [
    ...new Set((releaseData?.targets ?? []).map((target) => target.variationId)),
  ];
  const releaseRooms = releaseVariationIds.map((variationId, index, list) => {
    const name = releaseRoomName(variationId);
    /* Two Room + Views reading the same are told apart by ID, so a pick maps to one variation. */
    const clash = list.some((other, at) => at !== index && releaseRoomName(other).en === name.en);
    return {
      variationId,
      name: clash ? { en: `${name.en} #${variationId}`, ar: `${name.ar} #${variationId}` } : name,
    };
  });
  const releaseBlocked = !releaseData
    ? releaseTargets.isError
      ? liveRelease.loadFailed
      : liveRelease.loading
    : !releaseData.eligible
      ? liveRelease.notEligible
      : !releaseData.canOverride
        ? liveRelease.cannotOverride
        : !releaseToday
          ? liveRelease.noTimezone
          : null;
  const releaseOverrideRows =
    releaseOpen && releaseRules.data
      ? releaseRuleRows(releaseRules.data, releaseToday, releaseRoomName, releaseVariationIds)
      : [];
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
  /* The single night's current override from POST sell-controls/context (null = normal contract behavior). */
  const nightDay = nightOn ? isoDay(nightOn) : null;
  const nightOverride =
    nightRow?.target && nightDay
      ? (sellAt.get(`${nightRow.target.variationId}|${nightDay}`) ?? null)
      : null;
  /* An existing On Request night starts from its own effective SLA; a new one from the contract's. */
  const nightSla =
    nightOverride?.status === "on_request" && nightOverride.onRequestSettings
      ? nightOverride.onRequestSettings
      : contractSla;
  const pickedTargets = () =>
    allRows
      .filter((row) => (pickedRooms.length ? pickedRooms : [nightCell?.room]).includes(row.name))
      .flatMap((row) => (row.target ? [row.target as RateTarget] : []));

  /* Room + View (+ offer) name for a preview night, from the live rows. */
  const rateRoomName = (variationId: number, mealPlan: RatesMealPlan | null) => {
    const row = allRows.find(
      (item) =>
        item.target?.variationId === variationId && (item.target.mealPlan ?? null) === mealPlan,
    );
    return row
      ? { en: row.name, ar: row.nameAr }
      : { en: `#${variationId}`, ar: `#${variationId}` };
  };
  const isConflict = (error: unknown) =>
    (error as { response?: { status?: number } }).response?.status === 409;
  const allRemovals = (operations: RateOperation[]) =>
    operations.every((operation) => operation.action === "remove");

  /*
   * Single/multi-day review (guide p.3): the operations exactly as built,
   * with the preview that was run for them. Save and Undo only preview;
   * the confirm saves these operations with this preview's ratesRevision.
   */
  const [nightReview, setNightReview] = useState<
    | (RateReviewState & {
        operations: RateOperation[];
        supplementOperations: SupplementOperation[];
      })
    | null
  >(null);
  const nightReviewRun = useRef(0);
  const previewNightRates = async (
    operations: RateOperation[],
    stale = false,
    supplementOperations: SupplementOperation[] = [],
  ) => {
    const run = ++nightReviewRun.current;
    setNightReview({
      operations,
      supplementOperations,
      data: null,
      loading: true,
      error: null,
      stale,
    });
    try {
      const data = await previewRates.mutateAsync({ operations, supplementOperations });
      if (run === nightReviewRun.current)
        setNightReview({
          operations,
          supplementOperations,
          data,
          loading: false,
          error: null,
          stale,
        });
    } catch (error) {
      if (run === nightReviewRun.current)
        setNightReview({
          operations,
          supplementOperations,
          data: null,
          loading: false,
          error: getApiErrorMessage(error, rateReviewCopy.previewFailed[k]),
          stale,
        });
    }
  };
  const closeNightReview = () => {
    nightReviewRun.current += 1;
    setNightReview(null);
  };
  const confirmNightRates = () => {
    const review = nightReview;
    if (!review?.data || review.loading) return;
    const { operations, supplementOperations } = review;
    /* The review this save belongs to. If it is closed while the PUT is in
       flight, the request still completes and the hook still refreshes, but
       its outcome no longer touches the overlay or starts a new preview. */
    const run = nightReviewRun.current;
    saveReviewedRates.mutate(
      {
        expectedRevision: review.data.ratesRevision,
        ...rateBatchBody({ operations, supplementOperations }),
      },
      {
        onSuccess: () => {
          if (run !== nightReviewRun.current) return;
          notify.success(
            operations.length && !supplementOperations.length && allRemovals(operations)
              ? liveGrid.restored[k]
              : liveGrid.saved[k],
          );
          closeNightReview();
          setOverlay(null);
          setTypedNights(null);
          setSelected([]);
        },
        onError: (error) => {
          if (run !== nightReviewRun.current) return;
          if (isConflict(error)) {
            /* 409: the hook refreshed the data; preview again and wait for another review. */
            notify.error(rateReviewCopy.stale[k]);
            void previewNightRates(operations, true, supplementOperations);
            return;
          }
          notify.error(getApiErrorMessage(error));
        },
      },
    );
  };
  /*
   * OV 04.6H / 04.6N - what the nights being priced already carry, read
   * off the month itself rather than assumed: which of them were edited,
   * how many rooms are already booked on them, and whether they sit in a
   * season. Each band on the overlay only appears when its answer is yes.
   */
  const overlayNights =
    typedNights ?? (pickedNights.length ? pickedNights : nightCell ? [nightCell.night] : []);
  const nightChildrenQuery = useSupplementsContext(
    pickedContract?.id,
    live && overlay === "night" && nightRow?.target && overlayNights.length
      ? {
          targets: [{ variationId: nightRow.target.variationId }],
          dates: [isoDay(dateOfNight(month, overlayNights[0]!))],
        }
      : null,
  );
  const nightChildBands = nightChildrenQuery.data?.nights[0]?.childPricing ?? [];
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
          type: meal.type,
          price: meal.price,
          unit: `${rateTargets?.currency ?? ""} ${unit(meal.pricingBasis)}`.trim(),
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
      : inventoryDetail
        ? (nightsOf(null).get(monthDates[night - 1]!)?.capacity ?? null)
        : (month.poolLeft[night - 1] ?? null);
  // Live pool header: each shown night's capacity and overbooking limit, as
  // the contract details return them. No demo numbers in live mode.
  const poolHeader = (() => {
    if (!inventoryDetail) return undefined;
    const sharedNights = nightsOf(null);
    const shownPool = monthDates.flatMap((day) => {
      const night = sharedNights.get(day);
      return night ? [night] : [];
    });
    const capacities = shownPool.flatMap((night) =>
      night.capacity === null ? [] : [night.capacity],
    );
    if (!capacities.length) return liveGrid.noStock[k];
    const num = (value: number) => (ar ? arNum(value) : String(value));
    const range = (values: number[]) => {
      const low = Math.min(...values);
      const high = Math.max(...values);
      return low === high ? num(low) : `${num(low)}–${num(high)}`;
    };
    return fill(liveGrid.poolMetaLive[k], {
      capacity: range(capacities),
      overbooking: range(shownPool.map((night) => night.overbookingLimit)),
    });
  })();
  const roomLeftAt = (row: GridRow, night: number) =>
    gridModel === "perRoom" || row.inventoryLabel === "left"
      ? (row.inventory[night - 1] ?? null)
      : null;
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
        {/* {contractParam && (
          <BackLink
            inline
            to="/rate-contracts"
            label={fill(t.back, { contract: ar ? grid.nameAr : grid.name })}
          />
        )} */}
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
        {/* <Gated permission="rates.view" instead={null}>
          <Link to="/rates/win-list" search={{}}>
            <Button variant="outline">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {ar ? "قائمة الفرص" : "Win list"}
              <span className="rounded-full bg-primary-subtle px-1.5 text-[10px] font-semibold text-brand-deep">
                {winLines.length}
              </span>
            </Button>
          </Link>
        </Gated> */}
        {/* {live ? null : grid.readOnly ? (
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
        )} */}
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
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[260px_340px_minmax(0,1fr)]">
          {/* OV 04.10 / 04.9 / 04.8 - each field opens the frame behind it. */}
          <PickerField
            label={t.hotel}
            value={hotelLabel}
            placeholder={hotelPicker.placeholder[k]}
            onClick={() => {
              setHotelSearch("");
              setHotelPage(1);
              setOverlay("hotel");
            }}
          />
          <PickerField
            label={t.contract}
            value={contractLabel}
            placeholder={contractPicker.placeholder[k]}
            disabled={!pickedHotel}
            onClick={() => {
              setContractSearch("");
              setContractPage(1);
              setOverlay("contract");
            }}
          />
          {/* OV 04.1PN - the field that opens the nationality menu. */}
          {/* <PickerField
            label={pricesForCopy.label[k]}
            value={group.name[k]}
            onClick={() => setOverlay("prices")}
          /> */}
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
        {pickedContract && (
          <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-surface-subtle px-3 py-2.5">
            <span className="text-overline me-1.5 text-text-muted">{t.fromContract}</span>
            {(liveDetail && rateTargets
              ? contractTerms(liveDetail, rateTargets, k)
              : ar
                ? grid.summaryAr
                : grid.summary
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
        )}
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
       * Like the calendar, it waits for a contract; until then a note asks for one.
       */}
      {!pickedContract ? (
        <div
          role="status"
          className="mb-5 flex flex-col items-center rounded-xl border border-status-info/40 bg-status-info-bg px-6 py-10 text-center"
        >
          <span
            aria-hidden
            className="mb-4 grid h-14 w-14 place-items-center rounded-full border border-status-info/30 bg-surface text-status-info"
          >
            <FileText className="h-7 w-7" strokeWidth={1.75} />
          </span>
          <h2 className="text-[18px] font-semibold leading-[1.3] text-text-primary">
            {liveGrid.selectContractTitle[k]}
          </h2>
          <p className="mt-1.5 max-w-[460px] text-[14px] leading-[1.55] text-text-secondary">
            {liveGrid.selectContractFirst[k]}
          </p>
        </div>
      ) : (
        <>
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
                {!pickedContract || targetsQuery.isError || !rateTargets || !allRows.length ? (
                  <p className="text-xs text-text-muted">
                    {
                      (!pickedContract
                        ? liveGrid.roomsPickContract
                        : targetsQuery.isError
                          ? liveGrid.roomsError
                          : !rateTargets
                            ? liveGrid.roomsLoading
                            : liveGrid.roomsEmpty)[k]
                    }
                  </p>
                ) : (
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(244px,1fr))] gap-x-2 gap-y-3">
                    <CheckRow
                      checked={visibleRooms.length === allRows.length}
                      onChange={() =>
                        pickRooms(
                          visibleRooms.length === allRows.length
                            ? []
                            : allRows.map((row) => row.name),
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
                )}
              </PanelSection>

              <PanelRule />

              <PanelSection icon={Eye} title={t.view} hint={t.viewHint} stacked>
                {/* One under another, each the full width of the column. */}
                <div className="grid gap-3">
                  <CheckRow
                    checked={compact}
                    onChange={() => setCompact(!compact)}
                    label={t.compact}
                  />
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
          <SectionCard className="mb-5" bodyClassName="px-5 py-4">
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="dark" className="rounded-full" onClick={() => setOverlay("bulk")}>
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
                <span className="hidden h-6 w-px bg-border-subtle lg:block" aria-hidden="true" />
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

            <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:w-[360px] lg:grid-cols-[repeat(2,minmax(0,1fr))]">
              <DayField
                label={t.from}
                value={contractDetails ? span.start : ""}
                edge="start"
                span={span}
                term={contractTerm}
                weekend={weekendDays}
                onPick={(next) => setSpan(next)}
              />
              <DayField
                label={t.to}
                value={contractDetails ? span.end : ""}
                edge="end"
                span={span}
                term={contractTerm}
                weekend={weekendDays}
                onPick={(next) => setSpan(next)}
              />
            </div>

            {contractTerm && (
              <p className="-mt-2 mb-4 text-xs leading-4 text-text-secondary">
                {fill(t.contractCoverage, {
                  start: readableDay(contractTerm.start, lang),
                  end: readableDay(contractTerm.end, lang),
                })}
              </p>
            )}

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
        </>
      )}

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
      {/* 
      {!live &&
        filter === "all" &&
        grid.counts.fewer > 0 &&
        month.key === "2026-09" &&
        !unpriced.length && (
          <div className="mb-4 rounded-xl border border-status-info/25 bg-status-info-bg px-4 py-3">
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
        )} */}

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
          <p className="min-w-0 flex-1 text-[12.5px] text-text-secondary">
            {liveGrid.nothingMatches[k]}
          </p>
          <button
            type="button"
            onClick={() => setFilter("all")}
            className="px-1 text-xs font-medium text-text-link hover:underline"
          >
            {liveGrid.clearFilter[k]}
          </button>
        </div>
      )}

      {pickedContract && (
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
          poolNote={poolHeader}
          poolCapacityLabel={inventoryDetail ? liveGrid.poolCapacity[k] : undefined}
          pool={inventoryDetail ? undefined : grid.pool}
          perRoomCaps={
            liveDetail
              ? Object.fromEntries(
                  allRows.map((row) => [
                    row.name,
                    row.target
                      ? (nightsOf(row.target.variationId).values().next().value?.capacity ?? 0)
                      : 0,
                  ]),
                )
              : grid.perRoomCaps
          }
          month={
            inventoryDetail
              ? {
                  ...month,
                  poolLeft: monthDates.map((day) => nightsOf(null).get(day)?.capacity ?? -1),
                }
              : month
          }
          nightSeasons={nightSeasons}
          seasonNote={seasonNote}
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
      )}

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
          /* Each Bulk operation opens with its own clean form. */
          key={overlay}
          kind={overlay === "bulk" ? "bulkRates" : overlay}
          contract={(live ? pickedContract!.name : ar ? grid.nameAr : grid.name).toUpperCase()}
          term={contractTerm}
          openOn={contractDetails ? span.start : undefined}
          {...(live && overlay === "bulk"
            ? {
                roomOptions: fixedPrice
                  ? bulkRoomTypes.map((type) => type.name)
                  : allRows.map((row) => ({ en: row.name, ar: row.nameAr })),
                // existing: [],
                existing: overrideRuns(overridesQuery.data ?? [], allRows, rateTargets.currency),
                liveRates: {
                  currency: rateTargets.currency,
                  fixedPrice,
                  supplementDefaultsFor: (room) =>
                    bulkSupplementDefaults(
                      fixedPrice
                        ? bulkRoomTypes.find((type) => type.name.en === room)?.variationId
                        : allRows.find((row) => row.name === room)?.target?.variationId,
                    ),
                  supplementRooms: allRows
                    .filter((row) => !row.base)
                    .map((row) => ({
                      name: { en: row.name, ar: row.nameAr },
                      supplement: bulkSupplementNow(row.target?.variationId),
                    })),
                  roomTypes: bulkRoomTypes,
                  onRangeChange: setBulkPicked,
                  roomName: rateRoomName,
                  /* The same set operation as before; only now it is previewed and confirmed. */
                  operationsFor: (value) => {
                    const span = {
                      startDate: value.range.start,
                      endDate: value.range.end ?? value.range.start,
                      ...(value.weekdays.length < 7 ? { weekdays: value.weekdays } : {}),
                    };
                    if (fixedPrice) {
                      return value.offers.map((offer) => ({
                        action: "set" as const,
                        basis: "selected_room_total" as const,
                        rate: offer.rate,
                        targets: [{ variationId: offer.variationId, mealPlan: offer.mealPlan }],
                        ...span,
                      }));
                    }
                    const base = value.rate;
                    if (!base) return [];
                    const targetsOf = (rows: typeof allRows) =>
                      rows.flatMap((row) => (row.target ? [row.target as RateTarget] : []));
                    const plus = (amount: number): RateAmount =>
                      "weekday" in base
                        ? { weekday: base.weekday + amount, weekend: base.weekend + amount }
                        : { amount: base.amount + amount };
                    return allRows
                      .filter((row) => value.rooms.includes(row.name))
                      .map((row) => ({
                        action: "set" as const,
                        basis: "selected_room_total" as const,
                        rate: plus(
                          row.base
                            ? 0
                            : (value.supplements.find((item) => item.room === row.name)?.amount ??
                                bulkSupplementNow(row.target?.variationId) ??
                                0),
                        ),
                        targets: targetsOf([row]),
                        ...span,
                      }));
                  },
                  /* The same remove operation as before: no rate, no basis, offer meal plan kept. */
                  removeOperationsFor: (row) => {
                    const run = row.id ? JSON.parse(row.id) : null;
                    if (!run) return null;
                    return [
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
                    ];
                  },
                  supplementOperationsFor: (value) => {
                    const dates: string[] = [];
                    const day = new Date(`${value.range.start}T00:00:00`);
                    const last = new Date(`${value.range.end ?? value.range.start}T00:00:00`);
                    while (day <= last) {
                      if (value.weekdays.includes(day.getDay())) dates.push(isoDay(day));
                      day.setDate(day.getDate() + 1);
                    }
                    const variationIds = fixedPrice
                      ? bulkRoomTypes
                          .filter((type) => value.rooms.includes(type.name.en))
                          .map((type) => type.variationId)
                      : [
                          ...new Set(
                            allRows
                              .filter((row) => value.rooms.includes(row.name))
                              .flatMap((row) => (row.target ? [row.target.variationId] : [])),
                          ),
                        ];
                    return [
                      {
                        targets: variationIds.map((variationId) => ({ variationId })),
                        dates,
                        ...(value.meals.length
                          ? {
                              mealChanges: value.meals.map((meal) => ({
                                type: meal.type,
                                action: "set" as const,
                                enabled: true,
                                price: meal.price,
                                pricingBasis: meal.pricingBasis,
                              })),
                            }
                          : {}),
                        ...(value.children.length
                          ? {
                              childChanges: value.children.map((band) => ({
                                ...band,
                                action: "set" as const,
                              })),
                            }
                          : {}),
                      },
                    ];
                  },
                  preview: (batch) => previewRates.mutateAsync(batch),
                  save: async (batch, expectedRevision) => {
                    const { operations } = batch;
                    const removal =
                      operations.length > 0 &&
                      batch.supplementOperations.length === 0 &&
                      allRemovals(operations);
                    if (!removal && !rateTargets.eligible) {
                      notify.error(liveGrid.notEligible[k]);
                      throw new Error("not eligible");
                    }
                    try {
                      await saveReviewedRates.mutateAsync({
                        expectedRevision,
                        ...rateBatchBody(batch),
                      });
                      notify.success(removal ? liveGrid.restored[k] : liveGrid.saved[k]);
                      return "saved" as const;
                    } catch (error) {
                      /* 409: refreshed by the hook; the overlay previews again for review. */
                      if (isConflict(error)) {
                        notify.error(rateReviewCopy.stale[k]);
                        return "stale" as const;
                      }
                      notify.error(getApiErrorMessage(error));
                      throw error;
                    }
                  },
                },
              }
            : {})}
          {...(live && overlay === "stopSale"
            ? {
                roomOptions: allRows
                  .filter(
                    (row, index, list) =>
                      list.findIndex(
                        (item) => item.target?.variationId === row.target?.variationId,
                      ) === index,
                  )
                  .map((row) => ({ en: row.name, ar: row.nameAr })),
                /* On Request shows both SLA fields, seeded from the contract SLA, except on an On Request contract. */
                needsSla: sellNeedsSla,
                slaDefaults: contractSla,
                slaReady: sellSlaReady,
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
                  if (sellNotReady()) throw new Error("sell-control targets not loaded");
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
                  const operations: SellControlOperation[] = lines.flatMap(
                    (line): SellControlOperation[] => {
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
                            status:
                              line.status === "stopSale"
                                ? ("stop_sale" as const)
                                : ("on_request" as const),
                            ...(line.allRooms
                              ? { allRooms: true as const }
                              : { variationIds: ids(line.rooms) }),
                            dates,
                            /* The final SLA is always sent, even when it matches the contract's. */
                            ...(line.sla && line.status === "onRequest"
                              ? { onRequestSettings: line.sla }
                              : {}),
                          },
                        ];
                      }
                      return line.ranges.map((range) => {
                        const scope = {
                          ...(line.allRooms
                            ? { allRooms: true as const }
                            : { variationIds: ids(line.rooms) }),
                          startDate: range.start,
                          endDate: range.end ?? range.start,
                          ...(line.weekdays.length < 7 ? { weekdays: line.weekdays } : {}),
                        };
                        return line.status === "openSale"
                          ? { action: "open_sale" as const, ...scope }
                          : {
                              action: "create" as const,
                              status:
                                line.status === "stopSale"
                                  ? ("stop_sale" as const)
                                  : ("on_request" as const),
                              ...scope,
                              ...(line.sla && line.status === "onRequest"
                                ? { onRequestSettings: line.sla }
                                : {}),
                            };
                      });
                    },
                  );
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
          {...(restrictionsOpen
            ? {
                roomOptions: allRows
                  .filter(
                    (row, index, list) =>
                      list.findIndex(
                        (item) => item.target?.variationId === row.target?.variationId,
                      ) === index,
                  )
                  .map((row) => ({ en: row.name, ar: row.nameAr })),
                existing: [
                  ...inheritedRestrictionRows(
                    restrictionTargets.data?.inheritedRules ?? [],
                    rateTargets.targets,
                  ),
                  ...restrictionOverrideRows,
                ],
                ...(restrictionTargets.data
                  ? {
                      liveRestrictions: {
                        contractId: pickedContract!.id,
                        weekendDays: restrictionWeekend,
                        eligible: restrictionTargets.data.eligible,
                        today: restrictionToday,
                        variationIds: (names: string[]) => [
                          ...new Set(
                            allRows
                              .filter((row) => names.includes(row.name))
                              .flatMap((row) => (row.target ? [row.target.variationId] : [])),
                          ),
                        ],
                        allVariationIds: restrictionVariationIds,
                        /* Undefined until the list is loaded, or when the rule no longer owns upcoming cells. */
                        ownedCellsOf: (ruleId: number) =>
                          restrictionOverrideRows.find((row) => row.restriction?.ruleId === ruleId)
                            ?.restriction?.ownedCells,
                        reloadRules: () => restrictionRules.refetch(),
                        roomName: (variationId: number) => {
                          const row = allRows.find(
                            (item) => item.target?.variationId === variationId,
                          );
                          return row
                            ? { en: row.name, ar: row.nameAr }
                            : { en: `#${variationId}`, ar: `#${variationId}` };
                        },
                        preview: (operations) => previewRestrictions.mutateAsync(operations),
                        save: async (operations, expectedRevision) => {
                          try {
                            await saveRestrictions.mutateAsync({ expectedRevision, operations });
                            notify.success(liveRestrictions.saved[k]);
                            return "saved" as const;
                          } catch (error) {
                            /* 409: refreshed by the hook; the overlay previews again for review. */
                            if (
                              (error as { response?: { status?: number } }).response?.status === 409
                            ) {
                              notify.error(liveRestrictions.stale[k]);
                              return "stale" as const;
                            }
                            notify.error(getApiErrorMessage(error));
                            throw error;
                          }
                        },
                      } satisfies LiveRestrictionsProps,
                    }
                  : {}),
              }
            : {})}
          {...(releaseOpen
            ? {
                /* Real Room + Views only: no demo rooms or rules in the live flow. */
                roomOptions: releaseRooms.map((room) => room.name),
                existing: [
                  ...(releaseData
                    ? [
                        inheritedReleaseRow(
                          releaseData.inheritedPolicy,
                          releaseData.onRequestSettings,
                        ),
                      ]
                    : []),
                  ...releaseOverrideRows,
                ],
                liveRelease: {
                  contractId: pickedContract!.id,
                  blocked: releaseBlocked,
                  today: releaseToday,
                  timezone: releaseData?.timezone ?? null,
                  term: {
                    startDate: rateTargets.startDate.slice(0, 10),
                    endDate: rateTargets.endDate.slice(0, 10),
                  },
                  rooms: releaseRooms,
                  allVariationIds: releaseVariationIds,
                  /* Undefined when the rule's remaining ownership could not be confirmed. */
                  ownedCellsOf: (ruleId: number) =>
                    releaseOverrideRows.find((row) => row.release?.ruleId === ruleId)?.release
                      ?.ownedCells,
                  reloadRules: () =>
                    Promise.all([releaseTargets.refetch(), releaseRules.refetch()]),
                  roomName: releaseRoomName,
                  preview: (operations) => previewRelease.mutateAsync(operations),
                  save: async (operations, expectedRevision) => {
                    try {
                      await saveRelease.mutateAsync({ expectedRevision, operations });
                      notify.success(liveRelease.saved[k]);
                      return "saved" as const;
                    } catch (error) {
                      /* 409: refreshed by the hook; the overlay previews again for review. */
                      if ((error as { response?: { status?: number } }).response?.status === 409) {
                        notify.error(liveRelease.stale[k]);
                        return "stale" as const;
                      }
                      notify.error(getApiErrorMessage(error));
                      throw error;
                    }
                  },
                } satisfies LiveReleaseProps,
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
                    ) ??
                      overlayNights[0] ??
                      1) - 1
                  ] ?? 0,
                currentWeekday:
                  nightRow.rate[
                    (overlayNights.find(
                      (night) => !weekendDays.includes(dateOfNight(month, night).getDay()),
                    ) ??
                      overlayNights[0] ??
                      1) - 1
                  ] ?? 0,
              }
            : overlayNights.length === 1
              ? { current: month.base[(overlayNights[0] ?? 1) - 1] ?? 0 }
              : {})}
          saving={saveReviewedRates.isPending || Boolean(nightReview?.loading)}
          currency={rateTargets?.currency}
          {...(live && nightReview
            ? {
                review: nightReview,
                reviewRoomName: rateRoomName,
                onConfirmReview: confirmNightRates,
                onBackFromReview: closeNightReview,
                onRetryReview: () =>
                  void previewNightRates(
                    nightReview.operations,
                    nightReview.stale,
                    nightReview.supplementOperations,
                  ),
              }
            : {})}
          {...(live && nightRow?.target && liveDetail ? { live: nightFacts(nightRow) } : {})}
          {...(live ? { childBands: nightChildBands } : {})}
          {...(live
            ? {
                weekendNames: {
                  en: weekendDays
                    .map((day) => liveGrid.terms.days[DAY_NAMES[day]!]?.en ?? "")
                    .join(", "),
                  ar: weekendDays
                    .map((day) => liveGrid.terms.days[DAY_NAMES[day]!]?.ar ?? "")
                    .join(" و"),
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
            closeNightReview();
            setOverlay(null);
            setTypedNights(null);
          }}
          onSave={(value) => {
            if (live) {
              const dates = overlayNights
                .map((night) => dateOfNight(month, night))
                .filter((date) => value.weekdays.includes(date.getDay()))
                .map(isoDay);
              const targets = pickedTargets();
              /* Fixed Price never edits meal plans here. */
              const meals = fixedPrice ? [] : value.meals;
              void previewNightRates(
                value.priceChanged || (!value.children.length && !meals.length)
                  ? [
                      {
                        action: "set",
                        basis: "selected_room_total",
                        rate: value.rate,
                        targets,
                        dates,
                      },
                    ]
                  : [],
                false,
                value.children.length || meals.length
                  ? [
                      {
                        targets: [...new Set(targets.map((target) => target.variationId))].map(
                          (variationId) => ({ variationId }),
                        ),
                        dates,
                        /* Guide p.5: a price-only set; the meal's basis and availability are kept. */
                        ...(meals.length
                          ? {
                              mealChanges: meals.map((meal) => ({
                                type: meal.type,
                                action: "set" as const,
                                price: meal.price,
                              })),
                            }
                          : {}),
                        ...(value.children.length
                          ? {
                              childChanges: value.children.map((band) => ({
                                ...band,
                                action: "set" as const,
                              })),
                            }
                          : {}),
                      },
                    ]
                  : [],
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
                /* The same remove operation as before, previewed for review first. */
                onUndo: () =>
                  void previewNightRates([
                    {
                      action: "remove",
                      targets: pickedTargets(),
                      dates: overlayNights.map((night) => isoDay(dateOfNight(month, night))),
                    },
                  ]),
              }
            : {})}
          onBreakdown={() => setOverlay("pool")}
          onStatus={() => setOverlay("status")}
        />
      )}

      {overlay === "status" && (
        <NightStatusOverlay
          /* A new contract, room or night starts a fresh form: no SLA carried over. */
          key={`${pickedContract?.id ?? ""}|${nightRow?.target?.variationId ?? ""}|${nightDay ?? ""}`}
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
                needsSla: sellNeedsSla,
                slaDefaults: nightSla,
                saving: saveSell.isPending || sellTargets.isPending,
                onApply: (state, sla) => {
                  if (sellNotReady()) return;
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
                            ...(sla && state === "request" ? { onRequestSettings: sla } : {}),
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
          countries={metadataQuery.countries}
          hotels={ratesHotels}
          loading={hotelsQuery.isLoading}
          error={Boolean(hotelsQuery.isError)}
          onRetry={() => void hotelsQuery.refetch()}
          value={pickedHotel?.id ?? null}
          search={hotelSearch}
          searchActive={hotelSearch.trim() !== "" || debouncedHotelSearch !== ""}
          onSearch={(next) => {
            setHotelSearch(next);
            setHotelPage(1);
          }}
          page={hotelPage}
          totalPages={hotelsQuery.meta?.totalPages ?? 1}
          onPageChange={setHotelPage}
          onPick={(id) => {
            if (id === pickedHotel?.id) return;
            setChosenContract(null);
            setPickedHotel(ratesHotels.find((item) => item.id === id) ?? null);
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
          loading={contractsQuery.isLoading}
          error={Boolean(contractsQuery.isError)}
          onRetry={() => void contractsQuery.refetch()}
          value={pickedContract?.id ?? null}
          includeEnded={includeEnded}
          onIncludeEnded={(next) => {
            setIncludeEnded(next);
            setContractPage(1);
          }}
          dates={contractDates}
          onDates={setContractDates}
          search={contractSearch}
          searchActive={contractSearch.trim() !== "" || debouncedContractSearch !== ""}
          onSearch={(next) => {
            setContractSearch(next);
            setContractPage(1);
          }}
          page={contractPage}
          totalPages={contractsQuery.meta?.totalPages ?? 1}
          onPageChange={setContractPage}
          onPick={(id) => setChosenContract(hotelContracts.find((item) => item.id === id) ?? null)}
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
                .filter(
                  ({ day, night }) =>
                    termDates.includes(day) && (!hidePast || !month.today || night >= month.today),
                );
              let email = "";
              try {
                email = JSON.parse(localStorage.getItem("userData") ?? "null")?.email ?? "";
              } catch {
                email = "";
              }
              exportRows({
                head: liveGrid.exportHead[k],
                rows: rows.flatMap((row) =>
                  shown
                    .filter(({ night }) => !fade?.(night, row.name))
                    .map(({ day, night }) => [
                      ar ? row.nameAr : row.name,
                      day,
                      String(row.rate[night - 1] ?? ""),
                      rateTargets.currency,
                      row.edited?.includes(night)
                        ? liveGrid.exportEdited[k]
                        : liveGrid.exportContract[k],
                      String(poolLeftAt(night) ?? roomLeftAt(row, night) ?? ""),
                      (row.status[night - 1] === "SS"
                        ? liveGrid.stopSaleValue
                        : row.status[night - 1] === "RQ"
                          ? liveGrid.onRequestValue
                          : liveGrid.openSaleValue)[k],
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
          {...(inventoryDetail && nightCell
            ? (() => {
                const day = isoDay(dateOfNight(month, nightCell.night));
                const pool = nightsOf(null).get(day);
                return {
                  live: {
                    capacity: pool?.capacity ?? null,
                    overbooking: pool?.overbookingLimit ?? 0,
                    caps: inventoryDetail.inventory.caps.flatMap((cap) => {
                      const max = cap.nights.find((night) => night.stayDate === day)?.maxRooms;
                      const row = allRows.find(
                        (item) => item.target?.variationId === cap.variationId,
                      );
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

export function DayField({
  label,
  value,
  edge,
  span,
  term,
  onPick,
  weekend,
}: {
  label: string;
  value: string;
  edge: "start" | "end";
  span: { start: string; end: string };
  term?: { start: string; end: string } | undefined;
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
  const seed = value || span.start || span.end;
  const floor =
    edge === "end" && span.start && (!term || span.start > term.start) ? span.start : term?.start;
  const closedHint = term
    ? edge === "end"
      ? t.toWithinContract
      : t.outsideContractClosed
    : edge === "end" && span.start
      ? t.beforeFromClosed
      : undefined;

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
              single
              shortcuts={false}
              {...(weekend ? { weekend } : {})}
              {...(floor ? { min: floor } : {})}
              {...(term ? { max: term.end } : {})}
              {...(closedHint ? { closedHint } : {})}
              {...(seed ? { value: { start: seed, end: null } } : {})}
              onCancel={() => setOpen(false)}
              onApply={(next) => {
                if (edge === "start") {
                  onPick({
                    start: next.start,
                    end: span.end && next.start > span.end ? next.start : span.end,
                  });
                } else {
                  onPick({ start: span.start, end: next.start });
                }

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
  placeholder,
  disabled = false,
}: {
  label: string;
  value: string;
  onClick: () => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className="w-full">
      <span className="mb-2 block text-[13px] font-medium text-text-primary">{label}</span>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="flex min-h-11 w-full items-center gap-2 rounded-[10px] border border-border-default bg-surface-default px-4 py-2 text-start transition-colors hover:border-border-strong disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-border-default"
      >
        <span
          className={cn(
            "min-w-0 flex-1 truncate text-sm",
            value ? "text-text-primary" : "text-text-muted",
          )}
        >
          {value || placeholder}
        </span>
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
const CHIP_TONE: Record<string, "success" | "danger" | "warning" | "neutral"> = {
  all: "success",
  soldOut: "neutral",
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
  tone: "success" | "danger" | "warning" | "neutral";
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
      : tone === "neutral"
        ? "bg-status-neutral"
        : "bg-status-warning";
  const idle = isAll
    ? "text-text-secondary hover:bg-surface-subtle"
    : tone === "danger"
      ? "bg-status-danger-bg text-status-danger"
      : tone === "neutral"
        ? "bg-cell-zero-inventory-bg text-status-neutral"
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
        (k === "ar" ? base.roomSizeNameAr : base.roomSizeNameEn) ||
          base.roomSizeNameEn ||
          base.roomSizeNameAr,
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
          days: weekendDays
            .map((day) => terms.days[day]?.[k] ?? day)
            .join(k === "ar" ? " و" : ", "),
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

function overrideRuns(
  overrides: RateOverrideRow[],
  rows: GridRow[],
  currency: string,
): AlreadySet[] {
  const sorted = [...overrides].sort(
    (a, b) =>
      a.variationId - b.variationId ||
      (a.mealPlan ?? "").localeCompare(b.mealPlan ?? "") ||
      a.stayDate.localeCompare(b.stayDate),
  );
  const runs: Array<{
    variationId: number;
    mealPlan: string | null;
    amount: number;
    dates: string[];
  }> = [];
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
    runs.push({
      variationId: item.variationId,
      mealPlan: item.mealPlan,
      amount: item.amount,
      dates: [item.stayDate],
    });
  }
  const label = (iso: string, lang: "en" | "ar") => {
    const on = new Date(`${iso}T00:00:00`);
    const num = (value: number) => (lang === "ar" ? arNum(value) : String(value));
    return `${num(on.getDate())} ${datePickerCopy[lang].monthsShort[on.getMonth()]} ${num(on.getFullYear())}`;
  };
  const span = (dates: string[], lang: "en" | "ar") =>
    dates.length === 1
      ? label(dates[0]!, lang)
      : `${label(dates[0]!, lang)} - ${label(dates[dates.length - 1]!, lang)}`;
  return runs.map((run) => {
    const row = rows.find(
      (item) =>
        item.target?.variationId === run.variationId &&
        (item.target.mealPlan ?? null) === run.mealPlan,
    );
    return {
      id: JSON.stringify({
        variationId: run.variationId,
        mealPlan: run.mealPlan,
        dates: run.dates,
      }),
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
      .map((run) =>
        run.length === 1
          ? label(run[0]!, lang)
          : `${label(run[0]!, lang)} - ${label(run[run.length - 1]!, lang)}`,
      )
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
          ...(rule.status === "on_request" && rule.onRequestSettings
            ? { sla: rule.onRequestSettings }
            : {}),
        },
        when: { en: segments(dates, "en"), ar: segments(dates, "ar") },
        rooms: { en: names(ids, "en"), ar: names(ids, "ar") },
        value: { en: value.en, ar: value.ar },
        tone: rule.status === "stop_sale" ? ("danger" as const) : ("warning" as const),
      };
    });
}

/* ------------------------------------------------ restriction sidebar rows */

const restrictionDayLabel = (iso: string, lang: "en" | "ar") => {
  const on = new Date(`${iso}T00:00:00`);
  const num = (value: number) => (lang === "ar" ? arNum(value) : String(value));
  return `${num(on.getDate())} ${datePickerCopy[lang].monthsShort[on.getMonth()]} ${num(on.getFullYear())}`;
};

/** Consecutive dates as runs, so disconnected segments stay visible. */
function dateRuns(dates: string[]): string[][] {
  const runs: string[][] = [];
  for (const day of [...new Set(dates)].sort()) {
    const last = runs[runs.length - 1];
    const next = last ? new Date(`${last[last.length - 1]}T00:00:00`) : null;
    next?.setDate(next.getDate() + 1);
    if (last && next && isoDay(next) === day) last.push(day);
    else runs.push([day]);
  }
  return runs;
}

const runsLabel = (runs: string[][], lang: "en" | "ar") =>
  runs
    .map((run) =>
      run.length === 1
        ? restrictionDayLabel(run[0]!, lang)
        : `${restrictionDayLabel(run[0]!, lang)} - ${restrictionDayLabel(run[run.length - 1]!, lang)}`,
    )
    .join(lang === "ar" ? "، " : ", ");

const bothLanguages = (make: (lang: "en" | "ar") => string) => ({ en: make("en"), ar: make("ar") });

/** Contract restrictions: read-only, edited only through the contract. */
function inheritedRestrictionRows(
  rules: RestrictionInheritedRule[],
  targets: RateTargetsData["targets"],
): AlreadySet[] {
  return rules.map((rule) => {
    const room = rule.roomId === null ? null : targets.find((item) => item.roomId === rule.roomId);
    const definition = {
      minimumStay: { minNights: rule.minNights, appliesOn: rule.appliesOn },
      ...(rule.restrictedCheckinDays.length
        ? { checkIn: [{ weekdays: rule.restrictedCheckinDays, status: "closed" as const }] }
        : {}),
      ...(rule.restrictedCheckoutDays.length
        ? { checkOut: [{ weekdays: rule.restrictedCheckoutDays, status: "closed" as const }] }
        : {}),
    };
    const from = rule.appliesFrom.slice(0, 10);
    const to = rule.appliesTo.slice(0, 10);
    return {
      id: `contract-restriction-${rule.id}`,
      fromContract: true,
      inactive: !rule.isActive,
      when: bothLanguages((lang) => runsLabel([[from, to]], lang)),
      rooms:
        rule.roomId === null
          ? liveRestrictions.allRooms
          : bothLanguages((lang) =>
              room
                ? (lang === "ar" ? room.roomSizeNameAr : room.roomSizeNameEn) ||
                  room.roomSizeNameEn ||
                  `#${rule.roomId}`
                : `#${rule.roomId}`,
            ),
      value: bothLanguages((lang) => describeRestriction(definition, lang)),
    };
  });
}

/**
 * Live operational overrides, with their exact remaining nonpast ownership.
 *
 * Edit is offered only when one edit operation over the rule's remaining
 * nights and rooms would own exactly the cells it owns now - same fields,
 * same values, nothing more. Otherwise Edit is locked with the reason and
 * Remove stays; nothing is approximated and no rule ID changes.
 */
function restrictionRuleRows(
  rules: RestrictionRule[],
  rows: GridRow[],
  weekend: number[],
  today: string,
  allVariationIds: number[],
): AlreadySet[] {
  return rules
    .filter((rule) => rule.live)
    .flatMap((rule) => {
      /* Remaining owned cells: effective or shadowed, tonight or later. Historical
         cells are read-only - not editable, not resent, not counted as cleared. */
      const current = rule.cells.filter(
        (cell) => cell.status !== "historical" && cell.stayDate >= today,
      );
      if (!current.length) return [];
      const dates = [...new Set(current.map((cell) => cell.stayDate))].sort();
      const ids = [...new Set(current.map((cell) => cell.variationId))];
      const allRooms = current.some((cell) => /all/i.test(cell.layer));
      const ownedCells = [
        ...new Set(current.map((cell) => `${cell.variationId}|${cell.stayDate}`)),
      ];

      /* Rebuild the rule as one definition, night by night. */
      const minCells = current.filter((cell) => cell.field === "minNights");
      const minValues = [...new Set(minCells.map((cell) => cell.value))];
      const minDates = [...new Set(minCells.map((cell) => cell.stayDate))].sort();
      const weekendDates = dates.filter((day) => weekend.includes(weekdayOfIso(day)));
      const sameList = (a: string[], b: string[]) =>
        a.length === b.length && a.every((value, index) => value === b[index]);
      const appliesOn: "every" | "weekend" | null = !minDates.length
        ? "every"
        : sameList(minDates, dates)
          ? "every"
          : weekendDates.length && sameList(minDates, weekendDates)
            ? "weekend"
            : null;
      const checks: Record<string, NightChecks> = {};
      for (const cell of current) {
        if (cell.field === "minNights") continue;
        const side = cell.field === "checkIn" ? "in" : "out";
        checks[cell.stayDate] = {
          ...checks[cell.stayDate],
          [side]: cell.value === 1 ? ("closed" as const) : ("open" as const),
        };
      }
      const checksOf = (iso: string): NightChecks => checks[iso] ?? {};
      const roomRows = ids.flatMap((id) => {
        const row = rows.find((item) => item.target?.variationId === id);
        return row ? [row] : [];
      });

      /* What one edit would own, compared with what the rule owns now. */
      const scopeIds = allRooms ? allVariationIds : ids;
      const expected = new Set<string>();
      for (const id of scopeIds) {
        for (const day of dates) {
          if (minValues.length === 1 && appliesOn) {
            if (appliesOn === "every" || weekend.includes(weekdayOfIso(day))) {
              expected.add(`minNights|${id}|${day}|${minValues[0]}`);
            }
          }
          const night = checksOf(day);
          if (night.in) expected.add(`checkIn|${id}|${day}|${night.in === "closed" ? 1 : 0}`);
          if (night.out) expected.add(`checkOut|${id}|${day}|${night.out === "closed" ? 1 : 0}`);
        }
      }
      const actual = new Set(
        current.map((cell) => `${cell.field}|${cell.variationId}|${cell.stayDate}|${cell.value}`),
      );
      const exact =
        expected.size === actual.size && [...actual].every((cell) => expected.has(cell));
      const lockedReason =
        minValues.length > 1
          ? liveRestrictions.lockedMinValues
          : !appliesOn ||
              !checksAreWeekdayUniform(dates, checksOf) ||
              !exact ||
              (!allRooms && roomRows.length !== ids.length)
            ? liveRestrictions.lockedShape
            : undefined;

      const definition = {
        ...(minValues.length
          ? {
              minimumStay: {
                minNights: minValues[0]!,
                appliesOn:
                  appliesOn === "weekend" ? ("weekend_days" as const) : ("every_day" as const),
              },
            }
          : {}),
        ...summarizeChecks(dates, checksOf),
      };
      const runs = dateRuns(dates);
      return [
        {
          id: `restriction-${rule.id}`,
          restriction: {
            ruleId: rule.id,
            ranges: runs.map((run) => ({ start: run[0]!, end: run[run.length - 1]! })),
            rooms: roomRows.map((row) => row.name),
            allRooms,
            minNights: minValues.length === 1 ? String(minValues[0]) : "",
            appliesOn: appliesOn ?? "every",
            checks,
            ownedCells,
            ...(lockedReason ? { lockedReason } : {}),
          },
          when: bothLanguages((lang) => runsLabel(runs, lang)),
          rooms: allRooms
            ? liveRestrictions.allRooms
            : bothLanguages((lang) =>
                ids
                  .map((id) => {
                    const row = roomRows.find((item) => item.target?.variationId === id);
                    return row ? (lang === "ar" ? row.nameAr : row.name) : `#${id}`;
                  })
                  .join(lang === "ar" ? "، " : ", "),
              ),
          value: bothLanguages((lang) => `#${rule.id} · ${describeRestriction(definition, lang)}`),
          ...(current.some((cell) => cell.status === "shadowed")
            ? { note: liveRestrictions.shadowedNote }
            : {}),
        },
      ];
    });
}

/* ---------------------------------------------------- release sidebar rows */

const isInheritedReleasePolicy = (value: unknown): value is ReleaseInheritedPolicy => {
  if (!value || typeof value !== "object") return false;
  const policy = value as Record<string, unknown>;
  return (
    (policy["type"] === "same_day" || policy["type"] === "number_of_days") &&
    typeof policy["releaseTime"] === "string" &&
    (policy["afterReleaseAction"] === "stop_sale" || policy["afterReleaseAction"] === "on_request")
  );
};

/**
 * The contract's own release policy, read-only "From the contract": its
 * timing, what happens after release and the On Request SLA. None of it is
 * ever sent in an override.
 */
function inheritedReleaseRow(inherited: unknown, sla: SellControlSla | null): AlreadySet {
  const policy = isInheritedReleasePolicy(inherited) ? inherited : null;
  const note = bothLanguages((lang) =>
    [
      policy
        ? (policy.afterReleaseAction === "stop_sale"
            ? liveRelease.afterStopSale
            : liveRelease.afterOnRequest)[lang]
        : null,
      sla
        ? fill(liveRelease.sla[lang], {
            minutes: lang === "ar" ? arNum(sla.slaMinutes) : String(sla.slaMinutes),
            expiry: liveRelease.expiry[sla.expiryAction]?.[lang] ?? sla.expiryAction,
          })
        : null,
    ]
      .filter(Boolean)
      .join(" · "),
  );
  return {
    id: "contract-release",
    fromContract: true,
    when: liveRelease.fromContractWhen,
    rooms: liveRestrictions.allRooms,
    /* Same day ignores any day count the policy carries. */
    value: policy
      ? bothLanguages((lang) => describeReleaseTiming(policy, lang))
      : liveRelease.noPolicy,
    ...(note.en ? { note } : {}),
  };
}

const RELEASE_CELL_STATUSES = ["effective", "shadowed", "historical"];

/**
 * A rule's layer, read defensively: "all_rooms" or room-specific, null when
 * unreadable. All-room and room layers are never confused with each other.
 */
function releaseLayerOf(layer: unknown): "all" | "room" | null {
  if (typeof layer !== "string") return null;
  if (/^all[_-]?rooms?(_override)?$/i.test(layer)) return "all";
  if (/^rooms?([_-](specific|override))?$/i.test(layer)) return "room";
  return null;
}

/** A rule's own timing, exactly as an edit would resend it; null when it can't be read. */
function releaseTimingOf(rule: ReleaseRule): NonNullable<
  NonNullable<AlreadySet["release"]>["seed"]
>["timing"] | null {
  if (!isReleaseTime(rule.releaseTime)) return null;
  if (rule.type === "same_day") return { type: "same_day", releaseTime: rule.releaseTime };
  if (rule.type === "number_of_days" && isReleaseDays(rule.daysBeforeCheckIn)) {
    return {
      type: "number_of_days",
      daysBeforeCheckIn: rule.daysBeforeCheckIn,
      releaseTime: rule.releaseTime,
    };
  }
  return null;
}

/**
 * Live release overrides. Nothing about a rule is guessed: its remaining
 * ownership is used only when every cell checks out, and Edit is offered only
 * when one edit over the rule's remaining nights - in its own layer, on its own
 * rooms, with its own timing - would own exactly the cells it owns now.
 * Otherwise Edit is locked with the reason and Remove stays (when ownership is known).
 */
function releaseRuleRows(
  rules: ReleaseRule[],
  today: string | null,
  roomName: (variationId: number) => { en: string; ar: string },
  allVariationIds: number[],
): AlreadySet[] {
  return rules
    .filter((rule) => rule.live === true)
    .map((rule) => {
      const ruleId = typeof rule.id === "number" && Number.isInteger(rule.id) ? rule.id : 0;
      const cellsKnown =
        today !== null &&
        ruleId > 0 &&
        Array.isArray(rule.cells) &&
        rule.cells.length > 0 &&
        rule.cells.every(
          (cell) =>
            Number.isInteger(cell?.variationId) &&
            cell.variationId > 0 &&
            isReleaseIsoDate(cell.stayDate) &&
            RELEASE_CELL_STATUSES.includes(cell.status),
        );
      const ownedCells = cellsKnown ? ownedNonpastReleaseCells(rule, today!) : [];
      const owned = cellsKnown && ownedCells.length > 0;
      /* Remaining owned cells: effective or shadowed, tonight or later. Historical
         cells are archived - never resent, never part of the replacement dates. */
      const current = owned
        ? rule.cells.filter((cell) => cell.status !== "historical" && cell.stayDate >= today!)
        : [];
      const dates = [...new Set(current.map((cell) => cell.stayDate))].sort();
      const ids = [...new Set(current.map((cell) => cell.variationId))].sort((a, b) => a - b);
      const shadowed = current.filter((cell) => cell.status === "shadowed").length;

      /* Can one edit rebuild this rule exactly? */
      const layer = releaseLayerOf(rule.layer);
      const timing = releaseTimingOf(rule);
      /* Every remaining (room, night) pair owned: one rooms x nights selection says it. */
      const fullGrid = ownedCells.length === ids.length * dates.length;
      /* All rooms expands to the contract's current Room + Views: only exact when the
         rule owns exactly those. A room rule keeps its own rooms, all of them offered. */
      const roomsExact =
        layer === "all"
          ? allVariationIds.length === ids.length &&
            allVariationIds.every((id) => ids.includes(id))
          : ids.every((id) => allVariationIds.includes(id));
      const editLocked = !owned
        ? liveRelease.lockedScope
        : !layer
          ? liveRelease.lockedLayer
          : !timing
            ? liveRelease.lockedTiming
            : dates.length > RELEASE_LIMITS.selectionNights
              ? liveRelease.lockedTooManyNights
              : !fullGrid
                ? liveRelease.lockedShape
                : !roomsExact
                  ? liveRelease.lockedRooms
                  : undefined;
      const seed =
        !editLocked && layer && timing
          ? {
              ranges: dateRuns(dates).map((run) => ({ start: run[0]!, end: run[run.length - 1]! })),
              allRooms: layer === "all",
              variationIds: layer === "all" ? [] : ids,
              timing,
            }
          : undefined;
      return {
        id: `release-${ruleId || "unknown"}`,
        release: {
          ruleId,
          ownedCells: owned ? ownedCells : undefined,
          ...(seed ? { seed } : { editLocked }),
          removeLocked: owned ? undefined : liveRelease.removeLocked,
        },
        when: owned
          ? bothLanguages((lang) => runsLabel(dateRuns(dates), lang))
          : liveRelease.scopeUnknown,
        rooms: owned
          ? bothLanguages((lang) =>
              ids.map((id) => roomName(id)[lang]).join(lang === "ar" ? "، " : ", "),
            )
          : { en: "-", ar: "-" },
        value: bothLanguages((lang) =>
          fill(liveRelease.ruleValue[lang], {
            id: lang === "ar" ? arNum(ruleId) : String(ruleId),
          }),
        ),
        ...(shadowed > 0
          ? {
              note:
                shadowed === current.length
                  ? liveRelease.allShadowedNote
                  : liveRestrictions.shadowedNote,
            }
          : {}),
      };
    });
}
