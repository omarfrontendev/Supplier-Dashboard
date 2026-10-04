export type BookingStatus = "onRequest" | "confirmed" | "cancelled" | "rejected" | "expired";
export type BookingTask = "answer" | "reference" | "amendment" | "cancellation" | "issue" | null;

export interface Booking {
  id: string;
  /**
   * BR-05-xx / OV 05.2S - the hotel issued one number for the whole
   * booking rather than one per room. Without this a single number on a
   * two-room booking is ambiguous: it could be the only one that came,
   * which is UI 05.4P and needs chasing, or the only one there will be.
   */
  sameNumber?: boolean;
  /**
   * UI 05.11C - the agent cancelled one room after the booking was
   * confirmed. The room stays on the booking, struck through, and its
   * confirmation number goes void: it is gone from the voucher, but it
   * happened, and the charge on it is real.
   */
  cancelledRoom?: {
    /** 1-based, as the guest list and the numbers card count. */
    index: number;
    on: string;
    onAr: string;
    /** The number that is now void - still shown, so it is not a mystery. */
    number: string;
  };
  /**
   * UI 05.11G - the booking was sold at a nationality group's price. The
   * booking keeps it for ever, the way it keeps every other term it was
   * sold at: the group is named here so the page can say which one, and
   * the numbers themselves are on the booking's detail.
   */
  nationalityPrice?: { group: string; groupAr: string };
  guest: string;
  guestAr: string;
  hotel: string;
  hotelAr: string;
  offer: string;
  offerAr: string;
  room: string;
  meal: string;
  stay: string;
  stayAr: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  rooms: number;
  rate: number;
  status: BookingStatus;
  task: BookingTask;
  booked: string;
  confirmationNumber?: string | undefined;
  reason?: string | undefined;
  incidentState?: "underReview" | "closed" | undefined;
}

