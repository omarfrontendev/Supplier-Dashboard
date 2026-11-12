import type {
  BookingType as ApiBookingType,
  ContractCancellationCharge,
  ContractCancellationPolicy,
  ContractBasePricing,
  ContractChildPricing,
  ContractFixedPricing,
  ContractMealPricing,
  ContractOnRequestSettings,
  ContractPricing,
  ContractPricingResponse,
  ContractRate,
  ContractReleasePolicy,
  ContractRestriction,
  ContractRestrictionInput,
  ContractSeason,
  ContractSeasonInput,
  ContractInventoryRules,
  ContractWeekPricing,
  CreateHotelContractBody,
  PricingModel as ApiPricingModel,
  SupplierHotelContract,
  UpdateHotelContractBody,
} from "@/api/modules/hotel-contract/types";
import { toAmount } from "./contract-payload";
import {
  CHILD_RULES,
  CONTRACT_NAME_MAX,
  ROOM_VIEWS,
  WEEKDAY_NUMBER,
  WEEKDAYS,
  type BookingType,
  type CancellationFee,
  type CancellationPolicy,
  type ChildRules,
  type ContractDraftState,
  type FixedPriceRoom,
  type InventoryDraft,
  type MealRules,
  type PricingModel,
  type ReleasePolicy,
  type RestrictionRule,
  type RoomView,
  type SeasonRule,
  type Weekday,
} from "./types";

const bookingToApi: Record<BookingType, ApiBookingType> = {
  allotment: "allotment_block",
  on_request: "on_request",
};

const pricingToApi: Record<PricingModel, ApiPricingModel> = {
  base_supplements: "base_plus_supplements",
  fixed_price: "fixed_per_room",
};

const weekdayToApi: Record<Weekday, string> = {
  sun: "sunday",
  mon: "monday",
  tue: "tuesday",
  wed: "wednesday",
  thu: "thursday",
  fri: "friday",
  sat: "saturday",
};

const weekdayFromApi = Object.fromEntries(
  Object.entries(weekdayToApi).map(([day, value]) => [value, day]),
) as Record<string, Weekday>;

const apiWeekPricing = (draft: ContractDraftState): ContractWeekPricing | null => {
  if (draft.weekPricing === "one_price") return { mode: "same_all_week" };
  if (draft.basics.weekendDays.length === 0) return null;
  return {
    mode: "weekday_weekend",
    weekendDays: draft.basics.weekendDays.map((day) => weekdayToApi[day]),
  };
};

const draftWeekPricing = (
  weekPricing: ContractWeekPricing | null | undefined,
): { weekPricing: ContractDraftState["weekPricing"]; weekendDays: Weekday[] } => ({
  weekPricing: weekPricing?.mode === "weekday_weekend" ? "weekday_weekend" : "one_price",
  weekendDays:
    weekPricing?.mode === "weekday_weekend"
      ? weekPricing.weekendDays.flatMap((day) => (weekdayFromApi[day] ? [weekdayFromApi[day]] : []))
      : [],
});

const apiRate = (weekday: string, weekend: string, split: boolean): ContractRate | null => {
  const weekdayAmount = toAmount(weekday);
  if (weekdayAmount === null) return null;
  if (!split) return { amount: weekdayAmount };
  const weekendAmount = toAmount(weekend);
  return weekendAmount === null ? null : { weekday: weekdayAmount, weekend: weekendAmount };
};

const draftRate = (rate: ContractRate | null | undefined): { weekday: string; weekend: string } => {
  if (!rate) return { weekday: "", weekend: "" };
  return "amount" in rate
    ? { weekday: String(rate.amount), weekend: "" }
    : { weekday: String(rate.weekday), weekend: String(rate.weekend) };
};

const apiMealPlans = (plans: MealRules): ContractMealPricing[] | null => {
  const result: ContractMealPricing[] = [];
  for (const [type, plan] of Object.entries(plans)) {
    if (!plan.enabled || type === "room_only") continue;
    const price = toAmount(plan.price);
    if (price === null) return null;
    result.push({ type, pricingBasis: plan.basis, price });
  }
  return result;
};

