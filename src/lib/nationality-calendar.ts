/**
 * OV 04.1PN / 04.1PN0 and UI 04.1TGCC / 04.1TIM / 04.1TPK —
 * "Prices for", on Rates & Availability.
 *
 * The contract sets nationality prices inside a season (OV 03.12N). This is
 * the other half of that: the calendar showing what one group actually pays,
 * night by night, so the supplier can check the answer rather than work it
 * out from an adjustment and a season table.
 *
 * BR-03-91 is the whole rule and the banner says it every time: nationality
 * prices live inside a season only. On 1 - 19 Mar 2027 the group's price
 * applies; from 20 Mar there is no season, so every guest pays the contract
 * price and the three grids become identical again.
 *
 * Two ways of differing, per BR-03-92. GCC nationals and Indonesia &
 * Malaysia take an adjustment on the season price - it follows the season
 * wherever it moves. Pakistan has a fixed price per room, which is why its
 * numbers are listed here one by one rather than computed: a fixed price is
 * a number someone typed, and the moment it is derived from the season it
 * stops being fixed.
 */

import { seasonOf } from "@/lib/rate-grid-data";

export interface Bi {
  en: string;
  ar: string;
}

const t = (en: string, ar: string): Bi => ({ en, ar });

export type CalendarGroupId = "everyone" | "gcc" | "im" | "pk";

/** The seasons this contract priced by nationality. Hajj has none. */
const SEASONS_WITH_GROUPS = ["Ramadan", "Last ten nights"];

export interface CalendarGroup {
  id: CalendarGroupId;
  /** The name in the field and in the menu. */
  name: Bi;
  /** The menu's own wording, which is longer than the field's. */
  option: Bi;
  /** OV 04.1PN - what this group does to the season price. */
  meta: Bi;
  /** OV 04.1PN0 - the same line when no night on screen has a season. */
  metaNone: Bi;
  /** UI 04.1T* - the band above the grid. Everyone has none. */
  banner?: { title: Bi; body: Bi };
}

export const calendarGroups: CalendarGroup[] = [
  {
    id: "everyone",
    name: t("Everyone", "الجميع"),
    option: t("Everyone · season price", "الجميع · سعر الموسم"),
    meta: t("Guests from any other country", "نزلاء من أي دولة أخرى"),
    metaNone: t("Every guest pays the same", "يدفع كل نزيل السعر نفسه"),
  },
  {
    id: "gcc",
    name: t("GCC nationals", "مواطنو الخليج"),
    option: t("GCC nationals", "مواطنو الخليج"),
    meta: t(
      "− 40 SAR on the season price · 6 countries",
      "− ٤٠ ر.س على سعر الموسم · ٦ دول"
    ),
    metaNone: t(
      "Only in Ramadan and Last ten nights",
      "فقط في رمضان والعشر الأواخر"
    ),
    banner: {
      title: t("GCC nationals prices", "أسعار مواطني الخليج"),
      body: t(
        "Showing prices for GCC nationals: 40 SAR less than the season price in Ramadan and Last ten nights (1 - 19 Mar). From 20 Mar there is no season, so everyone pays the contract price.",
        "نعرض أسعار مواطني الخليج: أقل بـ٤٠ ر.س من سعر الموسم في رمضان والعشر الأواخر (١ - ١٩ مارس). ومن ٢٠ مارس لا يوجد موسم، فيدفع الجميع سعر العقد."
      ),
    },
  },
  {
    id: "im",
    name: t("Indonesia & Malaysia", "إندونيسيا وماليزيا"),
    option: t("Indonesia & Malaysia", "إندونيسيا وماليزيا"),
    meta: t(
      "+ 60 SAR on the season price · 2 countries",
      "+ ٦٠ ر.س على سعر الموسم · دولتان"
    ),
    metaNone: t(
      "Only in Ramadan and Last ten nights",
      "فقط في رمضان والعشر الأواخر"
    ),
    banner: {
      title: t("Indonesia & Malaysia prices", "أسعار إندونيسيا وماليزيا"),
      body: t(
        "Showing prices for Indonesia & Malaysia: 60 SAR more than the season price in Ramadan and Last ten nights (1 - 19 Mar). From 20 Mar everyone pays the contract price.",
        "نعرض أسعار إندونيسيا وماليزيا: أعلى بـ٦٠ ر.س من سعر الموسم في رمضان والعشر الأواخر (١ - ١٩ مارس). ومن ٢٠ مارس يدفع الجميع سعر العقد."
      ),
    },
  },
  {
    id: "pk",
    name: t("Pakistan", "باكستان"),
    option: t("Pakistan", "باكستان"),
    meta: t(
      "Fixed price per room in the season",
      "سعر ثابت لكل غرفة في الموسم"
    ),
    metaNone: t(
      "Only in Ramadan and Last ten nights",
      "فقط في رمضان والعشر الأواخر"
    ),
    banner: {
      title: t("Pakistan prices", "أسعار باكستان"),
      body: t(
        "Showing prices for Pakistan: the fixed prices you set in Ramadan and Last ten nights (1 - 19 Mar). From 20 Mar everyone pays the contract price.",
        "نعرض أسعار باكستان: الأسعار الثابتة التي حدّدتها في رمضان والعشر الأواخر (١ - ١٩ مارس). ومن ٢٠ مارس يدفع الجميع سعر العقد."
      ),
    },
  },
];