export const bookingSeed: Booking[] = [
  { id:"HTL-88214", guest:"Nour Al-Sayed", guestAr:"نور السيد", hotel:"Al Noor Makkah Hotel", hotelAr:"فندق النور مكة", offer:"Standard Room · Half Board", offerAr:"غرفة قياسية · نصف إقامة", room:"Standard Room · Single / Double", meal:"Half Board", stay:"Thu 24 – Sun 27 Sep", stayAr:"الخميس ٢٤ – الأحد ٢٧ سبتمبر", checkIn:"Thursday 24 September 2026", checkOut:"Sunday 27 September 2026", nights:3, rooms:2, rate:4620, status:"onRequest", task:"answer", booked:"Today at 11:35 by a Hoteliana agent" },
  { id:"HTL-88220", guest:"Nour Al-Sayed", guestAr:"نور السيد", hotel:"Al Noor Makkah Hotel", hotelAr:"فندق النور مكة", offer:"Standard Room · Half Board", offerAr:"غرفة قياسية · نصف إقامة", room:"Standard Room · Single / Double", meal:"Half Board", stay:"Thu 25 – Sun 28 Feb", stayAr:"الخميس ٢٥ – الأحد ٢٨ فبراير", checkIn:"Thursday 25 February 2027", checkOut:"Sunday 28 February 2027", nights:3, rooms:2, rate:4000, status:"confirmed", task:null, booked:"Today at 11:35 by a Hoteliana agent", confirmationNumber:"JOM-2026-44182 · JOM-2026-44183", nationalityPrice:{ group:"GCC nationals", groupAr:"مواطني الخليج" } },
  /* UI 05.4B - confirmed without the numbers, and an issue open on it. */
  { id:"HTL-88223", guest:"Nour Al-Sayed", guestAr:"نور السيد", hotel:"Al Noor Makkah Hotel", hotelAr:"فندق النور مكة", offer:"Standard Room · Half Board", offerAr:"غرفة قياسية · نصف إقامة", room:"Standard Room · Single / Double", meal:"Half Board", stay:"Thu 24 – Sun 27 Sep", stayAr:"الخميس ٢٤ – الأحد ٢٧ سبتمبر", checkIn:"Thursday 24 September 2026", checkOut:"Sunday 27 September 2026", nights:3, rooms:2, rate:4620, status:"confirmed", task:"reference", booked:"Today at 11:35 by a Hoteliana agent", incidentState:"underReview" },
  { id:"HTL-88213", guest:"Faisal Al-Otaibi", guestAr:"فيصل العتيبي", hotel:"Al Noor Makkah Hotel", hotelAr:"فندق النور مكة", offer:"Deluxe Room City View · Room Only", offerAr:"غرفة ديلوكس بإطلالة المدينة · غرفة فقط", room:"Deluxe Room City View", meal:"Room Only", stay:"Thu 1 – Sat 3 Oct", stayAr:"الخميس ١ – السبت ٣ أكتوبر", checkIn:"Thursday 1 October 2026", checkOut:"Saturday 3 October 2026", nights:2, rooms:1, rate:1440, status:"onRequest", task:"answer", booked:"Today at 12:10 by a Hoteliana agent" },
  { id:"HTL-88209", guest:"Mona Ibrahim", guestAr:"منى إبراهيم", hotel:"Al Noor Makkah Hotel", hotelAr:"فندق النور مكة", offer:"Standard Room · Bed & Breakfast", offerAr:"غرفة قياسية · إفطار", room:"Standard Room", meal:"Bed & Breakfast", stay:"Thu 17 – Sat 19 Sep", stayAr:"الخميس ١٧ – السبت ١٩ سبتمبر", checkIn:"Thursday 17 September 2026", checkOut:"Saturday 19 September 2026", nights:2, rooms:1, rate:1380, status:"confirmed", task:"reference", booked:"12 Sep at 10:42 by a Hoteliana agent" },
  { id:"HTL-88205", guest:"Ahmed Nasser", guestAr:"أحمد ناصر", hotel:"Al Noor Makkah Hotel", hotelAr:"فندق النور مكة", offer:"Deluxe Haram View · Bed & Breakfast", offerAr:"ديلوكس بإطلالة الحرم · إفطار", room:"Deluxe Haram View", meal:"Bed & Breakfast", stay:"Sun 20 – Thu 24 Sep", stayAr:"الأحد ٢٠ – الخميس ٢٤ سبتمبر", checkIn:"Sunday 20 September 2026", checkOut:"Thursday 24 September 2026", nights:4, rooms:3, rate:9240, status:"confirmed", task:null, booked:"10 Sep at 15:20 by a Hoteliana agent", sameNumber:true, confirmationNumber:"JOM-2026-43881" },
  { id:"HTL-88198", guest:"Sara Khalid", guestAr:"سارة خالد", hotel:"Al Noor Makkah Hotel", hotelAr:"فندق النور مكة", offer:"Standard Room · Room Only", offerAr:"غرفة قياسية · غرفة فقط", room:"Standard Room", meal:"Room Only", stay:"Tue 22 – Fri 25 Sep", stayAr:"الثلاثاء ٢٢ – الجمعة ٢٥ سبتمبر", checkIn:"Tuesday 22 September 2026", checkOut:"Friday 25 September 2026", nights:3, rooms:1, rate:1580, status:"confirmed", task:null, booked:"9 Sep at 09:12 by a Hoteliana agent", confirmationNumber:"JOM-2026-43218" },
  { id:"HTL-88191", guest:"Yousef Rahman", guestAr:"يوسف رحمن", hotel:"Al Noor Makkah Hotel", hotelAr:"فندق النور مكة", offer:"Deluxe Room City View · Bed & Breakfast", offerAr:"غرفة ديلوكس بإطلالة المدينة · إفطار", room:"Deluxe Room City View", meal:"Bed & Breakfast", stay:"Sat 12 – Mon 14 Sep", stayAr:"السبت ١٢ – الاثنين ١٤ سبتمبر", checkIn:"Saturday 12 September 2026", checkOut:"Monday 14 September 2026", nights:2, rooms:1, rate:1420, status:"confirmed", task:"cancellation", booked:"8 Sep at 17:05 by a Hoteliana agent", confirmationNumber:"JOM-2026-42991" },
  { id:"HTL-88187", guest:"Layla Mansour", guestAr:"ليلى منصور", hotel:"Al Noor Makkah Hotel", hotelAr:"فندق النور مكة", offer:"Standard Room · Half Board", offerAr:"غرفة قياسية · نصف إقامة", room:"Standard Room", meal:"Half Board", stay:"Tue 15 – Thu 17 Sep", stayAr:"الثلاثاء ١٥ – الخميس ١٧ سبتمبر", checkIn:"Tuesday 15 September 2026", checkOut:"Thursday 17 September 2026", nights:2, rooms:2, rate:2520, status:"expired", task:null, booked:"7 Sep at 11:35 by a Hoteliana agent" },
  { id:"HTL-88179", guest:"Nour Al-Sayed", guestAr:"نور السيد", hotel:"Al Noor Makkah Hotel", hotelAr:"فندق النور مكة", offer:"Standard Room · Half Board", offerAr:"غرفة قياسية · نصف إقامة", room:"Standard Room · Single / Double", meal:"Half Board", stay:"Thu 24 – Sun 27 Sep", stayAr:"الخميس ٢٤ – الأحد ٢٧ سبتمبر", checkIn:"Thursday 24 September 2026", checkOut:"Sunday 27 September 2026", nights:3, rooms:2, rate:4620, status:"confirmed", task:null, booked:"Today at 11:35 by a Hoteliana agent", confirmationNumber:"JOM-2026-44190 · JOM-2026-44191", cancelledRoom:{ index:2, on:"20 Sep", onAr:"٢٠ سبتمبر", number:"JOM-2026-44191" } },
  { id:"HTL-88182", guest:"Omar Farouk", guestAr:"عمر فاروق", hotel:"Al Noor Makkah Hotel", hotelAr:"فندق النور مكة", offer:"Deluxe Room City View · Room Only", offerAr:"غرفة ديلوكس بإطلالة المدينة · غرفة فقط", room:"Deluxe Room City View", meal:"Room Only", stay:"Fri 11 – Sun 13 Sep", stayAr:"الجمعة ١١ – الأحد ١٣ سبتمبر", checkIn:"Friday 11 September 2026", checkOut:"Sunday 13 September 2026", nights:2, rooms:1, rate:1440, status:"rejected", task:null, booked:"6 Sep at 13:11 by a Hoteliana agent", reason:"No availability" },
  { id:"HTL-88166", guest:"Mishal Al-Dossari", guestAr:"مشعل الدوسري", hotel:"Al Noor Makkah Hotel", hotelAr:"فندق النور مكة", offer:"Standard Room · Half Board", offerAr:"غرفة قياسية · نصف إقامة", room:"Standard Room", meal:"Half Board", stay:"Sun 20 – Thu 24 Sep", stayAr:"الأحد ٢٠ – الخميس ٢٤ سبتمبر", checkIn:"Sunday 20 September 2026", checkOut:"Thursday 24 September 2026", nights:4, rooms:5, rate:8600, status:"confirmed", task:"cancellation", booked:"7 Sep at 19:05 by a Hoteliana agent", confirmationNumber:"JOM-2026-42866" },
  { id:"HTL-88159", guest:"Rakan Al-Mutairi", guestAr:"راكان المطيري", hotel:"Al Noor Makkah Hotel", hotelAr:"فندق النور مكة", offer:"Deluxe Partial Haram View · Room Only", offerAr:"ديلوكس بإطلالة جزئية · غرفة فقط", room:"Deluxe Partial Haram View", meal:"Room Only", stay:"Sun 20 – Fri 25 Sep", stayAr:"الأحد ٢٠ – الجمعة ٢٥ سبتمبر", checkIn:"Sunday 20 September 2026", checkOut:"Friday 25 September 2026", nights:5, rooms:1, rate:4400, status:"confirmed", task:"cancellation", booked:"7 Sep at 15:40 by a Hoteliana agent", confirmationNumber:"JOM-2026-42759" },
  { id:"HTL-88176", guest:"Bader Al-Harbi", guestAr:"بدر الحربي", hotel:"Al Noor Makkah Hotel", hotelAr:"فندق النور مكة", offer:"Standard Room · Bed & Breakfast", offerAr:"غرفة قياسية · إفطار", room:"Standard Room", meal:"Bed & Breakfast", stay:"Sun 27 – Tue 29 Sep", stayAr:"الأحد ٢٧ – الثلاثاء ٢٩ سبتمبر", checkIn:"Sunday 27 September 2026", checkOut:"Tuesday 29 September 2026", nights:2, rooms:1, rate:1120, status:"confirmed", task:"amendment", booked:"8 Sep at 17:20 by a Hoteliana agent", confirmationNumber:"JOM-2026-43076" },
  { id:"HTL-88144", guest:"Noura Al-Qahtani", guestAr:"نورة القحطاني", hotel:"Rawdah Suites", hotelAr:"أجنحة الروضة", offer:"Deluxe Room City View", offerAr:"غرفة ديلوكس بإطلالة المدينة", room:"Deluxe Room City View", meal:"Room Only", stay:"Mon 28 – Wed 30 Sep", stayAr:"الاثنين ٢٨ – الأربعاء ٣٠ سبتمبر", checkIn:"Monday 28 September 2026", checkOut:"Wednesday 30 September 2026", nights:2, rooms:1, rate:1260, status:"confirmed", task:null, booked:"9 Sep at 07:05 by a Hoteliana agent", confirmationNumber:"RAW-2026-18144" },
  { id:"HTL-88131", guest:"Salem Al-Ghamdi", guestAr:"سالم الغامدي", hotel:"Rawdah Suites", hotelAr:"أجنحة الروضة", offer:"Standard Room · Room Only", offerAr:"غرفة قياسية · غرفة فقط", room:"Standard Room", meal:"Room Only", stay:"Thu 1 – Sat 3 Oct", stayAr:"الخميس ١ – السبت ٣ أكتوبر", checkIn:"Thursday 1 October 2026", checkOut:"Saturday 3 October 2026", nights:2, rooms:1, rate:1260, status:"confirmed", task:null, booked:"9 Sep at 11:20 by a Hoteliana agent", confirmationNumber:"RAW-2026-18131" },
  { id:"HTL-88154", guest:"Hind Al-Zahrani", guestAr:"هند الزهراني", hotel:"Central Haram Hotel", hotelAr:"فندق الحرم المركزي", offer:"Standard Room · Room Only", offerAr:"غرفة قياسية · غرفة فقط", room:"Standard Room", meal:"Room Only", stay:"Wed 2 – Fri 4 Sep", stayAr:"الأربعاء ٢ – الجمعة ٤ سبتمبر", checkIn:"Wednesday 2 September 2026", checkOut:"Friday 4 September 2026", nights:2, rooms:1, rate:1260, status:"cancelled", task:null, booked:"1 Sep at 09:10 by a Hoteliana agent", confirmationNumber:"CHH-2026-18154" },
  { id:"HTL-88121", guest:"Nasser Al-Amri", guestAr:"ناصر العامري", hotel:"Al Noor Makkah Hotel", hotelAr:"فندق النور مكة", offer:"Standard Room · Room Only", offerAr:"غرفة قياسية · غرفة فقط", room:"Standard Room", meal:"Room Only", stay:"Fri 28 – Mon 31 Aug", stayAr:"الجمعة ٢٨ – الاثنين ٣١ أغسطس", checkIn:"Friday 28 August 2026", checkOut:"Monday 31 August 2026", nights:3, rooms:2, rate:4860, status:"confirmed", task:"issue", incidentState:"underReview", booked:"20 Aug at 10:15 by a Hoteliana agent", sameNumber:true, confirmationNumber:"JOM-2026-42121" },
  { id:"HTL-88138", guest:"Khalid Al-Otaibi", guestAr:"خالد العتيبي", hotel:"Al Noor Makkah Hotel", hotelAr:"فندق النور مكة", offer:"Standard Room · Room Only", offerAr:"غرفة قياسية · غرفة فقط", room:"Standard Room", meal:"Room Only", stay:"Fri 4 – Sun 6 Sep", stayAr:"الجمعة ٤ – الأحد ٦ سبتمبر", checkIn:"Friday 4 September 2026", checkOut:"Sunday 6 September 2026", nights:2, rooms:1, rate:980, status:"confirmed", task:null, booked:"27 Aug at 14:10 by a Hoteliana agent", confirmationNumber:"JOM-2026-42138" },
  { id:"HTL-88142", guest:"Lina Farouk", guestAr:"لينا فاروق", hotel:"Rawdah Suites", hotelAr:"أجنحة الروضة", offer:"Standard Room · Room Only", offerAr:"غرفة قياسية · غرفة فقط", room:"Standard Room", meal:"Room Only", stay:"Tue 1 – Sat 5 Sep", stayAr:"الثلاثاء ١ – السبت ٥ سبتمبر", checkIn:"Tuesday 1 September 2026", checkOut:"Saturday 5 September 2026", nights:4, rooms:2, rate:6300, status:"confirmed", task:null, booked:"25 Aug at 12:00 by a Hoteliana agent", confirmationNumber:"RAW-2026-18142" },
  { id:"HTL-88147", guest:"Omar Bakr", guestAr:"عمر بكر", hotel:"Central Haram Hotel", hotelAr:"فندق الحرم المركزي", offer:"Standard Room · Room Only", offerAr:"غرفة قياسية · غرفة فقط", room:"Standard Room", meal:"Room Only", stay:"Tue 1 – Fri 4 Sep", stayAr:"الثلاثاء ١ – الجمعة ٤ سبتمبر", checkIn:"Tuesday 1 September 2026", checkOut:"Friday 4 September 2026", nights:3, rooms:1, rate:4180, status:"confirmed", task:null, booked:"24 Aug at 09:40 by a Hoteliana agent", confirmationNumber:"CHH-2026-18147" },
];
export interface BookingNight {
  label: string;
  labelAr: string;
  /** Rooms left before the booking is confirmed. */
  before: number;
  /** Rooms left after it is confirmed. */
  after: number;
  of: number;
}

