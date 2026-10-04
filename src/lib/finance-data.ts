export type FinanceMovementType = "booking" | "entryAgainst" | "entryFavour" | "payment";
export type FinanceMovementStatus = "pending" | "settled" | "disputed";

export interface FinanceMovement {
  date: string;
  dateAr: string;
  type: FinanceMovementType;
  reference: string;
  title: string;
  titleAr: string;
  detail: string;
  detailAr: string;
  amount: number;
  balance: number;
  hotel: string;
  status: FinanceMovementStatus;
  /** UI 07.6 — how a payment names the line, when it differs from the statement. */
  lineTitle?: string;
  lineTitleAr?: string;
  bookingId?: string;
  requestId?: string;
  paymentId?: string;
}

export interface FinanceEntryDetail {
  reference: string;
  direction: "against" | "favour";
  title: string;
  titleAr: string;
  amount: number;
  before: number;
  after: number;
  postedOn: string;
  postedOnAr: string;
  why: string;
  whyAr: string;
  bookingId?: string;
  bookingSummary?: string;
  bookingSummaryAr?: string;
  coverage: string;
  coverageAr: string;
  attachment?: string;
  replaces?: string;
}

/**
 * BR-07-54 - one line of a remittance advice: what it was, which booking or
 * entry it belongs to, and what it came to. The advice lists them in the
 * statement's own order, so the two documents read the same way.
 */
export interface PaymentLine {
  /** The booking, the entry, or the statement the line came from. */
  ref: string;
  /** A code reads the same either way; a statement's name does not. */
  refAr?: string;
  what: string;
  whatAr: string;
  amount: number;
}

export interface FinancePayment {
  id: string;
  paidOn: string;
  paidOnAr: string;
  /** UI 07.6 spells the date out, and dates the value without the weekday. */
  paidOnLong: string;
  paidOnLongAr: string;
  valueOn: string;
  valueOnAr: string;
  amount: number;
  bankReference: string;
  bank: string;
  bankAr: string;
  /** OV 07.11 - the advice's own lines, in the statement's order. */
  lines: PaymentLine[];
  /** The statement it came from, where there is one to open. */
  statement?: string;
  /**
   * BR-07-53 / BR-07-16 - an entry under dispute is not paid and not lost:
   * it is held out of this transfer while the dispute is open, and named
   * on the advice so the accountant can see why the total is short.
   */
  heldBack?: { amount: number; dispute: string; what: string; whatAr: string };
  /** BR-07-55 - the day the bank sent it back. */
  returnedOn?: string;
  returnedOnAr?: string;
  /** BR-07-51 - the transfer this one re-sends, after a returned payment. */
  rePaymentOf?: string;
  /** UI 07.32 — what the transfer was for, in two lines. */
  covers: string;
  coversAr: string;
  coversSub: string;
  coversSubAr: string;
  /** UI 07.32R — the bank sent it back, so it is not money you have. */
  returned?: boolean;
}

