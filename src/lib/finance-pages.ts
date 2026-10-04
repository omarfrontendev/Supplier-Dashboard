/**
 * UI 07.33 / 07.34 / and the reports page — the three finance sections that
 * are lists rather than cycles.
 *
 * BR-07-40 matters here: a Deductions line on a statement *is* the entry on
 * Adjustments, so disputing it is the entry's dispute (OV 07.14) and not the
 * statement's (OV 07.25). The two screens must not grow separate rules.
 */

export interface Bi {
  en: string;
  ar: string;
}

const t = (en: string, ar: string): Bi => ({ en, ar });

export type AdjustmentSide = "against" | "favour";
export type AdjustmentState = "open" | "disputed" | "settled";

export interface Adjustment {
  id: string;
  side: AdjustmentSide;
  title: Bi;
  detail: Bi;
  /** What it is attached to, or nothing when it stands alone. */
  booking?: string | undefined;
  hotel: Bi;
  date: Bi;
  amount: number;
  state: AdjustmentState;
  /** BR-07-06 — where it was taken from, instead of a running balance. */
  takenFrom: Bi;
}

/** UI 07.33 — the entries Hoteliana raised, for and against. */
export const adjustments: Adjustment[] = [
  {
    id: "ADJ-2026-0043",
    side: "against",
    title: t("Guest relocated", "نُقل النزيل"),
    detail: t(
      "4 rooms were not available on arrival - Hoteliana moved the group and paid the difference.",
      "٤ غرف لم تكن متاحة عند الوصول — نقلت هوتيليانا المجموعة ودفعت الفرق."
    ),
    booking: "HTL-88160",
    hotel: t("Al Noor Makkah Hotel", "فندق النور مكة"),
    date: t("15 Sep", "١٥ سبتمبر"),
    amount: -560,
    state: "settled",
    takenFrom: t("Taken from: September statement", "خُصم من: كشف سبتمبر"),
  },
  {
    id: "ADJ-2026-0048",
    side: "against",
    title: t("Refund owed after a cancellation", "مبلغ مستردّ بعد إلغاء"),
    detail: t(
      "HTL-88191 was paid on booking and cancelled after - the fee you earned is kept.",
      "HTL-88191 دُفع عند الحجز وأُلغي بعده — وتبقى الغرامة التي استحققتها."
    ),
    booking: "HTL-88191",
    hotel: t("Al Noor Makkah Hotel", "فندق النور مكة"),
    date: t("11 Sep", "١١ سبتمبر"),
    amount: -1200,
    state: "open",
    takenFrom: t("Taken from: next payment", "يُخصم من: الدفعة التالية"),
  },
  {
    id: "ADJ-2026-0039",
    side: "favour",
    title: t("Correction in your favour", "تصحيح لصالحك"),
    detail: t(
      "August dispute agreed - the rate was 120 SAR a night higher.",
      "قُبل اعتراض أغسطس — كان السعر أعلى بـ١٢٠ ريالًا لليلة."
    ),
    booking: "HTL-88104",
    hotel: t("Al Noor Makkah Hotel", "فندق النور مكة"),
    date: t("2 Sep", "٢ سبتمبر"),
    amount: 480,
    state: "settled",
    takenFrom: t("Added to: September statement", "أُضيف إلى: كشف سبتمبر"),
  },
];

export const adjustmentsCopy = {
  title: t("Adjustments", "التسويات"),
  subtitle: t(
    "Entries Hoteliana raised for or against you. You cannot raise one yourself, and none of them changes a booking's price.",
    "قيود سجّلتها هوتيليانا لك أو عليك. ولا يمكنك تسجيل قيد بنفسك، ولا يغيّر أيٌّ منها سعر حجز."
  ),
  colEntry: t("ENTRY", "القيد"),
  colBooking: t("BOOKING", "الحجز"),
  colDate: t("DATE", "التاريخ"),
  colAmount: t("AMOUNT · INCL. VAT", "المبلغ · شامل الضريبة"),
  colWhere: t("WHERE IT LANDS", "أين يقع"),
  against: t("Against you", "عليك"),
  favour: t("In your favour", "لصالحك"),
  open: t("Open", "مفتوح"),
  disputed: t("Under review", "تحت المراجعة"),
  settled: t("Settled", "مسوّى"),
  dispute: t("Dispute this entry", "اعترض على هذا القيد"),
  contact: t("Contact Hoteliana", "تواصل مع هوتيليانا"),
  /* Out of scope, and the page says so rather than leaving a gap. */
  cannotRaise: t(
    "Only Hoteliana raises entries. A deduction is never an invoice from you, and a credit note is never asked for.",
    "هوتيليانا وحدها تسجّل القيود. والخصم ليس فاتورة منك، ولا يُطلب إشعار دائن."
  ),
  empty: t("No adjustments", "لا تسويات"),
  emptyBody: t(
    "Nothing has been raised for or against you.",
    "لم يُسجَّل شيء لك ولا عليك."
  ),
} as const;

