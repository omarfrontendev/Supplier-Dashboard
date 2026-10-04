/**
 * The booking overlays — Figma OV 05.2 / 05.2B (confirm), OV 05.3 /
 * 05.3A (reject, and the reason behind it) and OV 05.10 (the number
 * the hotel issued).
 */

export interface Bi {
  en: string;
  ar: string;
}

const t = (en: string, ar: string): Bi => ({ en, ar });

/** OV 05.3A — the fixed list Hoteliana reports back to the agent. */
export interface RejectReason {
  label: Bi;
  hint: Bi;
}

export const rejectReasons: RejectReason[] = [
  {
    label: t("No availability", "لا توفّر"),
    hint: t(
      "The room is genuinely not available that night",
      "الغرفة غير متاحة فعلًا تلك الليلة"
    ),
  },
  {
    label: t("Rate error", "خطأ في السعر"),
    hint: t("The rate that was sold is wrong", "السعر الذي بيع به خاطئ"),
  },
  {
    label: t("The hotel is not available", "الفندق غير متاح"),
    hint: t(
      "The hotel cannot take the guest at all",
      "لا يستطيع الفندق استقبال الضيف إطلاقًا"
    ),
  },
  {
    label: t("Operational issue", "مشكلة تشغيلية"),
    hint: t("Maintenance, closure or staffing", "صيانة أو إغلاق أو نقص كوادر"),
  },
  {
    label: t("Room out of service", "غرفة خارج الخدمة"),
    hint: t("Maintenance on that room type", "صيانة في هذا النوع من الغرف"),
  },
  {
    label: t("The hotel is overbooked", "الفندق محجوز فوق طاقته"),
    hint: t(
      "More rooms sold than the hotel has",
      "بيعت غرف أكثر مما يملك الفندق"
    ),
  },
  {
    label: t("Outside our control", "خارج سيطرتنا"),
    hint: t(
      "Weather, authorities or a force majeure event",
      "طقس أو جهات رسمية أو قوة قاهرة"
    ),
  },
  {
    label: t("Other reason", "سبب آخر"),
    hint: t(
      "Add a note so Hoteliana understands",
      "أضف ملاحظة حتى تفهم هوتيليانا"
    ),
  },
];

