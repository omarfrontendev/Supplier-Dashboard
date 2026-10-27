import { z } from "zod";

import { fill } from "@/lib/i18n";
import type { Dict } from "@/lib/dict";
import { toAmount } from "@/store/features/contracts/contract-payload";
import {
  CANCELLATION_MAX_AMOUNT,
  CANCELLATION_MAX_DAYS,
  CANCELLATION_MAX_NIGHTS,
  CHILD_MAX_AGE,
  CHILD_RULES,
  CONTRACT_NAME_MAX,
  MAX_CANCELLATION_TIERS,
  MEAL_PLANS,
  RESTRICTION_MAX_NIGHTS,
  SEASON_NAME_MAX,
  SLA_MAX_MINUTES,
  SLA_MIN_MINUTES,
  WEEKDAYS,
  type CancellationFee,
  type CancellationPolicy,
  type ChildRule,
  type ChildRules,
  type ContractDraftState,
  type ReleasePolicy,
  type RestrictionRule,
  type SeasonRule,
} from "@/store/features/contracts/types";

export type ContractSectionKey =
  | "basics"
  | "pricing"
  | "rooms"
  | "children"
  | "meals"
  | "restrictions"
  | "seasons"
  | "policies"
  | "booking";

export interface ContractIssue {
  section: ContractSectionKey;
  message: string;
}

type Messages = Dict["builder"]["form"]["v"];

const filled = (value: string) => toAmount(value) !== null;

const validAge = (value: string, max: number) => {
  const age = toAmount(value);
  return age !== null && Number.isInteger(age) && age >= 0 && age <= max;
};

const agesValid = (rule: ChildRule, max: number) =>
  validAge(rule.ageFrom, max) &&
  validAge(rule.ageTo, max) &&
  Number(rule.ageFrom) <= Number(rule.ageTo);

const rangesOverlap = (a: ChildRule, b: ChildRule) =>
  Number(a.ageFrom) <= Number(b.ageTo) && Number(b.ageFrom) <= Number(a.ageTo);

const wholeNumber = (value: string, min: number, max: number) => {
  const amount = toAmount(value);
  return amount !== null && Number.isInteger(amount) && amount >= min && amount <= max;
};

const twoDecimals = (value: string) => /^\d+(\.\d{1,2})?$/.test(value.trim());

const feeValid = ({ charge, value }: CancellationFee) => {
  if (charge === "free") return true;
  if (charge === "nights") return wholeNumber(value, 1, CANCELLATION_MAX_NIGHTS);
  const amount = toAmount(value);
  if (amount === null || !twoDecimals(value) || amount <= 0) return false;
  return charge === "percent" ? amount <= 100 : amount <= CANCELLATION_MAX_AMOUNT;
};

export function cancellationIssues({ tiers, noShow }: CancellationPolicy, m: Messages): string[] {
  const issues: string[] = [];
  if (tiers.length === 0) issues.push(m.tiersEmpty);
  if (tiers.length > MAX_CANCELLATION_TIERS) {
    issues.push(fill(m.tiersMax, { max: MAX_CANCELLATION_TIERS }));
  }
  if (tiers.some((tier) => !wholeNumber(tier.days, 1, CANCELLATION_MAX_DAYS))) {
    issues.push(fill(m.tiersDays, { max: CANCELLATION_MAX_DAYS }));
  }
  if (tiers.some((tier) => !tier.charge)) issues.push(m.tiersCharge);
  if (tiers.some((tier) => tier.charge && !feeValid(tier))) {
    issues.push(fill(m.tiersValue, { nights: CANCELLATION_MAX_NIGHTS }));
  }
  const days = tiers.map((tier) => toAmount(tier.days));
  if (days.every((day) => day !== null) && days.some((day, i) => i > 0 && day! >= days[i - 1]!)) {
    issues.push(m.tiersOrder);
  }
  if (!noShow.charge) issues.push(m.noShowCharge);
  else if (!feeValid(noShow)) issues.push(fill(m.noShowValue, { nights: CANCELLATION_MAX_NIGHTS }));
  return issues;
}

