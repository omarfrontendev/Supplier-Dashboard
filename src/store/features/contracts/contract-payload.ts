import type { ContractDraftState } from "./types";

export const toAmount = (value: string): number | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const amount = Number(trimmed);
  return Number.isFinite(amount) ? amount : null;
};

export const isAmountInput = (value: string) => /^\d*\.?\d{0,2}$/.test(value);

export function effectivePrice(baseCost: string, supplement: string) {
  const base = toAmount(baseCost);
  const add = toAmount(supplement);
  if (base === null || add === null) return null;
  return Math.round((base + add) * 100) / 100;
}

export function buildContractPayload(draft: ContractDraftState) {
  const { basics, pricingModel, weekPricing } = draft;
  const split = weekPricing === "weekday_weekend";
  const onRequest = basics.bookingType === "on_request";

  return {
    hotelId: basics.hotelId,
    name: basics.name.trim(),
    startDate: basics.startDate || null,
    endDate: basics.endDate || null,
    currency: basics.currency,
    weekendDays: basics.weekendDays,
    bookingType: basics.bookingType,
    sla: onRequest
      ? {
          minutes: toAmount(basics.slaMinutes),
          expiryAction: basics.slaExpiryAction,
        }
      : null,
    pricingModel,
    weekPricing,
    basePriceRooms:
      pricingModel === "base_supplements"
        ? {
            baseRoomId: draft.baseSupplements.baseRoomId,
            weekdayBaseCost: toAmount(draft.baseSupplements.weekdayBaseCost),
            weekendBaseCost: split ? toAmount(draft.baseSupplements.weekendBaseCost) : null,
            rooms: draft.baseSupplements.rooms.map((room) => ({
              roomId: room.roomId,
              isBaseRoom: room.roomId === draft.baseSupplements.baseRoomId,
              supplement: toAmount(room.supplement),
            })),
          }
        : null,
    fixedPriceRooms:
      pricingModel === "fixed_price"
        ? draft.fixedRooms.map((room) => ({
            roomId: room.roomId,
            mealPlan: room.mealPlan,
            view: room.view,
            weekdayPrice: toAmount(room.weekdayPrice),
            weekendPrice: split ? toAmount(room.weekendPrice) : null,
          }))
        : null,
  };
}

export type ContractPayload = ReturnType<typeof buildContractPayload>;