/** SAR on the season price, for the two groups that take one. */
const adjustment: Partial<Record<CalendarGroupId, number>> = {
  gcc: -40,
  im: 60,
};

/**
 * UI 04.1TPK — Pakistan's fixed price per room, per season, weekday and
 * weekend. Three of these rooms are the ones the season's own nationality
 * table lists (OV 03.12N); the rest are the contract's other offers, priced
 * the same way. They are written out because they were typed, not derived.
 */
const pakistanFixed: Record<
  string,
  Record<string, { weekday: number; weekend: number }>
> = {
  "Standard Room · City View": {
    Ramadan: { weekday: 690, weekend: 790 },
    "Last ten nights": { weekday: 1050, weekend: 1150 },
  },
  "Standard Room · Haram View": {
    Ramadan: { weekday: 800, weekend: 900 },
    "Last ten nights": { weekday: 1160, weekend: 1260 },
  },
  "Triple Room · City View": {
    Ramadan: { weekday: 780, weekend: 880 },
    "Last ten nights": { weekday: 1140, weekend: 1240 },
  },
  "Quad Room · City View": {
    Ramadan: { weekday: 880, weekend: 980 },
    "Last ten nights": { weekday: 1240, weekend: 1340 },
  },
  "Deluxe Room · City View": {
    Ramadan: { weekday: 840, weekend: 940 },
    "Last ten nights": { weekday: 1200, weekend: 1300 },
  },
  "Deluxe Room · Partial Haram View": {
    Ramadan: { weekday: 980, weekend: 1080 },
    "Last ten nights": { weekday: 1340, weekend: 1440 },
  },
  "Deluxe Room · Haram View": {
    Ramadan: { weekday: 1060, weekend: 1160 },
    "Last ten nights": { weekday: 1420, weekend: 1520 },
  },
  "Family Room · City View": {
    Ramadan: { weekday: 900, weekend: 1000 },
    "Last ten nights": { weekday: 1260, weekend: 1360 },
  },
  "Junior Suite · Haram View": {
    Ramadan: { weekday: 1130, weekend: 1230 },
    "Last ten nights": { weekday: 1490, weekend: 1590 },
  },
};

/**
 * What one group pays on one night. Outside a season that priced by
 * nationality, this is the price everyone pays - BR-03-91, and the reason
 * the last twelve columns of all three frames are identical.
 */
export function groupRate(
  group: CalendarGroupId,
  room: string,
  date: Date,
  weekend: boolean,
  rate: number
): number {
  if (group === "everyone") return rate;
  const season = seasonOf(date);
  if (!season || !SEASONS_WITH_GROUPS.includes(season.en)) return rate;
  const adjust = adjustment[group];
  if (adjust !== undefined) return rate + adjust;
  const fixed = pakistanFixed[room]?.[season.en];
  /* A room the group has no fixed price for pays the season, not nothing. */
  return fixed ? (weekend ? fixed.weekend : fixed.weekday) : rate;
}

/** OV 04.1PN vs 04.1PN0 — whether any night on screen is priced by group. */
export function hasGroupPrices(dates: Date[]): boolean {
  return dates.some((date) => {
    const season = seasonOf(date);
    return season !== null && SEASONS_WITH_GROUPS.includes(season.en);
  });
}

export const pricesForCopy = {
  label: t("Prices for", "الأسعار لـ"),
  overline: t("RATES & AVAILABILITY", "الأسعار والإتاحة"),
  title: t("Prices for", "الأسعار لـ"),
  footer: t(
    "Nights outside a season show the same price for everyone.",
    "الليالي خارج المواسم تعرض السعر نفسه للجميع."
  ),
  footerNone: t(
    "No night in the months you show has nationality prices. They are set inside a season - open Ramadan to see them.",
    "لا ليلة في الشهور المعروضة لها أسعار جنسيات. فهي تُحدَّد داخل موسم — افتح رمضان لتراها."
  ),
} as const;