export function releaseIssues(release: ReleasePolicy, m: Messages): string[] {
  const issues: string[] = [];
  if (release.period === "days" && !wholeNumber(release.days, 1, 365)) {
    issues.push(m.releaseDays);
  }
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(release.time)) issues.push(m.releaseTime);
  return issues;
}

const sameDays = (a: string[], b: string[]) =>
  a.length === b.length && a.every((day) => b.includes(day));

export function restrictionIssues(
  rule: RestrictionRule,
  term: { startDate: string; endDate: string },
  m: Messages,
  formatDay: (day: string) => string = (day) => day,
): string[] {
  const issues: string[] = [];
  if (!rule.startDate || !rule.endDate) {
    issues.push(m.restrictionDates);
  } else if (
    (term.startDate && rule.startDate < term.startDate) ||
    (term.endDate && rule.endDate > term.endDate)
  ) {
    issues.push(
      fill(m.restrictionOutside, {
        dates: `${formatDay(rule.startDate)} - ${formatDay(rule.endDate)}`,
        start: formatDay(term.startDate),
        end: formatDay(term.endDate),
      }),
    );
  }
  if (!wholeNumber(rule.minNights, 1, RESTRICTION_MAX_NIGHTS)) {
    issues.push(fill(m.restrictionMinNights, { max: RESTRICTION_MAX_NIGHTS }));
  } else if (
    Number(rule.minNights) === 1 &&
    rule.closedCheckIn.length === 0 &&
    rule.closedCheckOut.length === 0
  ) {
    issues.push(m.restrictionNoRule);
  }
  if (rule.closedCheckIn.length === WEEKDAYS.length) issues.push(m.restrictionAllInClosed);
  if (rule.closedCheckOut.length === WEEKDAYS.length) issues.push(m.restrictionAllOutClosed);
  return issues;
}

const daysCross = (a: RestrictionRule, b: RestrictionRule) =>
  a.appliesOn === "every_day" || b.appliesOn === "every_day" || a.appliesOn === b.appliesOn;

export function conflictingRestriction(
  rule: RestrictionRule,
  others: RestrictionRule[],
): { rule: RestrictionRule; kind: "duplicate" | "minStay" } | null {
  if (!rule.active || !rule.startDate || !rule.endDate) return null;
  for (const other of others) {
    if (other.id === rule.id || !other.active || other.roomId !== rule.roomId) continue;
    if (other.startDate > rule.endDate || rule.startDate > other.endDate) continue;
    if (!daysCross(rule, other)) continue;
    const identical =
      other.startDate === rule.startDate &&
      other.endDate === rule.endDate &&
      other.appliesOn === rule.appliesOn &&
      Number(other.minNights) === Number(rule.minNights) &&
      sameDays(other.closedCheckIn, rule.closedCheckIn) &&
      sameDays(other.closedCheckOut, rule.closedCheckOut);
    if (identical) return { rule: other, kind: "duplicate" };
    const minRule = (value: string) => Number(value) > 1;
    if (minRule(rule.minNights) && minRule(other.minNights) && Number(rule.minNights) !== Number(other.minNights)) {
      return { rule: other, kind: "minStay" };
    }
  }
  return null;
}

export function restrictionConflict(
  rule: RestrictionRule,
  others: RestrictionRule[],
  m: Messages,
  describe: (rule: RestrictionRule) => string,
): string | null {
  const found = conflictingRestriction(rule, others);
  if (!found) return null;
  return fill(found.kind === "duplicate" ? m.restrictionDuplicate : m.restrictionMinConflict, {
    rule: describe(found.rule),
  });
}

