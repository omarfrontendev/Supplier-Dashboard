/**
 * OV 04.BP* / 04.BS* / 04.BR* / 04.BX* — the four bulk overlays, as one.
 *
 * Bulk rates, Stop sale / On Request, Release and Restrictions are one
 * component in the frames with four middles, and the shell around them
 * never changes: pick nights, pick rooms, set the one thing this overlay
 * sets, press Add, repeat. Nothing is written until the whole list is
 * reviewed and confirmed together.
 *
 * That last part is the rebuild. The old overlays saved as you went; these
 * build a list first, so a session of changes is read once rather than a
 * dialog at a time - and the review step is where the difference between
 * the four finally shows. Stop sale applies the moment you confirm, because
 * you cannot sell a night you have already closed. Prices, release and stay
 * rules are drafts until Review & publish.
 *
 * The right-hand panel is what is already set on this contract. A row that
 * came from the contract itself says so and sends you there, because
 * editing it here would be editing the contract by the back door.
 */

import { useMemo, useState } from "react";
import { ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { StatusPill } from "@/components/layout/page-shell";
import { DatePicker, dateOf, type DayRange } from "@/components/ui/date-picker";
import { CheckDays } from "@/components/rate-calendar/check-days";
import { datePickerCopy } from "@/lib/date-picker-copy";
import { fill, useLanguage } from "@/lib/i18n";
import {
  contractsWord,
  counted,
  countedOf,
  daysWord,
  nightsWord,
  rangesWord,
  roomNightsWord,
  roomsWord,
  rulesWord,
  weekdaysWord,
  weekendNightsWord,
} from "@/lib/arabic-count";
import {
  alreadySet,
  appliesAtOnce,
  bulkCopy,
  bulkKindLabel,
  bulkRooms,
  contractMinNights,
  contractRelease,
  hotelContracts,
  MAX_RELEASE_DAYS,
  type BulkKind,
} from "@/lib/bulk-range-data";
import { panelMotion, scrimMotion, useDismiss } from "@/components/layout/overlay";
import { cn } from "@/lib/utils";

type Lang = "en" | "ar";

/** A range of nights the picker handed back, kept with its own count. */
interface Picked {
  id: string;
  range: DayRange;
  nights: number;
}

/** One change waiting in the list. */
interface Line {
  id: string;
  /** "Stop sale on 16 room-nights" - the bold line, in both languages. */
  what: Bi;
  /** The dates and rooms underneath it. */
  detail: Bi;
  when: Bi;
  rooms: Bi;
  value: Bi;
  tone?: "danger" | "warning" | undefined;
}

interface Bi {
  en: string;
  ar: string;
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <p className="text-[10px] font-semibold uppercase tracking-[0.04em] text-text-quiet">
        {label}
      </p>
      <div className="mt-2">{children}</div>
    </section>
  );
}

/**
 * Nights between two keys, inclusive - the picker counts them the same way.
 * A range with no end is one night: the picker hands that back while only
 * the first night has been clicked.
 */
function nightsIn(range: DayRange): number {
  const start = dateOf(range.start).getTime();
  const end = dateOf(range.end ?? range.start).getTime();
  return Math.round(Math.abs(end - start) / 86400000) + 1;
}

