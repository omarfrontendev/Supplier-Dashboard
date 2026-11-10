/**
 * Manage Release - pure operation builders and local validation (guide
 * pp.15-17). Local checks give fast feedback only; preview and save stay the
 * authority. No React, no API calls, no copy: issues are returned as codes
 * for the overlay to word.
 *
 * Dates are YYYY-MM-DD strings handled in UTC arithmetic, so the browser's
 * time zone never moves a night. "Today" is always supplied by the caller in
 * the contract's published time zone; nothing here reads the clock.
 */

import type {
  ReleaseOperation,
  ReleaseRule,
  ReleaseScope,
  ReleaseTiming,
} from "@/api/modules/rates-availability/types";

/* ------------------------------------------------------------------ limits */

/** Guide p.15 (days, time) and p.17 (batch). */
export const RELEASE_LIMITS = {
  minDays: 1,
  maxDays: 365,
  operations: 100,
  /** Distinct affected nights across the batch. */
  nights: 366,
  /** Expanded variation/date cells across the batch, cleared scope included. */
  cells: 10000,
  /** One operation's date range or date list, before weekday filtering. */
  selectionNights: 366,
};

/* ------------------------------------------------------------------- dates */

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const DAY_MS = 86400000;

/** Strict YYYY-MM-DD that is a real calendar date. */
export function isReleaseIsoDate(value: unknown): value is string {
  if (typeof value !== "string" || !ISO_DATE.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number) as [number, number, number];
  const at = new Date(Date.UTC(y, m - 1, d));
  return at.getUTCFullYear() === y && at.getUTCMonth() === m - 1 && at.getUTCDate() === d;
}

const utcOf = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number) as [number, number, number];
  return Date.UTC(y, m - 1, d);
};

const isoOfUtc = (time: number) => new Date(time).toISOString().slice(0, 10);

/** 0 = Sunday .. 6 = Saturday, independent of the browser time zone. */
export const releaseWeekdayOf = (iso: string) => new Date(utcOf(iso)).getUTCDay();

/** Every night from start to end, both inclusive. Empty when reversed. */
export function releaseNightsBetween(startDate: string, endDate: string): string[] {
  const out: string[] = [];
  const last = utcOf(endDate);
  for (let time = utcOf(startDate); time <= last; time += DAY_MS) out.push(isoOfUtc(time));
  return out;
}

/* ------------------------------------------------------------------ timing */

/** Strict local HH:MM, 00:00-23:59. */
export const isReleaseTime = (value: unknown): value is string =>
  typeof value === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);

export const isReleaseDays = (value: unknown): value is number =>
  typeof value === "number" &&
  Number.isInteger(value) &&
  value >= RELEASE_LIMITS.minDays &&
  value <= RELEASE_LIMITS.maxDays;

/**
 * Timing exactly as an override sends it: same_day never carries
 * daysBeforeCheckIn, and afterReleaseAction / onRequestSettings are never
 * part of an override (they always come from the contract).
 */
export function buildReleaseTiming(timing: ReleaseTiming): ReleaseTiming {
  return timing.type === "same_day"
    ? { type: "same_day", releaseTime: timing.releaseTime }
    : {
        type: "number_of_days",
        daysBeforeCheckIn: timing.daysBeforeCheckIn,
        releaseTime: timing.releaseTime,
      };
}

/* ------------------------------------------------------------------- scope */

/** variationIds:[12] one room, [12,13] several, or allRooms - never both. */
export type ReleaseRoomSelection = { allRooms: true } | { variationIds: number[] };

/** dates:[...] for one or more explicit nights, or an inclusive range - never both. */
export type ReleaseNightSelection = { dates: string[] } | { startDate: string; endDate: string };

export interface ReleaseSelection {
  rooms: ReleaseRoomSelection;
  nights: ReleaseNightSelection;
  /** Optional filter, 0 = Sunday .. 6 = Saturday. Omitted (or all seven) = every night. */
  weekdays?: number[] | undefined;
}

const uniqueSorted = (values: number[]) => [...new Set(values)].sort((a, b) => a - b);

