/**
 * The panels that open over the contract list — Figma OV 03.0D through
 * OV 03.0M and OV 03.23B. Each one is data: an overline, a title, the
 * lines it lists and the two buttons at its foot.
 */

export interface PanelOption {
  label: string;
  labelAr: string;
  hint?: string;
  hintAr?: string;
  count?: string;
  countAr?: string;
}

export interface ListPanel {
  overline: string;
  overlineAr: string;
  title: string;
  titleAr: string;
  body?: string;
  bodyAr?: string;
  groups: Array<{
    label?: string;
    labelAr?: string;
    options: PanelOption[];
  }>;
  note: string;
  noteAr: string;
  cancel: string;
  cancelAr: string;
  confirm: string;
  confirmAr: string;
}

/** OV 03.0G — what the Need attention filter offers. */
export const attentionPanel: ListPanel = {
  overline: "NEED ATTENTION · 3 CONTRACTS",
  overlineAr: "يحتاج انتباهك · ٣ عقود",
  title: "Pick what to show",
  titleAr: "اختر ما تريد عرضه",
  groups: [
    {
      options: [
        {
          label: "Expiring soon",
          labelAr: "قارب على الانتهاء",
          hint: "Umrah Q3 ends in 14 days",
          hintAr: "عمرة الربع الثالث ينتهي خلال ١٤ يومًا",
          count: "1",
          countAr: "١",
        },
        {
          label: "Unpublished changes",
          labelAr: "تعديلات غير منشورة",
          hint: "Makkah Annual Block · 2 held",
          hintAr: "حصة مكة السنوية · تعديلان محجوزان",
          count: "1",
          countAr: "١",
        },
        {
          label: "Sold-out nights",
          labelAr: "ليالٍ نفدت",
          hint: "Makkah Annual Block · 14 Sep",
          hintAr: "حصة مكة السنوية · ١٤ سبتمبر",
          count: "1",
          countAr: "١",
        },
        {
          label: "On Request auto-rejected",
          labelAr: "طلبات رُفضت تلقائيًا",
          hint: "Umrah Q3 · 42 min overdue",
          hintAr: "عمرة الربع الثالث · تأخّر ٤٢ دقيقة",
          count: "1",
          countAr: "١",
        },
        {
          label: "Stock ≤ 2 left",
          labelAr: "المخزون ٢ أو أقل",
          hint: "Umrah Q3 · Deluxe City View · 2 nights",
          hintAr: "عمرة الربع الثالث · ديلوكس إطلالة المدينة · ليلتان",
          count: "2",
          countAr: "٢",
        },
      ],
    },
  ],
  note: "",
  noteAr: "",
  cancel: "Cancel",
  cancelAr: "إلغاء",
  confirm: "Show these 3",
  confirmAr: "اعرض هذه الثلاثة",
};

/** OV 03.0L — by the period the contract covers, not when it was made. */
export const periodPanel: ListPanel = {
  overline: "",
  overlineAr: "",
  title: "Which contracts do you want to see",
  titleAr: "أي العقود تريد أن ترى",
  body: "By the period the contract covers - not by when it was created.",
  bodyAr: "حسب الفترة التي يغطّيها العقد - لا حسب وقت إنشائه.",
  groups: [
    {
      label: "PERIOD COVERED",
      labelAr: "الفترة المغطّاة",
      options: [
        {
          label: "Everything",
          labelAr: "كل شيء",
          hint: "8 contracts",
          hintAr: "٨ عقود",
        },
        {
          label: "Covering today",
          labelAr: "تغطّي اليوم",
          hint: "3 · what is selling right now",
          hintAr: "٣ · ما يُباع الآن",
        },
        {
          label: "Starting in the next 90 days",
          labelAr: "تبدأ خلال ٩٠ يومًا",
          hint: "2",
          hintAr: "٢",
        },
        {
          label: "Ending in the next 90 days",
          labelAr: "تنتهي خلال ٩٠ يومًا",
          hint: "1 · renew or extend",
          hintAr: "١ · جدّد أو مدّد",
        },
        {
          label: "Already over",
          labelAr: "انتهت بالفعل",
          hint: "2 · read only",
          hintAr: "٢ · للقراءة فقط",
        },
        {
          label: "A date range you pick",
          labelAr: "نطاق تواريخ تختاره",
        },
      ],
    },
    {
      label: "ORDER",
      labelAr: "الترتيب",
      options: [
        {
          label: "Ending soonest",
          labelAr: "الأقرب انتهاءً",
          hint: "the one that needs you first",
          hintAr: "الذي يحتاجك أولًا",
        },
        { label: "Newest first", labelAr: "الأحدث أولًا" },
        { label: "Hotel name", labelAr: "اسم الفندق" },
      ],
    },
  ],
  note: "A contract that is over never disappears. It moves out of the default view, keeps its versions, and stays reachable - the bookings it sold outlive it.",
  noteAr:
    "العقد المنتهي لا يختفي أبدًا. يخرج من العرض الافتراضي، ويحتفظ بإصداراته، ويظل قابلًا للوصول - فالحجوزات التي باعها تبقى بعده.",
  cancel: "Clear",
  cancelAr: "مسح",
  confirm: "Apply · 8 contracts",
  confirmAr: "تطبيق · ٨ عقود",
};

