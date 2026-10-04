/**
 * UI 07.35 and 07.35.1–8 — Finance / Reports.
 *
 * Eight reports, one shell. Each is the same page with different tiles,
 * different columns and a different third filter, and the frames make that
 * sameness the point: you learn the shape once and every report after it
 * is read without relearning anything.
 *
 * BR-07-01 — every amount here includes VAT at 15%, which is why only the
 * VAT report breaks it out at all, and then only because a return asks for
 * it. BR-07-02 — Makkah time throughout.
 *
 * The numbers are the frames' own. The rows are written rather than
 * computed because the report is a read of what finance already holds -
 * the portal does not recalculate it, and a figure that disagreed with the
 * page behind it would be a bug, not a rounding.
 */

export interface Bi {
  en: string;
  ar: string;
}

const t = (en: string, ar: string): Bi => ({ en, ar });

export interface ReportTile {
  label: Bi;
  value: Bi;
  note: Bi;
  /** The frames tint the two ends of the answer, never the middle. */
  tint?: "good" | "minus" | undefined;
  /**
   * UI 07.35E - what the tile reads when the dates hold nothing. A count
   * goes to zero; a balance goes to a dash, because there is no balance
   * to state rather than a balance of nothing. The frame decides this per
   * tile, so it is written per tile.
   */
  emptyValue?: Bi | undefined;
  emptyNote?: Bi | undefined;
}

export interface ReportDef {
  /** The slug in the URL. */
  key: string;
  title: Bi;
  blurb: Bi;
  /** What the third filter reads, which is not the same question twice. */
  basedOn: Bi;
  tiles: ReportTile[];
  columns: Bi[];
  rows: Bi[][];
  /** Columns the frame sets in bold - a balance, or a year's total. */
  strong?: number[];
  /** Rows the frame sets in bold: the opening and closing lines. */
  strongRows?: number[];
}

