/**
 * Flow 07 rebuilt — Flow 12 Row F. The monthly statement replaced the
 * running account, and the running account is gone for good: BR-07-05 lists
 * UI 07.0 / 07.0A-D and 07.5 / 07.6 as removed, with every old link
 * redirected to the pages that replaced them.
 *
 * The cycle, from BR-07-21:
 *
 *   1st  03:00   the statement is issued, "Open for review".
 *   1st-5th      accept it, dispute a line, or do nothing.
 *   6th  00:00   what was not accepted is "Accepted automatically".
 *   15th         paid, dated the 16th on the statement (BR-07-17 moves a
 *                payment that lands on a Friday, Saturday or a bank holiday
 *                *backwards* to the last working day - never later).
 *
 * BR-07-01: every amount includes VAT at 15%, and the column heading says
 * so. BR-07-02: Makkah time throughout, and "today" ends at 23:59:59 there.
 */

export interface Bi {
  en: string;
  ar: string;
}

const t = (en: string, ar: string): Bi => ({ en, ar });

/** BR-07-23 — the five kinds of line a statement carries. */
export type LineKind =
  | "booking"
  | "penalty"
  | "deduction"
  | "correction"
  | "notSupplied";

export type LineState = "open" | "disputed" | "agreed" | "rejected" | "partly";

export interface StatementLine {
  id: string;
  kind: LineKind;
  /** The booking, entry or incident this line is about. */
  reference: string;
  title: Bi;
  detail: Bi;
  hotel: Bi;
  /** Which contract it came from, for BR-07-20's filter. */
  contract: Bi;
  date: Bi;
  /** Positive earns, negative is taken off. Always VAT inclusive. */
  amount: number;
  state: LineState;
  /** What Hoteliana answered on a disputed line. */
  answer?: Bi | undefined;
  /** BR-07-36 — the part agreed, carried to next month as a correction. */
  agreed?: number | undefined;
}

export type StatementState =
  | "open"
  | "accepted"
  | "autoAccepted"
  | "paid"
  | "owed";

export interface Statement {
  /** The month key the URL carries: 2026-09. */
  month: string;
  label: Bi;
  state: StatementState;
  issued: Bi;
  /** BR-07-21 — the review window closes at the end of the 5th. */
  reviewCloses: Bi;
  accepted?: Bi | undefined;
  payOn: Bi;
  paidOn?: Bi | undefined;
  paymentRef?: string | undefined;
  /** BR-07-45 — the tax invoice, which never holds the payment up. */
  invoice?: {
    state: "missing" | "uploaded" | "differs";
    file?: string | undefined;
    /** BR-07-49 — what the system found when it compared it. */
    note?: Bi | undefined;
  };
  lines: StatementLine[];
}

const line = (
  id: string,
  kind: LineKind,
  reference: string,
  title: Bi,
  detail: Bi,
  amount: number,
  date: Bi,
  extra: Partial<StatementLine> = {}
): StatementLine => ({
  id,
  kind,
  reference,
  title,
  detail,
  hotel: t("Al Noor Makkah Hotel", "فندق النور مكة"),
  contract: t("Makkah Annual Block", "حصة مكة السنوية"),
  date,
  amount,
  state: "open",
  ...extra,
});