/** OV 03.23B — the On Request queue, ordered by the SLA clock. */
export const queuePanel: ListPanel = {
  overline: "",
  overlineAr: "",
  title: "Filter the On Request queue",
  titleAr: "تصفية طابور الطلبات",
  body: "What is waiting on you, and how soon it expires.",
  bodyAr: "ما ينتظر ردّك، وكم بقي له.",
  groups: [
    {
      label: "ROOM",
      labelAr: "الغرفة",
      options: [
        {
          label: "All rooms",
          labelAr: "كل الغرف",
          hint: "6 requests",
          hintAr: "٦ طلبات",
        },
        { label: "Standard Room", labelAr: "غرفة ستاندرد", hint: "3", hintAr: "٣" },
        {
          label: "Deluxe City View",
          labelAr: "ديلوكس إطلالة المدينة",
          hint: "2",
          hintAr: "٢",
        },
        {
          label: "Deluxe Partial Haram View",
          labelAr: "ديلوكس إطلالة جزئية على الحرم",
          hint: "1",
          hintAr: "١",
        },
        { label: "Junior Suite", labelAr: "جناح جونيور", hint: "0", hintAr: "٠" },
      ],
    },
    {
      label: "STAY DATE",
      labelAr: "تاريخ الإقامة",
      options: [
        { label: "Any stay date", labelAr: "أي تاريخ إقامة" },
        {
          label: "Arriving in the next 7 nights",
          labelAr: "وصول خلال ٧ ليالٍ",
          hint: "4",
          hintAr: "٤",
        },
        {
          label: "Arriving this month",
          labelAr: "وصول هذا الشهر",
          hint: "6",
          hintAr: "٦",
        },
        { label: "A date range you pick", labelAr: "نطاق تواريخ تختاره" },
      ],
    },
    {
      label: "ORDER",
      labelAr: "الترتيب",
      options: [
        {
          label: "Expiring soonest",
          labelAr: "الأقرب انتهاءً",
          hint: "the SLA clock, not the booking date",
          hintAr: "ساعة المهلة، لا تاريخ الحجز",
        },
        { label: "Newest request first", labelAr: "الأحدث طلبًا أولًا" },
        { label: "Highest value first", labelAr: "الأعلى قيمة أولًا" },
      ],
    },
  ],
  note: "The queue is ordered by the SLA clock by default on purpose - a request that expires is auto-rejected, its held rooms go back to you, and nobody wins that.",
  noteAr:
    "الطابور مرتّب بساعة المهلة افتراضيًا عن قصد - فالطلب الذي تنتهي مهلته يُرفض تلقائيًا، وتعود غرفه المحجوزة إليك، ولا أحد يربح من ذلك.",
  cancel: "Clear",
  cancelAr: "مسح",
  confirm: "Apply · 6 requests",
  confirmAr: "تطبيق · ٦ طلبات",
};

export interface ConfirmPanel {
  overline: string;
  overlineAr: string;
  title: string;
  titleAr: string;
  body: string;
  bodyAr: string;
  /** OV 03.0D / 03.18 / 03.21 list what the action does before it is taken. */
  listLabel?: string;
  listLabelAr?: string;
  points?: Array<{ text: string; textAr: string }>;
  fields?: Array<{
    label: string;
    labelAr: string;
    value: string;
    valueAr: string;
  }>;
  cancel: string;
  cancelAr: string;
  confirm: string;
  confirmAr: string;
  /** The tile beside the title. */
  tone: "brand" | "danger";
  /** What the confirm button is, which is not always the same thing. */
  confirmTone?: "default" | "destructive" | "warning";
}

