/**
 * Rates & Availability — the September 2026 grid Figma UI 04.1 draws for
 * the Makkah Annual Block contract. Thirty nights, a shared contract pool
 * and nine offer rows, each with a rate, inventory, status, restriction
 * and release line.
 */

export const GRID_MONTH = "SEPTEMBER 2026";
export const GRID_MONTH_AR = "سبتمبر ٢٠٢٦";
export const GRID_NIGHTS = 30;
/** 1 Sep 2026 is a Tuesday. */
export const GRID_FIRST_WEEKDAY = 2;
/** Thursday and Friday, per the contract's weekend days. */
export const WEEKEND_DAYS = [4, 5];
export const TODAY_NIGHT = 20;

export const POOL_LEFT = [
  30, 28, 26, 19, 17, 32, 31, 29, 27, 12, 9, 25, 28, 26, 24, 22, 6, 3, 20, 21,
  17, 15, 10, 2, 0, 16, 20, 22, 23, 24,
];

/*
 * The contract's restrictions, night by night: two nights minimum across
 * September, four on 20 - 25 Sep, and no check-in on the 23rd. It had run
 * the four-night rule to the 26th and closed check-in on the 24th, which
 * is a day out from the rule the contract states - and the contract is
 * what an agent is held to.
 */
export const MIN_NIGHTS = [
  "2", "2", "2", "2", "2", "2", "2", "2", "2", "2", "2", "2", "2", "2", "2",
  "2", "2", "2", "2", "4", "4", "4", "no in", "4", "4", "2", "2", "2", "2", "2",
];

export interface GridRow {
  /** Offer label, e.g. "Standard Room · City View". */
  name: string;
  nameAr: string;
  /** The line under the offer name. */
  meta: string;
  metaAr: string;
  base?: boolean;
  /** Supplement on the base room, used to rebuild fixed-price lines. */
  supplement: number;
  /** Guests the room is priced for, for per-person meal supplements. */
  guests: number;
  /** Rate per night, room only. */
  rate: number[];
  /** "Sold" from the shared pool, or "Left under cap" when the room is capped. */
  inventoryLabel: "sold" | "left";
  cap?: number;
  inventory: number[];
  /** "SS" stop sale, "RQ" on request, "·" nothing. */
  status: string[];
  release: number[];
}

const W = [
  400, 400, 500, 500, 400, 400, 400, 400, 400, 500, 500, 400, 400, 400, 400,
  400, 500, 500, 400, 400, 400, 400, 400, 520, 500, 400, 400, 400, 400, 400,
];
const clear = Array.from({ length: GRID_NIGHTS }, () => "·");
const release3 = Array.from({ length: GRID_NIGHTS }, () => 3);

/** Supplement rows follow the base shape: weekday +s, weekend +s. */
function supplement(amount: number) {
  return W.map((value, index) => (index === 23 ? 500 + amount : value + amount));
}