/**
 * The selection as one scope. Explicit dates are deduplicated and sorted,
 * variation IDs deduplicated, and a weekday filter covering all seven days is
 * dropped because it filters nothing. Validation is separate.
 */
export function buildReleaseScope({ rooms, nights, weekdays }: ReleaseSelection): ReleaseScope {
  const days = weekdays ? uniqueSorted(weekdays) : undefined;
  return {
    ...("allRooms" in rooms
      ? { allRooms: true as const }
      : { variationIds: [...new Set(rooms.variationIds)] }),
    ...("dates" in nights
      ? { dates: [...new Set(nights.dates)].sort() }
      : { startDate: nights.startDate, endDate: nights.endDate }),
    ...(days && days.length < 7 ? { weekdays: days } : {}),
  };
}

/** The nights a scope reaches after its weekday filter. Assumes a valid scope. */
export function expandReleaseNights(scope: ReleaseScope): string[] {
  const all = scope.dates
    ? [...new Set(scope.dates)].sort()
    : scope.startDate && scope.endDate
      ? releaseNightsBetween(scope.startDate, scope.endDate)
      : [];
  return scope.weekdays
    ? all.filter((iso) => scope.weekdays!.includes(releaseWeekdayOf(iso)))
    : all;
}

/* -------------------------------------------------------------- operations */

export function createReleaseOperation(
  selection: ReleaseSelection,
  timing: ReleaseTiming,
): ReleaseOperation {
  return { action: "create", ...buildReleaseScope(selection), ...buildReleaseTiming(timing) };
}

/** Edit always carries the complete replacement scope and timing; it keeps the live rule ID. */
export function editReleaseOperation(
  ruleId: number,
  selection: ReleaseSelection,
  timing: ReleaseTiming,
): ReleaseOperation {
  return {
    action: "edit",
    ruleId,
    ...buildReleaseScope(selection),
    ...buildReleaseTiming(timing),
  };
}

/** Remove takes only action and ruleId. */
export function removeReleaseOperation(ruleId: number): ReleaseOperation {
  return { action: "remove", ruleId };
}

/* -------------------------------------------------------------- validation */

export type ReleaseIssueCode =
  /* operation shape */
  | "invalidAction"
  | "invalidRuleId"
  | "forbiddenField"
  /* rooms */
  | "noRooms"
  | "roomsConflict"
  | "invalidVariationId"
  | "duplicateVariationIds"
  /* nights */
  | "noNights"
  | "datesConflict"
  | "incompleteRange"
  | "invalidDate"
  | "rangeReversed"
  | "tooManySelectedNights"
  | "invalidWeekdays"
  | "noMatchingNights"
  | "pastNight"
  | "outsideTerm"
  /* timing */
  | "invalidType"
  | "invalidDays"
  | "daysNotAllowed"
  | "invalidTime"
  /* batch */
  | "noOperations"
  | "tooManyOperations"
  | "tooManyNights"
  | "tooManyCells";

export interface ReleaseIssue {
  code: ReleaseIssueCode;
  /** Position in the batch, when the issue belongs to one operation. */
  operationIndex?: number;
}

export interface ReleaseValidationContext {
  /** Today in the contract's published time zone, YYYY-MM-DD. Writes need today or later. */
  today: string;
  /** The contract term, inclusive; when supplied, every night must fall inside it. */
  term?: { startDate: string; endDate: string } | undefined;
}

const SCOPE_KEYS = ["variationIds", "allRooms", "dates", "startDate", "endDate", "weekdays"];
const TIMING_KEYS = ["type", "daysBeforeCheckIn", "releaseTime"];
const ALLOWED_KEYS: Record<string, string[]> = {
  create: ["action", ...SCOPE_KEYS, ...TIMING_KEYS],
  edit: ["action", "ruleId", ...SCOPE_KEYS, ...TIMING_KEYS],
  remove: ["action", "ruleId"],
};

const isPositiveInt = (value: unknown) =>
  typeof value === "number" && Number.isInteger(value) && value > 0 && value <= 2147483647;