/** OV 03.0D — stop sale across the whole contract. */
export const stopSellPanel: ConfirmPanel = {
  overline: "MAKKAH ANNUAL BLOCK · ACTIVE",
  overlineAr: "حصة مكة السنوية · نشط",
  title: "Stop sale on the whole contract?",
  titleAr: "إيقاف البيع على العقد كله؟",
  body: "Every night in the chosen range stops selling. The contract stays Active.",
  bodyAr: "تتوقف كل ليلة في النطاق المختار عن البيع. ويبقى العقد نشطًا.",
  fields: [
    {
      label: "From",
      labelAr: "من",
      value: "Today · 15 Sep 2026",
      valueAr: "اليوم · ١٥ سبتمبر ٢٠٢٦",
    },
    {
      label: "To",
      labelAr: "إلى",
      value: "31 Aug 2027 · end of contract",
      valueAr: "٣١ أغسطس ٢٠٢٧ · نهاية العقد",
    },
  ],
  listLabel: "WHAT STOP SALE MEANS",
  listLabelAr: "ماذا يعني إيقاف البيع",
  points: [
    {
      text: "Agents cannot book any night in the range - the contract stays Active and visible.",
      textAr:
        "لا يستطيع الوكلاء حجز أي ليلة في النطاق - ويبقى العقد نشطًا وظاهرًا.",
    },
    {
      text: "The 23 confirmed bookings are untouched; nothing is cancelled or re-priced.",
      textAr: "الحجوزات المؤكدة الـ٢٣ لا تُمسّ؛ ولا يُلغى شيء ولا يُعاد تسعيره.",
    },
    {
      text: "On Request bookings already in the queue keep their SLA; new requests are blocked.",
      textAr:
        "الطلبات الموجودة في الطابور تحتفظ بمهلتها؛ والطلبات الجديدة موقوفة.",
    },
    {
      text: "Reversible any time from the contract or the row menu. Pause is different: it hides the contract entirely.",
      textAr:
        "قابل للتراجع في أي وقت من العقد أو من قائمة الصف. والإيقاف المؤقت مختلف: فهو يخفي العقد كليًا.",
    },
  ],
  cancel: "Cancel",
  cancelAr: "إلغاء",
  confirm: "Stop sale",
  confirmAr: "إيقاف البيع",
  tone: "danger",
  confirmTone: "default",
};

/** OV 03.0I — a draft was never published, so nothing changes for agents. */
export const deleteDraftPanel: ConfirmPanel = {
  overline: "DRAFT · MADINAH WINTER",
  overlineAr: "مسودة · شتاء المدينة",
  title: "Delete the draft “Madinah Winter”?",
  titleAr: "هل تحذف مسودة «شتاء المدينة»؟",
  body: "It was never published, so nothing changes for agents. The hotel and its rooms stay linked; only this draft is removed.",
  bodyAr:
    "لم تُنشر قط، فلا يتغيّر شيء للوكلاء. ويبقى الفندق وغرفه مرتبطين؛ وتُحذف هذه المسودة وحدها.",
  cancel: "Keep draft",
  cancelAr: "الاحتفاظ بالمسودة",
  confirm: "Delete draft",
  confirmAr: "حذف المسودة",
  tone: "danger",
  confirmTone: "destructive",
};

/** OV 03.0J — resume puts every night back exactly as it was. */
export const resumePanel: ConfirmPanel = {
  overline: "PAUSED · MADINAH HAJJ BLOCK",
  overlineAr: "موقوف · حصة حج المدينة",
  title: "Resume “Madinah Hajj Block”?",
  titleAr: "هل تستأنف «حصة حج المدينة»؟",
  body: "Every night returns to exactly the state it had before the pause - prices, stock and stop-sells included. Agents see the contract again immediately; existing bookings were never affected.",
  bodyAr:
    "تعود كل ليلة إلى حالتها تمامًا قبل الإيقاف - الأسعار والمخزون وإيقاف البيع. ويرى الوكلاء العقد فورًا؛ والحجوزات القائمة لم تتأثر أصلًا.",
  cancel: "Keep paused",
  cancelAr: "إبقاؤه موقوفًا",
  confirm: "Resume contract",
  confirmAr: "استئناف العقد",
  tone: "brand",
};