export function restrictionsIssues(
  rules: RestrictionRule[],
  term: { startDate: string; endDate: string },
  m: Messages,
  describe: (rule: RestrictionRule) => string,
  formatDay?: (day: string) => string,
): string[] {
  const issues = new Set<string>();
  rules.forEach((rule, index) => {
    restrictionIssues(rule, term, m, formatDay).forEach((message) => issues.add(message));
    const conflict = restrictionConflict(rule, rules.slice(0, index), m, describe);
    if (conflict) issues.add(conflict);
  });
  return [...issues];
}

export function seasonOverlap(season: SeasonRule, others: SeasonRule[]) {
  if (!season.startDate || !season.endDate) return null;
  for (const other of others) {
    if (other.id === season.id) continue;
    if (other.startDate > season.endDate || season.startDate > other.endDate) continue;
    return {
      season: other,
      from: season.startDate > other.startDate ? season.startDate : other.startDate,
      to: season.endDate < other.endDate ? season.endDate : other.endDate,
    };
  }
  return null;
}

export function seasonIssues(
  season: SeasonRule,
  others: SeasonRule[],
  term: { startDate: string; endDate: string },
  m: Messages,
  formatDay: (day: string) => string = (day) => day,
): string[] {
  const issues: string[] = [];
  const name = season.name.trim();
  if (!name) issues.push(m.seasonName);
  else if (name.length > SEASON_NAME_MAX) issues.push(fill(m.seasonNameLong, { max: SEASON_NAME_MAX }));
  if (!season.startDate || !season.endDate || season.endDate < season.startDate) {
    issues.push(m.seasonDates);
  } else if (
    (term.startDate && season.startDate < term.startDate) ||
    (term.endDate && season.endDate > term.endDate)
  ) {
    issues.push(
      fill(m.seasonOutside, {
        start: formatDay(term.startDate),
        end: formatDay(term.endDate),
      }),
    );
  }
  const overlap = seasonOverlap(season, others);
  if (overlap) {
    issues.push(
      fill(m.seasonOverlap, {
        season: overlap.season.name,
        dates: `${formatDay(overlap.season.startDate)} – ${formatDay(overlap.season.endDate)}`,
        shared:
          overlap.from === overlap.to
            ? formatDay(overlap.from)
            : `${formatDay(overlap.from)} – ${formatDay(overlap.to)}`,
      }),
    );
  }
  if (
    Object.values(season.childPrices).some((price) => {
      if (!price.trim()) return false;
      const amount = toAmount(price);
      return amount === null || amount < 0 || amount > 10_000_000 || !/^\d+(\.\d{1,2})?$/.test(price.trim());
    })
  ) {
    issues.push(m.seasonChildPrice);
  }
  return issues;
}

export function seasonsIssues(
  seasons: SeasonRule[],
  term: { startDate: string; endDate: string },
  m: Messages,
  formatDay?: (day: string) => string,
): string[] {
  const issues = new Set<string>();
  seasons.forEach((season, index) =>
    seasonIssues(season, seasons.slice(0, index), term, m, formatDay).forEach((message) =>
      issues.add(`${season.name.trim() || "—"}: ${message}`),
    ),
  );
  return [...issues];
}

export function childIssues(
  children: ChildRules,
  m: Messages,
  maxAge: number = CHILD_MAX_AGE,
): string[] {
  const issues: string[] = [];
  if (CHILD_RULES.some((key) => !agesValid(children[key], maxAge))) {
    issues.push(fill(m.childAges, { max: maxAge }));
  }
  if (CHILD_RULES.some((key) => key !== "sharing_parents" && !filled(children[key].price))) {
    issues.push(m.childPrice);
  }
  const sharing = children.sharing_parents;
  const shared = children.shared_bed;
  if (agesValid(sharing, maxAge) && agesValid(shared, maxAge) && rangesOverlap(sharing, shared)) {
    issues.push(m.childOverlap);
  }
  return issues;
}

