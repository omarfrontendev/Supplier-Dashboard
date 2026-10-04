/**
 * BR-00-02 — "كل الأسعار اللي المورد بيكتبها أو بيشوفها شاملة الضريبة VAT
 * 15% — مفيش اختيار included / not included ومفيش تفصيل ضريبة في بوابة
 * المورد. كل Label سعر آخره · incl. VAT."
 *
 * There is no VAT toggle and no tax breakdown anywhere in the supplier
 * portal, so a price label is never ambiguous — it only has to say so. Every
 * label that sits over a money value goes through `priceLabel`, which is the
 * single place the suffix is written (BR-00-06).
 *
 * BR-00-03 puts the default currency at SAR, and the server stores UTC while
 * the portal always shows Makkah time.
 */

export const VAT_RATE = 0.15;
export const DEFAULT_CURRENCY = "SAR";

const SUFFIX = { en: "· incl. VAT", ar: "· شامل الضريبة" } as const;

/** "Weekday cost" → "Weekday cost · incl. VAT". */
export function priceLabel(label: string, lang: string): string {
  const suffix = SUFFIX[lang === "ar" ? "ar" : "en"];
  /* An overline is upper case, so the suffix follows it rather than fights it. */
  const written = label === label.toUpperCase() ? suffix.toUpperCase() : suffix;
  return label.includes(suffix) || label.includes(suffix.toUpperCase())
    ? label
    : `${label} ${written}`;
}

/**
 * BR-00-03 — thousands separated, no decimals unless the value really has
 * one. The currency is written out because the portal never shows a bare
 * number where money is meant.
 */
export function money(
  value: number,
  lang: string,
  { currency = DEFAULT_CURRENCY }: { currency?: string } = {}
): string {
  const ar = lang === "ar";
  const fraction = Number.isInteger(value) ? 0 : 2;
  const number = value.toLocaleString(ar ? "ar-EG" : "en-US", {
    minimumFractionDigits: fraction,
    maximumFractionDigits: fraction,
  });
  /* The portal writes the riyal as ر.س in Arabic, as every other screen does. */
  const written = ar && currency === DEFAULT_CURRENCY ? "ر.س" : currency;
  return `${number} ${written}`;
}
