/**
 * UI 07.23 — one month's statement, as the frame lays it out.
 *
 * The frame splits the lines in two, and the split matters: **bookings**
 * are what the month earned, and **penalties and deductions** are what was
 * added to or taken from them. They are different questions, so they are
 * different tables, and the four totals sit above both as tiles rather than
 * as a sum row underneath.
 *
 * BR-07-23's arithmetic is unchanged - bookings + penalties − deductions ±
 * corrections - it is just shown as the tiles now.
 */

export interface Bi {
  en: string;
  ar: string;
}

const t = (en: string, ar: string): Bi => ({ en, ar });

export type BookingLineState =
  | "inStatement"
  | "disputed"
  | "agreed"
  | "rejected"
  /* Once the month is paid every row reads the same way. */
  | "paid";

export interface BookingLine {
  id: string;
  who: Bi;
  checkOut: Bi;
  stay: Bi;
  amount: number;
  state: BookingLineState;
}

export interface AdjustmentLine {
  reference: string;
  sub: Bi;
  what: Bi;
  amount: number;
}

export type StatementState =
  | "open"
  | "accepted"
  | "autoAccepted"
  | "paid"
  | "owed";

export interface MonthStatement {
  month: string;
  label: Bi;
  /** The overline the frame prints across the top. */
  overline: Bi;
  state: StatementState;
  reviewUntil: Bi;
  issued: Bi;
  payOn: Bi;
  paidOn?: Bi | undefined;
  acceptedNote?: Bi | undefined;
  /**
   * The sentence under the title. It names its own month, and only the
   * month still open mentions the filter - the others are already settled.
   */
  subtitle: Bi;
  /**
   * What the bookings tile reads. It is not the sum of the rows: the frame
   * lists five of twelve and still prints the month's whole figure.
   */
  bookingsTotal: number;
  /** The band that replaces the blue strip once the month is settled. */
  band?: { tone: "success" | "warning"; title: Bi; body: Bi } | undefined;
  bookings: BookingLine[];
  adjustments: AdjustmentLine[];
  /** The counts the tiles print beside each total. */
  bookingCount: number;
  shown: number;
  penaltyNote: Bi;
  deductionNote: Bi;
  /**
   * BR-07-45 - the tax invoice never holds the payment up, so the card is a
   * record, not a gate. While the month is still waiting to be paid and
   * nothing has been uploaded, the frames draw it as a banner asking for
   * one; in every other case they draw the three rows below.
   */
  invoice: {
    state: "missing" | "uploaded" | "differs";
    /** "INV-JS-2026-0931 · 2 Oct 2026 · 18,450 SAR incl. VAT" */
    ref?: Bi | undefined;
    /** What the comparison found, as its own pill. */
    check?: Bi | undefined;
    checkTone?: "success" | "warning" | undefined;
    uploaded?: Bi | undefined;
    /** The button under the rows, where one is offered. */
    action?: Bi | undefined;
  };
  payment: { date: Bi; to: Bi; state: "scheduled" | "paid" };
}

const booking = (
  id: string,
  who: Bi,
  checkOut: Bi,
  stay: Bi,
  amount: number,
  state: BookingLineState = "inStatement"
): BookingLine => ({ id, who, checkOut, stay, amount, state });

