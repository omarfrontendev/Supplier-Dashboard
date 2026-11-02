import type {
  BookingType as ApiBookingType,
  ContractCancellationCharge,
  ContractCancellationPolicy,
  ContractChildPricing,
  ContractRestriction,
  ContractRestrictionInput,
  ContractSeason,
  ContractSeasonInput,
  ContractInventoryRules,
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
  type CancellationFee,
  type CancellationPolicy,
  type ChildRules,
  type ContractDraftState,
  type InventoryDraft,
  type PricingModel,
  type RestrictionRule,
  type SeasonRule,
} from "./types";

const bookingToApi: Record<BookingType, ApiBookingType> = {
  allotment: "allotment_block",
  on_request: "on_request",
};

const pricingToApi: Record<PricingModel, ApiPricingModel> = {
  base_supplements: "base_plus_supplements",
  fixed_price: "fixed_per_room",
};

export interface InventoryVariation {
  roomId: number;
  view: string;
}

export const inventoryVariationKey = ({ roomId, view }: InventoryVariation) =>
  JSON.stringify([roomId, view]);

const inventoryActionToApi = {
  stop: "stop_sale",
  request: "on_request",
  overbooking: "controlled_overbooking",
} as const;

const inventoryActionFromApi = {
  stop_sale: "stop",
  on_request: "request",
  controlled_overbooking: "overbooking",
} as const;

const positiveInteger = (value: string) => {
  const parsed = Number(value);
  return value.trim() !== "" && Number.isInteger(parsed) && parsed >= 1 ? parsed : null;
};

export function toInventoryRules(
  inventory: InventoryDraft,
  variations: InventoryVariation[],
  requireOverbookingLimit = false,
): ContractInventoryRules | null {
  if (inventory.model === "free") return { mode: "free_sale" };

  const action = inventoryActionToApi[inventory.soldOut];
  if (inventory.model === "shared") {
    const roomsPerNight = positiveInteger(inventory.roomsPerNight);
    if (roomsPerNight === null) return null;
    const roomCaps: Array<{
      roomId: number;
      view: string;
      maxRoomsPerNight: number;
    }> = [];
    for (const variation of variations) {
      const value = inventory.roomCaps[inventoryVariationKey(variation)] ?? "";
      if (!value.trim()) continue;
      const maxRoomsPerNight = positiveInteger(value);
      if (maxRoomsPerNight === null) return null;
      roomCaps.push({ ...variation, maxRoomsPerNight });
    }
    const limitText = inventory.sharedOverbookingLimitPerNight;
    const overbookingLimitPerNight =
      inventory.soldOut === "overbooking" && limitText.trim()
        ? positiveInteger(limitText)
        : null;
    if (
      inventory.soldOut === "overbooking" &&
      ((limitText.trim() && overbookingLimitPerNight === null) ||
        (requireOverbookingLimit && overbookingLimitPerNight === null))
    ) {
      return null;
    }
    return {
      mode: "shared_pool",
      roomsPerNight,
      ...(roomCaps.length > 0 ? { roomCaps } : {}),
      whenSoldOut: {
        action,
        ...(overbookingLimitPerNight === null ? {} : { overbookingLimitPerNight }),
      },
    };
  }

  if (variations.length === 0) return null;

  const rooms: Array<{
    roomId: number;
    view: string;
    roomsPerNight: number;
    overbookingLimitPerNight?: number;
  }> = [];
  for (const variation of variations) {
    const rule = inventory.rooms[inventoryVariationKey(variation)];
    const roomsPerNight = positiveInteger(rule?.roomsPerNight ?? "");
    if (roomsPerNight === null) return null;
    const limitText = rule?.overbookingLimitPerNight ?? "";
    const overbookingLimitPerNight =
      inventory.soldOut === "overbooking" && limitText.trim()
        ? positiveInteger(limitText)
        : null;
    if (
      inventory.soldOut === "overbooking" &&
      ((limitText.trim() && overbookingLimitPerNight === null) ||
        (requireOverbookingLimit && overbookingLimitPerNight === null))
    ) {
      return null;
    }
    rooms.push({
      ...variation,
      roomsPerNight,
      ...(overbookingLimitPerNight === null ? {} : { overbookingLimitPerNight }),
    });
  }
  return {
    mode: "per_room_type",
    rooms,
    whenSoldOut: { action },
  };
}