export const financeMovements: FinanceMovement[] = [
  { date:"14 Sep",dateAr:"١٤ سبتمبر",type:"entryAgainst",reference:"ADJ-2026-0042",title:"Agreed settlement on the August file",titleAr:"تسوية متفق عليها لملف أغسطس",detail:"not linked to a booking · posted by Hoteliana",detailAr:"غير مرتبطة بحجز · أضافتها Hoteliana",amount:-1200,balance:9500,status:"disputed",hotel:"Al Noor Makkah Hotel" },
  { date:"13 Sep",dateAr:"١٣ سبتمبر",type:"entryAgainst",reference:"ADJ-2026-0041",title:"Guest relocated — the room was not available on arrival",titleAr:"نُقل النزيل — الغرفة لم تكن متاحة عند الوصول",detail:"HTL-88121 · Nasser Al-Amri · Hoteliana moved the guest and paid the difference",detailAr:"HTL-88121 · ناصر العامري · نقلت Hoteliana النزيل ودفعت الفرق",amount:-3540,balance:10700,status:"pending",hotel:"Al Noor Makkah Hotel",bookingId:"HTL-88121" },
  { date:"12 Sep",dateAr:"١٢ سبتمبر",type:"booking",reference:"HTL-88198",title:"Stay · one night added",titleAr:"إقامة · أُضيفت ليلة",detail:"Sara Khalid · Standard Room · 22 - 26 Sep",detailAr:"سارة خالد · غرفة قياسية · ٢٢ - ٢٦ سبتمبر",amount:2200,balance:14240,status:"pending",hotel:"Al Noor Makkah Hotel",bookingId:"HTL-88198",requestId:"AMD-001" },
  { date:"11 Sep",dateAr:"١١ سبتمبر",type:"booking",reference:"HTL-88191",title:"Cancellation fee you charged",titleAr:"رسوم الإلغاء التي احتسبتها",detail:"Yousef Rahman · Deluxe City View · 12 – 14 Sep · you took the full 1,420",detailAr:"يوسف رحمن · ديلوكس بإطلالة المدينة · ١٢ – ١٤ سبتمبر · احتسبت كامل ١٬٤٢٠",amount:1420,balance:12040,status:"pending",hotel:"Al Noor Makkah Hotel",bookingId:"HTL-88191",requestId:"CR-88191" },
  { date:"10 Sep",dateAr:"١٠ سبتمبر",type:"booking",reference:"HTL-88205",title:"Stay",titleAr:"إقامة",detail:"Ahmed Nasser · Deluxe Partial Haram View · 20 – 24 Sep · 3 rooms",detailAr:"أحمد ناصر · ديلوكس بإطلالة جزئية للحرم · ٢٠ – ٢٤ سبتمبر · ٣ غرف",amount:9240,balance:10620,status:"pending",hotel:"Al Noor Makkah Hotel",bookingId:"HTL-88205" },
  { date:"9 Sep",dateAr:"٩ سبتمبر",type:"booking",reference:"HTL-88209",title:"Stay",titleAr:"إقامة",detail:"Mona Ibrahim · Standard Room · 17 – 19 Sep · 1 room",detailAr:"منى إبراهيم · غرفة قياسية · ١٧ – ١٩ سبتمبر · غرفة واحدة",amount:1380,balance:1380,status:"pending",hotel:"Al Noor Makkah Hotel",bookingId:"HTL-88209" },
  { date:"8 Sep",dateAr:"٨ سبتمبر",type:"payment",reference:"PAY-014",title:"Paid to Al Rajhi ···· 4417",titleAr:"دُفع إلى الراجحي ···· 4417",detail:"covered 3 movements · cleared the account to zero",detailAr:"غطّى ٣ حركات · صفّر الحساب",amount:-11460,balance:0,status:"settled",hotel:"Al Noor Makkah Hotel",paymentId:"PAY-014" },
  { date:"6 Sep",dateAr:"٦ سبتمبر",type:"entryFavour",reference:"ADJ-2026-0039",lineTitle:"Correction - one night was priced short",lineTitleAr:"تصحيح - سُعّرت ليلة واحدة بأقل من قيمتها",title:"Correction in your favour — one night was priced short",titleAr:"تصحيح لصالحك — تم تسعير ليلة بأقل من قيمتها",detail:"HTL-88138 · Khalid Al-Otaibi · posted by Hoteliana",detailAr:"HTL-88138 · خالد العتيبي · أضافتها Hoteliana",amount:980,balance:11460,status:"settled",hotel:"Al Noor Makkah Hotel",bookingId:"HTL-88138" },
  { date:"5 Sep",dateAr:"٥ سبتمبر",type:"booking",reference:"HTL-88142",lineTitle:"Lina Farouk · stay, 4 nights · 2 rooms",lineTitleAr:"لينا فاروق · إقامة، ٤ ليالٍ · غرفتان",title:"Stay · 2 rooms",titleAr:"إقامة · غرفتان",detail:"Lina Farouk · Standard Room · 1 – 5 Sep",detailAr:"لينا فاروق · غرفة قياسية · ١ – ٥ سبتمبر",amount:6300,balance:10480,status:"settled",hotel:"Rawdah Suites",bookingId:"HTL-88142" },
  { date:"3 Sep",dateAr:"٣ سبتمبر",type:"booking",reference:"HTL-88147",lineTitle:"Omar Bakr · stay, 3 nights",lineTitleAr:"عمر بكر · إقامة، ٣ ليالٍ",title:"Stay",titleAr:"إقامة",detail:"Omar Bakr · Standard Room · 1 – 4 Sep",detailAr:"عمر بكر · غرفة قياسية · ١ – ٤ سبتمبر",amount:4180,balance:4180,status:"settled",hotel:"Central Haram Hotel",bookingId:"HTL-88147" },
  { date:"2 Sep",dateAr:"٢ سبتمبر",type:"payment",reference:"PAY-013",title:"Paid to Al Rajhi ···· 4417",titleAr:"دُفع إلى الراجحي ···· 4417",detail:"covered 11 movements",detailAr:"غطّى ١١ حركة",amount:-38940,balance:0,status:"settled",hotel:"Al Noor Makkah Hotel",paymentId:"PAY-013" },
];

