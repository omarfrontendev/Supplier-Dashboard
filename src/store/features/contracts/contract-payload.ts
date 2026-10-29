import {
  CHILD_RULES,
  WEEKDAY_NUMBER,
  type ContractDraftState,
  type MealRule,
} from "./types";

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
  const enabledMeals = Object.entries(draft.meals).filter(([, meal]) => meal.enabled);

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
    basePricing:
      pricingModel === "base_supplements"
        ? {
            baseRoomId: draft.baseSupplements.baseRoomId,
            baseRate: {
              amount: toAmount(draft.baseSupplements.weekdayBaseCost),
              ...(split
                ? { weekendAmount: toAmount(draft.baseSupplements.weekendBaseCost) }
                : {}),
            },
            mealPlans: enabledMeals.map(([meal]) => meal),
            rooms: draft.baseSupplements.rooms
              .filter((room) => room.roomId !== draft.baseSupplements.baseRoomId)
              .map((room) => ({
                roomId: room.roomId,
                supplement: { amount: toAmount(room.supplement) },
                view: room.view,
              })),
          }
        : null,
    fixedPriceRooms:
      pricingModel === "fixed_price"
        ? draft.fixedRooms.map((room) => ({
            roomId: room.roomId,
            view: room.view,
            mealPlans: room.meals.map((meal) => ({
              mealPlan: meal.plan,
              basis: meal.basis,
              price: meal.plan === "room_only" ? 0 : toAmount(meal.price),
            })),
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
          restrictedCheckinDays: rule.closedCheckIn.map((day) => WEEKDAY_NUMBER[day]),
          restrictedCheckoutDays: rule.closedCheckOut.map((day) => WEEKDAY_NUMBER[day]),
          active: rule.active,
        }))
      : null,
    policies: draft.policies.enabled
      ? {
          cancellationTiers: (draft.policies.cancellation?.tiers ?? []).map((tier) => ({
            minDaysBeforeCheckIn: toAmount(tier.days),
            charge: tier.charge,
            value: tier.charge === "free" ? null : toAmount(tier.value),
          })),
          noShow: draft.policies.cancellation
            ? {
                charge: draft.policies.cancellation.noShow.charge,
                value:
                  draft.policies.cancellation.noShow.charge === "free"
                    ? null
                    : toAmount(draft.policies.cancellation.noShow.value),
              }
            : null,
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
        ? enabledMeals.map(([meal, rule]) => ({
            mealPlan: meal,
            basis: rule.basis,
            price: meal === "room_only" ? 0 : toAmount(rule.price),
          }))
        : null,
    extraChildren: Object.fromEntries(
      CHILD_RULES.map((key) => {
        const rule = draft.children[key];
        return [
          key,
          {
            from: toAmount(rule.ageFrom),
            to: toAmount(rule.ageTo),
            price: key === "sharing_parents" ? 0 : toAmount(rule.price),
          },
        ];
      }),
    ) as Record<
      (typeof CHILD_RULES)[number],
      { from: number | null; to: number | null; price: number | null } | null
    >,
  };
}

export type ContractPayload = ReturnType<typeof buildContractPayload>;
