/**
 * The season detail panel — Figma OV 03.14 / 03.15 / 03.16 / 03.17 and
 * their draft, read-only and fixed-price twins.
 */

export interface Bi {
  en: string;
  ar: string;
}

const t = (en: string, ar: string): Bi => ({ en, ar });

export interface SeasonMonth {
  label: Bi;
  /** The first night of the week the season opens or closes in. */
  weekFrom?: number;
  weekTo?: number;
  /** Which column the 1st sits in, counting from Monday. */
  firstColumn: number;
  days: number;
  /** The first and last night of the season inside this month. */
  from?: number;
  to?: number;
}

export interface NightChange {
  when: Bi;
  who: Bi;
  night: number;
  month: number;
  was: string;
  now: string;
}

export interface SeasonDetail {
  key: string;
  /** The colour this season shows in on the rate calendar. */
  tint: string;
  ink: string;
  name: Bi;
  meta: Bi;
  rule: Bi;
  weekday: Bi;
  base: number;
  weekend: number;
  months: SeasonMonth[];
  changes: NightChange[];
  /**
   * OV 03.12B / 03.15F - a season may keep the contract's cancellation
   * policy or set its own, and the editor has to say which. A season that
   * silently showed another season's policy would be worse than one that
   * showed none.
   */
  policy?: Bi;
}

