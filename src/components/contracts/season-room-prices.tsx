import type { ReactNode } from "react";

import { Part } from "@/components/contracts/season-page";
import { AmountInput, formatAmount } from "@/components/contracts/contract-form/shared";
import { fill } from "@/lib/i18n";
import { seasonPage } from "@/lib/season-page-data";
import { toAmount } from "@/store/features/contracts/contract-payload";
import {
  seasonRoomKey,
  type ContractDraftState,
  type SeasonPricingDraft,
  type SeasonRoomPrices,
} from "@/store/features/contracts/types";

type Contract = Pick<
  ContractDraftState,
  "pricingModel" | "weekPricing" | "baseSupplements" | "fixedRooms" | "meals"
>;

const emptyRoom = (): SeasonRoomPrices => ({ supplement: "", weekday: "", weekend: "", meals: {} });

const validAmount = (value: string) => {
  if (value.trim() === "") return true;
  const amount = toAmount(value);
  return amount !== null && amount >= 0 && /^\d+(\.\d{1,2})?$/.test(value.trim());
};

export function seasonPricingIssues(
  pricing: SeasonPricingDraft,
  contract: Contract,
  lang: string,
): string[] {
  const k = lang === "ar" ? "ar" : "en";
  const p = seasonPage;
  const split = contract.weekPricing === "weekday_weekend";
  const values = [
    pricing.baseWeekday,
    pricing.baseWeekend,
    ...Object.values(pricing.meals),
    ...Object.values(pricing.rooms).flatMap((room) => [
      room.supplement,
      room.weekday,
      room.weekend,
      ...Object.values(room.meals),
    ]),
  ];
  const pairs = split
    ? [
        [pricing.baseWeekday, pricing.baseWeekend],
        ...Object.values(pricing.rooms).map((room) => [room.weekday, room.weekend]),
      ]
    : [];
  const issues: string[] = [];
  if (values.some((value) => !validAmount(value))) issues.push(p.badPrice[k]);
  if (pairs.some(([a, b]) => (a!.trim() === "") !== (b!.trim() === ""))) {
    issues.push(p.bothWeekly[k]);
  }
  return issues;
}

