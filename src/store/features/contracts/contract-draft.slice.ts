import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type {
  CancellationPolicy,
  ChildRule,
  ChildRuleKey,
  ChildRules,
  MealBasis,
  MealPlan,
  MealRule,
  ContractBasics,
  ContractDraftState,
  ContractRestrictions,
  FixedPriceRoom,
  InventoryDraft,
  PricingModel,
  ReleasePolicy,
  RestrictionRule,
  RoomView,
  SeasonRule,
  WeekPricing,
} from "./types";

const emptyBaseSupplements = (): ContractDraftState["baseSupplements"] => ({
  baseRoomId: null,
  weekdayBaseCost: "",
  weekendBaseCost: "",
  rooms: [],
});

const emptyMeals = (): ContractDraftState["meals"] => ({});

const emptyMealRule = (meal: MealPlan): MealRule => ({
  enabled: meal === "room_only",
  price: meal === "room_only" ? "0" : "",
  basis: meal === "room_only" ? "per_room" : "per_person",
});

const initialState: ContractDraftState = {
  basics: {
    hotelId: null,
    name: "",
    startDate: "",
    endDate: "",
    currency: null,
    weekendDays: [],
    bookingType: "allotment",
    slaMinutes: "",
    slaExpiryAction: "auto_reject",
  },
  pricingModel: "base_supplements",
  inventory: {
    model: "shared",
    roomsPerNight: "50",
    roomCaps: {},
    rooms: {},
    soldOut: "overbooking",
    sharedOverbookingLimitPerNight: "2",
  },
  weekPricing: "weekday_weekend",
  baseSupplements: emptyBaseSupplements(),
  fixedRooms: [],
  roomVariationsEdited: false,
  children: {
    sharing_parents: { ageFrom: "0", ageTo: "5", price: "0" },
    shared_bed: { ageFrom: "6", ageTo: "11", price: "" },
    extra_bed: { ageFrom: "6", ageTo: "11", price: "" },
  },
  meals: emptyMeals(),
  policies: { enabled: true, cancellation: null, release: null },
  restrictions: { enabled: true, rules: [] },
  seasons: [],
};

export const sameFixedOffer = (
  a: Pick<FixedPriceRoom, "roomId" | "view">,
  b: Pick<FixedPriceRoom, "roomId" | "view">,
) => a.roomId === b.roomId && a.view === b.view;

