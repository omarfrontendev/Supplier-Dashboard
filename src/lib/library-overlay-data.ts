/**
 * The hotel-library overlays — Figma OV 02.2 / 02.2D (quick view),
 * OV 02.3 / 02.1B (confirm the request) and OV 02.4 (it is sent).
 */

export interface Bi {
  en: string;
  ar: string;
}

const t = (en: string, ar: string): Bi => ({ en, ar });

/** OV 02.2 — the rooms Hoteliana holds for a hotel, as the drawer lists them. */
export interface CatalogueRoom {
  name: Bi;
  detail: Bi;
  state: Bi;
}

export const quickViewRooms: CatalogueRoom[] = [
  {
    name: t("Standard Room", "غرفة ستاندرد"),
    detail: t(
      "2 adults · 1 child · 1 king · 28 m²",
      "بالغان · طفل · سرير كينج · ٢٨ م²"
    ),
    state: t("Available", "متاحة"),
  },
  {
    name: t("Deluxe Room City View", "ديلوكس إطلالة المدينة"),
    detail: t(
      "3 adults · 1 child · 3 single · 34 m²",
      "٣ بالغين · طفل · ٣ أسرّة مفردة · ٣٤ م²"
    ),
    state: t("Available", "متاحة"),
  },
  {
    name: t(
      "Deluxe Room Partial Haram View",
      "ديلوكس إطلالة جزئية على الحرم"
    ),
    detail: t(
      "4 adults · 2 children · 2 queen · 42 m²",
      "٤ بالغين · طفلان · سريرا كوين · ٤٢ م²"
    ),
    state: t("Available", "متاحة"),
  },
  {
    name: t("Junior Suite", "جناح جونيور"),
    detail: t(
      "2 adults · 1 child · 1 king · 48 m²",
      "بالغان · طفل · سرير كينج · ٤٨ م²"
    ),
    state: t("Available", "متاحة"),
  },
];

export const quickView = {
  overline: t("Hotel library · Quick view", "مكتبة الفنادق · نظرة سريعة"),
  available: t("Available to request", "متاح للطلب"),
  requested: t("Requested", "مطلوب"),

  profileOverline: t(
    "Official Hoteliana profile · read only",
    "الملف الرسمي في هوتيليانا · للقراءة فقط"
  ),
  nameAr: t("Hotel name (AR)", "اسم الفندق (عربي)"),
  nameArValue: t("فندق النور مكة", "فندق النور مكة"),
  address: t("Address", "العنوان"),
  addressValue: t(
    "Al Masjid Al Haram Rd, Al Aziziyah",
    "طريق المسجد الحرام، العزيزية"
  ),
  description: t("Description", "الوصف"),
  descriptionValue: t("Central hotel near Haram", "فندق مركزي بالقرب من الحرم"),
  distance: t("Distance to Haram", "المسافة إلى الحرم"),
  distanceValue: t("1.2 km · shuttle", "١٫٢ كم · نقل مكوكي"),
  /*
   * The licence is what makes the profile official rather than claimed,
   * and it is the one line here that can expire - so the quick view
   * carries it, with the date, before anyone asks for access.
   */
  licence: t("Tourism licence", "رخصة السياحة"),
  licenceValue: t(
    "7010231144 · valid until 12 Mar 2027",
    "7010231144 · سارية حتى ١٢ مارس ٢٠٢٧"
  ),

  amenitiesTitle: t("Amenities", "المرافق"),
  amenities: [
    t("Wi-Fi", "واي فاي"),
    t("Parking", "موقف سيارات"),
    t("Restaurant", "مطعم"),
    t("24h desk", "استقبال ٢٤ ساعة"),
    t("Airport transfer", "نقل من المطار"),
    t("Family rooms", "غرف عائلية"),
    t("Lift", "مصعد"),
    t("Accessible", "مهيأ لذوي الإعاقة"),
  ],

  cataloqueTitle: t("Room catalogue · {count}", "دليل الغرف · {count}"),
  catalogueNote: t(
    "Each room has one view · prices are set in your supply contract",
    "لكل غرفة إطلالة واحدة · وتُحدَّد الأسعار في عقد التوريد"
  ),

  approveNote: t(
    "Once Hoteliana approves, you can create a supply contract for this hotel.",
    "بعد موافقة هوتيليانا يمكنك إنشاء عقد توريد لهذا الفندق."
  ),
  /** OV 02.2D — asking twice does not make it faster. */
  pendingNote: t(
    "You already asked for access on 12 Sep. Hoteliana is reviewing it - sending another request would not make it faster.",
    "طلبت الوصول بالفعل في ١٢ سبتمبر. وهوتيليانا تراجعه - وإرسال طلب آخر لن يعجّله."
  ),
  requestAccess: t("Request access", "طلب الوصول"),
  seeRequest: t("See your request", "عرض طلبك"),
};

