import type {
  BookingType as ApiBookingType,
  CreateHotelContractBody,
  PricingModel as ApiPricingModel,
  SupplierHotelContract,
  UpdateHotelContractBody,
} from "@/api/modules/hotel-contract/types";
import type { BookingType, ContractDraftState, PricingModel } from "./types";

const bookingToApi: Record<BookingType, ApiBookingType> = {
  allotment: "allotment_block",
  on_request: "on_request",
};

const pricingToApi: Record<PricingModel, ApiPricingModel> = {
  base_supplements: "base_plus_supplements",
  fixed_price: "fixed_per_room",
};

export const basicsReady = ({ basics }: ContractDraftState) =>
  basics.hotelId !== null &&
  basics.name.trim() !== "" &&
  basics.startDate !== "" &&
  basics.endDate !== "" &&
  basics.endDate >= basics.startDate &&
  basics.currency !== null;

export function toCreateContractBody(draft: ContractDraftState): CreateHotelContractBody {
  const { basics } = draft;
  return {
    hotelId: basics.hotelId!,
    name: basics.name.trim(),
    startDate: basics.startDate,
    endDate: basics.endDate,
    currency: basics.currency!,
    bookingType: bookingToApi[basics.bookingType],
    pricingModel: pricingToApi[draft.pricingModel],
  };
}

const MUTABLE_FIELDS = ["name", "startDate", "endDate", "currency", "bookingType"] as const;

type MutableField = (typeof MUTABLE_FIELDS)[number];

export function changedContractFields(
  draft: ContractDraftState,
  contract: SupplierHotelContract,
): MutableField[] {
  const next = toCreateContractBody(draft);
  return MUTABLE_FIELDS.filter((field) => next[field] !== contract[field]);
}

export function toUpdateContractBody(
  draft: ContractDraftState,
  contract: SupplierHotelContract,
): UpdateHotelContractBody | null {
  const next = toCreateContractBody(draft);
  const fields = changedContractFields(draft, contract);
  if (fields.length === 0) return null;
  return fields.reduce<UpdateHotelContractBody>(
    (body, field) => ({ ...body, [field]: next[field] }),
    { expectedVersion: contract.version },
  );
}

export function contractDifferences(
  before: SupplierHotelContract,
  after: SupplierHotelContract,
): MutableField[] {
  return MUTABLE_FIELDS.filter((field) => before[field] !== after[field]);
}

export function draftFromContract(contract: SupplierHotelContract) {
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
    },
    pricingModel: (contract.pricingModel === "fixed_per_room"
      ? "fixed_price"
      : "base_supplements") as PricingModel,
  };
}

export const sameSavedBasics = (draft: ContractDraftState, contract: SupplierHotelContract) =>
  basicsReady(draft) && changedContractFields(draft, contract).length === 0;

export const hasRoomPricing = (contract: SupplierHotelContract) => contract.weekPricing !== null;

export function mergeLatestBasics(
  draft: ContractDraftState,
  before: SupplierHotelContract,
  latest: SupplierHotelContract,
): Partial<ContractDraftState["basics"]> {
  const original = draftFromContract(before).basics;
  const incoming = draftFromContract(latest).basics;
  const current = { ...draft.basics, name: draft.basics.name.trim() };
  return MUTABLE_FIELDS.reduce<Partial<ContractDraftState["basics"]>>(
    (merged, field) =>
      current[field] === original[field] && original[field] !== incoming[field]
        ? { ...merged, [field]: incoming[field] }
        : merged,
    {},
  );
}