export const rejectBooking = {
  overline: t(
    "HTL-88214 · Nour Al-Sayed · 2 rooms · 3 nights",
    "HTL-88214 · نور السيد · غرفتان · ٣ ليالٍ"
  ),
  title: t("You cannot take this booking", "لا يمكنك أخذ هذا الحجز"),
  body: t(
    "Hoteliana takes the request back to the agent and you cannot reopen it. The 2 rooms stay in your allotment and the room stays on sale.",
    "تعيد هوتيليانا الطلب إلى الوكيل ولا يمكنك فتحه مجددًا. وتبقى الغرفتان في حصتك وتبقى الغرفة معروضة للبيع."
  ),
  reasonLabel: t(
    "Why can you not take it? · required",
    "لماذا لا يمكنك أخذه؟ · مطلوب"
  ),
  reasonHint: t(
    "Fixed list: No availability · Rate error · The hotel is not available · Room out of service · The hotel is overbooked · Operational issue · Outside our control · Other reason",
    "قائمة ثابتة: لا توفّر · خطأ في السعر · الفندق غير متاح · غرفة خارج الخدمة · الفندق محجوز فوق طاقته · مشكلة تشغيلية · خارج سيطرتنا · سبب آخر"
  ),

  disagreeTitle: t(
    "Your calendar disagrees with you",
    "تقويمك يخالفك"
  ),
  disagreeBody: t(
    "It says 12, 9 and 7 Standard Rooms are free on 24, 25 and 26 September. If that is not true, the next agent will hit the same wall - stop the sale on those nights too.",
    "يقول إن ١٢ و٩ و٧ غرف ستاندرد متاحة في ٢٤ و٢٥ و٢٦ سبتمبر. فإن لم يكن ذلك صحيحًا، سيصطدم الوكيل التالي بالجدار نفسه - أوقف البيع في تلك الليالي أيضًا."
  ),
  alsoStop: t(
    "Also stop sale on Standard Room for 24 - 26 September",
    "أوقف البيع أيضًا على غرفة ستاندرد في ٢٤ - ٢٦ سبتمبر"
  ),
  alsoStopNote: t(
    "Rates and rooms are kept - you can open it again any time.",
    "تُحفَظ الأسعار والغرف - ويمكنك فتحها مجددًا في أي وقت."
  ),

  noteTitle: t("Note to Hoteliana · optional", "ملاحظة لهوتيليانا · اختياري"),
  notePlaceholder: t(
    "Anything the agent should be told",
    "أي شيء ينبغي إخبار الوكيل به"
  ),
  recorded: t(
    "Your reason, your name and the time are recorded on the booking. This cannot be undone, and Hoteliana is told the moment you press it.",
    "يُسجَّل سببك واسمك والوقت على الحجز. ولا يمكن التراجع، وتُبلَّغ هوتيليانا لحظة ضغطك."
  ),
  roomsStay: t("The rooms stay yours.", "تبقى الغرف لك."),
  cancel: t("Cancel", "إلغاء"),
  reject: t("Reject the request", "رفض الطلب"),

  /** OV 05.3A — the picker behind the reason field. */
  pickOverline: t(
    "Required · recorded on the booking",
    "مطلوب · يُسجَّل على الحجز"
  ),
  pickTitle: t("Why can you not take it?", "لماذا لا يمكنك أخذه؟"),
  pickBody: t(
    "Hoteliana reports rejection reasons back to the agent and uses them to spot patterns. Pick the closest one.",
    "تُبلّغ هوتيليانا الوكيل بأسباب الرفض وتستخدمها لرصد الأنماط. اختر أقربها."
  ),
  pickNote: t(
    "Picking a reason does not stop the sale by itself - the rejection screen asks you about that separately.",
    "اختيار السبب وحده لا يوقف البيع - فشاشة الرفض تسألك عن ذلك على حدة."
  ),
  useReason: t("Use this reason", "استخدم هذا السبب"),
};

/** OV 05.10 — the number the hotel issued, after the fact. */
export const addNumber = {
  overline: t(
    "HTL-88214 · Nour Al-Sayed · Confirmed",
    "HTL-88214 · نور السيد · مؤكد"
  ),
  title: t(
    "Add the hotel confirmation number",
    "إضافة رقم تأكيد الفندق"
  ),
  body: t(
    "The booking is already confirmed. This is the number Hoteliana needs for the file.",
    "الحجز مؤكد بالفعل. وهذا هو الرقم الذي تحتاجه هوتيليانا للملف."
  ),
  numberLabel: t("Confirmation number", "رقم التأكيد"),
  numberHint: t(
    "Exactly as the hotel issued it - Hoteliana quotes it back to the agent.",
    "كما أصدره الفندق تمامًا - تقتبسه هوتيليانا للوكيل."
  ),
  pmsLabel: t("Your booking reference · optional", "مرجع حجزك · اختياري"),
  pmsPlaceholder: t("Your PMS reference", "مرجعك في نظامك"),
  note: t(
    "The moment you save it, the reference-pending flag disappears for you and for Hoteliana, and the 3:00 reminder stops.",
    "لحظة حفظه تختفي علامة «بانتظار المرجع» لك ولهوتيليانا، ويتوقف تذكير الساعة ٣:٠٠."
  ),
  cancel: t("Cancel", "إلغاء"),
  save: t("Save the number", "حفظ الرقم"),
};

