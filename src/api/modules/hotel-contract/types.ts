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
  childPricing: ContractChildPricing | null;
  restrictions?: ContractRestriction[];
  cancellationPolicy?: ContractCancellationPolicy | null;

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
  childPricing: ContractChildPricing;
  restrictions?: Omit<ContractRestrictionInput, "isActive">[];
  cancellationPolicy?: ContractCancellationPolicy;
}

export type UpdateHotelContractBody = Partial<
  Omit<CreateHotelContractBody, "hotelId" | "pricingModel" | "restrictions" | "cancellationPolicy">
> & {
  expectedVersion: number;
  restrictions?: ContractRestrictionInput[];
  cancellationPolicy?: ContractCancellationPolicy | null;
};

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
