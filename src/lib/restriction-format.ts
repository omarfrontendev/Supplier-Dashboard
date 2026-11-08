/**
 * Restriction override wording and weekday groups, shared by the Restrictions
 * overlay and the rate calendar's sidebar rows. Display only: effective
 * values and their sources always come from the backend.
 */

import type {
  RestrictionAppliesOn,
  RestrictionDefinition,
  RestrictionOperation,
  RestrictionScope,
  RestrictionStatus,
  RestrictionWeekdayGroup,
} from "@/api/modules/rates-availability/types";
import { fill } from "@/lib/i18n";
import { arNum, liveGrid, liveRestrictions as lr } from "@/lib/rate-overlay-data";

type Lang = "en" | "ar";

const DAY_KEYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

export const dayName = (day: number, k: Lang) => liveGrid.terms.days[DAY_KEYS[day]!]?.[k] ?? "";

const dayList = (days: number[], k: Lang) =>
  days.map((day) => dayName(day, k)).join(k === "ar" ? "، " : ", ");

export const restrictionNum = (value: number, k: Lang) =>
  k === "ar" ? arNum(value) : String(value);

/** One phrase per supplied field; omitted fields inherit and are not named. */
export function describeRestriction(definition: RestrictionDefinition, k: Lang): string {
  const parts: string[] = [];
  const min = definition.minimumStay;
  if (min) {
    parts.push(
      min.minNights === 0
        ? lr.minZeroLine[k]
        : fill((min.appliesOn === "weekend_days" ? lr.minWeekendLine : lr.minLine)[k], {
            n: restrictionNum(min.minNights, k),
          }),
    );
  }
  for (const [groups, closed, open] of [
    [definition.checkIn, lr.inClosedLine, lr.inOpenLine],
    [definition.checkOut, lr.outClosedLine, lr.outOpenLine],
  ] as const) {
    for (const group of groups ?? []) {
      parts.push(
        fill((group.status === "closed" ? closed : open)[k], { days: dayList(group.weekdays, k) }),
      );
    }
  }
  return parts.join(" · ");
}

export type WeekdayStates = Partial<Record<number, RestrictionStatus>>;

/** Disjoint groups, one per status; weekdays left on Inherit are omitted. */
export function weekdayGroups(states: WeekdayStates): RestrictionWeekdayGroup[] {
  return (["closed", "open"] as const).flatMap((status) => {
    const weekdays = [0, 1, 2, 3, 4, 5, 6].filter((day) => states[day] === status);
    return weekdays.length ? [{ weekdays, status }] : [];
  });
}

/* ------------------------------------------- calendar nights -> operations */

/** One night's check-in / check-out choice; an absent side inherits. */
export interface NightChecks {
  in?: RestrictionStatus;
  out?: RestrictionStatus;
}

export const weekdayOfIso = (iso: string) => new Date(`${iso}T00:00:00`).getDay();

export const isoOfDate = (day: Date) =>
  `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(
    day.getDate(),
  ).padStart(2, "0")}`;

/** Every night of the same weekday carries the same choice (Inherit included). */
export function checksAreWeekdayUniform(
  isoDates: string[],
  checksOf: (iso: string) => NightChecks,
): boolean {
  const seen = new Map<number, string>();
  for (const iso of isoDates) {
    const checks = checksOf(iso);
    const signature = `${checks.in ?? "-"}|${checks.out ?? "-"}`;
    const day = weekdayOfIso(iso);
    const earlier = seen.get(day);
    if (earlier !== undefined && earlier !== signature) return false;
    seen.set(day, signature);
  }
  return true;
}

function groupsFor(
  isoDates: string[],
  checksOf: (iso: string) => NightChecks,
  side: "in" | "out",
): RestrictionWeekdayGroup[] {
  const states: WeekdayStates = {};
  for (const iso of isoDates) {
    const status = checksOf(iso)[side];
    if (status) states[weekdayOfIso(iso)] = status;
  }
  return weekdayGroups(states);
}

export type RestrictionPlan =
  | { ok: true; operations: RestrictionOperation[]; split: boolean }
  | { ok: false; reason: "nothing" | "editNotUniform" };

/**
 * Calendar choices -> operations, without widening any ownership:
 *  - weekday-uniform choices: one operation over the whole selection; an
 *    edit keeps its rule ID;
 *  - night-by-night choices (create only): minimum stay alone over the whole
 *    selection, then one create per set of nights sharing the same choices,
 *    scoped to exactly those dates. Same layer, and no two operations touch
 *    the same field on the same night, so none replaces another;
 *  - an edit is never split or turned into remove + create.
 */
