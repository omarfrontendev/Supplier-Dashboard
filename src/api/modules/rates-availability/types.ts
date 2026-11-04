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