export const seasonDetails: SeasonDetail[] = [
  {
    key: "ramadan",
    policy: t("Own policy · free until 14 days, then 100% of the stay", "سياسة خاصة · مجانًا حتى ١٤ يومًا، ثم ١٠٠٪ من الإقامة"),
    tint: "#eeecfb",
    ink: "#4a3aa7",
    name: t("Ramadan", "رمضان"),
    meta: t(
      "18 Feb - 09 Mar 2027 · 20 nights · Base 640 / 740 SAR",
      "١٨ فبراير - ٩ مارس ٢٠٢٧ · ٢٠ ليلة · الأساس ٦٤٠ / ٧٤٠ ر.س"
    ),
    rule: t("Base 640 / 740 SAR", "الأساس ٦٤٠ / ٧٤٠ ر.س"),
    weekday: t("640 / 740 SAR", "٦٤٠ / ٧٤٠ ر.س"),
    base: 640,
    weekend: 740,
    months: [
      { label: t("February 2027", "فبراير ٢٠٢٧"), firstColumn: 0, days: 28, from: 18, to: 28, weekFrom: 15, weekTo: 28 },
      { label: t("March 2027", "مارس ٢٠٢٧"), firstColumn: 0, days: 31, from: 1, to: 9, weekFrom: 1, weekTo: 14 },
    ],
    changes: [
      {
        when: t("Sat 27 Feb · Standard Room · Room Only", "السبت ٢٧ فبراير · غرفة ستاندرد · بدون وجبات"),
        who: t("Changed by Sara · 02 Feb, 10:05", "غيّرتها سارة · ٢ فبراير، ١٠:٠٥"),
        night: 27,
        month: 0,
        was: "640 SAR",
        now: "800 SAR",
      },
      {
        when: t("Fri 05 Mar · Standard Room · Room Only", "الجمعة ٥ مارس · غرفة ستاندرد · بدون وجبات"),
        who: t("Changed by Ahmed · 03 Feb, 16:40", "غيّرها أحمد · ٣ فبراير، ١٦:٤٠"),
        night: 5,
        month: 1,
        was: "640 SAR",
        now: "780 SAR",
      },
    ],
  },
  {
    key: "lastTen",
    policy: t("Same as contract · free until 7 days · 3-6 days 1 night · then 100%", "كما في العقد · مجانًا حتى ٧ أيام · ٣-٦ أيام ليلة واحدة · ثم ١٠٠٪"),
    tint: "#fcecf3",
    ink: "#e87ba4",
    name: t("Last ten nights", "العشر الأواخر"),
    meta: t(
      "10 - 19 Mar 2027 · 10 nights · Base 1,000 / 1,100 SAR",
      "١٠ - ١٩ مارس ٢٠٢٧ · ١٠ ليالٍ · الأساس ١٬٠٠٠ / ١٬١٠٠ ر.س"
    ),
    rule: t("Base 1,000 / 1,100 SAR", "الأساس ١٬٠٠٠ / ١٬١٠٠ ر.س"),
    weekday: t("1,000 / 1,100 SAR", "١٬٠٠٠ / ١٬١٠٠ ر.س"),
    base: 1000,
    weekend: 1100,
    months: [
      { label: t("March 2027", "مارس ٢٠٢٧"), firstColumn: 0, days: 31, from: 10, to: 19, weekFrom: 8, weekTo: 21 },
    ],
    changes: [],
  },
  {
    key: "hajj",
    policy: t("Own policy · non-refundable from the day it is booked", "سياسة خاصة · غير قابل للاسترداد من يوم الحجز"),
    tint: "#e4eefb",
    ink: "#2a78d6",
    name: t("Hajj", "الحج"),
    meta: t(
      "10 - 20 May 2027 · 11 nights · Base 880 / 980 SAR",
      "١٠ - ٢٠ مايو ٢٠٢٧ · ١١ ليلة · الأساس ٨٨٠ / ٩٨٠ ر.س"
    ),
    rule: t("Base 880 / 980 SAR", "الأساس ٨٨٠ / ٩٨٠ ر.س"),
    weekday: t("880 / 980 SAR", "٨٨٠ / ٩٨٠ ر.س"),
    base: 880,
    weekend: 980,
    months: [
      { label: t("May 2027", "مايو ٢٠٢٧"), firstColumn: 5, days: 31, from: 10, to: 20, weekFrom: 10, weekTo: 23 },
    ],
    changes: [],
  },
  {
    key: "summer",
    policy: t("Same as contract · free until 7 days · 3-6 days 1 night · then 100%", "كما في العقد · مجانًا حتى ٧ أيام · ٣-٦ أيام ليلة واحدة · ثم ١٠٠٪"),
    tint: "#e2f4f7",
    ink: "#1aa3b8",
    name: t("Summer", "الصيف"),
    meta: t(
      "01 Jul - 31 Aug 2027 · 62 nights · Base 500 / 600 SAR",
      "١ يوليو - ٣١ أغسطس ٢٠٢٧ · ٦٢ ليلة · الأساس ٥٠٠ / ٦٠٠ ر.س"
    ),
    rule: t("Base 500 / 600 SAR", "الأساس ٥٠٠ / ٦٠٠ ر.س"),
    weekday: t("500 / 600 SAR", "٥٠٠ / ٦٠٠ ر.س"),
    base: 500,
    weekend: 600,
    months: [
      { label: t("July 2027", "يوليو ٢٠٢٧"), firstColumn: 3, days: 31, from: 1, to: 31 },
      { label: t("August 2027", "أغسطس ٢٠٢٧"), firstColumn: 6, days: 31, from: 1, to: 31 },
    ],
    changes: [],
  },
];

/**
 * OV 03.14P / 15P / 16P / 17P - the words the date picker prints.
 *
 * The description has two answers rather than one answer and a blank: a
 * season with neighbours says its nights are locked, and a season with
 * none says why nothing is.
 */