/** UI 07.23 — September, the statement the frames draw. */
export const statements: Statement[] = [
  {
    month: "2026-09",
    label: t("September 2026", "سبتمبر ٢٠٢٦"),
    state: "open",
    issued: t("1 Oct, 03:00", "١ أكتوبر، ٠٣:٠٠"),
    reviewCloses: t("5 Oct, 23:59", "٥ أكتوبر، ٢٣:٥٩"),
    payOn: t("15 Oct", "١٥ أكتوبر"),
    invoice: { state: "missing" },
    lines: [
      line(
        "SL-01",
        "booking",
        "HTL-88205",
        t("Ahmed Nasser · Standard Room", "أحمد ناصر · غرفة قياسية"),
        t("3 nights · checked out 12 Sep", "٣ ليالٍ · غادر ١٢ سبتمبر"),
        4620,
        t("12 Sep", "١٢ سبتمبر")
      ),
      line(
        "SL-02",
        "booking",
        "HTL-88198",
        t("Sara Khalid · Deluxe Room", "سارة خالد · غرفة ديلوكس"),
        t("4 nights · checked out 18 Sep", "٤ ليالٍ · غادرت ١٨ سبتمبر"),
        7360,
        t("18 Sep", "١٨ سبتمبر")
      ),
      line(
        "SL-03",
        "booking",
        "HTL-88176",
        t("Mona Ibrahim · Standard Room", "منى إبراهيم · غرفة قياسية"),
        t("2 nights · checked out 24 Sep", "ليلتان · غادرت ٢٤ سبتمبر"),
        2760,
        t("24 Sep", "٢٤ سبتمبر")
      ),
      /* BR-07-24 — the fine lands in the month it became final. */
      line(
        "SL-04",
        "penalty",
        "HTL-88191",
        t("Cancellation fee you earned", "غرامة إلغاء استحققتها"),
        t("Cancelled 11 Sep · within 48 hours", "أُلغي ١١ سبتمبر · خلال ٤٨ ساعة"),
        1840,
        t("11 Sep", "١١ سبتمبر")
      ),
      line(
        "SL-05",
        "deduction",
        "ADJ-2026-0043",
        t("Guest relocated", "نُقل النزيل"),
        t(
          "HTL-88160 · 4 rooms were not available on arrival",
          "HTL-88160 · ٤ غرف لم تكن متاحة عند الوصول"
        ),
        -560,
        t("15 Sep", "١٥ سبتمبر")
      ),
      /* BR-07-23 — a relocation shows at zero with its incident number. */
      line(
        "SL-06",
        "notSupplied",
        "INC-2026-0119",
        t("Not supplied · guest relocated", "لم تُورَّد · نُقل النزيل"),
        t("HTL-88160 · Faisal Al-Harthy", "HTL-88160 · فيصل الحارثي"),
        0,
        t("15 Sep", "١٥ سبتمبر")
      ),
      line(
        "SL-07",
        "correction",
        "HTL-88104",
        t("Correction · August statement", "تصحيح · كشف أغسطس"),
        t(
          "Dispute agreed · rate was 120 SAR a night higher",
          "قُبل الاعتراض · كان السعر أعلى بـ١٢٠ ريالًا لليلة"
        ),
        480,
        t("2 Sep", "٢ سبتمبر")
      ),
    ],
  },
  {
    month: "2026-08",
    label: t("August 2026", "أغسطس ٢٠٢٦"),
    state: "paid",
    issued: t("1 Sep, 03:00", "١ سبتمبر، ٠٣:٠٠"),
    reviewCloses: t("5 Sep, 23:59", "٥ سبتمبر، ٢٣:٥٩"),
    accepted: t("Accepted automatically · 6 Sep", "قُبل تلقائيًا · ٦ سبتمبر"),
    payOn: t("15 Sep", "١٥ سبتمبر"),
    paidOn: t("16 Sep", "١٦ سبتمبر"),
    paymentRef: "PAY-2026-0014",
    invoice: {
      state: "differs",
      file: "INV-JAS-2026-08.pdf",
      note: t(
        "Differs by 120 · noted, and the payment was not held.",
        "يختلف بمقدار ١٢٠ · سُجّل، ولم يُحتجز الدفع."
      ),
    },
    lines: [
      line(
        "AL-01",
        "booking",
        "HTL-88104",
        t("Khalid Omar · Family Suite", "خالد عمر · جناح عائلي"),
        t("5 nights · checked out 21 Aug", "٥ ليالٍ · غادر ٢١ أغسطس"),
        18450,
        t("21 Aug", "٢١ أغسطس"),
        {
          state: "agreed",
          agreed: 480,
          answer: t(
            "Agreed · the rate was 120 SAR a night higher. The difference is on the September statement.",
            "قُبل · كان السعر أعلى بـ١٢٠ ريالًا لليلة. والفرق على كشف سبتمبر."
          ),
        }
      ),
      line(
        "AL-02",
        "booking",
        "HTL-88090",
        t("Reem Salem · Standard Room", "ريم سالم · غرفة قياسية"),
        t("2 nights · checked out 9 Aug", "ليلتان · غادرت ٩ أغسطس"),
        2760,
        t("9 Aug", "٩ أغسطس")
      ),
    ],
  },
  {
    month: "2026-07",
    label: t("July 2026", "يوليو ٢٠٢٦"),
    state: "paid",
    issued: t("1 Aug, 03:00", "١ أغسطس، ٠٣:٠٠"),
    reviewCloses: t("5 Aug, 23:59", "٥ أغسطس، ٢٣:٥٩"),
    accepted: t("Accepted · 2 Aug", "مقبول · ٢ أغسطس"),
    payOn: t("15 Aug", "١٥ أغسطس"),
    paidOn: t("16 Aug", "١٦ أغسطس"),
    paymentRef: "PAY-2026-0011",
    invoice: { state: "uploaded", file: "INV-JAS-2026-07.pdf" },
    lines: [
      line(
        "JL-01",
        "booking",
        "HTL-87990",
        t("Yousef Amin · Deluxe Room", "يوسف أمين · غرفة ديلوكس"),
        t("3 nights · checked out 19 Jul", "٣ ليالٍ · غادر ١٩ يوليو"),
        5520,
        t("19 Jul", "١٩ يوليو")
      ),
    ],
  },
  {
    /* UI 07.23P3 - the detail draws it in full; the list needs its facts. */
    month: "2026-06",
    label: t("June 2026", "يونيو ٢٠٢٦"),
    state: "paid",
    issued: t("1 Jul, 03:00", "١ يوليو، ٠٣:٠٠"),
    reviewCloses: t("5 Jul, 23:59", "٥ يوليو، ٢٣:٥٩"),
    accepted: t("Accepted · 3 Jul", "مقبول · ٣ يوليو"),
    payOn: t("15 Jul", "١٥ يوليو"),
    paidOn: t("16 Jul", "١٦ يوليو"),
    paymentRef: "PAY-2026-0008",
    invoice: {
      state: "differs",
      file: "INV-JS-2026-0611.pdf",
      note: t(
        "Differs by 120 · tracked, and the payment was not held.",
        "تختلف بـ١٢٠ · مُسجَّل، ولم يُحتجز الدفع."
      ),
    },
    lines: [
      line(
        "JN-01",
        "booking",
        "HTL-87901",
        t("Hana Tawfiq · Deluxe Room", "هناء توفيق · غرفة ديلوكس"),
        t("4 nights · checked out 22 Jun", "٤ ليالٍ · غادرت ٢٢ يونيو"),
        7360,
        t("22 Jun", "٢٢ يونيو")
      ),
    ],
  },
];

