/**
 * The two policy drawers — Figma OV 03.16 (cancellation tiers) and
 * OV 03.17 (release & cut-off), with the states each one can be in.
 */

export interface Bi {
  en: string;
  ar: string;
}

const t = (en: string, ar: string): Bi => ({ en, ar });

export type ChargeKind = "free" | "nights" | "percent" | "fixed" | "";

/** OV 03.16M — what a tier can charge, and what each one means. */
export const chargeKinds: Array<{
  kind: Exclude<ChargeKind, "">;
  label: Bi;
  hint: Bi;
}> = [
  {
    kind: "free",
    label: t("Free cancellation", "إلغاء مجاني"),
    hint: t("no charge", "بلا رسوم"),
  },
  {
    kind: "nights",
    label: t("Nights", "ليالٍ"),
    hint: t("charge a number of nights", "احتساب عدد من الليالي"),
  },
  {
    kind: "percent",
    label: t("% of stay", "٪ من الإقامة"),
    hint: t("charge a share of the stay", "احتساب نسبة من الإقامة"),
  },
  {
    kind: "fixed",
    label: t("Fixed amount", "مبلغ ثابت"),
    hint: t("charge a set amount in SAR", "احتساب مبلغ محدد بالريال"),
  },
];

export const cancellationDrawer = {
  overline: t("POLICIES · CANCELLATION", "السياسات · الإلغاء"),
  title: t("Cancellation policy", "سياسة الإلغاء"),
  body: t(
    "Structured tiers, applied to every booking under this contract. Required before activation.",
    "شرائح مرتّبة تنطبق على كل حجز بموجب هذا العقد. ومطلوبة قبل التفعيل."
  ),
  head: [
    t("Tier", "الشريحة"),
    t("Cancelled at least", "يُلغى قبل"),
    t("Charge", "الرسوم"),
  ],
  tierName: t("Tier {n}", "الشريحة {n}"),
  daysBefore: t("days before", "يومًا قبل"),
  daysPlaceholder: t("e.g. 2", "مثال: ٢"),
  choosePlaceholder: t("Choose charge", "اختر الرسوم"),
  noShow: t("No-show", "عدم الحضور"),
  noShowRule: t("Under {days} days, or no-show", "أقل من {days} أيام، أو عدم حضور"),
  noShowRuleNew: t("Under the new tier, or no-show", "أقل من الشريحة الجديدة، أو عدم حضور"),
  alwaysLast: t("always last", "دائمًا الأخيرة"),
  addTier: t("Add tier", "إضافة شريحة"),
  maxTiers: t("4 tiers is the maximum", "الحد الأقصى ٤ شرائح"),
  removed: t("Tier {n} removed", "حُذفت الشريحة {n}"),
  undo: t("Undo", "تراجع"),
  minTiers: t(
    "A cancellation policy needs at least two tiers - remove one more and the policy stops being valid.",
    "تحتاج سياسة الإلغاء إلى شريحتين على الأقل - واحذف واحدة أخرى وتتوقف السياسة عن الصلاحية."
  ),
  note: t(
    "No-show is always the last tier. Bookings keep the policy in force at confirmation - changing tiers later affects new bookings only.",
    "عدم الحضور دائمًا الشريحة الأخيرة. وتحتفظ الحجوزات بالسياسة السارية عند تأكيدها - وتغيير الشرائح لاحقًا يمسّ الحجوزات الجديدة وحدها."
  ),
  cancel: t("Cancel", "إلغاء"),
  confirm: t("Save policy", "حفظ السياسة"),
};