export const gridRows: GridRow[] = [
  {
    name: "Standard Room · City View",
    supplement: 0,
    guests: 2,
    nameAr: "غرفة ستاندرد · إطلالة المدينة",
    meta: "BASE · weekday 400 · weekend 500",
    metaAr: "الأساس · أيام الأسبوع ٤٠٠ · نهاية الأسبوع ٥٠٠",
    base: true,
    rate: W,
    inventoryLabel: "sold",
    inventory: [6, 6, 7, 9, 9, 6, 6, 7, 8, 9, 11, 7, 7, 7, 8, 9, 11, 11, 9, 10, 10, 11, 11, 13, 10, 11, 9, 10, 9, 8],
    status: clear,
    release: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1],
  },
  {
    name: "Standard Room · Haram View",
    supplement: 120,
    guests: 2,
    nameAr: "غرفة ستاندرد · إطلالة الحرم",
    meta: "base + 120 · weekday 520 · weekend 620",
    metaAr: "الأساس + ١٢٠ · أيام الأسبوع ٥٢٠ · نهاية الأسبوع ٦٢٠",
    rate: supplement(120),
    inventoryLabel: "sold",
    inventory: [3, 3, 4, 5, 5, 3, 3, 3, 3, 6, 6, 4, 3, 4, 4, 4, 7, 7, 5, 4, 5, 5, 6, 7, 8, 5, 5, 4, 4, 4],
    status: clear,
    release: release3,
  },
  {
    name: "Triple Room · City View",
    supplement: 100,
    guests: 3,
    nameAr: "غرفة ثلاثية · إطلالة المدينة",
    meta: "base + 100 · weekday 500 · weekend 600",
    metaAr: "الأساس + ١٠٠ · أيام الأسبوع ٥٠٠ · نهاية الأسبوع ٦٠٠",
    rate: supplement(100),
    inventoryLabel: "sold",
    inventory: [2, 2, 2, 3, 3, 2, 2, 2, 2, 4, 4, 3, 2, 2, 3, 3, 4, 5, 3, 3, 3, 4, 4, 5, 5, 3, 3, 3, 3, 3],
    status: clear,
    release: release3,
  },
  {
    name: "Quad Room · City View",
    supplement: 200,
    guests: 4,
    nameAr: "غرفة رباعية · إطلالة المدينة",
    meta: "base + 200 · weekday 600 · weekend 700",
    metaAr: "الأساس + ٢٠٠ · أيام الأسبوع ٦٠٠ · نهاية الأسبوع ٧٠٠",
    rate: supplement(200),
    inventoryLabel: "sold",
    inventory: [2, 2, 2, 2, 3, 1, 2, 2, 2, 3, 3, 2, 2, 2, 2, 2, 4, 4, 2, 2, 3, 3, 3, 4, 4, 3, 2, 2, 2, 2],
    status: clear.map((value, index) => (index === 25 || index === 26 ? "RQ" : value)),
    release: release3,
  },
  {
    name: "Deluxe Room · City View",
    supplement: 160,
    guests: 2,
    nameAr: "غرفة ديلوكس · إطلالة المدينة",
    meta: "base + 160 · weekday 560 · weekend 660 · capped at 12 a night",
    metaAr: "الأساس + ١٦٠ · أيام الأسبوع ٥٦٠ · نهاية الأسبوع ٦٦٠ · بحد ١٢ لليلة",
    rate: supplement(160),
    inventoryLabel: "left",
    cap: 12,
    inventory: [9, 8, 8, 6, 5, 10, 10, 9, 9, 4, 3, 8, 9, 8, 8, 7, 2, 0, 7, 7, 6, 6, 4, 1, 0, 6, 7, 8, 8, 8],
    status: clear.map((value, index) => (index === 17 || index === 18 ? "SS" : value)),
    release: release3,
  },
  {
    name: "Deluxe Room · Partial Haram View",
    supplement: 300,
    guests: 2,
    nameAr: "غرفة ديلوكس · إطلالة جزئية على الحرم",
    meta: "base + 300 · weekday 700 · weekend 800",
    metaAr: "الأساس + ٣٠٠ · أيام الأسبوع ٧٠٠ · نهاية الأسبوع ٨٠٠",
    rate: supplement(300),
    inventoryLabel: "sold",
    inventory: [1, 2, 2, 2, 2, 1, 1, 1, 2, 3, 3, 2, 2, 2, 2, 2, 3, 3, 2, 2, 2, 2, 3, 3, 4, 2, 2, 2, 2, 2],
    status: clear,
    release: release3,
  },
  {
    name: "Deluxe Room · Haram View",
    supplement: 380,
    guests: 2,
    nameAr: "غرفة ديلوكس · إطلالة الحرم",
    meta: "base + 380 · weekday 780 · weekend 880",
    metaAr: "الأساس + ٣٨٠ · أيام الأسبوع ٧٨٠ · نهاية الأسبوع ٨٨٠",
    rate: supplement(380),
    inventoryLabel: "sold",
    inventory: [1, 1, 1, 2, 2, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 2, 2, 2, 2, 3, 2, 2, 1, 1, 1],
    status: clear,
    release: release3,
  },
  {
    name: "Family Room · City View",
    supplement: 220,
    guests: 4,
    nameAr: "غرفة عائلية · إطلالة المدينة",
    meta: "base + 220 · weekday 620 · weekend 720",
    metaAr: "الأساس + ٢٢٠ · أيام الأسبوع ٦٢٠ · نهاية الأسبوع ٧٢٠",
    rate: supplement(220),
    inventoryLabel: "sold",
    inventory: [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
    status: clear,
    release: release3,
  },
  {
    name: "Junior Suite · Haram View",
    supplement: 450,
    guests: 2,
    nameAr: "جناح جونيور · إطلالة الحرم",
    meta: "base + 450 · weekday 850 · weekend 950",
    metaAr: "الأساس + ٤٥٠ · أيام الأسبوع ٨٥٠ · نهاية الأسبوع ٩٥٠",
    rate: supplement(450),
    inventoryLabel: "sold",
    inventory: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    status: clear,
    release: release3,
  },
];

/** Weekday abbreviations, starting from the grid's first night. */
export const WEEKDAYS_EN = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
export const WEEKDAYS_AR = ["أحد", "إثن", "ثلا", "أرب", "خمي", "جمع", "سبت"];

export function weekdayOf(night: number) {
  return (GRID_FIRST_WEEKDAY + night - 1) % 7;
}

export function isWeekend(night: number) {
  return WEEKEND_DAYS.includes(weekdayOf(night));
}


export type InventoryModel = "pool" | "perRoom" | "free" | "onRequest";

export interface GridContract {
  /** Route key — matches the ?contract= search param. */
  key: string;
  ref: string;
  name: string;
  nameAr: string;
  hotel: string;
  hotelAr: string;
  status: string;
  statusAr: string;
  tone: "success" | "neutral" | "info";
  /** Right-hand header action, or the read-only label. */
  publishState: string;
  publishStateAr: string;
  readOnly?: boolean;
  /** UI 04.1U — a contract whose term has not begun. */
  notStarted?: boolean;
  /** Offers with no rate yet; they sit at the bottom of the grid. */
  unpriced?: string[];
  /** The month this contract is drawn on. */
  month?: string;
  model: InventoryModel;
  pool?: number;
  /** Rooms held per room type, for the perRoom model. */
  perRoomCaps?: Record<string, number>;
  summary: string[];
  summaryAr: string[];
  legend: string[];
  legendAr: string[];
  counts: {
    soldOut: number;
    fewer: number;
    stopSale: number;
    onRequest: number;
    notPublished: number;
  };
  /** Fixed-price contracts list one line per room + meal + view. */
  fixedPrice?: boolean;
}