/** OV 02.3 / 02.1B — what confirming a request commits the company to. */
export const confirmRequest = {
  overline: t("Confirm request", "تأكيد الطلب"),
  titleOne: t("Request access to this hotel?", "طلب الوصول إلى هذا الفندق؟"),
  /* Two hotels are "فندقين", never "٢ فنادق" - the count is a phrase the
     sentence takes, not a number bolted onto a noun. */
  titleMany: t(
    "Request access to {hotels}?",
    "طلب الوصول إلى {hotels}؟"
  ),
  bodyOne: t(
    "Hoteliana approval is required before a supply contract can be created.",
    "موافقة هوتيليانا مطلوبة قبل إنشاء أي عقد توريد."
  ),
  bodyMany: t(
    "Each hotel is reviewed separately. Confirm the selection before sending it to Hoteliana.",
    "كل فندق يُراجع على حدة. أكّد الاختيار قبل إرساله إلى هوتيليانا."
  ),
  availableMeta: t(
    "Makkah · 4 stars · Available to request",
    "مكة · ٤ نجوم · متاح للطلب"
  ),
  termsTitle: t("By confirming, you confirm that", "بالتأكيد، أنت تقرّ بأن"),
  terms: [
    t("Your company can supply this hotel.", "شركتك قادرة على توريد هذا الفندق."),
    t(
      "Published rates, inventory and conditions are contractually binding.",
      "الأسعار والمخزون والشروط المنشورة مُلزِمة تعاقديًا."
    ),
    t(
      "Failure to fulfil an accepted booking is handled under the supplier agreement.",
      "الإخلال بتنفيذ حجز مقبول يُعالَج بموجب اتفاقية المورّد."
    ),
  ],
  /* OV 02.3 keeps this one outside the panel: the three above are what
     you are agreeing to, and this is what we do about it. */
  recorded: t(
    "The request is recorded under your name with the date and time.",
    "يُسجَّل الطلب باسمك مع التاريخ والوقت."
  ),
  cancel: t("Cancel", "إلغاء"),
  sendOne: t("Confirm & send 1 request", "تأكيد وإرسال طلب واحد"),
  sendMany: t("Confirm {requests}", "تأكيد {requests}"),
};

/** OV 02.4 — the request is with Hoteliana, and what happens to it. */
export const requestSent = {
  overline: t("Request sent", "أُرسل الطلب"),
  title: t("Access request sent to Hoteliana", "أُرسل طلب الوصول إلى هوتيليانا"),
  body: t(
    "Each hotel is reviewed separately. Requested hotels are marked in the library until a decision is made.",
    "كل فندق يُراجع على حدة. وتبقى الفنادق المطلوبة مُعلَّمة في المكتبة حتى صدور القرار."
  ),
  stepsTitle: t("What happens next", "ما الذي يحدث بعد ذلك"),
  steps: [
    t("Sent now under your name", "أُرسل الآن باسمك"),
    t(
      "Hoteliana reviews the relationship (usually 2 working days)",
      "تراجع هوتيليانا العلاقة (عادةً يوما عمل)"
    ),
    t(
      "Approved → the hotel appears in My Hotels, ready for its first supply contract",
      "عند الموافقة ← يظهر الفندق في «فنادقي» جاهزًا لأول عقد توريد"
    ),
  ],
  note: t(
    "No action is needed unless Hoteliana asks for verification. You will be notified either way.",
    "لا يلزمك فعل شيء ما لم تطلب هوتيليانا تحققًا. وستُخطَر في الحالتين."
  ),
  back: t("Back to library", "العودة إلى المكتبة"),
  viewRequests: t("View requests", "عرض الطلبات"),
};

