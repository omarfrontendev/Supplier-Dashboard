/**
 * Flow 04-W — the Win list. Flow 12 added it on 26 Sep.
 *
 * What it is, in the guide's words: the rooms and dates agents searched for
 * often and did not book from this supplier, with the price that would put
 * the supplier inside the cheapest three. Built automatically every Monday
 * at 06:00 Makkah time from the last seven days of searches — "no one at
 * Hoteliana writes it" (BR-04W-02).
 *
 * The hard boundary is BR-04W-06 and the scope note above it: **no competitor
 * names, no competitor prices, and no numeric ranking, ever**. Position is a
 * band — "Top 3", "Top 5", "Not in top 5" — and demand is a band too, never
 * the raw search count on a line (BR-04W-05).
 *
 * And BR-04W-11: nothing here ever moves a price by itself. Apply writes a
 * draft; the supplier still reviews and publishes it in Flow 04.
 */

export interface Bi {
  en: string;
  ar: string;
}

const t = (en: string, ar: string): Bi => ({ en, ar });

/** BR-04W-05 — demand is a band, never the search number, on a line. */
export type DemandBand = "high" | "medium";
/** BR-04W-06 — position is a band too. A numeric rank is forbidden. */
export type PositionBand = "top3" | "top5" | "outside";

export type LineState =
  | "open"
  | "draft"
  | "won"
  | "dismissed"
  | "expired";

export interface WinLine {
  id: string;
  hotel: Bi;
  room: Bi;
  board: Bi;
  dates: Bi;
  nights: number;
  demand: DemandBand;
  /** BR-04W-18 — the supplier's own bookings on that room and those dates. */
  yourBookings: number;
  position: PositionBand;
  /** BR-04W-07 — "540 or less", VAT included, for Everyone. */
  target: number;
  /** What the calendar sells today, for the comparison in OV 04.WA. */
  now: number;
  /** BR-04W-08 — a target under this never appears at all. */
  floor: number;
  state: LineState;
  /** A9 — a span with both weekday and weekend nights shows two rows. */
  weekend?: { nights: number; now: number } | undefined;
  weekdayNights?: number | undefined;
  /** A9 — nights already at or below the target are left alone. */
  alreadyBelow?: number | undefined;
  /** A10 / BR-04W-12 — a fixed nationality price keeps its own rule. */
  fixedNationality?: { name: Bi; price: number } | undefined;
  /** #12 — the same room sells under more than one contract on these dates. */
  contracts?: Array<{ name: Bi; now: number }> | undefined;
  /** A6 — an unpublished draft already covers some of these nights. */
  replacesDraft?: { nights: number; price: number } | undefined;
  /** E4 — Hoteliana paused the contract, so Apply is not offered. */
  paused?: boolean | undefined;
  /** E2 — the floor rose above the target after the list was built. */
  belowFloor?: boolean | undefined;
}