export const reports: ReportDef[] = [
  {
    key: "account-statement",
    title: t("Account statement", "كشف الحساب"),
    blurb: t(
      "Opening balance, every movement and closing balance for any dates you pick - like a bank statement.",
      "الرصيد الافتتاحي وكل حركة والرصيد الختامي لأي تواريخ تختارها — كشف حساب بنكي تمامًا."
    ),
    basedOn: t("Payment date", "تاريخ الدفع"),
    tiles: [
      {
        label: t("OPENING BALANCE", "الرصيد الافتتاحي"),
        value: t("21,300", "٢١٬٣٠٠"),
        note: t(
          "SAR · 1 Sep · August statement not paid yet",
          "ر.س · ١ سبتمبر · كشف أغسطس لم يُدفع بعد"
        ),
        emptyValue: t("—", "—"),
        emptyNote: t("no data for these dates", "لا بيانات لهذه التواريخ"),
      },
      {
        label: t("MOVEMENTS", "الحركات"),
        value: t("− 2,850", "− ٢٬٨٥٠"),
        note: t("SAR · 23 lines", "ر.س · ٢٣ سطرًا"),
        emptyValue: t("0", "٠"),
        emptyNote: t("SAR · 0 lines", "ر.س · ٠ سطر"),
      },
      {
        label: t("CLOSING BALANCE", "الرصيد الختامي"),
        value: t("18,450", "١٨٬٤٥٠"),
        note: t("SAR · 30 Sep", "ر.س · ٣٠ سبتمبر"),
        tint: "good",
        emptyValue: t("—", "—"),
      },
    ],
    columns: [
      t("DATE", "التاريخ"),
      t("MOVEMENT", "الحركة"),
      t("REFERENCE", "المرجع"),
      t("AMOUNT", "المبلغ"),
      t("BALANCE", "الرصيد"),
    ],
    rows: [
      [
        t("1 Sep", "١ سبتمبر"),
        t("Opening balance", "الرصيد الافتتاحي"),
        t("-", "-"),
        t("", ""),
        t("21,300", "٢١٬٣٠٠"),
      ],
      [
        t("5 Sep", "٥ سبتمبر"),
        t("Booking checked out · Lina Farouk", "حجز غادر · لينا فاروق"),
        t("HTL-88142", "HTL-88142"),
        t("+ 6,300", "+ ٦٬٣٠٠"),
        t("27,600", "٢٧٬٦٠٠"),
      ],
      [
        t("13 Sep", "١٣ سبتمبر"),
        t("Recovery · guest relocated", "استرداد · نُقل النزيل"),
        t("INC-0087", "INC-0087"),
        t("− 3,100", "− ٣٬١٠٠"),
        t("24,500", "٢٤٬٥٠٠"),
      ],
      [
        t("16 Sep", "١٦ سبتمبر"),
        t("Payment · August statement", "دفعة · كشف أغسطس"),
        t("PAY-016", "PAY-016"),
        t("− 21,300", "− ٢١٬٣٠٠"),
        t("3,200", "٣٬٢٠٠"),
      ],
      [
        t("24 Sep", "٢٤ سبتمبر"),
        t("Booking checked out · Ahmed Nasser", "حجز غادر · أحمد ناصر"),
        t("HTL-88205", "HTL-88205"),
        t("+ 9,240", "+ ٩٬٢٤٠"),
        t("12,440", "١٢٬٤٤٠"),
      ],
      [
        t("30 Sep", "٣٠ سبتمبر"),
        t("Closing balance", "الرصيد الختامي"),
        t("-", "-"),
        t("", ""),
        t("18,450", "١٨٬٤٥٠"),
      ],
    ],
    strong: [4],
    strongRows: [0, 5],
  },

  {
    key: "earnings",
    title: t("Earnings by hotel and month", "الأرباح بالفندق والشهر"),
    blurb: t(
      "What each hotel earned each month, from bookings, penalties and deductions.",
      "ما كسبه كل فندق في كل شهر، من الحجوزات والغرامات والخصومات."
    ),
    basedOn: t("Check-out", "المغادرة"),
    tiles: [
      {
        label: t("EARNED", "المكتسب"),
        value: t("486,300", "٤٨٦٬٣٠٠"),
        note: t("SAR · 2026", "ر.س · ٢٠٢٦"),
      },
      {
        label: t("BEST MONTH", "أفضل شهر"),
        value: t("March", "مارس"),
        note: t("52,100 SAR", "٥٢٬١٠٠ ر.س"),
      },
      {
        label: t("HOTELS", "الفنادق"),
        value: t("3", "٣"),
        note: t("with bookings", "لديها حجوزات"),
      },
    ],
    columns: [
      t("HOTEL", "الفندق"),
      t("JUL", "يوليو"),
      t("AUG", "أغسطس"),
      t("SEP", "سبتمبر"),
      t("TOTAL 2026", "إجمالي ٢٠٢٦"),
    ],
    rows: [
      [
        t("Al Noor Makkah Hotel", "فندق النور مكة"),
        t("14,980", "١٤٬٩٨٠"),
        t("21,300", "٢١٬٣٠٠"),
        t("18,450", "١٨٬٤٥٠"),
        t("402,600", "٤٠٢٬٦٠٠"),
      ],
      [
        t("Anwar Al Madinah", "أنوار المدينة"),
        t("3,950", "٣٬٩٥٠"),
        t("0", "٠"),
        t("0", "٠"),
        t("41,200", "٤١٬٢٠٠"),
      ],
      [
        t("Jewar Al-Safwah Suites", "أجنحة جوار الصفوة"),
        t("0", "٠"),
        t("0", "٠"),
        t("4,620", "٤٬٦٢٠"),
        t("42,500", "٤٢٬٥٠٠"),
      ],
    ],
    strong: [4],
  },

  {
    key: "bookings",
    title: t("Bookings by check-out month", "الحجوزات بشهر المغادرة"),
    blurb: t(
      "The bookings each monthly statement is built from.",
      "الحجوزات التي يُبنى منها كل كشف شهري."
    ),
    basedOn: t("Check-out", "المغادرة"),
    tiles: [
      {
        label: t("BOOKINGS", "الحجوزات"),
        value: t("12", "١٢"),
        note: t("September", "سبتمبر"),
      },
      {
        label: t("ROOM NIGHTS", "ليالي الغرف"),
        value: t("58", "٥٨"),
        note: t("September", "سبتمبر"),
      },
      {
        label: t("AMOUNT", "المبلغ"),
        value: t("20,130", "٢٠٬١٣٠"),
        note: t("SAR · September", "ر.س · سبتمبر"),
      },
    ],
    columns: [
      t("CHECK-OUT", "المغادرة"),
      t("BOOKING", "الحجز"),
      t("HOTEL", "الفندق"),
      t("NIGHTS · ROOMS", "الليالي · الغرف"),
      t("AMOUNT", "المبلغ"),
    ],
    rows: [
      [
        t("4 Sep", "٤ سبتمبر"),
        t("HTL-88147", "HTL-88147"),
        t("Al Noor Makkah Hotel", "فندق النور مكة"),
        t("3 · 1", "٣ · ١"),
        t("1,010", "١٬٠١٠"),
      ],
      [
        t("5 Sep", "٥ سبتمبر"),
        t("HTL-88142", "HTL-88142"),
        t("Al Noor Makkah Hotel", "فندق النور مكة"),
        t("4 · 2", "٤ · ٢"),
        t("6,300", "٦٬٣٠٠"),
      ],
      [
        t("19 Sep", "١٩ سبتمبر"),
        t("HTL-88209", "HTL-88209"),
        t("Al Noor Makkah Hotel", "فندق النور مكة"),
        t("2 · 1", "٢ · ١"),
        t("1,380", "١٬٣٨٠"),
      ],
      [
        t("24 Sep", "٢٤ سبتمبر"),
        t("HTL-88205", "HTL-88205"),
        t("Al Noor Makkah Hotel", "فندق النور مكة"),
        t("4 · 3", "٤ · ٣"),
        t("9,240", "٩٬٢٤٠"),
      ],
      [
        t("26 Sep", "٢٦ سبتمبر"),
        t("HTL-88198", "HTL-88198"),
        t("Al Noor Makkah Hotel", "فندق النور مكة"),
        t("4 · 1", "٤ · ١"),
        t("2,200", "٢٬٢٠٠"),
      ],
    ],
  },

  {
    key: "due-dates",
    title: t("Due dates (aging)", "تواريخ الاستحقاق (الأعمار)"),
    blurb: t(
      "What is paid when, and anything overdue from Hoteliana.",
      "ما يُدفع ومتى، وأي متأخر على هوتيليانا."
    ),
    basedOn: t("Due date", "تاريخ الاستحقاق"),
    tiles: [
      {
        label: t("NEXT 7 DAYS", "الأيام السبعة القادمة"),
        value: t("4,800", "٤٬٨٠٠"),
        note: t("SAR · 1 booking", "ر.س · حجز واحد"),
      },
      {
        label: t("8-30 DAYS", "٨-٣٠ يومًا"),
        value: t("18,450", "١٨٬٤٥٠"),
        note: t("SAR · September statement", "ر.س · كشف سبتمبر"),
      },
      {
        label: t("OVERDUE", "متأخر"),
        value: t("0", "٠"),
        note: t("SAR · nothing late", "ر.س · لا شيء متأخر"),
        tint: "good",
      },
    ],
    columns: [
      t("DUE", "الاستحقاق"),
      t("WHAT", "ماذا"),
      t("TERM", "الشرط"),
      t("AMOUNT", "المبلغ"),
    ],
    rows: [
      [
        t("12 Oct", "١٢ أكتوبر"),
        t("HTL-88420 · on arrival", "HTL-88420 · عند الوصول"),
        t("On arrival", "عند الوصول"),
        t("4,800", "٤٬٨٠٠"),
      ],
      [
        t("16 Oct", "١٦ أكتوبر"),
        t("September statement", "كشف سبتمبر"),
        t("After check-out", "بعد المغادرة"),
        t("18,450", "١٨٬٤٥٠"),
      ],
      [
        t("16 Nov", "١٦ نوفمبر"),
        t("October statement (building)", "كشف أكتوبر (قيد التكوين)"),
        t("After check-out", "بعد المغادرة"),
        t("8,670", "٨٬٦٧٠"),
      ],
    ],
  },

  {
    key: "payments",
    title: t("Payments received", "المدفوعات المستلمة"),
    blurb: t("Every transfer in the period.", "كل تحويل في الفترة."),
    basedOn: t("Payment date", "تاريخ الدفع"),
    tiles: [
      {
        label: t("RECEIVED", "المستلم"),
        value: t("25,920", "٢٥٬٩٢٠"),
        note: t("SAR · September", "ر.س · سبتمبر"),
      },
      {
        label: t("PAYMENTS", "المدفوعات"),
        value: t("2", "٢"),
        note: t("September", "سبتمبر"),
      },
    ],
    columns: [
      t("PAID ON", "دُفع في"),
      t("PAYMENT", "الدفعة"),
      t("COVERS", "تغطي"),
      t("AMOUNT", "المبلغ"),
    ],
    rows: [
      [
        t("16 Sep", "١٦ سبتمبر"),
        t("PAY-016", "PAY-016"),
        t("August statement", "كشف أغسطس"),
        t("21,300", "٢١٬٣٠٠"),
      ],
      [
        t("17 Sep", "١٧ سبتمبر"),
        t("PAY-015", "PAY-015"),
        t("HTL-88214 · on booking", "HTL-88214 · عند الحجز"),
        t("4,620", "٤٬٦٢٠"),
      ],
    ],
  },

  {
    key: "deductions",
    title: t("Deductions and recoveries", "الخصومات والاستردادات"),
    blurb: t(
      "Every amount taken from your payments and why.",
      "كل مبلغ خُصم من مدفوعاتك ولماذا."
    ),
    basedOn: t("Check-out", "المغادرة"),
    tiles: [
      {
        label: t("DEDUCTED", "المخصوم"),
        value: t("− 6,610", "− ٦٬٦١٠"),
        note: t("SAR · 2026", "ر.س · ٢٠٢٦"),
        tint: "minus",
      },
      {
        label: t("ENTRIES", "القيود"),
        value: t("3", "٣"),
        note: t("2026", "٢٠٢٦"),
      },
    ],
    columns: [
      t("DATE", "التاريخ"),
      t("REFERENCE", "المرجع"),
      t("REASON", "السبب"),
      t("AMOUNT", "المبلغ"),
    ],
    rows: [
      [
        t("15 Sep", "١٥ سبتمبر"),
        t("INC-0087", "INC-0087"),
        t(
          "Guest relocated · cost difference + 500 admin fee",
          "نُقل النزيل · فرق التكلفة + ٥٠٠ رسوم إدارية"
        ),
        t("− 3,100", "− ٣٬١٠٠"),
      ],
      [
        t("14 Sep", "١٤ سبتمبر"),
        t("ADJ-2026-0042", "ADJ-2026-0042"),
        t(
          "Agreed settlement on the August file",
          "تسوية متفق عليها على ملف أغسطس"
        ),
        t("− 1,200", "− ١٬٢٠٠"),
      ],
      [
        t("2 Sep", "٢ سبتمبر"),
        t("HTL-88230", "HTL-88230"),
        t("Cancelled after payment on booking", "أُلغي بعد الدفع عند الحجز"),
        t("− 2,310", "− ٢٬٣١٠"),
      ],
    ],
  },

  {
    key: "cancellations",
    title: t("Cancellations and penalties", "الإلغاءات والغرامات"),
    blurb: t(
      "Penalties you kept when a booking was cancelled late.",
      "الغرامات التي احتفظت بها حين أُلغي حجز متأخرًا."
    ),
    basedOn: t("Check-out", "المغادرة"),
    tiles: [
      {
        label: t("PENALTIES", "الغرامات"),
        value: t("1,420", "١٬٤٢٠"),
        note: t("SAR · September", "ر.س · سبتمبر"),
      },
      {
        label: t("CANCELLATIONS", "الإلغاءات"),
        value: t("4", "٤"),
        note: t("September · 3 free", "سبتمبر · ٣ بلا غرامة"),
      },
    ],
    columns: [
      t("DATE", "التاريخ"),
      t("BOOKING", "الحجز"),
      t("POLICY", "السياسة"),
      t("PENALTY", "الغرامة"),
    ],
    rows: [
      [
        t("11 Sep", "١١ سبتمبر"),
        t("HTL-88191", "HTL-88191"),
        t("Non-refundable · 1 night", "غير قابل للاسترداد · ليلة واحدة"),
        t("1,420", "١٬٤٢٠"),
      ],
      [
        t("9 Sep", "٩ سبتمبر"),
        t("HTL-88180", "HTL-88180"),
        t("Free until 7 days before", "مجاني حتى ٧ أيام قبل الموعد"),
        t("0", "٠"),
      ],
      [
        t("3 Sep", "٣ سبتمبر"),
        t("HTL-88166", "HTL-88166"),
        t("Free until 7 days before", "مجاني حتى ٧ أيام قبل الموعد"),
        t("0", "٠"),
      ],
    ],
  },

  {
    key: "vat",
    title: t("VAT summary", "ملخص ضريبة القيمة المضافة"),
    blurb: t(
      "The VAT inside what you were paid, for your own VAT return.",
      "الضريبة داخل ما دُفع لك، لإقرارك الضريبي."
    ),
    basedOn: t("Check-out", "المغادرة"),
    tiles: [
      {
        label: t("GROSS", "الإجمالي"),
        value: t("25,920", "٢٥٬٩٢٠"),
        note: t("SAR · September", "ر.س · سبتمبر"),
      },
      {
        label: t("VAT INSIDE", "الضريبة بداخله"),
        value: t("3,380.87", "٣٬٣٨٠٫٨٧"),
        note: t("SAR · 15/115", "ر.س · ١٥/١١٥"),
      },
    ],
    columns: [
      t("MONTH", "الشهر"),
      t("GROSS INCL. VAT", "الإجمالي شامل الضريبة"),
      t("NET EXCL. VAT", "الصافي دون الضريبة"),
      t("VAT 15%", "الضريبة ١٥٪"),
    ],
    rows: [
      [
        t("Jul 2026", "يوليو ٢٠٢٦"),
        t("18,930", "١٨٬٩٣٠"),
        t("16,460.87", "١٦٬٤٦٠٫٨٧"),
        t("2,469.13", "٢٬٤٦٩٫١٣"),
      ],
      [
        t("Aug 2026", "أغسطس ٢٠٢٦"),
        t("21,300", "٢١٬٣٠٠"),
        t("18,521.74", "١٨٬٥٢١٫٧٤"),
        t("2,778.26", "٢٬٧٧٨٫٢٦"),
      ],
      [
        t("Sep 2026", "سبتمبر ٢٠٢٦"),
        t("25,920", "٢٥٬٩٢٠"),
        t("22,539.13", "٢٢٬٥٣٩٫١٣"),
        t("3,380.87", "٣٬٣٨٠٫٨٧"),
      ],
    ],
  },
];