export const releaseDrawer = {
  overline: t("POLICIES · RELEASE & CUT-OFF", "السياسات · الإفراج والإقفال"),
  title: t("Release & cut-off", "الإفراج والإقفال"),
  body: t(
    "When unsold block rooms go back to the hotel, and what agents see after that.",
    "متى تعود الغرف غير المباعة إلى الفندق، وما الذي يراه الوكلاء بعدها."
  ),
  periodLabel: t("Release period", "فترة الإفراج"),
  sameDay: t("Same day", "اليوم نفسه"),
  numberOfDays: t("Number of days", "عدد الأيام"),
  periodHint: t(
    "When unsold block rooms go back to the hotel - tied to the time below.",
    "متى تعود الغرف غير المباعة إلى الفندق - مرتبطة بالوقت أدناه."
  ),
  daysLabel: t("Days before check-in", "أيام قبل الوصول"),
  daysValue: t("3 days", "٣ أيام"),
  daysValueSameDay: t("Not used · same day", "غير مستخدم · اليوم نفسه"),
  daysHint: t(
    "Released 3 days before check-in at 18:00.",
    "يُفرج عنها قبل الوصول بثلاثة أيام في ١٨:٠٠."
  ),
  daysHintSameDay: t(
    "Released on the check-in day at 14:00.",
    "يُفرج عنها يوم الوصول في ١٤:٠٠."
  ),
  timeLabel: t("Release time", "وقت الإفراج"),
  timeValue: t("18:00 · Saudi time (UTC+3)", "١٨:٠٠ · بتوقيت السعودية (UTC+3)"),
  timeValueSameDay: t(
    "14:00 · Saudi time (UTC+3)",
    "١٤:٠٠ · بتوقيت السعودية (UTC+3)"
  ),
  afterLabel: t("After release", "بعد الإفراج"),
  stopSale: t("Stop sale", "إيقاف البيع"),
  switchRequest: t("Switch to On Request", "التحويل إلى عند الطلب"),
  afterHint: t(
    "What agents see for released nights.",
    "ما يراه الوكلاء لليالي المُفرج عنها."
  ),
  stopSaleNote: t(
    "Inside the release window the night simply closes. Agents see it as unavailable - no requests reach you, and nothing can be confirmed at the last minute.",
    "داخل نافذة الإفراج تُغلق الليلة ببساطة. ويراها الوكلاء غير متاحة - فلا تصلك طلبات، ولا يمكن تأكيد شيء في اللحظة الأخيرة."
  ),
  cancel: t("Cancel", "إلغاء"),
  confirm: t("Save", "حفظ"),
};

/** OV 03.16SRAM / SLTN / SHAJ / SSUM — a season's own cancellation policy. */
export interface SeasonPolicy {
  key: string;
  overline: Bi;
  title: Bi;
  body: Bi;
  footer: Bi;
}

const seasonPolicy = (
  key: string,
  nameEn: string,
  nameAr: string,
  datesEn: string,
  datesAr: string
): SeasonPolicy => ({
  key,
  overline: t(
    `${nameEn.toUpperCase()} SEASON · CANCELLATION`,
    `موسم ${nameAr} · الإلغاء`
  ),
  title: t(
    `Cancellation policy for ${nameEn}`,
    `سياسة الإلغاء لـ${nameAr}`
  ),
  body: t(
    `Only for ${datesEn}. Every other night keeps the contract policy - this one shows next to it in the contract.`,
    `لـ${datesAr} فقط. وتحتفظ كل ليلة أخرى بسياسة العقد - وتظهر هذه بجانبها في العقد.`
  ),
  footer: t(
    `This season’s policy wins on its own dates. Outside ${datesEn} every booking falls back to the contract policy.`,
    `تفوز سياسة الموسم في تواريخه. وخارج ${datesAr} يعود كل حجز إلى سياسة العقد.`
  ),
});

export const seasonPolicies: SeasonPolicy[] = [
  seasonPolicy(
    "ramadan", "Ramadan", "رمضان",
    "18 Feb - 09 Mar 2027",
    "١٨ فبراير - ٩ مارس ٢٠٢٧"
  ),
  seasonPolicy(
    "lastTen", "Last ten nights", "العشر الأواخر",
    "10 - 19 Mar 2027",
    "١٠ - ١٩ مارس ٢٠٢٧"
  ),
  seasonPolicy(
    "hajj", "Hajj", "الحج",
    "10 - 20 May 2027",
    "١٠ - ٢٠ مايو ٢٠٢٧"
  ),
  seasonPolicy(
    "summer", "Summer", "الصيف",
    "01 Jul - 31 Aug 2027",
    "١ يوليو - ٣١ أغسطس ٢٠٢٧"
  ),
];

/** The season a row in the contract's policy table belongs to. */
export const seasonPolicyFor = (season: string): SeasonPolicy | undefined =>
  seasonPolicies.find((panel) =>
    season.toLowerCase().includes(panel.key === "lastTen" ? "last ten" : panel.key)
  );