export const monthStatements: MonthStatement[] = [
  {
    month: "2026-09",
    label: t("September 2026", "سبتمبر ٢٠٢٦"),
    overline: t(
      "STATEMENT · SEPTEMBER 2026 · CHECK-OUTS 1-30 SEP · JEWAR AL-SAFWAH CO. · ALL YOUR HOTELS",
      "كشف · سبتمبر ٢٠٢٦ · مغادرات ١-٣٠ سبتمبر · شركة جوار الصفوة · كل فنادقك"
    ),
    state: "open",
    issued: t("1 Oct", "١ أكتوبر"),
    reviewUntil: t("5 Oct", "٥ أكتوبر"),
    payOn: t("16 Oct", "١٦ أكتوبر"),
    subtitle: t(
      "One statement for your company - every hotel and every contract paid after check-out, for bookings that checked out in September. Filter by hotel below. Every amount includes VAT.",
      "كشف واحد لشركتك — كل فندق وكل عقد يُدفع بعد المغادرة، للحجوزات التي غادرت في سبتمبر. رشّح بالفندق أدناه. وكل مبلغ شامل الضريبة."
    ),
    bookingsTotal: 20130,
    bookingCount: 12,
    shown: 5,
    penaltyNote: t("SAR · 1 cancellation", "ر.س · إلغاء واحد"),
    deductionNote: t("SAR · 1 guest relocation", "ر.س · نقل نزيل واحد"),
    bookings: [
      booking(
        "HTL-88142",
        t("Lina Farouk · Al Noor Makkah Hotel", "لينا فاروق · فندق النور مكة"),
        t("5 Sep", "٥ سبتمبر"),
        t("4 nights · 2 rooms", "٤ ليالٍ · غرفتان"),
        6300
      ),
      booking(
        "HTL-88205",
        t("Ahmed Nasser · Al Noor Makkah Hotel", "أحمد ناصر · فندق النور مكة"),
        t("24 Sep", "٢٤ سبتمبر"),
        t("4 nights · 3 rooms", "٤ ليالٍ · ٣ غرف"),
        9240
      ),
      booking(
        "HTL-88209",
        t("Mona Ibrahim · Al Noor Makkah Hotel", "منى إبراهيم · فندق النور مكة"),
        t("19 Sep", "١٩ سبتمبر"),
        t("2 nights · 1 room", "ليلتان · غرفة واحدة"),
        1380
      ),
      booking(
        "HTL-88198",
        t("Sara Khalid · Al Noor Makkah Hotel", "سارة خالد · فندق النور مكة"),
        t("26 Sep", "٢٦ سبتمبر"),
        t("4 nights · 1 room", "٤ ليالٍ · غرفة واحدة"),
        2200
      ),
      booking(
        "HTL-88147",
        t("Omar Bakr · Anwar Al Madinah", "عمر بكر · أنوار المدينة"),
        t("4 Sep", "٤ سبتمبر"),
        t("3 nights · 1 room", "٣ ليالٍ · غرفة واحدة"),
        1010
      ),
    ],
    adjustments: [
      {
        reference: "HTL-88191",
        sub: t("Yousef Rahman · Al Noor Makkah Hotel", "يوسف رحمن · فندق النور مكة"),
        what: t(
          "Cancellation fee you charged · 1 night",
          "غرامة إلغاء حصّلتها · ليلة واحدة"
        ),
        amount: 1420,
      },
      {
        reference: "INC-0087",
        sub: t("HTL-88121 · Nasser Al-Amri", "HTL-88121 · ناصر العامري"),
        what: t(
          "Guest relocated - room not available on arrival · cost difference + 500 SAR admin fee",
          "نُقل النزيل — الغرفة غير متاحة عند الوصول · فرق التكلفة + ٥٠٠ ر.س رسوم إدارية"
        ),
        amount: -3100,
      },
    ],
    invoice: { state: "missing" },
    payment: {
      date: t(
        "16 Oct 2026 · 15 days after the statement (contract term)",
        "١٦ أكتوبر ٢٠٢٦ · بعد الكشف بـ١٥ يومًا (شرط العقد)"
      ),
      to: t(
        "Al Rajhi Bank ···· 4417 · Jewar Al-Safwah Co.",
        "مصرف الراجحي ···· 4417 · شركة جوار الصفوة"
      ),
      state: "scheduled",
    },
  },
  {
    /* UI 07.23P1 - paid, and still waiting for its tax invoice. */
    month: "2026-08",
    label: t("August 2026", "أغسطس ٢٠٢٦"),
    overline: t(
      "STATEMENT · AUGUST 2026 · CHECK-OUTS 1-31 AUG · JEWAR AL-SAFWAH CO. · ALL YOUR HOTELS",
      "كشف · أغسطس ٢٠٢٦ · مغادرات ١-٣١ أغسطس · شركة جوار الصفوة · كل فنادقك"
    ),
    state: "paid",
    issued: t("1 Sep", "١ سبتمبر"),
    reviewUntil: t("5 Sep", "٥ سبتمبر"),
    payOn: t("16 Sep", "١٦ سبتمبر"),
    paidOn: t("16 Sep", "١٦ سبتمبر"),
    acceptedNote: t("Auto-accepted · 6 Sep", "قُبل تلقائيًا · ٦ سبتمبر"),
    subtitle: t(
      "One statement for your company - every hotel and every contract paid after check-out, for bookings that checked out in August. Every amount includes VAT.",
      "كشف واحد لشركتك — كل فندق وكل عقد يُدفع بعد المغادرة، للحجوزات التي غادرت في أغسطس. وكل مبلغ شامل الضريبة."
    ),
    band: {
      tone: "success",
      title: t("Accepted automatically", "قُبل تلقائيًا"),
      body: t(
        "Nobody reviewed it by 5 Sep, so it was accepted automatically on 6 Sep. 21,300 SAR was paid on 16 Sep to Al Rajhi ···· 4417. A mistake found later is corrected in a later statement.",
        "لم يراجعه أحد حتى ٥ سبتمبر، فقُبل تلقائيًا في ٦ سبتمبر. ودُفعت ٢١٬٣٠٠ ر.س في ١٦ سبتمبر إلى الراجحي ···· 4417. وأي خطأ يظهر لاحقًا يُصحَّح في كشف لاحق."
      ),
    },
    bookingsTotal: 21120,
    bookingCount: 15,
    shown: 5,
    penaltyNote: t("SAR · 1 no-show", "ر.س · تخلف واحد"),
    deductionNote: t("SAR · 1 correction from July", "ر.س · تصحيح واحد من يوليو"),
    bookings: [
      booking(
        "HTL-88142",
        t("Lina Farouk · Al Noor Makkah Hotel", "لينا فاروق · فندق النور مكة"),
        t("5 Aug", "٥ أغسطس"),
        t("4 nights · 2 rooms", "٤ ليالٍ · غرفتان"),
        6300,
        "paid"
      ),
      booking(
        "HTL-88205",
        t("Ahmed Nasser · Al Noor Makkah Hotel", "أحمد ناصر · فندق النور مكة"),
        t("24 Aug", "٢٤ أغسطس"),
        t("4 nights · 3 rooms", "٤ ليالٍ · ٣ غرف"),
        9240,
        "paid"
      ),
      booking(
        "HTL-88209",
        t("Mona Ibrahim · Al Noor Makkah Hotel", "منى إبراهيم · فندق النور مكة"),
        t("19 Aug", "١٩ أغسطس"),
        t("2 nights · 1 room", "ليلتان · غرفة واحدة"),
        1380,
        "paid"
      ),
      booking(
        "HTL-88198",
        t("Sara Khalid · Al Noor Makkah Hotel", "سارة خالد · فندق النور مكة"),
        t("26 Aug", "٢٦ أغسطس"),
        t("4 nights · 1 room", "٤ ليالٍ · غرفة واحدة"),
        2200,
        "paid"
      ),
      booking(
        "HTL-88147",
        t("Omar Bakr · Anwar Al Madinah", "عمر بكر · أنوار المدينة"),
        t("4 Aug", "٤ أغسطس"),
        t("3 nights · 1 room", "٣ ليالٍ · غرفة واحدة"),
        1010,
        "paid"
      ),
    ],
    adjustments: [
      {
        reference: "HTL-88010",
        sub: t(
          "Khalid Omar · Anwar Al Madinah",
          "خالد عمر · أنوار المدينة"
        ),
        what: t(
          "No-show · on-arrival contract · 1 night penalty under the booking policy",
          "تخلف عن الحضور · عقد دفع عند الوصول · غرامة ليلة واحدة بموجب سياسة الحجز"
        ),
        amount: 640,
      },
      {
        reference: "HTL-87980",
        sub: t(
          "Correction · July statement · Huda Saleh · Anwar Al Madinah",
          "تصحيح · كشف يوليو · هدى صالح · أنوار المدينة"
        ),
        what: t(
          "Guest left 1 night early on 28 Jul · booking changed after the July statement",
          "غادر النزيل قبل موعده بليلة في ٢٨ يوليو · تغيّر الحجز بعد كشف يوليو"
        ),
        amount: -460,
      },
    ],
    invoice: {
      state: "missing",
      ref: t("Not uploaded yet", "لم تُرفع بعد"),
      check: t(
        "Missing · payment not held · reminder every 3 days",
        "ناقصة · لا يُحتجز الدفع · تذكير كل ٣ أيام"
      ),
      checkTone: "warning",
      uploaded: t("—", "—"),
      action: t("Upload tax invoice", "ارفع الفاتورة الضريبية"),
    },
    payment: {
      date: t(
        "16 Sep 2026 · 15 days after the statement (contract term)",
        "١٦ سبتمبر ٢٠٢٦ · بعد الكشف بـ١٥ يومًا (شرط العقد)"
      ),
      to: t(
        "Al Rajhi Bank ···· 4417 · Jewar Al-Safwah Co.",
        "مصرف الراجحي ···· 4417 · شركة جوار الصفوة"
      ),
      state: "paid",
    },
  },
  {
    /* UI 07.23P2 - the clean month: nothing added, nothing taken. */
    month: "2026-07",
    label: t("July 2026", "يوليو ٢٠٢٦"),
    overline: t(
      "STATEMENT · JULY 2026 · CHECK-OUTS 1-31 JUL · JEWAR AL-SAFWAH CO. · ALL YOUR HOTELS",
      "كشف · يوليو ٢٠٢٦ · مغادرات ١-٣١ يوليو · شركة جوار الصفوة · كل فنادقك"
    ),
    state: "paid",
    issued: t("1 Aug", "١ أغسطس"),
    reviewUntil: t("5 Aug", "٥ أغسطس"),
    payOn: t("16 Aug", "١٦ أغسطس"),
    paidOn: t("16 Aug", "١٦ أغسطس"),
    acceptedNote: t("Accepted · 2 Aug", "مقبول · ٢ أغسطس"),
    subtitle: t(
      "One statement for your company - every hotel and every contract paid after check-out, for bookings that checked out in July. Every amount includes VAT.",
      "كشف واحد لشركتك — كل فندق وكل عقد يُدفع بعد المغادرة، للحجوزات التي غادرت في يوليو. وكل مبلغ شامل الضريبة."
    ),
    band: {
      tone: "success",
      title: t("Accepted", "مقبول"),
      body: t(
        "You accepted it on 2 Aug. 14,980 SAR was paid on 16 Aug to Al Rajhi ···· 4417. A mistake found later is corrected in a later statement.",
        "قبلته في ٢ أغسطس. ودُفعت ١٤٬٩٨٠ ر.س في ١٦ أغسطس إلى الراجحي ···· 4417. وأي خطأ يظهر لاحقًا يُصحَّح في كشف لاحق."
      ),
    },
    bookingsTotal: 14980,
    bookingCount: 11,
    shown: 5,
    penaltyNote: t("SAR · none", "ر.س · لا شيء"),
    deductionNote: t("SAR · none", "ر.س · لا شيء"),
    bookings: [
      booking(
        "HTL-88142",
        t("Lina Farouk · Al Noor Makkah Hotel", "لينا فاروق · فندق النور مكة"),
        t("5 Jul", "٥ يوليو"),
        t("4 nights · 2 rooms", "٤ ليالٍ · غرفتان"),
        6300,
        "paid"
      ),
      booking(
        "HTL-88205",
        t("Ahmed Nasser · Al Noor Makkah Hotel", "أحمد ناصر · فندق النور مكة"),
        t("24 Jul", "٢٤ يوليو"),
        t("4 nights · 3 rooms", "٤ ليالٍ · ٣ غرف"),
        9240,
        "paid"
      ),
      booking(
        "HTL-88209",
        t("Mona Ibrahim · Al Noor Makkah Hotel", "منى إبراهيم · فندق النور مكة"),
        t("19 Jul", "١٩ يوليو"),
        t("2 nights · 1 room", "ليلتان · غرفة واحدة"),
        1380,
        "paid"
      ),
      booking(
        "HTL-88198",
        t("Sara Khalid · Al Noor Makkah Hotel", "سارة خالد · فندق النور مكة"),
        t("26 Jul", "٢٦ يوليو"),
        t("4 nights · 1 room", "٤ ليالٍ · غرفة واحدة"),
        2200,
        "paid"
      ),
      booking(
        "HTL-88147",
        t("Omar Bakr · Anwar Al Madinah", "عمر بكر · أنوار المدينة"),
        t("4 Jul", "٤ يوليو"),
        t("3 nights · 1 room", "٣ ليالٍ · غرفة واحدة"),
        1010,
        "paid"
      ),
    ],
    adjustments: [],
    invoice: {
      state: "uploaded",
      ref: t(
        "INV-JS-2026-0712 · 1 Aug 2026 · 14,980 SAR incl. VAT",
        "INV-JS-2026-0712 · ١ أغسطس ٢٠٢٦ · ١٤٬٩٨٠ ر.س شاملة الضريبة"
      ),
      check: t("Matches the statement ✓", "تطابق الكشف ✓"),
      checkTone: "success",
      uploaded: t("2 Aug · Abdullrahman", "٢ أغسطس · عبدالرحمن"),
    },
    payment: {
      date: t(
        "16 Aug 2026 · 15 days after the statement (contract term)",
        "١٦ أغسطس ٢٠٢٦ · بعد الكشف بـ١٥ يومًا (شرط العقد)"
      ),
      to: t(
        "Al Rajhi Bank ···· 4417 · Jewar Al-Safwah Co.",
        "مصرف الراجحي ···· 4417 · شركة جوار الصفوة"
      ),
      state: "paid",
    },
  },
  {
    /* UI 07.23P3 - paid, and the invoice does not match to the riyal. */
    month: "2026-06",
    label: t("June 2026", "يونيو ٢٠٢٦"),
    overline: t(
      "STATEMENT · JUNE 2026 · CHECK-OUTS 1-30 JUN · JEWAR AL-SAFWAH CO. · ALL YOUR HOTELS",
      "كشف · يونيو ٢٠٢٦ · مغادرات ١-٣٠ يونيو · شركة جوار الصفوة · كل فنادقك"
    ),
    state: "paid",
    issued: t("1 Jul", "١ يوليو"),
    reviewUntil: t("5 Jul", "٥ يوليو"),
    payOn: t("16 Jul", "١٦ يوليو"),
    paidOn: t("16 Jul", "١٦ يوليو"),
    acceptedNote: t("Accepted · 3 Jul", "مقبول · ٣ يوليو"),
    subtitle: t(
      "One statement for your company - every hotel and every contract paid after check-out, for bookings that checked out in June. Every amount includes VAT.",
      "كشف واحد لشركتك — كل فندق وكل عقد يُدفع بعد المغادرة، للحجوزات التي غادرت في يونيو. وكل مبلغ شامل الضريبة."
    ),
    band: {
      tone: "success",
      title: t("Accepted", "مقبول"),
      body: t(
        "You accepted it on 3 Jul. 12,240 SAR was paid on 16 Jul to Al Rajhi ···· 4417. A mistake found later is corrected in a later statement.",
        "قبلته في ٣ يوليو. ودُفعت ١٢٬٢٤٠ ر.س في ١٦ يوليو إلى الراجحي ···· 4417. وأي خطأ يظهر لاحقًا يُصحَّح في كشف لاحق."
      ),
    },
    bookingsTotal: 12240,
    bookingCount: 9,
    shown: 5,
    penaltyNote: t("SAR · none", "ر.س · لا شيء"),
    deductionNote: t("SAR · none", "ر.س · لا شيء"),
    bookings: [
      booking(
        "HTL-88142",
        t("Lina Farouk · Al Noor Makkah Hotel", "لينا فاروق · فندق النور مكة"),
        t("5 Jun", "٥ يونيو"),
        t("4 nights · 2 rooms", "٤ ليالٍ · غرفتان"),
        6300,
        "paid"
      ),
      booking(
        "HTL-88205",
        t("Ahmed Nasser · Al Noor Makkah Hotel", "أحمد ناصر · فندق النور مكة"),
        t("24 Jun", "٢٤ يونيو"),
        t("4 nights · 3 rooms", "٤ ليالٍ · ٣ غرف"),
        9240,
        "paid"
      ),
      booking(
        "HTL-88209",
        t("Mona Ibrahim · Al Noor Makkah Hotel", "منى إبراهيم · فندق النور مكة"),
        t("19 Jun", "١٩ يونيو"),
        t("2 nights · 1 room", "ليلتان · غرفة واحدة"),
        1380,
        "paid"
      ),
      booking(
        "HTL-88198",
        t("Sara Khalid · Al Noor Makkah Hotel", "سارة خالد · فندق النور مكة"),
        t("26 Jun", "٢٦ يونيو"),
        t("4 nights · 1 room", "٤ ليالٍ · غرفة واحدة"),
        2200,
        "paid"
      ),
      booking(
        "HTL-88147",
        t("Omar Bakr · Anwar Al Madinah", "عمر بكر · أنوار المدينة"),
        t("4 Jun", "٤ يونيو"),
        t("3 nights · 1 room", "٣ ليالٍ · غرفة واحدة"),
        1010,
        "paid"
      ),
    ],
    adjustments: [],
    invoice: {
      state: "differs",
      ref: t(
        "INV-JS-2026-0611 · 2 Jul 2026 · 12,360 SAR incl. VAT",
        "INV-JS-2026-0611 · ٢ يوليو ٢٠٢٦ · ١٢٬٣٦٠ ر.س شاملة الضريبة"
      ),
      check: t(
        "Differs by 120 SAR · tracked · payment not held",
        "تختلف بـ١٢٠ ر.س · مُسجَّل · لا يُحتجز الدفع"
      ),
      checkTone: "warning",
      uploaded: t("3 Jul · Abdullrahman", "٣ يوليو · عبدالرحمن"),
      action: t("Upload a corrected invoice", "ارفع فاتورة مصحّحة"),
    },
    payment: {
      date: t(
        "16 Jul 2026 · 15 days after the statement (contract term)",
        "١٦ يوليو ٢٠٢٦ · بعد الكشف بـ١٥ يومًا (شرط العقد)"
      ),
      to: t(
        "Al Rajhi Bank ···· 4417 · Jewar Al-Safwah Co.",
        "مصرف الراجحي ···· 4417 · شركة جوار الصفوة"
      ),
      state: "paid",
    },
  },
];