/** OV 05.12 — what you can tell Hoteliana about a confirmed booking. */
export const reportIssue = {
  title: t("Report an issue to Hoteliana", "الإبلاغ عن مشكلة إلى هوتيليانا"),
  body: t(
    "You cannot cancel or change a confirmed booking yourself. Tell Hoteliana what is wrong and they handle it with the agent.",
    "لا يمكنك إلغاء حجز مؤكد أو تغييره بنفسك. أخبر هوتيليانا بما هو خطأ وهي تتولاه مع الوكيل."
  ),
  wrongTitle: t("What is wrong · required", "ما المشكلة · مطلوب"),
  wrongPlaceholder: t(
    "Overbooked · room unavailable · guest details wrong · rate or policy wrong · other",
    "حجز زائد · غرفة غير متاحة · بيانات الضيف خاطئة · سعر أو سياسة خاطئة · غير ذلك"
  ),
  describeTitle: t("Describe it · required", "صف المشكلة · مطلوب"),
  describePlaceholder: t(
    "What happened, and what you can offer instead if anything",
    "ما الذي حدث، وما الذي يمكنك تقديمه بديلًا إن وُجد"
  ),
  offerTitle: t(
    "Can you offer anything instead? · optional · pick one",
    "هل يمكنك تقديم بديل؟ · اختياري · اختر واحدًا"
  ),
  offers: [
    {
      label: t(
        "A different room on the same nights",
        "غرفة مختلفة في الليالي نفسها"
      ),
      hint: t(
        "Deluxe Room City View has 8 free on 24 - 26 Sep",
        "ديلوكس إطلالة المدينة فيها ٨ متاحة في ٢٤ - ٢٦ سبتمبر"
      ),
    },
    {
      label: t(
        "The same room on different nights",
        "الغرفة نفسها في ليالٍ مختلفة"
      ),
      hint: t(
        "Standard Room has 16 free on 27 - 29 Sep",
        "غرفة ستاندرد فيها ١٦ متاحة في ٢٧ - ٢٩ سبتمبر"
      ),
    },
    {
      label: t(
        "Nothing - the hotel cannot take them at all",
        "لا شيء - لا يستطيع الفندق استقبالهم إطلاقًا"
      ),
      hint: t("", ""),
    },
  ],
  stopSaleNote: t(
    "So the same thing does not happen to the next agent.",
    "حتى لا يحدث الشيء نفسه للوكيل التالي."
  ),
  staysNote: t(
    "The booking stays Confirmed until Hoteliana answers. Nothing you do here cancels it - only Hoteliana can, with the agent.",
    "يبقى الحجز مؤكدًا حتى ترد هوتيليانا. ولا شيء تفعله هنا يلغيه - ولا يلغيه إلا هوتيليانا مع الوكيل."
  ),
  slaNote: t(
    "Hoteliana answers issues within 2 hours during working hours (Saudi time).",
    "ترد هوتيليانا على المشكلات خلال ساعتين في ساعات العمل (بتوقيت السعودية)."
  ),
  send: t("Send to Hoteliana", "إرسال إلى هوتيليانا"),
};

/** OV 05.13 — the issue is with Hoteliana, and the booking has not moved. */
export const issueSent = {
  overline: t("ISS-2026-0184 · sent 12:41", "ISS-2026-0184 · أُرسل ١٢:٤١"),
  title: t("Hoteliana has it", "وصلت إلى هوتيليانا"),
  body: t(
    "The booking is unchanged and still Confirmed. Hoteliana takes it from here with the agent.",
    "الحجز كما هو وما زال مؤكدًا. وتتولاه هوتيليانا من هنا مع الوكيل."
  ),
  rows: [
    {
      label: t("Issue reference", "مرجع المشكلة"),
      value: t("ISS-2026-0184", "ISS-2026-0184"),
    },
    { label: t("Booking", "الحجز"), value: t("HTL-88214", "HTL-88214") },
    {
      label: t("What you reported", "ما أبلغت عنه"),
      value: t(
        "The hotel cannot honour the booking",
        "لا يستطيع الفندق الوفاء بالحجز"
      ),
    },
    {
      label: t("What you offered", "ما عرضته"),
      value: t(
        "Deluxe Room City View on the same nights",
        "ديلوكس إطلالة المدينة في الليالي نفسها"
      ),
    },
    {
      label: t("Stop sale applied", "أُوقف البيع"),
      value: t(
        "Standard Room · 24 - 26 September",
        "غرفة ستاندرد · ٢٤ - ٢٦ سبتمبر"
      ),
    },
  ],
  note: t(
    "You will get the answer in this portal and by email. If the agent accepts the alternative, Hoteliana creates the new booking and cancels this one - you do not have to do either. You can follow it any time under Your cases.",
    "تصلك الإجابة في هذه البوابة وبالبريد. وإن قبل الوكيل البديل، تنشئ هوتيليانا الحجز الجديد وتلغي هذا - ولا يلزمك فعل أي منهما. ويمكنك متابعته في أي وقت تحت «حالاتك»."
  ),
  follow: t("Follow this issue ›", "تابع هذه المشكلة ›"),
  back: t("Back to the booking", "العودة إلى الحجز"),
};