/** UI 04.W — the week the frames draw. */
export const winLines: WinLine[] = [
  {
    id: "WL-01",
    hotel: t("Al Noor Makkah Hotel", "فندق النور مكة"),
    room: t("Standard Room", "غرفة قياسية"),
    board: t("Room only", "بدون وجبات"),
    dates: t("12-20 Oct", "١٢-٢٠ أكتوبر"),
    nights: 9,
    demand: "high",
    yourBookings: 2,
    position: "outside",
    target: 540,
    now: 610,
    floor: 500,
    state: "open",
    weekdayNights: 7,
    weekend: { nights: 2, now: 710 },
    alreadyBelow: 2,
    fixedNationality: { name: t("Pakistan", "باكستان"), price: 790 },
  },
  {
    id: "WL-02",
    hotel: t("Al Noor Makkah Hotel", "فندق النور مكة"),
    room: t("Deluxe Room City View", "غرفة ديلوكس بإطلالة"),
    board: t("Bed & Breakfast", "مبيت وإفطار"),
    dates: t("24-27 Oct", "٢٤-٢٧ أكتوبر"),
    nights: 3,
    demand: "high",
    yourBookings: 0,
    position: "top5",
    target: 690,
    now: 760,
    floor: 620,
    state: "open",
  },
  {
    id: "WL-03",
    hotel: t("Central Haram Hotel", "فندق الحرم المركزي"),
    room: t("Twin Room", "غرفة مزدوجة"),
    board: t("Room only", "بدون وجبات"),
    dates: t("2-6 Nov", "٢-٦ نوفمبر"),
    nights: 4,
    demand: "medium",
    yourBookings: 1,
    position: "top5",
    target: 430,
    now: 470,
    floor: 390,
    state: "draft",
  },
  {
    id: "WL-04",
    hotel: t("Makkah Grand Suites", "أجنحة مكة الكبرى"),
    room: t("Family Suite", "جناح عائلي"),
    board: t("Bed & Breakfast", "مبيت وإفطار"),
    dates: t("9-13 Nov", "٩-١٣ نوفمبر"),
    nights: 4,
    demand: "medium",
    yourBookings: 0,
    position: "outside",
    target: 880,
    now: 980,
    floor: 800,
    state: "open",
    contracts: [
      { name: t("Makkah Rooms Block", "تكتلة غرف مكة"), now: 590 },
      { name: t("Makkah Annual Block", "التكتلة السنوية لمكة"), now: 610 },
    ],
  },
  {
    id: "WL-05",
    hotel: t("Central Haram Hotel", "فندق الحرم المركزي"),
    room: t("Standard Room", "غرفة قياسية"),
    board: t("Room only", "بدون وجبات"),
    dates: t("16-19 Nov", "١٦-١٩ نوفمبر"),
    nights: 3,
    demand: "medium",
    yourBookings: 0,
    position: "top5",
    target: 455,
    now: 505,
    floor: 420,
    state: "open",
    paused: true,
  },
  {
    id: "WL-06",
    hotel: t("Al Noor Makkah Hotel", "فندق النور مكة"),
    room: t("Deluxe Room City View", "غرفة ديلوكس بإطلالة"),
    board: t("Half Board", "نصف إقامة"),
    dates: t("23-26 Nov", "٢٣-٢٦ نوفمبر"),
    nights: 3,
    demand: "high",
    yourBookings: 0,
    position: "outside",
    target: 720,
    now: 815,
    floor: 640,
    state: "open",
    replacesDraft: { nights: 3, price: 560 },
  },
];

/** BR-04W-13 — the three settings, at account level. */
export type WinMode = "weekly" | "onAsk" | "off";

