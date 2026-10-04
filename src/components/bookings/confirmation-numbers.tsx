/**
 * OV 05.2 — the hotel confirmation number, Flow 12 Row E.
 *
 * Row E is the change: the number is **per room** by default, not one number
 * on the booking. A booking of three rooms carries three numbers, because
 * that is what a hotel issues and what the agent has to quote at the desk.
 *
 * The modes the guide lists are all three: `per room` (the default), `same
 * for all`, and `not issued yet`. Every rule under the field is here too -
 * the character set, the length, the Hoteliana-reference mistake, and the
 * duplicate warning that warns rather than blocks, because a hotel really
 * can issue the same number twice.
 */

import { useId } from "react";
import { AlertTriangle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { fill, useLanguage } from "@/lib/i18n";
import { arDigits } from "@/lib/arabic-count";
import { cn } from "@/lib/utils";

export type ConfirmationMode = "perRoom" | "same" | "pending";

export interface ConfirmationValue {
  mode: ConfirmationMode;
  /** One per room. In `same` mode only the first is used. */
  numbers: string[];
}

export const confirmationCopy = {
  en: {
    legend: "HOTEL CONFIRMATION NUMBER \u00b7 ONE PER ROOM \u00b7 YOU CAN ADD IT LATER",
    intro:
      "Hoteliana needs the number the hotel gives each room. If the hotel has not issued them yet, confirm anyway - the guest is what matters, the paperwork can follow.",
    haveThem: "I have the numbers - all or some",
    haveThemHint: "each number is stored against its room",
    perRoom: "One number per room",
    perRoomHint: "What most hotels issue - one per room, per stay.",
    same: "Same number for all rooms",
    sameHint: "Only when the hotel issued one number for the whole booking",
    pending: "Not issued yet - confirm now, add it later",
    pendingHint: "the booking is still confirmed and the rooms are held",
    room: "Room {n}",
    allRooms: "NUMBER FOR ALL {n} ROOMS",
    bothRooms: "NUMBER FOR BOTH ROOMS",
    storedAgainst: "Hoteliana stores it against {list}. Untick to type one per room.",
    placeholder: "JOM-2026-44182",
    /* The four messages the guide writes under the field. */
    charset: "Use letters, numbers, - / _ . only (max 40).",
    ourReference:
      "This is the Hoteliana reference. Type the number the hotel gave you.",
    duplicate:
      "This number is already on {id} at this hotel. Save anyway if the hotel really issued it twice.",
    cannotRemove:
      "A saved number cannot be removed. Type the correct number, or report an issue.",
    requiredAll: "Type the number, or untick Same number for all rooms.",
    required: "Type the number the hotel gave you for this room.",
  },
  ar: {
    legend: "رقم تأكيد الفندق · واحد لكل غرفة · يمكنك إضافته لاحقًا",
    intro:
      "تحتاج هوتيليانا الرقم الذي يعطيه الفندق لكل غرفة. وإن لم يُصدرها بعد، أكّد على كل حال — النزيل هو المهم، والأوراق تلحق.",
    haveThem: "لديّ الأرقام — كلها أو بعضها",
    haveThemHint: "ويُحفظ كل رقم على غرفته",
    perRoom: "رقم لكل غرفة",
    perRoomHint: "وهو ما تصدره أغلب الفنادق — رقم لكل غرفة في كل إقامة.",
    same: "رقم واحد لكل الغرف",
    sameHint: "فقط حين يصدر الفندق رقمًا واحدًا للحجز كله",
    pending: "لم يصدر بعد — أكّد الآن وأضفه لاحقًا",
    pendingHint: "ويبقى الحجز مؤكّدًا والغرف محجوزة",
    room: "غرفة {n}",
    allRooms: "رقم لكل الغرف الـ{n}",
    bothRooms: "رقم للغرفتين",
    storedAgainst: "تحفظه هوتيليانا على {list}. أزل العلامة لتكتب رقمًا لكل غرفة.",
    placeholder: "JOM-2026-44182",
    charset: "استخدم حروفًا وأرقامًا و - / _ . فقط (٤٠ حرفًا كحدّ أقصى).",
    ourReference: "هذا مرجع هوتيليانا. اكتب الرقم الذي أعطاك إياه الفندق.",
    duplicate:
      "هذا الرقم مسجّل بالفعل على {id} في هذا الفندق. احفظه إن كان الفندق أصدره مرتين فعلًا.",
    cannotRemove:
      "لا يمكن حذف رقم محفوظ. اكتب الرقم الصحيح، أو أبلغ عن مشكلة.",
    requiredAll: "اكتب الرقم، أو ألغِ تحديد «رقم واحد لكل الغرف».",
    required: "اكتب الرقم الذي أعطاك إياه الفندق لهذه الغرفة.",
  },
} as const;

/** 1-40, English letters and digits plus `- / _ .` and a space. */
const ALLOWED = /^[A-Za-z0-9\-/_. ]{1,40}$/;
/** A Hoteliana reference is ours, not the hotel's. */
const OURS = /^HTL-/i;

export type NumberProblem =
  | { kind: "charset" }
  | { kind: "ourReference" }
  | { kind: "duplicate"; id: string }
  | { kind: "cannotRemove" }
  | { kind: "required" }
  | null;

/**
 * The guide's rules in one function, so the sheet and the later dialog can
 * never disagree about what a valid number is.
 */
export function checkNumber(
  raw: string,
  {
    taken = {},
    saved = false,
    required = true,
  }: { taken?: Record<string, string>; saved?: boolean; required?: boolean } = {}
): NumberProblem {
  const value = raw.trim();
  if (!value) {
    /* A number already on the booking cannot be taken away (OV 05.10). */
    if (saved) return { kind: "cannotRemove" };
    return required ? { kind: "required" } : null;
  }
  if (!ALLOWED.test(value)) return { kind: "charset" };
  if (OURS.test(value)) return { kind: "ourReference" };
  const clash = taken[value.toUpperCase()];
  if (clash) return { kind: "duplicate", id: clash };
  return null;
}

/** A duplicate only warns - everything else stops the save. */
export function blocks(problem: NumberProblem): boolean {
  return problem !== null && problem.kind !== "duplicate";
}

function Problem({
  problem,
  /** What an empty field says, which differs between the two layouts. */
  whenEmpty,
}: {
  problem: NumberProblem;
  whenEmpty?: string;
}) {
  const { lang } = useLanguage();
  const c = confirmationCopy[lang === "ar" ? "ar" : "en"];
  if (!problem) return null;

  const warn = problem.kind === "duplicate";
  const text =
    problem.kind === "duplicate"
      ? fill(c.duplicate, { id: problem.id })
      : problem.kind === "charset"
        ? c.charset
        : problem.kind === "ourReference"
          ? c.ourReference
          : problem.kind === "cannotRemove"
            ? c.cannotRemove
            : (whenEmpty ?? c.required);

  return (
    <p
      className={`mt-1.5 flex gap-1.5 text-[11.5px] leading-4 ${
        warn ? "text-status-warning" : "text-status-danger"
      }`}
    >
      {warn && (
        <AlertTriangle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      )}
      {text}
    </p>
  );
}

export function ConfirmationNumbers({
  rooms,
  value,
  onChange,
  /** Numbers already used at this hotel, upper-cased, mapped to their booking. */
  taken = {},
  /** Which room's number is already saved and so cannot be emptied. */
  savedAt = [],
}: {
  rooms: number;
  value: ConfirmationValue;
  onChange: (value: ConfirmationValue) => void;
  taken?: Record<string, string>;
  savedAt?: boolean[];
}) {
  const { lang } = useLanguage();
  const c = confirmationCopy[lang === "ar" ? "ar" : "en"];
  const name = useId();

  const set = (index: number, next: string) => {
    const numbers = [...value.numbers];
    numbers[index] = next;
    onChange({ ...value, numbers });
  };

  /*
   * OV 05.2S \u2014 "same for all" is not a third way of answering, it is a
   * variation of having the numbers: the hotel issued one instead of two.
   * So the frame nests it as a tick under the first option rather than
   * standing it beside it, and the form follows.
   */
  const haveThem = value.mode !== "pending";
  /* A room number is a number the reader reads, so it is written in the
     digits they read. */
  const roomName = (index: number) =>
    fill(c.room, {
      n: lang === "ar" ? arDigits(index + 1) : String(index + 1),
    });
  const roomList = Array.from({ length: rooms }, (_, index) =>
    roomName(index)
  ).join(lang === "ar" ? "\u060c " : " and ");

  return (
    <section className="rounded-xl border border-border-subtle p-4">
      <p className="text-overline text-text-muted">{c.legend}</p>
      <p className="mt-1.5 text-[12px] leading-5 text-text-body">{c.intro}</p>

      <RadioGroup
        className="mt-3"
        value={haveThem ? "have" : "pending"}
        onValueChange={(next) =>
          onChange({
            ...value,
            mode: next === "pending" ? "pending" : "perRoom",
          })
        }
      >
        <label
          className={cn(
            "flex cursor-pointer gap-3 rounded-[10px] border p-3.5 transition-colors",
            haveThem ? "border-primary bg-[#eef8e0]" : "border-border-subtle"
          )}
        >
          <RadioGroupItem value="have" className="mt-0.5" />
          <span className="min-w-0 flex-1">
            <span className="block text-[12.5px] font-semibold text-text-primary">
              {c.haveThem}
            </span>
            <span className="mt-0.5 block text-[11.5px] leading-4 text-text-muted">
              {c.haveThemHint}
            </span>

            {/* One number for the whole booking, when that is what came. */}
            {haveThem && rooms > 1 && (
              <span className="mt-3 flex gap-2.5">
                <Checkbox
                  checked={value.mode === "same"}
                  onCheckedChange={(checked) =>
                    onChange({
                      ...value,
                      mode: checked === true ? "same" : "perRoom",
                    })
                  }
                />
                <span className="min-w-0">
                  <span className="block text-[12.5px] font-semibold text-text-primary">
                    {c.same}
                  </span>
                  <span className="mt-0.5 block text-[11.5px] leading-4 text-text-muted">
                    {c.sameHint}
                  </span>
                </span>
              </span>
            )}
          </span>
        </label>

        <label
          className={cn(
            "flex cursor-pointer gap-3 rounded-[10px] border p-3.5 transition-colors",
            haveThem ? "border-border-subtle" : "border-primary bg-[#eef8e0]"
          )}
        >
          <RadioGroupItem value="pending" className="mt-0.5" />
          <span className="min-w-0">
            <span className="block text-[12.5px] font-semibold text-text-primary">
              {c.pending}
            </span>
            <span className="mt-0.5 block text-[11.5px] leading-4 text-text-muted">
              {c.pendingHint}
            </span>
          </span>
        </label>
      </RadioGroup>

      {value.mode === "same" && (
        <div className="mt-3">
          <Input
            id={`${name}-all`}
            label={rooms === 2 ? c.bothRooms : fill(c.allRooms, { n: rooms })}
            value={value.numbers[0] ?? ""}
            onChange={(event) => set(0, event.target.value)}
            placeholder={c.placeholder}
            maxLength={40}
          />
          <p className="mt-1.5 text-[11.5px] leading-4 text-text-muted">
            {fill(c.storedAgainst, { list: roomList })}
          </p>
          {/* One message under the field, not two saying the same thing. */}
          <Problem
            problem={checkNumber(value.numbers[0] ?? "", {
              taken,
              saved: savedAt[0] ?? false,
            })}
            whenEmpty={c.requiredAll}
          />
        </div>
      )}

      {/* Row E — one field per room, which is the default. */}
      {value.mode === "perRoom" && (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {Array.from({ length: rooms }, (_, index) => (
            <div key={index}>
              <Input
                id={`${name}-${index}`}
                label={roomName(index)}
                value={value.numbers[index] ?? ""}
                onChange={(event) => set(index, event.target.value)}
                placeholder={c.placeholder}
                maxLength={40}
              />
              <Problem
                problem={checkNumber(value.numbers[index] ?? "", {
                  taken,
                  saved: savedAt[index] ?? false,
                })}
              />
            </div>
          ))}
        </div>
      )}

      {value.mode === "pending" && (
        <p className="mt-3 rounded-[10px] bg-surface-subtle px-3.5 py-3 text-[12px] leading-[18px] text-text-body">
          {c.pendingHint}
        </p>
      )}
    </section>
  );
}

/** The tick the frame draws above the field when there are two rooms or more. */
export function SameForAll({
  rooms,
  checked,
  onChange,
}: {
  rooms: number;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  const { lang } = useLanguage();
  const c = confirmationCopy[lang === "ar" ? "ar" : "en"];
  if (rooms < 2) return null;
  return (
    <label className="mt-3 flex cursor-pointer items-center gap-3 text-[12.5px] text-text-primary">
      <Checkbox
        checked={checked}
        onCheckedChange={(next) => onChange(next === true)}
      />
      {c.same}
    </label>
  );
}