/** OV 02.10 — searching the official catalogue, not your own list. */
export interface SearchHit {
  name: Bi;
  meta: Bi;
  /** How you stand with the hotel, and the one thing to do about it. */
  state: "linked" | "none" | "pending";
}

export const librarySearch = {
  title: t("Search the hotel library", "البحث في مكتبة الفنادق"),
  body: t(
    "A hotel name, a city, or the official code Hoteliana uses.",
    "اسم فندق أو مدينة أو الرمز الرسمي الذي تستخدمه هوتيليانا."
  ),
  term: t("noor", "نور"),
  matches: t("{count} matches", "{count} نتائج"),
  matchesTitle: t("Matches", "النتائج"),
  hits: [
    {
      name: t("Al Noor Makkah Hotel", "فندق النور مكة"),
      meta: t("Makkah · 4 stars · linked to you", "مكة · ٤ نجوم · مرتبط بك"),
      state: "linked",
    },
    {
      name: t("Noor Al Madinah Suites", "أجنحة نور المدينة"),
      meta: t(
        "Madinah · 3 stars · not requested yet",
        "المدينة · ٣ نجوم · لم يُطلب بعد"
      ),
      state: "none",
    },
    {
      name: t("Al Noor Plaza Jeddah", "النور بلازا جدة"),
      meta: t(
        "Jeddah · 4 stars · request pending since 12 Sep",
        "جدة · ٤ نجوم · طلب قيد المراجعة منذ ١٢ سبتمبر"
      ),
      state: "pending",
    },
  ] as SearchHit[],
  linked: t("Linked", "مرتبط"),
  pending: t("Pending", "قيد المراجعة"),
  open: t("Open", "فتح"),
  request: t("Request access", "طلب الوصول"),
  viewRequest: t("View request", "عرض الطلب"),
  note: t(
    "Search reads the official catalogue, not your own list. A result you are not linked to still shows - opening it is how you ask for access.",
    "يقرأ البحث الدليل الرسمي لا قائمتك أنت. والنتيجة التي لست مرتبطًا بها تظهر أيضًا - وفتحها هو طريقة طلب الوصول إليها."
  ),
  close: t("Close", "إغلاق"),
};

/** One line of a filter group: what it is, and how many it holds. */
export interface FilterOption {
  label: Bi;
  count: Bi;
}

export interface FilterGroup {
  title: Bi;
  options: FilterOption[];
}

const o = (label: Bi, count: Bi): FilterOption => ({ label, count });

/** OV 02.9 — narrowing the library never changes what you are linked to. */
export const libraryFilter = {
  title: t("Filter the hotel library", "تصفية مكتبة الفنادق"),
  body: t(
    "Only hotels Hoteliana already works with appear here. Filtering never changes what you are linked to.",
    "لا يظهر هنا إلا الفنادق التي تعمل معها هوتيليانا بالفعل. والتصفية لا تغيّر ما أنت مرتبط به."
  ),
  groups: [
    {
      title: t("City", "المدينة"),
      options: [
        o(t("All cities", "كل المدن"), t("128 hotels", "١٢٨ فندقًا")),
        o(t("Makkah", "مكة"), t("64", "٦٤")),
        o(t("Madinah", "المدينة"), t("38", "٣٨")),
        o(t("Jeddah", "جدة"), t("18", "١٨")),
        o(t("Riyadh", "الرياض"), t("8", "٨")),
      ],
    },
    {
      title: t("Country", "الدولة"),
      options: [
        o(t("All countries", "كل الدول"), t("", "")),
        o(t("Saudi Arabia", "السعودية"), t("128", "١٢٨")),
        o(
          t("Other countries", "دول أخرى"),
          t("0 · nothing outside the kingdom yet", "٠ · لا شيء خارج المملكة بعد")
        ),
      ],
    },
    {
      title: t("Category", "التصنيف"),
      options: [
        o(t("Any category", "أي تصنيف"), t("", "")),
        o(t("5 stars", "٥ نجوم"), t("22", "٢٢")),
        o(t("4 stars", "٤ نجوم"), t("51", "٥١")),
        o(t("3 stars", "٣ نجوم"), t("44", "٤٤")),
        o(t("Unrated", "بلا تصنيف"), t("11", "١١")),
      ],
    },
    {
      title: t("Your relationship", "علاقتك"),
      options: [
        o(t("Everything", "الكل"), t("128", "١٢٨")),
        o(t("Linked to you", "مرتبط بك"), t("3", "٣")),
        o(t("Request pending", "طلب قيد المراجعة"), t("2", "٢")),
        o(t("Not requested yet", "لم يُطلب بعد"), t("123", "١٢٣")),
        o(t("Rejected", "مرفوض"), t("0", "٠")),
        o(t("Suspended", "موقوف"), t("0", "٠")),
      ],
    },
  ] as FilterGroup[],
  clear: t("Clear all", "مسح الكل"),
  apply: t("Apply · {count} hotels", "تطبيق · {count} فندقًا"),
};

