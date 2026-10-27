import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type {
  CancellationPolicy,
  ChildRule,
  ChildRuleKey,
  ChildRules,
  MealBasis,
  MealPlan,
  ContractBasics,
  ContractDraftState,
  ContractRestrictions,
  FixedPriceRoom,
  PricingModel,
  ReleasePolicy,
  RestrictionRule,
  WeekPricing,
} from "./types";

const emptyBaseSupplements = (): ContractDraftState["baseSupplements"] => ({
  baseRoomId: null,
  weekdayBaseCost: "",
  weekendBaseCost: "",
  rooms: [],
});

const emptyMeals = (): ContractDraftState["meals"] => ({
  room_only: { enabled: true, price: "0", basis: "per_room" },
  bed_breakfast: { enabled: false, price: "", basis: "per_person" },
  half_board: { enabled: false, price: "", basis: "per_person" },
  full_board: { enabled: false, price: "", basis: "per_person" },
  iftar_sohour: { enabled: false, price: "", basis: "per_person" },
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
  weekPricing: "weekday_weekend",
  baseSupplements: emptyBaseSupplements(),
  fixedRooms: [],
  children: {
    sharing_parents: { ageFrom: "0", ageTo: "5", price: "0" },
    shared_bed: { ageFrom: "6", ageTo: "11", price: "" },
    extra_bed: { ageFrom: "6", ageTo: "11", price: "" },
  },
  meals: emptyMeals(),
  policies: { enabled: true, cancellation: null, release: null },
  restrictions: { enabled: true, rules: [] },
};

export const sameFixedOffer = (
  a: Pick<FixedPriceRoom, "roomId" | "mealPlan" | "view">,
  b: Pick<FixedPriceRoom, "roomId" | "mealPlan" | "view">,
) => a.roomId === b.roomId && a.mealPlan === b.mealPlan && a.view === b.view;

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
      action: PayloadAction<{
        basics: Partial<ContractBasics>;
        pricingModel: PricingModel;
        children?: ChildRules;
        restrictions?: ContractRestrictions;
        cancellation?: CancellationPolicy | null;
      }>,
    ) => ({
      ...initialState,
      basics: { ...initialState.basics, ...action.payload.basics },
      pricingModel: action.payload.pricingModel,
      children: action.payload.children ?? initialState.children,
      restrictions: action.payload.restrictions ?? initialState.restrictions,
      policies: { ...initialState.policies, cancellation: action.payload.cancellation ?? null },
    }),

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

    setBaseRoom: (state, action: PayloadAction<number>) => {
      const base = state.baseSupplements;
      if (base.baseRoomId === action.payload) return;
      if (
        base.baseRoomId !== null &&
        !base.rooms.some((room) => room.roomId === base.baseRoomId)
      ) {
        base.rooms.push({ roomId: base.baseRoomId, supplement: "0" });
      }
      base.baseRoomId = action.payload;
      base.rooms = base.rooms.filter((room) => room.roomId !== action.payload);
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
      if (index >= 0) {
        base.rooms.splice(index, 1);
      } else {
        base.rooms.push({ roomId: action.payload, supplement: "" });
      }
    },

    setRoomSupplement: (state, action: PayloadAction<{ roomId: number; value: string }>) => {
      const row = state.baseSupplements.rooms.find((room) => room.roomId === action.payload.roomId);
      if (row && row.roomId !== state.baseSupplements.baseRoomId) {
        row.supplement = action.payload.value;
      }
    },

    addFixedRoom: (
      state,
      action: PayloadAction<Pick<FixedPriceRoom, "roomId" | "mealPlan" | "view">>,
    ) => {
      if (state.fixedRooms.some((room) => sameFixedOffer(room, action.payload))) {
        return;
      }
      state.fixedRooms.push({ ...action.payload, weekdayPrice: "", weekendPrice: "" });
    },

    removeFixedRoom: (state, action: PayloadAction<number>) => {
      state.fixedRooms.splice(action.payload, 1);
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

    toggleMeal: (state, action: PayloadAction<MealPlan>) => {
      if (action.payload === "room_only") return;
      const meal = state.meals[action.payload];
      meal.enabled = !meal.enabled;
    },

    setMealPrice: (state, action: PayloadAction<{ meal: MealPlan; value: string }>) => {
      if (action.payload.meal === "room_only") return;
      state.meals[action.payload.meal].price = action.payload.value;
    },

    setMealBasis: (state, action: PayloadAction<{ meal: MealPlan; basis: MealBasis }>) => {
      if (action.payload.meal === "room_only") return;
      state.meals[action.payload.meal].basis = action.payload.basis;
    },
  },
});

export const {
  resetDraft,
  loadContract,
  updateBasics,
  setPricingModel,
  setWeekPricing,
  setBaseRoom,
  setBaseCost,
  toggleSupplementRoom,
  setRoomSupplement,
  addFixedRoom,
  removeFixedRoom,
  setFixedPrice,
  setChildRule,
  replaceChildren,
  replaceRestrictions,
  toggleMeal,
  setMealPrice,
  setMealBasis,
  setRestrictionsEnabled,
  saveRestriction,
  removeRestriction,
  setPoliciesEnabled,
  saveCancellationPolicy,
  replaceCancellation,
  saveReleasePolicy,
} = contractDraftSlice.actions;

export default contractDraftSlice.reducer;
