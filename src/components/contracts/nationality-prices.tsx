/**
 * OV 03.12N / N0 / NA / NE — the nationality-prices tab and its drawer.
 *
 * The tab is the whole of N0 and N; the drawer is NA and NE, which are the
 * same three steps with a different title and one extra button. Removing a
 * group asks first, in a confirm no frame draws.
 */

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { Modal } from "@/components/layout/overlay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { arabicDigits } from "@/components/ui/date-field";
import { fill, useLanguage } from "@/lib/i18n";
import {
  countriesWord,
  counted,
  groupsWord,
} from "@/lib/arabic-count";
import { money } from "@/lib/money";
import {
  countryList,
  MAX_GROUPS,
  nationalityCopy,
  seasonRoomPrices,
  type Bi,
  type NationalityGroup,
  type PriceMode,
} from "@/lib/nationality-price-data";
import { cn } from "@/lib/utils";

type Lang = "en" | "ar";

/**
 * What a group's row says in the "how it differs" column. The frame writes
 * it on two lines - the amount, then what the amount is on - because the
 * two answer different questions: how much, and how it behaves when the
 * season price moves.
 */
function differs(group: NationalityGroup, k: Lang, lang: string): [string, string] {
  const c = nationalityCopy;
  if (group.mode === "fixed") return [c.fixedPrice[k], c.perRoom[k]];
  const amount = group.adjust ?? 0;
  return [
    fill(c.adjustedBy[k], {
      sign: amount < 0 ? "\u2212" : "+",
      amount: Math.abs(amount).toLocaleString(lang === "ar" ? "ar-EG" : "en-US"),
    }),
    c.onSeasonPrice[k],
  ];
}

/** What a group pays for one room, weekday and weekend. */
function groupPrice(
  group: NationalityGroup | null,
  room: { room: Bi; weekday: number; weekend: number },
  lang: string
): string {
  const n = (v: number) => v.toLocaleString(lang === "ar" ? "ar-EG" : "en-US");
  if (!group) return `${n(room.weekday)} / ${n(room.weekend)}`;
  if (group.mode === "fixed") {
    const fixed = group.fixed?.[room.room.en];
    /* BR-03-92 - a room added after the group has no fixed price, and
       falls to the season's until someone types one. */
    if (!fixed) return `${n(room.weekday)} / ${n(room.weekend)}`;
    return `${n(fixed.weekday)} / ${n(fixed.weekend)}`;
  }
  const adjust = group.adjust ?? 0;
  return `${n(room.weekday + adjust)} / ${n(room.weekend + adjust)}`;
}

