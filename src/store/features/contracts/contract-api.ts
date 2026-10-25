import type {
  BookingType as ApiBookingType,
  ContractChildPricing,
  ContractRestriction,
  ContractRestrictionInput,
  CreateHotelContractBody,
  PricingModel as ApiPricingModel,
  SupplierHotelContract,
  UpdateHotelContractBody,
} from "@/api/modules/hotel-contract/types";
import { toAmount } from "./contract-payload";
import {
  CHILD_RULES,
  CONTRACT_NAME_MAX,
  WEEKDAY_NUMBER,
  WEEKDAYS,
  type BookingType,
  type ChildRules,
  type ContractDraftState,
  type PricingModel,
  type RestrictionRule,
} from "./types";

const bookingToApi: Record<BookingType, ApiBookingType> = {
  allotment: "allotment_block",
  on_request: "on_request",
};

const pricingToApi: Record<PricingModel, ApiPricingModel> = {
  base_supplements: "base_plus_supplements",
  fixed_price: "fixed_per_room",
};

export const basicsReady = ({ basics }: ContractDraftState) =>
  basics.hotelId !== null &&
  basics.name.trim() !== "" &&
  basics.name.trim().length <= CONTRACT_NAME_MAX &&
  basics.startDate !== "" &&
  basics.endDate !== "" &&
  basics.endDate > basics.startDate &&
  basics.currency !== null;

export function toCreateContractBody(draft: ContractDraftState): CreateHotelContractBody {
  const { basics } = draft;
  return {
    hotelId: basics.hotelId!,
    name: basics.name.trim(),
    startDate: basics.startDate,
    endDate: basics.endDate,
    currency: basics.currency!,
    bookingType: bookingToApi[basics.bookingType],
    pricingModel: pricingToApi[draft.pricingModel],
    childPricing: toChildPricing(draft),
    ...(draft.restrictions.enabled && draft.restrictions.rules.length > 0
      ? { restrictions: toRestrictions(draft).map(({ isActive: _isActive, ...rule }) => rule) }
      : {}),
  };
}

export const hasInactiveRestrictions = ({ restrictions }: ContractDraftState) =>
  restrictions.enabled && restrictions.rules.some((rule) => !rule.active);

const MUTABLE_FIELDS = ["name", "startDate", "endDate", "currency", "bookingType"] as const;

type MutableField = (typeof MUTABLE_FIELDS)[number];

export function changedContractFields(
  draft: ContractDraftState,
  contract: SupplierHotelContract,
): MutableField[] {
  const next = toCreateContractBody(draft);
  return MUTABLE_FIELDS.filter((field) => next[field] !== contract[field]);
}

export function toUpdateContractBody(
  draft: ContractDraftState,
  contract: SupplierHotelContract,
): UpdateHotelContractBody | null {
  const next = toCreateContractBody(draft);
  const fields = changedContractFields(draft, contract);
  const children = childPricingChanged(draft, contract);
  const restrictions = restrictionsChanged(draft, contract);
  if (fields.length === 0 && !children && !restrictions) return null;
  return fields.reduce<UpdateHotelContractBody>(
    (body, field) => ({ ...body, [field]: next[field] }),
    {
      expectedVersion: contract.version,
      ...(children ? { childPricing: next.childPricing } : {}),
      ...(restrictions ? { restrictions: toRestrictions(draft) } : {}),
    },
  );
}

export function contractDifferences(
  before: SupplierHotelContract,
  after: SupplierHotelContract,
): MutableField[] {
  return MUTABLE_FIELDS.filter((field) => before[field] !== after[field]);
}

export function draftFromContract(contract: SupplierHotelContract) {
  return {
    basics: {
      hotelId: contract.hotelId,
      name: contract.name,
      startDate: contract.startDate.slice(0, 10),
      endDate: contract.endDate.slice(0, 10),
      currency: contract.currency.toUpperCase(),
      bookingType: (contract.bookingType === "on_request"
        ? "on_request"
        : "allotment") as BookingType,
    },
    pricingModel: (contract.pricingModel === "fixed_per_room"
      ? "fixed_price"
      : "base_supplements") as PricingModel,
    ...(contract.childPricing ? { children: childrenFromContract(contract.childPricing) } : {}),
    restrictions: restrictionsFromContract(contract.restrictions ?? []),
  };
}

export const sameSavedBasics = (draft: ContractDraftState, contract: SupplierHotelContract) =>
  basicsReady(draft) && changedContractFields(draft, contract).length === 0;

