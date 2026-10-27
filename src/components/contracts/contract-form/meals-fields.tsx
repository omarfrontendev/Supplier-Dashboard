import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { useLinkedHotelRooms } from "@/api/modules/hotels/useLinkedHotelRooms";
import { ChoiceRow, Table } from "@/components/contracts/contract-parts";
import { StatusPill } from "@/components/layout/page-shell";
import { fill, useLanguage } from "@/lib/i18n";
import { effectivePrice, mealSupplement } from "@/store/features/contracts/contract-payload";
import {
  setMealBasis,
  setMealPrice,
  toggleMeal,
} from "@/store/features/contracts/contract-draft.slice";
import { MEAL_PLANS, type MealBasis } from "@/store/features/contracts/types";
import { contractIssuesFor } from "./schema";
import {
  AmountInput,
  formatAmount,
  RoomTick,
  roomLabel,
  useAppDispatch,
  useContractDraft,
} from "./shared";

export function MealsFields() {
  const { c, lang } = useLanguage();
  const f = c.builder.form;
  const t = f.mealsTable;
  const dispatch = useAppDispatch();
  const draft = useContractDraft();
  const { basics, meals, baseSupplements, weekPricing } = draft;
  const { rooms } = useLinkedHotelRooms(basics.hotelId);
  const [query, setQuery] = useState("");
  const currencySuffix = basics.currency ? { suffix: basics.currency } : {};
  const split = weekPricing === "weekday_weekend";
  const money = (amount: number) => formatAmount(amount, lang, basics.currency);
  const issues = contractIssuesFor(draft, f.v, "meals");

  const enabledMeals = MEAL_PLANS.filter((meal) => meals[meal].enabled);
  const baseRoom = rooms.find((room) => room.id === baseSupplements.baseRoomId);
  const pricedRoomCount =
    baseSupplements.rooms.filter((room) => room.roomId !== baseSupplements.baseRoomId).length +
    (baseSupplements.baseRoomId === null ? 0 : 1);

  const priceRows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const pricedRooms = [
      ...(baseSupplements.baseRoomId === null
        ? []
        : [{ roomId: baseSupplements.baseRoomId, supplement: "0" }]),
      ...baseSupplements.rooms.filter(
        (room) => room.roomId !== baseSupplements.baseRoomId,
      ),
    ];
    return pricedRooms
      .map((row) => {
        const room = rooms.find((item) => item.id === row.roomId);
        if (!room) return null;
        const weekday = effectivePrice(baseSupplements.weekdayBaseCost, row.supplement);
        const weekend = effectivePrice(baseSupplements.weekendBaseCost, row.supplement);
        return { room, label: roomLabel(room, lang, f), weekday, weekend };
      })
      .filter((row): row is NonNullable<typeof row> => row !== null)
      .filter((row) => !needle || row.label.toLowerCase().includes(needle));
  }, [baseSupplements.baseRoomId, baseSupplements.rooms, baseSupplements.weekdayBaseCost, baseSupplements.weekendBaseCost, rooms, query, lang, f]);

  const lowest = priceRows.reduce<number | null>(
    (min, row) =>
      row.weekday === null ? min : min === null ? row.weekday : Math.min(min, row.weekday),
    null,
  );

  return (
    <>
      <Table
        head={["", t.colMeal, t.colBasis, t.colPrice]}
        rows={MEAL_PLANS.map((meal) => {
          const rule = meals[meal];
          const included = meal === "room_only";
          return [
            <RoomTick
              key="tick"
              on={rule.enabled}
              locked={included}
              label={f.meals[meal]}
              onToggle={() => dispatch(toggleMeal(meal))}
            />,
            f.meals[meal],
            included ? (
              "-"
            ) : (
              <ChoiceRow
                key="basis"
                value={rule.basis}
                onChange={(basis) => dispatch(setMealBasis({ meal, basis: basis as MealBasis }))}
                options={[
                  { value: "per_room", label: t.perRoom },
                  { value: "per_person", label: t.perPerson },
                ]}
              />
            ),
            included ? (
              <span key="included" className="text-sm font-medium text-brand-deep">
                {t.included}
              </span>
            ) : (
              <AmountInput
                key="price"
                aria-label={`${f.meals[meal]} · ${t.colPrice}`}
                {...currencySuffix}
                className="max-w-[160px]"
                disabled={!rule.enabled}
                value={rule.price}
                onValue={(value) => dispatch(setMealPrice({ meal, value }))}
              />
            ),
          ];
        })}
      />
      {issues.length > 0 && <p className="mt-3 text-[12.5px] text-status-danger">{issues[0]}</p>}

      <div className="mt-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-primary">{t.listTitle}</p>
            <p className="mt-1 text-xs leading-relaxed text-text-muted">{t.listBody}</p>
          </div>
          <div className="relative">
            <Search
              className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
              aria-hidden="true"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.search}
              className="h-10 w-full min-w-[220px] rounded-lg border border-border-default bg-surface-default ps-9 pe-3 text-sm text-text-primary placeholder:text-text-muted focus-visible:border-border-focus focus-visible:outline-none"
            />
          </div>
        </div>

        {pricedRoomCount === 0 ? (
          <p className="mt-3 text-sm text-text-muted">{t.listEmpty}</p>
        ) : (
          <>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-text-muted">
              <StatusPill tone="neutral">
                {fill(t.roomsCount, { count: pricedRoomCount })}
              </StatusPill>
              {lowest !== null && (
                <StatusPill tone="brand">{fill(t.from, { amount: money(lowest) })}</StatusPill>
              )}
              {baseRoom && (
                <span className="self-center">
                  {fill(t.base, { room: roomLabel(baseRoom, lang, f) })}
                </span>
              )}
            </div>

            <Table
              head={[f.colRoom, ...enabledMeals.map((meal) => f.meals[meal])]}
              rows={priceRows.map((row) => [
                <div key="room">
                  <p className="text-sm text-text-primary">{row.label}</p>
                  <p className="mt-0.5 text-xs text-text-muted">
                    {fill(t.guests, { count: row.room.adults })}
                  </p>
                </div>,
                ...enabledMeals.map((meal) => {
                  const add = mealSupplement(meals[meal], row.room.adults);
                  return (
                    <div key={meal} className="font-data">
                      <p className="text-sm text-text-primary">
                        {row.weekday === null ? "-" : money(row.weekday + add)}
                      </p>
                      {split && row.weekend !== null && (
                        <p className="mt-0.5 text-xs text-text-muted">
                          {fill(t.weekend, { amount: money(row.weekend + add) })}
                        </p>
                      )}
                    </div>
                  );
                }),
              ])}
            />
          </>
        )}
      </div>
    </>
  );
}