/** OV 05.8 — finding one booking among forty-eight. */
export const bookingSearch = {
  title: t("Find a booking", "ابحث عن حجز"),
  body: t(
    "Reference, guest name, hotel or the agent who booked it.",
    "المرجع أو اسم الضيف أو الفندق أو الوكيل الذي حجزه."
  ),
  term: t("HTL-882", "HTL-882"),
  matches: t("{count} matches", "{count} نتائج"),
  hits: [
    {
      name: t("HTL-88214 · Nour Al-Sayed", "HTL-88214 · نور السيد"),
      meta: t(
        "Standard Room · Half Board · Thu 24 - Sun 27 Sep",
        "غرفة ستاندرد · نصف إقامة · الخميس ٢٤ - الأحد ٢٧ سبتمبر"
      ),
      state: t("needs an answer", "تحتاج ردًا"),
      waiting: true,
    },
    {
      name: t("HTL-88213 · Faisal Al-Otaibi", "HTL-88213 · فيصل العتيبي"),
      meta: t(
        "Deluxe Room City View · Room Only · Thu 1 - Sat 3 Oct",
        "ديلوكس إطلالة المدينة · بدون وجبات · الخميس ١ - السبت ٣ أكتوبر"
      ),
      state: t("needs an answer", "تحتاج ردًا"),
      waiting: true,
    },
    {
      name: t("HTL-88209 · Mona Ibrahim", "HTL-88209 · منى إبراهيم"),
      meta: t(
        "Standard Room · Bed & Breakfast · Thu 17 - Sat 19 Sep",
        "غرفة ستاندرد · إفطار · الخميس ١٧ - السبت ١٩ سبتمبر"
      ),
      state: t("confirmed", "مؤكد"),
      waiting: false,
    },
    {
      name: t("HTL-88205 · Ahmed Nasser", "HTL-88205 · أحمد ناصر"),
      meta: t(
        "Deluxe Haram View · Bed & Breakfast · Sun 20 - Thu 24 Sep",
        "ديلوكس إطلالة الحرم · إفطار · الأحد ٢٠ - الخميس ٢٤ سبتمبر"
      ),
      state: t("confirmed", "مؤكد"),
      waiting: false,
    },
  ],
  openFirst: t("Open the first match", "افتح أول نتيجة"),
  close: t("Close", "إغلاق"),
};