/* ------------------------------------------------------------------ */
/* Create-contract panels — Figma OV 03.1P through OV 03.13.           */
/* ------------------------------------------------------------------ */

export interface PickerOption {
  label: string;
  labelAr: string;
  hint: string;
  hintAr: string;
}

export interface PickerPanel {
  overline: string;
  overlineAr: string;
  title: string;
  titleAr: string;
  body: string;
  bodyAr: string;
  options: PickerOption[];
  note?: string;
  noteAr?: string;
  cancel: string;
  cancelAr: string;
  confirm: string;
  confirmAr: string;
}

const STEP_ONE = "CONTRACT BASICS · STEP 1";
const STEP_ONE_AR = "أساسيات العقد · الخطوة ١";

/** OV 03.1P — a contract belongs to one linked hotel. */
export const hotelPickerPanel: PickerPanel = {
  overline: STEP_ONE,
  overlineAr: STEP_ONE_AR,
  title: "Choose an approved hotel",
  titleAr: "اختر فندقًا معتمدًا",
  body: "Only hotels linked in My Hotels can be contracted. Each contract belongs to one hotel.",
  bodyAr:
    "الفنادق المرتبطة في «فنادقي» وحدها يمكن التعاقد عليها. وكل عقد يخص فندقًا واحدًا.",
  options: [
    {
      label: "Al Noor Makkah Hotel",
      labelAr: "فندق النور مكة",
      hint: "Makkah · 4★ Official · 1 active contract",
      hintAr: "مكة · ٤★ رسمي · عقد نشط واحد",
    },
    {
      label: "Central Haram Hotel",
      labelAr: "فندق الحرم المركزي",
      hint: "Makkah · 5★ Official · 2 contracts",
      hintAr: "مكة · ٥★ رسمي · عقدان",
    },
    {
      label: "Rawdah Suites",
      labelAr: "أجنحة الروضة",
      hint: "Madinah · 4★ Official · 1 paused",
      hintAr: "المدينة · ٤★ رسمي · واحد موقوف",
    },
  ],
  note: "Al Safa City, Jabal View and Palm District are not linked yet - request access from Hotel Library first.",
  noteAr:
    "الصفا سيتي وجبل فيو وبالم ديستركت غير مرتبطة بعد - اطلب الوصول من مكتبة الفنادق أولًا.",
  cancel: "Open Hotel Library",
  cancelAr: "فتح مكتبة الفنادق",
  confirm: "Use this hotel",
  confirmAr: "استخدم هذا الفندق",
};

/** OV 03.1R — one currency for every price in the contract. */
export const currencyPanel: PickerPanel = {
  overline: STEP_ONE,
  overlineAr: STEP_ONE_AR,
  title: "Contract currency",
  titleAr: "عملة العقد",
  body: "Every price in this contract uses one currency. It locks after the first confirmed booking - change it later only through Amend contract.",
  bodyAr:
    "كل سعر في هذا العقد بعملة واحدة. وتُقفل بعد أول حجز مؤكد - ولا تتغير بعدها إلا بتعديل تعاقدي.",
  options: [
    {
      label: "SAR · Saudi Riyal",
      labelAr: "SAR · ريال سعودي",
      hint: "Settlement currency of your Hoteliana agreement",
      hintAr: "عملة التسوية في اتفاقيتك مع هوتيليانا",
    },
    {
      label: "USD · US Dollar",
      labelAr: "USD · دولار أمريكي",
      hint: "Converted at Hoteliana’s daily rate for settlement",
      hintAr: "يُحوَّل بسعر هوتيليانا اليومي عند التسوية",
    },
    {
      label: "EUR · Euro",
      labelAr: "EUR · يورو",
      hint: "Converted at Hoteliana’s daily rate for settlement",
      hintAr: "يُحوَّل بسعر هوتيليانا اليومي عند التسوية",
    },
  ],
  cancel: "Cancel",
  cancelAr: "إلغاء",
  confirm: "Use SAR",
  confirmAr: "استخدم SAR",
};

