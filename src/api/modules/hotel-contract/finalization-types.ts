import type {
  BookingType,
  ContractBookingCutoff,
  ContractCancellationPolicy,
  ContractChildPricing,
  ContractReleasePolicy,
  ContractStatus,
  PricingModel,
} from "./types";

export interface FinalizationPublication {
  id: number;
  timezone: string;
  finalizedAt: string;
}

export interface FinalizationInventoryIssue {
  path: string;
  code: string;
  message: string;
}

export type FinalizationInventoryRules =
  | {
      mode: "free_sale";
    }
  | {
      mode: "shared_pool";
      roomsPerNight: number;
      roomCaps?: Array<{
        roomId: number;
        view: string;
        variationId?: number;
        maxRoomsPerNight: number;
      }>;
      whenSoldOut: {
        action: "stop_sale" | "on_request" | "controlled_overbooking";
        overbookingLimitPerNight?: number;
      };
    }
  | {
      mode: "per_room_type";
      rooms: Array<{
        roomId: number;
        view: string;
        variationId?: number;
        roomsPerNight: number;
        overbookingLimitPerNight?: number;
      }>;
      whenSoldOut: {
        action: "stop_sale" | "on_request" | "controlled_overbooking";
      };
    };

export type FinalizationRate =
  | { amount: number; weekday?: number; weekend?: number }
  | { weekday: number; weekend: number; amount?: number };

export interface FinalizationMealPlan {
  type: string;
  pricingBasis: "per_room" | "per_person";
  price: number;
}

export interface FinalizationPricingRoom {
  roomId: number;
  view: string;
  variationId: number;
  rate: FinalizationRate;
  supplement: number;
  legacySupplement: FinalizationRate;
  mealPlans: FinalizationMealPlan[];
}

export interface FinalizationResolvedRoomPrice {
  variationId: number;
  view: string;
  mealPlans: FinalizationMealPlan[];
  roomId: number;
  price: FinalizationRate;
}

export interface FinalizationPricing {
  weekPricing: {
    mode: "same_all_week" | "weekday_weekend";
    weekendDays?: string[];
  };
  baseRoom: FinalizationPricingRoom;
  rooms: FinalizationPricingRoom[];
  mealPlans: FinalizationMealPlan[];
}

export interface FinalizationSeasonPricing {
  baseRate: FinalizationRate;
  rooms: Array<{
    roomId: number;
    view: string;
    rate: FinalizationRate;
    supplement: number;
    legacySupplement: FinalizationRate;
    mealPlans: Array<{
      type: string;
      price: number;
    }>;
  }>;
  mealPlans: Array<{
    type: string;
    price: number;
  }>;
  childPrices: Partial<Record<keyof ContractChildPricing, number>>;
}

export interface FinalizationSeason {
  id: number;
  contractId: number;
  name: string;
  startDate: string;
  endDate: string;
  nights: number;
  color: string;
  issues: Array<{
    code: string;
    message: string;
  }>;
  pricing: FinalizationSeasonPricing | null;
  resolvedRoomPrices: FinalizationResolvedRoomPrice[];
  resolvedChildPricing: ContractChildPricing | null;
  cancellationPolicy: ContractCancellationPolicy | null;
  effectiveCancellationPolicy: ContractCancellationPolicy | null;
  cancellationPolicySource: "season" | "contract" | null;
  createdBySupplierUserId: number;
  updatedBySupplierUserId: number;
  createdAt: string;
  updatedAt: string;
}

export interface FinalizationRestriction {
  id: number;
  contractId: number;
  roomId: number | null;
  appliesFrom: string;
  appliesTo: string;
  minNights: number;
  appliesOn: "every_day" | "weekend_days";
  restrictedCheckinDays: number[];
  restrictedCheckoutDays: number[];
  isActive: boolean;
  createdBySupplierUserId: number;
  updatedBySupplierUserId: number;
  createdAt: string;
  updatedAt: string;
}

export interface FinalizationContract {
  publicationStatus: "not_finalized" | "ready";
  publication: FinalizationPublication | null;
  inventoryRules: FinalizationInventoryRules | null;
  inventoryStatus: string;
  inventoryIssues: FinalizationInventoryIssue[];
  id: number;
  supplierId: number;
  hotelId: number;
  name: string;
  startDate: string;
  endDate: string;
  currency: string;
  bookingType: BookingType;
  onRequestSettings: {
    slaMinutes: number;
    expiryAction: "auto_reject" | "escalate_to_hoteliana";
  } | null;
  pricingModel: PricingModel;
  status: ContractStatus;
  weekPricing: {
    mode: "same_all_week" | "weekday_weekend";
    weekendDays?: string[];
  } | null;
  releasePolicy: ContractReleasePolicy | null;
  bookingCutoff: ContractBookingCutoff | null;
  pricing: FinalizationPricing | null;
  pricingStatus: string;
  pricingIssues: FinalizationInventoryIssue[];
  resolvedRoomPrices: FinalizationResolvedRoomPrice[];
  childPricing: ContractChildPricing | null;
  restrictions: FinalizationRestriction[];
  seasons: FinalizationSeason[];
  cancellationPolicy: ContractCancellationPolicy | null;
  createdBySupplierUserId: number;
  updatedBySupplierUserId: number;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface FinalizationIssue {
  code: string;
  severity: "error" | "warning";
  section: string;
  path: string;
  message: string;
  entityId?: number;
}

export interface FinalizationInventoryPreview {
  startDate: string;
  endDate: string;
  nights: number;
  mode: string;
  poolCount: number;
  poolNights: number;
  capNights: number;
  estimatedRecords: number;
  rules: FinalizationInventoryRules;
}

export interface FinalizationConfirmation {
  version: string;
  text: string;
}

export interface HotelContractFinalizationReview {
  contract: FinalizationContract;
  contractId: number;
  version: number;
  evaluatedAt: string;
  businessDate: string;
  timezone: string;
  targetStatus: "active" | "scheduled";
  canFinalize: boolean;
  issues: FinalizationIssue[];
  inventoryPreview: FinalizationInventoryPreview;
  confirmation: FinalizationConfirmation;
}

export interface HotelContractFinalizationReviewResponse {
  status: string;
  message: string;
  data: HotelContractFinalizationReview;
}

export interface FinalizeHotelContractRequest {
  expectedVersion: number;
  confirmationAccepted: boolean;
  confirmationVersion: string;
}

// The guide documents the count categories but does not specify their JSON property names.
export type FinalizationGeneration = Record<string, number>;

export interface FinalizeHotelContractResult {
  contract: FinalizationContract;
  generation: FinalizationGeneration;
}

export interface FinalizeHotelContractResponse {
  status: string;
  message: string;
  data: FinalizeHotelContractResult;
}

export interface FinalizationApiErrorResponse {
  status: string;
  message: string;
  data?: {
    issues?: FinalizationIssue[];
    version?: number;
    [key: string]: unknown;
  } | null;
}

export interface FinalizeHotelContractValidationErrorResponse {
  status: "error";
  message: string;
  data: {
    issues: FinalizationIssue[];
    version: number;
  };
}
