/**
 * Rates & Availability - the one place a contract's weekend is read and named.
 *
 * The authoritative source is the selected contract's details:
 * `detail.weekPricing.weekendDays` (lowercase English weekday names). Every
 * date picker, night summary, weekend label and weekday/weekend split in the
 * module goes through these helpers, so two contracts with different weekends
 * (Fri + Sat, Thu + Fri, ...) never share or default to the same days.
 *
 * Weekday indexes match `Date#getDay()`: 0 = Sunday .. 6 = Saturday.
 *
 * - `null`  - unknown: no contract picked, or its details have not loaded yet.
 *             Callers draw no weekend at all rather than a stale or guessed one.
 * - `[]`    - the contract has no weekend configured. Callers say so.
 */
export type ContractWeekend = number[] | null;

/** API weekday names, Sunday first so the index is the `getDay()` number. */
const API_WEEKDAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

const NAMES = {
  long: {
    en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    ar: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
  },
  short: {
    en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    ar: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
  },
} as const;

/** API weekday names -> sorted, de-duplicated weekday indexes. Unknown names are dropped. */
export function weekendIndexesFromApi(days: readonly string[] | null | undefined): number[] {
  const out = new Set<number>();
  for (const day of days ?? []) {
    const index = API_WEEKDAYS.indexOf(
      String(day).trim().toLowerCase() as (typeof API_WEEKDAYS)[number],
    );
    if (index >= 0) out.add(index);
  }
  return [...out].sort((a, b) => a - b);
}

/**
 * The selected contract's weekend from its Contract Details response.
 * Pass the details only once they belong to the selected contract; anything
 * else (no contract, still loading, another contract's details) is `null`.
 */
export function contractWeekendDays(
  detail: { weekPricing?: { weekendDays?: readonly string[] | null } | null } | null | undefined,
): ContractWeekend {
  if (!detail) return null;
  return weekendIndexesFromApi(detail.weekPricing?.weekendDays);
}

/** True when the weekday index is one of the contract's weekend days. */
export function isWeekendDay(weekend: ContractWeekend, weekday: number): boolean {
  return weekend !== null && weekend.includes(weekday);
}

/** One weekday's name, Sunday = 0. */
export function weekdayName(
  weekday: number,
  lang: "en" | "ar",
  form: "long" | "short" = "short",
): string {
  return NAMES[form][lang][weekday] ?? "";
}

const NO_WEEKEND = { en: "no weekend days set", ar: "لا أيام عطلة محددة" } as const;
const UNKNOWN_WEEKEND = { en: "loading…", ar: "جارٍ التحميل…" } as const;

/**
 * The contract's weekend as one phrase ("Fri, Sat" / "الجمعة، السبت").
 * An empty weekend says so, and an unknown one says it is loading - neither
 * ever falls back to a fixed pair of days.
 */
export function formatWeekend(
  weekend: ContractWeekend,
  lang: "en" | "ar",
  form: "long" | "short" = "short",
): string {
  if (weekend === null) return UNKNOWN_WEEKEND[lang];
  if (!weekend.length) return NO_WEEKEND[lang];
  return weekend.map((day) => weekdayName(day, lang, form)).join(lang === "ar" ? "، " : ", ");
}

/** Both languages at once, for components that pick the language themselves. */
export function formatWeekendBi(
  weekend: ContractWeekend,
  form: "long" | "short" = "short",
): { en: string; ar: string } {
  return { en: formatWeekend(weekend, "en", form), ar: formatWeekend(weekend, "ar", form) };
}