export const hasRoomPricing = (contract: SupplierHotelContract) => contract.weekPricing !== null;

export function mergeLatestBasics(
  draft: ContractDraftState,
  before: SupplierHotelContract,
  latest: SupplierHotelContract,
): Partial<ContractDraftState["basics"]> {
  const original = draftFromContract(before).basics;
  const incoming = draftFromContract(latest).basics;
  const current = { ...draft.basics, name: draft.basics.name.trim() };
  return MUTABLE_FIELDS.reduce<Partial<ContractDraftState["basics"]>>(
    (merged, field) =>
      current[field] === original[field] && original[field] !== incoming[field]
        ? { ...merged, [field]: incoming[field] }
        : merged,
    {},
  );
}

export function toChildPricing({ children }: ContractDraftState): ContractChildPricing {
  const category = (key: (typeof CHILD_RULES)[number]) => ({
    from: Number(children[key].ageFrom),
    to: Number(children[key].ageTo),
    price: toAmount(children[key].price) ?? 0,
  });
  return {
    sharing_parents: category("sharing_parents"),
    shared_bed: category("shared_bed"),
    extra_bed: category("extra_bed"),
  };
}

export function childrenFromContract(pricing: ContractChildPricing): ChildRules {
  const rule = (key: (typeof CHILD_RULES)[number]) => ({
    ageFrom: String(pricing[key].from),
    ageTo: String(pricing[key].to),
    price: String(pricing[key].price),
  });
  return {
    sharing_parents: rule("sharing_parents"),
    shared_bed: rule("shared_bed"),
    extra_bed: rule("extra_bed"),
  };
}

export function childPricingChanged(draft: ContractDraftState, contract: SupplierHotelContract) {
  const saved = contract.childPricing;
  if (!saved) return true;
  const next = toChildPricing(draft);
  return CHILD_RULES.some(
    (key) =>
      next[key].from !== saved[key].from ||
      next[key].to !== saved[key].to ||
      next[key].price !== Number(saved[key].price),
  );
}

export const sameSavedDraft = (draft: ContractDraftState, contract: SupplierHotelContract) =>
  sameSavedBasics(draft, contract) &&
  !childPricingChanged(draft, contract) &&
  !restrictionsChanged(draft, contract);

const toDays = (numbers: number[]) =>
  WEEKDAYS.filter((day) => numbers.includes(WEEKDAY_NUMBER[day]));

export function toRestrictions({ restrictions }: ContractDraftState): ContractRestrictionInput[] {
  if (!restrictions.enabled) return [];
  return restrictions.rules.map((rule) => ({
    roomId: rule.roomId,
    appliesFrom: rule.startDate,
    appliesTo: rule.endDate,
    minNights: Number(rule.minNights),
    appliesOn: rule.appliesOn === "weekend_only" ? "weekend_days" : "every_day",
    restrictedCheckinDays: rule.closedCheckIn.map((day) => WEEKDAY_NUMBER[day]),
    restrictedCheckoutDays: rule.closedCheckOut.map((day) => WEEKDAY_NUMBER[day]),
    isActive: rule.active,
  }));
}

export function restrictionsFromContract(saved: ContractRestriction[]) {
  const rules: RestrictionRule[] = saved.map((item) => ({
    id: `saved-${item.id}`,
    roomId: item.roomId,
    startDate: item.appliesFrom.slice(0, 10),
    endDate: item.appliesTo.slice(0, 10),
    minNights: String(item.minNights),
    appliesOn: item.appliesOn === "weekend_days" ? "weekend_only" : "every_day",
    closedCheckIn: toDays(item.restrictedCheckinDays ?? []),
    closedCheckOut: toDays(item.restrictedCheckoutDays ?? []),
    active: item.isActive,
  }));
  return { enabled: rules.length > 0, rules };
}

const restrictionKey = (item: ContractRestrictionInput) =>
  [
    item.roomId ?? "all",
    item.appliesFrom.slice(0, 10),
    item.appliesTo.slice(0, 10),
    item.minNights,
    item.appliesOn,
    [...item.restrictedCheckinDays].sort().join("."),
    [...item.restrictedCheckoutDays].sort().join("."),
    item.isActive,
  ].join("|");

export function restrictionsChanged(draft: ContractDraftState, contract: SupplierHotelContract) {
  const next = toRestrictions(draft).map(restrictionKey);
  const saved = (contract.restrictions ?? []).map(restrictionKey);
  return next.length !== saved.length || next.some((key, index) => key !== saved[index]);
}