export const seasonPickerCopy = {
  overline: t("SEASON DATES · {season}", "تواريخ الموسم · {season}"),
  title: t("Pick the first and last night", "اختر أول ليلة وآخر ليلة"),
  bodyLocked: t(
    "Nights that belong to another season are locked - a season can’t overlap another one.",
    "الليالي التي تخصّ موسمًا آخر مقفلة — ولا يمكن أن يتداخل موسم مع آخر."
  ),
  bodyFree: t(
    "No other season falls in these months, so every night is free.",
    "لا يقع موسم آخر في هذه الشهور، فكل ليلة متاحة."
  ),
  weekdays: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  weekdaysAr: ["أح", "إث", "ثل", "أر", "خم", "جم", "سب"],
  legendSelected: t("{season} · selected", "{season} · محدد"),
  legendLocked: t("{season} · locked", "{season} · مقفل"),
  legendWeekend: t(
    "Weekend in your contract: Th, Fr",
    "نهاية الأسبوع في عقدك: الخميس، الجمعة"
  ),
  range: t("{from} - {to} {year} · {nights}", "{from} - {to} {year} · {nights}"),
  apply: t("Apply dates", "طبّق التواريخ"),
  pickLast: t("Pick the last night first", "اختر آخر ليلة أولًا"),
  close: t("Close", "إغلاق"),
} as const;

export const seasonDetailCopy = {
  overlineLive: t(
    "RATE SEASON · MAKKAH ANNUAL BLOCK",
    "موسم الأسعار · حصة مكة السنوية"
  ),
  overlineDraft: t("RATE SEASON · DRAFT CONTRACT", "موسم الأسعار · عقد مسودة"),
  roomLabel: t("Room", "الغرفة"),
  rooms: [
    t("Standard Room", "غرفة ستاندرد"),
    t("Deluxe Room City View", "ديلوكس إطلالة المدينة"),
    t("Deluxe Room Partial Haram View", "ديلوكس إطلالة جزئية على الحرم"),
  ],
  ruleLabel: t("Price rule", "قاعدة السعر"),
  weekdayLabel: t("Weekday / weekend", "أيام الأسبوع / نهايته"),
  changedLabel: t("Changed on the rate calendar", "مُغيَّر في تقويم الأسعار"),
  changedValue: t("{count} of {total} nights", "{count} من {total} ليلة"),
  draftChangedLabel: t("Rate calendar changes", "تغييرات تقويم الأسعار"),
  draftChangedValue: t("After the contract is live", "بعد أن يعمل العقد"),
  caption: t(
    "Price per night · Standard Room · Room Only · meal plans add on top · weekend = Thu & Fri",
    "السعر لكل ليلة · غرفة ستاندرد · بدون وجبات · وتُضاف خطط الوجبات فوقه · نهاية الأسبوع = الخميس والجمعة"
  ),
  weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  weekdaysAr: ["إث", "ثل", "أر", "خم", "جم", "سب", "أح"],
  weekendTag: t("wknd", "نهاية"),
  legendSeason: t("Season price · incl. VAT", "سعر الموسم · شامل الضريبة"),
  legendChanged: t(
    "Changed on the rate calendar · old price struck",
    "مُغيَّر في تقويم الأسعار · السعر القديم مشطوب"
  ),
  legendOutside: t("Outside this season", "خارج هذا الموسم"),
  changesTitle: t("CHANGED ON THE RATE CALENDAR", "مُغيَّر في تقويم الأسعار"),
  resetAll: t("Reset all to season price", "إعادة الكل إلى سعر الموسم"),
  openNight: t("Open night →", "افتح الليلة ←"),
  changesNote: t(
    "A change made on the rate calendar wins over the season for that night only.",
    "التغيير في تقويم الأسعار يفوز على الموسم في تلك الليلة وحدها."
  ),
  draftChangesNote: t(
    "Once the contract is live, any night changed on the rate calendar shows here in amber, with the old price.",
    "حين يعمل العقد، تظهر هنا بالكهرماني أي ليلة تُغيَّر في تقويم الأسعار، ومعها السعر القديم."
  ),
  draftFooterNote: t(
    "Prices here follow the season rule - change it from Edit season.",
    "الأسعار هنا تتبع قاعدة الموسم - غيّرها من «تعديل الموسم»."
  ),
  editSeason: t("Edit season", "تعديل الموسم"),
  openCalendar: t("Open on rate calendar", "افتح في تقويم الأسعار"),
};
