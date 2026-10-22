export type ContractStatus =
  | "draft"
  | "scheduled"
  | "active"
  | "paused"
  | "expired"
  | "terminated";

export type BookingType = "allotment_block" | "on_request";

export type PricingModel =
  | "base_plus_supplements"
  | "fixed_per_room";

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
  page?: number;
  limit?: number;
  search?: string;
  hotelId?: number;
  pricingModel?: string;
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
}

export type UpdateHotelContractBody = Partial<
  Omit<CreateHotelContractBody, "hotelId" | "pricingModel">
> & {
  expectedVersion: number;
};