function PriceTable({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full min-w-[620px] border-collapse text-sm">
        <thead>
          <tr className="text-overline text-text-muted">
            {head.map((cell) => (
              <th key={cell} className="py-2 pe-3 text-start font-semibold">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function SeasonRoomPrices({
  pricing,
  contract,
  currency,
  lang,
  roomName,
  mealName,
  onChange,
}: {
  pricing: SeasonPricingDraft;
  contract: Contract;
  currency: string | null;
  lang: string;
  roomName: (roomId: number, view: string | null) => string;
  mealName: (plan: string) => string;
  onChange: (next: SeasonPricingDraft) => void;
}) {
  const k = lang === "ar" ? "ar" : "en";
  const p = seasonPage;
  const split = contract.weekPricing === "weekday_weekend";
  const suffix = currency ? { suffix: currency } : {};
  const money = (value: string) => {
    const amount = toAmount(value);
    return amount === null ? "—" : formatAmount(amount, lang, currency);
  };
  const weekly = (weekday: string, weekend: string) =>
    split ? `${money(weekday)} / ${money(weekend)}` : money(weekday);
  const room = (key: string) => pricing.rooms[key] ?? emptyRoom();
  const setRoom = (key: string, patch: Partial<SeasonRoomPrices>) =>
    onChange({ ...pricing, rooms: { ...pricing.rooms, [key]: { ...room(key), ...patch } } });
  const input = (label: string, value: string, onValue: (value: string) => void) => (
    <AmountInput
      aria-label={label}
      className="max-w-[160px]"
      {...suffix}
      placeholder={p.colContractPrice[k]}
      value={value}
      onValue={onValue}
    />
  );
  const cell = "py-2.5 pe-3";

  if (contract.pricingModel === "base_supplements") {
    const base = contract.baseSupplements;
    const others = base.rooms.filter(
      (item) => !(item.roomId === base.baseRoomId && item.view === base.baseRoomView),
    );
    const meals = Object.entries(contract.meals).filter(
      ([plan, rule]) => plan !== "room_only" && rule.enabled,
    );
    const baseLabel = base.baseRoomId === null ? "" : roomName(base.baseRoomId, base.baseRoomView);
    return (
      <>
        <Part title={p.roomsTitle[k]} body={p.roomsLead[k]}>
          {base.baseRoomId === null ? (
            <p className="mt-3 text-sm text-text-muted">{p.noRooms[k]}</p>
          ) : (
            <PriceTable
              head={[
                p.colRoom[k],
                p.colContractPrice[k],
                ...(split ? [p.colSeasonWeekday[k], p.colSeasonWeekend[k]] : [p.colSeasonRate[k]]),
              ]}
            >
              <tr className="border-t border-border-subtle">
                <td className={cell}>
                  <p className="font-medium text-text-primary">
                    {fill(p.baseRow[k], { room: baseLabel })}
                  </p>
                </td>
                <td className={`${cell} text-text-secondary`}>
                  {weekly(base.weekdayBaseCost, base.weekendBaseCost)}
                </td>
                <td className={cell}>
                  {input(`${baseLabel} · ${p.colSeasonWeekday[k]}`, pricing.baseWeekday, (value) =>
                    onChange({ ...pricing, baseWeekday: value }),
                  )}
                </td>
                {split && (
                  <td className={cell}>
                    {input(
                      `${baseLabel} · ${p.colSeasonWeekend[k]}`,
                      pricing.baseWeekend,
                      (value) => onChange({ ...pricing, baseWeekend: value }),
                    )}
                  </td>
                )}
              </tr>
            </PriceTable>
          )}
          {others.length > 0 && (
            <PriceTable head={[p.colRoom[k], p.colContractSupplement[k], p.colSeasonSupplement[k]]}>
              {others.map((item) => {
                const key = seasonRoomKey(item.roomId, item.view);
                const name = roomName(item.roomId, item.view);
                return (
                  <tr key={key} className="border-t border-border-subtle">
                    <td className={cell}>
                      <p className="font-medium text-text-primary">{name}</p>
                    </td>
                    <td className={`${cell} text-text-secondary`}>+{money(item.supplement)}</td>
                    <td className={cell}>
                      {input(
                        `${name} · ${p.colSeasonSupplement[k]}`,
                        room(key).supplement,
                        (value) => setRoom(key, { supplement: value }),
                      )}
                    </td>
                  </tr>
                );
              })}
            </PriceTable>
          )}
        </Part>
        {meals.length > 0 && (
          <Part title={p.mealsTitle[k]} body={p.mealsBody[k]}>
            <PriceTable head={[p.colMeal[k], p.colContractPrice[k], p.colSeasonPrice[k]]}>
              {meals.map(([plan, rule]) => (
                <tr key={plan} className="border-t border-border-subtle">
                  <td className={cell}>
                    <p className="font-medium text-text-primary">{mealName(plan)}</p>
                  </td>
                  <td className={`${cell} text-text-secondary`}>{money(rule.price)}</td>
                  <td className={cell}>
                    {input(
                      `${mealName(plan)} · ${p.colSeasonPrice[k]}`,
                      pricing.meals[plan] ?? "",
                      (value) =>
                        onChange({ ...pricing, meals: { ...pricing.meals, [plan]: value } }),
                    )}
                  </td>
                </tr>
              ))}
            </PriceTable>
          </Part>
        )}
      </>
    );
  }

  return (
    <Part title={p.roomsTitle[k]} body={p.roomsLead[k]}>
      {contract.fixedRooms.length === 0 ? (
        <p className="mt-3 text-sm text-text-muted">{p.noRooms[k]}</p>
      ) : (
        <PriceTable
          head={[
            p.colRoom[k],
            p.colContractPrice[k],
            ...(split ? [p.colSeasonWeekday[k], p.colSeasonWeekend[k]] : [p.colSeasonRate[k]]),
          ]}
        >
          {contract.fixedRooms.flatMap((item) => {
            const key = seasonRoomKey(item.roomId, item.view);
            const name = roomName(item.roomId, item.view);
            const current = room(key);
            const meals = item.meals.filter((meal) => meal.plan !== "room_only");
            return [
              <tr key={key} className="border-t border-border-subtle">
                <td className={cell}>
                  <p className="font-medium text-text-primary">{name}</p>
                </td>
                <td className={`${cell} text-text-secondary`}>
                  {weekly(item.weekdayPrice, item.weekendPrice)}
                </td>
                <td className={cell}>
                  {input(`${name} · ${p.colSeasonWeekday[k]}`, current.weekday, (value) =>
                    setRoom(key, { weekday: value }),
                  )}
                </td>
                {split && (
                  <td className={cell}>
                    {input(`${name} · ${p.colSeasonWeekend[k]}`, current.weekend, (value) =>
                      setRoom(key, { weekend: value }),
                    )}
                  </td>
                )}
              </tr>,
              ...meals.map((meal) => (
                <tr key={`${key}-${meal.plan}`}>
                  <td className={`${cell} ps-4 text-xs text-text-secondary`}>
                    + {mealName(meal.plan)}
                  </td>
                  <td className={`${cell} text-text-secondary`}>{money(meal.price)}</td>
                  <td className={cell} colSpan={split ? 2 : 1}>
                    {input(
                      `${name} · ${mealName(meal.plan)}`,
                      current.meals[meal.plan] ?? "",
                      (value) => setRoom(key, { meals: { ...current.meals, [meal.plan]: value } }),
                    )}
                  </td>
                </tr>
              )),
            ];
          })}
        </PriceTable>
      )}
    </Part>
  );
}