/** OV 05.14 — the list as a file, exactly as it stands. */
export const exportBookings = {
  title: t("Export the bookings", "تصدير الحجوزات"),
  body: t(
    "A snapshot of the list as it stands right now.",
    "لقطة للقائمة كما هي الآن."
  ),
  scopeTitle: t("What goes in the file", "محتويات الملف"),
  scopes: [
    {
      label: t("The 8 bookings in view", "الحجوزات الثمانية الظاهرة"),
      hint: t("what your current filter shows", "ما تعرضه تصفيتك الحالية"),
    },
    {
      label: t(
        "Every booking that still needs an answer",
        "كل حجز ما زال يحتاج ردًا"
      ),
      hint: t("2 rows waiting for you", "صفّان ينتظران ردّك"),
    },
    {
      label: t("Everything for this hotel", "كل شيء لهذا الفندق"),
      hint: t(
        "all 48 bookings, closed ones included",
        "الحجوزات الـ٤٨ كلها، بما فيها المغلقة"
      ),
    },
  ],
  formatTitle: t("Format", "الصيغة"),
  formats: [
    { label: t("CSV", "CSV"), hint: t("opens anywhere", "يفتح في أي مكان") },
    { label: t("Excel", "إكسل"), hint: t(".xlsx", ".xlsx") },
    { label: t("PDF", "PDF"), hint: t("a printable copy", "نسخة للطباعة") },
  ],
  columnsTitle: t("Columns", "الأعمدة"),
  columns: [
    t("Reference", "المرجع"),
    t("Guest", "الضيف"),
    t("Agency", "الوكالة"),
    t("Room · meal", "الغرفة · الوجبة"),
    t("Hotel", "الفندق"),
    t("Rooms · nights", "الغرف · الليالي"),
    t("Your rate", "سعرك"),
    t("Booked at", "وقت الحجز"),
    t("Status", "الحالة"),
    t("Nights", "الليالي"),
    t("Rooms", "الغرف"),
    t("Guest phone", "هاتف الضيف"),
  ],
  note: t(
    "The file keeps the same columns you see in the list, plus the money column.",
    "يحتفظ الملف بالأعمدة نفسها التي تراها في القائمة، مع عمود المبلغ."
  ),
  cancel: t("Cancel", "إلغاء"),
  download: t("Export {count} rows", "تصدير {count} صفوف"),
};

/** OV 05.7 — the filters that stack with the chips above the table. */
export const bookingFilter = {
  title: t("Narrow the list", "تضييق القائمة"),
  body: t(
    "Filters stack with the status chips above the table.",
    "تتراكم التصفيات مع شرائح الحالة فوق الجدول."
  ),
  groups: [
    {
      title: t("Hotel", "الفندق"),
      options: [
        { label: t("All 3 hotels", "الفنادق الثلاثة"), count: t("48 bookings", "٤٨ حجزًا") },
        { label: t("Al Noor Makkah Hotel", "فندق النور مكة"), count: t("41 bookings", "٤١ حجزًا") },
        { label: t("Rawdah Suites", "أجنحة الروضة"), count: t("5 bookings", "٥ حجوزات") },
        { label: t("Central Haram Hotel", "فندق الحرم المركزي"), count: t("2 bookings", "حجزان") },
      ],
    },
    {
      title: t("Sort", "الترتيب"),
      options: [
        { label: t("Newest first", "الأحدث أولًا"), count: t("", "") },
        { label: t("Arriving soonest", "الأقرب وصولًا"), count: t("", "") },
        {
          label: t("Answer deadline first", "أقرب موعد رد"),
          count: t("requests that expire soonest", "الطلبات الأقرب انتهاءً"),
        },
      ],
    },
    {
      title: t("Stay dates", "تواريخ الإقامة"),
      options: [
        { label: t("Any stay date", "أي تاريخ إقامة"), count: t("", "") },
        { label: t("Arriving today", "الوصول اليوم"), count: t("4 bookings", "٤ حجوزات") },
        { label: t("Departing today", "المغادرة اليوم"), count: t("3 bookings", "٣ حجوزات") },
        { label: t("This month", "هذا الشهر"), count: t("22 bookings", "٢٢ حجزًا") },
        { label: t("Pick a date range", "اختر نطاق تواريخ"), count: t("", "") },
      ],
    },
    {
      title: t("Booked · when the agent booked it", "الحجز · متى حجزه الوكيل"),
      options: [
        { label: t("Any time", "أي وقت"), count: t("", "") },
        { label: t("Today", "اليوم"), count: t("", "") },
        { label: t("Last 7 days", "آخر ٧ أيام"), count: t("11 bookings", "١١ حجزًا") },
        { label: t("Last 30 days", "آخر ٣٠ يومًا"), count: t("29 bookings", "٢٩ حجزًا") },
      ],
    },
  ],
  clear: t("Clear all", "مسح الكل"),
  apply: t("Apply filters", "تطبيق التصفية"),
};