export const contractFinalSchema = (m: Messages, childMaxAge: number = CHILD_MAX_AGE) =>
  z.custom<ContractDraftState>().superRefine((draft, ctx) => {
    const issue = (section: ContractSectionKey, message: string) =>
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: [section], message });

    const { basics } = draft;
    if (!basics.hotelId) issue("basics", m.hotel);
    if (!basics.name.trim()) issue("basics", m.name);
    if (basics.name.trim().length > CONTRACT_NAME_MAX) {
      issue("basics", fill(m.nameTooLong, { max: CONTRACT_NAME_MAX }));
    }
    if (!basics.startDate) issue("basics", m.startDate);
    if (!basics.endDate) issue("basics", m.endDate);
    if (basics.startDate && basics.endDate && basics.endDate <= basics.startDate) {
      issue("basics", m.endAfterStart);
    }
    if (!basics.currency) issue("basics", m.currency);

    const split = draft.weekPricing === "weekday_weekend";
    if (split && basics.weekendDays.length === 0) issue("basics", m.weekend);

    if (basics.bookingType === "on_request") {
      const minutes = toAmount(basics.slaMinutes);
      if (
        minutes === null ||
        !Number.isInteger(minutes) ||
        minutes < SLA_MIN_MINUTES ||
        minutes > SLA_MAX_MINUTES
      ) {
        issue("booking", fill(m.sla, { min: SLA_MIN_MINUTES, max: SLA_MAX_MINUTES }));
      }
    }

    if (draft.pricingModel === "base_supplements") {
      const base = draft.baseSupplements;
      if (!base.baseRoomId) issue("pricing", m.baseRoom);
      if (!filled(base.weekdayBaseCost)) {
        issue("pricing", split ? m.weekdayBase : m.baseCost);
      }
      if (split && !filled(base.weekendBaseCost)) issue("pricing", m.weekendBase);
      if (base.rooms.some((room) => room.roomId !== base.baseRoomId && !filled(room.supplement))) {
        issue("rooms", m.supplement);
      }
      if (
        MEAL_PLANS.some(
          (meal) =>
            meal !== "room_only" && draft.meals[meal]?.enabled && !filled(draft.meals[meal].price),
        )
      ) {
        issue("meals", m.mealPrice);
      }
    } else {
      if (draft.fixedRooms.length === 0) issue("rooms", m.fixedRooms);
      if (
        draft.fixedRooms.some(
          (room) => !filled(room.weekdayPrice) || (split && !filled(room.weekendPrice)),
        )
      ) {
        issue("rooms", m.fixedPrice);
      }
    }

    childIssues(draft.children, m, childMaxAge).forEach((message) => issue("children", message));

    if (draft.restrictions?.enabled) {
      if (draft.restrictions.rules.length === 0) {
        issue("restrictions", m.restrictionsEmpty);
      }
      restrictionsIssues(draft.restrictions.rules, basics, m, (rule) => `${rule.startDate} - ${rule.endDate}`).forEach(
        (message) => issue("restrictions", message),
      );
    }

    seasonsIssues(draft.seasons, basics, m).forEach((message) => issue("seasons", message));

    if (draft.policies?.enabled) {
      const { cancellation, release } = draft.policies;
      if (!cancellation) {
        issue("policies", m.cancellationRequired);
      } else {
        cancellationIssues(cancellation, m).forEach((message) => issue("policies", message));
      }
      if (!release && basics.bookingType === "allotment") {
        issue("policies", m.releaseRequired);
      }
      if (release) releaseIssues(release, m).forEach((message) => issue("policies", message));
    }
  });

export function validateContract(
  draft: ContractDraftState,
  m: Messages,
  childMaxAge: number = CHILD_MAX_AGE,
): ContractIssue[] {
  const result = contractFinalSchema(m, childMaxAge).safeParse(draft);
  if (result.success) return [];
  return result.error.issues.map((issue) => ({
    section: issue.path[0] as ContractSectionKey,
    message: issue.message,
  }));
}

export function contractIssuesFor(
  draft: ContractDraftState,
  m: Messages,
  section: ContractSectionKey,
): string[] {
  return validateContract(draft, m)
    .filter((issue) => issue.section === section)
    .map((issue) => issue.message);
}
