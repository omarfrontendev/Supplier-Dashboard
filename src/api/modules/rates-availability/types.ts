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

/** A season as the contract details return it. */
export interface RatesSeason {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  color: string;
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
  seasons: RatesSeason[];
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
  resolvedRoomPrices?: Array<{
    variationId: number;
    mealPlan?: RatesMealPlan | null;
    price: RateAmount | null;
  }>;
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

export type SellControlStatus = "stop_sale" | "on_request";

export interface SellControlSla {
  slaMinutes: number;
  expiryAction: "auto_reject" | "escalate_to_hoteliana";
}

export interface SellControlOverride {
  ruleId: number;
  reason: string | null;
  status: SellControlStatus;
  onRequestSettings: SellControlSla | null;
  slaSource: "contract" | "rule" | null;
}

export interface SellControlScope {
  variationIds?: number[];
  allRooms?: true;
  dates?: string[];
  startDate?: string;
  endDate?: string;
  weekdays?: number[];
}

export interface SellControlTargetsData {
  contractId: number;
  timezone: string;
  eligible: boolean;
  bookingType: "allotment_block" | "on_request";
  onRequestSettings: SellControlSla | null;
  sellControlsRevision: number;
  targets: Array<{ variationId: number; roomId: number; view: string }>;
}

export interface SellControlsContextData {
  contractId: number;
  sellControlsRevision: number;
  eligible: boolean;
  onRequestSettings: SellControlSla | null;
  cells: Array<{ variationId: number; stayDate: string; override: SellControlOverride | null }>;
}

export interface SellControlRule {
  id: number;
  status: SellControlStatus;
  live: boolean;
  onRequestSettings: SellControlSla | null;
  cells: Array<{ variationId: number; stayDate: string }>;
  [key: string]: unknown;
}

export interface SellControlsListData {
  contractId: number;
  sellControlsRevision: number;
  rules: SellControlRule[];
  meta: RatesPageMeta;
  emptyState: "no_sell_controls" | null;
}

export type SellControlOperation =
  | (SellControlScope & {
      action: "create";
      status: SellControlStatus;
      onRequestSettings?: SellControlSla;
    })
  | (SellControlScope & {
      action: "edit";
      ruleId: number;
      status: SellControlStatus;
      onRequestSettings?: SellControlSla;
    })
  | (SellControlScope & { action: "open_sale" })
  | { action: "remove"; ruleId: number };

export interface SellControlChangesData {
  contractId: number;
  sellControlsRevision: number;
  changes: Array<{
    variationId: number;
    stayDate: string;
    before: SellControlOverride | null;
    after: SellControlOverride | null;
  }>;
  counts: { cells: number; nights: number; rooms: number };
  replacedRuleIds: number[];
}

export interface RatesCountry {
  code: string;
  nameEn: string;
  nameAr: string;
}

export interface RatesMetadataData {
  countries: RatesCountry[];
}

export interface SupplementMeal {
  type: Exclude<RatesMealPlan, "room_only">;
  enabled: boolean;
  price: number | null;
  pricingBasis: "per_person" | "per_room" | null;
  source: string;
  dailyOverride: unknown;
}

export interface SupplementNight {
  variationId: number;
  stayDate: string;
  currency: string;
  meals: SupplementMeal[];
}

export interface SupplementsContextData {
  ratesRevision: number;
  eligible: boolean;
  nights: SupplementNight[];
}

/* ------------------------------------------------ restriction overrides */

/** Guide p.11 - same selection rules as sell controls: variationIds OR allRooms, dates OR range. */
export type RestrictionScope = SellControlScope;

export type RestrictionStatus = "open" | "closed";
export type RestrictionAppliesOn = "every_day" | "weekend_days";
export type RestrictionField = "minNights" | "checkIn" | "checkOut";
export type RestrictionSource = "room_override" | "all_rooms_override" | "contract" | "default";

export interface RestrictionFieldSource {
  source: RestrictionSource;
  /** Empty for default. Contract and operational rule IDs belong to different sources. */
  ruleIds: number[];
}

export interface RestrictionValues {
  minNights: number;
  checkIn: RestrictionStatus;
  checkOut: RestrictionStatus;
  fieldSources?: Record<RestrictionField, RestrictionFieldSource>;
}

export interface RestrictionCell {
  variationId: number;
  stayDate: string;
  restrictions: RestrictionValues;
}

/** Contract restriction rule, read-only here (same shape as the contract's own restrictions). */
export interface RestrictionInheritedRule {
  id: number;
  roomId: number | null;
  appliesFrom: string;
  appliesTo: string;
  minNights: number;
  appliesOn: RestrictionAppliesOn;
  restrictedCheckinDays: number[];
  restrictedCheckoutDays: number[];
  isActive: boolean;
}

export interface RestrictionTargetsData {
  contractId: number;
  timezone: string | null;
  eligible: boolean;
  /** Configured contract weekend; the backend falls back to Thursday/Friday when unset. */
  weekendDays: string[];
  inheritedRules: RestrictionInheritedRule[];
  restrictionsRevision: number;
  targets: Array<{ variationId: number; roomId: number; view: string }>;
}

export interface RestrictionsContextData {
  contractId: number;
  timezone: string | null;
  eligible: boolean;
  restrictionsRevision: number;
  weekendDays: string[];
  inheritedRules: RestrictionInheritedRule[];
  cells: RestrictionCell[];
}

/** One remaining owned field of a rule. value: minimum nights, or 0 = Open / 1 = Closed. */
export interface RestrictionRuleCell {
  variationId: number;
  stayDate: string;
  field: RestrictionField;
  value: number;
  layer: string;
  ruleId: number;
  status: "effective" | "shadowed" | "historical";
}

export interface RestrictionRule {
  id: number;
  live: boolean;
  cells: RestrictionRuleCell[];
  [key: string]: unknown;
}

export interface RestrictionOverridesListData {
  contractId: number;
  restrictionsRevision: number;
  rules: RestrictionRule[];
  inheritedRules: RestrictionInheritedRule[];
  meta: RatesPageMeta;
  emptyState: "no_restriction_overrides" | null;
}

export interface RestrictionWeekdayGroup {
  weekdays: number[];
  status: RestrictionStatus;
}

/** Omitted fields inherit; never send null or empty arrays. */
export interface RestrictionDefinition {
  minimumStay?: { minNights: number; appliesOn: RestrictionAppliesOn };
  checkIn?: RestrictionWeekdayGroup[];
  checkOut?: RestrictionWeekdayGroup[];
}

export type RestrictionOperation =
  | (RestrictionScope & RestrictionDefinition & { action: "create" })
  | (RestrictionScope & RestrictionDefinition & { action: "edit"; ruleId: number })
  | { action: "remove"; ruleId: number };

export interface RestrictionChange {
  variationId: number;
  stayDate: string;
  before: RestrictionValues;
  after: RestrictionValues;
}

export interface RestrictionChangesData {
  contractId: number;
  restrictionsRevision: number;
  changes: RestrictionChange[];
  counts: { cells: number; nights: number; rooms: number };
  replacedRuleIds: number[];
}

export interface SaveRestrictionOverridesBody {
  expectedRevision: number;
  operations: RestrictionOperation[];
}