export const contractDraftSlice = createSlice({
  name: "contractDraft",
  initialState,
  reducers: {
    resetDraft: (_state, action: PayloadAction<Partial<ContractBasics> | undefined>) => ({
      ...initialState,
      basics: { ...initialState.basics, ...action.payload },
    }),

    loadContract: (
      _state,
      action: PayloadAction<
        {
          basics: Partial<ContractBasics>;
          pricingModel: PricingModel;
        } & Partial<Omit<ContractDraftState, "basics" | "pricingModel">>
      >,
    ) => ({
      ...initialState,
      basics: { ...initialState.basics, ...action.payload.basics },
      pricingModel: action.payload.pricingModel,
      inventory: action.payload.inventory ?? initialState.inventory,
      weekPricing: action.payload.weekPricing ?? initialState.weekPricing,
      baseSupplements: action.payload.baseSupplements ?? emptyBaseSupplements(),
      fixedRooms: action.payload.fixedRooms ?? [],
      roomVariationsEdited: action.payload.roomVariationsEdited ?? false,
      children: action.payload.children ?? initialState.children,
      meals: action.payload.meals ?? emptyMeals(),
      policies: action.payload.policies ?? initialState.policies,
      restrictions: action.payload.restrictions ?? initialState.restrictions,
      seasons: action.payload.seasons ?? [],
    }),

    saveSeason: (state, action: PayloadAction<SeasonRule>) => {
      const index = state.seasons.findIndex((season) => season.id === action.payload.id);
      if (index === -1) state.seasons.push(action.payload);
      else state.seasons[index] = action.payload;
      state.seasons.sort((a, b) => a.startDate.localeCompare(b.startDate));
    },

    removeSeason: (state, action: PayloadAction<string>) => {
      state.seasons = state.seasons.filter((season) => season.id !== action.payload);
    },

    replaceSeasons: (state, action: PayloadAction<SeasonRule[]>) => {
      state.seasons = action.payload;
    },

    replaceRestrictions: (state, action: PayloadAction<ContractRestrictions>) => {
      state.restrictions = action.payload;
    },

    replaceCancellation: (state, action: PayloadAction<CancellationPolicy | null>) => {
      state.policies.cancellation = action.payload;
      if (action.payload) state.policies.enabled = true;
    },

    replaceChildren: (state, action: PayloadAction<ChildRules>) => {
      state.children = action.payload;
    },

    updateBasics: (state, action: PayloadAction<Partial<ContractBasics>>) => {
      const next = { ...state.basics, ...action.payload };
      if (next.hotelId !== state.basics.hotelId) {
        state.baseSupplements = emptyBaseSupplements();
        state.fixedRooms = [];
        state.roomVariationsEdited = true;
        state.restrictions.rules.forEach((rule) => {
          rule.roomId = null;
        });
      }
      if (next.bookingType === "allotment") {
        next.slaMinutes = "";
        next.slaExpiryAction = "auto_reject";
      }
      state.basics = next;
    },

    setPricingModel: (state, action: PayloadAction<PricingModel>) => {
      if (state.pricingModel === action.payload) return;
      state.pricingModel = action.payload;
      state.baseSupplements = emptyBaseSupplements();
      state.fixedRooms = [];
      state.roomVariationsEdited = true;
      state.meals = emptyMeals();
    },

    setWeekPricing: (state, action: PayloadAction<WeekPricing>) => {
      state.weekPricing = action.payload;
      if (action.payload === "one_price") {
        state.baseSupplements.weekendBaseCost = "";
        state.fixedRooms.forEach((room) => {
          room.weekendPrice = "";
        });
      }
    },

    updateInventory: (state, action: PayloadAction<Partial<InventoryDraft>>) => {
      state.inventory = { ...state.inventory, ...action.payload };
    },

    setInventoryRoomCap: (state, action: PayloadAction<{ key: string; value: string }>) => {
      state.inventory.roomCaps[action.payload.key] = action.payload.value;
    },

    setPerRoomInventory: (
      state,
      action: PayloadAction<{
        key: string;
        field: keyof InventoryDraft["rooms"][string];
        value: string;
      }>,
    ) => {
      const current = state.inventory.rooms[action.payload.key] ?? {
        roomsPerNight: "",
        overbookingLimitPerNight: "",
      };
      state.inventory.rooms[action.payload.key] = {
        ...current,
        [action.payload.field]: action.payload.value,
      };
    },

    setBaseRoom: (state, action: PayloadAction<number | null>) => {
      state.baseSupplements.baseRoomId = action.payload;
      state.roomVariationsEdited = true;
    },

    setBaseCost: (state, action: PayloadAction<{ day: "weekday" | "weekend"; value: string }>) => {
      if (action.payload.day === "weekday") {
        state.baseSupplements.weekdayBaseCost = action.payload.value;
      } else {
        state.baseSupplements.weekendBaseCost = action.payload.value;
      }
    },

    toggleSupplementRoom: (state, action: PayloadAction<number>) => {
      const base = state.baseSupplements;
      if (action.payload === base.baseRoomId) return;
      const index = base.rooms.findIndex((room) => room.roomId === action.payload);
      state.roomVariationsEdited = true;
      if (index >= 0) {
        base.rooms.splice(index, 1);
      } else {
        base.rooms.push({ roomId: action.payload, supplement: "", view: null });
      }
    },

    addSupplementRoom: (state, action: PayloadAction<{ roomId: number; view: RoomView }>) => {
      const base = state.baseSupplements;
      if (
        base.rooms.some(
          (room) =>
            room.roomId === action.payload.roomId &&
            (room.view ?? "no_view") === action.payload.view,
        )
      ) {
        return;
      }
      base.rooms.push({ ...action.payload, supplement: "" });
      state.roomVariationsEdited = true;
    },
    removeSupplementRoomVariation: (
      state,
      action: PayloadAction<{ roomId: number; view: RoomView }>,
    ) => {
      const { roomId, view } = action.payload;
      state.baseSupplements.rooms = state.baseSupplements.rooms.filter(
        (room) => room.roomId !== roomId || (room.view ?? "no_view") !== view,
      );
      state.roomVariationsEdited = true;
    },

    setRoomSupplement: (
      state,
      action: PayloadAction<{ roomId: number; view: RoomView | null; value: string }>,
    ) => {
      const row = state.baseSupplements.rooms.find(
        (room) =>
          room.roomId === action.payload.roomId &&
          (room.view ?? "no_view") === (action.payload.view ?? "no_view"),
      );
      if (row) row.supplement = action.payload.value;
    },

    addFixedRoom: (
      state,
      action: PayloadAction<Pick<FixedPriceRoom, "roomId" | "view" | "meals">>,
    ) => {
      if (state.fixedRooms.some((room) => sameFixedOffer(room, action.payload))) {
        return;
      }
      state.fixedRooms.push({ ...action.payload, weekdayPrice: "", weekendPrice: "" });
      state.roomVariationsEdited = true;
    },

    removeFixedRoom: (state, action: PayloadAction<number>) => {
      if (!state.fixedRooms[action.payload]) return;
      state.fixedRooms.splice(action.payload, 1);
      state.roomVariationsEdited = true;
    },

    setFixedPrice: (
      state,
      action: PayloadAction<{
        index: number;
        day: "weekday" | "weekend";
        value: string;
      }>,
    ) => {
      const row = state.fixedRooms[action.payload.index];
      if (!row) return;
      if (action.payload.day === "weekday") {
        row.weekdayPrice = action.payload.value;
      } else {
        row.weekendPrice = action.payload.value;
      }
    },

    setChildRule: (
      state,
      action: PayloadAction<{
        key: ChildRuleKey;
        field: keyof ChildRule;
        value: string;
      }>,
    ) => {
      const { key, field, value } = action.payload;
      if (key === "sharing_parents" && field === "price") return;
      state.children[key][field] = value;
    },

    setRestrictionsEnabled: (state, action: PayloadAction<boolean>) => {
      state.restrictions.enabled = action.payload;
      if (!action.payload) state.restrictions.rules = [];
    },

    saveRestriction: (state, action: PayloadAction<RestrictionRule>) => {
      const index = state.restrictions.rules.findIndex((rule) => rule.id === action.payload.id);
      if (index >= 0) {
        state.restrictions.rules[index] = action.payload;
      } else {
        state.restrictions.rules.push(action.payload);
      }
    },

    removeRestriction: (state, action: PayloadAction<string>) => {
      state.restrictions.rules = state.restrictions.rules.filter(
        (rule) => rule.id !== action.payload,
      );
    },

    setPoliciesEnabled: (state, action: PayloadAction<boolean>) => {
      state.policies.enabled = action.payload;
      if (!action.payload) {
        state.policies.cancellation = null;
        state.policies.release = null;
      }
    },

    saveCancellationPolicy: (state, action: PayloadAction<CancellationPolicy>) => {
      state.policies.cancellation = action.payload;
    },

    saveReleasePolicy: (state, action: PayloadAction<ReleasePolicy>) => {
      state.policies.release = {
        ...action.payload,
        days: action.payload.period === "same_day" ? "" : action.payload.days,
      };
    },

    ensureMealPlans: (state, action: PayloadAction<MealPlan[]>) => {
      action.payload.forEach((meal) => {
        state.meals[meal] ??= emptyMealRule(meal);
      });
      const includedMeal = state.meals["room_only"];
      if (includedMeal) includedMeal.enabled = true;
    },

    toggleMeal: (state, action: PayloadAction<MealPlan>) => {
      if (action.payload === "room_only") return;
      const meal = state.meals[action.payload] ?? emptyMealRule(action.payload);
      state.meals[action.payload] = { ...meal, enabled: !meal.enabled };
    },

    setMealPrice: (state, action: PayloadAction<{ meal: MealPlan; value: string }>) => {
      if (action.payload.meal === "room_only") return;
      const meal = state.meals[action.payload.meal] ?? emptyMealRule(action.payload.meal);
      state.meals[action.payload.meal] = { ...meal, price: action.payload.value };
    },

    setMealBasis: (state, action: PayloadAction<{ meal: MealPlan; basis: MealBasis }>) => {
      if (action.payload.meal === "room_only") return;
      const meal = state.meals[action.payload.meal] ?? emptyMealRule(action.payload.meal);
      state.meals[action.payload.meal] = { ...meal, basis: action.payload.basis };
    },
  },
});

export const {
  resetDraft,
  loadContract,
  updateBasics,
  setPricingModel,
  setWeekPricing,
  updateInventory,
  setInventoryRoomCap,
  setPerRoomInventory,
  setBaseRoom,
  setBaseCost,
  toggleSupplementRoom,
  addSupplementRoom,
  removeSupplementRoomVariation,
  setRoomSupplement,
  addFixedRoom,
  removeFixedRoom,
  setFixedPrice,
  setChildRule,
  replaceChildren,
  replaceRestrictions,
  ensureMealPlans,
  toggleMeal,
  setMealPrice,
  setMealBasis,
  setRestrictionsEnabled,
  saveRestriction,
  removeRestriction,
  setPoliciesEnabled,
  saveCancellationPolicy,
  replaceCancellation,
  saveSeason,
  removeSeason,
  replaceSeasons,
  saveReleasePolicy,
} = contractDraftSlice.actions;

export default contractDraftSlice.reducer;