/** OV 02.11 — your own hotels, by where their supply actually stands. */
export const myHotelsFilter = {
  title: t("Filter your hotels", "تصفية فنادقك"),
  body: t(
    "Your three linked hotels, by where their supply actually stands.",
    "فنادقك الثلاثة المرتبطة، بحسب موضع توريدها الفعلي."
  ),
  search: t("Search your hotels", "ابحث في فنادقك"),
  groups: [
    {
      title: t("Contract state", "حالة العقد"),
      options: [
        o(t("Everything", "الكل"), t("3 hotels", "٣ فنادق")),
        o(t("Selling", "يبيع"), t("1 · Al Noor Makkah", "١ · النور مكة")),
        o(
          t("Draft contract", "عقد مسودة"),
          t("1 · Rawdah Suites", "١ · أجنحة الروضة")
        ),
        o(
          t("No supply contract yet", "لا عقد توريد بعد"),
          t("1 · Central Haram", "١ · الحرم المركزي")
        ),
        o(
          t("Needs attention", "يحتاج انتباهًا"),
          t("1 · rates end in 14 days", "١ · الأسعار تنتهي خلال ١٤ يومًا")
        ),
      ],
    },
    {
      title: t("Rooms", "الغرف"),
      options: [
        o(t("Any", "أي"), t("", "")),
        o(t("Has rooms in the catalogue", "له غرف في الدليل"), t("3", "٣")),
        o(t("Waiting on a room request", "بانتظار طلب غرفة"), t("1", "١")),
      ],
    },
  ] as FilterGroup[],
  clear: t("Clear all", "مسح الكل"),
  apply: t("Apply · {count} hotel", "تطبيق · {count} فندق"),
};

/** OV 02.8C — a new hotel is with Hoteliana, and what becomes of it. */
export const hotelSubmitted = {
  overline: t("Hotel submitted", "أُرسل الفندق"),
  title: t("Hotel sent for Hoteliana review", "أُرسل الفندق لمراجعة هوتيليانا"),
  body: t(
    "Hoteliana checks duplicates, location and the details you entered before the hotel enters the library.",
    "تتحقق هوتيليانا من التكرار والموقع والتفاصيل التي أدخلتها قبل دخول الفندق المكتبة."
  ),
  stepsTitle: t("What happens next", "ما الذي يحدث بعد ذلك"),
  steps: [
    t(
      "Sent now - {images} images and {amenities} amenities attached",
      "أُرسل الآن - مرفق به {images} صور و{amenities} مرافق"
    ),
    t(
      "Hoteliana verifies the hotel (usually 3 working days)",
      "تتحقق هوتيليانا من الفندق (عادةً ٣ أيام عمل)"
    ),
    t(
      "Approved → the hotel appears in My Hotels, ready for its first supply contract",
      "عند الموافقة ← يظهر الفندق في «فنادقي» جاهزًا لأول عقد توريد"
    ),
  ],
  note: t(
    "If Hoteliana asks for corrections, the request shows “Needs you” in Requests and keeps its reference.",
    "إن طلبت هوتيليانا تصحيحات، يظهر الطلب بـ«يحتاجك» في الطلبات ويحتفظ بمرجعه."
  ),
  back: t("Back to library", "العودة إلى المكتبة"),
  viewRequests: t("View requests", "عرض الطلبات"),
};
