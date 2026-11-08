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
  type AlreadySet,
  type BulkKind,
} from "@/lib/bulk-range-data";
import { liveGrid, liveRestrictions as lr, oneNight } from "@/lib/rate-overlay-data";
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
  RestrictionChangesData,
  RestrictionOperation,
  RestrictionScope,
} from "@/api/modules/rates-availability/types";

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
  ruleId?: number | undefined;
}

export interface StatusPayload {
  ruleId?: number | undefined;
  status: "stopSale" | "openSale" | "onRequest";
  ranges: DayRange[];
  weekdays: number[];
  rooms: string[];
  allRooms: boolean;
  sla?: { slaMinutes: number; expiryAction: "auto_reject" | "escalate_to_hoteliana" } | undefined;
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
  liveRestrictions,
}: {
  kind: BulkKind;
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
  needsSla?: boolean;
  liveRestrictions?: LiveRestrictionsProps | undefined;
}) {
  const live = kind === "restrictions" ? liveRestrictions : undefined;
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

  /* Bulk rates */
  const [priceMode, setPriceMode] = useState("apart");
  const [weekdayPrice, setWeekdayPrice] = useState("");
  const [weekendPrice, setWeekendPrice] = useState("");
  /* An empty form is not a wrong one: the price fields only go red once
     they have been asked for - the weekday when it has been typed in and
     emptied again, the weekend as soon as the weekday has an answer. */
  const [priceTouched, setPriceTouched] = useState(false);
  const [supplements, setSupplements] = useState<Record<string, string>>({});
  /* Stop sale */
  const [setTo, setSetTo] = useState("stopSale");
  const [editingRule, setEditingRule] = useState<number | null>(null);
  const [everyContract, setEveryContract] = useState(false);
  const [slaMinutes, setSlaMinutes] = useState("30");
  const [expiryAction, setExpiryAction] = useState<"auto_reject" | "escalate_to_hoteliana">(
    "auto_reject",
  );
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
  const [previewing, setPreviewing] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [stale, setStale] = useState(false);
  const previewRun = useRef(0);

  /* --------------------------------------------------------- the list */
  const [lines, setLines] = useState<Line[]>([]);
  const [reviewing, setReviewing] = useState(false);
  /** What the banner at the top says, once something has happened. */
  const [note, setNote] = useState<
    | { kind: "added" | "applied" | "drafted"; what: Bi }
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
  const releaseTooMany =
    kind === "release" &&
    releaseMode === "days" &&
    releaseDays.trim() !== "" &&
    (!Number.isFinite(releaseNumber) || releaseNumber > MAX_RELEASE_DAYS);
  /* Add stays shut while a price is missing, but the box only says
     "fix the field in red" once there is a red field to fix. */
  const priceMissing =
    kind === "bulkRates" &&
    (weekdayPrice.trim() === "" ||
      (priceMode === "apart" && weekendPrice.trim() === ""));
  const priceRed =
    kind === "bulkRates" &&
    ((priceTouched && weekdayPrice.trim() === "") ||
      (priceMode === "apart" &&
        weekdayPrice.trim() !== "" &&
        weekendPrice.trim() === ""));
  const broken = releaseTooMany || priceRed;

  /** The rooms the change reaches, once "all rooms" is resolved. */
  const roomList = roomOptions ? [bulkRooms[0]!, ...roomOptions] : bulkRooms;
  const realRooms = rooms.includes(roomList[0]!.en)
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

  /** What this overlay is setting, as the list will name it. */
  const setting: Bi = (() => {
    if (live) {
      const definition = { ...(minimumStay ? { minimumStay } : {}), ...summarizeChecks(pickedIsos, checksOf) };
      return {
        en: describeRestriction(definition, "en") || c.restrictionsTitle.en,
        ar: describeRestriction(definition, "ar") || c.restrictionsTitle.ar,
      };
    }
    if (kind === "bulkRates") return c.newPrice;
    if (kind === "stopSale") {
      return setTo === "stopSale"
        ? c.stopSale
        : setTo === "openSale"
          ? c.openSale
          : c.onRequest;
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
    if (kind !== "release" || releaseMode !== "days" || !releaseNumber) {
      return null;
    }
    const edge = Date.now() + releaseNumber * 86400000;
    const inside = picked.filter(
      (item) => dateOf(item.range.start).getTime() <= edge
    );
    return inside.length > 0 ? inside.map(rangeLabel).join(", ") : null;
  }, [kind, releaseMode, releaseNumber, picked]);

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
    !restrictionIssue &&
    (!live || restrictionPlan?.ok === true);
  const rows = existing ?? alreadySet[kind];
  const shownSaved = existing ? [] : saved;
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
  /* Live restrictions save as soon as they are confirmed: no draft step. */
  const atOnce = appliesAtOnce[kind] || Boolean(live);

  const clearForm = () => {
    setPicked([]);
    setRooms([]);
    setWeekdayPrice("");
    setWeekendPrice("");
    setPriceTouched(false);
    setSupplements({});
    setMinNights("");
    if (live) {
      setAppliesOn("every");
      setNightChecks({});
    }
    setEveryContract(false);
    setEditingRule(null);
  };

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
      ...(live && editingRule !== null ? { ruleId: editingRule } : {}),
    };
  };

  const reviewOne = () => {
    setLines([lineNow()]);
    setReviewing(true);
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
        tone:
          kind === "stopSale" && setTo === "stopSale"
            ? "danger"
            : kind === "stopSale" && setTo === "onRequest"
              ? "warning"
              : undefined,
        payload: statusPayload(),
        restrictions: restrictionOperations(),
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
  /* Pre-review limits over the whole batch. Old ownership comes from the list; an
     unknown rule blocks review rather than counting as zero. Preview stays authoritative. */
  const batchUsage = live
    ? restrictionBatchUsage(stagedOperations, live.allVariationIds, live.ownedCellsOf)
    : null;
  const batchIssue: Bi | null = !batchUsage
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
  const [reloading, setReloading] = useState(false);
  const reloadRules = async () => {
    if (!live) return;
    setReloading(true);
    try {
      await live.reloadRules();
    } finally {
      setReloading(false);
    }
  };
  const runPreview = async () => {
    if (!live) return;
    const run = ++previewRun.current;
    setPreview(null);
    setPreviewError(null);
    if (stagedOperations.length === 0) return;
    setPreviewing(true);
    try {
      const data = await live.preview(stagedOperations);
      if (run === previewRun.current) setPreview(data);
    } catch (error) {
      if (run === previewRun.current) setPreviewError(getApiErrorMessage(error, lr.previewFailed[k]));
    } finally {
      if (run === previewRun.current) setPreviewing(false);
    }
  };
  /* Entering review, or changing the list while in it, needs a fresh preview. */
  useEffect(() => {
    if (!live || !reviewing) return;
    setStale(false);
    void runPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewing, lines]);

  const confirm = async () => {
    if (live) {
      if (!preview) return;
      setApplying(true);
      let outcome: "saved" | "stale";
      try {
        outcome = await live.save(stagedOperations, preview.restrictionsRevision);
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
                  (live !== undefined && (previewing || !preview || batchIssue !== null))
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

        {live && (
          <>
            {batchIssue && (
              <BatchIssue
                text={batchIssue[k]}
                unknown={(batchUsage?.unknownRuleIds.length ?? 0) > 0}
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
            ) : preview ? (
              <RestrictionPreview data={preview} roomName={live.roomName} k={k} />
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
        finished ? (
          <Button variant="outline" onClick={onClose}>
            {c.done[k]}
          </Button>
        ) : oneRange ? (
          <>
            <Button variant="outline" onClick={onClose}>
              {c.cancel[k]}
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
              {c.cancel[k]}
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
                  unknown={(batchUsage?.unknownRuleIds.length ?? 0) > 0}
                  reloading={reloading}
                  onReload={() => void reloadRules()}
                  reloadLabel={lr.reloadRules[k]}
                />
              )}
              <Button
                disabled={lines.length === 0 || batchIssue !== null}
                reason={
                  lines.length === 0 ? c.nothingYet[k] : batchIssue ? batchIssue[k] : undefined
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
                : note.kind === "applied"
                  ? fill(c.appliedTitle[k], { what: note.what[k] })
                  : note.kind === "drafted"
                    ? fill(c.draftedTitle[k], { what: note.what[k] })
                    : fill(c.removedLine[k], { what: note.what[k] })}
            </p>
            {note.kind !== "removed" && (
              <p className="mt-0.5 text-[12px] leading-5 text-text-body">
                {note.kind === "added"
                  ? c.addedBody[k]
                  : note.kind === "applied"
                    ? oneRange
                      ? c.pricesAppliedBody[k]
                      : live
                        ? lr.appliedBody[k]
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
          {editingRule !== null && (
            <div className="flex flex-wrap items-center gap-3 rounded-[10px] border border-brand-deep/30 bg-primary-subtle px-3.5 py-2.5">
              <p className="min-w-0 flex-1 text-[12px] leading-5 text-text-primary">
                {live ? lr.editingHint[k] : liveGrid.editingHint[k]}
              </p>
              <button
                type="button"
                onClick={clearForm}
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
                  {c.add[k]}
                </Button>
              )}
            </div>

            {/* OV 04.B*N - each range as its own chip, and a way out. */}
            {!oneRange && picked.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {picked.map((item) => (
                  <span
                    key={item.id}
                    className="rounded-md bg-surface-subtle px-2.5 py-1 text-[11.5px] text-text-primary"
                  >
                    {fill(c.rangeChip[k], {
                      when: rangeLabel(item),
                      nights: say(item.nights, nightsWord),
                    })}
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

          <Section label={c.rooms[k]}>
            <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {roomList.map((room) => (
                <label
                  key={room.en}
                  className="flex cursor-pointer items-center gap-2.5 text-[12.5px] text-text-primary"
                >
                  <Checkbox
                    checked={rooms.includes(room.en)}
                    onCheckedChange={(value) =>
                      setRooms((current) =>
                        value === true
                          ? [...current, room.en]
                          : current.filter((r) => r !== room.en)
                      )
                    }
                  />
                  {room[k]}
                </label>
              ))}
            </div>
          </Section>

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
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <Input
                  label={
                    priceMode === "one" ? c.baseEvery[k] : c.baseWeekday[k]
                  }
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
              <p className="mt-2 max-w-[560px] text-[11.5px] leading-4 text-text-quiet">
                {c.othersFollow[k]}
              </p>
            </Section>
          )}

          {kind === "bulkRates" &&
            !onApplyRates &&
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

          {kind === "stopSale" && (
            <Section label={c.setTo[k]}>
              <RadioGroup
                className="flex flex-wrap items-center gap-x-5 gap-y-2"
                value={setTo}
                onValueChange={setSetTo}
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
                      onChange={(e) => setSlaMinutes(e.target.value)}
                      className="h-9 w-20"
                      aria-invalid={slaBad}
                    />
                    <span className="text-[11.5px] text-text-quiet">{liveGrid.slaHint[k]}</span>
                  </label>
                  <RadioGroup
                    className="flex flex-wrap items-center gap-x-5 gap-y-2"
                    value={expiryAction}
                    onValueChange={(value) =>
                      setExpiryAction(value as "auto_reject" | "escalate_to_hoteliana")
                    }
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
              {releaseMode === "days" && (
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <div>
                    <Input
                      label={c.daysBefore[k]}
                      inputMode="numeric"
                      value={releaseDays}
                      onChange={(e) => setReleaseDays(e.target.value)}
                      {...(releaseTooMany
                        ? {
                            error: fill(c.releaseTooMany[k], {
                              max: n(MAX_RELEASE_DAYS),
                            }),
                          }
                        : {})}
                    />
                    {/* OV 04.BRRE - the fix is one press, not a re-read. */}
                    {releaseTooMany ? (
                      <button
                        type="button"
                        onClick={() => setReleaseDays(String(MAX_RELEASE_DAYS))}
                        className="mt-1 text-[11.5px] font-medium text-text-link hover:underline"
                      >
                        {fill(c.useMaxDays[k], { max: n(MAX_RELEASE_DAYS) })}
                      </button>
                    ) : (
                      <p className="mt-1 text-[11.5px] text-text-quiet">
                        {c.daysRange[k]}
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      label={c.at[k]}
                      value={releaseAt}
                      onChange={(e) => setReleaseAt(e.target.value)}
                    />
                    <p className="mt-1 text-[11.5px] text-text-quiet">
                      {c.makkahTime[k]}
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
                  n: n(rows.length + lines.length),
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
            {[...lines, ...shownSaved].map((line) => (
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
                      : saved.some((item) => item.id === line.id)
                        ? atOnce
                          ? c.newLive[k]
                          : c.newDraft[k]
                        : c.newNotSaved[k]}
                  </StatusPill>
                  {!removed.includes(line.id) && (
                    <span className="flex items-center gap-3 text-[11.5px] font-medium">
                      <button
                        type="button"
                        className="text-text-link hover:underline"
                      >
                        {c.edit[k]}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRemoved((current) => [...current, line.id]);
                          setLines((current) =>
                            current.filter((item) => item.id !== line.id)
                          );
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

            {rows.map((row) => (
              <div
                key={row.id ?? row.when.en}
                className={cn(
                  "rounded-[10px] bg-surface-default p-3",
                  row.edit && row.edit.ruleId === editingRule && "ring-1 ring-brand-deep",
                )}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-[12.5px] font-semibold text-text-primary">
                    {row.when[k]}
                  </p>
                  <p
                    className={cn(
                      "text-[12px] font-medium",
                      row.tone === "danger"
                        ? "text-status-danger"
                        : row.tone === "warning"
                          ? "text-status-warning"
                          : "text-text-primary"
                    )}
                  >
                    {row.value[k]}
                  </p>
                </div>
                <p className="mt-0.5 text-[11px] text-text-body">
                  {row.rooms[k]}
                </p>
                {row.note && (
                  <p className="mt-0.5 text-[11px] text-text-quiet">{row.note[k]}</p>
                )}
                {live && row.restriction?.lockedReason && (
                  <p className="mt-0.5 text-[11px] leading-4 text-status-warning">
                    {fill(lr.editLocked[k], { reason: row.restriction.lockedReason[k] })}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  {live &&
                  row.restriction &&
                  lines.some((line) => line.ruleId === row.restriction?.ruleId) ? (
                    <StatusPill tone="warning">{lr.staged[k]}</StatusPill>
                  ) : row.fromContract ? (
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
                          row.edit && row.edit.ruleId === editingRule
                            ? "warning"
                            : row.draft
                              ? "warning"
                              : "success"
                        }
                      >
                        {row.edit && row.edit.ruleId === editingRule
                          ? liveGrid.editing[k]
                          : row.draft
                            ? c.newDraft[k]
                            : c.live[k]}
                      </StatusPill>
                      <span className="flex items-center gap-3 text-[11.5px] font-medium">
                        {(!onRemoveExisting || row.edit) &&
                          /* An edit that cannot rebuild the rule exactly is not offered; Remove stays. */
                          !(live && row.restriction?.lockedReason) && (
                          <button
                            type="button"
                            onClick={() => {
                              const seed = row.restriction;
                              if (live && seed) {
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
                              const rule = row.edit;
                              if (!rule) return;
                              setPicked(
                                rule.ranges.map((range, index) => ({
                                  id: `E-${rule.ruleId}-${index}`,
                                  range,
                                  nights: nightsIn(range),
                                })),
                              );
                              setRooms(rule.allRooms ? [roomList[0]!.en] : rule.rooms);
                              setSetTo(rule.status);
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
                          disabled={removing === (row.id ?? row.when.en)}
                          onClick={async () => {
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
                              if (editingRule === seed.ruleId) clearForm();
                              setNote({ kind: "added", what });
                              return;
                            }
                            if (!onRemoveExisting) return;
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
            ))}
          </div>
        </aside>
      </div>

      {/* OV 04.B*K - the picker, over the panel it covers in the frame. */}
      {picking && (
        <div className="absolute inset-0 z-10 flex items-start justify-end bg-brand-deep/10 p-4">
          <DatePicker
            className="w-[300px]"
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
