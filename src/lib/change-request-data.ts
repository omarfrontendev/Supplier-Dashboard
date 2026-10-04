export type ChangeRequestKind = "cancellation" | "partial" | "shortened" | "amendment" | "quote" | "nonCommercial";
export type ChangeRequestState = "waiting" | "agent" | "handled" | "approved" | "declined" | "cancelled";

export interface ChangeRequest {
  id: string;
  bookingId: string;
  guest: string;
  guestAr: string;
  agency: string;
  hotel: string;
  hotelAr: string;
  kind: ChangeRequestKind;
  state: ChangeRequestState;
  title: string;
  titleAr: string;
  badge: string;
  badgeAr: string;
  room: string;
  roomAr: string;
  stay: string;
  stayAr: string;
  asked: string;
  askedAr: string;
  meaning: string;
  meaningAr: string;
  bookingValue: number;
  ceiling: number;
  currentValue: number;
  proposedValue?: number | undefined;
  rooms: number;
  nights: number;
  removedRooms?: number | undefined;
  removedNights?: number | undefined;
  systemRate?: number | undefined;
  proposedRate?: number | undefined;
  originalGuest?: string | undefined;
  newGuest?: string | undefined;
  charge?: number | undefined;
  answerNote?: string | undefined;
}

export const changeRequestSeed: ChangeRequest[] = [
  { id:"CR-88191",bookingId:"HTL-88191",guest:"Yousef Rahman",guestAr:"يوسف رحمن",agency:"Sadara Tours",hotel:"Al Noor Makkah Hotel",hotelAr:"فندق النور مكة",kind:"cancellation",state:"waiting",title:"Cancel the whole booking",titleAr:"إلغاء الحجز بالكامل",badge:"Cancellation",badgeAr:"إلغاء",room:"Deluxe City View · B&B",roomAr:"ديلوكس بإطلالة المدينة · إفطار",stay:"Sat 12 – Mon 14 Sep · 1 room",stayAr:"السبت ١٢ – الاثنين ١٤ سبتمبر · غرفة",asked:"today 09:40",askedAr:"اليوم ٠٩:٤٠",meaning:"Up to 1,420 SAR is yours to charge",meaningAr:"يمكنك تحصيل حتى ١٬٤٢٠ ر.س",bookingValue:1420,ceiling:1420,currentValue:1420,rooms:1,nights:2 },
  { id:"CR-88166",bookingId:"HTL-88166",guest:"Mishal Al-Dossari",guestAr:"مشعل الدوسري",agency:"Manasik",hotel:"Al Noor Makkah Hotel",hotelAr:"فندق النور مكة",kind:"partial",state:"waiting",title:"Cancel 2 of the 5 rooms",titleAr:"إلغاء غرفتين من ٥ غرف",badge:"Cancellation · partial",badgeAr:"إلغاء · جزئي",room:"Standard Room · Half Board",roomAr:"غرفة قياسية · نصف إقامة",stay:"Sun 20 – Thu 24 Sep · 5 rooms",stayAr:"الأحد ٢٠ – الخميس ٢٤ سبتمبر · ٥ غرف",asked:"yesterday 19:05",askedAr:"أمس ١٩:٠٥",meaning:"Up to 3,440 SAR on the cancelled rooms only",meaningAr:"حتى ٣٬٤٤٠ ر.س على الغرف الملغاة فقط",bookingValue:8600,ceiling:3440,currentValue:8600,rooms:5,nights:4,removedRooms:2 },
  { id:"CR-88159",bookingId:"HTL-88159",guest:"Rakan Al-Mutairi",guestAr:"راكان المطيري",agency:"Sadara Tours",hotel:"Al Noor Makkah Hotel",hotelAr:"فندق النور مكة",kind:"shortened",state:"waiting",title:"Leave two nights early, out on 23 Sep",titleAr:"المغادرة مبكرًا بليلتين في ٢٣ سبتمبر",badge:"Cancellation · shortened",badgeAr:"إلغاء · تقصير إقامة",room:"Deluxe Partial Haram View · Room Only",roomAr:"ديلوكس بإطلالة جزئية · غرفة فقط",stay:"Sun 20 – Fri 25 Sep · 1 room",stayAr:"الأحد ٢٠ – الجمعة ٢٥ سبتمبر · غرفة",asked:"yesterday 15:40",askedAr:"أمس ١٥:٤٠",meaning:"Policy applies to the 2 removed nights only",meaningAr:"تُطبق السياسة على الليلتين المحذوفتين فقط",bookingValue:4400,ceiling:1760,currentValue:4400,rooms:1,nights:5,removedNights:2 },
  { id:"AMD-002",bookingId:"HTL-88176",guest:"Bader Al-Harbi",guestAr:"بدر الحربي",agency:"Alrehla Travel",hotel:"Al Noor Makkah Hotel",hotelAr:"فندق النور مكة",kind:"nonCommercial",state:"waiting",title:"Change the lead guest name",titleAr:"تغيير اسم الضيف الرئيسي",badge:"Amendment · non-commercial",badgeAr:"تعديل · غير تجاري",room:"Standard Room · B&B",roomAr:"غرفة قياسية · إفطار",stay:"Sun 27 – Tue 29 Sep · 1 room",stayAr:"الأحد ٢٧ – الثلاثاء ٢٩ سبتمبر · غرفة",asked:"yesterday 17:20",askedAr:"أمس ١٧:٢٠",meaning:"No cost change · nothing to re-check",meaningAr:"دون تغيير تكلفة · لا حاجة لإعادة الفحص",bookingValue:1120,ceiling:0,currentValue:1120,rooms:1,nights:2,originalGuest:"Bader Al-Harbi",newGuest:"Faisal Al-Harbi" },
  { id:"CR-88154",bookingId:"HTL-88154",guest:"Hind Al-Zahrani",guestAr:"هند الزهراني",agency:"Sadara Tours",hotel:"Central Haram Hotel",hotelAr:"فندق الحرم المركزي",kind:"cancellation",state:"handled",title:"Cancelled inside the free window",titleAr:"أُلغي داخل فترة الإلغاء المجاني",badge:"Handled",badgeAr:"تمت المعالجة",room:"Standard Room · Room Only",roomAr:"غرفة قياسية · غرفة فقط",stay:"Wed 2 – Fri 4 Sep · 1 room",stayAr:"الأربعاء ٢ – الجمعة ٤ سبتمبر · غرفة",asked:"1 Sep",askedAr:"١ سبتمبر",meaning:"You charged nothing · settled",meaningAr:"لم يتم التحصيل · تمت التسوية",bookingValue:1260,ceiling:0,currentValue:0,rooms:1,nights:2,charge:0 },
];

