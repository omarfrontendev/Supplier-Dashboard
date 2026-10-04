/**
 * Arabic counts four ways, and English two.
 *
 * One, two, a few (3-10) and many (11 and up) each take their own form, so
 * "٤ ليلة" is wrong where "٤ ليالٍ" is right, and "٢ غرف" is wrong where
 * "غرفتان" is right. A reader feels both immediately, the way an English
 * reader feels "1 nights".
 *
 * So a count is never interpolated into a sentence as a bare number with a
 * noun after it. It is chosen here, as a whole phrase, and the sentence
 * takes the phrase.
 */

export interface Bi {
  en: string;
  ar: string;
}

export type Lang = "en" | "ar";

/** Western digits into Arabic-Indic ones, for the forms that carry one. */
export function arDigits(value: number): string {
  return value.toLocaleString("ar-EG", { useGrouping: value >= 10000 });
}

export interface CountForms {
  /** 1 */
  one: Bi;
  /** 2 - Arabic's dual, which English does not have. */
  two: Bi;
  /**
   * The same dual after a preposition, where Arabic changes its case:
   * "غرفتان" standing alone, "من غرفتين" after من. English does not move,
   * so this is Arabic only and `countedOf` is what reaches for it.
   */
  twoOf?: string;
  /** 3-10, and every English count above one. */
  few: Bi;
  /** 11 and up, where Arabic goes back to the singular. */
  many: Bi;
}

/**
 * The phrase for a count: "4 nights", "٤ ليالٍ", "غرفتان", "11 rooms".
 * `{n}` in a form is replaced with the number in the right digits.
 */
export function counted(value: number, forms: CountForms, k: Lang): string {
  const put = (form: Bi) =>
    form[k].replace("{n}", k === "ar" ? arDigits(value) : String(value));
  if (value === 1) return put(forms.one);
  if (k === "en") return put(forms.few);
  if (value === 2) return put(forms.two);
  return put(value <= 10 ? forms.few : forms.many);
}

const t = (en: string, ar: string): Bi => ({ en, ar });

/**
 * The phrase where a preposition governs it: "0 of 2 rooms", "٠ من غرفتين".
 * Every count but the dual reads the same either way.
 */
export function countedOf(value: number, forms: CountForms, k: Lang): string {
  if (k === "ar" && value === 2 && forms.twoOf) return forms.twoOf;
  return counted(value, forms, k);
}

/** The things the portal counts often enough to be worth naming once. */
export const nightsWord: CountForms = {
  one: t("1 night", "ليلة واحدة"),
  two: t("2 nights", "ليلتان"),
  twoOf: "ليلتين",
  few: t("{n} nights", "{n} ليالٍ"),
  many: t("{n} nights", "{n} ليلة"),
};

export const imagesWord: CountForms = {
  one: t("1 image", "صورة واحدة"),
  two: t("2 images", "صورتان"),
  twoOf: "صورتين",
  few: t("{n} images", "{n} صور"),
  many: t("{n} images", "{n} صورة"),
};

export const roomsWord: CountForms = {
  one: t("1 room", "غرفة واحدة"),
  two: t("2 rooms", "غرفتان"),
  twoOf: "غرفتين",
  few: t("{n} rooms", "{n} غرف"),
  many: t("{n} rooms", "{n} غرفة"),
};

export const rangesWord: CountForms = {
  one: t("1 range", "مدى واحد"),
  two: t("2 ranges", "مديان"),
  twoOf: "مديين",
  few: t("{n} ranges", "{n} مديات"),
  many: t("{n} ranges", "{n} مدى"),
};

export const contractsWord: CountForms = {
  one: t("1 contract", "عقد واحد"),
  two: t("2 contracts", "عقدان"),
  twoOf: "عقدين",
  few: t("{n} contracts", "{n} عقود"),
  many: t("{n} contracts", "{n} عقدًا"),
};

export const roomNightsWord: CountForms = {
  one: t("1 room-night", "ليلة-غرفة واحدة"),
  two: t("2 room-nights", "ليلتا-غرفة"),
  twoOf: "ليلتي-غرفة",
  few: t("{n} room-nights", "{n} ليالي-غرف"),
  many: t("{n} room-nights", "{n} ليلة-غرفة"),
};

export const weekdaysWord: CountForms = {
  one: t("1 weekday", "يوم أسبوع واحد"),
  two: t("2 weekdays", "يوما أسبوع"),
  twoOf: "يومي أسبوع",
  few: t("{n} weekdays", "{n} أيام أسبوع"),
  many: t("{n} weekdays", "{n} يوم أسبوع"),
};

