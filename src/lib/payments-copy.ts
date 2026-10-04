/**
 * UI 07.32 / 07.32R / 07.32E — the words the payments page prints.
 *
 * BR-07-17 — a payment that lands on a Friday, Saturday or a bank holiday
 * moves *backwards* to the last working day, never later, so every date
 * here is a date money left rather than a date it was meant to.
 */

export interface Bi {
  en: string;
  ar: string;
}

const t = (en: string, ar: string): Bi => ({ en, ar });

export const paymentsCopy = {
  overline: t("FINANCE", "المالية"),
  title: t("Payments", "المدفوعات"),
  subtitle: t(
    "Every transfer Hoteliana made to you and what it covered. The date of each payment follows the terms in your contracts.",
    "كل تحويل أرسلته هوتيليانا إليك وما غطّاه. وتاريخ كل دفعة يتبع شروط عقودك."
  ),
  export: t("Export", "تصدير"),

  /* The three questions the page is opened with. */
  paidThisYear: t("PAID THIS YEAR", "المدفوع هذا العام"),
  paymentsCount: t("SAR · {n} payments", "ر.س · {n} دفعة"),
  lastPayment: t("LAST PAYMENT", "آخر دفعة"),
  lastPaymentNote: t(
    "SAR · 16 Sep · August statement",
    "ر.س · ١٦ سبتمبر · كشف أغسطس"
  ),
  nextPayment: t("NEXT PAYMENT", "الدفعة القادمة"),
  nextPaymentNote: t(
    "SAR · 12 Oct · HTL-88420 on arrival",
    "ر.س · ١٢ أكتوبر · HTL-88420 عند الوصول"
  ),

  period: t("Period", "الفترة"),
  hotel: t("Hotel", "الفندق"),
  allHotels: t("All hotels", "كل الفنادق"),

  colPayment: t("PAYMENT", "الدفعة"),
  colPaidOn: t("PAID ON", "دُفعت في"),
  colCovers: t("COVERS", "تغطي"),
  colAmount: t("AMOUNT · INCL. VAT", "المبلغ · شامل الضريبة"),
  colBankRef: t("BANK REFERENCE", "مرجع البنك"),
  remittance: t("Remittance advice", "إشعار التحويل"),
  footer: t(
    "{shown} of {total} payments · to {bank}",
    "{shown} من {total} دفعة · إلى {bank}"
  ),
  bank: t("Al Rajhi Bank ···· 4417", "مصرف الراجحي ···· 4417"),
  /* BR-07-51 - after a returned transfer, the footer names the account we
     pay into now, not the closed one the older transfers went to. */
  bankNew: t("Al Rajhi Bank ···· 5183", "مصرف الراجحي ···· 5183"),

  /* UI 07.32R — the bank sent one back. */
  returned: t("Returned", "مرتجعة"),
  cameBackTitle: t("A payment came back", "عادت دفعة"),
  cameBackBody: t(
    "PAY-017 · 18,450 SAR for the September statement came back from your bank on 17 Oct - the account is closed. Update your bank account; we pay it again within 2 working days after the new account is verified.",
    "PAY-017 · ١٨٬٤٥٠ ر.س لكشف سبتمبر عادت من بنكك في ١٧ أكتوبر — الحساب مغلق. حدّث حسابك البنكي؛ ونعيد الدفع خلال يومَي عمل بعد التحقق من الحساب الجديد."
  ),
  updateBank: t("Update bank account", "حدّث الحساب البنكي"),

  /* UI 07.32E — nothing has been paid yet, which is not a failure. */
  emptyTitle: t("No payments yet", "لا مدفوعات بعد"),
  emptyBody: t(
    "Payments show here after your first statement is accepted - on the payment date in your contract (statement + 15 days).",
    "تظهر المدفوعات هنا بعد قبول أول كشف لك — في تاريخ الدفع المذكور في عقدك (الكشف + ١٥ يومًا)."
  ),
  seeTerms: t("See payment terms", "اطّلع على شروط الدفع"),
  noPaymentsYetNote: t("SAR · no payments yet", "ر.س · لا مدفوعات بعد"),
  noPaymentYet: t("no payment yet", "لا دفعة بعد"),
  nothingScheduled: t("nothing scheduled yet", "لا شيء مجدول بعد"),
  /*
   * OV 07.11 - the remittance advice. The flow names what it carries:
   * Payment, Paid on, Bank reference, Paid to, Lines, Total and Held back,
   * then a format and a download - and nothing else, because this is the
   * document an accountant reconciles against rather than a screen to read.
   */
  adviceOverline: t("REMITTANCE ADVICE", "إشعار التحويل"),
  adviceIntro: t(
    "The document your accountant reconciles against. Every amount includes VAT.",
    "المستند الذي يطابق عليه محاسبك. وكل مبلغ شامل الضريبة."
  ),
  advicePaidOn: t("Paid on", "دُفعت في"),
  adviceBankRef: t("Bank reference", "مرجع البنك"),
  advicePaidTo: t("Paid to", "دُفعت إلى"),
  /* BR-07-54 - amount, what it was, and which booking or entry it is. */
  adviceColAmount: t("AMOUNT", "المبلغ"),
  adviceColWhat: t("WHAT", "ماذا"),
  adviceColRef: t("BOOKING / ENTRY", "الحجز / القيد"),
  adviceLinesSum: t("{lines} · {amount} SAR", "{lines} · {amount} ر.س"),
  adviceTransferred: t("Transferred", "المحوّل"),
  adviceOpenStatement: t("Open the statement", "افتح الكشف"),

  /* BR-07-53 / BR-07-16 - not paid, and not lost either. */
  adviceHeldLine: t(
    "Held back · {amount} SAR · {dispute} disputed",
    "محجوز · {amount} ر.س · {dispute} تحت الاعتراض"
  ),
  adviceHeldBody: t(
    "It is held out of this transfer while the dispute is open. Settled in your favour, it is paid in the next payment; settled against you, it becomes a deduction on a later statement.",
    "يُحجز من هذا التحويل ما دام الاعتراض مفتوحًا. فإن سُوّي لصالحك دُفع في الدفعة التالية، وإن سُوّي عليك صار خصمًا في كشف لاحق."
  ),
  adviceSeeEntry: t("See the entry", "اطّلع على القيد"),

  /* BR-07-55 - a returned transfer still has an advice, for the archive. */
  adviceReturned: t("Returned · {date}", "مرتجعة · {date}"),
  adviceReturnedBody: t(
    "The bank sent this transfer back, so it is not money you have. The advice still downloads, for your records.",
    "أعاد البنك هذا التحويل، فهو ليس مالًا لديك. ويبقى الإشعار قابلًا للتنزيل لسجلاتك."
  ),
  adviceFormat: t("Format", "الصيغة"),
  adviceDownload: t("Download", "تنزيل"),
  adviceClose: t("Close", "إغلاق"),
  adviceDownloaded: t(
    "Remittance advice downloaded",
    "نُزّل إشعار التحويل"
  ),

  /* BR-07-51 - the same money, sent again to the account you put right. */
  paid: t("Paid", "مدفوعة"),
  rePaymentOf: t("Re-payment of {id}", "إعادة دفع {id}"),
  sentAgainTitle: t("The payment was sent again", "أُعيد إرسال الدفعة"),
  sentAgainBody: t(
    "PAY-017 came back on 17 Oct. Your new account was verified, and the same 18,450 SAR went out again as PAY-018 on 21 Oct.",
    "عادت PAY-017 في ١٧ أكتوبر. وتمّ التحقق من حسابك الجديد، فخرج المبلغ نفسه ١٨٬٤٥٠ ر.س مرة أخرى بوصفها PAY-018 في ٢١ أكتوبر."
  ),
  lastPaymentRepaid: t(
    "SAR · 21 Oct · September statement",
    "ر.س · ٢١ أكتوبر · كشف سبتمبر"
  ),
  dash: t("—", "—"),
} as const;