/** OV 03.12N / N0 — the tab itself. */
export function NationalityPricesTab({
  season,
  groups,
  onAdd,
  onEdit,
}: {
  season: string;
  groups: NationalityGroup[];
  onAdd: () => void;
  onEdit: (group: NationalityGroup) => void;
}) {
  const { lang } = useLanguage();
  const k: Lang = lang === "ar" ? "ar" : "en";
  const c = nationalityCopy;

  /* The strip is the same in both states: it says what the whole tab is
     for, and N0 needs it more than N does. */
  const intro = (
    <div className="rounded-xl bg-[#e8f6ec] px-4 py-3">
      <p className="text-[12px] leading-5 text-[#1e7a4c]">{c.intro[k]}</p>
    </div>
  );

  if (groups.length === 0) {
    return (
      <div className="space-y-4">
        {intro}
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-border-subtle px-6 py-12 text-center">
          <p className="text-[15px] font-semibold text-text-primary">
            {c.emptyTitle[k]}
          </p>
          <p className="max-w-[460px] text-[12.5px] leading-5 text-text-secondary">
            {c.emptyBody[k]}
          </p>
          <Button className="mt-2" onClick={onAdd}>
            {c.add[k]}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {intro}

      <div className="rounded-2xl border border-border-subtle p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-[15px] font-semibold text-text-primary">
              {fill(c.tableTitle[k], { season })}
            </h3>
            <p className="mt-0.5 text-[11.5px] text-text-muted">
              {fill(c.tableSub[k], {
                groups: counted(groups.length, groupsWord, k),
              })}
            </p>
          </div>
          <Button variant="outline" onClick={onAdd}>
            {c.add[k]}
          </Button>
        </div>

        {/* The frame scrolls the table, not the panel, and pins column one. */}
        <div className="mt-3.5 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="bg-[#f8f9f7]">
                <th className="sticky start-0 bg-[#f8f9f7] px-3.5 py-2.5 text-start text-[10px] font-semibold uppercase text-text-quiet">
                  {c.colGroup[k]}
                </th>
                <th className="px-3.5 py-2.5 text-start text-[10px] font-semibold uppercase text-text-quiet">
                  {c.colDiffers[k]}
                </th>
                {seasonRoomPrices.map((row) => (
                  <th
                    key={row.room.en}
                    className="px-3.5 py-2.5 text-start text-[10px] font-semibold uppercase text-text-quiet"
                  >
                    {row.short[k]}
                  </th>
                ))}
                <th className="px-3.5 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => {
                const [what, on] = differs(group, k, lang);
                return (
                  <tr key={group.id} className="border-t border-border-subtle">
                    <td className="sticky start-0 bg-surface-default px-3.5 py-3.5">
                      <p className="text-[12.5px] font-medium text-text-primary">
                        {group.name[k]}
                      </p>
                      <p className="mt-px text-[11px] text-text-muted">
                        {counted(group.countries.length, countriesWord, k)}
                      </p>
                    </td>
                    <td className="px-3.5 py-3.5">
                      <p className="text-[12.5px] text-text-primary">{what}</p>
                      <p className="mt-px text-[11px] text-text-muted">{on}</p>
                    </td>
                    {seasonRoomPrices.map((row) => (
                      <td
                        key={row.room.en}
                        className="px-3.5 py-3.5 text-[12.5px] text-text-primary"
                      >
                        {groupPrice(group, row, lang)}
                      </td>
                    ))}
                    <td className="px-3.5 py-3.5 text-end">
                      {/* A link, not a button: the row is the thing, and
                          four outlined buttons would be four more objects. */}
                      <button
                        type="button"
                        onClick={() => onEdit(group)}
                        className="text-[12.5px] font-medium text-text-primary underline-offset-4 hover:underline"
                      >
                        {c.edit[k]}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {/* BR-03-95 — the row the frame always draws last: whoever is
                  in no group pays the season, and seeing it under the
                  others is how you tell whether a group is worth having. */}
              <tr className="border-t border-border-subtle bg-[#f8f9f7]">
                <td className="sticky start-0 bg-[#f8f9f7] px-3.5 py-3.5">
                  <p className="text-[12.5px] font-medium text-text-primary">
                    {c.everyoneElse[k]}
                  </p>
                  <p className="mt-px text-[11px] text-text-muted">
                    {c.seasonPrices[k]}
                  </p>
                </td>
                <td className="px-3.5 py-3.5 text-[12.5px] text-text-muted">
                  {"\u2014"}
                </td>
                {seasonRoomPrices.map((row) => (
                  <td
                    key={row.room.en}
                    className="px-3.5 py-3.5 text-[12.5px] text-text-primary"
                  >
                    {groupPrice(null, row, lang)}
                  </td>
                ))}
                <td className="px-3.5 py-3.5" />
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/**
 * OV 03.12NA / NE / NX \u2014 adding or editing one group.
 *
 * Three numbered cards in a centred modal: who pays, how the price differs,
 * and what that comes to per room. The third card is the argument for the
 * first two - you never type a group price without the season price beside
 * it, so "\u2212 40" is always read against what it is 40 off.
 *
 * The change is typed in each room's row because that is where its effect
 * is read, but it is one adjustment for the group, not three: BR-03-92
 * gives a group a single adjustment, and the tab prints it as one line.
 * Typing in any row sets it.
 */
function StepCard({
  step,
  sub,
  children,
}: {
  step: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border-subtle p-5">
      <h3 className="text-[13.5px] font-semibold text-text-primary">{step}</h3>
      <p className="mt-0.5 text-[11.5px] text-text-muted">{sub}</p>
      <div className="mt-3.5">{children}</div>
    </section>
  );
}

export function NationalityDrawer({
  season,
  group,
  groups,
  onClose,
  onSave,
  onRemove,
}: {
  season: string;
  /** Set when editing; left out when adding. */
  group?: NationalityGroup | undefined;
  /** BR-03-93 \u2014 every other group in this season, for the clash check. */
  groups: NationalityGroup[];
  onClose: () => void;
  onSave: (group: NationalityGroup) => void;
  onRemove?: (() => void) | undefined;
}) {
  const { lang } = useLanguage();
  const k: Lang = lang === "ar" ? "ar" : "en";
  const c = nationalityCopy;
  const n = (v: number) => v.toLocaleString(lang === "ar" ? "ar-EG" : "en-US");

  const [name, setName] = useState(group?.name[k] ?? "");
  const [picked, setPicked] = useState<Bi[]>(group?.countries ?? []);
  const [term, setTerm] = useState("");
  /* OV 03.12NA picks neither way: step 2 says to pick one, so the form
     does not pick for you. The table still lays itself out as an
     adjustment, because that is what typing in it would make. */
  const [mode, setMode] = useState<PriceMode | null>(group?.mode ?? null);
  const layout: PriceMode = mode ?? "adjust";
  const [adjust, setAdjust] = useState(String(group?.adjust ?? ""));
  const [fixed, setFixed] = useState<Record<string, { weekday: string; weekend: string }>>(
    () =>
      Object.fromEntries(
        seasonRoomPrices.map((row) => [
          row.room.en,
          {
            weekday: String(group?.fixed?.[row.room.en]?.weekday ?? ""),
            weekend: String(group?.fixed?.[row.room.en]?.weekend ?? ""),
          },
        ])
      )
  );

  /* BR-03-93 \u2014 a country already in another group of this season. */
  const others = groups.filter((other) => other.id !== group?.id);
  const clash = useMemo(() => {
    for (const country of picked) {
      const owner = others.find((other) =>
        other.countries.some((item) => item.en === country.en)
      );
      if (owner) return { country: country[k], group: owner.name[k] };
    }
    return null;
  }, [picked, others, k]);

  const visible = countryList.filter(
    (country) =>
      !picked.some((item) => item.en === country.en) &&
      (!term.trim() ||
        `${country.en} ${country.ar}`.toLowerCase().includes(term.toLowerCase()))
  );

  const typed = adjust.trim() !== "" && adjust.trim() !== "-";
  const amount = Number(adjust) || 0;
  const priced = (base: number, room: string, weekend: boolean) =>
    layout === "adjust"
      ? base + amount
      : Number(weekend ? fixed[room]?.weekend : fixed[room]?.weekday) || 0;

  const ready =
    name.trim().length > 0 &&
    picked.length > 0 &&
    !clash &&
    mode !== null &&
    (mode === "adjust"
      ? typed
      : seasonRoomPrices.every(
          (row) =>
            (fixed[row.room.en]?.weekday ?? "").trim() !== "" &&
            (fixed[row.room.en]?.weekend ?? "").trim() !== ""
        ));

  const save = () =>
    onSave({
      id: group?.id ?? `NG-${Date.now()}`,
      name: { en: name.trim(), ar: name.trim() },
      countries: picked,
      mode: layout,
      ...(layout === "adjust"
        ? { adjust: amount }
        : {
            fixed: Object.fromEntries(
              seasonRoomPrices.map((row) => [
                row.room.en,
                {
                  weekday: Number(fixed[row.room.en]?.weekday) || 0,
                  weekend: Number(fixed[row.room.en]?.weekend) || 0,
                },
              ])
            ),
          }),
    });

  return (
    <Modal
      className="max-w-[780px]"
      overline={fill(c.addOverline[k], { season: season.toUpperCase() })}
      title={
        group ? fill(c.editTitle[k], { group: group.name[k] }) : c.addTitle[k]
      }
      meta={group ? c.editNote[k] : c.addBody[k]}
      onClose={onClose}
      footer={
        <div className="flex w-full flex-wrap items-center gap-3">
          {group && onRemove && (
            <Button variant="ghost" onClick={onRemove}>
              {c.removeGroup[k]}
            </Button>
          )}
          <div className="ms-auto flex gap-3">
            <Button variant="outline" onClick={onClose}>
              {c.cancel[k]}
            </Button>
            <Button
              onClick={save}
              disabled={!ready}
              reason={
                clash
                  ? fill(c.clashTitle[k], { country: clash.country })
                  : !ready
                    ? c.oneGroupRule[k]
                    : undefined
              }
            >
              {group ? c.saveChanges[k] : c.save[k]}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/*
          * OV 03.12NX \u2014 the clash, over the whole form. It is not a note
          * beside one field: it is the reason the button will not work, and
          * it names both groups so you can go and fix either one.
          */}
        {clash && (
          <div className="rounded-xl bg-[#fbe7e3] px-4 py-3">
            <p className="text-[12.5px] font-semibold text-status-danger">
              {fill(c.clashTitle[k], { country: clash.country })}
            </p>
            <p className="mt-0.5 text-[12px] leading-5 text-status-danger">
              {fill(c.clash[k], clash)}
            </p>
          </div>
        )}

        {/* -------------------------------------------- 1 \u00b7 who pays */}
        <StepCard step={c.step1[k]} sub={c.step1Sub[k]}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Input
                label={c.groupName[k]}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={c.groupNamePlaceholder[k]}
              />
              <p className="mt-1.5 text-[11.5px] text-text-muted">
                {c.groupNameHint[k]}
              </p>
            </div>

            <div className="min-w-0">
              <Input
                label={c.countriesLabel[k]}
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                placeholder={c.searchCountries[k]}
              />
              <p className="mt-1.5 text-[11.5px] text-text-muted">
                {c.oneGroupRule[k]}
              </p>

              {picked.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {picked.map((country) => (
                    <span
                      key={country.en}
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary-subtle px-2.5 py-1 text-[12px] text-brand-deep"
                    >
                      {country[k]}
                      <button
                        type="button"
                        aria-label={country[k]}
                        onClick={() =>
                          setPicked((current) =>
                            current.filter((item) => item.en !== country.en)
                          )
                        }
                      >
                        <X className="h-3 w-3" aria-hidden="true" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* The list only opens once you are looking for something -
                  six countries picked already fill the box. */}
              {term.trim() !== "" && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {visible.slice(0, 10).map((country) => (
                    <button
                      key={country.en}
                      type="button"
                      onClick={() => {
                        setPicked((current) => [...current, country]);
                        setTerm("");
                      }}
                      className="rounded-lg border border-border-default px-2.5 py-1 text-[12px] text-text-secondary transition-colors hover:bg-surface-subtle"
                    >
                      {country[k]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </StepCard>

        {/* ---------------------------------- 2 \u00b7 how the price differs */}
        <StepCard step={c.step2[k]} sub={c.step2Sub[k]}>
          <RadioGroup
            className="grid gap-4 sm:grid-cols-2"
            value={mode ?? ""}
            onValueChange={(value) => setMode(value as PriceMode)}
          >
            {(
              [
                ["adjust", c.adjustLabel[k], c.adjustHint[k]],
                ["fixed", c.fixedLabel[k], c.fixedHint[k]],
              ] as Array<[PriceMode, string, string]>
            ).map(([value, label, hint]) => (
              <label
                key={value}
                className={cn(
                  "flex cursor-pointer gap-3 rounded-xl border p-3.5 transition-colors",
                  mode === value
                    ? "border-primary bg-[#eef8f1]"
                    : "border-border-subtle"
                )}
              >
                <RadioGroupItem value={value} className="mt-0.5" />
                <span className="min-w-0">
                  <span className="block text-[12.5px] font-semibold text-text-primary">
                    {label}
                  </span>
                  <span className="mt-0.5 block text-[11.5px] leading-4 text-text-muted">
                    {hint}
                  </span>
                </span>
              </label>
            ))}
          </RadioGroup>
        </StepCard>

        {/* -------------------------------- 3 \u00b7 what the group will pay */}
        <StepCard
          step={c.step3[k]}
          sub={
            group
              ? fill(c.becomes[k], { group: group.name[k] })
              : c.fillsIn[k]
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="bg-[#f8f9f7]">
                  {[c.colRoom[k], c.colSeasonPrice[k], c.colChange[k], c.colGroupPrice[k]].map(
                    (cell) => (
                      <th
                        key={cell}
                        className="px-3.5 py-2.5 text-start text-[10px] font-semibold uppercase text-text-quiet"
                      >
                        {cell}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {seasonRoomPrices.map((row) => {
                  const weekday = priced(row.weekday, row.room.en, false);
                  const weekend = priced(row.weekend, row.room.en, true);
                  const filled =
                    layout === "adjust"
                      ? typed
                      : (fixed[row.room.en]?.weekday ?? "").trim() !== "" &&
                        (fixed[row.room.en]?.weekend ?? "").trim() !== "";
                  const under =
                    filled &&
                    ((weekday > 0 && weekday < row.floor) ||
                      (weekend > 0 && weekend < row.floor));
                  return (
                    <tr
                      key={row.room.en}
                      className="border-t border-border-subtle align-middle"
                    >
                      <td className="px-3.5 py-3 text-[12.5px] text-text-primary">
                        {row.room[k]}
                        {/* BR-03-96 \u2014 under this room's own floor. */}
                        {under && (
                          <p className="mt-1 max-w-[180px] text-[11px] leading-4 text-status-warning">
                            {fill(c.belowFloor[k], {
                              floor: money(row.floor, lang),
                            })}
                          </p>
                        )}
                      </td>
                      <td className="px-3.5 py-3 text-[12.5px] text-text-secondary">
                        {n(row.weekday)} / {n(row.weekend)}
                      </td>
                      <td className="px-3.5 py-3">
                        {layout === "adjust" ? (
                          <Input
                            aria-label={`${row.room[k]} \u00b7 ${c.colChange[k]}`}
                            className="w-[104px]"
                            inputMode="numeric"
                            value={
                              typed ? `${amount < 0 ? "\u2212 " : "+ "}${Math.abs(amount)} ${c.sar[k]}` : ""
                            }
                            onChange={(event) => {
                              /* One adjustment, shown in every row - and
                                 typing one is itself the choice of way. */
                              setMode("adjust");
                              setAdjust(
                                event.target.value
                                  .replace(/\u2212/g, "-")
                                  .replace(/[^\d-]/g, "")
                              );
                            }}
                            placeholder={c.changePlaceholder[k]}
                          />
                        ) : (
                          <div className="flex gap-2">
                            <Input
                              aria-label={`${row.room[k]} \u00b7 ${c.weekday[k]}`}
                              className="w-[88px]"
                              inputMode="numeric"
                              value={fixed[row.room.en]?.weekday ?? ""}
                              onChange={(event) =>
                                setFixed((current) => ({
                                  ...current,
                                  [row.room.en]: {
                                    weekday: event.target.value,
                                    weekend: current[row.room.en]?.weekend ?? "",
                                  },
                                }))
                              }
                              placeholder={c.weekday[k]}
                            />
                            <Input
                              aria-label={`${row.room[k]} \u00b7 ${c.weekend[k]}`}
                              className="w-[88px]"
                              inputMode="numeric"
                              value={fixed[row.room.en]?.weekend ?? ""}
                              onChange={(event) =>
                                setFixed((current) => ({
                                  ...current,
                                  [row.room.en]: {
                                    weekday: current[row.room.en]?.weekday ?? "",
                                    weekend: event.target.value,
                                  },
                                }))
                              }
                              placeholder={c.weekend[k]}
                            />
                          </div>
                        )}
                      </td>
                      <td className="px-3.5 py-3">
                        {/* Nothing typed yet, so nothing to promise. */}
                        {!filled ? (
                          <span className="text-[12.5px] text-text-muted">
                            {"\u2014"}
                          </span>
                        ) : (
                          <span
                            className={cn(
                              "text-[12.5px]",
                              under ? "text-status-warning" : "text-text-primary"
                            )}
                          >
                            {n(weekday)} / {n(weekend)}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* BR-03-96 \u2014 ten is a warning, never a block. */}
          {!group && groups.length + 1 > MAX_GROUPS && (
            <p className="mt-2 text-[11.5px] text-status-warning">
              {fill(c.tooMany[k], { n: groups.length + 1 })}
            </p>
          )}
        </StepCard>

        {/* BR-03-94 \u2014 the form ends by saying what a nationality never
            changes, so the three cards above cannot be over-read. */}
        <div className="rounded-xl bg-[#e8f6ec] px-4 py-3">
          <p className="text-[12px] leading-5 text-[#1e7a4c]">
            {c.seasonOwn[k]}
          </p>
        </div>
      </div>
    </Modal>
  );
}

/** The confirm no frame draws. */
export function RemoveGroupDialog({
  group,
  onClose,
  onRemove,
}: {
  group: NationalityGroup;
  onClose: () => void;
  onRemove: () => void;
}) {
  const { lang } = useLanguage();
  const k: Lang = lang === "ar" ? "ar" : "en";
  const c = nationalityCopy;

  return (
    <Modal
      title={fill(c.removeTitle[k], { name: group.name[k] })}
      meta={fill(c.removeBody[k], {
        n: arabicDigits(group.countries.length, k === "ar"),
      })}
      onClose={onClose}
      className="max-w-[520px]"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {c.keepGroup[k]}
          </Button>
          <Button variant="dark" onClick={onRemove}>
            {c.removeGroup[k]}
          </Button>
        </>
      }
    />
  );
}