export const invoicesCopy = {
  title: t("Tax invoices", "الفواتير الضريبية"),
  subtitle: t(
    "One invoice per statement, and one for the bookings paid on booking or on arrival in the month.",
    "فاتورة لكل كشف، وأخرى للحجوزات المدفوعة عند الحجز أو عند الوصول في الشهر."
  ),
  colPeriod: t("PERIOD", "الفترة"),
  colCovers: t("COVERS", "تغطي"),
  colInvoice: t("INVOICE", "الفاتورة"),
  colState: t("STATE", "الحالة"),
  coversStatement: t("The monthly statement", "الكشف الشهري"),
  coversDaily: t("On booking and on arrival", "عند الحجز وعند الوصول"),
  missing: t("Not uploaded yet", "لم تُرفع بعد"),
  uploaded: t("Uploaded", "مرفوعة"),
  differs: t("Differs · noted", "تختلف · مسجّلة"),
  upload: t("Upload", "ارفع"),
  replace: t("Replace", "استبدل"),
  /* BR-07-47 — not before the statement is final. */
  afterAccept: t(
    "Upload it when you accept the statement - it is final then.",
    "ارفعها عند قبولك الكشف — فهو نهائي حينئذ."
  ),
  /* BR-07-45 / BR-07-48 — never blocks, but it is chased. */
  neverBlocks: t(
    "A missing or different invoice never holds the payment up. We remind you every 3 days from 3 days after the payment date, and stop as soon as one is uploaded.",
    "الفاتورة الناقصة أو المختلفة لا تحتجز الدفع أبدًا. ونذكّرك كل ٣ أيام ابتداءً من ٣ أيام بعد تاريخ الدفع، ونتوقف فور رفع واحدة."
  ),
  /* BR-07-49 — what the comparison checks. */
  checked: t(
    "We compare the buyer's name, the buyer's VAT number and the total against the statement. A difference is noted and followed up by hand - it never stops a payment.",
    "نقارن اسم المشتري ورقمه الضريبي والإجمالي بالكشف. ويُسجَّل أي اختلاف ويُتابَع يدويًا — ولا يوقف دفعًا أبدًا."
  ),
} as const;

export const reportsCopy = {
  title: t("Reports", "التقارير"),
  subtitle: t(
    "What your accountant asks for, in the shape they ask for it.",
    "ما يطلبه محاسبك، بالشكل الذي يطلبه."
  ),
  reports: [
    {
      key: "earnings",
      label: t("Earnings by month", "الأرباح بالشهر"),
      hint: t(
        "Every booking, its payment term and what it earned.",
        "كل حجز وشرط دفعه وما درّه."
      ),
    },
    {
      key: "statements",
      label: t("Statements and payments", "الكشوف والمدفوعات"),
      hint: t(
        "What was issued, accepted and paid, with the transfer reference.",
        "ما صدر وقُبل ودُفع، مع مرجع التحويل."
      ),
    },
    {
      key: "adjustments",
      label: t("Adjustments", "التسويات"),
      hint: t(
        "Entries for and against you, and where each one landed.",
        "القيود لك وعليك، وأين وقع كلٌّ منها."
      ),
    },
    {
      key: "vat",
      label: t("VAT summary", "ملخص الضريبة"),
      hint: t(
        "Totals per month, for the return.",
        "الإجماليات شهرًا بشهر، للإقرار."
      ),
    },
  ],
  period: t("Period", "الفترة"),
  format: t("Format", "الصيغة"),
  download: t("Download", "تنزيل"),
  emptyTitle: t("No data for this period", "لا بيانات لهذه الفترة"),
  emptyBody: t(
    "Nothing was issued or paid in the months you picked.",
    "لم يصدر ولم يُدفع شيء في الأشهر التي اخترتها."
  ),
  vatNote: t(
    "Every amount includes VAT at 15%. The portal does not break the tax out, because the supplier never prices without it.",
    "كل مبلغ شامل ضريبة ١٥٪. ولا تفصّل البوابة الضريبة، لأن المورد لا يسعّر دونها أصلًا."
  ),
} as const;