export const winCopy = {
  overline: t("RATES & AVAILABILITY", "الأسعار والإتاحة"),
  title: t("Win list", "قائمة الفرص"),
  cadence: t("Weekly · every Monday", "أسبوعيًا · كل اثنين"),
  /* The frame's own two sentences; the second is the promise that matters. */
  subtitle: t(
    "Rooms and dates where agents searched a lot but did not book with you, and the price that would put you among the 3 cheapest. We never show other suppliers or their prices. You decide - nothing changes until you publish.",
    "غرف وتواريخ بحث عنها الوكلاء كثيرًا ولم يحجزوها منك، والسعر الذي يضعك ضمن الأرخص ثلاثة. ولا نعرض أبدًا مورّدين آخرين ولا أسعارهم. القرار لك — ولا شيء يتغير حتى تنشر."
  ),
  settings: t("Settings", "الإعدادات"),
  backToRates: t("Back to rates", "العودة إلى الأسعار"),

  /* BR-04W-17 — the three tiles above the table. */
  demandKpi: t("DEMAND WITHOUT YOUR BOOKING", "طلب دون حجز منك"),
  demandValue: t("640", "٦٤٠"),
  demandNote: t("last 7 days · your {count} hotels", "آخر ٧ أيام · فنادقك الـ{count}"),
  linesKpi: t("LINES THIS WEEK", "سطور هذا الأسبوع"),
  linesNote: t("sent Mon 28 Sep, 06:00", "أُرسلت الاثنين ٢٨ سبتمبر، ٠٦:٠٠"),
  lastKpi: t("LAST LIST", "القائمة السابقة"),
  lastValue: t("2 of 5 applied", "طُبِّق ٢ من ٥"),
  lastNote: t("+ 5 bookings since", "+ ٥ حجوزات منذ ذلك"),

  /* The table the frame draws. */
  colHotel: t("HOTEL · ROOM", "الفندق · الغرفة"),
  colDates: t("DATES", "التواريخ"),
  colDemand: t("DEMAND", "الطلب"),
  colPosition: t("YOUR POSITION", "موقعك"),
  colTarget: t("TO BE IN THE 3 CHEAPEST", "لتكون ضمن الأرخص ٣"),
  apply: t("Apply", "تطبيق"),
  dismiss: t("Dismiss", "تجاهل"),
  review: t("Review & publish ›", "المراجعة والنشر ›"),
  orLess: t("{price} or less", "{price} أو أقل"),
  nowLine: t("now {price}", "الآن {price}"),
  yourBookings: t("{count} of your bookings", "{count} من حجوزاتك"),
  /* The blue panel under the table - the promise, stated once more. */
  builtAutomatically: t(
    "Built automatically from agent searches every Monday - no one at Hoteliana writes it. Your position is a band, never a rank number, a competitor name or a competitor price.",
    "تُبنى آليًا من بحث الوكلاء كل اثنين — ولا أحد في هوتيليانا يكتبها. وموقعك شريحة، وليس رقم ترتيب ولا اسم منافس ولا سعره."
  ),
  /* The grey note just above it. */
  disappearNote: t(
    "Never below your own minimum selling price · a line disappears after 7 days, when your price reaches the target (here or in the rate calendar), or when the room is sold out on those dates - sold-out dates are never suggested · Prices here are the price for everyone; in a season with nationality prices, those groups move with it by their own rules.",
    "لا تنزل تحت حدّك الأدنى للبيع · ويختفي السطر بعد ٧ أيام، أو عند بلوغ سعرك الهدف (هنا أو في تقويم الأسعار)، أو عند نفاد الغرفة في تلك التواريخ — والتواريخ النافدة لا تُقترح أبدًا · والأسعار هنا سعر الجميع؛ وفي موسم بأسعار جنسيات تتحرك تلك المجموعات معه بقواعدها."
  ),

  /* BR-04W-05 / 06 — bands, never numbers, never names. */
  high: t("High demand", "طلب مرتفع"),
  medium: t("Medium demand", "طلب متوسط"),
  top3: t("Top 3", "ضمن الأرخص ٣"),
  top5: t("Top 5", "ضمن الأرخص ٥"),
  outside: t("Not in top 5", "خارج الأرخص ٥"),

  /* State badges on a line. */
  draftCreated: t("Draft created", "أُنشئت مسودة"),
  pausedNote: t(
    "Hoteliana paused this contract - the new price sells once the pause is lifted.",
    "أوقفت هوتيليانا هذا العقد مؤقتًا — ويُباع السعر الجديد فور رفع الإيقاف."
  ),
  belowFloorNote: t(
    "This target is now below your minimum selling price ({floor}), so it can't be applied.",
    "صار هذا الهدف دون حدّك الأدنى للبيع ({floor})، فلا يمكن تطبيقه."
  ),

  /* A7 — a week with nothing to say. */
  emptyTitle: t("Nothing to suggest this week", "لا اقتراح هذا الأسبوع"),
  emptyBody: t(
    "Your prices are competitive where agents search.",
    "أسعارك منافسة حيث يبحث الوكلاء."
  ),
  /* #7 — every line has been answered. */
  doneTitle: t("You're done for this week", "انتهيت لهذا الأسبوع"),
  doneBody: t("{applied} applied · {dismissed} dismissed", "طُبِّق {applied} · تُجوهل {dismissed}"),

  /* UI 04.W1 — on request. */
  onRequest: t("On request", "عند الطلب"),
  noListTitle: t("No list yet", "لا قائمة بعد"),
  noListBody: t(
    "You asked for the Win list only when you need it. It takes a few seconds and uses the last 7 days of searches.",
    "طلبت قائمة الفرص عند حاجتك إليها فقط. تستغرق ثوانٍ قليلة وتستخدم آخر ٧ أيام من البحث."
  ),
  getNow: t("Get my list now", "أعطني القائمة الآن"),
  building: t("Building your list…", "نبني قائمتك…"),
  askedToday: t(
    "Built today at {time} · you can ask again tomorrow.",
    "بُنيت اليوم في {time} · ويمكنك الطلب مرة أخرى غدًا."
  ),
  /* #3 — a week of searches has not happened yet. */
  newAccount: t(
    "Your first list comes on Monday once there is a week of searches.",
    "تأتي قائمتك الأولى يوم الاثنين متى اكتمل أسبوع من البحث."
  ),

  /* UI 04.W0 — off. */
  off: t("Off", "موقوفة"),
  offTitle: t("The Win list is off", "قائمة الفرص موقوفة"),
  offBody: t(
    "You switched the Win list off on 14 Sep. We keep counting searches, so it is ready the moment you turn it on.",
    "أوقفت قائمة الفرص في ١٤ سبتمبر. ونحن نواصل عدّ عمليات البحث، فتكون جاهزة لحظة تشغيلك إياها."
  ),
  turnOn: t("Turn it on", "شغّلها"),

  /* BR-04W-19 — no live contract, no list. */
  noContractTitle: t("No live contract yet", "لا عقد حيّ بعد"),
  noContractBody: t(
    "The Win list starts once you have a live contract.",
    "تبدأ قائمة الفرص متى كان لديك عقد حيّ."
  ),
  openContracts: t("Open contracts", "افتح العقود"),

  /* E5 — BR-00-21 removes the buttons; this line says who can. */
  cannotApply: t(
    "Only someone who can change prices can apply these lines.",
    "من يملك تغيير الأسعار وحده يستطيع تطبيق هذه السطور."
  ),
  /* E6 — the build failed. */
  buildFailed: t(
    "We couldn't build your list. Try again in a few minutes.",
    "تعذّر بناء قائمتك. حاول مرة أخرى بعد دقائق."
  ),
  tryAgain: t("Try again", "حاول مرة أخرى"),
} as const;

