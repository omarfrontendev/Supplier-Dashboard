/**
 * OV 04.BP* / 04.BS* / 04.BR* / 04.BX* — the four bulk overlays, as one.
 *
 * Bulk rates, Stop sale / On Request, Release and Restrictions are one
 * component in the frames with four middles, and the shell around them
 * never changes: pick nights, pick rooms, set the one thing this overlay
 * sets, press Add, repeat. Nothing is written until the whole list is
 * reviewed and confirmed together.
 *
 * That last part is the rebuild. The old overlays saved as you went; these
 * build a list first, so a session of changes is read once rather than a
 * dialog at a time - and the review step is where the difference between
 * the four finally shows. Stop sale applies the moment you confirm, because
 * you cannot sell a night you have already closed. Prices, release and stay
 * rules are drafts until Review & publish.
 *
 * The right-hand panel is what is already set on this contract. A row that
 * came from the contract itself says so and sends you there, because
 * editing it here would be editing the contract by the back door.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { StatusPill } from "@/components/layout/page-shell";
import { DatePicker, dateOf, type DayRange } from "@/components/ui/date-picker";
import { CheckDays } from "@/components/rate-calendar/check-days";
import { datePickerCopy } from "@/lib/date-picker-copy";
import { fill, useLanguage } from "@/lib/i18n";
import {
  contractsWord,
  counted,
  countedOf,
  daysWord,
  nightsWord,
  rangesWord,
  roomNightsWord,
  roomsWord,
  rulesWord,
  weekdaysWord,
  weekendNightsWord,
} from "@/lib/arabic-count";
import {
  alreadySet,
  appliesAtOnce,
  bulkCopy,
  bulkKindLabel,
  bulkRooms,
  contractMinNights,
  contractRelease,
  hotelContracts,
  MAX_RELEASE_DAYS,
  releaseEditCopy,
  restrictionEditCopy,
  stopSaleEditCopy,
  type AlreadySet,
  type BulkKind,
} from "@/lib/bulk-range-data";
import {
  bulkSupplements as bs,
  liveGrid,
  liveRelease as lrel,
  liveRestrictions as lr,
  oneNight,
} from "@/lib/rate-overlay-data";
import { panelMotion, scrimMotion, useDismiss } from "@/components/layout/overlay";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  RestrictionEffective,
  RestrictionPreview,
} from "@/components/rate-calendar/restriction-live";
import {
  dayName,
  describeRestriction,
  planRestrictionOperations,
  RESTRICTION_LIMITS,
  restrictionBatchUsage,
  summarizeChecks,
  type NightChecks,
} from "@/lib/restriction-format";
import type {
  ChildCategory,
  RateAmount,
  RateBatch,
  RateChangesData,
  RateOperation,
  RatesMealPlan,
  ReleaseChangesData,
  ReleaseOperation,
  ReleaseTiming,
  RestrictionChangesData,
  RestrictionOperation,
  RestrictionScope,
  SupplementMealType,
  SupplementOperation,
} from "@/api/modules/rates-availability/types";
import { ReleasePreview } from "@/components/rate-calendar/release-live";
import { RateReviewPanel, rateReviewCopy } from "@/components/rate-calendar/rate-overlays";
import { ChildBandsFields } from "@/components/rate-calendar/child-bands";
import { useChildBands } from "@/components/rate-calendar/use-child-bands";
import {
  createReleaseOperation,
  editReleaseOperation,
  isReleaseDays,
  isReleaseTime,
  RELEASE_LIMITS,
  releaseNightsBetween,
  removeReleaseOperation,
  validateReleaseBatch,
  validateReleaseOperation,
  type ReleaseRoomSelection,
  type ReleaseSelection,
} from "@/lib/release-format";

type Lang = "en" | "ar";

/** The live Restrictions overlay: everything it reads and writes goes through these. */
export interface LiveRestrictionsProps {
  contractId: number;
  /** Contract weekend (0 = Sunday), already resolved with the backend's Thu/Fri fallback. */
  weekendDays: number[];
  eligible: boolean;
  /** Today in the hotel's published time zone, YYYY-MM-DD. */
  today: string;
  variationIds: (rooms: string[]) => number[];
  /** Every configured Room/View on the contract, from restriction targets: what All rooms expands to. */
  allVariationIds: number[];
  /** A live rule's remaining nonpast owned cells from the overrides list; undefined when not loaded. */
  ownedCellsOf: (ruleId: number) => string[] | undefined;
  /** Refetch the overrides list. */
  reloadRules: () => Promise<unknown>;
  roomName: (variationId: number) => Bi;
  preview: (operations: RestrictionOperation[]) => Promise<RestrictionChangesData>;
  /** "stale" when the revision moved on: the overlay previews again and waits for review. */
  save: (
    operations: RestrictionOperation[],
    expectedRevision: number,
  ) => Promise<"saved" | "stale">;
}

/** The live Release overlay: everything it reads and writes goes through these. */
export interface LiveReleaseProps {
  contractId: number;
  /** Set while writes are off for the whole contract, with the reason to show. */
  blocked: Bi | null;
  /** Today in the contract's published time zone, YYYY-MM-DD; null when that zone is missing or invalid. */
  today: string | null;
  timezone: string | null;
  /** The contract term, inclusive, when known. */
  term: { startDate: string; endDate: string } | undefined;
  /** Every configured Room + View from release targets, with the name the form shows. */
  rooms: Array<{ variationId: number; name: Bi }>;
  /** What All rooms expands to. */
  allVariationIds: number[];
  /** A live rule's remaining nonpast owned cells; undefined when they could not be confirmed. */
  ownedCellsOf: (ruleId: number) => string[] | undefined;
  /** Refetch the overrides list. */
  reloadRules: () => Promise<unknown>;
  roomName: (variationId: number) => Bi;
  preview: (operations: ReleaseOperation[]) => Promise<ReleaseChangesData>;
  /** "stale" when releaseRevision moved on: the overlay previews again and waits for review. */
  save: (operations: ReleaseOperation[], expectedRevision: number) => Promise<"saved" | "stale">;
}

/** What the live Bulk rates form hands over to be turned into operations. */
export interface RateApplyValue {
  range: DayRange;
  weekdays: number[];
  rooms: string[];
  rate: RateAmount | null;
  supplements: Array<{ room: string; amount: number }>;
  offers: Array<{ variationId: number; mealPlan: RatesMealPlan; rate: RateAmount }>;
}

export interface LiveSupplementRoom {
  name: Bi;
  supplement: number | null;
}

export interface LiveRoomType {
  name: Bi;
  variationId: number;
  offers: Array<{ mealPlan: RatesMealPlan; meal: Bi; contract: RateAmount | null }>;
}

export type MealBasis = "per_person" | "per_room";

export interface SupplementApplyValue {
  range: DayRange;
  weekdays: number[];
  rooms: string[];
  meals: Array<{ type: SupplementMealType; price: number; pricingBasis: MealBasis }>;
  children: Array<{ category: ChildCategory; from: number; to: number; price: number }>;
}

export interface SupplementDefaults {
  base: { weekday: number | null; weekend: number | null } | null;
  meals: Array<{ type: SupplementMealType; price: number | null; pricingBasis: MealBasis | null }>;
  children: Array<{
    category: ChildCategory;
    from: number | null;
    to: number | null;
    price: number | null;
  }>;
}

/**
 * The live Bulk rates overlay (guide p.3): operations are built by the page,
 * previewed for review, and saved exactly as reviewed with that preview's
 * ratesRevision.
 */
export interface LiveRatesProps {
  currency: string;
  fixedPrice: boolean;
  supplementDefaultsFor: (room: string) => SupplementDefaults | null;
  supplementRooms: LiveSupplementRoom[];
  roomTypes: LiveRoomType[];
  onRangeChange: (range: { start: string; end: string } | null) => void;
  operationsFor: (value: RateApplyValue) => RateOperation[];
  supplementOperationsFor: (value: SupplementApplyValue) => SupplementOperation[];
  /** A row of the existing-overrides list as remove operations; null when it cannot be read. */
  removeOperationsFor: (row: AlreadySet) => RateOperation[] | null;
  roomName: (variationId: number, mealPlan: RatesMealPlan | null) => Bi;
  preview: (batch: RateBatch) => Promise<RateChangesData>;
  /** "stale" when ratesRevision moved on: the overlay previews again and waits for review. */
  save: (batch: RateBatch, expectedRevision: number) => Promise<"saved" | "stale">;
}

const isoOf = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
/* The calendar keys nights the way CheckDays does. */
const calendarKey = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

/** A range of nights the picker handed back, kept with its own count. */
interface Picked {
  id: string;
  range: DayRange;
  nights: number;
}

/** One change waiting in the list. */
interface Line {
  id: string;
  /** "Stop sale on 16 room-nights" - the bold line, in both languages. */
  what: Bi;
  /** The dates and rooms underneath it. */
  detail: Bi;
  when: Bi;
  rooms: Bi;
  value: Bi;
  tone?: "danger" | "warning" | undefined;
  payload?: StatusPayload | undefined;
  /** Live restrictions: the operations this line stages, and the rule it edits or removes. */
  restrictions?: RestrictionOperation[] | undefined;
  /** Live release: the operations this line stages. */
  release?: ReleaseOperation[] | undefined;
  /** Live bulk rates: the operations this line stages. */
  rates?: RateOperation[] | undefined;
  supplements?: SupplementOperation[] | undefined;
  ruleId?: number | undefined;
  /** Stop sale / On Request: the form this line was added from, so Edit can put it back. */
  stopSale?: StopSaleDraft | undefined;
  /** Release: the form a new (create) line was added from, so Edit can put it back. */
  releaseDraft?: ReleaseDraft | undefined;
  /** Restrictions: the form this line was added from, so Edit can put it back. */
  restrictionDraft?: RestrictionDraft | undefined;
  /**
   * Stop sale / Release / Restrictions: a list item as it was before its first saved edit, for Undo changes.
   * Never set on a staged edit of a saved rule - there the rule as loaded is the original.
   */
  original?: Line | undefined;
}

/**
 * Release: exactly what the form held when a create line was added. The line's
 * `id` is its client identity; its operation is rebuilt from this on Save changes.
 */
interface ReleaseDraft {
  picked: Picked[];
  days: number[];
  /** The stored room picks, "All rooms" entry included, as the checkboxes keep them. */
  rooms: string[];
  mode: string;
  releaseDays: string;
  releaseAt: string;
  /** A staged edit of a saved rule: the rule it edits, and its fixed layer and rooms. */
  ruleId?: number | undefined;
  ruleRooms?: ReleaseRoomSelection | undefined;
}

/**
 * Restrictions: exactly what the form held when a line was added. Its operations
 * are rebuilt from this by planRestrictionOperations on Save changes, so field
 * ownership, inherit-by-omission and weekday groups follow the same rules as + Add.
 */
interface RestrictionDraft {
  picked: Picked[];
  /** The stored room picks, "All rooms" entry included, as the checkboxes keep them. */
  rooms: string[];
  minNights: string;
  appliesOn: "every" | "weekend";
  /** Live: check-in / check-out per picked night, keyed like the calendar; absent = Inherit. */
  nightChecks: Record<string, NightChecks>;
  /** Demo: closed check-in / check-out per night. */
  shut: Record<string, { in?: boolean; out?: boolean }>;
  /** A staged edit of a saved rule: the rule it edits. */
  ruleId?: number | undefined;
}

/** Release: a saved rule rebuilt for Edit (see AlreadySet.release.seed). */
type ReleaseSeed = NonNullable<NonNullable<AlreadySet["release"]>["seed"]>;

/**
 * Stop sale / On Request: exactly what the form held when a line was added.
 * The line's own `id` is its client identity; `ruleId` is the API rule it
 * edits, and is absent for a change that exists only in this list.
 */
interface StopSaleDraft {
  picked: Picked[];
  days: number[];
  /** The stored room picks, "All rooms" entry included, as the checkboxes keep them. */
  rooms: string[];
  setTo: string;
  sla: { minutes: string; expiryAction: StatusSla["expiryAction"]; touched: boolean };
  ruleId?: number | undefined;
}

const EVERY_DAY = [0, 1, 2, 3, 4, 5, 6];

export interface StatusPayload {
  ruleId?: number | undefined;
  status: "stopSale" | "openSale" | "onRequest";
  ranges: DayRange[];
  weekdays: number[];
  rooms: string[];
  allRooms: boolean;
  sla?: StatusSla | undefined;
}

export interface StatusSla {
  slaMinutes: number;
  expiryAction: "auto_reject" | "escalate_to_hoteliana";
}

interface Bi {
  en: string;
  ar: string;
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <p className="text-[10px] font-semibold uppercase tracking-[0.04em] text-text-quiet">
        {label}
      </p>
      <div className="mt-2">{children}</div>
    </section>
  );
}

/**
 * Nights between two keys, inclusive - the picker counts them the same way.
 * A range with no end is one night: the picker hands that back while only
 * the first night has been clicked.
 */
function nightsIn(range: DayRange): number {
  const start = dateOf(range.start).getTime();
  const end = dateOf(range.end ?? range.start).getTime();
  return Math.round(Math.abs(end - start) / 86400000) + 1;
}