export interface BookingDetail {
  /** The SLA the hotel is given, in hours. */
  slaHours: number;
  answerBy: string;
  minutesLeft: number;
  arrivedAt: string;
  confirmedAt: string;
  confirmationNumber: string;
  soldRate: number;
  currentRate: number;
  nights: BookingNight[];
  /** The nights the rooms left the allotment, as the hold line names them. */
  allotmentDays: string;
  allotmentDaysAr: string;
  rows: Array<[string, string, string, string]>;
  guests: Array<[string, string, string, string]>;
  guestNote: string;
  guestNoteAr: string;
  requests: Array<[string, string, string, string]>;
}

/** Figma UI 05.1 / 05.4 / 05.11 — the worked booking HTL-88214. */
export const bookingDetail: BookingDetail = {
  slaHours: 3,
  answerBy: "14:35",
  minutesLeft: 21,
  arrivedAt: "11:35",
  confirmedAt: "12:14",
  confirmationNumber: "JOM-2026-44182",
  soldRate: 770,
  currentRate: 830,
  allotmentDays: "24, 25 and 26 September",
  allotmentDaysAr: "٢٤ و٢٥ و٢٦ سبتمبر",
  nights: [
    { label: "THU 24 SEP", labelAr: "الخميس ٢٤ سبتمبر", before: 12, after: 10, of: 20 },
    { label: "FRI 25 SEP", labelAr: "الجمعة ٢٥ سبتمبر", before: 9, after: 7, of: 20 },
    { label: "SAT 26 SEP", labelAr: "السبت ٢٦ سبتمبر", before: 7, after: 5, of: 20 },
  ],
  rows: [
    ["Hotel", "الفندق", "Al Noor Makkah Hotel", "فندق النور مكة"],
    ["Room", "الغرفة", "Standard Room · Single / Double", "غرفة ستاندرد · مفردة / مزدوجة"],
    ["Meal plan", "خطة الوجبات", "Half Board", "نصف إقامة"],
    ["Check-in", "الوصول", "Thursday 24 September 2026", "الخميس ٢٤ سبتمبر ٢٠٢٦"],
    ["Check-out", "المغادرة", "Sunday 27 September 2026", "الأحد ٢٧ سبتمبر ٢٠٢٦"],
    ["Nights", "الليالي", "3", "٣"],
    ["Rooms", "الغرف", "2", "٢"],
    ["Occupancy", "الإشغال", "2 adults per room · 4 adults in total", "بالغان لكل غرفة · ٤ بالغين إجمالًا"],
    ["Your rate · incl. VAT", "سعرك · شامل الضريبة", "770 SAR per room per night", "٧٧٠ ر.س لكل غرفة في الليلة"],
    ["Total to you", "إجماليك", "4,620 SAR · 770 × 3 nights × 2 rooms", "٤٬٦٢٠ ر.س · ٧٧٠ × ٣ ليالٍ × غرفتين"],
    ["Cancellation policy", "سياسة الإلغاء", "Non-refundable", "غير قابل للاسترداد"],
    ["Confirmation type", "نوع التأكيد", "On request - you decide", "عند الطلب - القرار لك"],
    ["Booked", "تاريخ الحجز", "Today at 11:35 by a Hoteliana agent", "اليوم ١١:٣٥ بواسطة وكيل هوتيليانا"],
  ],
  guests: [
    ["Lead guest", "الضيف الرئيسي", "Nour Al-Sayed", "نور السيد"],
    ["ID number", "رقم الهوية", "1098 4471 12", "1098 4471 12"],
    ["Nationality", "الجنسية", "Saudi", "سعودي"],
    ["Room 1", "الغرفة ١", "Nour Al-Sayed (adult) · Huda Al-Sayed (adult)", "نور السيد (بالغة) · هدى السيد (بالغة)"],
    ["Room 2", "الغرفة ٢", "Salem Al-Sayed (adult) · Faisal Al-Sayed (adult)", "سالم السيد (بالغ) · فيصل السيد (بالغ)"],
    ["Children", "الأطفال", "None - this room is adults only", "لا يوجد - هذه الغرفة للبالغين فقط"],
  ],
  guestNote:
    "This room is adults only and the agent booked four adults, so there is no child age to check.",
  guestNoteAr:
    "هذه الغرفة للبالغين فقط وحجز الوكيل أربعة بالغين، فلا عمر طفل للتحقق منه.",
  requests: [
    ["CONNECTING ROOMS", "غرف متصلة", "The two rooms should be next to each other", "يجب أن تكون الغرفتان متجاورتين"],
    ["FLOOR", "الطابق", "High floor if possible", "طابق مرتفع إن أمكن"],
    ["LATE ARRIVAL", "وصول متأخر", "Guest expects to arrive around 23:40", "يتوقع الضيف الوصول حوالي ٢٣:٤٠"],
    ["NOTE FROM THE AGENT", "ملاحظة من الوكيل", "Guest asked for a quiet side away from the road", "طلب الضيف جهة هادئة بعيدًا عن الطريق"],
  ],
};