const RELEASE_LINE = "Release 3 days before · 18:00";
const RELEASE_LINE_AR = "الاسترجاع قبل ٣ أيام · ١٨:٠٠";
const CANCEL_LINE = "Cancellation free until 7 days";
const CANCEL_LINE_AR = "الإلغاء مجاني حتى ٧ أيام";
const MIN_LINE = "Min 2 nights in Sep · min 4 on 20 - 25 Sep";
const MIN_LINE_AR = "ليلتان كحد أدنى في سبتمبر · ٤ ليالٍ في ٢٠ - ٢٥ سبتمبر";
const BASE_LINE = "Base + supplements · base Standard Room City View 400 / 500";
const BASE_LINE_AR =
  "الأساس + الإضافات · الأساس غرفة ستاندرد إطلالة المدينة ٤٠٠ / ٥٠٠";
const WEEKEND_LINE = "Weekend Thu, Fri";
const WEEKEND_LINE_AR = "نهاية الأسبوع الخميس والجمعة";

const KNOW_PRICES =
  "Prices are the room only, per night. Meals add the per-person supplement from the contract - open “+ meals” under a room to see B&B and HB totals.";
const KNOW_PRICES_AR =
  "الأسعار للغرفة فقط لكل ليلة. والوجبات تضيف إضافة لكل شخص من العقد - افتح «+ الوجبات» أسفل الغرفة لرؤية إجماليات الإفطار ونصف الإقامة.";
const KNOW_MIN =
  "Min nights and check-in / check-out days come from the contract’s Restrictions. Tap a night to open that rule.";
const KNOW_MIN_AR =
  "الحد الأدنى لليالي وأيام الوصول والمغادرة تأتي من قيود العقد. اضغط على ليلة لفتح تلك القاعدة.";
const KNOW_RELEASE =
  "Release is 3 days before arrival at 18:00 unless a night says otherwise. After release, unsold rooms go back to the hotel.";
const KNOW_RELEASE_AR =
  "الاسترجاع قبل ٣ أيام من الوصول الساعة ١٨:٠٠ ما لم تحدد ليلة غير ذلك. وبعد الاسترجاع تعود الغرف غير المباعة إلى الفندق.";