function scopeIssues(scope: ReleaseScope, context: ReleaseValidationContext): ReleaseIssueCode[] {
  const issues: ReleaseIssueCode[] = [];

  /* Rooms: variationIds OR allRooms:true, exclusively. */
  const hasIds = scope.variationIds !== undefined;
  const hasAll = scope.allRooms !== undefined;
  if (hasIds && hasAll) issues.push("roomsConflict");
  else if (!hasIds && !hasAll) issues.push("noRooms");
  if (hasAll && scope.allRooms !== true) issues.push("roomsConflict");
  if (hasIds) {
    const ids = scope.variationIds!;
    if (!Array.isArray(ids) || ids.length === 0) issues.push("noRooms");
    else {
      if (!ids.every(isPositiveInt)) issues.push("invalidVariationId");
      if (new Set(ids).size !== ids.length) issues.push("duplicateVariationIds");
    }
  }

  /* Nights: dates OR both range ends, exclusively. */
  const hasDates = scope.dates !== undefined;
  const hasStart = scope.startDate !== undefined;
  const hasEnd = scope.endDate !== undefined;
  if (hasDates && (hasStart || hasEnd)) {
    issues.push("datesConflict");
    return issues;
  }
  if (!hasDates && !hasStart && !hasEnd) {
    issues.push("noNights");
    return issues;
  }
  if (!hasDates && hasStart !== hasEnd) {
    issues.push("incompleteRange");
    return issues;
  }

  let selected: string[];
  if (hasDates) {
    const dates = scope.dates!;
    if (!Array.isArray(dates) || dates.length === 0) {
      issues.push("noNights");
      return issues;
    }
    /* At most 366 entries before deduplication and filtering. */
    if (dates.length > RELEASE_LIMITS.selectionNights) issues.push("tooManySelectedNights");
    if (!dates.every(isReleaseIsoDate)) {
      issues.push("invalidDate");
      return issues;
    }
    selected = [...new Set(dates)].sort();
  } else {
    if (!isReleaseIsoDate(scope.startDate) || !isReleaseIsoDate(scope.endDate)) {
      issues.push("invalidDate");
      return issues;
    }
    if (scope.startDate > scope.endDate) {
      issues.push("rangeReversed");
      return issues;
    }
    selected = releaseNightsBetween(scope.startDate, scope.endDate);
    if (selected.length > RELEASE_LIMITS.selectionNights) issues.push("tooManySelectedNights");
  }

  /* Optional weekdays: unique integers 0-6, at least one. */
  let nights = selected;
  if (scope.weekdays !== undefined) {
    const days = scope.weekdays;
    const valid =
      Array.isArray(days) &&
      days.length > 0 &&
      days.every((day) => Number.isInteger(day) && day >= 0 && day <= 6) &&
      new Set(days).size === days.length;
    if (!valid) {
      issues.push("invalidWeekdays");
      return issues;
    }
    nights = selected.filter((iso) => days.includes(releaseWeekdayOf(iso)));
  }
  if (nights.length === 0) issues.push("noMatchingNights");

  /* Writes use today-or-later nights inside the term. */
  if (nights.some((iso) => iso < context.today)) issues.push("pastNight");
  const term = context.term;
  if (term && nights.some((iso) => iso < term.startDate || iso > term.endDate)) {
    issues.push("outsideTerm");
  }
  return issues;
}

function timingIssues(operation: Record<string, unknown>): ReleaseIssueCode[] {
  const { type, daysBeforeCheckIn, releaseTime } = operation;
  const issues: ReleaseIssueCode[] = [];
  if (type === "number_of_days") {
    if (!isReleaseDays(daysBeforeCheckIn)) issues.push("invalidDays");
  } else if (type === "same_day") {
    /* Omitted entirely: null and zero are invalid too. */
    if ("daysBeforeCheckIn" in operation) issues.push("daysNotAllowed");
  } else {
    issues.push("invalidType");
  }
  if (!isReleaseTime(releaseTime)) issues.push("invalidTime");
  return issues;
}

/**
 * One operation, checked at runtime so a hand-built or edited payload cannot
 * slip an unknown field (afterReleaseAction, onRequestSettings, mealPlan,
 * roomId...) or a contradictory selection through.
 */