const apiFixedMealPlans = (room: FixedPriceRoom): ContractMealPricing[] | null => {
  const result: ContractMealPricing[] = [];
  for (const meal of room.meals) {
    if (meal.plan === "room_only") continue;
    const price = toAmount(meal.price);
    if (price === null) return null;
    result.push({ type: meal.plan, pricingBasis: meal.basis, price });
  }
  return result;
};

export const hasChildPricing = ({ children }: ContractDraftState) =>
  CHILD_RULES.some((key) => {
    const rule = children[key];
    const defaults =
      key === "sharing_parents"
        ? { ageFrom: "0", ageTo: "5", price: "0" }
        : { ageFrom: "6", ageTo: "11", price: "" };
    return (
      rule.ageFrom !== defaults.ageFrom ||
      rule.ageTo !== defaults.ageTo ||
      rule.price.trim() !== defaults.price
    );
  });

export const hasPricingInput = (draft: ContractDraftState) =>
  draft.pricingModel === "base_supplements"
    ? draft.baseSupplements.baseRoomId !== null ||
      draft.baseSupplements.weekdayBaseCost.trim() !== "" ||
      draft.baseSupplements.weekendBaseCost.trim() !== "" ||
      draft.baseSupplements.rooms.length > 0 ||
      Object.entries(draft.meals).some(
        ([meal, rule]) => meal !== "room_only" && (rule.enabled || rule.price.trim() !== ""),
      )
    : draft.fixedRooms.length > 0;

const amountForComparison = (value: string) => toAmount(value) ?? value.trim();

const pricingDraftKey = (draft: ContractDraftState, includeWeekendDays = true) =>
  JSON.stringify({
    pricingModel: draft.pricingModel,
    weekPricing: draft.weekPricing,
    ...(includeWeekendDays ? { weekendDays: [...draft.basics.weekendDays].sort() } : {}),
    baseSupplements: {
      baseRoomId: draft.baseSupplements.baseRoomId,
      baseRoomView: draft.baseSupplements.baseRoomView,
      weekdayBaseCost: amountForComparison(draft.baseSupplements.weekdayBaseCost),
      weekendBaseCost: amountForComparison(draft.baseSupplements.weekendBaseCost),
      rooms: [...draft.baseSupplements.rooms]
        .map((room) => ({
          roomId: room.roomId,
          view: room.view ?? "no_view",
          supplement: amountForComparison(room.supplement),
        }))
        .sort((a, b) => `${a.roomId}:${a.view}`.localeCompare(`${b.roomId}:${b.view}`)),
    },
    fixedRooms: [...draft.fixedRooms]
      .map((room) => ({
        roomId: room.roomId,
        view: room.view,
        weekdayPrice: amountForComparison(room.weekdayPrice),
        weekendPrice: amountForComparison(room.weekendPrice),
        meals: [...room.meals]
          .map((meal) => ({
            plan: meal.plan,
            basis: meal.basis,
            price: amountForComparison(meal.price),
          }))
          .sort((a, b) => a.plan.localeCompare(b.plan)),
      }))
      .sort((a, b) => `${a.roomId}:${a.view}`.localeCompare(`${b.roomId}:${b.view}`)),
    meals: Object.fromEntries(
      Object.entries(draft.meals)
        .filter(([type, meal]) => type !== "room_only" && meal.enabled)
        .map(([type, meal]) => [
          type,
          { basis: meal.basis, price: amountForComparison(meal.price) },
        ])
        .sort(([a], [b]) => String(a).localeCompare(String(b))),
    ),
  });

export interface InventoryVariation {
  roomId: number;
  view: string;
}