/** The five contract shapes Figma draws the grid for (UI 04.1, F, P, S, Q, E). */
export const gridContracts: GridContract[] = [
  {
    key: "SC-2026-0142",
    ref: "HTL-2026-0142",
    name: "Makkah Annual Block",
    nameAr: "حصة مكة السنوية",
    hotel: "Al Noor Makkah Hotel",
    hotelAr: "فندق النور مكة",
    status: "Active",
    statusAr: "نشط",
    tone: "success",
    publishState: "3 changes not published · Review & publish",
    publishStateAr: "٣ تعديلات غير منشورة · المراجعة والنشر",
    model: "pool",
    pool: 50,
    summary: [BASE_LINE, WEEKEND_LINE, "Allotment · shared pool 50 a night · overbooking +2", RELEASE_LINE, CANCEL_LINE, MIN_LINE],
    summaryAr: [BASE_LINE_AR, WEEKEND_LINE_AR, "حصة · مخزون مشترك ٥٠ في الليلة · تجاوز +٢", RELEASE_LINE_AR, CANCEL_LINE_AR, MIN_LINE_AR],
    legend: [KNOW_PRICES, KNOW_MIN, KNOW_RELEASE],
    legendAr: [KNOW_PRICES_AR, KNOW_MIN_AR, KNOW_RELEASE_AR],
    counts: { soldOut: 1, fewer: 1, stopSale: 0, onRequest: 2, notPublished: 1 },
  },
  {
    key: "SC-2026-0155",
    ref: "HTL-2026-0155",
    name: "Al Noor Fixed",
    nameAr: "النور بسعر ثابت",
    hotel: "Al Noor Makkah Hotel",
    hotelAr: "فندق النور مكة",
    status: "Active",
    statusAr: "نشط",
    tone: "success",
    publishState: "All changes published · 14 Sep, 11:20",
    publishStateAr: "كل التعديلات منشورة · ١٤ سبتمبر، ١١:٢٠",
    model: "pool",
    pool: 30,
    fixedPrice: true,
    summary: ["Fixed price · each room with its meal and view · no supplements", WEEKEND_LINE, "Allotment · shared pool 30 a night · overbooking +2", RELEASE_LINE, CANCEL_LINE, MIN_LINE],
    summaryAr: ["سعر ثابت · كل غرفة بوجبتها وإطلالتها · بلا إضافات", WEEKEND_LINE_AR, "حصة · مخزون مشترك ٣٠ في الليلة · تجاوز +٢", RELEASE_LINE_AR, CANCEL_LINE_AR, MIN_LINE_AR],
    legend: [
      "Fixed price: every line is one room with one meal and one view, priced in full. There are no supplements, so changing one line never moves another.",
      KNOW_MIN,
      KNOW_RELEASE,
    ],
    legendAr: [
      "السعر الثابت: كل سطر غرفة واحدة بوجبة واحدة وإطلالة واحدة، مسعّرة بالكامل. لا إضافات، فتغيير سطر لا يحرّك غيره أبدًا.",
      KNOW_MIN_AR,
      KNOW_RELEASE_AR,
    ],
    counts: { soldOut: 1, fewer: 1, stopSale: 0, onRequest: 0, notPublished: 0 },
  },
  {
    key: "SC-2026-0148",
    ref: "HTL-2026-0148",
    name: "Makkah Rooms Block",
    nameAr: "حصة غرف مكة",
    hotel: "Al Noor Makkah Hotel",
    hotelAr: "فندق النور مكة",
    status: "Active",
    statusAr: "نشط",
    tone: "success",
    publishState: "All changes published · 14 Sep, 11:20",
    publishStateAr: "كل التعديلات منشورة · ١٤ سبتمبر، ١١:٢٠",
    model: "perRoom",
    perRoomCaps: {
      "Standard Room · City View": 20,
      "Deluxe Room · City View": 12,
      "Deluxe Room · Partial Haram View": 8,
    },
    summary: [BASE_LINE, WEEKEND_LINE, "Allotment · a number per room type · 20 / 12 / 8", RELEASE_LINE, CANCEL_LINE, "No restrictions on this contract"],
    summaryAr: [BASE_LINE_AR, WEEKEND_LINE_AR, "حصة · رقم لكل نوع غرفة · ٢٠ / ١٢ / ٨", RELEASE_LINE_AR, CANCEL_LINE_AR, "لا قيود على هذا العقد"],
    legend: [
      "This contract holds a set number of each room type - 20 Standard, 12 Deluxe City View, 8 Deluxe Partial Haram. Rooms do not borrow from each other.",
      KNOW_PRICES,
      "This contract has no restrictions (None was chosen) - every night sells with a 1-night minimum and every day open.",
      KNOW_RELEASE,
    ],
    legendAr: [
      "يحتفظ هذا العقد بعدد محدد من كل نوع غرفة - ٢٠ ستاندرد و١٢ ديلوكس إطلالة المدينة و٨ ديلوكس إطلالة جزئية. ولا تستعير الغرف من بعضها.",
      KNOW_PRICES_AR,
      "لا قيود على هذا العقد (اختير «بلا») - كل ليلة تُباع بحد أدنى ليلة واحدة وكل الأيام مفتوحة.",
      KNOW_RELEASE_AR,
    ],
    counts: { soldOut: 0, fewer: 0, stopSale: 0, onRequest: 0, notPublished: 0 },
  },
  {
    key: "SC-2026-0160",
    ref: "HTL-2026-0160",
    name: "Al Noor Open Sale",
    nameAr: "النور بيع حر",
    hotel: "Al Noor Makkah Hotel",
    hotelAr: "فندق النور مكة",
    status: "Active",
    statusAr: "نشط",
    tone: "success",
    publishState: "All changes published · 14 Sep, 11:20",
    publishStateAr: "كل التعديلات منشورة · ١٤ سبتمبر، ١١:٢٠",
    model: "free",
    summary: [BASE_LINE, WEEKEND_LINE, "Free sale · no quantity - bookings confirm straight away", "Release - not used (no rooms held)", CANCEL_LINE, MIN_LINE],
    summaryAr: [BASE_LINE_AR, WEEKEND_LINE_AR, "بيع حر · بلا كمية - تتأكد الحجوزات فورًا", "الاسترجاع - غير مستخدم (لا غرف محجوزة)", CANCEL_LINE_AR, MIN_LINE_AR],
    legend: [
      "Free sale: no rooms are held, so there is no inventory and no release. Close a night with Stop sale when the hotel is full.",
      KNOW_PRICES,
      KNOW_MIN,
    ],
    legendAr: [
      "البيع الحر: لا تُحجز غرف، فلا مخزون ولا استرجاع. أغلق الليلة بإيقاف البيع عندما يمتلئ الفندق.",
      KNOW_PRICES_AR,
      KNOW_MIN_AR,
    ],
    counts: { soldOut: 0, fewer: 0, stopSale: 0, onRequest: 0, notPublished: 0 },
  },
  {
    key: "SC-2026-0171",
    ref: "HTL-2026-0171",
    name: "Al Noor On Request",
    nameAr: "النور عند الطلب",
    hotel: "Al Noor Makkah Hotel",
    hotelAr: "فندق النور مكة",
    status: "Active",
    statusAr: "نشط",
    tone: "success",
    publishState: "All changes published · 14 Sep, 11:20",
    publishStateAr: "كل التعديلات منشورة · ١٤ سبتمبر، ١١:٢٠",
    model: "onRequest",
    summary: [BASE_LINE, WEEKEND_LINE, "On Request · no rooms held · the hotel answers within 2 hours", "Release - not used", CANCEL_LINE, MIN_LINE],
    summaryAr: [BASE_LINE_AR, WEEKEND_LINE_AR, "عند الطلب · لا غرف محجوزة · يردّ الفندق خلال ساعتين", "الاسترجاع - غير مستخدم", CANCEL_LINE_AR, MIN_LINE_AR],
    legend: [
      "On Request: every booking waits for the hotel to confirm within 2 hours. Prices and restrictions still apply; Stop sale closes a night completely.",
      KNOW_PRICES,
      KNOW_MIN,
    ],
    legendAr: [
      "عند الطلب: كل حجز ينتظر تأكيد الفندق خلال ساعتين. وتظل الأسعار والقيود سارية، وإيقاف البيع يغلق الليلة تمامًا.",
      KNOW_PRICES_AR,
      KNOW_MIN_AR,
    ],
    counts: { soldOut: 0, fewer: 0, stopSale: 3, onRequest: 11, notPublished: 0 },
  },
  {
    key: "SC-2026-0091",
    ref: "HTL-2026-0091",
    name: "Al Noor Summer Block",
    nameAr: "حصة صيف النور",
    hotel: "Al Noor Makkah Hotel",
    hotelAr: "فندق النور مكة",
    status: "Ended 19 Sep 2026",
    statusAr: "انتهى ١٩ سبتمبر ٢٠٢٦",
    tone: "neutral",
    publishState: "Read only",
    publishStateAr: "للقراءة فقط",
    readOnly: true,
    model: "pool",
    pool: 50,
    summary: [BASE_LINE, WEEKEND_LINE, "Allotment · shared pool 50 a night · overbooking +2", RELEASE_LINE, CANCEL_LINE, "Term 01 Jun - 19 Sep 2026"],
    summaryAr: [BASE_LINE_AR, WEEKEND_LINE_AR, "حصة · مخزون مشترك ٥٠ في الليلة · تجاوز +٢", RELEASE_LINE_AR, CANCEL_LINE_AR, "المدة ١ يونيو - ١٩ سبتمبر ٢٠٢٦"],
    legend: [KNOW_PRICES, KNOW_MIN, KNOW_RELEASE],
    legendAr: [KNOW_PRICES_AR, KNOW_MIN_AR, KNOW_RELEASE_AR],
    counts: { soldOut: 0, fewer: 0, stopSale: 0, onRequest: 0, notPublished: 0 },
  },
  {
    key: "SC-2026-0133",
    ref: "HTL-2026-0133",
    name: "Ramadan Block",
    nameAr: "حصة رمضان",
    hotel: "Al Noor Makkah Hotel",
    hotelAr: "فندق النور مكة",
    status: "Scheduled · starts 18 Feb 2027",
    statusAr: "مجدول · يبدأ ١٨ فبراير ٢٠٢٧",
    tone: "info",
    publishState: "All changes published · 14 Sep, 11:20",
    publishStateAr: "كل التعديلات منشورة · ١٤ سبتمبر، ١١:٢٠",
    notStarted: true,
    month: "2027-03",
    unpriced: ["Deluxe Room · Partial Haram View", "Family Room · City View", "Junior Suite · Haram View"],
    model: "pool",
    pool: 40,
    summary: [BASE_LINE, WEEKEND_LINE, "Allotment · shared pool 40 a night", RELEASE_LINE, CANCEL_LINE, "Ramadan 18 Feb - 9 Mar · Last ten nights 10 - 19 Mar"],
    summaryAr: [BASE_LINE_AR, WEEKEND_LINE_AR, "حصة · مخزون مشترك ٤٠ في الليلة", RELEASE_LINE_AR, CANCEL_LINE_AR, "رمضان ١٨ فبراير - ٩ مارس · العشر الأواخر ١٠ - ١٩ مارس"],
    legend: [KNOW_PRICES, KNOW_MIN, KNOW_RELEASE],
    legendAr: [KNOW_PRICES_AR, KNOW_MIN_AR, KNOW_RELEASE_AR],
    counts: { soldOut: 4, fewer: 6, stopSale: 0, onRequest: 0, notPublished: 0 },
  },
];