export const financeEntries: Record<string, FinanceEntryDetail> = {
  "ADJ-2026-0041": { reference:"ADJ-2026-0041",direction:"against",title:"Guest relocated — the room was not available on arrival",titleAr:"نُقل النزيل — الغرفة لم تكن متاحة عند الوصول",amount:-3540,before:14240,after:10700,postedOn:"13 September 2026, 11:20",postedOnAr:"١٣ سبتمبر ٢٠٢٦، ١١:٢٠",why:"The guest arrived and the room was not there. Hoteliana moved him to another hotel and paid the difference.",whyAr:"وصل النزيل ولم تكن الغرفة متاحة. نقلته Hoteliana إلى فندق آخر ودفعت الفرق.",bookingId:"HTL-88121",bookingSummary:"Nasser Al-Amri · Standard Room · 2 rooms · 28 – 31 Aug",bookingSummaryAr:"ناصر العامري · غرفة قياسية · غرفتان · ٢٨ – ٣١ أغسطس",coverage:"The difference Hoteliana paid — not a penalty, the actual cost of moving the guest.",coverageAr:"الفرق الذي دفعته Hoteliana — ليس غرامة، بل التكلفة الفعلية لنقل النزيل.",attachment:"relocation-invoice-HTL-88121.pdf" },
  "ADJ-2026-0039": { reference:"ADJ-2026-0039",direction:"favour",title:"Correction in your favour — one night was priced short",titleAr:"تصحيح لصالحك — تم تسعير ليلة بأقل من قيمتها",amount:980,before:10480,after:11460,postedOn:"6 September 2026, 09:05",postedOnAr:"٦ سبتمبر ٢٠٢٦، ٠٩:٠٥",why:"The booking was priced on the old contract even though the season rate had already started.",whyAr:"تم تسعير الحجز على العقد القديم رغم بدء سعر الموسم بالفعل.",bookingId:"HTL-88138",bookingSummary:"Khalid Al-Otaibi · Standard Room · 1 room · 4 – 6 Sep",bookingSummaryAr:"خالد العتيبي · غرفة قياسية · غرفة واحدة · ٤ – ٦ سبتمبر",coverage:"The difference on two nights: 490 SAR × 2 nights.",coverageAr:"الفرق على ليلتين: ٤٩٠ ر.س × ليلتين." },
  "ADJ-2026-0042": { reference:"ADJ-2026-0042",direction:"against",title:"Agreed settlement on the August file",titleAr:"تسوية متفق عليها لملف أغسطس",amount:-1200,before:10700,after:9500,postedOn:"14 September 2026, 16:40",postedOnAr:"١٤ سبتمبر ٢٠٢٦، ١٦:٤٠",why:"Agreed by phone on 14 September, closing the August file at 1,200 SAR.",whyAr:"تم الاتفاق هاتفيًا في ١٤ سبتمبر على إغلاق ملف أغسطس بمبلغ ١٬٢٠٠ ر.س.",coverage:"Not linked to a booking — some entries cover a file, a period or a settlement.",coverageAr:"غير مرتبطة بحجز — بعض القيود تغطي ملفًا أو فترة أو تسوية.",attachment:"august-file-summary.pdf",replaces:"ADJ-2026-0031 · − 2,050 SAR" },
};

/**
 * UI 07.32 — every transfer Hoteliana made, newest first, as the frame
 * lists them. PAY-017 is the one the bank sent back: it is on the list
 * because it happened, and marked because it is not money you have.
 */