export function planRestrictionOperations({
  isoDates,
  checksOf,
  target,
  range,
  minimumStay,
  editRuleId,
}: {
  isoDates: string[];
  checksOf: (iso: string) => NightChecks;
  target: { allRooms: true } | { variationIds: number[] };
  /** The single picked range, when there is exactly one. */
  range: { startDate: string; endDate: string } | null;
  minimumStay: { minNights: number; appliesOn: RestrictionAppliesOn } | undefined;
  editRuleId: number | null;
}): RestrictionPlan {
  const fullScope: RestrictionScope = range
    ? { ...target, ...range }
    : { ...target, dates: isoDates };
  if (checksAreWeekdayUniform(isoDates, checksOf)) {
    const checkIn = groupsFor(isoDates, checksOf, "in");
    const checkOut = groupsFor(isoDates, checksOf, "out");
    const definition: RestrictionDefinition = {
      ...(minimumStay ? { minimumStay } : {}),
      ...(checkIn.length ? { checkIn } : {}),
      ...(checkOut.length ? { checkOut } : {}),
    };
    if (!definition.minimumStay && !definition.checkIn && !definition.checkOut) {
      return { ok: false, reason: "nothing" };
    }
    return {
      ok: true,
      split: false,
      operations: [
        editRuleId !== null
          ? { action: "edit", ruleId: editRuleId, ...fullScope, ...definition }
          : { action: "create", ...fullScope, ...definition },
      ],
    };
  }
  if (editRuleId !== null) return { ok: false, reason: "editNotUniform" };
  const parts = new Map<string, string[]>();
  for (const iso of isoDates) {
    const checks = checksOf(iso);
    if (!checks.in && !checks.out) continue;
    const key = `${checks.in ?? "-"}|${checks.out ?? "-"}`;
    parts.set(key, [...(parts.get(key) ?? []), iso]);
  }
  const operations: RestrictionOperation[] = minimumStay
    ? [{ action: "create", ...fullScope, minimumStay }]
    : [];
  for (const dates of parts.values()) {
    const weekdays = [...new Set(dates.map(weekdayOfIso))].sort((a, b) => a - b);
    const checks = checksOf(dates[0]!);
    operations.push({
      action: "create",
      ...target,
      dates,
      ...(checks.in ? { checkIn: [{ weekdays, status: checks.in }] } : {}),
      ...(checks.out ? { checkOut: [{ weekdays, status: checks.out }] } : {}),
    });
  }
  return { ok: true, split: true, operations };
}

/** Night-level choices summarised by weekday, for labels only. */
export function summarizeChecks(
  isoDates: string[],
  checksOf: (iso: string) => NightChecks,
): Pick<RestrictionDefinition, "checkIn" | "checkOut"> {
  const side = (which: "in" | "out") =>
    (["closed", "open"] as const).flatMap((status) => {
      const weekdays = [
        ...new Set(isoDates.filter((iso) => checksOf(iso)[which] === status).map(weekdayOfIso)),
      ].sort((a, b) => a - b);
      return weekdays.length ? [{ weekdays, status }] : [];
    });
  const checkIn = side("in");
  const checkOut = side("out");
  return {
    ...(checkIn.length ? { checkIn } : {}),
    ...(checkOut.length ? { checkOut } : {}),
  };
}

/* ------------------------------------------------------------ batch limits */

/** Guide p.13, per batch. Cleared edit/remove scope counts; fields do not multiply cells. */
export const RESTRICTION_LIMITS = { operations: 100, dates: 366, cells: 10000 };

/** The new scope a create/edit writes, as "variationId|date" cells. */
function replacementCells(
  operation: Exclude<RestrictionOperation, { action: "remove" }>,
  allVariationIds: number[],
): string[] {
  const dates: string[] = [];
  if (operation.dates) dates.push(...operation.dates);
  else if (operation.startDate && operation.endDate) {
    const day = new Date(`${operation.startDate}T00:00:00`);
    const last = new Date(`${operation.endDate}T00:00:00`);
    while (day <= last) {
      dates.push(isoOfDate(day));
      day.setDate(day.getDate() + 1);
    }
  }
  const ids = operation.allRooms ? allVariationIds : (operation.variationIds ?? []);
  return ids.flatMap((id) => dates.map((date) => `${id}|${date}`));
}

export interface RestrictionBatchUsage {
  operations: number;
  dates: number;
  cells: number;
  /** Rules whose current ownership is not in the loaded list: cleared scope unknown. */
  unknownRuleIds: number[];
}

/**
 * Distinct Room/View-nights the batch affects:
 *  create -> its new scope;
 *  edit   -> the rule's remaining nonpast owned cells (cleared) plus its new scope;
 *  remove -> the rule's remaining nonpast owned cells.
 * Old ownership comes from the overrides list (ownedCellsOf), never from the
 * payload. Assumption: the backend counts distinct affected cells ("fields /
 * layers do not multiply"); its preview counts stay authoritative.
 */
export function restrictionBatchUsage(
  operations: RestrictionOperation[],
  allVariationIds: number[],
  ownedCellsOf: (ruleId: number) => string[] | undefined,
): RestrictionBatchUsage {
  const cells = new Set<string>();
  const unknownRuleIds: number[] = [];
  for (const operation of operations) {
    if (operation.action !== "create") {
      const owned = ownedCellsOf(operation.ruleId);
      if (owned) owned.forEach((cell) => cells.add(cell));
      else unknownRuleIds.push(operation.ruleId);
    }
    if (operation.action !== "remove") {
      replacementCells(operation, allVariationIds).forEach((cell) => cells.add(cell));
    }
  }
  const dates = new Set([...cells].map((cell) => cell.slice(cell.indexOf("|") + 1)));
  return { operations: operations.length, dates: dates.size, cells: cells.size, unknownRuleIds };
}
