import { CHILD_RULES, MEAL_PLANS, type ContractDraftState, type MealRule } from "./types";

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

export function mealSupplement(meal: MealRule, guests: number) {
  const price = toAmount(meal.price) ?? 0;
  return meal.basis === "per_person" ? price * guests : price;
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
    restrictions: draft.restrictions.enabled
      ? draft.restrictions.rules.map((rule) => ({
          roomId: rule.roomId,
          startDate: rule.startDate,
          endDate: rule.endDate,
          minNights: toAmount(rule.minNights),
          appliesOn: rule.appliesOn,
          restrictedCheckInDates: rule.closedCheckIn,
          restrictedCheckOutDates: rule.closedCheckOut,
          active: rule.active,
        }))
      : null,
    policies: draft.policies.enabled
      ? {
          cancellationTiers: (draft.policies.cancellation ?? []).map((tier) => ({
            minDaysBeforeCheckIn: toAmount(tier.days),
            charge: tier.charge,
            value: tier.charge === "free" ? null : toAmount(tier.value),
          })),
          release: draft.policies.release
            ? {
                period: draft.policies.release.period,
                daysBeforeCheckIn:
                  draft.policies.release.period === "days"
                    ? toAmount(draft.policies.release.days)
                    : null,
                releaseTime: draft.policies.release.time,
                afterRelease: draft.policies.release.afterRelease,
              }
            : null,
        }
      : null,
    mealPlans:
      pricingModel === "base_supplements"
        ? MEAL_PLANS.filter((meal) => draft.meals[meal].enabled).map((meal) => ({
            mealPlan: meal,
            basis: draft.meals[meal].basis,
            price: meal === "room_only" ? 0 : toAmount(draft.meals[meal].price),
          }))
        : null,
    extraChildren: Object.fromEntries(
      CHILD_RULES.map((key) => {
        const rule = draft.children[key];
        return [
          key,
          rule.enabled
            ? {
                from: toAmount(rule.ageFrom),
                to: toAmount(rule.ageTo),
                price: key === "sharing_parents" ? 0 : toAmount(rule.price),
              }
            : null,
        ];
      }),
    ) as Record<
      (typeof CHILD_RULES)[number],
      { from: number | null; to: number | null; price: number | null } | null
    >,
  };
}

export type ContractPayload = ReturnType<typeof buildContractPayload>;
