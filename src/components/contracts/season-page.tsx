import { useMemo, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { IconModal } from "@/components/layout/overlay";
import { Button } from "@/components/ui/button";
import { RoomGroup, Table } from "@/components/contracts/contract-parts";
import { fill, useLanguage } from "@/lib/i18n";
import {
  childBands,
  contractRooms,
  fixedPriceRooms,
  mealPlans,
} from "@/lib/contract-data";
import { seasonPage } from "@/lib/season-page-data";
import type { SeasonDetail } from "@/lib/season-detail-data";
import {
  NationalityDrawer,
  NationalityPricesTab,
  RemoveGroupDialog,
} from "@/components/contracts/nationality-prices";
import {
  nationalityCopy,
  nationalityGroups as seedGroups,
  type NationalityGroup,
} from "@/lib/nationality-price-data";
import { SeasonDatePicker } from "@/components/contracts/season-date-picker";
import { arabicDigits } from "@/components/ui/date-field";
import { cn } from "@/lib/utils";

/** A numbered band across the season page, the way the frame groups them. */
function Band({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[12px] border border-border-subtle p-4">
      <p className="text-[10px] font-medium uppercase tracking-[0.04em] text-brand-deep">
        {label}
      </p>
      <div className="mt-3 space-y-4">{children}</div>
    </section>
  );
}

/** A heading and its explanation inside a band. */
function Part({
  title,
  body,
  right,
  children,
}: {
  title: string;
  body: string;
  right?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-text-primary">{title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-text-muted">{body}</p>
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

/**
 * OV 03.12 / 03.12B — the season editor. Seven bands on a base +
 * supplements contract, four when every room carries its own full price.
 */
/** "1,060 SAR" -> 1060, so a price can be moved and written again. */
function priceOf(written: string | undefined): number {
  return Number((written ?? "").replace(/[^0-9]/g, "")) || 0;
}

/** A line's price in this season: its distance from the contract's base,
 *  measured out again from the season's own, in the reader's digits. */
function seasonPriceOf(
  written: string,
  contractBase: number,
  seasonBase: number,
  ar: boolean
): string {
  const value = seasonBase + (priceOf(written) - contractBase);
  return ar
    ? `${value.toLocaleString("ar-EG")} ر.س`
    : `${value.toLocaleString("en-US")} SAR`;
}

export function SeasonPage({
  season,
  fixedPrice = false,
  onClose,
  onRemove,
}: {
  season: SeasonDetail;
  fixedPrice?: boolean;
  onClose: () => void;
  onRemove?: () => void;
}) {
  const { c, lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const ar = lang === "ar";
  const b = c.builder;
  const p = seasonPage;
  /* OV 03.14P / 15P / 16P / 17P - the dates this editor is showing. */
  const [datesOpen, setDatesOpen] = useState(false);
  const [dates, setDates] = useState<{ en: string; ar: string } | null>(null);
  const [query, setQuery] = useState("");
  /* OV 03.12N — the season's own prices, or a nationality's. */
  const [tab, setTab] = useState<"season" | "nationality">("season");
  const [groups, setGroups] = useState<NationalityGroup[]>(seedGroups);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<NationalityGroup | null>(null);
  const [removing, setRemoving] = useState<NationalityGroup | null>(null);
  const nat = tab === "nationality";

  const onSale = contractRooms.filter((room) => room.onSale);
  const priceMeals = mealPlans.filter((meal) => meal.included);
  const base = season.base;
  const weekend = season.weekend;
  /*
   * OV 03.12B / 03.15F / 03.16F / 03.17F — a fixed-price season prices
   * every line for itself, and the frames show the gaps between the lines
   * holding: each row sits the same distance above the base in a season
   * as it does in the contract. So the season's base moves the whole
   * table with it, and the editor shows the season's numbers rather than
   * the contract's on every season.
   */
  const contractBase = priceOf(fixedPriceRooms[0]?.weekday);
  const contractWeekend = priceOf(fixedPriceRooms[0]?.weekend);

  const grouped = useMemo(() => {
    const term = query.trim().toLowerCase();
    const rows = onSale.filter(
      (room) =>
        !term ||
        `${room.type} ${room.view}`.toLowerCase().includes(term) ||
        `${room.typeAr} ${room.viewAr}`.includes(term)
    );
    const map = new Map<string, typeof rows>();
    for (const room of rows) {
      map.set(room.type, [...(map.get(room.type) ?? []), room]);
    }
    return [...map.entries()];
  }, [onSale, query]);

  return (
    <IconModal
      width="1120px"
      overline={
        nat
          ? p.overlineNationality[k]
          : fixedPrice
            ? p.overlineFixed[k]
            : p.overline[k]
      }
      /* N names the season; N0 has no groups to name it for, so it
         names itself instead. */
      title={
        nat && groups.length === 0
          ? nationalityCopy.noneTitle[k]
          : fill(p.title[k], { season: season.name[k] })
      }
      body={
        nat
          ? p.bodyNationality[k]
          : fixedPrice
            ? p.bodyFixed[k]
            : p.body[k]
      }
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onRemove}>
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            {p.removeSeason[k]}
          </Button>
          <Button variant="outline" onClick={onClose}>
            {p.cancel[k]}
          </Button>
          <Button onClick={onClose}>{p.save[k]}</Button>
        </>
      }
    >
      {/* The frame's two pills: the active one dark, with its count. */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["season", nationalityCopy.seasonTab[k], 0],
            ["nationality", nationalityCopy.tab[k], groups.length],
          ] as Array<["season" | "nationality", string, number]>
        ).map(([value, label, count]) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            aria-pressed={tab === value}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[12.5px] font-medium transition-colors",
              tab === value
                ? "bg-surface-inverse text-text-inverse"
                : "border border-border-default text-text-secondary hover:bg-surface-subtle"
            )}
          >
            {label}
            {count > 0 && (
              <span className="text-[11px] opacity-70">
                {arabicDigits(count, ar)}
              </span>
            )}
          </button>
        ))}
      </div>

      {nat ? (
        <NationalityPricesTab
          season={season.name[k]}
          groups={groups}
          onAdd={() => setAdding(true)}
          onEdit={(group) => setEditing(group)}
        />
      ) : (
      <>
      <Band label={p.section1[k]}>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.04em] text-text-muted">
              {p.nameLabel[k]}
            </p>
            <div className="mt-1.5 rounded-[10px] border border-border-strong bg-surface-default px-3 py-2.5 text-[13px] font-medium text-text-primary">
              {season.name[k]}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.04em] text-text-muted">
              {p.datesLabel[k]}
            </p>
            {/* OV 03.14P - the dates are a field, so they open a picker. */}
            <button
              type="button"
              onClick={() => setDatesOpen(true)}
              className="mt-1.5 w-full rounded-[10px] border border-border-strong bg-surface-default px-3 py-2.5 text-start text-[13px] font-medium text-text-primary transition-colors hover:bg-surface-subtle"
            >
              {dates
                ? dates[k]
                : season.meta[k].split(" · ").slice(0, 2).join(" · ")}
            </button>
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.04em] text-text-muted">
              {p.colourLabel[k]}
            </p>
            <div className="mt-1.5 flex items-center gap-2 rounded-[10px] border border-border-strong bg-surface-default px-3 py-2.5">
              <span
                style={{ backgroundColor: season.ink }}
                className="h-4 w-4 rounded"
                aria-hidden="true"
              />
              <span className="text-[11px] text-text-muted">
                {p.colourHint[k]}
              </span>
            </div>
          </div>
        </div>
      </Band>

      <Band label={fixedPrice ? p.section2Fixed[k] : p.section2[k]}>
        {fixedPrice ? (
          <Part
            title={b.sections[2]!}
            body={b.roomsFixedBody}
            right={
              <div className="flex flex-wrap gap-2">
                {/* Adding a room is the thing to do here; requesting a
                    missing one is the exception beside it. */}
                <Button size="sm">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  {b.addRoom}
                </Button>
                <Button variant="outline" size="sm">
                  {b.requestRoom}
                </Button>
              </div>
            }
          >
            <p className="mt-3 text-sm font-medium text-text-primary">
              {b.weekTitle}
            </p>
            <p className="mt-1 text-sm text-text-secondary">{b.weekSplit}</p>
            <p className="mt-1 text-xs leading-relaxed text-text-muted">
              {b.weekHint}
            </p>
            <Table
              head={[
                b.colRoom,
                b.colMealView,
                b.colWeekdayTotal,
                b.colWeekendTotal,
              ]}
              rows={fixedPriceRooms
                .filter((room) => !room.added)
                .map((room) => [
                  ar ? room.roomAr : room.room,
                  ar ? room.mealAr : room.meal,
                  seasonPriceOf(room.weekday, contractBase, base, ar),
                  seasonPriceOf(room.weekend, contractWeekend, weekend, ar),
                ])}
            />
          </Part>
        ) : (
          <>
            <Part title={b.sections[1]!} body={p.pricingBody[k]}>
              <Table
                head={[
                  b.colRoom,
                  b.colMeal,
                  b.colView,
                  b.colWeekday,
                  b.colWeekend,
                ]}
                rows={[
                  [
                    "Standard Room",
                    "Room Only",
                    "City",
                    `${base} SAR`,
                    `${weekend} SAR`,
                  ],
                ]}
              />
            </Part>

            <Part
              title={b.sections[2]!}
              body={p.roomsBody[k]}
              right={
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  {b.requestRoom}
                </Button>
              }
            >
              <p className="mt-3 text-sm font-medium text-text-primary">
                {b.weekTitle}
              </p>
              <p className="mt-1 text-sm text-text-secondary">{b.weekSplit}</p>
              <p className="mt-1 text-xs leading-relaxed text-text-muted">
                {b.weekHint}
              </p>
              <Table
                head={["", b.colRoom, b.colSupplement, b.colSells]}
                rows={contractRooms.map((room) => [
                  room.onSale ? "✓" : "",
                  `${ar ? room.typeAr : room.type} · ${ar ? room.viewAr : room.view}`,
                  !room.onSale
                    ? "-"
                    : room.base
                      ? b.baseRoom
                      : `+ ${room.supplement} SAR`,
                  !room.onSale
                    ? "-"
                    : `${base + room.supplement} / ${weekend + room.supplement} SAR`,
                ])}
              />
            </Part>

            <Part title={b.sections[3]!} body={b.childrenBody}>
              <Table
                head={["", b.colChild, b.colBasis, b.colSameNight]}
                rows={childBands.map((band) => [
                  band.included ? "✓" : "",
                  ar ? band.labelAr : band.label,
                  ar ? band.basisAr : band.basis,
                  ar ? band.supplementAr : band.supplement,
                ])}
              />
            </Part>

            <Part title={b.sections[4]!} body={b.mealsBody}>
              <Table
                head={["", b.colMealPlan, b.colBasis, b.colSameNight]}
                rows={mealPlans.map((meal) => [
                  meal.included ? "✓" : "",
                  ar ? meal.nameAr : meal.name,
                  ar ? meal.basisAr : meal.basis,
                  meal.supplement === null ? "-" : `+ ${meal.supplement} SAR`,
                ])}
              />
            </Part>

            {/* What every room actually sells at during this season. */}
            <div className="rounded-[12px] bg-surface-subtle p-4">
              <p className="text-sm font-semibold text-text-primary">
                {fill(p.priceListTitle[k], { season: season.name[k] })}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-text-muted">
                {b.priceListBody}
              </p>
              <div className="relative mt-3 max-w-xs">
                <Search
                  className="absolute top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted start-3"
                  aria-hidden="true"
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={b.priceListSearch}
                  className="h-10 w-full rounded-lg border border-border-default bg-surface-default ps-9 pe-3 text-sm text-text-primary placeholder:text-text-muted focus-visible:border-border-focus focus-visible:outline-none"
                />
              </div>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[720px] border-collapse text-sm">
                  <thead>
                    <tr className="text-overline text-text-muted">
                      <th className="py-2 text-start font-semibold">
                        {b.colRoomView}
                      </th>
                      {priceMeals.map((meal) => (
                        <th
                          key={meal.name}
                          className="py-2 text-end font-semibold"
                        >
                          {ar ? meal.nameAr : meal.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {grouped.map(([type, rows]) => (
                      <RoomGroup
                        key={type}
                        label={fill(b.roomGroup, {
                          room: ar ? rows[0]!.typeAr : type,
                          views:
                            rows.length === 1
                              ? b.oneView
                              : fill(b.views, { count: rows.length }),
                          guests: rows[0]!.guests,
                        })}
                        rows={rows}
                        meals={priceMeals}
                        lang={lang}
                        t={b}
                        base={{ weekday: base, weekend }}
                        baseCell={p.baseNote[k].replace("{price}", "{amount}")}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </Band>

      <Band label={fixedPrice ? p.section6Fixed[k] : p.section6[k]}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-text-primary">
              {p.restrictionsValue[k]}
            </p>
            <p className="mt-0.5 text-[11.5px] leading-4 text-text-muted">
              {p.restrictionsHint[k]}
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4" aria-hidden="true" />
            {p.addRestriction[k]}
          </Button>
        </div>
      </Band>

      <Band label={fixedPrice ? p.section7Fixed[k] : p.section7[k]}>
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-text-primary">
            {/* The season's own policy where it has one. */}
            {(season.policy ?? p.policyValue)[k]}
          </p>
          <p className="mt-0.5 text-[11.5px] leading-4 text-text-muted">
            {p.policyHint[k]}
          </p>
        </div>
      </Band>
      </>
      )}

      {/* OV 03.12NA / NE / NX - one group, added or edited. */}
      {(adding || editing) && (
        <NationalityDrawer
          season={season.name[k]}
          {...(editing ? { group: editing } : {})}
          groups={groups}
          onClose={() => {
            setAdding(false);
            setEditing(null);
          }}
          onSave={(saved) => {
            setGroups((current) =>
              current.some((item) => item.id === saved.id)
                ? current.map((item) => (item.id === saved.id ? saved : item))
                : [...current, saved]
            );
            setAdding(false);
            setEditing(null);
          }}
          {...(editing
            ? { onRemove: () => setRemoving(editing) }
            : {})}
        />
      )}

      {datesOpen && (
        <SeasonDatePicker
          season={season}
          onApply={setDates}
          onClose={() => setDatesOpen(false)}
        />
      )}

      {removing && (
        <RemoveGroupDialog
          group={removing}
          onClose={() => setRemoving(null)}
          onRemove={() => {
            setGroups((current) =>
              current.filter((item) => item.id !== removing.id)
            );
            setRemoving(null);
            setEditing(null);
          }}
        />
      )}
    </IconModal>
  );
}