/** One row per room + meal + view, for the fixed-price contract. */
export const fixedPriceRows: GridRow[] = gridRows.flatMap((row) =>
  [
    { meal: "Room Only", mealAr: "الغرفة فقط", add: 0 },
    { meal: "Bed & Breakfast", mealAr: "إفطار", add: 45 },
    { meal: "Half Board", mealAr: "نصف إقامة", add: 90 },
  ].map((plan) => {
    const extra = plan.add * row.guests;
    const [type = "", view = ""] = row.name.split(" · ");
    const [typeAr = "", viewAr = ""] = row.nameAr.split(" · ");
    return {
      ...row,
      name: `${type} · ${plan.meal} · ${view}`,
      nameAr: `${typeAr} · ${plan.mealAr} · ${viewAr}`,
      meta: `fixed price · weekday ${400 + row.supplement + extra} · weekend ${500 + row.supplement + extra}`,
      metaAr: `سعر ثابت · أيام الأسبوع ${400 + row.supplement + extra} · نهاية الأسبوع ${500 + row.supplement + extra}`,
      rate: row.rate.map((value) => value + extra),
      base: false,
    };
  })
);


export interface GridMonth {
  key: string;
  label: string;
  labelAr: string;
  picker: string;
  pickerAr: string;
  nights: number;
  /** Weekday of the first night, 0 = Sunday. */
  firstWeekday: number;
  /** Highlighted "today" column, or 0 when the month has none. */
  today: number;
  /** Nights whose rate was changed away from the contract's own. */
  editedNights: number[];
  /** Chip counts, which change with the month even on the same contract. */
  counts: { soldOut: number; fewer: number; stopSale: number; onRequest: number; notPublished: number };
  /** The line under "Sold" — September names the shared pool's lack of a cap. */
  soldNote: string;
  soldNoteAr: string;
  /** Sub-label under the Season row, where the month has a season. */
  seasonHint: string | null;
  seasonHintAr: string | null;
  /** The season clause added to the contract summary. */
  seasonLine: string;
  seasonLineAr: string;
  /** UI 04.1T / H / J — no restriction reaches this month. */
  noRule?: boolean;
  /** The line a season month adds to Good to know. */
  legendLine?: string;
  legendLineAr?: string;
  /** Season band label, or null where the contract rate covers the month. */
  seasonBand: string | null;
  seasonBandAr: string | null;
  poolLeft: number[];
  /** Base-room rate per night; every other row is this plus its supplement. */
  base: number[];
  baseSold: number[];
  minNights: string[];
  /** The line under the base room name. */
  baseMeta: string;
  baseMetaAr: string;
  /** Day-of-month per night, when the grid draws a span, not a month. */
  days?: number[];
  /** One dark bar segment per month the span crosses. */
  segments?: MonthSegment[];
}

