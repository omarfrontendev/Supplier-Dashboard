export type ContractStatus = "draft" | "scheduled" | "active" | "paused" | "expired" | "terminated";

export interface HotelContractMetadataOption {
  value: string;
  labelEn: string;
  labelAr: string;
}

export interface HotelContractsMetadataData {
  mealPlans: HotelContractMetadataOption[];
  roomViews: HotelContractMetadataOption[];
}

export interface HotelContractsMetadataResponse {
  status: "success";
  message: string;
  data: HotelContractsMetadataData;
}

export interface GetSupplierHotelContractRoomsParams {
  page?: number | null;
  limit?: number | null;
  search?: string | null;
  sortOrder?: string | null;
  sortBy?: string | null;
  view?: string | null;
  bedTypeId?: number | null;
  roomSizeId?: number | null;
  minCapacity?: number | null;
  maxCapacity?: number | null;
}

export interface SupplierHotelContractRoom {
  id: number;
  hotelId: number;
  nameEn: string;
  nameAr: string;
  view: string | null;
  maxOccupancy: number | null;
  adults: number | null;
  bedTypeId: number | null;
  roomSizeId: number | null;
  areaSqm: number | null;
  status: string;
}

export interface SupplierHotelContractRoomsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SupplierHotelContractRoomsData {
  rooms: SupplierHotelContractRoom[];
  meta: SupplierHotelContractRoomsMeta;
  emptyState: string | null;
}

export interface SupplierHotelContractRoomsResponse {
  status: "success";
  message: string;
  data: SupplierHotelContractRoomsData;
}

export type BookingType = "allotment_block" | "on_request";

export type PricingModel = "base_plus_supplements" | "fixed_per_room";

export type ContractWeekPricing =
  { mode: "same_all_week" } | { mode: "weekday_weekend"; weekendDays: string[] };

export type ContractRate = { amount: number } | { weekday: number; weekend: number };

export interface ContractMealPricing {
  type: string;
  pricingBasis: "per_room" | "per_person";
  price: number;
}

export interface ContractBasePricing {
  weekPricing: ContractWeekPricing;
  baseRoom: {
    roomId: number;
    view: string;
    rate: ContractRate;
  };
  rooms: Array<{
    roomId: number;
    view: string;
    supplement: number;
  }>;
  mealPlans: ContractMealPricing[];
}

export interface ContractFixedPricing {
  weekPricing: ContractWeekPricing;
  rooms: Array<{
    roomId: number;
    view: string;
    rate: ContractRate;
    mealPlans: ContractMealPricing[];
  }>;
}

export type ContractPricing = ContractBasePricing | ContractFixedPricing;

export interface ContractPricingResponse {
  weekPricing: ContractWeekPricing;
  baseRoom?: {
    roomId: number;
    view: string;
    rate?: ContractRate | null;
    variationId?: number;
    resolvedRoomPrices?: unknown;
  };
  rooms: Array<{
    roomId: number;
    view: string;
    supplement?: number;
    legacySupplement?: number;
    rate?: ContractRate | null;
    mealPlans?: Array<{
      type: string;
      pricingBasis: string;
      price: number | null;
    }>;
    variationId?: number;
    resolvedRoomPrices?: unknown;
  }>;
  mealPlans?: Array<{
    type: string;
    pricingBasis: string;
    price: number | null;
  }>;
}

export interface ContractOnRequestSettings {
  slaMinutes: number;
  expiryAction: "auto_reject" | "escalate_to_hoteliana";
}

export interface ContractReleasePolicy {
  type: "same_day" | "number_of_days";
  daysBeforeCheckIn?: number;
  releaseTime: string;
  afterReleaseAction: "stop_sale" | "on_request";
}

export interface ContractBookingCutoff {
  daysBeforeCheckIn: number;
  cutoffTime: string;
}

export const CONTRACT_PERIODS = [
  "everything",
  "covering_today",
  "starting_next_90_days",
  "ending_next_90_days",
  "already_over",
  "custom",
] as const;

export type ContractPeriod = (typeof CONTRACT_PERIODS)[number];
export type ContractSortBy = string;

export interface SupplyContract {
  id: number;
  supplierId: number;
  hotelId: number;
  name: string;
  startDate: string;
  endDate: string;
  currency: string;
  bookingType: BookingType;
  pricingModel: PricingModel;
  status: ContractStatus;
  weekPricing: unknown | null;
  childPricing?: unknown | null;
  createdBySupplierUserId: number;
  updatedBySupplierUserId: number;
  createdAt: string;
  updatedAt: string;
  version: number;
  hasPricing: boolean;
}

export type BookingConfirmationType = string;

export type InventoryModel = string;

export interface ContractChildPrice {
  from: number;
  to: number;
  price: number;
}

export interface ContractChildPricing {
  sharing_parents: ContractChildPrice;
  shared_bed: ContractChildPrice;
  extra_bed: ContractChildPrice;
}

export interface SupplierHotelContract {
  id: number;
  supplierId: number;
  hotelId: number;

  name: string;

  startDate: string;
  endDate: string;

  currency: string;

  bookingType: BookingConfirmationType;
  pricingModel: InventoryModel;

  status: ContractStatus;