/**
 * The September statement, as OV 07.11 lists it: the bookings, then the
 * cancellation fee the supplier charged. The relocation entry is not a line
 * here - it is under dispute, so it is held back rather than deducted.
 */
const SEPTEMBER: PaymentLine[] = [
  { ref:"September statement",refAr:"كشف سبتمبر",what:"12 bookings · checked out in September",whatAr:"١٢ حجزًا · غادرت في سبتمبر",amount:20130 },
  { ref:"HTL-88191",what:"Cancellation fee you charged · 1 night",whatAr:"غرامة إلغاء حصّلتها · ليلة واحدة",amount:1420 },
];

/** BR-07-16 - the disputed relocation, held out of the transfer it belongs to. */
const RELOCATION = { amount:3100,dispute:"DSP-2026-0008",what:"Guest relocated · INC-0087 · under review",whatAr:"نُقل النزيل · INC-0087 · تحت المراجعة" };

export const financePayments: FinancePayment[] = [
  /*
   * BR-07-51 - after the bank sent PAY-017 back and the account was put
   * right, the same money went out again. Both rows stay: one because it
   * happened, one because it is the money you have.
   */
  { id:"PAY-018",paidOn:"21 Oct 2026",paidOnAr:"٢١ أكتوبر ٢٠٢٦",paidOnLong:"Wednesday 21 October 2026",paidOnLongAr:"الأربعاء ٢١ أكتوبر ٢٠٢٦",valueOn:"21 Oct 2026",valueOnAr:"٢١ أكتوبر ٢٠٢٦",amount:18450,bankReference:"TRF-99120-9188",bank:"Al Rajhi ···· 5183",bankAr:"مصرف الراجحي ···· 5183",rePaymentOf:"PAY-017",statement:"2026-09",covers:"September statement",coversAr:"كشف سبتمبر",coversSub:"12 bookings",coversSubAr:"١٢ حجزًا",
    lines:SEPTEMBER,heldBack:RELOCATION },
  { id:"PAY-017",paidOn:"16 Oct 2026",paidOnAr:"١٦ أكتوبر ٢٠٢٦",paidOnLong:"Friday 16 October 2026",paidOnLongAr:"الجمعة ١٦ أكتوبر ٢٠٢٦",valueOn:"16 Oct 2026",valueOnAr:"١٦ أكتوبر ٢٠٢٦",amount:18450,bankReference:"TRF-99120-9120",bank:"Al Rajhi ···· 4417",bankAr:"مصرف الراجحي ···· 4417",statement:"2026-09",covers:"September statement",coversAr:"كشف سبتمبر",coversSub:"12 bookings",coversSubAr:"١٢ حجزًا",returned:true,returnedOn:"17 Oct 2026",returnedOnAr:"١٧ أكتوبر ٢٠٢٦",
    lines:SEPTEMBER,heldBack:RELOCATION },
  { id:"PAY-016",paidOn:"16 Sep 2026",paidOnAr:"١٦ سبتمبر ٢٠٢٦",paidOnLong:"Wednesday 16 September 2026",paidOnLongAr:"الأربعاء ١٦ سبتمبر ٢٠٢٦",valueOn:"16 Sep 2026",valueOnAr:"١٦ سبتمبر ٢٠٢٦",amount:21300,bankReference:"TRF-99120-9012",bank:"Al Rajhi ···· 4417",bankAr:"مصرف الراجحي ···· 4417",statement:"2026-08",covers:"August statement",coversAr:"كشف أغسطس",coversSub:"15 bookings · minus 1 deduction",coversSubAr:"١٥ حجزًا · ناقص خصم واحد",
    lines:[
      { ref:"August statement",refAr:"كشف أغسطس",what:"15 bookings · checked out in August",whatAr:"١٥ حجزًا · غادرت في أغسطس",amount:21120 },
      { ref:"HTL-88010",what:"No-show · 1 night penalty under the booking policy",whatAr:"تخلف عن الحضور · غرامة ليلة واحدة بموجب سياسة الحجز",amount:640 },
      { ref:"HTL-87980",what:"Correction · July statement · guest left 1 night early",whatAr:"تصحيح · كشف يوليو · غادر النزيل قبل موعده بليلة",amount:-460 },
    ] },
  { id:"PAY-015",paidOn:"17 Sep 2026",paidOnAr:"١٧ سبتمبر ٢٠٢٦",paidOnLong:"Thursday 17 September 2026",paidOnLongAr:"الخميس ١٧ سبتمبر ٢٠٢٦",valueOn:"17 Sep 2026",valueOnAr:"١٧ سبتمبر ٢٠٢٦",amount:4620,bankReference:"TRF-99120-8977",bank:"Al Rajhi ···· 4417",bankAr:"مصرف الراجحي ···· 4417",covers:"HTL-88214 · paid on booking",coversAr:"HTL-88214 · دُفع عند الحجز",coversSub:"Jewar Al-Safwah Suites · 2 rooms",coversSubAr:"أجنحة جوار الصفوة · غرفتان",
    lines:[
      { ref:"HTL-88214",what:"Jewar Al-Safwah Suites · 2 rooms · paid on the day it was confirmed",whatAr:"أجنحة جوار الصفوة · غرفتان · دُفع يوم تأكيده",amount:4620 },
    ] },
  { id:"PAY-014",paidOn:"16 Aug 2026",paidOnAr:"١٦ أغسطس ٢٠٢٦",paidOnLong:"Sunday 16 August 2026",paidOnLongAr:"الأحد ١٦ أغسطس ٢٠٢٦",valueOn:"16 Aug 2026",valueOnAr:"١٦ أغسطس ٢٠٢٦",amount:14980,bankReference:"TRF-99120-8841",bank:"Al Rajhi ···· 4417",bankAr:"مصرف الراجحي ···· 4417",statement:"2026-07",covers:"July statement",coversAr:"كشف يوليو",coversSub:"11 bookings",coversSubAr:"١١ حجزًا",
    lines:[
      { ref:"July statement",refAr:"كشف يوليو",what:"11 bookings · checked out in July · nothing added, nothing taken",whatAr:"١١ حجزًا · غادرت في يوليو · بلا إضافة ولا خصم",amount:14980 },
    ] },
  { id:"PAY-013",paidOn:"2 Aug 2026",paidOnAr:"٢ أغسطس ٢٠٢٦",paidOnLong:"Sunday 2 August 2026",paidOnLongAr:"الأحد ٢ أغسطس ٢٠٢٦",valueOn:"2 Aug 2026",valueOnAr:"٢ أغسطس ٢٠٢٦",amount:3950,bankReference:"TRF-99120-8702",bank:"Al Rajhi ···· 4417",bankAr:"مصرف الراجحي ···· 4417",covers:"HTL-88002 · paid on arrival",coversAr:"HTL-88002 · دُفع عند الوصول",coversSub:"Anwar Al Madinah · 1 room",coversSubAr:"أنوار المدينة · غرفة واحدة",
    lines:[
      { ref:"HTL-88002",what:"Anwar Al Madinah · 1 room · paid on the day the guest checked in",whatAr:"أنوار المدينة · غرفة واحدة · دُفع يوم دخول النزيل",amount:3950 },
    ] },
];

export const financeTotals = { balance: 9500, earned: 486300, entriesAgainst: 4740, entriesFavour: 980, paid: 473040 };
/** UI 07.0D — the account after a large entry pushes it into the negative. */
export const negativeMovement: FinanceMovement = { date:"15 Sep",dateAr:"١٥ سبتمبر",type:"entryAgainst",reference:"ADJ-2026-0043",title:"Guest relocated - 4 rooms were not available on arrival",titleAr:"نُقل النزلاء — ٤ غرف لم تكن متاحة عند الوصول",detail:"HTL-88160 · Faisal Al-Harthy · Hoteliana moved the group and paid the difference",detailAr:"HTL-88160 · فيصل الحارثي · نقلت Hoteliana المجموعة ودفعت الفرق",amount:-14000,balance:-4500,hotel:"Al Noor Makkah Hotel",status:"pending",bookingId:"HTL-88160" };

export const negativeTotals = { balance:-4500, earned:486300, entriesAgainst:18740, entriesFavour:980, paid:473040 };