const ones = (n: number) => Array.from({ length: n }, () => "1");
const SEASON_META = "BASE · price follows the season on its dates";
const SEASON_META_AR = "الأساس · السعر يتبع الموسم في تواريخه";

/** The months Figma draws for the Makkah Annual Block contract. */
export const gridMonths: GridMonth[] = [
  {
    key: "2026-09",
    label: "SEPTEMBER 2026",
    labelAr: "سبتمبر ٢٠٢٦",
    picker: "September 2026",
    pickerAr: "سبتمبر ٢٠٢٦",
    nights: 30,
    firstWeekday: 2,
    today: 20,
    editedNights: [24],
    counts: { soldOut: 1, fewer: 1, stopSale: 0, onRequest: 2, notPublished: 1 },
    soldNote: "from the pool · no cap",
    soldNoteAr: "من المخزون المشترك · بلا حد",
    seasonHint: null,
    seasonHintAr: null,
    seasonLine: "Min 2 nights in Sep · min 4 on 20 - 25 Sep",
    seasonLineAr: "ليلتان كحد أدنى في سبتمبر · ٤ ليالٍ في ٢٠ - ٢٥ سبتمبر",
    seasonBand: null,
    seasonBandAr: null,
    poolLeft: POOL_LEFT,
    base: [400, 400, 500, 500, 400, 400, 400, 400, 400, 500, 500, 400, 400, 400, 400, 400, 500, 500, 400, 400, 400, 400, 400, 520, 500, 400, 400, 400, 400, 400],
    baseSold: [6, 6, 7, 9, 9, 6, 6, 7, 8, 9, 11, 7, 7, 7, 8, 9, 11, 11, 9, 10, 10, 11, 11, 13, 10, 11, 9, 10, 9, 8],
    minNights: MIN_NIGHTS,
    baseMeta: "BASE · weekday 400 · weekend 500",
    baseMetaAr: "الأساس · أيام الأسبوع ٤٠٠ · نهاية الأسبوع ٥٠٠",
  },
  {
    key: "2027-03",
    label: "MARCH 2027",
    labelAr: "مارس ٢٠٢٧",
    picker: "March 2027",
    pickerAr: "مارس ٢٠٢٧",
    nights: 31,
    firstWeekday: 1,
    today: 0,
    editedNights: [],
    counts: { soldOut: 4, fewer: 6, stopSale: 0, onRequest: 0, notPublished: 0 },
    soldNote: "from the pool",
    soldNoteAr: "من المخزون المشترك",
    seasonHint: "tap a season to open it",
    seasonHintAr: "اضغط على موسم لفتحه",
    seasonLine: "Ramadan 18 Feb - 9 Mar · Last ten nights 10 - 19 Mar",
    noRule: true,
    legendLine:
      "On season nights the room price comes from the season, not the base. Supplements for rooms and meals stay the same. Tap a season band to open it.",
    legendLineAr:
      "في ليالي الموسم يأتي سعر الغرفة من الموسم لا من الأساس. وتبقى فروق الغرف والوجبات كما هي. انقر شريط الموسم لفتحه.",
    seasonLineAr: "رمضان ١٨ فبراير - ٩ مارس · العشر الأواخر ١٠ - ١٩ مارس",
    seasonBand: "Ramadan · Last ten nights",
    seasonBandAr: "رمضان · العشر الأواخر",
    poolLeft: [20, 18, 14, 6, 4, 16, 17, 15, 12, 5, 4, 2, 1, 0, 0, 1, 0, 0, 3, 20, 22, 24, 26, 23, 21, 28, 29, 30, 26, 24, 29],
    base: [640, 640, 640, 740, 740, 640, 640, 640, 640, 1000, 1100, 1100, 1000, 1000, 1000, 1000, 1000, 1100, 1100, 400, 400, 400, 400, 400, 500, 500, 400, 400, 400, 400, 400],
    baseSold: [12, 13, 14, 18, 18, 14, 13, 14, 15, 18, 18, 19, 20, 20, 20, 20, 20, 20, 19, 12, 11, 10, 10, 11, 12, 9, 8, 8, 10, 10, 8],
    minNights: ones(31),
    baseMeta: SEASON_META,
    baseMetaAr: SEASON_META_AR,
  },
  {
    key: "2027-05",
    label: "MAY 2027",
    labelAr: "مايو ٢٠٢٧",
    picker: "May 2027",
    pickerAr: "مايو ٢٠٢٧",
    nights: 31,
    firstWeekday: 6,
    today: 0,
    editedNights: [],
    counts: { soldOut: 1, fewer: 4, stopSale: 0, onRequest: 0, notPublished: 0 },
    soldNote: "from the pool",
    soldNoteAr: "من المخزون المشترك",
    seasonHint: "tap a season to open it",
    seasonHintAr: "اضغط على موسم لفتحه",
    seasonLine: "Hajj 10 - 20 May · 880 / 980",
    noRule: true,
    legendLine:
      "On season nights the room price comes from the season, not the base. Supplements for rooms and meals stay the same. Tap a season band to open it.",
    legendLineAr:
      "في ليالي الموسم يأتي سعر الغرفة من الموسم لا من الأساس. وتبقى فروق الغرف والوجبات كما هي. انقر شريط الموسم لفتحه.",
    seasonLineAr: "الحج ١٠ - ٢٠ مايو · ٨٨٠ / ٩٨٠",
    seasonBand: "Hajj",
    seasonBandAr: "الحج",
    poolLeft: [30, 25, 20, 30, 25, 20, 30, 25, 20, 2, 6, 10, 3, 7, 0, 4, 8, 1, 5, 9, 20, 30, 25, 20, 30, 25, 20, 30, 25, 20, 30],
    base: [400, 400, 400, 400, 400, 500, 500, 400, 400, 880, 880, 880, 980, 980, 880, 880, 880, 880, 880, 980, 500, 400, 400, 400, 400, 400, 500, 500, 400, 400, 400],
    baseSold: [8, 10, 12, 8, 10, 12, 8, 10, 12, 19, 18, 16, 19, 17, 20, 18, 17, 20, 18, 16, 12, 8, 10, 12, 8, 10, 12, 8, 10, 12, 8],
    minNights: ones(31),
    baseMeta: SEASON_META,
    baseMetaAr: SEASON_META_AR,
  },
  {
    key: "2027-07",
    label: "JULY 2027",
    labelAr: "يوليو ٢٠٢٧",
    picker: "July 2027",
    pickerAr: "يوليو ٢٠٢٧",
    nights: 31,
    firstWeekday: 4,
    today: 0,
    editedNights: [],
    counts: { soldOut: 3, fewer: 11, stopSale: 0, onRequest: 0, notPublished: 0 },
    soldNote: "from the pool",
    soldNoteAr: "من المخزون المشترك",
    seasonHint: "tap a season to open it",
    seasonHintAr: "اضغط على موسم لفتحه",
    seasonLine: "Summer 1 Jul - 31 Aug · 500 / 600",
    noRule: true,
    legendLine:
      "On season nights the room price comes from the season, not the base. Supplements for rooms and meals stay the same. Tap a season band to open it.",
    legendLineAr:
      "في ليالي الموسم يأتي سعر الغرفة من الموسم لا من الأساس. وتبقى فروق الغرف والوجبات كما هي. انقر شريط الموسم لفتحه.",
    seasonLineAr: "الصيف ١ يوليو - ٣١ أغسطس · ٥٠٠ / ٦٠٠",
    seasonBand: "Summer",
    seasonBandAr: "الصيف",
    poolLeft: [10, 3, 7, 0, 4, 8, 1, 5, 9, 2, 6, 10, 3, 7, 0, 4, 8, 1, 5, 9, 2, 6, 10, 3, 7, 0, 4, 8, 1, 5, 9],
    base: [600, 600, 500, 500, 500, 500, 500, 600, 600, 500, 500, 500, 500, 500, 600, 600, 500, 500, 500, 500, 500, 600, 600, 500, 500, 500, 500, 500, 600, 600, 500],
    baseSold: [16, 19, 17, 20, 18, 17, 20, 18, 16, 19, 18, 16, 19, 17, 20, 18, 17, 20, 18, 16, 19, 18, 16, 19, 17, 20, 18, 17, 20, 18, 16],
    minNights: ones(31),
    baseMeta: SEASON_META,
    baseMetaAr: SEASON_META_AR,
  },
];