const inventoryVariationToApi = ({ roomId, view }: InventoryVariation) => ({
  roomId,
  view,
});

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
      roomCaps.push({
        ...inventoryVariationToApi(variation),
        maxRoomsPerNight,
      });
    }
    const limitText = inventory.sharedOverbookingLimitPerNight;
    const overbookingLimitPerNight =
      inventory.soldOut === "overbooking" && limitText.trim() ? positiveInteger(limitText) : null;
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
      inventory.soldOut === "overbooking" && limitText.trim() ? positiveInteger(limitText) : null;
    if (
      inventory.soldOut === "overbooking" &&
      ((limitText.trim() && overbookingLimitPerNight === null) ||
        (requireOverbookingLimit && overbookingLimitPerNight === null))
    ) {
      return null;
    }
    rooms.push({
      ...inventoryVariationToApi(variation),
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

export function inventoryDraftFromRules(rules: ContractInventoryRules | null): InventoryDraft {
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
  // whenSoldOut / action can be missing on an incomplete saved configuration. The editor
  // then keeps its own form default (same as for a contract with no inventory rules); that
  // value is only sent once the user saves the inventory step.
  const savedAction = rules.whenSoldOut?.action;
  const soldOut =
    savedAction && savedAction in inventoryActionFromApi
      ? inventoryActionFromApi[savedAction]
      : initial.soldOut;
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
      sharedOverbookingLimitPerNight: String(rules.whenSoldOut?.overbookingLimitPerNight ?? ""),
    };
  }
  return {
    ...initial,
    model: "perRoom",
    rooms: Object.fromEntries(
      (rules.rooms ?? []).map((room) => [
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
      rules.whenSoldOut?.action ?? null,
      rules.whenSoldOut?.overbookingLimitPerNight ?? null,
    ]);
  }
  return JSON.stringify([
    rules.mode,
    [...(rules.rooms ?? [])]
      .map((room) => [
        room.roomId,
        room.view,
        room.roomsPerNight,
        room.overbookingLimitPerNight ?? null,
      ])
      .sort(([aRoom, aView], [bRoom, bView]) =>
        `${aRoom}:${aView}`.localeCompare(`${bRoom}:${bView}`),
      ),
    rules.whenSoldOut?.action ?? null,
  ]);
};

export const inventoryRulesChanged = (
  bookingType: BookingType,
  next: ContractInventoryRules | null | undefined,
  saved: ContractInventoryRules | null | undefined,
) => bookingType !== "on_request" && (!next || inventoryRuleKey(next) !== inventoryRuleKey(saved));

export const basicsReady = ({ basics }: ContractDraftState) =>
  basics.hotelId !== null &&
  basics.name.trim() !== "" &&
  basics.name.trim().length <= CONTRACT_NAME_MAX &&
  basics.startDate !== "" &&
  basics.endDate !== "" &&
  basics.endDate > basics.startDate &&
  basics.currency !== null;

export function pricingFromDraft(
  draft: ContractDraftState,
  baseRoomView?: string,
): ContractPricing | null {
  const weekPricing = apiWeekPricing(draft);
  if (!weekPricing) return null;

  if (draft.pricingModel === "base_supplements") {
    const { baseRoomId, weekdayBaseCost, weekendBaseCost, rooms } = draft.baseSupplements;
    if (baseRoomId === null || baseRoomView === undefined) return null;
    const rate = apiRate(weekdayBaseCost, weekendBaseCost, draft.weekPricing === "weekday_weekend");
    const mealPlans = apiMealPlans(draft.meals);
    if (!rate || !mealPlans) return null;

    const roomPairs: ContractBasePricing["rooms"] = [];
    for (const room of rooms) {
      const view = room.view ?? "no_view";
      // if (room.roomId === baseRoomId && view === baseRoomView) continue;
      const supplement = toAmount(room.supplement);
      if (supplement === null) return null;
      roomPairs.push({ roomId: room.roomId, view, supplement });
    }

    return {
      weekPricing,
      baseRoom: {
        roomId: baseRoomId,
        view: baseRoomView,
        rate,
      },
      rooms: roomPairs,
      mealPlans,
    };
  }

  if (draft.fixedRooms.length === 0) return null;
  const rooms: ContractFixedPricing["rooms"] = [];
  for (const room of draft.fixedRooms) {
    const rate = apiRate(
      room.weekdayPrice,
      room.weekendPrice,
      draft.weekPricing === "weekday_weekend",
    );
    const mealPlans = apiFixedMealPlans(room);
    if (!rate || !mealPlans) return null;
    rooms.push({ roomId: room.roomId, view: room.view, rate, mealPlans });
  }
  return { weekPricing, rooms };
}

const apiOnRequestSettings = (draft: ContractDraftState): ContractOnRequestSettings | null => {
  const usesOnRequest =
    draft.basics.bookingType === "on_request" ||
    (draft.policies.enabled && draft.policies.release?.afterRelease === "on_request");
  if (!usesOnRequest) return null;
  const slaMinutes = toAmount(draft.basics.slaMinutes);
  if (slaMinutes === null || !Number.isInteger(slaMinutes)) return null;
  return {
    slaMinutes,
    expiryAction:
      draft.basics.slaExpiryAction === "escalate" ? "escalate_to_hoteliana" : "auto_reject",
  };
};

const apiReleasePolicy = (policy: ReleasePolicy | null): ContractReleasePolicy | null =>
  policy
    ? {
        type: policy.period === "same_day" ? "same_day" : "number_of_days",
        ...(policy.period === "days" ? { daysBeforeCheckIn: Number(policy.days) } : {}),
        releaseTime: policy.time,
        afterReleaseAction: policy.afterRelease,
      }
    : null;

const draftReleasePolicy = (
  policy: ContractReleasePolicy | null | undefined,
): ReleasePolicy | null =>
  policy
    ? {
        period: policy.type === "same_day" ? "same_day" : "days",
        days: policy.type === "number_of_days" ? String(policy.daysBeforeCheckIn ?? "") : "",
        time: policy.releaseTime,
        afterRelease: policy.afterReleaseAction,
      }
    : null;

const roomViewFromApi = (view: string | null | undefined): RoomView =>
  view && ROOM_VIEWS.includes(view as RoomView) ? (view as RoomView) : "no_view";

const mealRulesFromApi = (plans: ContractPricingResponse["mealPlans"]): MealRules => {
  const meals: MealRules = {
    room_only: { enabled: true, price: "0", basis: "per_room" },
  };
  for (const plan of plans ?? []) {
    if (
      plan.type === "room_only" ||
      (plan.pricingBasis !== "per_person" && plan.pricingBasis !== "per_room") ||
      plan.price === null
    ) {
      continue;
    }
    meals[plan.type] = {
      enabled: true,
      price: String(plan.price),
      basis: plan.pricingBasis,
    };
  }
  return meals;
};

const isContractWeekPricing = (value: unknown): value is ContractWeekPricing => {
  if (typeof value !== "object" || value === null || !("mode" in value)) return false;
  const mode = value.mode;
  return (
    mode === "same_all_week" ||
    (mode === "weekday_weekend" &&
      "weekendDays" in value &&
      Array.isArray(value.weekendDays) &&
      value.weekendDays.every((day) => typeof day === "string"))
  );
};

function pricingFieldsFromContract(contract: SupplierHotelContract) {
  const pricing = contract.pricing;
  const pricingModel: PricingModel =
    contract.pricingModel === "fixed_per_room" ? "fixed_price" : "base_supplements";
  const weekPricingValue =
    pricing?.weekPricing ??
    (isContractWeekPricing(contract.weekPricing) ? contract.weekPricing : undefined);
  const { weekPricing, weekendDays } = draftWeekPricing(weekPricingValue);

  if (pricingModel === "base_supplements") {
    const baseRoom = pricing?.baseRoom;
    const baseRate = draftRate(baseRoom?.rate);
    return {
      pricingModel,
      weekPricing,
      weekendDays,
      baseSupplements: {
        baseRoomId: baseRoom?.roomId ?? null,
        baseRoomView: baseRoom ? roomViewFromApi(baseRoom.view) : null,
        weekdayBaseCost: baseRate.weekday,
        weekendBaseCost: weekPricing === "weekday_weekend" ? baseRate.weekend : "",
        rooms: (pricing?.rooms ?? []).map((room) => ({
          roomId: room.roomId,
          view: roomViewFromApi(room.view),
          supplement: room.supplement === undefined ? "" : String(room.supplement),
        })),
      },
      fixedRooms: [],
      meals: mealRulesFromApi(pricing?.mealPlans),
    };
  }

  return {
    pricingModel,
    weekPricing,
    weekendDays,
    baseSupplements: {
      baseRoomId: null,
      baseRoomView: null,
      weekdayBaseCost: "",
      weekendBaseCost: "",
      rooms: [],
    },
    fixedRooms: (pricing?.rooms ?? []).map((room): FixedPriceRoom => {
      const rate = draftRate(room.rate);
      return {
        roomId: room.roomId,
        view: roomViewFromApi(room.view),
        meals: (room.mealPlans ?? [])
          .filter(
            (meal) =>
              meal.type !== "room_only" &&
              (meal.pricingBasis === "per_person" || meal.pricingBasis === "per_room") &&
              meal.price !== null,
          )
          .map((meal) => ({
            plan: meal.type,
            basis: meal.pricingBasis === "per_person" ? "per_person" : "per_room",
            price: String(meal.price),
          })),
        weekdayPrice: rate.weekday,
        weekendPrice: weekPricing === "weekday_weekend" ? rate.weekend : "",
      };
    }),
    meals: {},
  };
}

export function pricingChanged(
  draft: ContractDraftState,
  contract: SupplierHotelContract,
): boolean {
  const saved = pricingFieldsFromContract(contract);
  const savedDraft: ContractDraftState = {
    ...draft,
    basics: { ...draft.basics, weekendDays: saved.weekendDays },
    pricingModel: saved.pricingModel,
    weekPricing: saved.weekPricing,
    baseSupplements: saved.baseSupplements,
    fixedRooms: saved.fixedRooms,
    meals: saved.meals,
  };
  return pricingDraftKey(draft) !== pricingDraftKey(savedDraft);
}

const requestSettingsChanged = (draft: ContractDraftState, contract: SupplierHotelContract) =>
  JSON.stringify(apiOnRequestSettings(draft)) !==
  JSON.stringify(contract.onRequestSettings ?? null);

export function releasePolicyChanged(draft: ContractDraftState, contract: SupplierHotelContract) {
  const next = apiReleasePolicy(draft.policies.enabled ? draft.policies.release : null);
  return JSON.stringify(next) !== JSON.stringify(contract.releasePolicy ?? null);
}

export function toCreateContractBody(
  draft: ContractDraftState,
  inventoryRules?: ContractInventoryRules | null,
  baseRoomView?: string,
): CreateHotelContractBody {

  const { basics } = draft;
  const pricing = pricingFromDraft(draft, baseRoomView);
  const childPricing = hasChildPricing(draft) ? toChildPricing(draft) : null;
  const onRequestSettings = apiOnRequestSettings(draft);
  const releasePolicy = apiReleasePolicy(draft.policies.enabled ? draft.policies.release : null);
  return {
    hotelId: basics.hotelId!,
    name: basics.name.trim(),
    startDate: basics.startDate,
    endDate: basics.endDate,
    currency: basics.currency!,
    bookingType: bookingToApi[basics.bookingType],
    pricingModel: pricingToApi[draft.pricingModel],
    ...(onRequestSettings ? { onRequestSettings } : {}),
    ...(basics.bookingType === "on_request" || !inventoryRules ? {} : { inventoryRules }),
    ...(childPricing ? { childPricing } : {}),
    restrictions: toRestrictions(draft).map(({ isActive: _isActive, ...rule }) => rule),
    ...(toCancellationPolicy(draft) ? { cancellationPolicy: toCancellationPolicy(draft)! } : {}),
    ...(releasePolicy ? { releasePolicy } : {}),
    ...(pricing ? { pricing } : {}),
    seasons: toSeasons(draft),
  };
}

export const hasInactiveRestrictions = ({ restrictions }: ContractDraftState) =>
  restrictions.enabled && restrictions.rules.some((rule) => !rule.active);

const MUTABLE_FIELDS = ["name", "startDate", "endDate", "currency", "bookingType"] as const;

type MutableField = (typeof MUTABLE_FIELDS)[number];

const EDITABLE_FIELDS = [...MUTABLE_FIELDS, "hotelId", "pricingModel"] as const;

type EditableField = (typeof EDITABLE_FIELDS)[number];

export function changedContractFields(
  draft: ContractDraftState,
  contract: SupplierHotelContract,
): EditableField[] {
  const next = toCreateContractBody(draft);
  return EDITABLE_FIELDS.filter((field) => next[field] !== contract[field]);
}

export function toUpdateContractBody(
  draft: ContractDraftState,
  contract: SupplierHotelContract,
  inventoryRules?: ContractInventoryRules | null,
  baseRoomView?: string,
): UpdateHotelContractBody | null {
  const next = toCreateContractBody(draft, inventoryRules, baseRoomView);
  const fields = changedContractFields(draft, contract);
  const children = childPricingChanged(draft, contract);
  const restrictions = restrictionsChanged(draft, contract);
  const cancellation = cancellationChanged(draft, contract);
  const release = releasePolicyChanged(draft, contract);
  const onRequestSettings = requestSettingsChanged(draft, contract);
  const pricing =
    pricingChanged(draft, contract) &&
    next.pricing !== undefined &&
    contract.pricingStatus !== "incomplete";
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
    !release &&
    !onRequestSettings &&
    !pricing &&
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
      ...(children && next.childPricing ? { childPricing: next.childPricing } : {}),
      ...(restrictions ? { restrictions: toRestrictions(draft) } : {}),
      ...(cancellation ? { cancellationPolicy: toCancellationPolicy(draft) } : {}),
      ...(release
        ? {
            releasePolicy: apiReleasePolicy(draft.policies.enabled ? draft.policies.release : null),
          }
        : {}),
      ...(onRequestSettings ? { onRequestSettings: apiOnRequestSettings(draft) } : {}),
      ...(pricing && next.pricing ? { pricing: next.pricing } : {}),
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

export function draftFromContract(contract: SupplierHotelContract): ContractDraftState {
  const pricing = pricingFieldsFromContract(contract);
  const cancellation = cancellationFromContract(contract.cancellationPolicy ?? null);
  const release = draftReleasePolicy(contract.releasePolicy);
  const onRequestSettings = contract.onRequestSettings ?? null;
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
      weekendDays: pricing.weekendDays,
      slaMinutes: onRequestSettings ? String(onRequestSettings.slaMinutes) : "",
      slaExpiryAction:
        onRequestSettings?.expiryAction === "escalate_to_hoteliana" ? "escalate" : "auto_reject",
    },
    pricingModel: pricing.pricingModel,
    inventory: inventoryDraftFromRules(contract.inventoryRules ?? null),
    weekPricing: pricing.weekPricing,
    baseSupplements: pricing.baseSupplements,
    fixedRooms: pricing.fixedRooms,
    roomVariationsEdited: false,
    children: childrenFromContract(contract.childPricing),
    meals: pricing.meals,
    policies: {
      enabled: Boolean(cancellation || release),
      cancellation,
      release,
    },
    restrictions: restrictionsFromContract(contract.restrictions ?? []),
    seasons: seasonsFromContract(contract.seasons ?? []),
  };
}