/** OV 04.WA — Apply a line as a draft. */
export const applyOverlay = {
  title: t("Apply {price} SAR as a draft?", "تطبيق {price} ريالًا كمسودة؟"),
  body: t(
    "We add it to your rate calendar as a draft. Nothing changes for agents until you review and publish.",
    "نضيفه إلى تقويم أسعارك كمسودة. ولا يتغير شيء لدى الوكلاء حتى تراجع وتنشر."
  ),
  now: t("Now", "الآن"),
  draft: t("Draft", "مسودة"),
  minimum: t("Your minimum", "حدّك الأدنى"),
  respected: t("respected", "محفوظ"),
  weekday: t("weekday", "يوم أسبوع"),
  weekdays: t("Weekdays ({count} nights)", "أيام الأسبوع ({count} ليالٍ)"),
  weekendNights: t("Weekend ({count} nights)", "نهاية الأسبوع ({count} ليلتان)"),
  alreadyBelow: t(
    "{count} nights are already at or below {price} and stay as they are.",
    "{count} ليالٍ عند {price} أو دونه بالفعل وتبقى كما هي."
  ),
  /* BR-04W-12 — a nationality group keeps its own rule. */
  nationalityNote: t(
    "Prices here are the price for everyone; in a season with nationality prices, those groups move with it by their own rules.",
    "الأسعار هنا هي سعر الجميع؛ وفي موسم بأسعار جنسيات، تتحرك تلك المجموعات معه بقواعدها."
  ),
  fixedKeeps: t(
    "{name} keeps its fixed season price ({price}).",
    "تحتفظ {name} بسعر موسمها الثابت ({price})."
  ),
  /* #12 — the room sells under more than one contract on these dates. */
  whichContract: t("Which contract", "أي عقد"),
  /* A6 — an unpublished draft already covers some of these nights. */
  replaces: t(
    "{count} of these nights already have an unpublished change ({price}). Creating this draft replaces it.",
    "{count} من هذه الليالي عليها تغيير غير منشور ({price}). وإنشاء هذه المسودة يستبدله."
  ),
  /* E1 — the price moved since the list was built. */
  alreadyThere: t(
    "Your price is already {price} - at or below the target. Nothing to apply.",
    "سعرك {price} بالفعل — عند الهدف أو دونه. لا شيء لتطبيقه."
  ),
  close: t("Close", "إغلاق"),
  /* E7 — the draft could not be written. */
  failed: t("We couldn't create the draft. Nothing changed.", "تعذّر إنشاء المسودة. ولم يتغير شيء."),
  /* E8 — someone else applied this line first. */
  taken: t(
    "This line was already applied by {who} at {time} - see the draft in Rates & Availability.",
    "طبّق {who} هذا السطر في {time} — انظر المسودة في الأسعار والإتاحة."
  ),
  openRates: t("Open rates", "افتح الأسعار"),
  cancel: t("Cancel", "إلغاء"),
  create: t("Create draft", "إنشاء مسودة"),
  toast: t(
    "Win list: {price} on {room} · {dates} saved as a draft. Nothing is live until you publish.",
    "قائمة الفرص: {price} على {room} · {dates} حُفظت مسودة. ولا شيء حيّ حتى تنشر."
  ),
} as const;