/** Rebuild the nine offer rows for a month, from its base rate. */
export function rowsForMonth(month: GridMonth): GridRow[] {
  return gridRows.map((row) => {
    const nights = month.base.length;
    return {
      ...row,
      meta: row.base ? month.baseMeta : row.meta,
      metaAr: row.base ? month.baseMetaAr : row.metaAr,
      rate: month.base.map((value) => value + row.supplement),
      inventory:
        row.inventoryLabel === "left"
          ? Array.from({ length: nights }, (_, i) => row.inventory[i % row.inventory.length] ?? 0)
          : row.base
            ? month.baseSold
            : Array.from({ length: nights }, (_, i) => row.inventory[i % row.inventory.length] ?? 0),
      status: Array.from({ length: nights }, (_, i) =>
        month.key === "2026-09" ? (row.status[i] ?? "·") : "·"
      ),
      release: Array.from({ length: nights }, (_, i) =>
        month.key === "2026-09" ? (row.release[i] ?? 3) : 3
      ),
    };
  });
}

/* ------------------------------------------------------------------ *
 * A window of nights
 *
 * The From and To fields pick days, not months, so the grid has to draw
 * any span — inside one month, across two, or over months the design
 * never drew. A span that is exactly one of the four drawn months is
 * returned untouched, so UI 04.1 keeps every number Figma prints.
 * ------------------------------------------------------------------ */

const MONTHS_UPPER = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];
const MONTHS_AR_SHORT = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

/** The dark month bar becomes one segment per month in the window. */
export interface MonthSegment {
  label: string;
  labelAr: string;
  nights: number;
}

function monthKeyOf(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function lengthOf(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function parseKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y ?? 2026, (m ?? 1) - 1, d ?? 1);
}

