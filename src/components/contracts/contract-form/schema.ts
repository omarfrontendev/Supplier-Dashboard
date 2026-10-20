import { z } from "zod";

import { fill } from "@/lib/i18n";
import type { Dict } from "@/lib/dict";
import { toAmount } from "@/store/features/contracts/contract-payload";
import {
  CHILD_MAX_AGE,
  CHILD_RULES,
  MAX_CANCELLATION_TIERS,
  MEAL_PLANS,
  SLA_MAX_MINUTES,
  SLA_MIN_MINUTES,
  type CancellationTier,
  type ChildRule,
  type ChildRules,
  type ContractDraftState,
  type ReleasePolicy,
} from "@/store/features/contracts/types";

export type ContractSectionKey =
  "basics" | "pricing" | "rooms" | "children" | "meals" | "policies" | "booking";

export interface ContractIssue {
  section: ContractSectionKey;
  message: string;
}

type Messages = Dict["builder"]["form"]["v"];

const filled = (value: string) => toAmount(value) !== null;

const validAge = (value: string) => {
  const age = toAmount(value);
  return age !== null && Number.isInteger(age) && age >= 0 && age <= CHILD_MAX_AGE;
};

const agesValid = (rule: ChildRule) =>
  validAge(rule.ageFrom) && validAge(rule.ageTo) && Number(rule.ageFrom) <= Number(rule.ageTo);

const rangesOverlap = (a: ChildRule, b: ChildRule) =>
  Number(a.ageFrom) <= Number(b.ageTo) && Number(b.ageFrom) <= Number(a.ageTo);

const wholeNumber = (value: string, min: number, max: number) => {
  const amount = toAmount(value);
  return amount !== null && Number.isInteger(amount) && amount >= min && amount <= max;
};

export function cancellationIssues(tiers: CancellationTier[], m: Messages): string[] {
  const issues: string[] = [];
  if (tiers.length === 0) issues.push(m.tiersEmpty);
  if (tiers.length > MAX_CANCELLATION_TIERS) {
    issues.push(fill(m.tiersMax, { max: MAX_CANCELLATION_TIERS }));
  }
  if (tiers.some((tier) => !wholeNumber(tier.days, 0, 365))) issues.push(m.tiersDays);
  if (tiers.some((tier) => !tier.charge)) issues.push(m.tiersCharge);
  const badValue = tiers.some((tier) => {
    if (tier.charge === "nights") return !wholeNumber(tier.value, 1, 30);
    if (tier.charge === "percent") return !wholeNumber(tier.value, 1, 100);
    if (tier.charge === "fixed") return (toAmount(tier.value) ?? 0) <= 0;
    return false;
  });
  if (badValue) issues.push(m.tiersValue);
  const days = tiers.map((tier) => toAmount(tier.days));
  if (days.every((day) => day !== null) && days.some((day, i) => i > 0 && day! >= days[i - 1]!)) {
    issues.push(m.tiersOrder);
  }
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

export function childIssues(children: ChildRules, m: Messages): string[] {
  const issues: string[] = [];
  const enabled = CHILD_RULES.filter((key) => children[key].enabled);
  if (enabled.some((key) => !agesValid(children[key]))) {
    issues.push(fill(m.childAges, { max: CHILD_MAX_AGE }));
  }
  if (enabled.some((key) => key !== "sharing_parents" && !filled(children[key].price))) {
    issues.push(m.childPrice);
  }
  const sharing = children.sharing_parents;
  const shared = children.shared_bed;
  if (
    sharing.enabled &&
    shared.enabled &&
    agesValid(sharing) &&
    agesValid(shared) &&
    rangesOverlap(sharing, shared)
  ) {
    issues.push(m.childOverlap);
  }
  return issues;
}

export const contractFinalSchema = (m: Messages) =>
  z.custom<ContractDraftState>().superRefine((draft, ctx) => {
    const issue = (section: ContractSectionKey, message: string) =>
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: [section], message });

    const { basics } = draft;
    if (!basics.hotelId) issue("basics", m.hotel);
    if (!basics.name.trim()) issue("basics", m.name);
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
            meal !== "room_only" && draft.meals[meal].enabled && !filled(draft.meals[meal].price),
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

    childIssues(draft.children, m).forEach((message) => issue("children", message));

    if (draft.policies.enabled) {
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

export function validateContract(draft: ContractDraftState, m: Messages): ContractIssue[] {
  const result = contractFinalSchema(m).safeParse(draft);
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