/** OV 03.1Q / Q2 / Q3 — the term, and the two ways it can go wrong. */
export const termPanel = {
  overline: STEP_ONE,
  overlineAr: STEP_ONE_AR,
  title: "Contract term",
  titleAr: "مدة العقد",
  body: "Start and end dates. Every night in between must belong to the base rate or a season.",
  bodyAr:
    "تاريخا البداية والنهاية. وكل ليلة بينهما يجب أن تخص السعر الأساسي أو موسمًا.",
  startLabel: "Start date",
  startLabelAr: "تاريخ البداية",
  startValue: "01 Sep 2026",
  startValueAr: "١ سبتمبر ٢٠٢٦",
  endLabel: "End date",
  endLabelAr: "تاريخ النهاية",
  endValue: "31 Aug 2027",
  endValueAr: "٣١ أغسطس ٢٠٢٧",
  badEndValue: "15 Aug 2026",
  badEndValueAr: "١٥ أغسطس ٢٠٢٦",
  /** The dates each preset fills in, from the contract's own seasons. */
  presets: [
    { label: "12 months", labelAr: "١٢ شهرًا", months: 12 },
    {
      label: "Ramadan 1448",
      labelAr: "رمضان ١٤٤٨",
      start: "2027-02-18",
      end: "2027-03-19",
    },
    {
      label: "Hajj 1448",
      labelAr: "حج ١٤٤٨",
      start: "2027-05-13",
      end: "2027-05-20",
    },
    {
      label: "Summer 2027",
      labelAr: "صيف ٢٠٢٧",
      start: "2027-07-01",
      end: "2027-08-31",
    },
  ] as Array<{
    label: string;
    labelAr: string;
    months?: number;
    start?: string;
    end?: string;
  }>,
  note: "{nights} nights · Thu · Fri weekends · the term locks after the first confirmed booking (Amend to change).",
  noteAr:
    "{nights} ليلة · نهاية الأسبوع الخميس والجمعة · وتُقفل المدة بعد أول حجز مؤكد (تُغيَّر بتعديل تعاقدي).",
  error: "End date must be after the start date.",
  errorAr: "يجب أن يكون تاريخ النهاية بعد تاريخ البداية.",
  errorNote: "Fix the dates first - the term can’t end before it starts",
  errorNoteAr: "صحّح التواريخ أولًا - لا يمكن أن تنتهي المدة قبل أن تبدأ",
  overlapTitle: "An active contract already overlaps these dates",
  overlapTitleAr: "يتداخل عقد نشط مع هذه التواريخ بالفعل",
  overlapBody:
    "Makkah Annual Block · 01 Sep 2026 - 31 Aug 2027 at Al Noor Makkah Hotel. Two contracts can overlap; agents see both. Continue only if that is intended.",
  overlapBodyAr:
    "حصة مكة السنوية · ١ سبتمبر ٢٠٢٦ - ٣١ أغسطس ٢٠٢٧ في فندق النور مكة. يمكن أن يتداخل عقدان، ويرى الوكلاء كليهما. تابع فقط إن كان ذلك مقصودًا.",
  cancel: "Cancel",
  cancelAr: "إلغاء",
  confirm: "Confirm term",
  confirmAr: "تأكيد المدة",
  confirmOverlap: "Continue anyway",
  confirmOverlapAr: "تابع على أي حال",
};

/** OV 03.1S — the nights that carry the weekend price. */
export const weekendPanel = {
  overline: STEP_ONE,
  overlineAr: STEP_ONE_AR,
  title: "Weekend days",
  titleAr: "أيام نهاية الأسبوع",
  body: "Weekend prices apply to the nights of these days. Everything else is a weekday.",
  bodyAr: "تنطبق أسعار نهاية الأسبوع على ليالي هذه الأيام. وما عداها أيام أسبوع.",
  days: [
    { label: "Sat", labelAr: "السبت" },
    { label: "Sun", labelAr: "الأحد" },
    { label: "Mon", labelAr: "الاثنين" },
    { label: "Tue", labelAr: "الثلاثاء" },
    { label: "Wed", labelAr: "الأربعاء" },
    { label: "Thu", labelAr: "الخميس" },
    { label: "Fri", labelAr: "الجمعة" },
  ],
  selected: ["Thu", "Fri"],
  note: "Thu · Fri selected - the Saudi weekend. Seasons and restrictions can still target single weekdays.",
  noteAr:
    "الخميس والجمعة مختاران - نهاية الأسبوع السعودية. ويمكن للمواسم والقيود استهداف أيام مفردة.",
  cancel: "Cancel",
  cancelAr: "إلغاء",
  confirm: "Save weekend",
  confirmAr: "حفظ نهاية الأسبوع",
};