  weekPricing: unknown | null;
  pricing?: ContractPricingResponse | null;
  pricingStatus?: string;
  pricingIssues?: unknown[];
  resolvedRoomPrices?: unknown;
  onRequestSettings?: ContractOnRequestSettings | null;
  inventoryRules?: ContractInventoryRules | null;
  childPricing: ContractChildPricing | null;
  restrictions?: ContractRestriction[];
  cancellationPolicy?: ContractCancellationPolicy | null;
  releasePolicy?: ContractReleasePolicy | null;
  bookingCutoff?: ContractBookingCutoff | null;
  seasons?: ContractSeason[];

  createdBySupplierUserId: number;
  updatedBySupplierUserId: number;

  createdAt: string;
  updatedAt: string;

  version: number;
  hasPricing: boolean;
}

export interface HotelContractsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type HotelContractsEmptyState = "no_contracts";

export interface SupplierHotelContractsData {
  contracts: SupplierHotelContract[];
  meta: HotelContractsMeta;
  emptyState: HotelContractsEmptyState | null;
}

export interface SupplierHotelContractsResponse {
  status: "success";
  message: string;
  data: SupplierHotelContractsData;
}

export interface GetHotelContractsParams {
  page: number;
  limit: number;
  search: string;
  hotelId?: number;
  pricingModel?: string;
  periods: ContractPeriod[];
  dateFrom?: string;
  dateTo?: string;
  sortBy: ContractSortBy;
  status?: ContractStatus;
}

export interface SupplierHotelContractResponse {
  status: "success";
  message: string;
  data: SupplierHotelContract;
}

export interface CreateHotelContractBody {
  hotelId: number;
  name: string;
  startDate: string;
  endDate: string;
  currency: string;
  bookingType: BookingType;
  pricingModel: PricingModel;
  onRequestSettings?: ContractOnRequestSettings;
  inventoryRules?: ContractInventoryRules;
  childPricing?: ContractChildPricing;
  restrictions?: Omit<ContractRestrictionInput, "isActive">[];
  cancellationPolicy?: ContractCancellationPolicy;
  releasePolicy?: ContractReleasePolicy;
  bookingCutoff?: ContractBookingCutoff;
  pricing?: ContractPricing;
  seasons?: ContractSeasonInput[];
}

export type UpdateHotelContractBody = Partial<
  Omit<
    CreateHotelContractBody,
    | "hotelId"
    | "pricingModel"
    | "restrictions"
    | "cancellationPolicy"
    | "onRequestSettings"
    | "releasePolicy"
    | "bookingCutoff"
  >
> & {
  expectedVersion: number;
  restrictions?: ContractRestrictionInput[];
  cancellationPolicy?: ContractCancellationPolicy | null;
  onRequestSettings?: ContractOnRequestSettings | null;
  releasePolicy?: ContractReleasePolicy | null;
  bookingCutoff?: ContractBookingCutoff | null;
};

export type InventorySoldOutAction = "stop_sale" | "on_request" | "controlled_overbooking";

export type ContractInventoryRules =
  | {
      mode: "free_sale";
    }
  | {
      mode: "shared_pool";
      roomsPerNight: number;
      roomCaps?: Array<{
        roomId: number;
        view: string;
        maxRoomsPerNight: number;
      }>;
      whenSoldOut: {
        action: InventorySoldOutAction;
        overbookingLimitPerNight?: number;
      };
    }
  | {
      mode: "per_room_type";
      rooms: Array<{
        roomId: number;
        view: string;
        roomsPerNight: number;
        overbookingLimitPerNight?: number;
      }>;
      whenSoldOut: {
        action: InventorySoldOutAction;
      };
    };

export type SeasonChildPrices = Partial<Record<keyof ContractChildPricing, number>>;

export interface ContractSeasonPricing {
  baseRate?: unknown;
  rooms?: unknown[];
  childPrices?: SeasonChildPrices;
}

export interface ContractSeasonInput {
  name: string;
  startDate: string;
  endDate: string;
  color: string;
  pricing?: ContractSeasonPricing;
  cancellationPolicy?: ContractCancellationPolicy;
}

export interface ContractSeason extends Omit<
  ContractSeasonInput,
  "pricing" | "cancellationPolicy"
> {
  id: number;
  contractId: number;
  nights: number;
  issues: { code: string; message: string }[];
  pricing: { baseRate: unknown | null; rooms: unknown[]; childPrices: SeasonChildPrices } | null;
  cancellationPolicy: ContractCancellationPolicy | null;
  effectiveCancellationPolicy: ContractCancellationPolicy | null;
  cancellationPolicySource: "season" | "contract" | null;
}

export type CancellationChargeKind = "free" | "nights" | "percent" | "fixed";

export interface ContractCancellationCharge {
  kind: CancellationChargeKind;
  value?: number;
}

export interface ContractCancellationTier {
  daysBefore: number;
  charge: ContractCancellationCharge;
}

export interface ContractCancellationPolicy {
  tiers: ContractCancellationTier[];
  noShow: ContractCancellationCharge;
}

export type RestrictionAppliesOn = "every_day" | "weekend_days";

export interface ContractRestrictionInput {
  roomId: number | null;
  appliesFrom: string;
  appliesTo: string;
  minNights: number;
  appliesOn: RestrictionAppliesOn;
  restrictedCheckinDays: number[];
  restrictedCheckoutDays: number[];
  isActive: boolean;
}

export interface ContractRestriction extends ContractRestrictionInput {
  id: number;
  contractId: number;
}