/** OV 04.WD — Dismiss a line, with an optional reason. */
export const dismissOverlay = {
  title: t("Dismiss this line?", "تجاهل هذا السطر؟"),
  body: t(
    "It disappears from this week's list. Telling us why is optional and helps us send better lines.",
    "يختفي من قائمة هذا الأسبوع. وإخبارنا بالسبب اختياري ويساعدنا على إرسال سطور أفضل."
  ),
  reasons: [
    t("Price is already at my floor", "السعر عند حدّي الأدنى بالفعل"),
    t("Rooms are sold elsewhere", "الغرف مبيعة في مكان آخر"),
    t("Not interested for these dates", "غير مهتم بهذه التواريخ"),
    t("Other", "سبب آخر"),
  ],
  otherPlaceholder: t("Tell us in a line", "أخبرنا في سطر"),
  cancel: t("Cancel", "إلغاء"),
  confirm: t("Dismiss", "تجاهل"),
  toast: t("Line dismissed.", "تُجوهل السطر."),
  undo: t("Undo", "تراجع"),
} as const;

/** OV 04.WS — how often the list arrives. */
export const settingsOverlay = {
  title: t("Win list settings", "إعدادات قائمة الفرص"),
  body: t(
    "It only changes what we send you - your prices never change on their own.",
    "لا يغيّر هذا إلا ما نرسله إليك — ولا تتغير أسعارك من تلقاء نفسها."
  ),
  options: [
    {
      value: "weekly" as WinMode,
      label: t("Every week", "كل أسبوع"),
      note: t(
        "In the portal and by email at 06:00 on Monday.",
        "في البوابة وبالبريد في الساعة ٠٦:٠٠ يوم الاثنين."
      ),
    },
    {
      value: "onAsk" as WinMode,
      label: t("Only when I ask", "عند طلبي فقط"),
      note: t(
        "Nothing is sent on its own - a “Get my list” button instead.",
        "لا يُرسل شيء من تلقائه — بل زرّ «أعطني القائمة»."
      ),
    },
    {
      value: "off" as WinMode,
      label: t("Off", "موقوفة"),
      note: t(
        "No list, no emails. We keep counting searches, so it is ready the moment you turn it on.",
        "لا قائمة ولا رسائل. ونواصل عدّ عمليات البحث، فتكون جاهزة لحظة تشغيلك إياها."
      ),
    },
  ],
  cancel: t("Cancel", "إلغاء"),
  save: t("Done", "تم"),
} as const;