/** OV 03.11 — nothing is live yet, so a draft keeps the work. */
export const unsavedPanel = {
  overline: "LEAVING THE CONTRACT",
  overlineAr: "مغادرة العقد",
  title: "Save this draft before you leave?",
  titleAr: "هل تحفظ هذه المسودة قبل أن تغادر؟",
  body: "Nothing is live yet. A draft keeps everything you entered and shows in the list as Draft.",
  bodyAr: "لا شيء يعمل بعد. والمسودة تحفظ كل ما أدخلته وتظهر في القائمة كمسودة.",
  discard: "Discard",
  discardAr: "تجاهل",
  keep: "Keep editing",
  keepAr: "متابعة التحرير",
  save: "Save draft & leave",
  saveAr: "حفظ المسودة والمغادرة",
};

export type OverlapDay = "ramadan" | "overlap" | "locked" | "free";

/** OV 03.13 — a night can sit in one season only. */
export const overlapPanel = {
  overline: "DATES OVERLAP · CAN’T SAVE",
  overlineAr: "تداخل التواريخ · لا يمكن الحفظ",
  title: "5 nights already belong to “Last ten nights”",
  titleAr: "٥ ليالٍ تخص «العشر الأواخر» بالفعل",
  body: "A night can sit in one season only. You picked 18 Feb - 14 Mar 2027 for Ramadan, but 10 - 14 Mar are part of Last ten nights (10 - 19 Mar). Choose dates that don’t touch another season.",
  bodyAr:
    "الليلة تخص موسمًا واحدًا فقط. اخترت ١٨ فبراير - ١٤ مارس ٢٠٢٧ لرمضان، لكن ١٠ - ١٤ مارس جزء من العشر الأواخر (١٠ - ١٩ مارس). اختر تواريخ لا تلامس موسمًا آخر.",
  month: "March 2027",
  monthAr: "مارس ٢٠٢٧",
  picked: "Ramadan picked 18 Feb - 14 Mar",
  pickedAr: "رمضان مختار ١٨ فبراير - ١٤ مارس",
  weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  weekdaysAr: ["إث", "ثل", "أر", "خم", "جم", "سب", "أح"],
  /** 1 - 9 are Ramadan, 10 - 14 overlap, 15 - 19 belong to Last ten nights. */
  dayKind: (night: number): OverlapDay =>
    night <= 9
      ? "ramadan"
      : night <= 14
        ? "overlap"
        : night <= 19
          ? "locked"
          : "free",
  dayLabel: {
    ramadan: "Ramadan",
    overlap: "Overlap",
    locked: "Locked",
    free: "",
  } as Record<OverlapDay, string>,
  dayLabelAr: {
    ramadan: "رمضان",
    overlap: "تداخل",
    locked: "مقفل",
    free: "",
  } as Record<OverlapDay, string>,
  legend: [
    { label: "Ramadan · your dates", labelAr: "رمضان · تواريخك", kind: "ramadan" },
    { label: "Overlap · blocked", labelAr: "تداخل · ممنوع", kind: "overlap" },
    { label: "Another season · locked", labelAr: "موسم آخر · مقفل", kind: "locked" },
    { label: "Free", labelAr: "متاح", kind: "free" },
  ] as Array<{ label: string; labelAr: string; kind: OverlapDay }>,
  fixLabel: "HOW TO FIX IT",
  fixLabelAr: "كيف تصلحه",
  fixes: [
    {
      title: "End Ramadan on 09 Mar",
      titleAr: "أنهِ رمضان في ٩ مارس",
      body: "Back to 18 Feb - 09 Mar · 20 nights - the nearest free range",
      bodyAr: "العودة إلى ١٨ فبراير - ٩ مارس · ٢٠ ليلة - أقرب نطاق متاح",
      action: "Use these dates →",
      actionAr: "استخدم هذه التواريخ ←",
    },
    {
      title: "Move Last ten nights instead",
      titleAr: "حرّك العشر الأواخر بدلًا من ذلك",
      body: "Open that season and change its start date first, then come back",
      bodyAr: "افتح ذلك الموسم وغيّر تاريخ بدايته أولًا ثم عُد",
      action: "Open season →",
      actionAr: "افتح الموسم ←",
    },
  ],
  note: "Save stays off until no night overlaps.",
  noteAr: "يبقى الحفظ معطّلًا حتى تختفي كل ليلة متداخلة.",
  cancel: "Back to dates",
  cancelAr: "العودة إلى التواريخ",
  confirm: "Save season",
  confirmAr: "حفظ الموسم",
};