export function validateReleaseOperation(
  operation: ReleaseOperation,
  context: ReleaseValidationContext,
): ReleaseIssueCode[] {
  const raw = operation as unknown as Record<string, unknown>;
  const allowed = ALLOWED_KEYS[String(raw["action"])];
  if (!allowed) return ["invalidAction"];

  const issues: ReleaseIssueCode[] = [];
  if (Object.keys(raw).some((key) => !allowed.includes(key))) issues.push("forbiddenField");
  if (operation.action !== "create" && !isPositiveInt(raw["ruleId"])) issues.push("invalidRuleId");
  if (operation.action === "remove") return issues;

  issues.push(...scopeIssues(operation, context), ...timingIssues(raw));
  return [...new Set(issues)];
}

/* ------------------------------------------------------------ batch limits */

/**
 * A rule's remaining nonpast owned cells as "variationId|date" - what an edit/remove clears.
 * Historical cells are archived ownership, never live, whatever their date.
 */
export function ownedNonpastReleaseCells(rule: ReleaseRule, today: string): string[] {
  return [
    ...new Set(
      rule.cells
        .filter((cell) => cell.status !== "historical" && cell.stayDate >= today)
        .map((cell) => `${cell.variationId}|${cell.stayDate}`),
    ),
  ];
}

export interface ReleaseBatchUsage {
  operations: number;
  /** Distinct affected nights. */
  nights: number;
  /** Distinct expanded variation/date cells. */
  cells: number;
  /** Edits/removes whose current ownership was not supplied: cleared scope unknown. */
  unknownRuleIds: number[];
}

/**
 * Distinct cells the batch affects:
 *  create -> its new scope (after the weekday filter);
 *  edit   -> the rule's nonpast owned cells (cleared) plus its new scope;
 *  remove -> the rule's nonpast owned cells.
 * Old ownership comes from the overrides list via ownedCellsOf, never from the
 * payload. All rooms expands to allVariationIds, as the backend does at
 * preview/save. The preview's counts stay authoritative.
 */
export function releaseBatchUsage(
  operations: ReleaseOperation[],
  allVariationIds: number[],
  ownedCellsOf: (ruleId: number) => string[] | undefined,
): ReleaseBatchUsage {
  const cells = new Set<string>();
  const unknownRuleIds: number[] = [];
  for (const operation of operations) {
    if (operation.action !== "create") {
      const owned = ownedCellsOf(operation.ruleId);
      if (owned) owned.forEach((cell) => cells.add(cell));
      else unknownRuleIds.push(operation.ruleId);
    }
    if (operation.action !== "remove") {
      const ids = operation.allRooms ? allVariationIds : (operation.variationIds ?? []);
      const nights = expandReleaseNights(operation);
      for (const id of new Set(ids)) for (const iso of nights) cells.add(`${id}|${iso}`);
    }
  }
  const nights = new Set([...cells].map((cell) => cell.slice(cell.indexOf("|") + 1)));
  return { operations: operations.length, nights: nights.size, cells: cells.size, unknownRuleIds };
}

export interface ReleaseBatchCheck {
  ok: boolean;
  issues: ReleaseIssue[];
  usage: ReleaseBatchUsage;
}

/** Every operation plus the batch-wide limits (1-100 operations, 366 nights, 10,000 cells). */
export function validateReleaseBatch(
  operations: ReleaseOperation[],
  context: ReleaseValidationContext & {
    allVariationIds: number[];
    ownedCellsOf: (ruleId: number) => string[] | undefined;
  },
): ReleaseBatchCheck {
  const issues: ReleaseIssue[] = operations.flatMap((operation, operationIndex) =>
    validateReleaseOperation(operation, context).map((code) => ({ code, operationIndex })),
  );
  if (operations.length === 0) issues.push({ code: "noOperations" });
  if (operations.length > RELEASE_LIMITS.operations) issues.push({ code: "tooManyOperations" });

  const usage = releaseBatchUsage(operations, context.allVariationIds, context.ownedCellsOf);
  if (usage.nights > RELEASE_LIMITS.nights) issues.push({ code: "tooManyNights" });
  if (usage.cells > RELEASE_LIMITS.cells) issues.push({ code: "tooManyCells" });
  return { ok: issues.length === 0, issues, usage };
}