/**
 * The amount a month is due. A month the frames draw in full is summed from
 * its own lines; the others keep the figure the list carries, so the list
 * and the detail can never print two different numbers for one month.
 */
export function dueFor(month: string, fallback: number): number {
  const drawn = monthStatements.find((item) => item.month === month);
  return drawn ? totals(drawn).due : fallback;
}

export function totals(statement: MonthStatement) {
  const bookings = statement.bookings.reduce((sum, b) => sum + b.amount, 0);
  const penalties = statement.adjustments
    .filter((a) => a.amount > 0)
    .reduce((sum, a) => sum + a.amount, 0);
  const deductions = statement.adjustments
    .filter((a) => a.amount < 0)
    .reduce((sum, a) => sum + a.amount, 0);
  /* The tile is the month's figure, not the five rows the frame lists. */
  const bookingsTotal = statement.bookingsTotal;
  return {
    bookings: bookingsTotal,
    shownTotal: bookings,
    penalties,
    deductions,
    due: bookingsTotal + penalties + deductions,
  };
}

export const statementScreen = {
  back: t("All statements", "كل الكشوف"),
  accept: t("Accept statement", "اقبل الكشف"),
  downloadPdf: t("Download PDF", "نزّل PDF"),
  hotel: t("Hotel", "الفندق"),
  allHotels: t("All 3 hotels", "كل الفنادق الـ٣"),
  contract: t("Contract", "العقد"),
  allContracts: t(
    "All contracts paid after check-out",
    "كل العقود المدفوعة بعد المغادرة"
  ),

  /* The four tiles. */
  bookingsTile: t("BOOKINGS", "الحجوزات"),
  bookingsNote: t("SAR · {n} bookings", "ر.س · {n} حجزًا"),
  penaltiesTile: t("PENALTIES YOU EARNED", "غرامات استحققتها"),
  deductionsTile: t("DEDUCTIONS", "الخصومات"),
  dueTile: t("AMOUNT DUE", "المبلغ المستحق"),
  dueNote: t("SAR · paid on {when}", "ر.س · يُدفع في {when}"),

  /* The blue strip. */
  howTitle: t("How this statement works", "كيف يعمل هذا الكشف"),
  howBody: t(
    "Issued 1 Oct → you review until 5 Oct → accepted automatically on 6 Oct if you do nothing → paid on 16 Oct (15 days, your contract). Disputing a line never holds the rest.",
    "صدر ١ أكتوبر ← تراجعه حتى ٥ أكتوبر ← يُقبل تلقائيًا في ٦ أكتوبر إن لم تفعل شيئًا ← يُدفع في ١٦ أكتوبر (١٥ يومًا، شرط عقدك). والاعتراض على سطر لا يحتجز الباقي أبدًا."
  ),

  /* The bookings table. */
  bookingsCard: t("BOOKINGS", "الحجوزات"),
  bookingsHeading: t("{n} bookings · {total} SAR", "{n} حجزًا · {total} ر.س"),
  colBooking: t("BOOKING", "الحجز"),
  colCheckOut: t("CHECK-OUT", "المغادرة"),
  colStay: t("STAY", "الإقامة"),
  colAmount: t("AMOUNT · INCL. VAT", "المبلغ · شامل الضريبة"),
  colStatus: t("STATUS", "الحالة"),
  inStatement: t("In statement", "في الكشف"),
  disputed: t("Under review", "تحت المراجعة"),
  agreed: t("Agreed", "قُبل"),
  rejected: t("Rejected", "رُفض"),
  paidLine: t("Paid", "مدفوع"),
  dispute: t("Dispute", "اعتراض"),
  showing: t("Showing {shown} of {total} · total {sum} SAR", "عرض {shown} من {total} · الإجمالي {sum} ر.س"),

  /* Penalties and deductions. */
  adjustmentsCard: t("PENALTIES AND DEDUCTIONS", "الغرامات والخصومات"),
  adjustmentsHeading: t(
    "Added to or taken from the bookings",
    "ما أُضيف إلى الحجوزات أو خُصم منها"
  ),
  colReference: t("REFERENCE", "المرجع"),
  colWhat: t("WHAT", "ماذا"),
  colAdjAmount: t("AMOUNT", "المبلغ"),
  noAdjustments: t(
    "No penalties or deductions in this statement.",
    "لا غرامات ولا خصومات في هذا الكشف."
  ),

  /* Tax invoice. */
  invoiceCard: t("TAX INVOICE", "الفاتورة الضريبية"),
  invoiceHeading: t("Your tax invoice for this statement", "فاتورتك الضريبية لهذا الكشف"),
  notUploaded: t("Not uploaded yet", "لم تُرفع بعد"),
  notUploadedBody: t(
    "Required for your VAT records and ours. Payment is not held · you get a reminder every 3 days until it is in.",
    "مطلوبة لسجلاتك الضريبية ولسجلاتنا. ولا يُحتجز الدفع · ويصلك تذكير كل ٣ أيام حتى تصل."
  ),
  uploadInvoice: t("Upload tax invoice", "ارفع الفاتورة الضريبية"),
  invoiceRef: t("Invoice", "الفاتورة"),
  invoiceCheck: t("Check", "الفحص"),
  invoiceUploaded: t("Uploaded", "رُفعت"),

  /* Payment. */
  paymentCard: t("PAYMENT", "الدفع"),
  paymentHeading: t("When and where", "متى وأين"),
  paymentDate: t("Payment date", "تاريخ الدفع"),
  paymentTo: t("To", "إلى"),
  paymentStatus: t("Status", "الحالة"),
  scheduled: t("Scheduled · {amount} SAR", "مجدول · {amount} ر.س"),
  paidStatus: t(
    "Paid · {amount} SAR · {when}",
    "دُفع · {amount} ر.س · {when}"
  ),

  /* The pill beside the title. */
  openForReview: t("Open for review · until {when}", "مفتوح للمراجعة · حتى {when}"),
  acceptedPill: t("Accepted", "مقبول"),
  paidPill: t("Paid", "مدفوع"),
} as const;
