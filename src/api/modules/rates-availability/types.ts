export interface RatesPageMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RatesHotel {
  id: number;
  nameEn: string | null;
  nameAr: string | null;
  countryCode: string | null;
  city: string | null;
  starRating: number | null;
  status: "active";
}

export interface RatesHotelsData {
  hotels: RatesHotel[];
  meta: RatesPageMeta;
  emptyState: "no_hotels" | "no_results" | null;
}

export interface RatesHotelsResponse {
  status: "success";
  message: string;
  data: RatesHotelsData;
}

export type RatesContractStatus =
  | "draft"
  | "active"
  | "paused"
  | "terminated"
  | "scheduled"
  | "expired";

export interface RatesContract {
  id: number;
  hotelId: number;
  hotelNameEn: string | null;
  hotelNameAr: string | null;
  name: string;
  startDate: string;
  endDate: string;
  currency: string;
  bookingType: "allotment_block" | "on_request";
  pricingModel: "base_plus_supplements" | "fixed_per_room";
  status: RatesContractStatus;
}

export interface RatesContractsData {
  contracts: RatesContract[];
  meta: RatesPageMeta;
  emptyState: "no_contracts" | "no_results" | null;
}

export interface RatesContractsResponse {
  status: "success";
  message: string;
  data: RatesContractsData;
}

export interface RatesPageParams {
  page?: number;
  limit?: number;
}

export type RatesMealPlan =
  | "room_only"
  | "bed_and_breakfast"
  | "half_board"
  | "full_board"
  | "iftar_and_suhoor";

export interface RateTarget {
  variationId: number;
  mealPlan?: RatesMealPlan;
}

export interface RateTargetRow {
  variationId: number;
  roomId: number;
  roomNameEn: string | null;
  roomNameAr: string | null;
  view: string;
  kind: string;
  mealPlan?: RatesMealPlan;
}

export interface RateTargetsData {
  contractId: number;
  currency: string;
  pricingModel: "base_plus_supplements" | "fixed_per_room";
  ratesRevision: number;
  eligible: boolean;
  timezone: string | null;
  startDate: string;
  endDate: string;
  weekendDays: string[];
  pricingIssues: unknown[];
  targets: RateTargetRow[];
}

export type RateSource = "daily_override" | "season" | "contract";

export interface RateNight {
  available: boolean;
  variationId: number;
  roomId: number;
  view: string;
  mealPlan: RatesMealPlan | null;
  stayDate: string;
  isWeekend: boolean;
  currency: string;
  roomAmount: number;
  source: RateSource;
  contractRoomAmount: number;
  fallbackAmount: number;
  fallbackSource: "season" | "contract";
  existingOverride: number | null;
  roomSupplement: { amount: number; source: "season" | "contract"; appliedSeparately: boolean };
}

export interface RateContextData {
  ratesRevision: number;
  eligible: boolean;
  nights: RateNight[];
}

export interface RateSelection {
  targets: RateTarget[];
  dates?: string[];
  startDate?: string;
  endDate?: string;
  weekdays?: number[];
}

export type RateAmount = { amount: number } | { weekday: number; weekend: number };

export type RateOperation = RateSelection &
  (
    | { action: "set"; basis: "selected_room_total" | "base_plus_room_supplement"; rate: RateAmount }
    | { action: "remove" }
  );

export interface RateChangesData {
  ratesRevision: number;
  affectedCount: number;
  replacedCount: number;
  removedCount: number;
  nights: Array<RateNight & { action: "set" | "remove"; proposedAmount: number; proposedSource: RateSource }>;
}

export interface RatesEnvelope<T> {
  status: "success";
  message: string;
  data: T;
}

export interface RatesCancellationCharge {
  kind: "free" | "nights" | "percent" | "fixed";
  value?: number;
}

export interface RatesPoolNight {
  stayDate: string;
  capacity: number | null;
  overbookingLimit: number;
}

export interface RatesInventoryPool {
  id: number;
  poolKey: string;
  mode: "shared_pool" | "per_room_type" | "free_sale";
  variationId: number | null;
  nights: RatesPoolNight[];
}

export interface RatesInventoryCap {
  variationId: number;
  poolId: number;
  nights: Array<{ stayDate: string; maxRooms: number }>;
}

export interface RatesContractDetail {
  id: number;
  hotelId: number;
  name: string;
  startDate: string;
  endDate: string;
  currency: string;
  bookingType: "allotment_block" | "on_request";
  pricingModel: "base_plus_supplements" | "fixed_per_room";
  status: RatesContractStatus;
  publicationStatus: "not_finalized" | "ready";
  weekPricing: { mode: string; weekendDays: string[] } | null;
  releasePolicy: {
    type: "same_day" | "number_of_days";
    daysBeforeCheckIn: number | null;
    releaseTime: string;
    afterReleaseAction: "stop_sale" | "on_request";
  } | null;
  bookingCutoff: { daysBeforeCheckIn: number; cutoffTime: string } | null;
  restrictions: unknown[];
  seasons: unknown[];
  cancellationPolicy: {
    tiers: Array<{ daysBefore: number; charge: RatesCancellationCharge }>;
    noShow: RatesCancellationCharge;
  } | null;
  inventoryRules: {
    mode: "shared_pool" | "per_room_type" | "free_sale";
    roomsPerNight?: number;
    whenSoldOut?: { action: string; overbookingLimitPerNight?: number };
  } | null;
  pricing: {
    baseRoom?: { variationId: number; roomId: number; view: string; rate: RateAmount };
    mealPlans?: Array<{ type: RatesMealPlan; pricingBasis: string; price: number }>;
  } | null;
  hotel: { id: number; nameEn: string | null; nameAr: string | null };
  inventory: { pools: RatesInventoryPool[]; caps: RatesInventoryCap[] };
}

export interface RateOverrideRow {
  id: number;
  contractId: number;
  variationId: number;
  mealPlan: RatesMealPlan | null;
  stayDate: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface RateOverridesData {
  overrides: RateOverrideRow[];
  ratesRevision: number;
  meta: RatesPageMeta;
  emptyState: "no_overrides" | null;
}