export function BulkRangeOverlay({
  kind,
  contract,
  onClose,
  onEditContract,
}: {
  kind: BulkKind;
  /** The contract this is scoped to, printed as the overline. */
  contract: string;
  onClose: () => void;
  onEditContract?: (() => void) | undefined;
}) {
  const { lang, dir } = useLanguage();
  const k: Lang = lang === "ar" ? "ar" : "en";
  const ar = k === "ar";
  const c = bulkCopy;
  const dp = datePickerCopy[k];
  const n = (v: number) => v.toLocaleString(ar ? "ar-EG" : "en-US");
  /* Every count is a phrase, chosen - Arabic has four forms, not two. */
  const say = (value: number, forms: Parameters<typeof counted>[1]) =>
    counted(value, forms, k);
  /* A year is not a quantity: 2026 must never come out as 2,026. */
  /* A clock inside an Arabic sentence is written in Arabic digits. */
  const clock = (value: string) =>
    ar
      ? value.replace(/[0-9]/g, (digit) => "٠١٢٣٤٥٦٧٨٩"[Number(digit)]!)
      : value;
  const year = (v: number) =>
    ar ? v.toLocaleString("ar-EG", { useGrouping: false }) : String(v);

  /* ---------------------------------------------------------- the form */
  const [picking, setPicking] = useState(false);
  const [picked, setPicked] = useState<Picked[]>([]);
  const [days, setDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [rooms, setRooms] = useState<string[]>([]);

  /* Bulk rates */
  const [priceMode, setPriceMode] = useState("apart");
  const [weekdayPrice, setWeekdayPrice] = useState("");
  const [weekendPrice, setWeekendPrice] = useState("");
  /* An empty form is not a wrong one: the price fields only go red once
     they have been asked for - the weekday when it has been typed in and
     emptied again, the weekend as soon as the weekday has an answer. */
  const [priceTouched, setPriceTouched] = useState(false);
  /* Stop sale */
  const [setTo, setSetTo] = useState("stopSale");
  const [everyContract, setEveryContract] = useState(false);
  /* Release */
  const [releaseMode, setReleaseMode] = useState("days");
  const [releaseDays, setReleaseDays] = useState("3");
  const [releaseAt, setReleaseAt] = useState("18:00");
  /* Restrictions */
  const [minNights, setMinNights] = useState("");
  /*
   * OV 04.BXF - a stay rule covers the whole range or only the contract's
   * weekend. On the nights it does not cover, a guest books as though the
   * rule were not there, which is why this is a sentence and not a filter.
   */
  const [appliesOn, setAppliesOn] = useState<"every" | "weekend">("every");
  /*
   * Check-in and check-out are closed per night, not per range: shutting
   * arrivals on one Friday is the ordinary case, and a single pair of
   * toggles could not say it. The key is the day, the value is what is
   * shut on it.
   */
  const [shut, setShut] = useState<Record<string, { in?: boolean; out?: boolean }>>(
    {}
  );

  /* --------------------------------------------------------- the list */
  const [lines, setLines] = useState<Line[]>([]);
  const [reviewing, setReviewing] = useState(false);
  /** What the banner at the top says, once something has happened. */
  const [note, setNote] = useState<
    | { kind: "added" | "applied" | "drafted"; what: Bi }
    | { kind: "removed"; what: Bi; row: Line }
    | null
  >(null);
  /** Rows saved in this session, so the side panel can show them. */
  const [saved, setSaved] = useState<Line[]>([]);
  const [removed, setRemoved] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);

  const title =
    kind === "bulkRates"
      ? c.bulkRatesTitle[k]
      : kind === "stopSale"
        ? c.stopSaleTitle[k]
        : kind === "release"
          ? c.releaseTitle[k]
          : c.restrictionsTitle[k];
  const body =
    kind === "bulkRates"
      ? c.bulkRatesBody[k]
      : kind === "stopSale"
        ? c.stopSaleBody[k]
        : kind === "release"
          ? c.releaseBody[k]
          : c.restrictionsBody[k];

  /* --------------------------------------------------- what is picked */
  const nights = picked.reduce((sum, item) => sum + item.nights, 0);
  const weekendDays = [4, 5];
  const weekendNights = useMemo(() => {
    const out: string[] = [];
    for (const item of picked) {
      const start = dateOf(item.range.start);
      for (let i = 0; i < item.nights; i += 1) {
        const day = new Date(start);
        day.setDate(start.getDate() + i);
        if (weekendDays.includes(day.getDay())) {
          out.push(
            `${dp.daysShort[day.getDay()]} ${n(day.getDate())} ${dp.monthsShort[day.getMonth()]}`
          );
        }
      }
    }
    return out;
  }, [picked, k]);

  /** Every night that was picked, in order, as real dates. */
  const pickedDates = useMemo(() => {
    const out: Date[] = [];
    for (const item of picked) {
      const start = dateOf(item.range.start);
      for (let i = 0; i < item.nights; i += 1) {
        const day = new Date(start);
        day.setDate(start.getDate() + i);
        out.push(day);
      }
    }
    return out.sort((a, b) => a.getTime() - b.getTime());
  }, [picked]);
  const dayKey = (date: Date) =>
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  /* A night the rule does not cover is not a night you can close. */
  const covered = (date: Date) =>
    appliesOn === "every" || weekendDays.includes(date.getDay());
  const dayLabel = (date: Date) =>
    `${dp.daysShort[date.getDay()]} ${n(date.getDate())} ${dp.monthsShort[date.getMonth()]}`;
  const closedIn = pickedDates.filter(
    (date) => covered(date) && shut[dayKey(date)]?.in
  );
  const closedOut = pickedDates.filter(
    (date) => covered(date) && shut[dayKey(date)]?.out
  );

  const rangeLabel = (item: Picked) => {
    const start = dateOf(item.range.start);
    const end = dateOf(item.range.end ?? item.range.start);
    const same = start.getMonth() === end.getMonth();
    const left = same
      ? n(start.getDate())
      : `${n(start.getDate())} ${dp.monthsShort[start.getMonth()]}`;
    return `${left} - ${n(end.getDate())} ${dp.monthsShort[end.getMonth()]} ${year(end.getFullYear())}`;
  };
  const whenLabel = picked.map(rangeLabel).join(dir === "rtl" ? " و" : " and ");

  /* ------------------------------------------------- what is set, and if */
  const releaseNumber = Number(releaseDays);
  const releaseTooMany =
    kind === "release" &&
    releaseMode === "days" &&
    releaseDays.trim() !== "" &&
    (!Number.isFinite(releaseNumber) || releaseNumber > MAX_RELEASE_DAYS);
  /* Add stays shut while a price is missing, but the box only says
     "fix the field in red" once there is a red field to fix. */
  const priceMissing =
    kind === "bulkRates" &&
    (weekdayPrice.trim() === "" ||
      (priceMode === "apart" && weekendPrice.trim() === ""));
  const priceRed =
    kind === "bulkRates" &&
    ((priceTouched && weekdayPrice.trim() === "") ||
      (priceMode === "apart" &&
        weekdayPrice.trim() !== "" &&
        weekendPrice.trim() === ""));
  const broken = releaseTooMany || priceRed;

  /** The rooms the change reaches, once "all rooms" is resolved. */
  const realRooms = rooms.includes(bulkRooms[0]!.en)
    ? bulkRooms.slice(1)
    : bulkRooms.filter((room) => rooms.includes(room.en));
  const roomNames = (list: Bi[]) => ({
    en: list.map((r) => r.en).join(", "),
    ar: list.map((r) => r.ar).join("، "),
  });

  /* OV 04.BSAC - the other contracts on this hotel, and what each carries. */
  const reach = useMemo(() => {
    if (!everyContract || kind !== "stopSale") return null;
    return hotelContracts.map((item) => {
      const has = realRooms.filter((room) => item.rooms.includes(room.en));
      const missing = realRooms.filter((room) => !item.rooms.includes(room.en));
      return { name: item.name, has, missing };
    });
  }, [everyContract, kind, rooms]);
  const reachRooms = reach
    ? reach.reduce((sum, item) => sum + item.has.length, 0)
    : realRooms.length;

  /** What this overlay is setting, as the list will name it. */
  const setting: Bi = (() => {
    if (kind === "bulkRates") return c.newPrice;
    if (kind === "stopSale") {
      return setTo === "stopSale"
        ? c.stopSale
        : setTo === "openSale"
          ? c.openSale
          : c.onRequest;
    }
    if (kind === "release") {
      return releaseMode === "same"
        ? c.releaseSameDay
        : {
            en: fill(c.releaseLine.en, {
              days: String(releaseNumber || 0),
              at: clock(releaseAt),
            }),
            ar: fill(c.releaseLine.ar, {
              days: countedOf(releaseNumber || 0, daysWord, "ar"),
              at: clock(releaseAt),
            }),
          };
    }
    if (minNights.trim() !== "" && Number(minNights) > 0) {
      return {
        en: fill(c.minimumLine.en, { n: minNights }),
        ar: fill(c.minimumLine.ar, { n: n(Number(minNights)) }),
      };
    }
    if (closedIn.length > 0) return c.checkInClosedLine;
    if (closedOut.length > 0) return c.checkOutClosedLine;
    return c.restrictionsTitle;
  })();

  const total = nights * reachRooms;
  const headline: Bi = (() => {
    const each = (key: Lang) => {
      const what = setting[key];
      const nightPhrase = countedOf(nights, nightsWord, key);
      const totalPhrase = countedOf(total, roomNightsWord, key);
      if (reach) {
        return fill(c.acrossContracts[key], {
          what,
          nights: nightPhrase,
          rooms: countedOf(reachRooms, roomsWord, key),
          contracts: countedOf(reach.length, contractsWord, key),
          total: totalPhrase,
        });
      }
      if (kind === "restrictions") {
        /* OV 04.BXF - "on 8 nights x 9 rooms", not their product: a stay
           rule is not bought by the room-night the way a price is. */
        return fill(c.roomNightsNoTotal[key], {
          what,
          nights: nightPhrase,
          rooms: countedOf(realRooms.length, roomsWord, key),
        });
      }
      if (kind === "bulkRates") {
        return fill(c.roomNightsShort[key], { what, total: totalPhrase });
      }
      if (kind === "release") {
        /* OV 04.BRF - "on 8 nights x 1 room". Release is a moment in
           time, not a quantity of room-nights bought. */
        return fill(c.roomNightsNoTotal[key], {
          what,
          nights: nightPhrase,
          rooms: countedOf(realRooms.length, roomsWord, key),
        });
      }
      if (realRooms.length === 1) {
        return fill(c.roomNightsOne[key], {
          what,
          nights: nightPhrase,
          rooms: countedOf(1, roomsWord, key),
        });
      }
      return fill(c.roomNights[key], {
        what,
        nights: nightPhrase,
        rooms: countedOf(realRooms.length, roomsWord, key),
        total: totalPhrase,
      });
    };
    return { en: each("en"), ar: each("ar") };
  })();

  /* OV 04.BRRW - nights already inside the release window being set. */
  const releasePast = useMemo(() => {
    if (kind !== "release" || releaseMode !== "days" || !releaseNumber) {
      return null;
    }
    const edge = Date.now() + releaseNumber * 86400000;
    const inside = picked.filter(
      (item) => dateOf(item.range.start).getTime() <= edge
    );
    return inside.length > 0 ? inside.map(rangeLabel).join(", ") : null;
  }, [kind, releaseMode, releaseNumber, picked]);

  /* A night, a room and a sound middle are what make a line addable. */
  const canAdd =
    nights > 0 && realRooms.length > 0 && !broken && !priceMissing;
  const rows = alreadySet[kind];
  /* Contract rules whose dates have not started - Inactive, in the
     contract's own table, and not "live" whatever the count says. */
  const dormant = rows.filter((row) => row.inactive).length;
  /* A row saved but not published is not live either. */
  const unpublished = rows.filter((row) => row.draft).length;
  /* English names the number alone, as the frame does; Arabic needs the
     noun with it, because "١ لم تُنشر" is not a sentence. */
  const howMany = (value: number) =>
    k === "ar" ? counted(value, rulesWord, "ar") : String(value);
  const labels = ar ? c.weekdaysAr : c.weekdays;
  const atOnce = appliesAtOnce[kind];

  const clearForm = () => {
    setPicked([]);
    setRooms([]);
    setWeekdayPrice("");
    setWeekendPrice("");
    setPriceTouched(false);
    setMinNights("");
    setEveryContract(false);
  };

  const add = () => {
    const detail = (key: Lang) =>
      `${whenLabel} · ${roomNames(realRooms)[key]}`;
    setLines((current) => [
      ...current,
      {
        id: `L-${Date.now()}`,
        what: headline,
        detail: { en: detail("en"), ar: detail("ar") },
        when: { en: whenLabel, ar: whenLabel },
        rooms: roomNames(realRooms),
        value: setting,
        tone:
          kind === "stopSale" && setTo === "stopSale"
            ? "danger"
            : kind === "stopSale" && setTo === "onRequest"
              ? "warning"
              : undefined,
      },
    ]);
    setNote({ kind: "added", what: headline });
    clearForm();
  };

  const confirm = () => {
    setSaved(lines);
    setNote({
      kind: atOnce ? "applied" : "drafted",
      what: lines[0]?.what ?? headline,
    });
    setLines([]);
    setReviewing(false);
    setFinished(true);
  };

  /* ------------------------------------------------- OV 04.B*RV, review */
  if (reviewing) {
    return (
      <Shell
        dir={dir}
        title={title}
        contract={contract}
        body={c.reviewBody[k]}
        onClose={onClose}
        width="max-w-[800px]"
        footer={
          <>
            <Button variant="outline" onClick={() => setReviewing(false)}>
              {c.backToEdit[k]}
            </Button>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[12px] text-text-quiet">
                {atOnce ? c.appliesNow[k] : c.savedAsDraft[k]}
              </span>
              <Button onClick={confirm}>
                {atOnce ? c.confirmApply[k] : c.saveAllDraft[k]}
              </Button>
            </div>
          </>
        }
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.04em] text-text-quiet">
          {lines.length === 1
            ? c.inYourListOne[k]
            : fill(c.inYourList[k], { n: n(lines.length) })}
        </p>
        <div className="mt-2 space-y-2">
          {lines.map((line) => (
            <div
              key={line.id}
              className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-border-subtle p-4"
            >
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-text-primary">
                  {line.what[k]}
                </p>
                <p className="mt-0.5 text-[12px] text-text-body">
                  {line.detail[k]}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setLines((current) =>
                    current.filter((item) => item.id !== line.id)
                  )
                }
                className="shrink-0 text-[12px] font-medium text-status-danger hover:underline"
              >
                {c.remove[k]}
              </button>
            </div>
          ))}
        </div>

        {/* The one place the four overlays part company. */}
        <div
          className={cn(
            "mt-3 rounded-xl p-4",
            atOnce ? "bg-[#eef8e0]" : "bg-surface-subtle"
          )}
        >
          <p className="text-[12.5px] font-semibold text-text-primary">
            {atOnce ? c.takesEffect[k] : c.savedDraftBand[k]}
          </p>
          <p className="mt-0.5 text-[12px] leading-5 text-text-body">
            {atOnce ? c.takesEffectBody[k] : c.savedDraftBandBody[k]}
          </p>
        </div>
      </Shell>
    );
  }

  /* --------------------------------------------------------- the form */
  return (
    <Shell
      dir={dir}
      title={title}
      contract={contract}
      body={body}
      onClose={onClose}
      width="max-w-[1000px]"
      footer={
        finished ? (
          <Button variant="outline" onClick={onClose}>
            {c.done[k]}
          </Button>
        ) : (
          <>
            <Button variant="outline" onClick={onClose}>
              {c.cancel[k]}
            </Button>
            <div className="flex flex-wrap items-center gap-3">
              {lines.length === 0 && (
                <span className="text-[12px] text-text-quiet">
                  {canAdd ? c.pressAddFirst[k] : c.nothingYet[k]}
                </span>
              )}
              <Button
                disabled={lines.length === 0}
                reason={lines.length === 0 ? c.nothingYet[k] : undefined}
                onClick={() => setReviewing(true)}
              >
                {lines.length === 0
                  ? c.reviewSaveAll[k]
                  : fill(c.reviewCount[k], { n: n(lines.length) })}
              </Button>
            </div>
          </>
        )
      }
    >
      {/* OV 04.B*A / B*V / B*D - what just happened, above everything. */}
      {note && (
        <div
          className={cn(
            "mb-4 flex flex-wrap items-start justify-between gap-3 rounded-xl p-3.5",
            note.kind === "applied" || note.kind === "drafted"
              ? "bg-[#eef8e0]"
              : "bg-surface-subtle"
          )}
        >
          <div className="min-w-0">
            <p className="text-[12.5px] font-semibold text-text-primary">
              {note.kind === "added"
                ? fill(c.addedTitle[k], { what: note.what[k] })
                : note.kind === "applied"
                  ? fill(c.appliedTitle[k], { what: note.what[k] })
                  : note.kind === "drafted"
                    ? fill(c.draftedTitle[k], { what: note.what[k] })
                    : fill(c.removedLine[k], { what: note.what[k] })}
            </p>
            {note.kind !== "removed" && (
              <p className="mt-0.5 text-[12px] leading-5 text-text-body">
                {note.kind === "added"
                  ? c.addedBody[k]
                  : note.kind === "applied"
                    ? c.appliedBody[k]
                    : c.draftedBody[k]}
              </p>
            )}
          </div>
          {note.kind === "removed" && (
            <button
              type="button"
              onClick={() => {
                setRemoved((current) =>
                  current.filter((id) => id !== note.row.id)
                );
                setNote(null);
              }}
              className="shrink-0 text-[12px] font-medium text-text-link hover:underline"
            >
              {c.undo[k]}
            </button>
          )}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-5">
          <Section label={c.nights[k]}>
            <div className="relative flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setPicking(true)}
                className={cn(
                  "h-11 w-full rounded-[10px] border px-3.5 text-start text-[13px] transition-colors sm:w-[210px]",
                  nights > 0
                    ? "border-border-strong text-text-primary"
                    : "border-border-default text-text-muted hover:bg-surface-subtle"
                )}
              >
                {nights === 0
                  ? c.pickNights[k]
                  : fill(c.nightsPicked[k], {
                      nights: say(nights, nightsWord),
                      ranges: say(picked.length, rangesWord),
                    })}
              </button>
              {/*
                * The week, Sunday first, for "weekends only" pickers.
                * Restrictions has no pills: OV 04.BXF asks the same
                * question as a sentence instead - Applies on - because a
                * stay rule either covers the range or covers the
                * contract's weekend, and there is no third answer.
                */}
              <div
                className={cn(
                  "flex-wrap gap-1.5",
                  kind === "restrictions" ? "hidden" : "flex"
                )}
              >
                {labels.map((day, index) => (
                  <button
                    key={day}
                    type="button"
                    aria-pressed={days.includes(index)}
                    onClick={() =>
                      setDays((current) =>
                        current.includes(index)
                          ? current.filter((d) => d !== index)
                          : [...current, index]
                      )
                    }
                    className={cn(
                      "h-9 w-9 rounded-[8px] text-[12px] font-medium transition-colors",
                      days.includes(index)
                        ? "bg-brand-deep text-text-inverse"
                        : "border border-border-default text-text-secondary hover:bg-surface-subtle"
                    )}
                  >
                    {day}
                  </button>
                ))}
              </div>
              <Button
                variant={canAdd ? "dark" : "outline"}
                disabled={!canAdd}
                reason={!canAdd ? c.nightsHint[k] : undefined}
                onClick={add}
              >
                {c.add[k]}
              </Button>
            </div>

            {/* OV 04.B*N - each range as its own chip, and a way out. */}
            {picked.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {picked.map((item) => (
                  <span
                    key={item.id}
                    className="rounded-md bg-surface-subtle px-2.5 py-1 text-[11.5px] text-text-primary"
                  >
                    {fill(c.rangeChip[k], {
                      when: rangeLabel(item),
                      nights: say(item.nights, nightsWord),
                    })}
                  </span>
                ))}
                <button
                  type="button"
                  onClick={() => setPicked([])}
                  className="ms-auto text-[11.5px] font-medium text-text-link hover:underline"
                >
                  {c.clearNights[k]}
                </button>
              </div>
            )}

            <p className="mt-2 max-w-[560px] text-[11.5px] leading-4 text-text-quiet">
              {nights > 0
                ? fill(
                    weekendNights.length === 0
                      ? c.pickedHintWeekdaysOnly[k]
                      : c.pickedHint[k],
                    {
                      nights: say(nights, nightsWord),
                      weekdays: say(
                        nights - weekendNights.length,
                        weekdaysWord
                      ),
                      weekend: fill(c.weekendIn[k], {
                        weekend: say(weekendNights.length, weekendNightsWord),
                        list: weekendNights.join(", "),
                      }),
                    }
                  )
                : lines.length > 0
                  ? c.againHint[k]
                  : c.nightsHint[k]}
            </p>
          </Section>

          <Section label={c.rooms[k]}>
            <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {bulkRooms.map((room) => (
                <label
                  key={room.en}
                  className="flex cursor-pointer items-center gap-2.5 text-[12.5px] text-text-primary"
                >
                  <Checkbox
                    checked={rooms.includes(room.en)}
                    onCheckedChange={(value) =>
                      setRooms((current) =>
                        value === true
                          ? [...current, room.en]
                          : current.filter((r) => r !== room.en)
                      )
                    }
                  />
                  {room[k]}
                </label>
              ))}
            </div>
          </Section>

          {kind === "bulkRates" && (
            <Section label={c.price[k]}>
              <RadioGroup
                className="flex flex-wrap items-center gap-x-5 gap-y-2"
                value={priceMode}
                onValueChange={setPriceMode}
              >
                {(
                  [
                    ["one", c.onePrice[k]],
                    ["apart", c.apartPrice[k]],
                  ] as Array<[string, string]>
                ).map(([value, label]) => (
                  <label
                    key={value}
                    className="flex cursor-pointer items-center gap-2 text-[12.5px] text-text-primary"
                  >
                    <RadioGroupItem value={value} />
                    {label}
                  </label>
                ))}
              </RadioGroup>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <Input
                  label={
                    priceMode === "one" ? c.baseEvery[k] : c.baseWeekday[k]
                  }
                  inputMode="numeric"
                  value={weekdayPrice}
                  onChange={(e) => {
                    setPriceTouched(true);
                    setWeekdayPrice(e.target.value);
                  }}
                  {...(priceTouched && weekdayPrice.trim() === ""
                    ? { error: c.needPrice[k] }
                    : {})}
                />
                {priceMode === "apart" && (
                  <Input
                    label={c.baseWeekend[k]}
                    inputMode="numeric"
                    value={weekendPrice}
                    onChange={(e) => {
                      setPriceTouched(true);
                      setWeekendPrice(e.target.value);
                    }}
                    {...(weekdayPrice.trim() !== "" && weekendPrice.trim() === ""
                      ? { error: c.needWeekendPrice[k] }
                      : {})}
                  />
                )}
              </div>
              <p className="mt-2 max-w-[560px] text-[11.5px] leading-4 text-text-quiet">
                {c.othersFollow[k]}
              </p>
            </Section>
          )}

          {kind === "stopSale" && (
            <Section label={c.setTo[k]}>
              <RadioGroup
                className="flex flex-wrap items-center gap-x-5 gap-y-2"
                value={setTo}
                onValueChange={setSetTo}
              >
                {(
                  [
                    ["stopSale", c.stopSale[k], undefined],
                    ["openSale", c.openSale[k], undefined],
                    ["onRequest", c.onRequest[k], c.onRequestHint[k]],
                  ] as Array<[string, string, string | undefined]>
                ).map(([value, label, hint]) => (
                  <label
                    key={value}
                    className="flex cursor-pointer items-center gap-2 text-[12.5px] text-text-primary"
                  >
                    <RadioGroupItem value={value} />
                    {label}
                    {hint && (
                      <span className="text-[11.5px] text-text-quiet">
                        {hint}
                      </span>
                    )}
                  </label>
                ))}
              </RadioGroup>
              <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-[12.5px] text-text-primary">
                <Checkbox
                  checked={everyContract}
                  onCheckedChange={(v) => setEveryContract(v === true)}
                />
                {c.everyContract[k]}
              </label>
              <p className="mt-1 text-[11.5px] leading-4 text-text-quiet">
                {c.everyContractHint[k]}
              </p>
            </Section>
          )}

          {kind === "release" && (
            <Section label={c.release[k]}>
              <RadioGroup
                className="flex flex-wrap items-center gap-x-5 gap-y-2"
                value={releaseMode}
                onValueChange={setReleaseMode}
              >
                <label className="flex cursor-pointer items-center gap-2 text-[12.5px] font-medium text-text-primary">
                  <RadioGroupItem value="days" />
                  {c.numberOfDays[k]}
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-[12.5px] text-text-primary">
                  <RadioGroupItem value="same" />
                  {c.sameDay[k]}
                  <span className="text-[11.5px] text-text-quiet">
                    {c.sameDayHint[k]}
                  </span>
                </label>
              </RadioGroup>
              {releaseMode === "days" && (
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <div>
                    <Input
                      label={c.daysBefore[k]}
                      inputMode="numeric"
                      value={releaseDays}
                      onChange={(e) => setReleaseDays(e.target.value)}
                      {...(releaseTooMany
                        ? {
                            error: fill(c.releaseTooMany[k], {
                              max: n(MAX_RELEASE_DAYS),
                            }),
                          }
                        : {})}
                    />
                    {/* OV 04.BRRE - the fix is one press, not a re-read. */}
                    {releaseTooMany ? (
                      <button
                        type="button"
                        onClick={() => setReleaseDays(String(MAX_RELEASE_DAYS))}
                        className="mt-1 text-[11.5px] font-medium text-text-link hover:underline"
                      >
                        {fill(c.useMaxDays[k], { max: n(MAX_RELEASE_DAYS) })}
                      </button>
                    ) : (
                      <p className="mt-1 text-[11.5px] text-text-quiet">
                        {c.daysRange[k]}
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      label={c.at[k]}
                      value={releaseAt}
                      onChange={(e) => setReleaseAt(e.target.value)}
                    />
                    <p className="mt-1 text-[11.5px] text-text-quiet">
                      {c.makkahTime[k]}
                    </p>
                  </div>
                </div>
              )}
            </Section>
          )}

          {kind === "restrictions" && (
            <>
              <Section label={c.stayRules[k]}>
                <div>
                  <Input
                    label={c.minimumNights[k]}
                    className="w-[196px]"
                    inputMode="numeric"
                    value={minNights}
                    onChange={(e) => setMinNights(e.target.value)}
                  />
                  <p className="mt-1 text-[11.5px] text-text-quiet">
                    {c.noMinimum[k]}
                  </p>
                </div>

                {/* OV 04.BXF - the whole range, or the contract's weekend. */}
                <p className="mt-3.5 text-[12.5px] font-medium text-text-primary">
                  {c.appliesOn[k]}
                </p>
                <div className="mt-1.5 grid max-w-[668px] grid-cols-1 overflow-hidden rounded-[10px] bg-surface-subtle p-1 sm:grid-cols-2">
                  {(
                    [
                      ["every", c.appliesEvery[k]],
                      ["weekend", c.appliesWeekend[k]],
                    ] as Array<["every" | "weekend", string]>
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={appliesOn === value}
                      onClick={() => setAppliesOn(value)}
                      className={cn(
                        "rounded-lg px-4 py-2.5 text-[13px] font-medium transition-colors",
                        appliesOn === value
                          ? "bg-surface-default text-text-primary shadow-card"
                          : "text-text-muted hover:text-text-primary"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <p className="mt-1.5 max-w-[668px] text-[11.5px] leading-4 text-text-quiet">
                  {c.appliesOnHint[k]}
                </p>
              </Section>

              {/* OV 04.BXE / BXF - the picked nights, day by day. */}
              <Section label={c.checkDays[k]}>
                {pickedDates.length === 0 ? (
                  <div className="rounded-xl bg-surface-subtle p-3.5">
                    <p className="max-w-[620px] text-[12px] leading-5 text-text-body">
                      {c.checkDaysEmpty[k]}
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-[12px] text-text-body">
                      {c.checkDaysLead[k]}
                    </p>
                    <CheckDays
                      dates={pickedDates}
                      covered={covered}
                      shut={shut}
                      onToggle={(keys: string[], what: "in" | "out") =>
                        setShut((current) => {
                          const next = { ...current };
                          /* A weekday name closes the whole column, so
                             the first open day decides for all of them. */
                          const closing = keys.some(
                            (key: string) => !next[key]?.[what]
                          );
                          for (const key of keys) {
                            next[key] = { ...next[key], [what]: closing };
                          }
                          return next;
                        })
                      }
                      k={k}
                      c={c}
                      dp={dp}
                      n={n}
                      year={year}
                      dayKey={dayKey}
                    />
                  </>
                )}
              </Section>
            </>
          )}

          {/* OV 04.BSAC - every contract on this hotel, named one by one. */}
          {reach && (
            <div className="rounded-xl bg-[#fdf0d9] p-3.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.04em] text-[#8a5a00]">
                {c.alsoCloses[k]}
              </p>
              <div className="mt-1.5 space-y-0.5">
                {reach.map((item) => (
                  <p
                    key={item.name.en}
                    className="text-[12px] leading-5 text-[#8a5a00]"
                  >
                    {item.name[k]} · {roomNames(item.has)[k]}
                    {item.missing.length > 0 && (
                      <>
                        {" "}
                        {fill(c.notOnContract[k], {
                          room: roomNames(item.missing)[k],
                        })}
                      </>
                    )}
                  </p>
                ))}
              </div>
              <p className="mt-1.5 text-[11.5px] leading-4 text-[#8a5a00]/70">
                {c.matchedByName[k]}
              </p>
            </div>
          )}

          {/*
            * OV 04.B*E / B*N / B*F / BRRW / BRRE - one box, four tempers.
            * Grey while it has nothing to say, green when the change is
            * sound, amber when it is sound but has a consequence, and red
            * text when a field has to be fixed first.
            */}
          <div
            className={cn(
              "rounded-xl p-3.5",
              broken
                ? "bg-surface-subtle"
                : releasePast
                  ? "bg-[#fdf0d9]"
                  : canAdd
                    ? "bg-[#eef8e0]"
                    : "bg-surface-subtle"
            )}
          >
            <p
              className={cn(
                "text-[10px] font-semibold uppercase tracking-[0.04em]",
                !broken && releasePast ? "text-[#8a5a00]" : "text-text-quiet"
              )}
            >
              {c.whatWillHappen[k]}
            </p>
            {broken ? (
              <p className="mt-1 text-[12px] leading-5 text-status-danger">
                {c.fixRed[k]}
              </p>
            ) : canAdd ? (
              <>
                <p
                  className={cn(
                    "mt-1 text-[12.5px] font-semibold",
                    releasePast ? "text-[#8a5a00]" : "text-text-primary"
                  )}
                >
                  {headline[k]}
                </p>
                {releasePast && (
                  <p className="mt-1 text-[12px] font-semibold leading-5 text-status-danger">
                    ⚠{" "}
                    {fill(c.releaseAlreadyPast[k], {
                      when: releasePast,
                      days: countedOf(releaseNumber, daysWord, k),
                    })}
                  </p>
                )}
                <ul className="mt-1 space-y-0.5">
                  {(kind === "restrictions"
                    ? [
                        /* OV 04.BXF - which nights lost an arrival or a
                           departure, named; then what happens after them,
                           who it reaches, and that it is still a draft. */
                        closedIn.length && closedOut.length
                          ? fill(c.bulletChecksBoth[k], {
                              in: closedIn.map(dayLabel).join(ar ? "، " : ", "),
                              out: closedOut
                                .map(dayLabel)
                                .join(ar ? "، " : ", "),
                            })
                          : closedIn.length
                            ? fill(c.bulletChecksIn[k], {
                                in: closedIn
                                  .map(dayLabel)
                                  .join(ar ? "، " : ", "),
                              })
                            : closedOut.length
                              ? fill(c.bulletChecksOut[k], {
                                  out: closedOut
                                    .map(dayLabel)
                                    .join(ar ? "، " : ", "),
                                })
                              : c.bulletChecksNone[k],
                        fill(c.bulletOnlyThese[k], {
                          n: n(contractMinNights),
                        }),
                        c.bulletSearchesOnly[k],
                        c.bulletRuleDraft[k],
                      ]
                    : kind === "release"
                    ? [
                        fill(c.bulletReplacesRelease[k], {
                          rooms: roomNames(realRooms)[k],
                          days: n(contractRelease),
                        }),
                        fill(c.bulletReleaseBack[k], {
                          days: n(releaseNumber || 0),
                          at: clock(releaseAt),
                        }),
                        c.bulletReleaseDraft[k],
                      ]
                    : [
                        reach
                          ? fill(c.bulletHotel[k], {
                              contracts: reach
                                .map((item) => item.name[k])
                                .join(ar ? "، " : ", "),
                              when: whenLabel,
                            })
                          : fill(c.bulletRooms[k], {
                              rooms: roomNames(realRooms)[k],
                              when: whenLabel,
                            }),
                        c.bulletHeld[k],
                        c.bulletDraft[k],
                      ]
                  ).map((line) => (
                    <li
                      key={line}
                      className={cn(
                        "text-[12px] leading-5",
                        releasePast ? "text-[#8a5a00]" : "text-text-body"
                      )}
                    >
                      · {line}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="mt-1 max-w-[560px] text-[12px] leading-5 text-text-body">
                {nights > 0
                  ? fill(c.nightsPickedHappen[k], {
                      nights: say(nights, nightsWord),
                      when: whenLabel,
                    })
                  : c.whatWillHappenBody[k]}
              </p>
            )}
          </div>
        </div>

        {/* What is already set, and who may change each row. */}
        <aside className="rounded-xl bg-surface-subtle p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.04em] text-text-quiet">
            {fill(c.alreadySet[k], { kind: bulkKindLabel[kind][k] })}
          </p>
          <p className="mt-1 text-[12.5px] font-medium text-text-primary">
            {lines.length > 0
              ? fill(c.inList[k], {
                  n: n(rows.length + lines.length),
                  m: n(lines.length),
                })
              : dormant > 0
                ? fill(c.onThisContractSome[k], {
                    n: rows.length + saved.length,
                    inactive: howMany(dormant),
                  })
                : unpublished > 0
                  ? fill(c.onThisContractDraft[k], {
                      n: rows.length + saved.length,
                      drafts: howMany(unpublished),
                    })
                  : fill(c.onThisContract[k], {
                      n: rows.length + saved.length,
                    })}
          </p>
          <div className="mt-3 space-y-2">
            {/* Anything added or saved in this session sits on top. */}
            {[...lines, ...saved].map((line) => (
              <div
                key={line.id}
                className={cn(
                  "rounded-[10px] bg-surface-default p-3",
                  removed.includes(line.id)
                    ? "opacity-70"
                    : "ring-1 ring-brand-deep"
                )}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p
                    className={cn(
                      "text-[12.5px] font-semibold text-text-primary",
                      removed.includes(line.id) && "line-through"
                    )}
                  >
                    {line.when[k]}
                  </p>
                  <p
                    className={cn(
                      "text-[12px] font-medium",
                      removed.includes(line.id) && "line-through",
                      line.tone === "danger"
                        ? "text-status-danger"
                        : line.tone === "warning"
                          ? "text-status-warning"
                          : "text-text-primary"
                    )}
                  >
                    {line.value[k]}
                  </p>
                </div>
                <p className="mt-0.5 text-[11px] text-text-body">
                  {line.rooms[k]}
                </p>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <StatusPill
                    tone={
                      removed.includes(line.id)
                        ? "warning"
                        : saved.some((item) => item.id === line.id)
                          ? atOnce
                            ? "success"
                            : "warning"
                          : "warning"
                    }
                  >
                    {removed.includes(line.id)
                      ? c.removedPill[k]
                      : saved.some((item) => item.id === line.id)
                        ? atOnce
                          ? c.newLive[k]
                          : c.newDraft[k]
                        : c.newNotSaved[k]}
                  </StatusPill>
                  {!removed.includes(line.id) && (
                    <span className="flex items-center gap-3 text-[11.5px] font-medium">
                      <button
                        type="button"
                        className="text-text-link hover:underline"
                      >
                        {c.edit[k]}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRemoved((current) => [...current, line.id]);
                          setLines((current) =>
                            current.filter((item) => item.id !== line.id)
                          );
                          setNote({
                            kind: "removed",
                            what: {
                              en: fill(c.removedWhat.en, {
                                rooms: line.rooms.en,
                                when: line.when.en,
                              }),
                              ar: fill(c.removedWhat.ar, {
                                rooms: line.rooms.ar,
                                when: line.when.ar,
                              }),
                            },
                            row: line,
                          });
                        }}
                        className="text-status-danger hover:underline"
                      >
                        {c.delete[k]}
                      </button>
                    </span>
                  )}
                </div>
              </div>
            ))}

            {rows.map((row) => (
              <div
                key={row.when.en}
                className="rounded-[10px] bg-surface-default p-3"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-[12.5px] font-semibold text-text-primary">
                    {row.when[k]}
                  </p>
                  <p
                    className={cn(
                      "text-[12px] font-medium",
                      row.tone === "danger"
                        ? "text-status-danger"
                        : row.tone === "warning"
                          ? "text-status-warning"
                          : "text-text-primary"
                    )}
                  >
                    {row.value[k]}
                  </p>
                </div>
                <p className="mt-0.5 text-[11px] text-text-body">
                  {row.rooms[k]}
                </p>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  {row.fromContract ? (
                    <>
                      <span className="flex flex-wrap items-center gap-1.5">
                        <StatusPill tone="neutral">
                          {c.fromContract[k]}
                        </StatusPill>
                        {/* A rule dated for a season that has not begun. */}
                        {row.inactive && (
                          <StatusPill tone="warning">
                            {c.notActive[k]}
                          </StatusPill>
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={onEditContract}
                        className="inline-flex items-center gap-1 text-[11.5px] font-medium text-text-link hover:underline"
                      >
                        {c.editInContract[k]}
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </button>
                    </>
                  ) : (
                    <>
                      <StatusPill tone={row.draft ? "warning" : "success"}>
                        {row.draft ? c.newDraft[k] : c.live[k]}
                      </StatusPill>
                      <span className="flex items-center gap-3 text-[11.5px] font-medium">
                        <button
                          type="button"
                          className="text-text-link hover:underline"
                        >
                          {c.edit[k]}
                        </button>
                        <button
                          type="button"
                          className="text-status-danger hover:underline"
                        >
                          {c.delete[k]}
                        </button>
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* OV 04.B*K - the picker, over the panel it covers in the frame. */}
      {picking && (
        <div className="absolute inset-0 z-10 flex items-start justify-end bg-brand-deep/10 p-4">
          <DatePicker
            className="w-[300px]"
            onApply={(range) => {
              setPicked((current) => [
                ...current,
                { id: `R-${Date.now()}`, range, nights: nightsIn(range) },
              ]);
              setPicking(false);
            }}
            onCancel={() => setPicking(false)}
          />
        </div>
      )}
    </Shell>
  );
}

/** The modal the four overlays and the review step all sit in. */
function Shell({
  dir,
  contract,
  title,
  body,
  width,
  footer,
  onClose,
  children,
}: {
  dir: string;
  contract: string;
  title: string;
  body: string;
  width: string;
  footer: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const dismiss = useDismiss({ onClose });
  return (
    <div
      dir={dir}
      {...dismiss.scrim}
      aria-label={title}
      className={cn(
        "fixed inset-0 z-50 overflow-y-auto bg-brand-deep/40 p-4",
        scrimMotion
      )}
    >
      <div className="flex min-h-full items-center justify-center">
        <div
          {...dismiss.panel}
          className={cn(
            "relative w-full rounded-2xl bg-surface-default p-6 shadow-overlay sm:p-7",
            panelMotion,
            width
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-text-quiet">
                {contract}
              </p>
              <h2 className="mt-1 text-[22px] font-semibold text-text-primary">
                {title}
              </h2>
              <p className="mt-1 max-w-[620px] text-[13px] leading-5 text-text-body">
                {body}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-full bg-surface-subtle p-2 text-text-muted transition-colors hover:text-text-primary"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-5">{children}</div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle pt-5">
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
}