/** BR-07-23 — Amount due = Bookings + Penalties − Deductions ± Corrections. */
export function amountDue(statement: Statement): number {
  return statement.lines.reduce((sum, item) => sum + item.amount, 0);
}

export function totalsByKind(statement: Statement): Record<LineKind, number> {
  const totals: Record<LineKind, number> = {
    booking: 0,
    penalty: 0,
    deduction: 0,
    correction: 0,
    notSupplied: 0,
  };
  for (const item of statement.lines) totals[item.kind] += item.amount;
  return totals;
}

export const statementCopy = {
  /*
   * OV 07.D - "بيفتح OV 07.D تحت الزرار فيه 8px ومحاذي ليه. 3 مجموعات
   * MONEY و DOCUMENTS و SETTINGS": the eight items are not a flat list,
   * they are three groups, and the panel hangs 8px under the button.
   */
  groups: [
    {
      key: "money",
      title: t("MONEY", "المال"),
      items: ["overview", "earnings", "statements", "payments", "adjustments"],
    },
    {
      key: "documents",
      title: t("DOCUMENTS", "المستندات"),
      items: ["invoices", "reports"],
    },
    {
      key: "settings",
      title: t("SETTINGS", "الإعدادات"),
      items: ["bank"],
    },
  ],

  /* The four counts the menu carries, and what each one means. */
  badgeStatements: t("{n} to review", "{n} للمراجعة"),
  badgeInvoices: t("{n} missing", "{n} ناقصة"),
  badgeAdjustments: t("{n} not opened", "{n} لم تُفتح"),
  /* A returned payment, which is a "!" rather than a count. */
  badgePayment: t("A payment came back", "عادت دفعة"),

  /*
   * The eight items, with the hint and the icon OV 07.D draws. The hints
   * had been written from the guide's one-line summaries; these are the
   * frame's own, which say rather more - "Every booking and the day it is
   * payable" tells a supplier something "by payment term" does not.
   */
  menu: [
    {
      key: "overview",
      label: t("Overview", "نظرة عامة"),
      to: "/finance",
      icon: "layers",
      hint: t(
        "What is due, when, and what needs you",
        "ما المستحق ومتى وما يحتاجك"
      ),
    },
    {
      key: "earnings",
      label: t("Earnings", "الأرباح"),
      to: "/finance/earnings",
      icon: "list-checks",
      hint: t(
        "Every booking and the day it is payable",
        "كل حجز واليوم الذي يُدفع فيه"
      ),
    },
    {
      key: "statements",
      label: t("Statements", "الكشوف"),
      to: "/finance/statements",
      icon: "file-text",
      hint: t(
        "Monthly statements to review and accept",
        "كشوف شهرية للمراجعة والقبول"
      ),
    },
    {
      key: "payments",
      label: t("Payments", "المدفوعات"),
      to: "/finance/payments",
      /* The frame left this row on the icon set's default variant - a
         white tick, invisible on a white panel - so Payments was the one
         row in the menu with no mark at all. A note and a coin, drawn in
         the same hand as the others. */
      icon: "payment",
      hint: t("Transfers Hoteliana made to you", "تحويلات أرسلتها هوتيليانا إليك"),
    },
    {
      key: "adjustments",
      label: t("Adjustments", "التسويات"),
      to: "/finance/adjustments",
      icon: "change-request",
      hint: t(
        "Recoveries, corrections and refunds owed",
        "استردادات وتصحيحات ومبالغ مستحقة"
      ),
    },
    {
      key: "invoices",
      label: t("Tax invoices", "الفواتير الضريبية"),
      to: "/finance/tax-invoices",
      icon: "file-signed",
      hint: t(
        "Upload yours · reminders if one is missing",
        "ارفع فواتيرك · وتذكير إن نقصت واحدة"
      ),
    },
    {
      key: "reports",
      label: t("Reports", "التقارير"),
      to: "/finance/reports",
      icon: "file",
      hint: t(
        "Account statement, aging, VAT and more",
        "كشف الحساب والأعمار والضريبة وغيرها"
      ),
    },
    {
      key: "bank",
      label: t("Bank & payment terms", "البنك وشروط الدفع"),
      to: "/finance/bank",
      icon: "bank",
      hint: t("Where and when you are paid", "أين ومتى تُدفع"),
    },
  ],

  financeTitle: t("Finance", "المالية"),
  overline: t("FINANCE", "المالية"),

  /* UI 07.23 — the statement itself. */
  statementsTitle: t("Statements", "الكشوف"),
  statementsSubtitle: t(
    "One statement a month for the whole company, covering every booking that checked out under an After check-out term.",
    "كشف واحد في الشهر للشركة كلها، يغطي كل حجز غادر بشرط «بعد المغادرة»."
  ),
  colMonth: t("MONTH", "الشهر"),
  colIssued: t("ISSUED", "صدر"),
  colDue: t("AMOUNT DUE · INCL. VAT", "المستحق · شامل الضريبة"),
  colState: t("STATE", "الحالة"),
  colPaid: t("PAID", "دُفع"),
  open: t("Open for review", "مفتوح للمراجعة"),
  accepted: t("Accepted", "مقبول"),
  autoAccepted: t("Accepted automatically", "قُبل تلقائيًا"),
  paid: t("Paid", "مدفوع"),
  owed: t("Owed to Hoteliana", "مستحق لهوتيليانا"),
  review: t("Review", "مراجعة"),
  view: t("View", "عرض"),

  /* The detail's head. */
  issuedOn: t("Issued {when}", "صدر {when}"),
  reviewUntil: t("Review until {when}", "المراجعة حتى {when}"),
  payOn: t("Pay on {when}", "الدفع في {when}"),
  paidOn: t("Paid {when} · {ref}", "دُفع {when} · {ref}"),
  /* BR-07-31 — after the window, the button is gone and this line explains. */
  windowClosed: t(
    "The review window closed on {when}. To raise a line, contact Hoteliana.",
    "أُغلقت نافذة المراجعة في {when}. ولإثارة سطر، تواصل مع هوتيليانا."
  ),
  contactHoteliana: t("Contact Hoteliana", "تواصل مع هوتيليانا"),

  /* BR-07-23 — the five groups, and the sum line. */
  bookings: t("Bookings", "الحجوزات"),
  penalties: t("Penalties you earned", "غرامات استحققتها"),
  deductions: t("Deductions", "الخصومات"),
  corrections: t("Corrections", "التصحيحات"),
  notSupplied: t("Not supplied", "لم تُورَّد"),
  amountDue: t("Amount due", "المبلغ المستحق"),
  sumRule: t(
    "Bookings + Penalties − Deductions ± Corrections",
    "الحجوزات + الغرامات − الخصومات ± التصحيحات"
  ),

  colLine: t("LINE", "السطر"),
  colReference: t("REFERENCE", "المرجع"),
  colDate: t("DATE", "التاريخ"),
  colAmount: t("AMOUNT · INCL. VAT", "المبلغ · شامل الضريبة"),

  /* OV 07.24 — accepting. BR-07-28 makes it final. */
  acceptCta: t("Accept the statement", "اقبل الكشف"),
  acceptRest: t("Accept the rest", "اقبل الباقي"),
  acceptTitle: t("Accept {month}?", "قبول {month}؟"),
  acceptBody: t(
    "Accepting is final - there is no undo. Anything wrong after this is fixed as a correction on a later statement.",
    "القبول نهائي — ولا تراجع عنه. وأي خطأ بعده يُصلَّح تصحيحًا في كشف لاحق."
  ),
  acceptRestBody: t(
    "{count} lines stay under review. The rest is accepted and paid on {when}.",
    "{count} سطور تبقى تحت المراجعة. ويُقبل الباقي ويُدفع في {when}."
  ),
  /* One line is the common case, so it gets its own sentence. */
  acceptRestOne: t(
    "One line stays under review. The rest is accepted and paid on {when}.",
    "يبقى سطر واحد تحت المراجعة. ويُقبل الباقي ويُدفع في {when}."
  ),
  acceptConfirm: t("Accept", "اقبل"),
  cancel: t("Cancel", "إلغاء"),
  accepting: t("Accepted · {when}", "قُبل · {when}"),
  autoNote: t(
    "Not accepted by the 5th is accepted automatically on the 6th.",
    "ما لا يُقبل حتى الخامس يُقبل تلقائيًا في السادس."
  ),

  /* OV 07.25 — disputing one line. */
  dispute: t("Dispute this line", "اعترض على هذا السطر"),
  disputeTitle: t("What is wrong with this line?", "ما الخطأ في هذا السطر؟"),
  /* BR-07-35 / BR-07-36 — the rest is paid on time, at the issued amount. */
  disputeBody: t(
    "The rest of the statement is paid on time, at the amount it was issued for. If we agree, the difference is a correction on next month's statement.",
    "يُدفع باقي الكشف في موعده بالمبلغ الذي صدر به. وإن اتفقنا، يكون الفرق تصحيحًا في كشف الشهر القادم."
  ),
  disputeReasons: [
    t("The rate is wrong", "السعر خطأ"),
    t("The nights are wrong", "الليالي خطأ"),
    t("This booking was never supplied", "لم يُورَّد هذا الحجز قط"),
    t("The guest did not stay", "لم يقم النزيل"),
    t("Something else", "شيء آخر"),
  ],
  disputeWhat: t("WHAT YOU THINK IT SHOULD BE", "ما تظنّ أنه الصواب"),
  disputeNote: t("TELL US IN A LINE", "أخبرنا في سطر"),
  disputeSend: t("Send the dispute", "أرسل الاعتراض"),
  /* BR-07-39 — Hoteliana answers within two working days. */
  disputeSla: t(
    "Hoteliana answers within 2 working days.",
    "ترد هوتيليانا خلال يومَي عمل."
  ),
  /* BR-07-37 — one open dispute per line, and none after it is settled. */
  oneDispute: t(
    "This line has been disputed once. To raise it again, contact Hoteliana.",
    "اعتُرض على هذا السطر مرة. ولإثارته ثانية، تواصل مع هوتيليانا."
  ),
  underReview: t("Under review", "تحت المراجعة"),
  agreedPill: t("Agreed", "قُبل"),
  rejectedPill: t("Rejected", "رُفض"),
  partlyPill: t("Partly agreed", "قُبل جزئيًا"),

  /* BR-07-45 — the tax invoice never holds a payment up. */
  invoiceTitle: t("Tax invoice", "الفاتورة الضريبية"),
  invoiceMissing: t("Not uploaded yet", "لم تُرفع بعد"),
  invoiceAfterAccept: t(
    "Upload it after you accept - the statement is final then.",
    "ارفعها بعد قبولك — فالكشف نهائي حينئذ."
  ),
  invoiceUpload: t("Upload tax invoice", "ارفع الفاتورة الضريبية"),
  invoiceReplace: t("Upload a corrected invoice", "ارفع فاتورة مصححة"),
  invoiceNeverHolds: t(
    "A missing or different invoice never holds the payment up.",
    "الفاتورة الناقصة أو المختلفة لا تحتجز الدفع أبدًا."
  ),

  /* UI 07.20 — the overview, and its states. */
  overviewTitle: t("What Hoteliana owes you", "ما تستحقّه على هوتيليانا"),
  nextPayment: t("NEXT PAYMENT", "الدفعة التالية"),
  thisStatement: t("THIS STATEMENT", "هذا الكشف"),
  needsYou: t("NEEDS YOU", "يحتاجك"),
  nothingDueTitle: t("Nothing is due yet", "لا شيء مستحق بعد"),
  nothingDueBody: t(
    "You have business on the books. None of it is due yet - that is normal for a new month.",
    "لديك أعمال مسجّلة. ولا شيء منها مستحق بعد — وهذا طبيعي في شهر جديد."
  ),
  /* UI 07.20H — Hoteliana has paused payments. */
  pausedTitle: t("Payments are paused", "المدفوعات موقوفة"),
  pausedBody: t(
    "Hoteliana has paused payments on this account. Your statements keep being issued and nothing is lost.",
    "أوقفت هوتيليانا المدفوعات على هذا الحساب. وتستمر كشوفك في الصدور ولا يضيع شيء."
  ),
  /* UI 07.20N / BR-07-26 — the month came out negative. */
  /*
   * UI 07.20N - BR-07-60. A banner that says only "you owe" leaves the
   * supplier to guess which booking and what happens if they do nothing,
   * so it names the booking, says the money comes off the next payment on
   * its own, and gives the date after which they will be asked to send it.
   */
  owedTitle: t("You owe Hoteliana {amount}", "عليك لهوتيليانا {amount}"),
  owedBody: t(
    "{booking} was cancelled after we paid you on booking, so {amount} comes back to Hoteliana. It is taken from your next payment automatically. If it is still open on {by}, we ask you to transfer it.",
    "أُلغي {booking} بعد أن دفعنا لك عند الحجز، فتعود {amount} إلى هوتيليانا. وتُخصم من دفعتك التالية تلقائيًا. فإن بقيت مفتوحة في {by} طلبنا منك تحويلها."
  ),
  openStatements: t("Open statements", "افتح الكشوف"),
} as const;