export function BulkRangeOverlay({
  kind,
  contract,
  onClose,
  onEditContract,
  roomOptions,
  onApplyRates,
  existing,
  onRemoveExisting,
  onApplyStatus,
  needsSla = false,
  slaDefaults,
  slaReady = true,
  liveRestrictions,
  liveRelease,
  liveRates,
  term,
  openOn,
}: {
  kind: BulkKind;
  /**
   * The selected contract's term, inclusive YYYY-MM-DD. Nights outside it cannot
   * be picked. Undefined while unknown: the picker is then left unbounded.
   */
  term?: { start: string; end: string } | undefined;
  /** YYYY-MM-DD whose month the picker first shows. Only the visible month: nothing is selected. */
  openOn?: string | undefined;
  /** The contract this is scoped to, printed as the overline. */
  contract: string;
  onClose: () => void;
  onEditContract?: (() => void) | undefined;
  roomOptions?: Bi[] | undefined;
  onApplyRates?:
    | ((value: {
        range: DayRange;
        weekdays: number[];
        rooms: string[];
        rate: { amount: number } | { weekday: number; weekend: number };
      }) => Promise<void>)
    | undefined;
  existing?: AlreadySet[] | undefined;
  onRemoveExisting?: ((row: AlreadySet) => Promise<void>) | undefined;
  onApplyStatus?: ((lines: StatusPayload[]) => Promise<void>) | undefined;
  /** Show the SLA fields when On Request is chosen; their final values are always sent. */
  needsSla?: boolean;
  /** The contract's SLA, used only as the fields' starting values - never changed here. */
  slaDefaults?: StatusSla | null | undefined;
  /** False until the contract's SLA settings have loaded: On Request cannot be staged. */
  slaReady?: boolean;
  liveRestrictions?: LiveRestrictionsProps | undefined;
  liveRelease?: LiveReleaseProps | undefined;
  liveRates?: LiveRatesProps | undefined;
}) {
  const live = kind === "restrictions" ? liveRestrictions : undefined;
  const liveRel = kind === "release" ? liveRelease : undefined;
  const liveRt = kind === "bulkRates" ? liveRates : undefined;
  const { lang, dir } = useLanguage();
  const k: Lang = lang === "ar" ? "ar" : "en";
  const ar = k === "ar";
  const c = bulkCopy;
  const dp = datePickerCopy[k];
  const n = (v: number) => v.toLocaleString(ar ? "ar-EG" : "en-US");
  /* Every count is a phrase, chosen - Arabic has four forms, not two. */
  const say = (value: number, forms: Parameters<typeof counted>[1]) =>
    counted(value, forms, k);
  /* A year is not a quantity: 2026 must never come out as 2,026. */
  /* A clock inside an Arabic sentence is written in Arabic digits. */
  const clock = (value: string) =>
    ar
      ? value.replace(/[0-9]/g, (digit) => "٠١٢٣٤٥٦٧٨٩"[Number(digit)]!)
      : value;
  const year = (v: number) =>
    ar ? v.toLocaleString("ar-EG", { useGrouping: false }) : String(v);

  /* ---------------------------------------------------------- the form */
  const [picking, setPicking] = useState(false);
  const [picked, setPicked] = useState<Picked[]>([]);
  const [days, setDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [rooms, setRooms] = useState<string[]>([]);

  /* A new term trims the picked nights to it; nights still inside are kept as they are. */
  const termStart = term?.start;
  const termEnd = term?.end;
  useEffect(() => {
    if (!termStart || !termEnd) return;
    setPicked((current) => {
      let changed = false;
      const next = current.flatMap((item) => {
        const end = item.range.end ?? item.range.start;
        const from = item.range.start < termStart ? termStart : item.range.start;
        const to = end > termEnd ? termEnd : end;
        if (from === item.range.start && to === end) return [item];
        changed = true;
        if (from > to) return [];
        const range: DayRange = {
          start: from,
          end: item.range.end === null && from === to ? null : to,
        };
        return [{ ...item, range, nights: nightsIn(range) }];
      });
      return changed ? next : current;
    });
  }, [termStart, termEnd]);

  /* Bulk rates */
  const [priceMode, setPriceMode] = useState("apart");
  const [weekdayPrice, setWeekdayPrice] = useState("");
  const [weekendPrice, setWeekendPrice] = useState("");
  /* An empty form is not a wrong one: the price fields only go red once
     they have been asked for - the weekday when it has been typed in and
     emptied again, the weekend as soon as the weekday has an answer. */
  const [priceTouched, setPriceTouched] = useState(false);
  const [supplements, setSupplements] = useState<Record<string, string>>({});
  const [roomSupplementDraft, setRoomSupplementDraft] = useState<Record<string, string>>({});
  const [offerDraft, setOfferDraft] = useState<
    Partial<Record<RatesMealPlan, { weekday: string; weekend: string }>>
  >({});
  const [mealDraft, setMealDraft] = useState<
    Partial<Record<SupplementMealType, { price: string; basis: MealBasis }>>
  >({});
  /* Stop sale */
  const [setTo, setSetTo] = useState("stopSale");
  /* The API rule being edited (its persistent id); null for a change that is not a saved rule. */
  const [editingRule, setEditingRule] = useState<number | null>(null);
  /* Stop sale: the list line being edited (its client id); null when no line is. */
  const [editingLine, setEditingLine] = useState<string | null>(null);
  /* Stop sale is in Edit mode while either identity is held; otherwise + Add adds. */
  const stopSaleEditing = kind === "stopSale" && (editingLine !== null || editingRule !== null);
  /* Release is in Edit mode while a list line or a saved rule is held. */
  const releaseEditing = kind === "release" && (editingLine !== null || editingRule !== null);
  /* Restrictions is in Edit mode while a list line or a saved rule is held. */
  const restrictionsEditing =
    kind === "restrictions" && (editingLine !== null || editingRule !== null);
  /* Release, editing a saved rule: its layer and rooms exactly as loaded - never the checkboxes. */
  const [releaseRuleRooms, setReleaseRuleRooms] = useState<ReleaseRoomSelection | null>(null);
  const [everyContract, setEveryContract] = useState(false);
  /* The SLA fields start from the contract's SLA (30 min / auto reject when it has none). */
  const defaultSlaMinutes = String(slaDefaults?.slaMinutes ?? 30);
  const defaultExpiry = slaDefaults?.expiryAction ?? "auto_reject";
  const [slaMinutes, setSlaMinutes] = useState(defaultSlaMinutes);
  const [expiryAction, setExpiryAction] =
    useState<StatusSla["expiryAction"]>(defaultExpiry);
  /* Once the supplier edits the fields (or a saved rule fills them), late-loading defaults leave them alone. */
  const slaTouched = useRef(false);
  useEffect(() => {
    if (slaTouched.current) return;
    setSlaMinutes(defaultSlaMinutes);
    setExpiryAction(defaultExpiry);
  }, [defaultSlaMinutes, defaultExpiry]);
  /* Release */
  const [releaseMode, setReleaseMode] = useState("days");
  const [releaseDays, setReleaseDays] = useState("3");
  const [releaseAt, setReleaseAt] = useState("18:00");
  /* Restrictions */
  const [minNights, setMinNights] = useState("");
  /*
   * OV 04.BXF - a stay rule covers the whole range or only the contract's
   * weekend. On the nights it does not cover, a guest books as though the
   * rule were not there, which is why this is a sentence and not a filter.
   */
  const [appliesOn, setAppliesOn] = useState<"every" | "weekend">("every");
  /*
   * Check-in and check-out are closed per night, not per range: shutting
   * arrivals on one Friday is the ordinary case, and a single pair of
   * toggles could not say it. The key is the day, the value is what is
   * shut on it.
   */
  const [shut, setShut] = useState<Record<string, { in?: boolean; out?: boolean }>>(
    {}
  );
  /* Live: check-in / check-out are weekday groups, Inherit when unset. */
  /* Live: check-in / check-out per picked night, keyed like the calendar; absent = Inherit. */
  const [nightChecks, setNightChecks] = useState<Record<string, NightChecks>>({});
  const [preview, setPreview] = useState<RestrictionChangesData | null>(null);
  /* The exact restriction batch that preview was run for. */
  const [previewKey, setPreviewKey] = useState<string | null>(null);
  /* The release preview, kept with the exact operations it was run for. */
  const [releasePreview, setReleasePreview] = useState<{
    data: ReleaseChangesData;
    operations: ReleaseOperation[];
    key: string;
  } | null>(null);
  /* The rate preview, kept with the exact operations it was run for. */
  const [ratePreview, setRatePreview] = useState<{
    data: RateChangesData;
    batch: RateBatch;
    key: string;
  } | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [stale, setStale] = useState(false);
  const previewRun = useRef(0);

  /* --------------------------------------------------------- the list */
  const [lines, setLines] = useState<Line[]>([]);
  const [reviewing, setReviewing] = useState(false);
  /** What the banner at the top says, once something has happened. */
  const [note, setNote] = useState<
    | { kind: "added" | "updated" | "applied" | "drafted"; what: Bi }
    | { kind: "removed"; what: Bi; row: Line }
    | null
  >(null);
  /** Rows saved in this session, so the side panel can show them. */
  const [saved, setSaved] = useState<Line[]>([]);
  const [removed, setRemoved] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);

  const oneRange = kind === "bulkRates";
  const supplementRows = oneNight.supplements.slice(1);
  const mealRows = supplementRows.filter((row) => !row.label.en.startsWith("Child"));
  const childRows = supplementRows.filter((row) => row.label.en.startsWith("Child"));

  const title =
    kind === "bulkRates"
      ? c.bulkRatesTitle[k]
      : kind === "stopSale"
        ? c.stopSaleTitle[k]
        : kind === "release"
          ? c.releaseTitle[k]
          : c.restrictionsTitle[k];
  const body =
    kind === "bulkRates"
      ? c.bulkRatesBody[k]
      : kind === "stopSale"
        ? c.stopSaleBody[k]
        : kind === "release"
          ? c.releaseBody[k]
          : c.restrictionsBody[k];

  /* --------------------------------------------------- what is picked */
  const nights = picked.reduce((sum, item) => sum + item.nights, 0);
  const weekendDays = live?.weekendDays ?? [4, 5];
  const weekendNights = useMemo(() => {
    const out: string[] = [];
    for (const item of picked) {
      const start = dateOf(item.range.start);
      for (let i = 0; i < item.nights; i += 1) {
        const day = new Date(start);
        day.setDate(start.getDate() + i);
        if (weekendDays.includes(day.getDay())) {
          out.push(
            `${dp.daysShort[day.getDay()]} ${n(day.getDate())} ${dp.monthsShort[day.getMonth()]}`
          );
        }
      }
    }
    return out;
  }, [picked, k]);

  /** Every night that was picked, in order, as real dates. */
  const pickedDates = useMemo(() => {
    const out: Date[] = [];
    for (const item of picked) {
      const start = dateOf(item.range.start);
      for (let i = 0; i < item.nights; i += 1) {
        const day = new Date(start);
        day.setDate(start.getDate() + i);
        out.push(day);
      }
    }
    return out.sort((a, b) => a.getTime() - b.getTime());
  }, [picked]);
  const dayKey = (date: Date) =>
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  /* A night the rule does not cover is not a night you can close. */
  const covered = (date: Date) =>
    appliesOn === "every" || weekendDays.includes(date.getDay());
  const dayLabel = (date: Date) =>
    `${dp.daysShort[date.getDay()]} ${n(date.getDate())} ${dp.monthsShort[date.getMonth()]}`;
  const closedIn = pickedDates.filter(
    (date) => covered(date) && shut[dayKey(date)]?.in
  );
  const closedOut = pickedDates.filter(
    (date) => covered(date) && shut[dayKey(date)]?.out
  );

  const rangeLabel = (item: Picked) => {
    const start = dateOf(item.range.start);
    const end = dateOf(item.range.end ?? item.range.start);
    const same = start.getMonth() === end.getMonth();
    if (start.getTime() === end.getTime())
      return `${n(end.getDate())} ${dp.monthsShort[end.getMonth()]} ${year(end.getFullYear())}`;
    const left = same
      ? n(start.getDate())
      : `${n(start.getDate())} ${dp.monthsShort[start.getMonth()]}`;
    return `${left} - ${n(end.getDate())} ${dp.monthsShort[end.getMonth()]} ${year(end.getFullYear())}`;
  };
  const whenLabel = picked.map(rangeLabel).join(dir === "rtl" ? " و" : " and ");

  /* ------------------------------------------------- what is set, and if */
  const releaseNumber = Number(releaseDays);
  /* Live release takes 1-365 days (guide p.15); the demo keeps the frame's 30. */
  const releaseMax = liveRel ? RELEASE_LIMITS.maxDays : MAX_RELEASE_DAYS;
  const releaseTooMany =
    kind === "release" &&
    releaseMode === "days" &&
    releaseDays.trim() !== "" &&
    (!Number.isFinite(releaseNumber) || releaseNumber > releaseMax);
  /* Live only: a whole number of days, and a strict HH:MM time in both modes. */
  const releaseDaysValue = /^\d+$/.test(releaseDays.trim()) ? Number(releaseDays.trim()) : NaN;
  const releaseDaysBad =
    liveRel !== undefined &&
    releaseMode === "days" &&
    releaseDays.trim() !== "" &&
    !isReleaseDays(releaseDaysValue);
  const releaseTimeBad = liveRel !== undefined && releaseAt !== "" && !isReleaseTime(releaseAt);
  /* Base + Supplements: no room is picked. The base, meals and children are read from
     the base room, and every room's supplement is shown at once. */
  const baseSupplementsLive = liveRt !== undefined && !liveRt.fixedPrice;
  const baseRoomName = baseSupplementsLive
    ? roomOptions?.find((room) => !liveRt.supplementRooms.some((s) => s.name.en === room.en))?.en
    : undefined;
  const pickedRoom = baseSupplementsLive
    ? baseRoomName
    : rooms.length === 1
      ? rooms[0]
      : undefined;
  const supplementDefaults = liveRt && pickedRoom ? liveRt.supplementDefaultsFor(pickedRoom) : null;
  const mealOptions = liveRt && !liveRt.fixedPrice ? (supplementDefaults?.meals ?? []) : [];
  const childOptions = liveRt ? (supplementDefaults?.children ?? []) : [];
  const amountText = (value: string) => {
    const text = value.trim();
    return text === "" ? null : Number(text);
  };
  const textOf = (value: number | null | undefined) =>
    value === null || value === undefined ? "" : String(value);
  const mealShown = (meal: (typeof mealOptions)[number]) =>
    mealDraft[meal.type] ?? {
      price: textOf(meal.price),
      basis: meal.pricingBasis ?? "per_person",
    };
  const mealValues = mealOptions.flatMap((meal) => {
    const shown = mealShown(meal);
    const price = amountText(shown.price);
    if (price === null || !Number.isFinite(price) || price < 0) return [];
    const changed = price !== meal.price || shown.basis !== (meal.pricingBasis ?? "per_person");
    return changed ? [{ type: meal.type, price, pricingBasis: shown.basis }] : [];
  });
  const mealBad = mealOptions.some((meal) => {
    const price = amountText(mealShown(meal).price);
    return price !== null && (!Number.isFinite(price) || price < 0);
  });
  const children = useChildBands(childOptions);
  const childValues = children.values;
  const childBad = children.bad;
  const supplementsGiven = mealValues.length > 0 || childValues.length > 0;
  const fixedLive = liveRt?.fixedPrice === true;
  const roomSupplementShown = (room: LiveSupplementRoom) =>
    roomSupplementDraft[room.name.en] ?? textOf(room.supplement);
  const pickedSupplementRooms = liveRt && !fixedLive ? liveRt.supplementRooms : [];
  const supplementRoomInputs = pickedSupplementRooms.map((room) => ({
    room,
    amount: amountText(roomSupplementShown(room)),
  }));
  const supplementRoomValues = supplementRoomInputs.flatMap(({ room, amount }) =>
    amount === null || amount === room.supplement || !Number.isFinite(amount) || amount < 0
      ? []
      : [{ room: room.name.en, amount }],
  );
  const roomSupplementBad = supplementRoomInputs.some(
    ({ amount }) => amount !== null && (!Number.isFinite(amount) || amount < 0),
  );
  const roomSupplementNeedsBase = supplementRoomValues.length > 0 && weekdayPrice.trim() === "";
  const baseNow = supplementDefaults?.base ?? null;
  useEffect(() => {
    if (!liveRt || liveRt.fixedPrice || priceTouched) return;
    setWeekdayPrice(textOf(baseNow?.weekday));
    setWeekendPrice(textOf(baseNow?.weekend));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickedRoom, baseNow?.weekday, baseNow?.weekend]);
  const pickedRangeKey = picked[0]
    ? `${picked[0].range.start}|${picked[0].range.end ?? picked[0].range.start}`
    : "";
  useEffect(() => {
    if (!liveRt) return;
    const [start, end] = pickedRangeKey.split("|");
    liveRt.onRangeChange(start && end ? { start, end } : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickedRangeKey]);
  useEffect(
    () => () => liveRt?.onRangeChange(null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const baseChanged =
    liveRt !== undefined &&
    !liveRt.fixedPrice &&
    priceTouched &&
    (amountText(weekdayPrice) !== baseNow?.weekday ||
      (priceMode === "apart"
        ? amountText(weekendPrice) !== baseNow?.weekend
        : baseNow?.weekend !== null &&
          baseNow?.weekend !== undefined &&
          amountText(weekdayPrice) !== baseNow.weekend));
  const pickedRoomType = fixedLive
    ? liveRt.roomTypes.find((type) => rooms.includes(type.name.en))
    : undefined;
  const contractNights = (contract: RateAmount | null) =>
    contract
      ? "weekday" in contract
        ? { weekday: contract.weekday, weekend: contract.weekend }
        : { weekday: contract.amount, weekend: contract.amount }
      : null;
  const offerShown = (offer: LiveRoomType["offers"][number]) => {
    const nights = contractNights(offer.contract);
    return (
      offerDraft[offer.mealPlan] ?? {
        weekday: textOf(nights?.weekday),
        weekend: textOf(nights?.weekend),
      }
    );
  };
  const offerRate = (draft: { weekday: string; weekend: string }) => {
    const weekday = amountText(draft.weekday);
    const weekend = amountText(draft.weekend);
    if (weekday === null && weekend === null) return null;
    if (priceMode !== "apart") return weekday === null ? undefined : { amount: weekday };
    return weekday === null || weekend === null ? undefined : { weekday, weekend };
  };
  const sameAsContract = (rate: RateAmount, contract: RateAmount | null) => {
    const nights = contractNights(contract);
    if (!nights) return false;
    return "weekday" in rate
      ? rate.weekday === nights.weekday && rate.weekend === nights.weekend
      : rate.amount === nights.weekday && rate.amount === nights.weekend;
  };
  const offerValues = (pickedRoomType?.offers ?? []).flatMap((offer) => {
    const rate = offerRate(offerShown(offer));
    return offerDraft[offer.mealPlan] && rate && !sameAsContract(rate, offer.contract)
      ? [{ variationId: pickedRoomType!.variationId, mealPlan: offer.mealPlan, rate }]
      : [];
  });
  const offerBad = (pickedRoomType?.offers ?? []).some((offer) => {
    const rate = offerRate(offerShown(offer));
    if (rate === undefined) return true;
    if (rate === null) return false;
    return Object.values(rate).some((value) => !Number.isFinite(value) || value < 0);
  });
  const roomPriceChanged = fixedLive
    ? offerValues.length > 0
    : baseChanged || supplementRoomValues.length > 0;
  const priceOptional =
    liveRt !== undefined &&
    supplementsGiven &&
    weekdayPrice.trim() === "" &&
    weekendPrice.trim() === "";
  /* Add stays shut while a price is missing, but the box only says
     "fix the field in red" once there is a red field to fix. */
  const priceMissing =
    kind === "bulkRates" &&
    (fixedLive
      ? offerValues.length === 0 && !supplementsGiven
      : !priceOptional &&
        (weekdayPrice.trim() === "" || (priceMode === "apart" && weekendPrice.trim() === "")));
  const priceRed =
    kind === "bulkRates" &&
    (fixedLive
      ? offerBad
      : (priceTouched && weekdayPrice.trim() === "" && !priceOptional) ||
        (priceMode === "apart" && weekdayPrice.trim() !== "" && weekendPrice.trim() === ""));
  const broken =
    releaseTooMany ||
    priceRed ||
    releaseDaysBad ||
    releaseTimeBad ||
    mealBad ||
    childBad ||
    roomSupplementBad ||
    roomSupplementNeedsBase;

  /** The rooms the change reaches, once "all rooms" is resolved. */
  const roomList = roomOptions ? [bulkRooms[0]!, ...roomOptions] : bulkRooms;
  const realRooms =
    baseSupplementsLive || rooms.includes(roomList[0]!.en)
      ? roomList.slice(1)
      : roomList.filter((room) => rooms.includes(room.en));
  const roomNames = (list: Bi[]) => ({
    en: list.map((r) => r.en).join(", "),
    ar: list.map((r) => r.ar).join("، "),
  });

  /* OV 04.BSAC - the other contracts on this hotel, and what each carries. */
  const reach = useMemo(() => {
    if (!everyContract || kind !== "stopSale") return null;
    return hotelContracts.map((item) => {
      const has = realRooms.filter((room) => item.rooms.includes(room.en));
      const missing = realRooms.filter((room) => !item.rooms.includes(room.en));
      return { name: item.name, has, missing };
    });
  }, [everyContract, kind, rooms]);
  const reachRooms = reach
    ? reach.reduce((sum, item) => sum + item.has.length, 0)
    : realRooms.length;

  /* ------------------------------------------- live restriction operation */
  const allRoomsPicked = rooms.includes(roomList[0]!.en);
  /* What the rooms checkboxes show: "All rooms" covers every room, and every room
     picked one by one shows "All rooms" as picked too (the stored picks are unchanged). */
  const roomChoices = roomList.slice(1);
  const everyRoomShown =
    allRoomsPicked ||
    (roomChoices.length > 0 && roomChoices.every((room) => rooms.includes(room.en)));
  const someRoomShown = !everyRoomShown && roomChoices.some((room) => rooms.includes(room.en));
  const pickedIsos = [...new Set(pickedDates.map(isoOf))].sort();
  const minText = minNights.trim();
  const minValid = minText === "" || (/^\d+$/.test(minText) && Number(minText) <= 365);
  /* Omitted fields inherit: only what was set goes in, never null or []. */
  const minimumStay =
    minText !== "" && minValid
      ? {
          minNights: Number(minText),
          appliesOn: appliesOn === "weekend" ? ("weekend_days" as const) : ("every_day" as const),
        }
      : undefined;
  /* Check-in / check-out follow the calendar on every picked night; appliesOn never filters them. */
  const checksByIso = new Map(
    pickedDates.map((date) => [isoOf(date), nightChecks[calendarKey(date)] ?? {}]),
  );
  const checksOf = (iso: string): NightChecks => checksByIso.get(iso) ?? {};
  const restrictionTarget = ():
    | { allRooms: true }
    | { variationIds: number[] }
    | null => {
    if (!live) return null;
    if (allRoomsPicked) return { allRooms: true };
    const ids = live.variationIds(realRooms.map((room) => room.en));
    return ids.length ? { variationIds: ids } : null;
  };
  const pickedRange =
    picked.length === 1
      ? {
          startDate: picked[0]!.range.start,
          endDate: picked[0]!.range.end ?? picked[0]!.range.start,
        }
      : null;
  /** The selection as one scope, for reading what applies now. */
  const restrictionScope = (): RestrictionScope | null => {
    const target = restrictionTarget();
    if (!target || pickedIsos.length === 0) return null;
    return pickedRange ? { ...target, ...pickedRange } : { ...target, dates: pickedIsos };
  };
  const restrictionPlan = (() => {
    const target = restrictionTarget();
    if (!live || !target || pickedIsos.length === 0) return null;
    return planRestrictionOperations({
      isoDates: pickedIsos,
      checksOf,
      target,
      range: pickedRange,
      minimumStay,
      editRuleId: editingRule,
    });
  })();
  const restrictionIssue: Bi | null = (() => {
    if (!live || nights === 0 || realRooms.length === 0) return null;
    if (!live.eligible) return lr.notEligible;
    if (pickedIsos.some((day) => day < live.today)) return lr.pastNights;
    if (pickedIsos.length > RESTRICTION_LIMITS.dates) return lr.addTooManyNights;
    if (!minValid) return lr.minInvalid;
    if (!restrictionPlan) return null;
    if (!restrictionPlan.ok) {
      return restrictionPlan.reason === "editNotUniform" ? lr.editNotUniform : lr.nothingSet;
    }
    /* Each operation must land on a picked night: a weekend-only minimum on
       its own operation needs a picked weekend night. */
    const anyChecks = pickedIsos.some((iso) => checksOf(iso).in || checksOf(iso).out);
    const weekendMiss =
      minimumStay?.appliesOn === "weekend_days" &&
      !pickedDates.some((date) => weekendDays.includes(date.getDay()));
    if (weekendMiss && (restrictionPlan.split || !anyChecks)) return lr.minNoMatch;
    return null;
  })();
  const restrictionOperations = (): RestrictionOperation[] | undefined =>
    restrictionPlan?.ok ? restrictionPlan.operations : undefined;

  /* ----------------------------------------------- live release operation */
  const releaseTiming = (): ReleaseTiming =>
    releaseMode === "same"
      ? { type: "same_day", releaseTime: releaseAt }
      : { type: "number_of_days", daysBeforeCheckIn: releaseDaysValue, releaseTime: releaseAt };
  /*
   * One picked range of several nights goes as startDate/endDate; one night,
   * or several ranges, as explicit dates. Picker keys are already YYYY-MM-DD.
   */
  const releaseSelection = (): ReleaseSelection | null => {
    if (!liveRel || picked.length === 0) return null;
    const ids = liveRel.rooms
      .filter((room) => realRooms.some((item) => item.en === room.name.en))
      .map((room) => room.variationId);
    /* Editing a saved rule keeps its layer and rooms: allRooms stays allRooms, a room rule its own ids. */
    const roomSelection: ReleaseRoomSelection | null =
      releaseRuleRooms ??
      (allRoomsPicked ? { allRooms: true } : ids.length ? { variationIds: ids } : null);
    if (!roomSelection) return null;
    const spans = picked.map((item) => {
      const end = item.range.end ?? item.range.start;
      return item.range.start <= end
        ? { start: item.range.start, end }
        : { start: end, end: item.range.start };
    });
    const nightsSel =
      spans.length === 1 && spans[0]!.start !== spans[0]!.end
        ? { startDate: spans[0]!.start, endDate: spans[0]!.end }
        : { dates: spans.flatMap((span) => releaseNightsBetween(span.start, span.end)) };
    return {
      rooms: roomSelection,
      nights: nightsSel,
      weekdays: days,
    };
  };
  const releaseSelected = releaseSelection();
  /* A saved rule is edited under its own ruleId, with the complete replacement scope and timing. */
  const releaseOperation = releaseSelected
    ? editingRule !== null
      ? editReleaseOperation(editingRule, releaseSelected, releaseTiming())
      : createReleaseOperation(releaseSelected, releaseTiming())
    : null;
  const releaseIssue: Bi | null = (() => {
    if (!liveRel || nights === 0 || realRooms.length === 0) return null;
    if (liveRel.blocked) return liveRel.blocked;
    if (!liveRel.today) return lrel.noTimezone;
    if (!releaseOperation) return lrel.issues.noRooms;
    const codes = validateReleaseOperation(releaseOperation, {
      today: liveRel.today,
      term: liveRel.term,
    });
    return codes[0] ? lrel.issues[codes[0]] : null;
  })();

  /** What this overlay is setting, as the list will name it. */
  const setting: Bi = (() => {
    if (live) {
      const definition = { ...(minimumStay ? { minimumStay } : {}), ...summarizeChecks(pickedIsos, checksOf) };
      return {
        en: describeRestriction(definition, "en") || c.restrictionsTitle.en,
        ar: describeRestriction(definition, "ar") || c.restrictionsTitle.ar,
      };
    }
    if (kind === "bulkRates") {
      if (!liveRt) return c.newPrice;
      const parts = [
        ...((liveRt.fixedPrice ? offerValues.length > 0 : weekdayPrice.trim() !== "")
          ? [c.newPrice]
          : []),
        ...(supplementRoomValues.length ? [bs.roomSupplements] : []),
        ...(mealValues.length ? [bs.mealPrices] : []),
        ...(childValues.length ? [bs.childPrices] : []),
      ];
      return parts.length
        ? {
            en: parts.map((part) => part.en).join(" · "),
            ar: parts.map((part) => part.ar).join(" · "),
          }
        : c.newPrice;
    }
    if (kind === "stopSale") {
      return setTo === "stopSale"
        ? c.stopSale
        : setTo === "openSale"
          ? c.openSale
          : c.onRequest;
    }
    if (kind === "release" && liveRel) {
      return releaseMode === "same"
        ? {
            en: fill(lrel.sameDayAt.en, { at: releaseAt }),
            ar: fill(lrel.sameDayAt.ar, { at: clock(releaseAt) }),
          }
        : {
            en: fill(lrel.daysAt.en, { days: String(releaseNumber || 0), at: releaseAt }),
            ar: fill(lrel.daysAt.ar, { days: n(releaseNumber || 0), at: clock(releaseAt) }),
          };
    }
    if (kind === "release") {
      return releaseMode === "same"
        ? c.releaseSameDay
        : {
            en: fill(c.releaseLine.en, {
              days: String(releaseNumber || 0),
              at: clock(releaseAt),
            }),
            ar: fill(c.releaseLine.ar, {
              days: countedOf(releaseNumber || 0, daysWord, "ar"),
              at: clock(releaseAt),
            }),
          };
    }
    if (minNights.trim() !== "" && Number(minNights) > 0) {
      return {
        en: fill(c.minimumLine.en, { n: minNights }),
        ar: fill(c.minimumLine.ar, { n: n(Number(minNights)) }),
      };
    }
    if (closedIn.length > 0) return c.checkInClosedLine;
    if (closedOut.length > 0) return c.checkOutClosedLine;
    return c.restrictionsTitle;
  })();

  const total = nights * reachRooms;
  const headline: Bi = (() => {
    const each = (key: Lang) => {
      const what = setting[key];
      const nightPhrase = countedOf(nights, nightsWord, key);
      const totalPhrase = countedOf(total, roomNightsWord, key);
      if (reach) {
        return fill(c.acrossContracts[key], {
          what,
          nights: nightPhrase,
          rooms: countedOf(reachRooms, roomsWord, key),
          contracts: countedOf(reach.length, contractsWord, key),
          total: totalPhrase,
        });
      }
      if (kind === "restrictions") {
        /* OV 04.BXF - "on 8 nights x 9 rooms", not their product: a stay
           rule is not bought by the room-night the way a price is. */
        return fill(c.roomNightsNoTotal[key], {
          what,
          nights: nightPhrase,
          rooms: countedOf(realRooms.length, roomsWord, key),
        });
      }
      if (kind === "bulkRates") {
        return fill(c.roomNightsShort[key], { what, total: totalPhrase });
      }
      if (kind === "release") {
        /* OV 04.BRF - "on 8 nights x 1 room". Release is a moment in
           time, not a quantity of room-nights bought. */
        return fill(c.roomNightsNoTotal[key], {
          what,
          nights: nightPhrase,
          rooms: countedOf(realRooms.length, roomsWord, key),
        });
      }
      if (realRooms.length === 1) {
        return fill(c.roomNightsOne[key], {
          what,
          nights: nightPhrase,
          rooms: countedOf(1, roomsWord, key),
        });
      }
      return fill(c.roomNights[key], {
        what,
        nights: nightPhrase,
        rooms: countedOf(realRooms.length, roomsWord, key),
        total: totalPhrase,
      });
    };
    return { en: each("en"), ar: each("ar") };
  })();

  /* OV 04.BRRW - nights already inside the release window being set. */
  const releasePast = useMemo(() => {
    /* Live: never the browser clock - the preview shows each night's local deadline. */
    if (kind !== "release" || releaseMode !== "days" || !releaseNumber || liveRel) {
      return null;
    }
    const edge = Date.now() + releaseNumber * 86400000;
    const inside = picked.filter(
      (item) => dateOf(item.range.start).getTime() <= edge
    );
    return inside.length > 0 ? inside.map(rangeLabel).join(", ") : null;
  }, [kind, releaseMode, releaseNumber, picked, liveRel]);

  /* A night, a room and a sound middle are what make a line addable. */
  const slaAsked = Boolean(onApplyStatus) && needsSla && setTo === "onRequest";
  const slaNumber = Number(slaMinutes);
  const slaBad =
    slaAsked && (!Number.isInteger(slaNumber) || slaNumber < 10 || slaNumber > 120);
  const statusPayload = (): StatusPayload | undefined =>
    kind === "stopSale" && onApplyStatus
      ? {
          ...(editingRule !== null ? { ruleId: editingRule } : {}),
          status: setTo as StatusPayload["status"],
          ranges: picked.map((item) => item.range),
          weekdays: days,
          rooms: realRooms.map((room) => room.en),
          allRooms: rooms.includes(roomList[0]!.en),
          ...(slaAsked ? { sla: { slaMinutes: slaNumber, expiryAction } } : {}),
        }
      : undefined;
  const canAdd =
    nights > 0 &&
    realRooms.length > 0 &&
    !broken &&
    !priceMissing &&
    !slaBad &&
    !(Boolean(onApplyStatus) && setTo === "onRequest" && !slaReady) &&
    !restrictionIssue &&
    (!live || restrictionPlan?.ok === true) &&
    !releaseIssue &&
    (!liveRel || releaseOperation !== null) &&
    (!liveRt || roomPriceChanged || supplementsGiven);
  const rows = existing ?? alreadySet[kind];
  const shownSaved = existing ? [] : saved;
  /* The list's own new items. Stop sale shows a staged change to a saved rule in that
     rule's row instead, so an edit never reads as one more item. */
  const listedLines =
    kind === "stopSale"
      ? lines.filter((line) => line.stopSale?.ruleId === undefined)
      : /* Release: a staged removal of a saved rule shows in that rule's row, not as a new item. */
        kind === "release" || kind === "restrictions"
        ? lines.filter((line) => line.ruleId === undefined)
        : lines;
  /* Contract rules whose dates have not started - Inactive, in the
     contract's own table, and not "live" whatever the count says. */
  const dormant = rows.filter((row) => row.inactive).length;
  /* A row saved but not published is not live either. */
  const unpublished = rows.filter((row) => row.draft).length;
  /* English names the number alone, as the frame does; Arabic needs the
     noun with it, because "١ لم تُنشر" is not a sentence. */
  const howMany = (value: number) =>
    k === "ar" ? counted(value, rulesWord, "ar") : String(value);
  const labels = ar ? c.weekdaysAr : c.weekdays;
  /* Live restrictions and live release save as soon as they are confirmed: no draft step. */
  const atOnce = appliesAtOnce[kind] || Boolean(live) || Boolean(liveRel);

  const clearForm = () => {
    setPicked([]);
    setRooms([]);
    setWeekdayPrice("");
    setWeekendPrice("");
    setPriceTouched(false);
    setSupplements({});
    setMealDraft({});
    children.reset();
    setRoomSupplementDraft({});
    setOfferDraft({});
    setMinNights("");
    if (live) {
      setAppliesOn("every");
      setNightChecks({});
    }
    setEveryContract(false);
    slaTouched.current = false;
    setSlaMinutes(defaultSlaMinutes);
    setExpiryAction(defaultExpiry);
    setEditingRule(null);
    setEditingLine(null);
    setReleaseRuleRooms(null);
  };

  /* ------------------------------------- stop sale: Add mode / Edit mode */
  /** The form as it stands, kept on the line so Edit can put it back exactly. */
  const stopSaleDraft = (): StopSaleDraft => ({
    picked,
    days,
    rooms,
    setTo,
    sla: { minutes: slaMinutes, expiryAction, touched: slaTouched.current },
    ...(editingRule !== null ? { ruleId: editingRule } : {}),
  });
  /** Enter Edit mode on a line: its data in the form, its identities held until Save or Cancel. */
  const editStopSaleLine = (line: Line) => {
    const draft = line.stopSale;
    if (!draft) return;
    setPicking(false);
    setPicked(draft.picked);
    setDays(draft.days);
    setRooms(draft.rooms);
    setSetTo(draft.setTo);
    slaTouched.current = draft.sla.touched;
    setSlaMinutes(draft.sla.minutes);
    setExpiryAction(draft.sla.expiryAction);
    setEditingRule(draft.ruleId ?? null);
    setEditingLine(line.id);
  };
  /**
   * Back to Add mode: the nights, rooms, type and SLA start over; the list is
   * left exactly as it is. Leaving Edit mode also gives the week back, since
   * Edit put the item's own days in.
   */
  const restartStopSale = (leavingEdit: boolean) => {
    setPicking(false);
    setPicked([]);
    setRooms([]);
    setSetTo("stopSale");
    /* Leaving On Request drops its SLA, as the type radio does. */
    slaTouched.current = false;
    setSlaMinutes(defaultSlaMinutes);
    setExpiryAction(defaultExpiry);
    setEditingRule(null);
    setEditingLine(null);
    if (leavingEdit) setDays(EVERY_DAY);
  };
  /**
   * Undo changes on an updated item (not Cancel of an open edit): a list item goes back
   * to its original at the same id and position; a staged edit of a saved rule is dropped,
   * which leaves the rule exactly as loaded. Nothing else in the list moves.
   */
  const undoStopSaleChanges = (line: Line) => {
    if (line.stopSale?.ruleId !== undefined) {
      setLines((current) => current.filter((item) => item.id !== line.id));
    } else if (line.original) {
      const original = line.original;
      setLines((current) => current.map((item) => (item.id === line.id ? original : item)));
    } else {
      return;
    }
    /* An open edit of this item would otherwise save over the restored one. */
    if (editingLine === line.id) restartStopSale(true);
    setNote(null);
  };
  /** The staged change for a saved rule, which the list shows in that rule's own row. */
  const stagedEditOf = (ruleId: number | undefined) =>
    ruleId === undefined
      ? undefined
      : lines.find((line) => line.stopSale?.ruleId === ruleId);

  /* ---------------------------------------- release: Add mode / Edit mode */
  /** The form as it stands, kept on a create line so Edit can put it back exactly. */
  const releaseDraftNow = (): ReleaseDraft => ({
    picked,
    days,
    rooms,
    mode: releaseMode,
    releaseDays,
    releaseAt,
    ...(editingRule !== null && releaseRuleRooms
      ? { ruleId: editingRule, ruleRooms: releaseRuleRooms }
      : {}),
  });
  /**
   * Enter Edit mode on a line: a create line, or the staged edit of a saved rule
   * (which reopens with that rule's id and fixed rooms). Held until Save or Cancel.
   */
  const editReleaseLine = (line: Line) => {
    const draft = line.releaseDraft;
    if (!draft) return;
    setPicking(false);
    setPicked(draft.picked);
    setDays(draft.days);
    setRooms(draft.rooms);
    setReleaseMode(draft.mode);
    setReleaseDays(draft.releaseDays);
    setReleaseAt(draft.releaseAt);
    setEditingRule(draft.ruleId ?? null);
    setReleaseRuleRooms(draft.ruleRooms ?? null);
    setEditingLine(line.id);
  };
  /**
   * Enter Edit mode on a saved rule from its seed: remaining nights, its rooms
   * (shown, and fixed in its own layer) and its timing. No list line is held.
   */
  const editReleaseRule = (ruleId: number, seed: ReleaseSeed) => {
    if (!liveRel) return;
    setPicking(false);
    setPicked(
      seed.ranges.map((range, index) => ({
        id: `E-${ruleId}-${index}`,
        range,
        nights: nightsIn(range),
      })),
    );
    setDays(EVERY_DAY);
    setRooms(
      seed.allRooms
        ? [roomList[0]!.en]
        : liveRel.rooms
            .filter((room) => seed.variationIds.includes(room.variationId))
            .map((room) => room.name.en),
    );
    setReleaseRuleRooms(
      seed.allRooms ? { allRooms: true } : { variationIds: [...seed.variationIds] },
    );
    setReleaseMode(seed.timing.type === "same_day" ? "same" : "days");
    setReleaseDays(
      seed.timing.type === "number_of_days" ? String(seed.timing.daysBeforeCheckIn) : "3",
    );
    setReleaseAt(seed.timing.releaseTime);
    setEditingLine(null);
    setEditingRule(ruleId);
  };
  /**
   * Back to Add mode with the list left exactly as it is. Add mode keeps the
   * week and timing for the next line, as + Add always has; leaving Edit mode
   * gives them back too, since Edit put the item's own in.
   */
  const restartRelease = (leavingEdit: boolean) => {
    setPicking(false);
    clearForm();
    if (leavingEdit) {
      setDays(EVERY_DAY);
      setReleaseMode("days");
      setReleaseDays("3");
      setReleaseAt("18:00");
    }
  };
  /**
   * Undo changes: an edited create line goes back to its original at the same id
   * and position; a staged removal of a saved rule is dropped, which leaves the
   * rule exactly as loaded. The batch, Review and preview all follow `lines`.
   */
  const undoReleaseChanges = (line: Line) => {
    if (line.ruleId !== undefined) {
      setLines((current) => current.filter((item) => item.id !== line.id));
    } else if (line.original) {
      const original = line.original;
      setLines((current) => current.map((item) => (item.id === line.id ? original : item)));
    } else {
      return;
    }
    /* An open edit of this item would otherwise save over the restored one. */
    if (editingLine === line.id) restartRelease(true);
    setNote(null);
  };

  /* ----------------------------------- restrictions: Add mode / Edit mode */
  /** The form as it stands, kept on the line so Edit can put it back exactly. */
  const restrictionDraftNow = (): RestrictionDraft => ({
    picked,
    rooms,
    minNights,
    appliesOn,
    nightChecks,
    shut,
    ...(live && editingRule !== null ? { ruleId: editingRule } : {}),
  });
  /**
   * Enter Edit mode on a line: a new item, or the staged edit of a saved rule
   * (which reopens under that rule's id). Held until Save changes or Cancel.
   */
  const editRestrictionLine = (line: Line) => {
    const draft = line.restrictionDraft;
    if (!draft) return;
    setPicking(false);
    setPicked(draft.picked);
    setRooms(draft.rooms);
    setMinNights(draft.minNights);
    setAppliesOn(draft.appliesOn);
    setNightChecks(draft.nightChecks);
    setShut(draft.shut);
    setEditingRule(draft.ruleId ?? null);
    setEditingLine(line.id);
  };
  /**
   * Back to Add mode with the list left exactly as it is. Leaving Edit mode also
   * gives back the per-night choices and Applies on, since Edit put the item's own in.
   */
  const restartRestrictions = (leavingEdit: boolean) => {
    setPicking(false);
    clearForm();
    if (leavingEdit) {
      setAppliesOn("every");
      setShut({});
    }
  };
  /**
   * Restrictions: take out one picked range only. Per-night check-in / check-out
   * choices go with it unless another remaining range still covers that night,
   * so they can never come back unseen; the operations follow on the next render.
   */
  const removeRestrictionRange = (item: Picked) => {
    const rest = picked.filter((other) => other.id !== item.id);
    const keep = new Set<string>();
    for (const other of rest) {
      const start = dateOf(other.range.start);
      for (let i = 0; i < other.nights; i += 1) {
        const day = new Date(start);
        day.setDate(start.getDate() + i);
        keep.add(calendarKey(day));
      }
    }
    const prune = <T,>(map: Record<string, T>) =>
      Object.fromEntries(Object.entries(map).filter(([key]) => keep.has(key)));
    setPicked(rest);
    setNightChecks((current) => prune(current));
    setShut((current) => prune(current));
  };
  /**
   * Undo changes: an edited new item goes back to its original at the same id and
   * position; a staged edit or removal of a saved rule is dropped, which leaves the
   * rule exactly as loaded. The batch, Review and preview all follow `lines`.
   */
  const undoRestrictionChanges = (line: Line) => {
    if (line.ruleId !== undefined) {
      setLines((current) => current.filter((item) => item.id !== line.id));
    } else if (line.original) {
      const original = line.original;
      setLines((current) => current.map((item) => (item.id === line.id ? original : item)));
    } else {
      return;
    }
    /* An open edit of this item would otherwise save over the restored one. */
    if (editingLine === line.id) restartRestrictions(true);
    setNote(null);
  };

  /* After a successful apply/save: the whole form back to how it opened. */
  const resetForm = () => {
    clearForm();
    setPicking(false);
    setDays([0, 1, 2, 3, 4, 5, 6]);
    setPriceMode("apart");
    setSetTo("stopSale");
    setReleaseMode("days");
    setReleaseDays("3");
    setReleaseAt("18:00");
    setAppliesOn("every");
    setShut({});
    setNightChecks({});
    setStale(false);
  };

  /* Live bulk rates: the page builds the operations from exactly what the form holds. */
  const rateOperations = (): RateOperation[] | undefined =>
    liveRt && picked[0] && roomPriceChanged
      ? liveRt.operationsFor({
          range: picked[0].range,
          weekdays: days,
          /* Base + Supplements: a new base reaches every room; otherwise only the
             rooms whose supplement was changed. */
          rooms:
            baseSupplementsLive && !baseChanged
              ? supplementRoomValues.map((item) => item.room)
              : realRooms.map((room) => room.en),
          rate:
            liveRt.fixedPrice || weekdayPrice.trim() === ""
              ? null
              : priceMode === "apart"
                ? { weekday: amountOf(weekdayPrice), weekend: amountOf(weekendPrice) }
                : { amount: amountOf(weekdayPrice) },
          supplements: supplementRoomValues,
          offers: offerValues,
        })
      : undefined;
  const supplementOperations = (): SupplementOperation[] | undefined =>
    liveRt && picked[0] && supplementsGiven
      ? liveRt.supplementOperationsFor({
          range: picked[0].range,
          weekdays: days,
          rooms: realRooms.map((room) => room.en),
          meals: mealValues,
          children: childValues,
        })
      : undefined;

  const lineNow = (): Line => {
    const detail = (key: Lang) =>
      `${whenLabel} · ${roomNames(realRooms)[key]}`;
    return {
      id: `L-${Date.now()}`,
      what: headline,
      detail: { en: detail("en"), ar: detail("ar") },
      when: { en: whenLabel, ar: whenLabel },
      rooms: roomNames(realRooms),
      value: setting,
      payload: statusPayload(),
      restrictions: restrictionOperations(),
      rates: rateOperations(),
      supplements: supplementOperations(),
      ...(live && editingRule !== null ? { ruleId: editingRule } : {}),
    };
  };

  const reviewOne = () => {
    setLines([lineNow()]);
    setReviewing(true);
  };

  /**
   * Stop sale / On Request: + Add in Add mode, Save changes in Edit mode.
   * - Add mode appends one new line.
   * - Editing a line (new or a staged change to a saved rule) replaces that
   *   line in place: same id, same position, nothing else in the list moves.
   * - Editing a saved rule with no staged change yet stages one line carrying
   *   its ruleId; the list shows it in that rule's own row, never as a new item,
   *   and Review & save sends it through the existing edit operation.
   * Only the nights, rooms, type and SLA start over afterwards; the list and
   * everything else stay. The full reset is resetForm in confirm.
   */
  const addOrUpdateStopSale = (detail: (key: Lang) => string) => {
    const lineId = editingLine;
    const ruleId = editingRule ?? undefined;
    const next: Line = {
      id: lineId ?? `L-${Date.now()}`,
      what: headline,
      detail: { en: detail("en"), ar: detail("ar") },
      when: { en: whenLabel, ar: whenLabel },
      rooms: roomNames(realRooms),
      value: setting,
      tone: setTo === "stopSale" ? "danger" : setTo === "onRequest" ? "warning" : undefined,
      payload: statusPayload(),
      stopSale: stopSaleDraft(),
    };
    if (lineId !== null) {
      /* A list item keeps its state from before the first edit, so Undo changes goes all the way back. */
      const replace = (list: Line[]) =>
        list.map((line) =>
          line.id === lineId
            ? ruleId === undefined
              ? { ...next, original: line.original ?? line }
              : next
            : line,
        );
      setLines(replace);
      /* Demo only: a line already saved in this session is edited where it is shown. */
      setSaved(replace);
    } else {
      setLines((current) => [
        /* One staged change per saved rule: never two lines for the same rule. */
        ...current.filter(
          (line) => ruleId === undefined || line.stopSale?.ruleId !== ruleId,
        ),
        next,
      ]);
    }
    setNote({ kind: stopSaleEditing ? "updated" : "added", what: headline });
    restartStopSale(stopSaleEditing);
  };

  /**
   * Release: + Add in Add mode, Save changes in Edit mode.
   * - Add mode appends one new create line.
   * - Edit mode replaces the held line in place: same id, same position, its
   *   operation rebuilt from the form, and its pre-edit state kept once as
   *   `original` so Undo changes goes all the way back across repeated edits.
   * The staged batch, Review and the preview key all read `lines`, so the
   * updated line is the only version anything sees.
   */
  const addOrUpdateRelease = (detail: (key: Lang) => string) => {
    const lineId = editingLine;
    /* A saved rule's edit is staged against its own ruleId and shown in that rule's row. */
    const ruleId = editingRule ?? undefined;
    const next: Line = {
      id: lineId ?? `L-${Date.now()}`,
      what: headline,
      detail: { en: detail("en"), ar: detail("ar") },
      when: { en: whenLabel, ar: whenLabel },
      rooms: roomNames(realRooms),
      value: setting,
      release: liveRel && releaseOperation ? [releaseOperation] : undefined,
      releaseDraft: releaseDraftNow(),
      ruleId,
    };
    if (lineId !== null) {
      /* In place. A create line keeps its pre-edit state once; a saved rule's
         staged edit needs none - the rule as loaded is its original. */
      setLines((current) =>
        current.map((line) =>
          line.id === lineId
            ? ruleId === undefined
              ? { ...next, original: line.original ?? line }
              : next
            : line,
        ),
      );
    } else {
      setLines((current) => [
        /* One staged change per saved rule: an earlier edit or removal of it is replaced. */
        ...current.filter((line) => ruleId === undefined || line.ruleId !== ruleId),
        next,
      ]);
    }
    setNote({ kind: releaseEditing ? "updated" : "added", what: headline });
    restartRelease(releaseEditing);
  };

  /**
   * Restrictions: + Add in Add mode, Save changes in Edit mode. Operations always
   * come from planRestrictionOperations over the current form (edit under the
   * saved rule's own ruleId, never split; creates may split night by night).
   * - Add mode appends one new line.
   * - Editing a line replaces it in place: same id, same position. A new item
   *   keeps its pre-edit state once as `original`, so Undo changes goes all the
   *   way back across repeated edits; a saved rule's staged edit needs none.
   * - Editing a saved rule with no staged change stages one line under its ruleId,
   *   replacing any earlier edit or removal of it, shown in that rule's own row.
   */
  const addOrUpdateRestrictions = (detail: (key: Lang) => string) => {
    const lineId = editingLine;
    const ruleId = live && editingRule !== null ? editingRule : undefined;
    const next: Line = {
      id: lineId ?? `L-${Date.now()}`,
      what: headline,
      detail: { en: detail("en"), ar: detail("ar") },
      when: { en: whenLabel, ar: whenLabel },
      rooms: roomNames(realRooms),
      value: setting,
      restrictions: restrictionOperations(),
      restrictionDraft: restrictionDraftNow(),
      ruleId,
    };
    if (lineId !== null) {
      const replace = (list: Line[]) =>
        list.map((line) =>
          line.id === lineId
            ? ruleId === undefined
              ? { ...next, original: line.original ?? line }
              : next
            : line,
        );
      setLines(replace);
    } else {
      setLines((current) => [
        /* One staged change per saved rule: an earlier edit or removal of it is replaced. */
        ...current.filter((line) => ruleId === undefined || line.ruleId !== ruleId),
        next,
      ]);
    }
    setNote({ kind: restrictionsEditing ? "updated" : "added", what: headline });
    restartRestrictions(restrictionsEditing);
  };

  const add = () => {
    /* A night-by-night create is saved as several rules: the line says so. */
    const splitInto =
      live && restrictionPlan?.ok && restrictionPlan.split ? restrictionPlan.operations.length : 0;
    const detail = (key: Lang) =>
      `${whenLabel} · ${roomNames(realRooms)[key]}${
        splitInto ? ` · ${fill(lr.splitNote[key], { count: n(splitInto) })}` : ""
      }`;
    const editing = live && editingRule !== null ? editingRule : undefined;
    if (kind === "stopSale") {
      addOrUpdateStopSale(detail);
      return;
    }
    if (kind === "release") {
      addOrUpdateRelease(detail);
      return;
    }
    if (kind === "restrictions") {
      addOrUpdateRestrictions(detail);
      return;
    }
    setLines((current) => [
      /* One staged change per live rule: a newer edit replaces the older one. */
      ...current.filter((line) => editing === undefined || line.ruleId !== editing),
      {
        id: `L-${Date.now()}`,
        what: headline,
        detail: { en: detail("en"), ar: detail("ar") },
        when: { en: whenLabel, ar: whenLabel },
        rooms: roomNames(realRooms),
        value: setting,
        payload: statusPayload(),
        restrictions: restrictionOperations(),
        release: liveRel && releaseOperation ? [releaseOperation] : undefined,
        ruleId: editing,
      },
    ]);
    setNote({ kind: "added", what: headline });
    clearForm();
  };

  const [applying, setApplying] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const amountOf = (text: string) =>
    Number(text.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660)).replace(/[^0-9.]/g, ""));

  /* The exact batch that is previewed is the batch that is saved. */
  const stagedOperations = lines.flatMap((line) => line.restrictions ?? []);
  /* A restriction preview counts only while it was run for exactly the operations staged
     now: any change to the list voids it in the same render, before a new preview starts. */
  const stagedRestrictionsKey = JSON.stringify(stagedOperations);
  const currentPreview = preview && previewKey === stagedRestrictionsKey ? preview : null;
  /* Pre-review limits over the whole batch. Old ownership comes from the list; an
     unknown rule blocks review rather than counting as zero. Preview stays authoritative. */
  const batchUsage = live
    ? restrictionBatchUsage(stagedOperations, live.allVariationIds, live.ownedCellsOf)
    : null;
  const restrictionBatchIssue: Bi | null = !batchUsage
    ? null
    : batchUsage.unknownRuleIds.length
      ? {
          en: fill(lr.unknownRules.en, { ids: batchUsage.unknownRuleIds.map((id) => `#${id}`).join(", ") }),
          ar: fill(lr.unknownRules.ar, { ids: batchUsage.unknownRuleIds.map((id) => `#${id}`).join("، ") }),
        }
      : batchUsage.operations > RESTRICTION_LIMITS.operations
        ? {
            en: fill(lr.limitOperations.en, { n: String(batchUsage.operations) }),
            ar: fill(lr.limitOperations.ar, { n: n(batchUsage.operations) }),
          }
        : batchUsage.dates > RESTRICTION_LIMITS.dates
          ? {
              en: fill(lr.limitDates.en, { n: String(batchUsage.dates) }),
              ar: fill(lr.limitDates.ar, { n: n(batchUsage.dates) }),
            }
          : batchUsage.cells > RESTRICTION_LIMITS.cells
            ? {
                en: fill(lr.limitCells.en, { n: String(batchUsage.cells) }),
                ar: fill(lr.limitCells.ar, { n: n(batchUsage.cells) }),
              }
            : null;

  /* Live release: the same pre-review limits, from release-format. A removal
     whose remaining ownership is unknown blocks review and save. */
  const stagedRelease = lines.flatMap((line) => line.release ?? []);
  /* A preview counts only while it was run for exactly the operations staged now:
     any change to the list voids it in the same render, before a new preview starts. */
  const stagedReleaseKey = JSON.stringify(stagedRelease);
  const currentReleasePreview =
    releasePreview && releasePreview.key === stagedReleaseKey ? releasePreview : null;
  const releaseCheck =
    liveRel && liveRel.today
      ? validateReleaseBatch(stagedRelease, {
          today: liveRel.today,
          term: liveRel.term,
          allVariationIds: liveRel.allVariationIds,
          ownedCellsOf: liveRel.ownedCellsOf,
        })
      : null;
  const releaseUnknown = releaseCheck?.usage.unknownRuleIds ?? [];
  const releaseBatchIssue: Bi | null =
    !liveRel || lines.length === 0
      ? null
      : liveRel.blocked
        ? liveRel.blocked
        : !releaseCheck
          ? lrel.noTimezone
          : releaseUnknown.length
            ? {
                en: fill(lr.unknownRules.en, {
                  ids: releaseUnknown.map((id) => `#${id}`).join(", "),
                }),
                ar: fill(lr.unknownRules.ar, {
                  ids: releaseUnknown.map((id) => `#${id}`).join("، "),
                }),
              }
            : releaseCheck.issues[0]
              ? lrel.issues[releaseCheck.issues[0].code]
              : null;
  /* Live bulk rates: the staged batch, and its preview only while it still matches it. */
  const stagedRates = lines.flatMap((line) => line.rates ?? []);
  const stagedSupplements = lines.flatMap((line) => line.supplements ?? []);
  const stagedRatesKey = JSON.stringify([stagedRates, stagedSupplements]);
  const currentRatePreview = ratePreview && ratePreview.key === stagedRatesKey ? ratePreview : null;
  const batchIssue: Bi | null = restrictionBatchIssue ?? releaseBatchIssue;
  const unknownOwnership =
    (batchUsage?.unknownRuleIds.length ?? 0) > 0 || releaseUnknown.length > 0;

  const [reloading, setReloading] = useState(false);
  const reloadRules = async () => {
    const reload = live?.reloadRules ?? liveRel?.reloadRules;
    if (!reload) return;
    setReloading(true);
    try {
      await reload();
    } finally {
      setReloading(false);
    }
  };
  const runPreview = async () => {
    if (liveRt) {
      const run = ++previewRun.current;
      setRatePreview(null);
      setPreviewError(null);
      if (stagedRates.length === 0 && stagedSupplements.length === 0) return;
      const batch: RateBatch = {
        operations: stagedRates,
        supplementOperations: stagedSupplements,
      };
      const key = stagedRatesKey;
      setPreviewing(true);
      try {
        const data = await liveRt.preview(batch);
        if (run === previewRun.current) setRatePreview({ data, batch, key });
      } catch (error) {
        if (run === previewRun.current)
          setPreviewError(getApiErrorMessage(error, rateReviewCopy.previewFailed[k]));
      } finally {
        if (run === previewRun.current) setPreviewing(false);
      }
      return;
    }
    if (liveRel) {
      const run = ++previewRun.current;
      setReleasePreview(null);
      setPreviewError(null);
      /* Nothing is sent while the batch itself is not sound. */
      if (stagedRelease.length === 0 || releaseBatchIssue) return;
      const operations = stagedRelease;
      const key = stagedReleaseKey;
      setPreviewing(true);
      try {
        const data = await liveRel.preview(operations);
        if (run === previewRun.current) setReleasePreview({ data, operations, key });
      } catch (error) {
        if (run === previewRun.current)
          setPreviewError(getApiErrorMessage(error, lr.previewFailed[k]));
      } finally {
        if (run === previewRun.current) setPreviewing(false);
      }
      return;
    }
    if (!live) return;
    const run = ++previewRun.current;
    setPreview(null);
    setPreviewError(null);
    if (stagedOperations.length === 0) return;
    const key = stagedRestrictionsKey;
    setPreviewing(true);
    try {
      const data = await live.preview(stagedOperations);
      if (run === previewRun.current) {
        setPreview(data);
        setPreviewKey(key);
      }
    } catch (error) {
      if (run === previewRun.current) setPreviewError(getApiErrorMessage(error, lr.previewFailed[k]));
    } finally {
      if (run === previewRun.current) setPreviewing(false);
    }
  };
  /* Entering review, or changing the list while in it, needs a fresh preview. */
  useEffect(() => {
    if ((!live && !liveRel && !liveRt) || !reviewing) return;
    setStale(false);
    void runPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewing, lines]);

  const confirm = async () => {
    if (liveRt) {
      /* Exactly the previewed batch, with the ratesRevision that preview returned. */
      if (!currentRatePreview) return;
      setApplying(true);
      let outcome: "saved" | "stale";
      try {
        outcome = await liveRt.save(
          currentRatePreview.batch,
          currentRatePreview.data.ratesRevision,
        );
      } catch {
        setApplying(false);
        return;
      }
      setApplying(false);
      if (outcome === "stale") {
        /* Never retried silently: preview again and wait for another review. */
        await runPreview();
        setStale(true);
        return;
      }
    }
    if (liveRel) {
      /* Exactly the previewed batch, with the releaseRevision that preview returned. */
      if (!currentReleasePreview || releaseBatchIssue) return;
      setApplying(true);
      let outcome: "saved" | "stale";
      try {
        outcome = await liveRel.save(
          currentReleasePreview.operations,
          currentReleasePreview.data.releaseRevision,
        );
      } catch {
        setApplying(false);
        return;
      }
      setApplying(false);
      if (outcome === "stale") {
        /* Never retried silently: preview again and wait for another review. */
        await runPreview();
        setStale(true);
        return;
      }
      /* Saved: that preview's revision is spent, so the next batch always previews afresh. */
      setReleasePreview(null);
    }
    if (live) {
      /* Exactly the previewed batch, with the restrictionsRevision that preview returned. */
      if (!currentPreview) return;
      setApplying(true);
      let outcome: "saved" | "stale";
      try {
        outcome = await live.save(stagedOperations, currentPreview.restrictionsRevision);
      } catch {
        setApplying(false);
        return;
      }
      setApplying(false);
      if (outcome === "stale") {
        /* Never retried silently: preview again and wait for another review. */
        await runPreview();
        setStale(true);
        return;
      }
      setEditingRule(null);
      /* Saved: that preview's revision is spent, so the next batch always previews afresh. */
      setPreview(null);
      setPreviewKey(null);
    }
    if (kind === "stopSale" && onApplyStatus) {
      setApplying(true);
      try {
        await onApplyStatus(lines.flatMap((line) => (line.payload ? [line.payload] : [])));
      } catch {
        setApplying(false);
        return;
      }
      setApplying(false);
    }
    if (kind === "bulkRates" && onApplyRates && picked[0]) {
      setApplying(true);
      try {
        await onApplyRates({
          range: picked[0].range,
          weekdays: days,
          rooms: realRooms.map((room) => room.en),
          rate:
            priceMode === "apart"
              ? { weekday: amountOf(weekdayPrice), weekend: amountOf(weekendPrice) }
              : { amount: amountOf(weekdayPrice) },
        });
      } catch {
        setApplying(false);
        return;
      }
      setApplying(false);
    }
    setSaved(lines);
    setNote({
      kind: atOnce ? "applied" : "drafted",
      what: lines[0]?.what ?? headline,
    });
    setLines([]);
    setReviewing(false);
    setFinished(true);
    /* Only reached once every save above succeeded: failures and stale returns keep the form. */
    resetForm();
  };

  /* ------------------------------------------------- OV 04.B*RV, review */
  if (reviewing) {
    return (
      <Shell
        dir={dir}
        title={title}
        contract={contract}
        body={c.reviewBody[k]}
        onClose={onClose}
        width="max-w-[800px]"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                if (oneRange) setLines([]);
                setReviewing(false);
              }}
            >
              {c.backToEdit[k]}
            </Button>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[12px] text-text-quiet">
                {atOnce ? c.appliesNow[k] : c.savedAsDraft[k]}
              </span>
              <Button
                disabled={
                  applying ||
                  (liveRt !== undefined && (previewing || !currentRatePreview)) ||
                  (live !== undefined && (previewing || !currentPreview || batchIssue !== null)) ||
                  (liveRel !== undefined &&
                    (previewing || !currentReleasePreview || batchIssue !== null))
                }
                onClick={() => void confirm()}
              >
                {atOnce ? c.confirmApply[k] : c.saveAllDraft[k]}
              </Button>
            </div>
          </>
        }
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.04em] text-text-quiet">
          {lines.length === 1
            ? c.inYourListOne[k]
            : fill(c.inYourList[k], { n: n(lines.length) })}
        </p>
        <div className="mt-2 space-y-2">
          {lines.map((line) => (
            <div
              key={line.id}
              className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-border-subtle p-4"
            >
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-text-primary">
                  {line.what[k]}
                </p>
                <p className="mt-0.5 text-[12px] text-text-body">
                  {line.detail[k]}
                </p>
              </div>
              {!oneRange && (
                <button
                  type="button"
                  onClick={() =>
                    setLines((current) =>
                      current.filter((item) => item.id !== line.id)
                    )
                  }
                  className="shrink-0 text-[12px] font-medium text-status-danger hover:underline"
                >
                  {c.remove[k]}
                </button>
              )}
            </div>
          ))}
        </div>

        {liveRt && (
          <RateReviewPanel
            data={currentRatePreview?.data ?? null}
            loading={previewing}
            error={previewError}
            stale={stale}
            onRetry={() => void runPreview()}
            currency={liveRt.currency}
            roomName={liveRt.roomName}
          />
        )}

        {live && (
          <>
            {batchIssue && (
              <BatchIssue
                text={batchIssue[k]}
                unknown={unknownOwnership}
                reloading={reloading}
                onReload={() => void reloadRules()}
                reloadLabel={lr.reloadRules[k]}
              />
            )}
            {stale && (
              <div className="mt-3 rounded-xl bg-[#fdf0d9] p-3.5 text-[12px] leading-5 text-[#8a5a00]">
                {lr.stale[k]}
              </div>
            )}
            {previewing ? (
              <p className="mt-3 text-[12px] text-text-quiet">{lr.previewing[k]}</p>
            ) : previewError ? (
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-status-danger-bg p-3.5">
                <p className="text-[12px] text-status-danger">{previewError}</p>
                <button
                  type="button"
                  onClick={() => void runPreview()}
                  className="text-[12px] font-medium text-text-link hover:underline"
                >
                  {lr.retry[k]}
                </button>
              </div>
            ) : currentPreview ? (
              <RestrictionPreview data={currentPreview} roomName={live.roomName} k={k} />
            ) : null}
          </>
        )}

        {liveRel && (
          <>
            {batchIssue && (
              <BatchIssue
                text={batchIssue[k]}
                unknown={unknownOwnership}
                reloading={reloading}
                onReload={() => void reloadRules()}
                reloadLabel={lr.reloadRules[k]}
              />
            )}
            {stale && (
              <div className="mt-3 rounded-xl bg-[#fdf0d9] p-3.5 text-[12px] leading-5 text-[#8a5a00]">
                {lrel.stale[k]}
              </div>
            )}
            {previewing ? (
              <p className="mt-3 text-[12px] text-text-quiet">{lr.previewing[k]}</p>
            ) : previewError ? (
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-status-danger-bg p-3.5">
                <p className="text-[12px] text-status-danger">{previewError}</p>
                <button
                  type="button"
                  onClick={() => void runPreview()}
                  className="text-[12px] font-medium text-text-link hover:underline"
                >
                  {lr.retry[k]}
                </button>
              </div>
            ) : currentReleasePreview ? (
              <ReleasePreview data={currentReleasePreview.data} roomName={liveRel.roomName} k={k} />
            ) : null}
          </>
        )}

        {/* The one place the four overlays part company. */}
        <div
          className={cn(
            "mt-3 rounded-xl p-4",
            atOnce ? "bg-[#eef8e0]" : "bg-surface-subtle"
          )}
        >
          <p className="text-[12.5px] font-semibold text-text-primary">
            {atOnce ? c.takesEffect[k] : c.savedDraftBand[k]}
          </p>
          <p className="mt-0.5 text-[12px] leading-5 text-text-body">
            {oneRange
              ? c.pricesTakeEffectBody[k]
              : live
                ? lr.takesEffectBody[k]
                : liveRel
                  ? lrel.takesEffectBody[k]
                : atOnce
                ? c.takesEffectBody[k]
                : c.savedDraftBandBody[k]}
          </p>
        </div>
      </Shell>
    );
  }

  /* --------------------------------------------------------- the form */
  return (
    <Shell
      dir={dir}
      title={title}
      contract={contract}
      body={body}
      onClose={onClose}
      width="max-w-[1000px]"
      footer={
        /* Bulk rates and stop sale stay open for another round after a save,
           so they keep their way back to review too. */
        finished &&
        !oneRange &&
        kind !== "stopSale" &&
        kind !== "release" &&
        kind !== "restrictions" ? (
          <Button variant="outline" onClick={onClose}>
            {c.done[k]}
          </Button>
        ) : oneRange ? (
          <>
            <Button variant="outline" onClick={onClose}>
              {finished ? c.done[k] : c.cancel[k]}
            </Button>
            <Button
              disabled={!canAdd}
              reason={!canAdd ? c.oneRangeHint[k] : undefined}
              onClick={reviewOne}
            >
              {c.reviewSave[k]}
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={onClose}>
              {/* Stop sale, release and restrictions reach this footer once finished. */}
              {finished ? c.done[k] : c.cancel[k]}
            </Button>
            <div className="flex flex-wrap items-center gap-3">
              {lines.length === 0 && (
                <span className="text-[12px] text-text-quiet">
                  {canAdd ? c.pressAddFirst[k] : c.nothingYet[k]}
                </span>
              )}
              {batchIssue && lines.length > 0 && (
                <BatchIssue
                  text={batchIssue[k]}
                  unknown={unknownOwnership}
                  reloading={reloading}
                  onReload={() => void reloadRules()}
                  reloadLabel={lr.reloadRules[k]}
                />
              )}
              <Button
                /* Stop sale: an edit in progress is saved or cancelled first, so Review never misses it. */
                disabled={
                  lines.length === 0 ||
                  batchIssue !== null ||
                  stopSaleEditing ||
                  releaseEditing ||
                  restrictionsEditing
                }
                reason={
                  lines.length === 0
                    ? c.nothingYet[k]
                    : batchIssue
                      ? batchIssue[k]
                      : stopSaleEditing
                        ? stopSaleEditCopy.finishEditing[k]
                        : releaseEditing
                          ? releaseEditCopy.finishEditing[k]
                          : restrictionsEditing
                            ? restrictionEditCopy.finishEditing[k]
                            : undefined
                }
                onClick={() => setReviewing(true)}
              >
                {lines.length === 0
                  ? c.reviewSaveAll[k]
                  : fill(c.reviewCount[k], { n: n(lines.length) })}
              </Button>
            </div>
          </>
        )
      }
    >
      {/* OV 04.B*A / B*V / B*D - what just happened, above everything. */}
      {note && (
        <div
          className={cn(
            "mb-4 flex flex-wrap items-start justify-between gap-3 rounded-xl p-3.5",
            note.kind === "applied" || note.kind === "drafted"
              ? "bg-[#eef8e0]"
              : "bg-surface-subtle"
          )}
        >
          <div className="min-w-0">
            <p className="text-[12.5px] font-semibold text-text-primary">
              {note.kind === "added"
                ? fill(c.addedTitle[k], { what: note.what[k] })
                : note.kind === "updated"
                  ? fill(stopSaleEditCopy.updatedTitle[k], { what: note.what[k] })
                : note.kind === "applied"
                  ? fill(c.appliedTitle[k], { what: note.what[k] })
                  : note.kind === "drafted"
                    ? fill(c.draftedTitle[k], { what: note.what[k] })
                    : fill(c.removedLine[k], { what: note.what[k] })}
            </p>
            {note.kind !== "removed" && (
              <p className="mt-0.5 text-[12px] leading-5 text-text-body">
                {note.kind === "added" || note.kind === "updated"
                  ? c.addedBody[k]
                  : note.kind === "applied"
                    ? oneRange
                      ? c.pricesAppliedBody[k]
                      : live
                        ? lr.appliedBody[k]
                        : liveRel
                          ? lrel.appliedBody[k]
                          : c.appliedBody[k]
                    : c.draftedBody[k]}
              </p>
            )}
          </div>
          {note.kind === "removed" && (
            <button
              type="button"
              onClick={() => {
                setRemoved((current) =>
                  current.filter((id) => id !== note.row.id)
                );
                setNote(null);
              }}
              className="shrink-0 text-[12px] font-medium text-text-link hover:underline"
            >
              {c.undo[k]}
            </button>
          )}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-5">
          {/* Live release: why nothing can be written on this contract right now. */}
          {liveRel?.blocked && (
            <div className="rounded-xl bg-[#fdf0d9] p-3.5 text-[12px] leading-5 text-[#8a5a00]">
              {liveRel.blocked[k]}
            </div>
          )}
          {(editingRule !== null || stopSaleEditing || releaseEditing || restrictionsEditing) && (
            <div className="flex flex-wrap items-center gap-3 rounded-[10px] border border-brand-deep/30 bg-primary-subtle px-3.5 py-2.5">
              <p className="min-w-0 flex-1 text-[12px] leading-5 text-text-primary">
                {kind === "restrictions"
                  ? editingRule !== null
                    ? restrictionEditCopy.editingRuleHint[k]
                    : restrictionEditCopy.editingHint[k]
                  : kind === "stopSale"
                    ? stopSaleEditCopy.editingHint[k]
                    : kind === "release"
                      ? editingRule !== null
                        ? lrel.editingRuleHint[k]
                        : releaseEditCopy.editingHint[k]
                      : liveGrid.editingHint[k]}
              </p>
              <button
                type="button"
                /* Stop sale / Release: Cancel only leaves Edit mode - the list was never touched. */
                onClick={
                  kind === "stopSale"
                    ? () => restartStopSale(true)
                    : kind === "release"
                      ? () => restartRelease(true)
                      : kind === "restrictions"
                        ? () => restartRestrictions(true)
                        : clearForm
                }
                className="text-[11.5px] font-medium text-text-link hover:underline"
              >
                {c.cancel[k]}
              </button>
            </div>
          )}
          <Section label={c.nights[k]}>
            <div className="relative flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setPicking(true)}
                className={cn(
                  "h-11 w-full rounded-[10px] border px-3.5 text-start text-[13px] transition-colors sm:w-[210px]",
                  nights > 0
                    ? "border-border-strong text-text-primary"
                    : "border-border-default text-text-muted hover:bg-surface-subtle"
                )}
              >
                {nights === 0
                  ? c.pickNights[k]
                  : oneRange && picked[0]
                    ? fill(c.rangeChip[k], {
                        when: rangeLabel(picked[0]),
                        nights: say(nights, nightsWord),
                      })
                    : fill(c.nightsPicked[k], {
                        nights: say(nights, nightsWord),
                        ranges: say(picked.length, rangesWord),
                      })}
              </button>
              {/*
                * The week, Sunday first, for "weekends only" pickers.
                * Restrictions has no pills: OV 04.BXF asks the same
                * question as a sentence instead - Applies on - because a
                * stay rule either covers the range or covers the
                * contract's weekend, and there is no third answer.
                */}
              <div
                className={cn(
                  "flex-wrap gap-1.5",
                  kind === "restrictions" ? "hidden" : "flex"
                )}
              >
                {labels.map((day, index) => (
                  <button
                    key={day}
                    type="button"
                    aria-pressed={days.includes(index)}
                    onClick={() =>
                      setDays((current) =>
                        current.includes(index)
                          ? current.filter((d) => d !== index)
                          : [...current, index]
                      )
                    }
                    className={cn(
                      "h-9 w-9 rounded-[8px] text-[12px] font-medium transition-colors",
                      days.includes(index)
                        ? "bg-brand-deep text-text-inverse"
                        : "border border-border-default text-text-secondary hover:bg-surface-subtle"
                    )}
                  >
                    {day}
                  </button>
                ))}
              </div>
              {oneRange ? (
                picked.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setPicked([])}
                    className="text-[11.5px] font-medium text-text-link hover:underline"
                  >
                    {c.clearNights[k]}
                  </button>
                )
              ) : (
                <Button
                  variant={canAdd ? "dark" : "outline"}
                  disabled={!canAdd}
                  reason={!canAdd ? c.nightsHint[k] : undefined}
                  onClick={add}
                >
                  {stopSaleEditing
                    ? stopSaleEditCopy.saveChanges[k]
                    : releaseEditing
                      ? releaseEditCopy.saveChanges[k]
                      : restrictionsEditing
                        ? restrictionEditCopy.saveChanges[k]
                        : c.add[k]}
                </Button>
              )}
            </div>

            {/* OV 04.B*N - each range as its own chip, and a way out. */}
            {!oneRange && picked.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {picked.map((item) => (
                  <span
                    key={item.id}
                    className={cn(
                      "rounded-md bg-surface-subtle px-2.5 py-1 text-[11.5px] text-text-primary",
                      (kind === "stopSale" || kind === "release" || kind === "restrictions") &&
                        "inline-flex items-center gap-1.5 pe-1.5",
                    )}
                  >
                    {fill(c.rangeChip[k], {
                      when: rangeLabel(item),
                      nights: say(item.nights, nightsWord),
                    })}
                    {/* Stop sale / Release / Restrictions: take out this one entry only; counts,
                        the operations and what is staged all follow the chips. */}
                    {(kind === "stopSale" || kind === "release" || kind === "restrictions") && (
                      <button
                        type="button"
                        aria-label={c.removeNight[k]}
                        title={c.removeNight[k]}
                        onClick={() =>
                          kind === "restrictions"
                            ? removeRestrictionRange(item)
                            : setPicked((current) => current.filter((other) => other.id !== item.id))
                        }
                        className="grid h-4 w-4 place-content-center rounded-sm text-text-quiet transition-colors hover:bg-status-danger-bg hover:text-status-danger"
                      >
                        <X className="h-3 w-3" aria-hidden />
                      </button>
                    )}
                  </span>
                ))}
                <button
                  type="button"
                  onClick={() => setPicked([])}
                  className="ms-auto text-[11.5px] font-medium text-text-link hover:underline"
                >
                  {c.clearNights[k]}
                </button>
              </div>
            )}

            <p className="mt-2 max-w-[560px] text-[11.5px] leading-4 text-text-quiet">
              {nights > 0
                ? fill(
                    weekendNights.length === 0
                      ? oneRange
                        ? c.oneRangePickedWeekdaysOnly[k]
                        : c.pickedHintWeekdaysOnly[k]
                      : oneRange
                        ? c.oneRangePicked[k]
                        : c.pickedHint[k],
                    {
                      nights: say(nights, nightsWord),
                      weekdays: say(
                        nights - weekendNights.length,
                        weekdaysWord
                      ),
                      weekend: fill(c.weekendIn[k], {
                        weekend: say(weekendNights.length, weekendNightsWord),
                        list: weekendNights.join(", "),
                      }),
                    }
                  )
                : oneRange
                  ? c.oneRangeHint[k]
                  : lines.length > 0
                    ? c.againHint[k]
                    : c.nightsHint[k]}
            </p>
          </Section>

          {!baseSupplementsLive && (
            <Section label={c.rooms[k]}>
              <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                {/* "All rooms" still stores only its own entry, exactly as before;
                    every room just shows as covered by it. */}
                {!liveRt && (
                  <label className="flex cursor-pointer items-center gap-2.5 border-b border-border-subtle pb-2 text-[12.5px] font-semibold text-text-primary sm:col-span-2">
                    <Checkbox
                      checked={everyRoomShown ? true : someRoomShown ? "indeterminate" : false}
                      /* Release: a saved rule's layer and rooms are fixed while it is edited. */
                      disabled={releaseRuleRooms !== null}
                      onCheckedChange={(value) => setRooms(value === true ? [roomList[0]!.en] : [])}
                      className="data-[state=indeterminate]:after:h-0.5 data-[state=indeterminate]:after:w-2 data-[state=indeterminate]:after:rounded-full data-[state=indeterminate]:after:bg-primary data-[state=indeterminate]:after:content-[''] [&[data-state=indeterminate]_svg]:hidden"
                    />
                    {roomList[0]![k]}
                  </label>
                )}
                {liveRt?.fixedPrice && (
                  <p className="text-[11.5px] leading-4 text-text-quiet sm:col-span-2">
                    {bs.pickOneRoom[k]}
                  </p>
                )}
                {roomChoices.map((room) => (
                  <label
                    key={room.en}
                    className="flex cursor-pointer items-center gap-2.5 text-[12.5px] text-text-primary"
                  >
                    <Checkbox
                      checked={allRoomsPicked || rooms.includes(room.en)}
                      disabled={releaseRuleRooms !== null}
                      onCheckedChange={(value) => {
                        if (liveRt) {
                          setPriceTouched(false);
                          setMealDraft({});
                          children.reset();
                          setRoomSupplementDraft({});
                          setOfferDraft({});
                        }
                        setRooms((current) =>
                          liveRt
                            ? value === true
                              ? [room.en]
                              : []
                            : value === true
                              ? [...current, room.en]
                              : /* Leaving "All rooms" by one room keeps the others picked. */
                                current.includes(roomList[0]!.en)
                                ? roomChoices.map((r) => r.en).filter((r) => r !== room.en)
                                : current.filter((r) => r !== room.en),
                        );
                      }}
                    />
                    {room[k]}
                  </label>
                ))}
              </div>
              {releaseRuleRooms !== null && (
                <p className="mt-2 max-w-[560px] text-[11.5px] leading-4 text-text-quiet">
                  {lrel.roomsFixed[k]}
                </p>
              )}
            </Section>
          )}

          {kind === "bulkRates" && (
            <Section label={c.price[k]}>
              <RadioGroup
                className="flex flex-wrap items-center gap-x-5 gap-y-2"
                value={priceMode}
                onValueChange={setPriceMode}
              >
                {(
                  [
                    ["one", c.onePrice[k]],
                    ["apart", c.apartPrice[k]],
                  ] as Array<[string, string]>
                ).map(([value, label]) => (
                  <label
                    key={value}
                    className="flex cursor-pointer items-center gap-2 text-[12.5px] text-text-primary"
                  >
                    <RadioGroupItem value={value} />
                    {label}
                  </label>
                ))}
              </RadioGroup>
              {liveRt?.fixedPrice ? (
                <div className="mt-3 grid gap-4">
                  {!pickedRoomType && (
                    <p className="text-[11.5px] leading-4 text-text-quiet">{bs.pickRoomFirst[k]}</p>
                  )}
                  {pickedRoomType?.offers.map((offer) => {
                    const shown = offerShown(offer);
                    const rate = offerRate(shown);
                    const bad =
                      rate === undefined ||
                      (rate !== null &&
                        Object.values(rate).some((value) => !Number.isFinite(value) || value < 0));
                    const contract = offer.contract
                      ? "weekday" in offer.contract
                        ? `${n(offer.contract.weekday)} / ${n(offer.contract.weekend)}`
                        : n(offer.contract.amount)
                      : "-";
                    const setDraft = (field: "weekday" | "weekend", text: string) =>
                      setOfferDraft((current) => ({
                        ...current,
                        [offer.mealPlan]: { ...shown, [field]: text },
                      }));
                    return (
                      <div key={offer.mealPlan}>
                        <p className="mb-2 text-[12.5px] font-semibold text-text-primary">
                          {fill(bs.offerTitle[k], { meal: offer.meal[k] })}
                        </p>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Input
                            id={`bulk-offer-${offer.mealPlan}-weekday`}
                            label={priceMode === "one" ? bs.everyNight[k] : bs.weekdays[k]}
                            inputMode="decimal"
                            value={shown.weekday}
                            onChange={(e) => setDraft("weekday", e.target.value)}
                            suffix={liveRt.currency}
                            hint={fill(bs.contractOffer[k], { price: contract })}
                            {...(bad ? { error: bs.badOffer[k] } : {})}
                          />
                          {priceMode === "apart" && (
                            <Input
                              id={`bulk-offer-${offer.mealPlan}-weekend`}
                              label={bs.weekend[k]}
                              inputMode="decimal"
                              value={shown.weekend}
                              onChange={(e) => setDraft("weekend", e.target.value)}
                              suffix={liveRt.currency}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <Input
                    label={priceMode === "one" ? c.baseEvery[k] : c.baseWeekday[k]}
                    inputMode="numeric"
                    value={weekdayPrice}
                    onChange={(e) => {
                      setPriceTouched(true);
                      setWeekdayPrice(e.target.value);
                    }}
                    {...(priceTouched && weekdayPrice.trim() === ""
                      ? { error: c.needPrice[k] }
                      : {})}
                  />
                  {priceMode === "apart" && (
                    <Input
                      label={c.baseWeekend[k]}
                      inputMode="numeric"
                      value={weekendPrice}
                      onChange={(e) => {
                        setPriceTouched(true);
                        setWeekendPrice(e.target.value);
                      }}
                      {...(weekdayPrice.trim() !== "" && weekendPrice.trim() === ""
                        ? { error: c.needWeekendPrice[k] }
                        : {})}
                    />
                  )}
                </div>
              )}
              {!liveRt?.fixedPrice && (
                <p className="mt-2 max-w-[560px] text-[11.5px] leading-4 text-text-quiet">
                  {c.othersFollow[k]}
                </p>
              )}
            </Section>
          )}

          {liveRt && !liveRt.fixedPrice && pickedSupplementRooms.length > 0 && (
            <Section label={bs.roomSupplementsTitle[k]}>
              <div className="grid gap-4 sm:grid-cols-2">
                {pickedSupplementRooms.map((room) => {
                  const amount = amountText(roomSupplementShown(room));
                  return (
                    <Input
                      key={room.name.en}
                      id={`bulk-supplement-${room.name.en}`}
                      label={room.name[k]}
                      inputMode="decimal"
                      value={roomSupplementShown(room)}
                      onChange={(e) =>
                        setRoomSupplementDraft((current) => ({
                          ...current,
                          [room.name.en]: e.target.value,
                        }))
                      }
                      suffix={liveRt.currency}
                      hint={fill(bs.contractSupplement[k], {
                        amount: room.supplement === null ? "-" : n(room.supplement),
                      })}
                      {...(amount !== null && (!Number.isFinite(amount) || amount < 0)
                        ? { error: bs.badPrice[k] }
                        : {})}
                    />
                  );
                })}
              </div>
              <p
                className={cn(
                  "mt-2 max-w-[560px] text-[11.5px] leading-4",
                  roomSupplementNeedsBase ? "text-status-danger" : "text-text-quiet",
                )}
              >
                {(roomSupplementNeedsBase ? bs.supplementNeedsBase : bs.roomSupplementsHint)[k]}
              </p>
            </Section>
          )}

          {kind === "bulkRates" &&
            !onApplyRates &&
            !liveRt &&
            (
              [
                [c.mealPlans[k], mealRows],
                [c.children[k], childRows],
              ] as const
            ).map(([label, list]) => (
              <Section key={label} label={label}>
                <div className="grid gap-4 sm:grid-cols-2">
                  {list.map((row) => (
                    <Input
                      key={row.label.en}
                      label={row.label[k]}
                      inputMode="numeric"
                      value={supplements[row.label.en] ?? ""}
                      onChange={(e) =>
                        setSupplements((current) => ({
                          ...current,
                          [row.label.en]: e.target.value,
                        }))
                      }
                      hint={fill(c.supplementHint[k], { value: row.value[k] })}
                      {...(row.value.en.includes("per person")
                        ? { suffix: c.perPerson[k] }
                        : {})}
                    />
                  ))}
                </div>
              </Section>
            ))}

          {liveRt && pickedRoom && !supplementDefaults && (
            <p className="text-[11.5px] leading-4 text-text-quiet">{bs.loading[k]}</p>
          )}

          {liveRt?.fixedPrice && (
            <p className="max-w-[560px] text-[11.5px] leading-4 text-text-quiet">
              {bs.fixedIncluded[k]}
            </p>
          )}

          {mealOptions.length > 0 && (
            <Section label={bs.mealsTitle[k]}>
              <div className="grid gap-4">
                {mealOptions.map((meal) => {
                  const shown = mealShown(meal);
                  const basis = shown.basis;
                  const price = amountText(shown.price);
                  const setDraft = (next: Partial<{ price: string; basis: MealBasis }>) =>
                    setMealDraft((current) => ({
                      ...current,
                      [meal.type]: { ...shown, ...next },
                    }));
                  return (
                    <div key={meal.type} className="grid gap-2 sm:grid-cols-2 sm:items-start">
                      <Input
                        id={`bulk-meal-${meal.type}`}
                        label={liveGrid.meals[meal.type][k]}
                        inputMode="decimal"
                        value={shown.price}
                        onChange={(e) => setDraft({ price: e.target.value })}
                        suffix={liveRt?.currency ?? ""}
                        hint={fill(bs.contractMeal[k], {
                          price: meal.price === null ? "-" : n(meal.price),
                          basis: bs.basis[meal.pricingBasis ?? "per_person"][k],
                        })}
                        {...(price !== null && (!Number.isFinite(price) || price < 0)
                          ? { error: bs.badPrice[k] }
                          : {})}
                      />
                      <RadioGroup
                        className="flex flex-wrap items-center gap-x-5 gap-y-2 sm:pt-8"
                        value={basis}
                        onValueChange={(value) => setDraft({ basis: value as MealBasis })}
                      >
                        {(["per_person", "per_room"] as const).map((value) => (
                          <label
                            key={value}
                            className="flex cursor-pointer items-center gap-2 text-[12.5px] text-text-primary"
                          >
                            <RadioGroupItem value={value} />
                            {bs.basis[value][k]}
                          </label>
                        ))}
                      </RadioGroup>
                    </div>
                  );
                })}
              </div>
              <p className="mt-2 max-w-[560px] text-[11.5px] leading-4 text-text-quiet">
                {bs.mealsHint[k]}
              </p>
            </Section>
          )}

          {childOptions.length > 0 && (
            <Section label={bs.childrenTitle[k]}>
              <ChildBandsFields
                state={children}
                currency={liveRt?.currency ?? ""}
                idPrefix="bulk-child"
              />
            </Section>
          )}

          {kind === "stopSale" && (
            <Section label={c.setTo[k]}>
              <RadioGroup
                className="flex flex-wrap items-center gap-x-5 gap-y-2"
                value={setTo}
                onValueChange={(value) => {
                  /* Leaving On Request drops its SLA: choosing it again starts from the defaults. */
                  if (value !== "onRequest") {
                    slaTouched.current = false;
                    setSlaMinutes(defaultSlaMinutes);
                    setExpiryAction(defaultExpiry);
                  }
                  setSetTo(value);
                }}
              >
                {(
                  [
                    ["stopSale", c.stopSale[k], undefined],
                    ["openSale", c.openSale[k], undefined],
                    ["onRequest", c.onRequest[k], c.onRequestHint[k]],
                  ] as Array<[string, string, string | undefined]>
                ).map(([value, label, hint]) => (
                  <label
                    key={value}
                    className="flex cursor-pointer items-center gap-2 text-[12.5px] text-text-primary"
                  >
                    <RadioGroupItem value={value} />
                    {label}
                    {hint && (
                      <span className="text-[11.5px] text-text-quiet">
                        {hint}
                      </span>
                    )}
                  </label>
                ))}
              </RadioGroup>
              {slaAsked && (
                <div className="mt-3 space-y-2 rounded-[10px] bg-surface-subtle p-3">
                  <label className="flex flex-wrap items-center gap-2 text-[12.5px] text-text-primary">
                    {liveGrid.slaLabel[k]}
                    <Input
                      inputMode="numeric"
                      value={slaMinutes}
                      onChange={(e) => {
                        slaTouched.current = true;
                        setSlaMinutes(e.target.value);
                      }}
                      className="h-9 w-20"
                      aria-invalid={slaBad}
                    />
                    <span className="text-[11.5px] text-text-quiet">{liveGrid.slaHint[k]}</span>
                  </label>
                  <RadioGroup
                    className="flex flex-wrap items-center gap-x-5 gap-y-2"
                    value={expiryAction}
                    onValueChange={(value) => {
                      slaTouched.current = true;
                      setExpiryAction(value as StatusSla["expiryAction"]);
                    }}
                  >
                    {(["auto_reject", "escalate_to_hoteliana"] as const).map((value) => (
                      <label
                        key={value}
                        className="flex cursor-pointer items-center gap-2 text-[12.5px] text-text-primary"
                      >
                        <RadioGroupItem value={value} />
                        {liveGrid.expiry[value][k]}
                      </label>
                    ))}
                  </RadioGroup>
                </div>
              )}
              {!onApplyStatus && (
                <>
                  <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-[12.5px] text-text-primary">
                    <Checkbox
                      checked={everyContract}
                      onCheckedChange={(v) => setEveryContract(v === true)}
                    />
                    {c.everyContract[k]}
                  </label>
                  <p className="mt-1 text-[11.5px] leading-4 text-text-quiet">
                    {c.everyContractHint[k]}
                  </p>
                </>
              )}
            </Section>
          )}

          {kind === "release" && (
            <Section label={c.release[k]}>
              <RadioGroup
                className="flex flex-wrap items-center gap-x-5 gap-y-2"
                value={releaseMode}
                onValueChange={setReleaseMode}
              >
                <label className="flex cursor-pointer items-center gap-2 text-[12.5px] font-medium text-text-primary">
                  <RadioGroupItem value="days" />
                  {c.numberOfDays[k]}
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-[12.5px] text-text-primary">
                  <RadioGroupItem value="same" />
                  {c.sameDay[k]}
                  <span className="text-[11.5px] text-text-quiet">
                    {c.sameDayHint[k]}
                  </span>
                </label>
              </RadioGroup>
              {/* Live: the time is required for Same day too (guide p.15). */}
              {(releaseMode === "days" || liveRel) && (
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  {releaseMode === "days" && (
                    <div>
                      <Input
                        label={c.daysBefore[k]}
                        inputMode="numeric"
                        value={releaseDays}
                        onChange={(e) => setReleaseDays(e.target.value)}
                        {...(releaseTooMany
                          ? {
                              error: fill(c.releaseTooMany[k], {
                                max: n(releaseMax),
                              }),
                            }
                          : releaseDaysBad
                            ? { error: lrel.daysInvalid[k] }
                            : {})}
                      />
                      {/* OV 04.BRRE - the fix is one press, not a re-read. */}
                      {releaseTooMany ? (
                        <button
                          type="button"
                          onClick={() => setReleaseDays(String(releaseMax))}
                          className="mt-1 text-[11.5px] font-medium text-text-link hover:underline"
                        >
                          {fill(c.useMaxDays[k], { max: n(releaseMax) })}
                        </button>
                      ) : (
                        <p className="mt-1 text-[11.5px] text-text-quiet">
                          {liveRel ? lrel.daysRange[k] : c.daysRange[k]}
                        </p>
                      )}
                    </div>
                  )}
                  <div>
                    <Input
                      label={c.at[k]}
                      value={releaseAt}
                      onChange={(e) => setReleaseAt(e.target.value)}
                      {...(releaseTimeBad ? { error: lrel.timeInvalid[k] } : {})}
                    />
                    <p className="mt-1 text-[11.5px] text-text-quiet">
                      {liveRel
                        ? fill(lrel.timeHint[k], { timezone: liveRel.timezone ?? "-" })
                        : c.makkahTime[k]}
                    </p>
                  </div>
                </div>
              )}
            </Section>
          )}

          {kind === "restrictions" && (
            <>
              <Section label={c.stayRules[k]}>
                <div>
                  <Input
                    label={live ? lr.minLabel[k] : c.minimumNights[k]}
                    className="w-[196px]"
                    inputMode="numeric"
                    value={minNights}
                    onChange={(e) => setMinNights(e.target.value)}
                    {...(live && !minValid ? { error: lr.minInvalid[k] } : {})}
                  />
                  <p className="mt-1 text-[11.5px] text-text-quiet">
                    {live ? lr.minHint[k] : c.noMinimum[k]}
                  </p>
                </div>

                {/* OV 04.BXF - the whole range, or the contract's weekend. */}
                <p className="mt-3.5 text-[12.5px] font-medium text-text-primary">
                  {c.appliesOn[k]}
                </p>
                <div className="mt-1.5 grid max-w-[668px] grid-cols-1 overflow-hidden rounded-[10px] bg-surface-subtle p-1 sm:grid-cols-2">
                  {(
                    [
                      ["every", c.appliesEvery[k]],
                      ["weekend", c.appliesWeekend[k]],
                    ] as Array<["every" | "weekend", string]>
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={appliesOn === value}
                      onClick={() => setAppliesOn(value)}
                      className={cn(
                        "rounded-lg px-4 py-2.5 text-[13px] font-medium transition-colors",
                        appliesOn === value
                          ? "bg-surface-default text-text-primary shadow-card"
                          : "text-text-muted hover:text-text-primary"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <p className="mt-1.5 max-w-[668px] text-[11.5px] leading-4 text-text-quiet">
                  {live
                    ? fill(lr.weekendIs[k], {
                        days: weekendDays
                          .map((day) => dayName(day, k))
                          .join(ar ? "، " : ", "),
                      })
                    : c.appliesOnHint[k]}
                </p>
              </Section>

              {/* OV 04.BXE / BXF - the picked nights, day by day. */}
              <Section label={c.checkDays[k]}>
                {pickedDates.length === 0 ? (
                  <div className="rounded-xl bg-surface-subtle p-3.5">
                    <p className="max-w-[620px] text-[12px] leading-5 text-text-body">
                      {c.checkDaysEmpty[k]}
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-[12px] text-text-body">
                      {live ? lr.checkLead[k] : c.checkDaysLead[k]}
                    </p>
                    <CheckDays
                      dates={pickedDates}
                      /* Live: every picked night, whatever the minimum stay's weekend setting. */
                      covered={live ? () => true : covered}
                      tri={
                        live
                          ? {
                              states: nightChecks,
                              onSet: (keys, what, value) =>
                                setNightChecks((current) => {
                                  const next = { ...current };
                                  for (const key of keys) {
                                    const night = { ...next[key] };
                                    if (value) night[what] = value;
                                    else delete night[what];
                                    if (night.in || night.out) next[key] = night;
                                    else delete next[key];
                                  }
                                  return next;
                                }),
                              copy: {
                                legendInherit: lr.legendInherit,
                                legendOpen: lr.legendOpen,
                                legendClosed: lr.legendClosed,
                                legendTap: lr.legendTap,
                              },
                            }
                          : undefined
                      }
                      shut={shut}
                      onToggle={(keys: string[], what: "in" | "out") =>
                        setShut((current) => {
                          const next = { ...current };
                          /* A weekday name closes the whole column, so
                             the first open day decides for all of them. */
                          const closing = keys.some(
                            (key: string) => !next[key]?.[what]
                          );
                          for (const key of keys) {
                            next[key] = { ...next[key], [what]: closing };
                          }
                          return next;
                        })
                      }
                      k={k}
                      c={c}
                      dp={dp}
                      n={n}
                      year={year}
                      dayKey={dayKey}
                    />
                  </>
                )}
              </Section>

              {live && nights > 0 && realRooms.length > 0 && (
                <RestrictionEffective
                  contractId={live.contractId}
                  scope={restrictionScope()}
                  tooMany={pickedIsos.length > RESTRICTION_LIMITS.dates}
                  roomName={live.roomName}
                  k={k}
                />
              )}
            </>
          )}

          {/* OV 04.BSAC - every contract on this hotel, named one by one. */}
          {reach && (
            <div className="rounded-xl bg-[#fdf0d9] p-3.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.04em] text-[#8a5a00]">
                {c.alsoCloses[k]}
              </p>
              <div className="mt-1.5 space-y-0.5">
                {reach.map((item) => (
                  <p
                    key={item.name.en}
                    className="text-[12px] leading-5 text-[#8a5a00]"
                  >
                    {item.name[k]} · {roomNames(item.has)[k]}
                    {item.missing.length > 0 && (
                      <>
                        {" "}
                        {fill(c.notOnContract[k], {
                          room: roomNames(item.missing)[k],
                        })}
                      </>
                    )}
                  </p>
                ))}
              </div>
              <p className="mt-1.5 text-[11.5px] leading-4 text-[#8a5a00]/70">
                {c.matchedByName[k]}
              </p>
            </div>
          )}

          {/*
            * OV 04.B*E / B*N / B*F / BRRW / BRRE - one box, four tempers.
            * Grey while it has nothing to say, green when the change is
            * sound, amber when it is sound but has a consequence, and red
            * text when a field has to be fixed first.
            */}
          <div
            className={cn(
              "rounded-xl p-3.5",
              broken
                ? "bg-surface-subtle"
                : releasePast
                  ? "bg-[#fdf0d9]"
                  : canAdd
                    ? "bg-[#eef8e0]"
                    : "bg-surface-subtle"
            )}
          >
            <p
              className={cn(
                "text-[10px] font-semibold uppercase tracking-[0.04em]",
                !broken && releasePast ? "text-[#8a5a00]" : "text-text-quiet"
              )}
            >
              {c.whatWillHappen[k]}
            </p>
            {broken ? (
              <p className="mt-1 text-[12px] leading-5 text-status-danger">
                {c.fixRed[k]}
              </p>
            ) : restrictionIssue ? (
              <p className="mt-1 text-[12px] leading-5 text-status-danger">
                {restrictionIssue[k]}
              </p>
            ) : releaseIssue ? (
              <p className="mt-1 text-[12px] leading-5 text-status-danger">{releaseIssue[k]}</p>
            ) : canAdd ? (
              <>
                <p
                  className={cn(
                    "mt-1 text-[12.5px] font-semibold",
                    releasePast ? "text-[#8a5a00]" : "text-text-primary"
                  )}
                >
                  {headline[k]}
                </p>
                {releasePast && (
                  <p className="mt-1 text-[12px] font-semibold leading-5 text-status-danger">
                    ⚠{" "}
                    {fill(c.releaseAlreadyPast[k], {
                      when: releasePast,
                      days: countedOf(releaseNumber, daysWord, k),
                    })}
                  </p>
                )}
                <ul className="mt-1 space-y-0.5">
                  {(live
                    ? [lr.bulletPriority[k], lr.bulletUntouched[k], lr.bulletExpires[k]]
                    : liveRel
                      ? [lrel.bulletTimingOnly[k], lrel.bulletPriority[k], lrel.bulletNow[k]]
                    : kind === "restrictions"
                    ? [
                        /* OV 04.BXF - which nights lost an arrival or a
                           departure, named; then what happens after them,
                           who it reaches, and that it is still a draft. */
                        closedIn.length && closedOut.length
                          ? fill(c.bulletChecksBoth[k], {
                              in: closedIn.map(dayLabel).join(ar ? "، " : ", "),
                              out: closedOut
                                .map(dayLabel)
                                .join(ar ? "، " : ", "),
                            })
                          : closedIn.length
                            ? fill(c.bulletChecksIn[k], {
                                in: closedIn
                                  .map(dayLabel)
                                  .join(ar ? "، " : ", "),
                              })
                            : closedOut.length
                              ? fill(c.bulletChecksOut[k], {
                                  out: closedOut
                                    .map(dayLabel)
                                    .join(ar ? "، " : ", "),
                                })
                              : c.bulletChecksNone[k],
                        fill(c.bulletOnlyThese[k], {
                          n: n(contractMinNights),
                        }),
                        c.bulletSearchesOnly[k],
                        c.bulletRuleDraft[k],
                      ]
                    : kind === "release"
                    ? [
                        fill(c.bulletReplacesRelease[k], {
                          rooms: roomNames(realRooms)[k],
                          days: n(contractRelease),
                        }),
                        fill(c.bulletReleaseBack[k], {
                          days: n(releaseNumber || 0),
                          at: clock(releaseAt),
                        }),
                        c.bulletReleaseDraft[k],
                      ]
                    : [
                        reach
                          ? fill(c.bulletHotel[k], {
                              contracts: reach
                                .map((item) => item.name[k])
                                .join(ar ? "، " : ", "),
                              when: whenLabel,
                            })
                          : fill(c.bulletRooms[k], {
                              rooms: roomNames(realRooms)[k],
                              when: whenLabel,
                            }),
                        onApplyStatus ? liveGrid.sellHeld[k] : c.bulletHeld[k],
                        onApplyStatus
                          ? liveGrid.sellNow[k]
                          : oneRange
                            ? c.bulletPricesNow[k]
                            : c.bulletDraft[k],
                      ]
                  ).map((line) => (
                    <li
                      key={line}
                      className={cn(
                        "text-[12px] leading-5",
                        releasePast ? "text-[#8a5a00]" : "text-text-body"
                      )}
                    >
                      · {line}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="mt-1 max-w-[560px] text-[12px] leading-5 text-text-body">
                {nights > 0
                  ? fill(c.nightsPickedHappen[k], {
                      nights: say(nights, nightsWord),
                      when: whenLabel,
                    })
                  : c.whatWillHappenBody[k]}
              </p>
            )}
          </div>
        </div>

        {/* What is already set, and who may change each row. */}
        <aside className="rounded-xl bg-surface-subtle p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.04em] text-text-quiet">
            {fill(c.alreadySet[k], { kind: bulkKindLabel[kind][k] })}
          </p>
          <p className="mt-1 text-[12.5px] font-medium text-text-primary">
            {lines.length > 0
              ? fill(c.inList[k], {
                  n: n(rows.length + listedLines.length),
                  m: n(lines.length),
                })
              : dormant > 0
                ? fill(c.onThisContractSome[k], {
                    n: rows.length + shownSaved.length,
                    inactive: howMany(dormant),
                  })
                : unpublished > 0
                  ? fill(c.onThisContractDraft[k], {
                      n: rows.length + shownSaved.length,
                      drafts: howMany(unpublished),
                    })
                  : fill(c.onThisContract[k], {
                      n: rows.length + shownSaved.length,
                    })}
          </p>
          <div className="mt-3 space-y-2">
            {/* Anything added or saved in this session sits on top. */}
            {[...listedLines, ...shownSaved].map((line) => (
              <div
                key={line.id}
                className={cn(
                  "rounded-[10px] bg-surface-default p-3",
                  removed.includes(line.id)
                    ? "opacity-70"
                    : "ring-1 ring-brand-deep"
                )}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p
                    className={cn(
                      "text-[12.5px] font-semibold text-text-primary",
                      removed.includes(line.id) && "line-through"
                    )}
                  >
                    {line.when[k]}
                  </p>
                  <p
                    className={cn(
                      "text-[12px] font-medium",
                      removed.includes(line.id) && "line-through",
                      line.tone === "danger"
                        ? "text-status-danger"
                        : line.tone === "warning"
                          ? "text-status-warning"
                          : "text-text-primary"
                    )}
                  >
                    {line.value[k]}
                  </p>
                </div>
                <p className="mt-0.5 text-[11px] text-text-body">
                  {line.rooms[k]}
                </p>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <StatusPill
                    tone={
                      removed.includes(line.id)
                        ? "warning"
                        : saved.some((item) => item.id === line.id)
                          ? atOnce
                            ? "success"
                            : "warning"
                          : "warning"
                    }
                  >
                    {removed.includes(line.id)
                      ? c.removedPill[k]
                      : (kind === "stopSale" || kind === "release" || kind === "restrictions") &&
                          editingLine === line.id
                        ? liveGrid.editing[k]
                        : saved.some((item) => item.id === line.id)
                          ? atOnce
                            ? c.newLive[k]
                            : c.newDraft[k]
                          : c.newNotSaved[k]}
                  </StatusPill>
                  {!removed.includes(line.id) && (
                    <span className="flex items-center gap-3 text-[11.5px] font-medium">
                      {/* Stop sale: only an item edited and saved in this list, until it is applied. */}
                      {kind === "stopSale" &&
                        line.original &&
                        lines.some((item) => item.id === line.id) && (
                          <button
                            type="button"
                            onClick={() => undoStopSaleChanges(line)}
                            className="text-text-link hover:underline"
                          >
                            {stopSaleEditCopy.undoChanges[k]}
                          </button>
                        )}
                      {/* Release: only a create line edited and saved in this list, until it is applied. */}
                      {kind === "release" &&
                        line.original &&
                        lines.some((item) => item.id === line.id) && (
                          <button
                            type="button"
                            onClick={() => undoReleaseChanges(line)}
                            className="text-text-link hover:underline"
                          >
                            {releaseEditCopy.undoChanges[k]}
                          </button>
                        )}
                      {/* Restrictions: only an item edited and saved in this list, until it is applied. */}
                      {kind === "restrictions" &&
                        line.original &&
                        lines.some((item) => item.id === line.id) && (
                          <button
                            type="button"
                            onClick={() => undoRestrictionChanges(line)}
                            className="text-text-link hover:underline"
                          >
                            {restrictionEditCopy.undoChanges[k]}
                          </button>
                        )}
                      {/* Release / Restrictions: Edit only where the line's own form can be put back. */}
                      {(kind === "release"
                        ? line.releaseDraft && lines.some((item) => item.id === line.id)
                        : kind === "restrictions"
                          ? line.restrictionDraft && lines.some((item) => item.id === line.id)
                          : true) && (
                        <button
                          type="button"
                          /* Stop sale / Release / Restrictions: the line's own form back, held by its id until Save or Cancel. */
                          onClick={
                            kind === "stopSale"
                              ? () => editStopSaleLine(line)
                              : kind === "release"
                                ? () => editReleaseLine(line)
                                : kind === "restrictions"
                                  ? () => editRestrictionLine(line)
                                  : undefined
                          }
                          className="text-text-link hover:underline"
                        >
                          {c.edit[k]}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          /* Release: a staged item simply leaves the list (and the batch). */
                          const releaseItem =
                            kind === "release" && lines.some((item) => item.id === line.id);
                          /* Restrictions: likewise - only that item, no Undo banner. */
                          const restrictionItem =
                            kind === "restrictions" && lines.some((item) => item.id === line.id);
                          setRemoved((current) => [...current, line.id]);
                          setLines((current) =>
                            current.filter((item) => item.id !== line.id)
                          );
                          if (kind === "stopSale" || releaseItem || restrictionItem) {
                            /* Deleting the line being edited ends the edit with it. */
                            if (editingLine === line.id) {
                              if (kind === "stopSale") restartStopSale(true);
                              else if (kind === "release") restartRelease(true);
                              else restartRestrictions(true);
                            }
                            /* No Undo banner here: the line simply goes. */
                            setNote(null);
                            return;
                          }
                          setNote({
                            kind: "removed",
                            what: {
                              en: fill(c.removedWhat.en, {
                                rooms: line.rooms.en,
                                when: line.when.en,
                              }),
                              ar: fill(c.removedWhat.ar, {
                                rooms: line.rooms.ar,
                                when: line.when.ar,
                              }),
                            },
                            row: line,
                          });
                        }}
                        className="text-status-danger hover:underline"
                      >
                        {c.delete[k]}
                      </button>
                    </span>
                  )}
                </div>
              </div>
            ))}

            {rows.map((row) => {
              /* Stop sale: a saved rule with a staged edit shows that edit, in its own place. */
              const staged = kind === "stopSale" ? stagedEditOf(row.edit?.ruleId) : undefined;
              /* Release: this saved rule's staged change (an edit or a removal), and whether it is being edited. */
              const releaseRule = liveRel ? row.release : undefined;
              const releaseStaged = releaseRule
                ? lines.find((line) => line.ruleId === releaseRule.ruleId)
                : undefined;
              const releaseRowEditing = releaseRule !== undefined && editingRule === releaseRule.ruleId;
              /* Restrictions: the same for a saved operational rule (never a contract rule). */
              const restrictionRule = live ? row.restriction : undefined;
              const restrictionStaged = restrictionRule
                ? lines.find((line) => line.ruleId === restrictionRule.ruleId)
                : undefined;
              const restrictionRowEditing =
                restrictionRule !== undefined && editingRule === restrictionRule.ruleId;
              /* A staged edit shows in the rule's own row; a staged removal keeps the rule as loaded. */
              const shown =
                staged ??
                (releaseStaged?.releaseDraft
                  ? releaseStaged
                  : restrictionStaged?.restrictionDraft
                    ? restrictionStaged
                    : row);
              return (
              <div
                key={row.id ?? row.when.en}
                className={cn(
                  "rounded-[10px] bg-surface-default p-3",
                  ((row.edit && row.edit.ruleId === editingRule) ||
                    releaseRowEditing ||
                    restrictionRowEditing) &&
                    "ring-1 ring-brand-deep",
                )}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-[12.5px] font-semibold text-text-primary">
                    {shown.when[k]}
                  </p>
                  <p
                    className={cn(
                      "text-[12px] font-medium",
                      shown.tone === "danger"
                        ? "text-status-danger"
                        : shown.tone === "warning"
                          ? "text-status-warning"
                          : "text-text-primary"
                    )}
                  >
                    {shown.value[k]}
                  </p>
                </div>
                <p className="mt-0.5 text-[11px] text-text-body">
                  {shown.rooms[k]}
                </p>
                {row.note && (
                  <p className="mt-0.5 text-[11px] text-text-quiet">{row.note[k]}</p>
                )}
                {live && row.restriction?.lockedReason && (
                  <p className="mt-0.5 text-[11px] leading-4 text-status-warning">
                    {fill(lr.editLocked[k], { reason: row.restriction.lockedReason[k] })}
                  </p>
                )}
                {/* Live release: why Edit (and, when ownership is unknown, Remove) is off. */}
                {releaseRule && (releaseRule.editLocked || releaseRule.removeLocked) && (
                  <p className="mt-0.5 text-[11px] leading-4 text-status-warning">
                    {releaseRule.editLocked?.[k]}
                    {releaseRule.removeLocked &&
                      `${releaseRule.editLocked ? " " : ""}${releaseRule.removeLocked[k]}`}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  {/* Contract rules stay read-only; every operational rule uses the actions below. */}
                  {row.fromContract ? (
                    <>
                      <span className="flex flex-wrap items-center gap-1.5">
                        <StatusPill tone="neutral">
                          {c.fromContract[k]}
                        </StatusPill>
                        {/* A rule dated for a season that has not begun. */}
                        {row.inactive && (
                          <StatusPill tone="warning">
                            {c.notActive[k]}
                          </StatusPill>
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={onEditContract}
                        className="inline-flex items-center gap-1 text-[11.5px] font-medium text-text-link hover:underline"
                      >
                        {c.editInContract[k]}
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </button>
                    </>
                  ) : (
                    <>
                      <StatusPill
                        tone={
                          (row.edit && row.edit.ruleId === editingRule) ||
                          releaseRowEditing ||
                          restrictionRowEditing
                            ? "warning"
                            : staged || releaseStaged || restrictionStaged || row.draft
                              ? "warning"
                              : "success"
                        }
                      >
                        {(row.edit && row.edit.ruleId === editingRule) ||
                        releaseRowEditing ||
                        restrictionRowEditing
                          ? liveGrid.editing[k]
                          : staged
                            ? stopSaleEditCopy.edited[k]
                            : releaseStaged
                              ? releaseStaged.releaseDraft
                                ? releaseEditCopy.edited[k]
                                : lr.staged[k]
                              : restrictionStaged
                                ? restrictionStaged.restrictionDraft
                                  ? restrictionEditCopy.edited[k]
                                  : lr.staged[k]
                                : row.draft
                                  ? c.newDraft[k]
                                  : c.live[k]}
                      </StatusPill>
                      <span className="flex items-center justify-end w-full gap-3 text-[11.5px] font-medium">
                        {/* Stop sale: drop this rule's saved edit; the rule shows as loaded again. */}
                        {staged && (
                          <button
                            type="button"
                            onClick={() => undoStopSaleChanges(staged)}
                            className="text-text-link hover:underline"
                          >
                            {stopSaleEditCopy.undoChanges[k]}
                          </button>
                        )}
                        {/* Release: drop this rule's staged edit or removal; the rule shows as loaded again. */}
                        {releaseStaged && (
                          <button
                            type="button"
                            onClick={() => undoReleaseChanges(releaseStaged)}
                            className="text-text-link hover:underline"
                          >
                            {releaseEditCopy.undoChanges[k]}
                          </button>
                        )}
                        {/* Restrictions: drop this rule's staged edit or removal; the rule shows as loaded again. */}
                        {restrictionStaged && (
                          <button
                            type="button"
                            onClick={() => undoRestrictionChanges(restrictionStaged)}
                            className="text-text-link hover:underline"
                          >
                            {restrictionEditCopy.undoChanges[k]}
                          </button>
                        )}
                        {((!onRemoveExisting && !liveRt) || row.edit) &&
                          /* An edit that cannot rebuild the rule exactly is not offered; Remove stays. */
                          !(live && row.restriction?.lockedReason) &&
                          /* Release: only a rule rebuilt exactly (a seed), while writes are open. */
                          !(liveRel && row.release && (!row.release.seed || liveRel.blocked)) && (
                          <button
                            type="button"
                            onClick={() => {
                              const releaseSeed = row.release?.seed;
                              if (liveRel && row.release && releaseSeed) {
                                /* A rule already edited in this list reopens that edit; otherwise its seed. */
                                if (releaseStaged?.releaseDraft) editReleaseLine(releaseStaged);
                                else editReleaseRule(row.release.ruleId, releaseSeed);
                                return;
                              }
                              const seed = row.restriction;
                              if (live && seed) {
                                /* A rule already edited in this list reopens that edit, under its ruleId. */
                                if (restrictionStaged?.restrictionDraft) {
                                  editRestrictionLine(restrictionStaged);
                                  return;
                                }
                                /* The saved rule itself: no list line is being edited. */
                                setEditingLine(null);
                                setPicking(false);
                                setPicked(
                                  seed.ranges.map((range, index) => ({
                                    id: `E-${seed.ruleId}-${index}`,
                                    range,
                                    nights: nightsIn(range),
                                  })),
                                );
                                setRooms(seed.allRooms ? [roomList[0]!.en] : seed.rooms);
                                setMinNights(seed.minNights);
                                setAppliesOn(seed.appliesOn);
                                /* Each remaining night exactly as the rule owns it. */
                                setNightChecks(
                                  Object.fromEntries(
                                    Object.entries(seed.checks).map(([iso, checks]) => [
                                      calendarKey(new Date(`${iso}T00:00:00`)),
                                      checks,
                                    ]),
                                  ),
                                );
                                setEditingRule(seed.ruleId);
                                return;
                              }
                              /* Stop sale: a rule already edited in this list reopens that edit. */
                              if (staged) {
                                editStopSaleLine(staged);
                                return;
                              }
                              const rule = row.edit;
                              if (!rule) return;
                              /* The saved rule itself: no list line is being edited. */
                              setEditingLine(null);
                              setPicking(false);
                              setPicked(
                                rule.ranges.map((range, index) => ({
                                  id: `E-${rule.ruleId}-${index}`,
                                  range,
                                  nights: nightsIn(range),
                                })),
                              );
                              setRooms(rule.allRooms ? [roomList[0]!.en] : rule.rooms);
                              setSetTo(rule.status);
                              slaTouched.current = Boolean(rule.sla);
                              setSlaMinutes(
                                rule.sla ? String(rule.sla.slaMinutes) : defaultSlaMinutes,
                              );
                              setExpiryAction(rule.sla?.expiryAction ?? defaultExpiry);
                              setDays([0, 1, 2, 3, 4, 5, 6]);
                              setEditingRule(rule.ruleId);
                            }}
                            className="text-text-link hover:underline"
                          >
                            {c.edit[k]}
                          </button>
                        )}
                        <button
                          type="button"
                          disabled={
                            removing === (row.id ?? row.when.en) ||
                            Boolean(
                              liveRel &&
                              row.release &&
                              (row.release.removeLocked || liveRel.blocked),
                            )
                          }
                          onClick={async () => {
                            const releaseSeed = row.release;
                            if (liveRel && releaseSeed) {
                              /* Staged, never saved here: remove takes only action and ruleId. */
                              if (releaseSeed.removeLocked || liveRel.blocked) return;
                              const what = {
                                en: fill(lrel.removeLine.en, { id: String(releaseSeed.ruleId) }),
                                ar: fill(lrel.removeLine.ar, { id: String(releaseSeed.ruleId) }),
                              };
                              /* Removing the rule ends any edit of it (from its seed or its staged line). */
                              if (
                                editingRule === releaseSeed.ruleId ||
                                (releaseStaged !== undefined && editingLine === releaseStaged.id)
                              ) {
                                restartRelease(true);
                              }
                              /* Replaces a staged edit of this rule: one change per rule. */
                              setLines((current) => [
                                ...current.filter((line) => line.ruleId !== releaseSeed.ruleId),
                                {
                                  id: `L-${Date.now()}`,
                                  what,
                                  detail: {
                                    en: `${row.when.en} · ${row.rooms.en}`,
                                    ar: `${row.when.ar} · ${row.rooms.ar}`,
                                  },
                                  when: row.when,
                                  rooms: row.rooms,
                                  value: lr.removeValue,
                                  tone: "danger",
                                  release: [removeReleaseOperation(releaseSeed.ruleId)],
                                  ruleId: releaseSeed.ruleId,
                                },
                              ]);
                              setNote({ kind: "added", what });
                              return;
                            }
                            const seed = row.restriction;
                            if (live && seed) {
                              /* Staged like everything else: remove takes only action and ruleId. */
                              const what = {
                                en: fill(lr.removeLine.en, { id: String(seed.ruleId) }),
                                ar: fill(lr.removeLine.ar, { id: String(seed.ruleId) }),
                              };
                              setLines((current) => [
                                ...current.filter((line) => line.ruleId !== seed.ruleId),
                                {
                                  id: `L-${Date.now()}`,
                                  what,
                                  detail: {
                                    en: `${row.when.en} · ${row.rooms.en}`,
                                    ar: `${row.when.ar} · ${row.rooms.ar}`,
                                  },
                                  when: row.when,
                                  rooms: row.rooms,
                                  value: lr.removeValue,
                                  tone: "danger",
                                  restrictions: [{ action: "remove", ruleId: seed.ruleId }],
                                  ruleId: seed.ruleId,
                                },
                              ]);
                              /* Removing the rule ends any edit of it (from its seed or its staged line);
                                 the removal above replaces a staged edit - one change per rule. */
                              if (
                                editingRule === seed.ruleId ||
                                (restrictionStaged !== undefined &&
                                  editingLine === restrictionStaged.id)
                              ) {
                                restartRestrictions(true);
                              }
                              setNote({ kind: "added", what });
                              return;
                            }
                            if (liveRt) {
                              /* Same remove operations as before, now previewed and confirmed. */
                              const operations = liveRt.removeOperationsFor(row);
                              if (!operations) return;
                              setLines([
                                {
                                  id: `L-${Date.now()}`,
                                  what: rateReviewCopy.removeLine,
                                  detail: {
                                    en: `${row.when.en} · ${row.rooms.en}`,
                                    ar: `${row.when.ar} · ${row.rooms.ar}`,
                                  },
                                  when: row.when,
                                  rooms: row.rooms,
                                  value: rateReviewCopy.removeValue,
                                  tone: "danger",
                                  rates: operations,
                                },
                              ]);
                              setReviewing(true);
                              return;
                            }
                            if (!onRemoveExisting) return;
                            const removedRule = row.edit?.ruleId;
                            if (kind === "stopSale" && removedRule !== undefined) {
                              /* The rule is being removed: its staged edit, and any edit of it, go too. */
                              setLines((current) =>
                                current.filter((line) => line.stopSale?.ruleId !== removedRule),
                              );
                              if (editingRule === removedRule) restartStopSale(true);
                            }
                            setRemoving(row.id ?? row.when.en);
                            try {
                              await onRemoveExisting(row);
                            } finally {
                              setRemoving(null);
                            }
                          }}
                          className="text-status-danger hover:underline disabled:opacity-50"
                        >
                          {c.delete[k]}
                        </button>
                      </span>
                    </>
                  )}
                </div>
              </div>
              );
            })}
          </div>
        </aside>
      </div>

      {/* OV 04.B*K - the picker, over the panel it covers in the frame. */}
      {picking && (
        <div className="absolute inset-0 z-10 flex items-start justify-end bg-brand-deep/10 p-4">
          <DatePicker
            className="w-[300px]"
            {...(term ? { min: term.start, max: term.end, clampShortcuts: true } : {})}
            {...(openOn ? { openOn } : {})}
            onApply={(range) => {
              const item = { id: `R-${Date.now()}`, range, nights: nightsIn(range) };
              setPicked((current) => (oneRange ? [item] : [...current, item]));
              setPicking(false);
            }}
            onCancel={() => setPicking(false)}
          />
        </div>
      )}
    </Shell>
  );
}

/** Why Review & save is shut for live restrictions, with Reload when old scope is unknown. */
function BatchIssue({
  text,
  unknown,
  reloading,
  onReload,
  reloadLabel,
}: {
  text: string;
  unknown: boolean;
  reloading: boolean;
  onReload: () => void;
  reloadLabel: string;
}) {
  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-xl bg-status-danger-bg p-3.5">
      <p className="min-w-0 flex-1 text-[12px] leading-5 text-status-danger">{text}</p>
      {unknown && (
        <button
          type="button"
          disabled={reloading}
          onClick={onReload}
          className="text-[12px] font-medium text-text-link hover:underline disabled:opacity-50"
        >
          {reloadLabel}
        </button>
      )}
    </div>
  );
}

/** The modal the four overlays and the review step all sit in. */
function Shell({
  dir,
  contract,
  title,
  body,
  width,
  footer,
  onClose,
  children,
}: {
  dir: string;
  contract: string;
  title: string;
  body: string;
  width: string;
  footer: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const dismiss = useDismiss({ onClose });
  return (
    <div
      dir={dir}
      {...dismiss.scrim}
      aria-label={title}
      className={cn(
        "fixed inset-0 z-50 overflow-y-auto bg-brand-deep/40 p-4",
        scrimMotion
      )}
    >
      <div className="flex min-h-full items-center justify-center">
        <div
          {...dismiss.panel}
          className={cn(
            "relative w-full rounded-2xl bg-surface-default p-6 shadow-overlay sm:p-7",
            panelMotion,
            width
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-text-quiet">
                {contract}
              </p>
              <h2 className="mt-1 text-[22px] font-semibold text-text-primary">
                {title}
              </h2>
              <p className="mt-1 max-w-[620px] text-[13px] leading-5 text-text-body">
                {body}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-full bg-surface-subtle p-2 text-text-muted transition-colors hover:text-text-primary"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-5">{children}</div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle pt-5">
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
}