export function reportFor(key: string): ReportDef | undefined {
  return reports.find((report) => report.key === key);
}

export const reportCopy = {
  overline: t("FINANCE", "المالية"),
  detailOverline: t("FINANCE · REPORTS", "المالية · التقارير"),
  title: t("Reports", "التقارير"),
  subtitle: t(
    "Pick a report, choose the dates, export to Excel or PDF. Every report uses the same numbers as your statements.",
    "اختر تقريرًا، وحدّد التواريخ، وصدّره إلى Excel أو PDF. وكل تقرير يستخدم أرقام كشوفك نفسها."
  ),
  cardOverline: t("REPORT", "تقرير"),
  open: t("Open", "افتح"),
  back: t("All reports", "كل التقارير"),
  excel: t("Excel", "Excel"),
  pdf: t("PDF", "PDF"),

  from: t("From", "من"),
  to: t("To", "إلى"),
  basedOn: t("Date based on", "التاريخ محسوب على"),
  hotel: t("Hotel", "الفندق"),
  fromValue: t("1 Sep 2026", "١ سبتمبر ٢٠٢٦"),
  toValue: t("30 Sep 2026", "٣٠ سبتمبر ٢٠٢٦"),
  allHotels: t("All hotels", "كل الفنادق"),

  /* UI 07.35E — the dates hold nothing, which is not an error. */
  emptyTitle: t("Nothing in these dates", "لا شيء في هذه التواريخ"),
  emptyBody: t(
    "There are no bookings or payments between 1 and 30 Sep. Change the dates or pick another report. Export stays off until there is data.",
    "لا حجوزات ولا مدفوعات بين ١ و٣٠ سبتمبر. غيّر التواريخ أو اختر تقريرًا آخر. ويبقى التصدير مغلقًا حتى توجد بيانات."
  ),
  changeDates: t("Change dates", "غيّر التواريخ"),
  noData: t("no data for these dates", "لا بيانات لهذه التواريخ"),
  zeroLines: t("SAR · 0 lines", "ر.س · ٠ سطر"),
  dash: t("—", "—"),
} as const;
