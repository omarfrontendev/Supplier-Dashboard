/**
 * UI 07.23A-F — what happens to September after it is issued.
 *
 * One month, six endings. The frames draw them as separate screens, but
 * they are the same page with three things changed: the chip beside the
 * title, the band that replaces the blue strip, and what the disputed line
 * and the amount-due tile say. Everything else - the tables, the invoice
 * card, the payment card - is untouched, which is the point: a dispute
 * never rebuilds the statement, it annotates it.
 *
 *   A  accepted            BR-07-28, and accepting is final.
 *   B  dispute sent        BR-07-30, the rest is not held.
 *   C  invoice uploaded    BR-07-45, the invoice was never a gate.
 *   D  accepted            BR-07-21, nobody answered by the 5th.
 *      automatically
 *   E  dispute agreed      BR-07-36, the difference goes to October.
 *   F  dispute rejected    BR-07-37, the reason lives in the booking.
 *
 * A note for the designer, in `roadmap.md`: B, E and F all print 17,890 -
 * the statement's 18,450 less the 560 under review - although the dispute
 * asks for 560 *more*. The three frames agree with each other, so that is
 * what is drawn here.
 */

import type { Bi, BookingLineState, MonthStatement } from "./statement-lines";

const t = (en: string, ar: string): Bi => ({ en, ar });

export type StatementOutcome =
  | "open"
  | "accepted"
  | "autoAccepted"
  | "invoiceUploaded"
  | "disputeSent"
  | "disputeAgreed"
  | "disputeRejected";

export interface Outcome {
  /** The chip beside the month. */
  pill: Bi;
  pillTone: "success" | "warning" | "neutral";
  /** The band that takes the blue strip's place. */
  band?: { tone: "success" | "warning"; title: Bi; body: Bi };
  /** What the statement pays once a line is out of it. */
  due?: number;
  dueNote?: Bi;
  /** The one line the dispute is about, and what its pill reads. */
  line?: { id: string; state: BookingLineState; label: Bi };
  /** BR-07-30 — while a line is under review, the rest can still be taken. */
  acceptRest?: boolean;
  /** UI 07.23C replaces the prompt with the invoice's own record. */
  invoice?: MonthStatement["invoice"];
}