/** Builds the grid for the nights between two yyyy-mm-dd days, inclusive. */
export function windowFor(fromKey: string, toKey: string): GridMonth {
  const first = parseKey(fromKey);
  const last = parseKey(toKey);
  if (last < first) return windowFor(toKey, fromKey);

  const drawn = gridMonths.find((month) => month.key === monthKeyOf(first));
  const wholeMonth =
    drawn !== undefined &&
    monthKeyOf(first) === monthKeyOf(last) &&
    first.getDate() === 1 &&
    last.getDate() === lengthOf(first);
  if (wholeMonth && drawn) return drawn;

  const nights: Date[] = [];
  for (
    let day = new Date(first);
    day <= last;
    day = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1)
  ) {
    nights.push(day);
  }

  const owner = (day: Date) =>
    gridMonths.find((month) => month.key === monthKeyOf(day));
  /** A month the design never drew still sells at the contract's own base. */
  const fallbackBase = (day: Date) =>
    WEEKEND_DAYS.includes(day.getDay()) ? 500 : 400;

  const at = <T,>(day: Date, list: T[] | undefined, spare: T): T => {
    const value = list?.[day.getDate() - 1];
    return value === undefined ? spare : value;
  };

  const base = nights.map((day) => {
    const month = owner(day);
    return month ? at(day, month.base, fallbackBase(day)) : fallbackBase(day);
  });
  const baseSold = nights.map((day) => {
    const month = owner(day);
    return month ? at(day, month.baseSold, 0) : 0;
  });
  const poolLeft = nights.map((day) => {
    const month = owner(day);
    return month ? at(day, month.poolLeft, 50) : 50;
  });
  const minNights = nights.map((day) => {
    const month = owner(day);
    return month ? at(day, month.minNights, "2") : "2";
  });

  const today = new Date();
  const todayAt = nights.findIndex(
    (day) =>
      day.getFullYear() === today.getFullYear() &&
      day.getMonth() === today.getMonth() &&
      day.getDate() === today.getDate()
  );

  const editedNights = nights
    .map((day, index) => {
      const month = owner(day);
      return month?.editedNights.includes(day.getDate()) ? index + 1 : 0;
    })
    .filter((index) => index > 0);

  const segments: MonthSegment[] = [];
  for (const day of nights) {
    const key = monthKeyOf(day);
    const back = segments[segments.length - 1];
    if (back && back.label.endsWith(String(day.getFullYear())) && back.label.startsWith(MONTHS_UPPER[day.getMonth()]!)) {
      back.nights += 1;
      continue;
    }
    segments.push({
      label: `${MONTHS_UPPER[day.getMonth()]} ${day.getFullYear()}`,
      labelAr: `${MONTHS_AR_SHORT[day.getMonth()]} ${day.getFullYear()}`,
      nights: 1,
    });
  }

  const span = (date: Date, withMonth: boolean) =>
    withMonth
      ? `${date.getDate()} ${MONTHS_UPPER[date.getMonth()]} ${date.getFullYear()}`
      : `${date.getDate()}`;
  const sameMonth = monthKeyOf(first) === monthKeyOf(last);
  const label = `${span(first, !sameMonth)} – ${span(last, true)}`;
  const labelAr = `${first.getDate()} ${sameMonth ? "" : MONTHS_AR_SHORT[first.getMonth()] + " "}– ${last.getDate()} ${MONTHS_AR_SHORT[last.getMonth()]} ${last.getFullYear()}`;

  const shape = drawn ?? gridMonths[0]!;
  return {
    ...shape,
    key: `${fromKey}..${toKey}`,
    label,
    labelAr,
    picker: label,
    pickerAr: labelAr,
    nights: nights.length,
    firstWeekday: first.getDay(),
    today: todayAt >= 0 ? todayAt + 1 : 0,
    editedNights,
    days: nights.map((day) => day.getDate()),
    segments,
    base,
    baseSold,
    poolLeft,
    minNights,
  };
}

/**
 * The real calendar date behind a column.
 *
 * A whole month's columns are its days; a custom window's are counted from
 * its first night. Everything that needs the actual date - the weekday, the
 * label, the season - has to ask for it rather than treat the column index
 * as a day of the month, which is only true for whole months.
 */
export function dateOfNight(month: GridMonth, night: number): Date {
  if (month.key.includes("..")) {
    const from = month.key.split("..")[0]!;
    const first = parseKey(from);
    return new Date(
      first.getFullYear(),
      first.getMonth(),
      first.getDate() + night - 1
    );
  }
  const [year, index] = month.key.split("-").map(Number);
  return new Date(year ?? 2026, (index ?? 1) - 1, night);
}

/**
 * OV 04.6N / 04.6G — which season a night sits in, if any.
 *
 * The contract's own two: Ramadan 18 Feb - 9 Mar 2027 and the last ten
 * nights 10 - 19 Mar. Every other night in the demo is outside a season,
 * which is what the grey band on the Change prices overlay says.
 */
export function seasonOf(date: Date): { en: string; ar: string } | null {
  const at = date.getTime();
  const within = (from: Date, to: Date) =>
    at >= from.getTime() && at <= to.getTime();
  if (within(new Date(2027, 1, 18), new Date(2027, 2, 9))) {
    return { en: "Ramadan", ar: "رمضان" };
  }
  if (within(new Date(2027, 2, 10), new Date(2027, 2, 19))) {
    return { en: "Last ten nights", ar: "العشر الأواخر" };
  }
  return null;
}