export const sameSavedBasics = (draft: ContractDraftState, contract: SupplierHotelContract) =>
  basicsReady(draft) && changedContractFields(draft, contract).length === 0;

export const hasRoomPricing = (contract: SupplierHotelContract) =>
  contract.pricing != null || contract.weekPricing !== null;

export function mergeLatestBasics(
  draft: ContractDraftState,
  before: SupplierHotelContract,
  latest: SupplierHotelContract,
): Partial<ContractDraftState["basics"]> {
  const original = draftFromContract(before).basics;
  const incoming = draftFromContract(latest).basics;
  const current = { ...draft.basics, name: draft.basics.name.trim() };
  const fields: (keyof ContractDraftState["basics"])[] = [
    "hotelId",
    "name",
    "startDate",
    "endDate",
    "currency",
    "weekendDays",
    "bookingType",
    "slaMinutes",
    "slaExpiryAction",
  ];
  return fields.reduce<Partial<ContractDraftState["basics"]>>(
    (merged, field) =>
      JSON.stringify(current[field]) === JSON.stringify(original[field]) &&
      JSON.stringify(original[field]) !== JSON.stringify(incoming[field])
        ? { ...merged, [field]: incoming[field] }
        : merged,
    {},
  );
}

export function mergeLatestDraft(
  draft: ContractDraftState,
  before: SupplierHotelContract,
  latest: SupplierHotelContract,
) {
  const original = draftFromContract(before);
  const incoming = draftFromContract(latest);
  const merged = {
    ...incoming,
    basics: { ...incoming.basics, ...mergeLatestBasics(draft, before, latest) },
  };
  if (pricingDraftKey(draft, false) !== pricingDraftKey(original, false)) {
    merged.pricingModel = draft.pricingModel;
    merged.weekPricing = draft.weekPricing;
    merged.baseSupplements = draft.baseSupplements;
    merged.fixedRooms = draft.fixedRooms;
    merged.meals = draft.meals;
    merged.roomVariationsEdited = draft.roomVariationsEdited;
  }
  if (JSON.stringify(draft.inventory) !== JSON.stringify(original.inventory)) {
    merged.inventory = draft.inventory;
  }
  if (JSON.stringify(draft.children) !== JSON.stringify(original.children)) {
    merged.children = draft.children;
  }
  if (JSON.stringify(draft.meals) !== JSON.stringify(original.meals)) {
    merged.meals = draft.meals;
  }
  if (JSON.stringify(draft.policies) !== JSON.stringify(original.policies)) {
    merged.policies = draft.policies;
  }
  if (JSON.stringify(draft.restrictions) !== JSON.stringify(original.restrictions)) {
    merged.restrictions = draft.restrictions;
  }
  if (JSON.stringify(draft.seasons) !== JSON.stringify(original.seasons)) {
    merged.seasons = draft.seasons;
  }
  return merged;
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

export function childrenFromContract(pricing: ContractChildPricing | null): ChildRules {
  if (!pricing) {
    return {
      sharing_parents: { ageFrom: "0", ageTo: "5", price: "0" },
      shared_bed: { ageFrom: "6", ageTo: "11", price: "" },
      extra_bed: { ageFrom: "6", ageTo: "11", price: "" },
    };
  }
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
  const next = hasChildPricing(draft) ? toChildPricing(draft) : null;
  return JSON.stringify(next) !== JSON.stringify(saved ?? null);
}

export const sameSavedDraft = (
  draft: ContractDraftState,
  contract: SupplierHotelContract,
  inventoryRules?: ContractInventoryRules | null,
  baseRoomView?: string,
) =>
  sameSavedBasics(draft, contract) &&
  !childPricingChanged(draft, contract) &&
  !restrictionsChanged(draft, contract) &&
  !cancellationChanged(draft, contract) &&
  !releasePolicyChanged(draft, contract) &&
  !requestSettingsChanged(draft, contract) &&
  !pricingChanged(draft, contract) &&
  !seasonsChanged(draft, contract) &&
  !inventoryRulesChanged(
    draft.basics.bookingType,
    inventoryRules,
    contract.inventoryRules ?? null,
  ) &&
  (baseRoomView === undefined ||
    pricingFromDraft(draft, baseRoomView) !== null ||
    !hasPricingInput(draft));

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