export const weekendNightsWord: CountForms = {
  one: t("1 weekend night", "ليلة نهاية أسبوع واحدة"),
  two: t("2 weekend nights", "ليلتا نهاية أسبوع"),
  twoOf: "ليلتي نهاية أسبوع",
  few: t("{n} weekend nights", "{n} ليالي نهاية أسبوع"),
  many: t("{n} weekend nights", "{n} ليلة نهاية أسبوع"),
};

export const countriesWord: CountForms = {
  one: t("1 country", "دولة واحدة"),
  two: t("2 countries", "دولتان"),
  twoOf: "دولتين",
  few: t("{n} countries", "{n} دول"),
  many: t("{n} countries", "{n} دولة"),
};

export const groupsWord: CountForms = {
  one: t("1 group", "مجموعة واحدة"),
  two: t("2 groups", "مجموعتان"),
  twoOf: "مجموعتين",
  few: t("{n} groups", "{n} مجموعات"),
  many: t("{n} groups", "{n} مجموعة"),
};

export const linesWord: CountForms = {
  one: t("1 line", "سطر واحد"),
  two: t("2 lines", "سطران"),
  twoOf: "سطرين",
  few: t("{n} lines", "{n} سطور"),
  many: t("{n} lines", "{n} سطرًا"),
};

export const numbersWord: CountForms = {
  one: t("1 number", "رقم واحد"),
  two: t("2 numbers", "رقمان"),
  twoOf: "رقمين",
  few: t("{n} numbers", "{n} أرقام"),
  many: t("{n} numbers", "{n} رقمًا"),
};

export const daysWord: CountForms = {
  one: t("1 day", "يوم واحد"),
  two: t("2 days", "يومان"),
  twoOf: "يومين",
  few: t("{n} days", "{n} أيام"),
  many: t("{n} days", "{n} يومًا"),
};

export const rulesWord: CountForms = {
  one: t("1 rule", "قاعدة واحدة"),
  two: t("2 rules", "قاعدتان"),
  twoOf: "قاعدتين",
  few: t("{n} rules", "{n} قواعد"),
  many: t("{n} rules", "{n} قاعدة"),
};

export const seasonsWord: CountForms = {
  one: t("1 season", "موسم واحد"),
  two: t("2 seasons", "موسمان"),
  twoOf: "موسمين",
  few: t("{n} seasons", "{n} مواسم"),
  many: t("{n} seasons", "{n} موسمًا"),
};

/* UI 02.1 - the bar over the library. An Arabic adjective agrees with
   the noun it follows, so the phrase is chosen whole rather than built
   from a count and a word stuck after it. */
export const hotelsSelectedWord: CountForms = {
  one: t("1 hotel selected", "فندق واحد مختار"),
  two: t("2 hotels selected", "فندقان مختاران"),
  few: t("{n} hotels selected", "{n} فنادق مختارة"),
  many: t("{n} hotels selected", "{n} فندقًا مختارًا"),
};

/* The same again for the toast that follows the request: "hotel(s) are"
   was a written-down shrug where a count belongs. */
export const hotelsAreWord: CountForms = {
  one: t("1 hotel is", "فندق واحد"),
  two: t("2 hotels are", "فندقان"),
  few: t("{n} hotels are", "{n} فنادق"),
  many: t("{n} hotels are", "{n} فندقًا"),
};

/* UI 02.1D - the banner. English moves its verb with the count, so the
   verb belongs to the phrase and not to the sentence around it. */
export const accessRequestsWord: CountForms = {
  one: t("1 access request is", "طلب وصول واحد"),
  two: t("2 access requests are", "طلبا وصول"),
  few: t("{n} access requests are", "{n} طلبات وصول"),
  many: t("{n} access requests are", "{n} طلب وصول"),
};

export const requestsWord: CountForms = {
  one: t("1 request", "طلب واحد"),
  two: t("2 requests", "طلبان"),
  twoOf: "طلبين",
  few: t("{n} requests", "{n} طلبات"),
  many: t("{n} requests", "{n} طلبًا"),
};

export const hotelsWord: CountForms = {
  one: t("1 hotel", "فندق واحد"),
  two: t("2 hotels", "فندقان"),
  twoOf: "فندقين",
  few: t("{n} hotels", "{n} فنادق"),
  many: t("{n} hotels", "{n} فندقًا"),
};
