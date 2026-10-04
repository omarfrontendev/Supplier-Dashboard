/**
 * UI 07.20 — Finance overview, read from the frame.
 *
 * The page answers four questions in the order a supplier asks them: how
 * much is coming, how much is owed in total, whether anything is owed the
 * other way, and what wants attention right now. The tiles are those four,
 * and the cards under them are the same order again - what needs you, what
 * is coming up, and on what terms each contract pays.
 *
 * BR-07-05's own note sits at the top of the frame: UI 07.0 / 07.0A-D, 07.5
 * and 07.6 and OV 07.4 / 07.7 / 07.8 / 07.10 are removed, and every link to
 * them points here instead.
 */

export interface Bi {
  en: string;
  ar: string;
}

const t = (en: string, ar: string): Bi => ({ en, ar });

export type PaymentRowState = "dueOnArrival" | "scheduled" | "building";

export interface UpcomingPayment {
  date: Bi;
  what: Bi;
  detail: Bi;
  term: Bi;
  amount: number;
  state: PaymentRowState;
  /** Where Open goes: a booking, or the statement's own month. */
  bookingId?: string | undefined;
  month?: string | undefined;
}

export const upcomingPayments: UpcomingPayment[] = [
  {
    date: t("12 Oct", "١٢ أكتوبر"),
    what: t("HTL-88420 · Al Noor Makkah Hotel", "HTL-88420 · فندق النور مكة"),
    detail: t("Paid on arrival · 2 rooms · 2 nights", "يُدفع عند الوصول · غرفتان · ليلتان"),
    term: t("On arrival", "عند الوصول"),
    amount: 4800,
    state: "dueOnArrival",
    bookingId: "HTL-88205",
  },
  {
    date: t("16 Oct", "١٦ أكتوبر"),
    what: t("September statement", "كشف سبتمبر"),
    detail: t("12 bookings · check-outs 1-30 Sep", "١٢ حجزًا · مغادرات ١-٣٠ سبتمبر"),
    term: t("After check-out · +15 days", "بعد المغادرة · +١٥ يومًا"),
    amount: 18450,
    state: "scheduled",
    month: "2026-09",
  },
  {
    date: t("16 Nov", "١٦ نوفمبر"),
    what: t("October statement", "كشف أكتوبر"),
    detail: t("bookings checking out in October", "حجوزات تغادر في أكتوبر"),
    term: t("After check-out · +15 days", "بعد المغادرة · +١٥ يومًا"),
    amount: 8670,
    state: "building",
  },
];

/** The three contracts and the sentence each one is paid by. */
export const contractTerms: Array<{ contract: Bi; how: Bi }> = [
  {
    contract: t(
      "Al Noor Makkah Hotel · Makkah Annual Block",
      "فندق النور مكة · حصة مكة السنوية"
    ),
    how: t(
      "After check-out · monthly statement · paid 15 days after the statement",
      "بعد المغادرة · كشف شهري · يُدفع بعد الكشف بـ١٥ يومًا"
    ),
  },
  {
    contract: t("Anwar Al Madinah · Madinah RO", "أنوار المدينة · المدينة بدون وجبات"),
    how: t(
      "On arrival · each booking is paid on its check-in day",
      "عند الوصول · يُدفع كل حجز يوم دخوله"
    ),
  },
  {
    contract: t(
      "Jewar Al-Safwah Suites · Ramadan block",
      "أجنحة جوار الصفوة · حصة رمضان"
    ),
    how: t(
      "On booking · paid the day it is confirmed · a cancellation after payment is deducted from your next payment",
      "عند الحجز · يُدفع يوم تأكيده · والإلغاء بعد الدفع يُخصم من دفعتك التالية"
    ),
  },
];