export function inventoryDraftFromRules(
  rules: ContractInventoryRules | null,
): InventoryDraft {
  const initial: InventoryDraft = {
    model: "shared",
    roomsPerNight: "50",
    roomCaps: {},
    rooms: {},
    soldOut: "overbooking",
    sharedOverbookingLimitPerNight: "2",
  };
  if (!rules) return initial;
  if (rules.mode === "free_sale") return { ...initial, model: "free" };
  const soldOut = inventoryActionFromApi[rules.whenSoldOut.action];
  if (rules.mode === "shared_pool") {
    return {
      ...initial,
      model: "shared",
      roomsPerNight: String(rules.roomsPerNight),
      roomCaps: Object.fromEntries(
        (rules.roomCaps ?? []).map((cap) => [
          inventoryVariationKey(cap),
          String(cap.maxRoomsPerNight),
        ]),
      ),
      soldOut,
      sharedOverbookingLimitPerNight: String(
        rules.whenSoldOut.overbookingLimitPerNight ?? "",
      ),
    };
  }
  return {
    ...initial,
    model: "perRoom",
    rooms: Object.fromEntries(
      rules.rooms.map((room) => [
        inventoryVariationKey(room),
        {
          roomsPerNight: String(room.roomsPerNight),
          overbookingLimitPerNight: String(room.overbookingLimitPerNight ?? ""),
        },
      ]),
    ),
    soldOut,
  };
}

const inventoryRuleKey = (rules: ContractInventoryRules | null | undefined) => {
  if (!rules) return "";
  if (rules.mode === "free_sale") return "free_sale";
  if (rules.mode === "shared_pool") {
    return JSON.stringify([
      rules.mode,
      rules.roomsPerNight,
      [...(rules.roomCaps ?? [])]
        .map((cap) => [cap.roomId, cap.view, cap.maxRoomsPerNight])
        .sort(([aRoom, aView], [bRoom, bView]) =>
          `${aRoom}:${aView}`.localeCompare(`${bRoom}:${bView}`),
        ),
      rules.whenSoldOut.action,
      rules.whenSoldOut.overbookingLimitPerNight ?? null,
    ]);
  }
  return JSON.stringify([
    rules.mode,
    [...rules.rooms]
      .map((room) => [
        room.roomId,
        room.view,
        room.roomsPerNight,
        room.overbookingLimitPerNight ?? null,
      ])
      .sort(([aRoom, aView], [bRoom, bView]) =>
        `${aRoom}:${aView}`.localeCompare(`${bRoom}:${bView}`),
      ),
    rules.whenSoldOut.action,
  ]);
};

export const inventoryRulesChanged = (
  bookingType: BookingType,
  next: ContractInventoryRules | null | undefined,
  saved: ContractInventoryRules | null | undefined,
) =>
  bookingType !== "on_request" &&
  (!next || inventoryRuleKey(next) !== inventoryRuleKey(saved));

export const basicsReady = ({ basics }: ContractDraftState) =>
  basics.hotelId !== null &&
  basics.name.trim() !== "" &&
  basics.name.trim().length <= CONTRACT_NAME_MAX &&
  basics.startDate !== "" &&
  basics.endDate !== "" &&
  basics.endDate > basics.startDate &&
  basics.currency !== null;