/**
 * UI 05.11G - the same worked booking, sold in Ramadan at the GCC
 * nationals price. Everything a booking is sold at it keeps: the rate,
 * the policy, and the group price that produced the rate. 700 / 700 / 600
 * is the season's 740 / 740 / 640 less the group's 40 a night, and the
 * page prints both so the number can be checked rather than trusted.
 */
const ramadanDetail: BookingDetail = {
  ...bookingDetail,
  allotmentDays: "25, 26 and 27 February",
  allotmentDaysAr: "٢٥ و٢٦ و٢٧ فبراير",
  nights: [
    { label: "THU 25 FEB", labelAr: "الخميس ٢٥ فبراير", before: 12, after: 10, of: 20 },
    { label: "FRI 26 FEB", labelAr: "الجمعة ٢٦ فبراير", before: 9, after: 7, of: 20 },
    { label: "SAT 27 FEB", labelAr: "السبت ٢٧ فبراير", before: 7, after: 5, of: 20 },
  ],
  rows: bookingDetail.rows.map((row) => {
    const [label] = row;
    if (label === "Check-in") {
      return [row[0], row[1], "Thursday 25 February 2027", "الخميس ٢٥ فبراير ٢٠٢٧"];
    }
    if (label === "Check-out") {
      return [row[0], row[1], "Sunday 28 February 2027", "الأحد ٢٨ فبراير ٢٠٢٧"];
    }
    if (label === "Your rate · incl. VAT") {
      return [
        row[0],
        row[1],
        "700 · 700 · 600 SAR per room per night · GCC nationals price (Ramadan 740 · 740 · 640)",
        "٧٠٠ · ٧٠٠ · ٦٠٠ ر.س لكل غرفة في الليلة · سعر مواطني الخليج (رمضان ٧٤٠ · ٧٤٠ · ٦٤٠)",
      ];
    }
    if (label === "Total to you") {
      return [
        row[0],
        row[1],
        "4,000 SAR · (700 + 700 + 600) × 2 rooms",
        "٤٬٠٠٠ ر.س · (٧٠٠ + ٧٠٠ + ٦٠٠) × غرفتان",
      ];
    }
    return row;
  }),
  guests: bookingDetail.guests.map((row) =>
    row[0] === "Nationality"
      ? [
          row[0],
          row[1],
          "Saudi · GCC nationals price used",
          "سعودي · استُخدم سعر مواطني الخليج",
        ]
      : row
  ),
};

/** The detail a booking runs on: its own where it has one. */
export function detailFor(id: string): BookingDetail {
  return id === "HTL-88220" ? ramadanDetail : bookingDetail;
}