/** The six, plus the open month they all start from. */
export const outcomes: Record<StatementOutcome, Outcome> = {
  open: {
    pill: t("", ""),
    pillTone: "warning",
  },

  accepted: {
    pill: t("Accepted · 3 Oct", "مقبول · ٣ أكتوبر"),
    pillTone: "success",
    band: {
      tone: "success",
      title: t("Accepted", "مقبول"),
      body: t(
        "You accepted it on 3 Oct at 11:20. 18,450 SAR is paid on 16 Oct to Al Rajhi ···· 4417. A mistake found later is corrected in a later statement.",
        "قبلته في ٣ أكتوبر الساعة ١١:٢٠. و‎١٨٬٤٥٠ ر.س تُدفع في ١٦ أكتوبر إلى الراجحي ···· 4417. وأي خطأ يظهر لاحقًا يُصحَّح في كشف لاحق."
      ),
    },
  },

  autoAccepted: {
    pill: t("Accepted automatically · 6 Oct", "قُبل تلقائيًا · ٦ أكتوبر"),
    pillTone: "success",
    band: {
      tone: "success",
      title: t("Accepted automatically", "قُبل تلقائيًا"),
      body: t(
        "Nothing was sent back by 5 Oct, so it was accepted automatically on 6 Oct at 00:00. 18,450 SAR is paid on 16 Oct. A mistake found later is corrected in a later statement.",
        "لم يُرسَل أي اعتراض حتى ٥ أكتوبر، فقُبل تلقائيًا في ٦ أكتوبر الساعة ٠٠:٠٠. و‎١٨٬٤٥٠ ر.س تُدفع في ١٦ أكتوبر. وأي خطأ يظهر لاحقًا يُصحَّح في كشف لاحق."
      ),
    },
  },

  /* Same month, same band - only the invoice card has moved on. */
  invoiceUploaded: {
    pill: t("Accepted · 3 Oct", "مقبول · ٣ أكتوبر"),
    pillTone: "success",
    band: {
      tone: "success",
      title: t("Accepted", "مقبول"),
      body: t(
        "You accepted it on 3 Oct at 11:20. 18,450 SAR is paid on 16 Oct to Al Rajhi ···· 4417. A mistake found later is corrected in a later statement.",
        "قبلته في ٣ أكتوبر الساعة ١١:٢٠. و‎١٨٬٤٥٠ ر.س تُدفع في ١٦ أكتوبر إلى الراجحي ···· 4417. وأي خطأ يظهر لاحقًا يُصحَّح في كشف لاحق."
      ),
    },
    invoice: {
      state: "uploaded",
      ref: t(
        "INV-JS-2026-0931 · 2 Oct 2026 · 18,450 SAR incl. VAT",
        "INV-JS-2026-0931 · ٢ أكتوبر ٢٠٢٦ · ١٨٬٤٥٠ ر.س شاملة الضريبة"
      ),
      check: t("Matches the statement ✓", "تطابق الكشف ✓"),
      checkTone: "success",
      uploaded: t("3 Oct · Abdullrahman", "٣ أكتوبر · عبدالرحمن"),
    },
  },

  disputeSent: {
    pill: t("1 line under review", "سطر واحد تحت المراجعة"),
    pillTone: "warning",
    acceptRest: true,
    band: {
      tone: "warning",
      title: t("Your dispute was sent", "أُرسل اعتراضك"),
      body: t(
        "HTL-88205 · you expect 9,800 instead of 9,240 (+560). Hoteliana answers within 5 working days. The rest - 17,890 SAR - is paid on 16 Oct as planned; the 560 follows in a later statement if agreed.",
        "HTL-88205 · تتوقع ٩٬٨٠٠ بدل ٩٬٢٤٠ (+٥٦٠). وتجيب هوتيليانا خلال ٥ أيام عمل. والباقي — ١٧٬٨٩٠ ر.س — يُدفع في ١٦ أكتوبر كما هو مخطط؛ والـ‎٥٦٠ تتبع في كشف لاحق إن قُبلت."
      ),
    },
    due: 17890,
    dueNote: t(
      "SAR · paid 16 Oct · 560 under review",
      "ر.س · تُدفع ١٦ أكتوبر · ٥٦٠ تحت المراجعة"
    ),
    line: {
      id: "HTL-88205",
      state: "disputed",
      label: t("Under review", "تحت المراجعة"),
    },
  },

  disputeAgreed: {
    pill: t("Accepted · dispute agreed", "مقبول · قُبل الاعتراض"),
    pillTone: "success",
    band: {
      tone: "warning",
      title: t("Hoteliana agreed", "وافقت هوتيليانا"),
      body: t(
        "HTL-88205 · the hotel rate was 9,800, not 9,240. The 560 SAR is added to your October statement as a correction line, linked to this booking. 17,890 SAR is paid on 16 Oct as planned. Decided on 7 Oct by Hoteliana Finance.",
        "HTL-88205 · كان سعر الفندق ٩٬٨٠٠ لا ٩٬٢٤٠. وتُضاف الـ‎٥٦٠ ر.س إلى كشف أكتوبر كسطر تصحيح مرتبط بهذا الحجز. و‎١٧٬٨٩٠ ر.س تُدفع في ١٦ أكتوبر كما هو مخطط. صدر القرار في ٧ أكتوبر من مالية هوتيليانا."
      ),
    },
    due: 17890,
    dueNote: t(
      "SAR · paid 16 Oct · +560 goes into October",
      "ر.س · تُدفع ١٦ أكتوبر · +٥٦٠ تذهب إلى أكتوبر"
    ),
    line: {
      id: "HTL-88205",
      state: "agreed",
      label: t("Agreed · +560 in Oct", "قُبل · +٥٦٠ في أكتوبر"),
    },
  },

  disputeRejected: {
    /* Neutral, not green: the statement stands, and nothing was won. */
    pill: t("Accepted · dispute rejected", "مقبول · رُفض الاعتراض"),
    pillTone: "neutral",
    band: {
      tone: "warning",
      title: t("Hoteliana did not agree", "لم توافق هوتيليانا"),
      body: t(
        "HTL-88205 · the contract rate for 24 Sep was 9,240 (season Rabi Al-Awwal, 3 rooms × 4 nights). Nothing changes in your statement. Reason and evidence are in the booking activity. Decided on 7 Oct by Hoteliana Finance.",
        "HTL-88205 · سعر العقد ليوم ٢٤ سبتمبر كان ٩٬٢٤٠ (موسم ربيع الأول، ٣ غرف × ٤ ليالٍ). ولا يتغير شيء في كشفك. والسبب والأدلة في سجل نشاط الحجز. صدر القرار في ٧ أكتوبر من مالية هوتيليانا."
      ),
    },
    due: 17890,
    dueNote: t(
      "SAR · paid 16 Oct · nothing added",
      "ر.س · تُدفع ١٦ أكتوبر · لم يُضف شيء"
    ),
    line: {
      id: "HTL-88205",
      state: "rejected",
      label: t("Rejected · see reason", "رُفض · انظر السبب"),
    },
  },
};

/**
 * The frames are reachable as `?state=`, which is how the rest of the
 * portal shows a state that only a server can really produce.
 */
export const outcomeParams: Record<string, StatementOutcome> = {
  accepted: "accepted",
  "auto-accepted": "autoAccepted",
  "invoice-uploaded": "invoiceUploaded",
  "dispute-sent": "disputeSent",
  "dispute-agreed": "disputeAgreed",
  "dispute-rejected": "disputeRejected",
};

export function outcomeFrom(value: unknown): StatementOutcome {
  return typeof value === "string" && value in outcomeParams
    ? (outcomeParams[value] as StatementOutcome)
    : "open";
}