export const overviewCopy = {
  overline: t("FINANCE", "المالية"),
  title: t("Finance overview", "نظرة عامة على المالية"),
  nextPaymentPill: t("Next payment 16 Oct", "الدفعة التالية ١٦ أكتوبر"),
  subtitle: t(
    "What Hoteliana pays you, when, and what needs your attention. Every amount includes VAT. When you are paid depends on the payment terms in each contract.",
    "ما تدفعه هوتيليانا لك ومتى وما يحتاج انتباهك. وكل مبلغ شامل الضريبة. ويعتمد موعد دفعك على شروط الدفع في كل عقد."
  ),
  reports: t("Reports", "التقارير"),
  export: t("Export", "تصدير"),

  /* The four tiles. */
  nextPayment: t("NEXT PAYMENT", "الدفعة التالية"),
  nextPaymentNote: t("SAR · 16 Oct · September statement", "ر.س · ١٦ أكتوبر · كشف سبتمبر"),
  dueToYou: t("DUE TO YOU", "مستحق لك"),
  dueToYouNote: t("SAR · 14 bookings not paid yet", "ر.س · ١٤ حجزًا لم تُدفع بعد"),
  youOwe: t("YOU OWE HOTELIANA", "عليك لهوتيليانا"),
  youOweNote: t("SAR · nothing to settle", "ر.س · لا شيء للتسوية"),
  /* UI 07.20N - the same two tiles when something is owed the other way.
     The next payment is not zero, it is the statement less the debt, and
     the sum is printed so nobody has to reach for a calculator. */
  nextPaymentNoteOwed: t(
    "SAR · 16 Oct · 18,450 – 2,310",
    "ر.س · ١٦ أكتوبر · ١٨٬٤٥٠ – ٢٬٣١٠"
  ),
  youOweNoteOwed: t(
    "SAR · deducted from your next statement",
    "ر.س · تُخصم من كشفك التالي"
  ),
  howToPay: t("How to pay it now", "كيف تدفعها الآن"),

  /*
   * OV 07.38 - paying it before the next statement, which is a choice and
   * not a demand: the band under the details says so, because a screen
   * that hands you an IBAN reads like a demand unless it says otherwise.
   */
  payOverline: t("YOU OWE HOTELIANA · {amount}", "عليك لهوتيليانا · {amount}"),
  payTitle: t("Pay it by transfer", "ادفعها بتحويل"),
  payBody: t(
    "Only if you want to settle it before your next statement.",
    "فقط إن أردت تسويتها قبل كشفك التالي."
  ),
  payBank: t("Bank", "البنك"),
  payBankValue: t(
    "Saudi National Bank · Hoteliana Co.",
    "البنك الأهلي السعودي · شركة هوتيليانا"
  ),
  payIban: t("IBAN", "الآيبان"),
  payIbanValue: t(
    "SA44 1000 ···· ···· ···· 2201",
    "SA44 1000 ···· ···· ···· 2201"
  ),
  payAmount: t("Amount", "المبلغ"),
  payReference: t("Reference", "المرجع"),
  payReferenceValue: t(
    "JEWAR-NEG-2026-09 - write it on the transfer",
    "JEWAR-NEG-2026-09 - اكتبه على التحويل"
  ),
  payOrNothing: t(
    "Or do nothing: it is taken from your next statement. We confirm the moment the transfer lands.",
    "أو لا تفعل شيئًا: تُخصم من كشفك التالي. ونؤكدها لحظة وصول التحويل."
  ),
  payDone: t("Done", "تم"),
  /* The date the debt stops waiting and a transfer is asked for. */
  owedBy: t("30 Nov", "٣٠ نوفمبر"),
  toReview: t("STATEMENT TO REVIEW", "كشف للمراجعة"),
  toReviewValue: t("September", "سبتمبر"),
  toReviewNote: t("Review by Mon 5 Oct · 12 bookings", "راجعه قبل الاثنين ٥ أكتوبر · ١٢ حجزًا"),

  /* NEEDS YOU. */
  needsYou: t("NEEDS YOU", "يحتاجك"),
  things: t("{n} things", "{n} أمور"),
  oneThing: t("1 thing", "أمر واحد"),
  statementReady: t(
    "September statement is ready - review by 5 Oct",
    "كشف سبتمبر جاهز — راجعه قبل ٥ أكتوبر"
  ),
  statementReadyBody: t(
    "Check the bookings, penalties and deductions. If you do nothing, it is accepted on 6 Oct and paid on 16 Oct.",
    "راجع الحجوزات والغرامات والخصومات. وإن لم تفعل شيئًا، يُقبل في ٦ أكتوبر ويُدفع في ١٦ أكتوبر."
  ),
  invoiceMissing: t("Tax invoice for August is missing", "الفاتورة الضريبية لأغسطس ناقصة"),
  invoiceMissingBody: t(
    "Your August payment was made on 16 Sep. The tax invoice is still required - upload it when you can. Payments are never held for it.",
    "دُفعت مستحقات أغسطس في ١٦ سبتمبر. وما زالت الفاتورة الضريبية مطلوبة — ارفعها متى استطعت. ولا تُحتجز المدفوعات لأجلها أبدًا."
  ),
  reviewSeptember: t("Review September", "راجع سبتمبر"),
  uploadAugust: t("Upload August tax invoice", "ارفع فاتورة أغسطس الضريبية"),

  /* COMING UP. */
  comingUp: t("COMING UP", "قادم"),
  nextPayments: t("Next payments", "الدفعات التالية"),
  colDate: t("DATE", "التاريخ"),
  colWhat: t("WHAT", "ماذا"),
  colTerm: t("TERM", "الشرط"),
  colAmount: t("AMOUNT · INCL. VAT", "المبلغ · شامل الضريبة"),
  colStatus: t("STATUS", "الحالة"),
  open: t("Open", "افتح"),
  dueOnArrival: t("Due on arrival", "مستحق عند الوصول"),
  scheduled: t("Scheduled", "مجدول"),
  building: t("Building", "قيد التكوين"),
  /* BR-07-11 / BR-07-12, in the frame's own words. */
  termsFoot: t(
    "Payment days follow each contract. Change a term with your account manager - you cannot edit it here. A booking keeps the term it was confirmed with, even if the contract term changes later.",
    "تتبع أيام الدفع كل عقد. ولتغيير شرط حدّث مدير حسابك — ولا يمكنك تعديله هنا. ويحتفظ الحجز بالشرط الذي أُكّد عليه، ولو تغيّر شرط العقد بعده."
  ),

  /* PAYMENT TERMS. */
  paymentTerms: t("PAYMENT TERMS", "شروط الدفع"),
  howPaid: t("How each contract is paid", "كيف يُدفع كل عقد"),
  allTerms: t("All terms and bank account", "كل الشروط والحساب البنكي"),
} as const;

/*
 * UI 07.20N - the debt itself. A booking paid on booking and cancelled
 * after gives the money back, so the next payment is the statement less
 * this, not nothing: BR-07-58 only floors a payment at zero when the
 * deductions are bigger than it is.
 */
export const owedBooking = "HTL-88230";
export const owedAmount = 2310;
export const owedNextPayment = 18450 - owedAmount;