/** The worked detail Figma UI 06.1 and UI 06.10 draw for each request. */
export interface ChangeRequestDetail {
  meta: string;
  metaAr: string;
  headline: string;
  headlineAr: string;
  lead: string;
  leadAr: string;
  amount: string;
  amountNote: string;
  amountNoteAr: string;
  respondBy: string;
  respondByAr: string;
  rows: Array<[string, string, string, string]>;
  guests: Array<[string, string, string, string]>;
}

export const changeRequestDetails: Record<string, ChangeRequestDetail> = {
  "CR-88191": {
    meta: "HTL-88191  ·  Al Noor Makkah Hotel  ·  booked 2 Sep  ·  cancellation asked today at 09:40",
    metaAr: "HTL-88191  ·  فندق النور مكة  ·  حُجز ٢ سبتمبر  ·  طُلب الإلغاء اليوم ٠٩:٤٠",
    headline: "Hoteliana asked to cancel this booking",
    headlineAr: "طلبت هوتيليانا إلغاء هذا الحجز",
    lead: "You cannot refuse a cancellation - the agent bought that right in the policy. What you decide is how much of what the policy allows you actually charge.",
    leadAr: "لا يمكنك رفض الإلغاء - فقد اشترى الوكيل هذا الحق في السياسة. وما تقرره هو كم ستحصّل فعلًا من الحد الذي تسمح به السياسة.",
    amount: "1,420 SAR",
    amountNote: "the most the policy allows you",
    amountNoteAr: "أقصى ما تسمح به السياسة",
    respondBy:
      "Respond by tomorrow 09:40 - 24 h from the request. If you do not answer, the full policy charge of 1,420 SAR applies automatically. Your name, the amount and the time are recorded on the booking.",
    respondByAr:
      "الرد قبل غدًا ٠٩:٤٠ - ٢٤ ساعة من الطلب. وإن لم تجب تُطبّق رسوم السياسة الكاملة ١٬٤٢٠ ر.س تلقائيًا. ويُسجَّل اسمك والمبلغ والوقت على الحجز.",
    rows: [
      ["Hotel", "الفندق", "Al Noor Makkah Hotel", "فندق النور مكة"],
      ["Room", "الغرفة", "Deluxe Room City View", "ديلوكس إطلالة المدينة"],
      ["Occupancy", "الإشغال", "Double · 2 adults", "مزدوجة · بالغان"],
      ["Meal plan", "خطة الوجبات", "Bed & Breakfast", "إفطار"],
      ["Check-in", "الوصول", "Saturday 12 September 2026", "السبت ١٢ سبتمبر ٢٠٢٦"],
      ["Check-out", "المغادرة", "Monday 14 September 2026", "الاثنين ١٤ سبتمبر ٢٠٢٦"],
      ["Nights · rooms", "الليالي · الغرف", "2 nights · 1 room", "ليلتان · غرفة واحدة"],
      ["Your rate", "سعرك", "790 on Sat, 630 on Sun", "٧٩٠ السبت، ٦٣٠ الأحد"],
      ["Total to you", "إجماليك", "1,420 SAR · the amount the policy measures against", "١٬٤٢٠ ر.س · المبلغ الذي تقيس عليه السياسة"],
      ["Cancellation policy", "سياسة الإلغاء", "Free cancellation until 2 days before arrival, then full stay charge", "إلغاء مجاني حتى يومين قبل الوصول، ثم رسوم الإقامة كاملة"],
      ["Policy locked on", "تثبّتت السياسة في", "2 September 2026 · contract v1.2", "٢ سبتمبر ٢٠٢٦ · العقد v1.2"],
      ["Confirmation type", "نوع التأكيد", "Instant - confirmed by the system", "فوري - يؤكده النظام"],
      ["Booking version", "إصدار الحجز", "v1 · unchanged since 2 September", "v1 · دون تغيير منذ ٢ سبتمبر"],
    ],
    guests: [
      ["Lead guest", "الضيف الرئيسي", "Yousef Rahman", "يوسف رحمن"],
      ["ID number", "رقم الهوية", "1077 3390", "1077 3390"],
      ["Nationality", "الجنسية", "Saudi", "سعودي"],
      ["Room 1", "الغرفة ١", "Yousef Rahman (adult) · Amal Rahman (adult)", "يوسف رحمن (بالغ) · أمل رحمن (بالغة)"],
      ["Reason given", "السبب المذكور", "Guest changed travel dates and will rebook for October", "غيّر الضيف تواريخ السفر وسيحجز مجددًا في أكتوبر"],
      ["Passed on by", "نقلها", "Hoteliana · today 09:40", "هوتيليانا · اليوم ٠٩:٤٠"],
      ["Rebooking", "إعادة الحجز", "The agent says the guest intends to rebook - nothing is promised", "يقول الوكيل إن الضيف ينوي الحجز مجددًا - ولا وعد بذلك"],
      ["Special requests", "طلبات خاصة", "High floor · late arrival around 23:40", "طابق مرتفع · وصول متأخر حوالي ٢٣:٤٠"],
    ],
  },
  "AMD-002": {
    meta: "HTL-88176  ·  Al Noor Makkah Hotel  ·  booked 9 Sep  ·  name change asked yesterday at 17:20",
    metaAr: "HTL-88176  ·  فندق النور مكة  ·  حُجز ٩ سبتمبر  ·  طُلب تغيير الاسم أمس ١٧:٢٠",
    headline: "The agent wants to change the lead guest name",
    headlineAr: "يريد الوكيل تغيير اسم الضيف الرئيسي",
    lead: "Nothing about the stay, the rate, the policy or your rooms changes. This is paperwork, not commerce.",
    leadAr: "لا شيء يتغير في الإقامة أو السعر أو السياسة أو غرفك. هذا إجراء ورقي لا تجاري.",
    amount: "0 SAR",
    amountNote: "no cost change",
    amountNoteAr: "بلا تغيير في التكلفة",
    respondBy:
      "Respond by tomorrow 17:20 - 48 h from the request. If you do not answer, the change expires and the booking stays exactly as it is. Your answer, the amount and the time are recorded on the booking.",
    respondByAr:
      "الرد قبل غدًا ١٧:٢٠ - ٤٨ ساعة من الطلب. وإن لم تجب ينتهي التغيير ويبقى الحجز كما هو تمامًا. ويُسجَّل ردّك والمبلغ والوقت على الحجز.",
    rows: [
      ["Room", "الغرفة", "Standard Room · Double occupancy", "غرفة ستاندرد · إشغال مزدوج"],
      ["Meal plan", "خطة الوجبات", "Bed & Breakfast", "إفطار"],
      ["Check-in", "الوصول", "Sunday 27 September 2026", "الأحد ٢٧ سبتمبر ٢٠٢٦"],
      ["Check-out", "المغادرة", "Tuesday 29 September 2026 · unchanged", "الثلاثاء ٢٩ سبتمبر ٢٠٢٦ · دون تغيير"],
      ["Rate per night", "السعر لليلة", "560 per night · unchanged", "٥٦٠ لليلة · دون تغيير"],
      ["Lead guest", "الضيف الرئيسي", "Bader Al-Harbi → Faisal Al-Harbi", "بدر الحربي ← فيصل الحربي"],
      ["Room 1", "الغرفة ١", "Faisal Al-Harbi (adult) · Munira Al-Harbi (adult)", "فيصل الحربي (بالغ) · منيرة الحربي (بالغة)"],
      ["Why they are asking", "سبب الطلب", "The booking was made in the brother’s name and the traveller changed", "حُجز باسم الأخ وتغيّر المسافر"],
      ["Cancellation policy", "سياسة الإلغاء", "Free cancellation until 2 days before arrival · unchanged", "إلغاء مجاني حتى يومين قبل الوصول · دون تغيير"],
    ],
    guests: [],
  },
};

/** The policy window Figma draws on the cancellation (UI 06.1). */
export const cancellationWindow: Array<[string, string, string, string]> = [
  ["2 - 9 September", "٢ - ٩ سبتمبر", "free cancellation", "إلغاء مجاني"],
  ["10 Sep · 00:00", "١٠ سبتمبر · ٠٠:٠٠", "the deadline", "الموعد النهائي"],
  ["now · 09:40", "الآن · ٠٩:٤٠", "full stay charge", "رسوم الإقامة كاملة"],
];

/** The before / after table on the non-commercial amendment (UI 06.10). */
export const amendmentMoves: Array<[string, string, string, string]> = [
  ["LEAD GUEST", "الضيف الرئيسي", "Bader Al-Harbi", "Faisal Al-Harbi"],
  ["ID NUMBER", "رقم الهوية", "1049 8823", "1081 4460"],
  ["WHAT YOU ARE OWED", "المستحق لك", "1,120 SAR", "1,120 SAR"],
];