export function toCreateContractBody(
  draft: ContractDraftState,
  inventoryRules?: ContractInventoryRules | null,
): CreateHotelContractBody {
  const { basics } = draft;
  return {
    hotelId: basics.hotelId!,
    name: basics.name.trim(),
    startDate: basics.startDate,
    endDate: basics.endDate,
    currency: basics.currency!,
    bookingType: bookingToApi[basics.bookingType],
    pricingModel: pricingToApi[draft.pricingModel],
    ...(basics.bookingType === "on_request" || !inventoryRules ? {} : { inventoryRules }),
    childPricing: toChildPricing(draft),
    ...(draft.restrictions.enabled && draft.restrictions.rules.length > 0
      ? { restrictions: toRestrictions(draft).map(({ isActive: _isActive, ...rule }) => rule) }
      : {}),
    ...(toCancellationPolicy(draft) ? { cancellationPolicy: toCancellationPolicy(draft)! } : {}),
    ...(draft.seasons.length > 0 ? { seasons: toSeasons(draft) } : {}),
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
  inventoryRules?: ContractInventoryRules | null,
): UpdateHotelContractBody | null {
  const next = toCreateContractBody(draft, inventoryRules);
  const fields = changedContractFields(draft, contract);
  const children = childPricingChanged(draft, contract);
  const restrictions = restrictionsChanged(draft, contract);
  const cancellation = cancellationChanged(draft, contract);
  const seasons = seasonsChanged(draft, contract);
  const inventory = inventoryRulesChanged(
    draft.basics.bookingType,
    inventoryRules,
    contract.inventoryRules ?? null,
  );
  if (
    fields.length === 0 &&
    !children &&
    !restrictions &&
    !cancellation &&
    !seasons &&
    !inventory
  ) {
    return null;
  }
  return fields.reduce<UpdateHotelContractBody>(
    (body, field) => ({ ...body, [field]: next[field] }),
    {
      expectedVersion: contract.version,
      ...(inventory && draft.basics.bookingType !== "on_request" && inventoryRules
        ? { inventoryRules }
        : {}),
      ...(children ? { childPricing: next.childPricing } : {}),
      ...(restrictions ? { restrictions: toRestrictions(draft) } : {}),
      ...(cancellation ? { cancellationPolicy: toCancellationPolicy(draft) } : {}),
      ...(seasons ? { seasons: toSeasons(draft) } : {}),
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
    inventory: inventoryDraftFromRules(contract.inventoryRules ?? null),
    ...(contract.childPricing ? { children: childrenFromContract(contract.childPricing) } : {}),
    restrictions: restrictionsFromContract(contract.restrictions ?? []),
    cancellation: cancellationFromContract(contract.cancellationPolicy ?? null),
    seasons: seasonsFromContract(contract.seasons ?? []),
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

export const sameSavedDraft = (
  draft: ContractDraftState,
  contract: SupplierHotelContract,
  inventoryRules?: ContractInventoryRules | null,
) =>
  sameSavedBasics(draft, contract) &&
  !childPricingChanged(draft, contract) &&
  !restrictionsChanged(draft, contract) &&
  !cancellationChanged(draft, contract) &&
  !seasonsChanged(draft, contract) &&
  !inventoryRulesChanged(
    draft.basics.bookingType,
    inventoryRules,
    contract.inventoryRules ?? null,
  );

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

const toCharge = ({ charge, value }: CancellationFee): ContractCancellationCharge =>
  charge === "free" || !charge ? { kind: "free" } : { kind: charge, value: toAmount(value) ?? 0 };

const fromCharge = (charge: ContractCancellationCharge): CancellationFee => ({
  charge: charge.kind,
  value: charge.kind === "free" || charge.value === undefined ? "" : String(Number(charge.value)),
});

const policyToApi = (policy: CancellationPolicy): ContractCancellationPolicy => ({
  tiers: policy.tiers.map((tier) => ({ daysBefore: Number(tier.days), charge: toCharge(tier) })),
  noShow: toCharge(policy.noShow),
});

export function toCancellationPolicy({
  policies,
}: ContractDraftState): ContractCancellationPolicy | null {
  if (!policies.enabled || !policies.cancellation) return null;
  return policyToApi(policies.cancellation);
}

export function cancellationFromContract(
  saved: ContractCancellationPolicy | null,
): CancellationPolicy | null {
  if (!saved) return null;
  return {
    tiers: [...saved.tiers]
      .sort((a, b) => b.daysBefore - a.daysBefore)
      .map((tier) => ({ days: String(tier.daysBefore), ...fromCharge(tier.charge) })),
    noShow: fromCharge(saved.noShow),
  };
}

const chargeKey = (charge: ContractCancellationCharge) =>
  `${charge.kind}:${charge.kind === "free" ? "" : Number(charge.value)}`;

const cancellationKey = (policy: ContractCancellationPolicy | null) =>
  policy
    ? [
        ...[...policy.tiers]
          .sort((a, b) => b.daysBefore - a.daysBefore)
          .map((tier) => `${tier.daysBefore}=${chargeKey(tier.charge)}`),
        `noShow=${chargeKey(policy.noShow)}`,
      ].join("|")
    : "none";

export const cancellationChanged = (draft: ContractDraftState, contract: SupplierHotelContract) =>
  cancellationKey(toCancellationPolicy(draft)) !==
  cancellationKey(contract.cancellationPolicy ?? null);

export function toSeasons({ seasons }: ContractDraftState): ContractSeasonInput[] {
  return seasons.map((season) => {
    const childPrices = Object.fromEntries(
      CHILD_RULES.filter((key) => toAmount(season.childPrices[key]) !== null).map((key) => [
        key,
        toAmount(season.childPrices[key])!,
      ]),
    );
    const pricing = {
      ...(season.keptPricing ?? {}),
      ...(Object.keys(childPrices).length > 0 ? { childPrices } : {}),
    };
    return {
      name: season.name.trim(),
      startDate: season.startDate,
      endDate: season.endDate,
      color: season.color.toUpperCase(),
      ...(Object.keys(pricing).length > 0 ? { pricing } : {}),
      ...(season.cancellation ? { cancellationPolicy: policyToApi(season.cancellation) } : {}),
    };
  });
}

export function seasonsFromContract(saved: ContractSeason[]): SeasonRule[] {
  return [...saved]
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .map((season) => {
      const baseRate = season.pricing?.baseRate ?? null;
      const rooms = season.pricing?.rooms ?? [];
      const kept = {
        ...(baseRate ? { baseRate } : {}),
        ...(rooms.length > 0 ? { rooms } : {}),
      };
      const prices = season.pricing?.childPrices ?? {};
      return {
        id: `saved-${season.id}`,
        name: season.name,
        startDate: season.startDate.slice(0, 10),
        endDate: season.endDate.slice(0, 10),
        color: season.color.toUpperCase(),
        childPrices: {
          sharing_parents:
            prices.sharing_parents === undefined ? "" : String(Number(prices.sharing_parents)),
          shared_bed: prices.shared_bed === undefined ? "" : String(Number(prices.shared_bed)),
          extra_bed: prices.extra_bed === undefined ? "" : String(Number(prices.extra_bed)),
        },
        cancellation: cancellationFromContract(season.cancellationPolicy),
        keptPricing: Object.keys(kept).length > 0 ? kept : null,
        issues: season.issues ?? [],
      };
    });
}

const seasonKey = (season: ContractSeasonInput) =>
  JSON.stringify([
    season.name.trim(),
    season.startDate.slice(0, 10),
    season.endDate.slice(0, 10),
    season.color.toUpperCase(),
    CHILD_RULES.map((key) => season.pricing?.childPrices?.[key] ?? null),
    cancellationKey(season.cancellationPolicy ?? null),
  ]);

export function seasonsChanged(draft: ContractDraftState, contract: SupplierHotelContract) {
  const next = toSeasons(draft).map(seasonKey).sort();
  const saved = seasonsFromContract(contract.seasons ?? [])
    .map((season) => toSeasons({ ...draft, seasons: [season] })[0]!)
    .map(seasonKey)
    .sort();
  return next.length !== saved.length || next.some((key, index) => key !== saved[index]);
}
