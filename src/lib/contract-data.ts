/**
 * The supply-contract builder dataset, taken from Figma UI 03.1F
 * ("Create supply contract / Everything filled · before review") and its
 * sibling frames. Everything here is the worked example the design draws:
 * one base room at 400/500 SAR with every other price expressed as a
 * supplement on top of it.
 */

export const BASE_WEEKDAY = 400;
export const BASE_WEEKEND = 500;

export interface ContractRoom {
  /** Room type, e.g. "Standard Room". */
  type: string;
  typeAr: string;
  view: string;
  viewAr: string;
  /** Supplement on the base room, in SAR. The base room itself is 0. */
  supplement: number;
  /** Guests the room is priced for. */
  guests: number;
  onSale: boolean;
  base?: boolean;
}

export const contractRooms: ContractRoom[] = [
  { type: "Standard Room", typeAr: "غرفة ستاندرد", view: "City View", viewAr: "إطلالة المدينة", supplement: 0, guests: 2, onSale: true, base: true },
  { type: "Standard Room", typeAr: "غرفة ستاندرد", view: "Haram View", viewAr: "إطلالة الحرم", supplement: 120, guests: 2, onSale: true },
  { type: "Triple Room", typeAr: "غرفة ثلاثية", view: "City View", viewAr: "إطلالة المدينة", supplement: 100, guests: 3, onSale: true },
  { type: "Quad Room", typeAr: "غرفة رباعية", view: "City View", viewAr: "إطلالة المدينة", supplement: 200, guests: 4, onSale: true },
  { type: "Deluxe Room", typeAr: "غرفة ديلوكس", view: "City View", viewAr: "إطلالة المدينة", supplement: 160, guests: 2, onSale: true },
  { type: "Deluxe Room", typeAr: "غرفة ديلوكس", view: "Partial Haram View", viewAr: "إطلالة جزئية على الحرم", supplement: 300, guests: 2, onSale: true },
  { type: "Deluxe Room", typeAr: "غرفة ديلوكس", view: "Haram View", viewAr: "إطلالة الحرم", supplement: 380, guests: 2, onSale: true },
  { type: "Family Room", typeAr: "غرفة عائلية", view: "City View", viewAr: "إطلالة المدينة", supplement: 220, guests: 4, onSale: true },
  { type: "Junior Suite", typeAr: "جناح جونيور", view: "Haram View", viewAr: "إطلالة الحرم", supplement: 450, guests: 2, onSale: true },
  { type: "Royal Suite", typeAr: "الجناح الملكي", view: "Haram View", viewAr: "إطلالة الحرم", supplement: 0, guests: 2, onSale: false },
];

export interface ChildBand {
  label: string;
  labelAr: string;
  basis: string;
  basisAr: string;
  supplement: string;
  supplementAr: string;
  included: boolean;
}

export const childBands: ChildBand[] = [
  { label: "Child 0 - 5", labelAr: "طفل ٠ - ٥", basis: "sharing the parents’ bed", basisAr: "يشارك سرير الوالدين", supplement: "Free", supplementAr: "مجانًا", included: true },
  { label: "Child 6 - 11", labelAr: "طفل ٦ - ١١", basis: "sharing, no extra bed", basisAr: "يشارك بدون سرير إضافي", supplement: "+ 50 SAR a night", supplementAr: "+ ٥٠ ر.س لليلة", included: true },
  { label: "Child 6 - 11", labelAr: "طفل ٦ - ١١", basis: "with an extra bed", basisAr: "مع سرير إضافي", supplement: "+ 100 SAR a night", supplementAr: "+ ١٠٠ ر.س لليلة", included: true },
];

export interface MealPlan {
  name: string;
  nameAr: string;
  basis: string;
  basisAr: string;
  /** Supplement per night; null for the included base plan. */
  supplement: number | null;
  perPerson: boolean;
  included: boolean;
}

export const mealPlans: MealPlan[] = [
  { name: "Room Only", nameAr: "الغرفة فقط", basis: "Base · included", basisAr: "الأساس · مشمول", supplement: null, perPerson: false, included: true },
  { name: "Bed & Breakfast", nameAr: "إفطار", basis: "Per person", basisAr: "لكل شخص", supplement: 45, perPerson: true, included: true },
  { name: "Half Board", nameAr: "نصف إقامة", basis: "Per person", basisAr: "لكل شخص", supplement: 90, perPerson: true, included: true },
  { name: "Full Board", nameAr: "إقامة كاملة", basis: "Per room", basisAr: "لكل غرفة", supplement: 260, perPerson: false, included: false },
  { name: "Iftar + Suhur", nameAr: "إفطار + سحور", basis: "Per person", basisAr: "لكل شخص", supplement: null, perPerson: true, included: false },
];

export interface InventoryCap {
  room: string;
  roomAr: string;
  cap: string;
  capAr: string;
  sells: string;
  sellsAr: string;
}

export const inventoryCaps: InventoryCap[] = [
  { room: "Standard Room", roomAr: "غرفة ستاندرد", cap: "No cap", capAr: "بلا حد", sells: "3 meal plans · up to 50 a night", sellsAr: "٣ خطط وجبات · حتى ٥٠ ليلًا" },
  { room: "Deluxe Room City View", roomAr: "ديلوكس إطلالة المدينة", cap: "12", capAr: "١٢", sells: "3 meal plans · stops at 12 even if the pool has more", sellsAr: "٣ خطط وجبات · تتوقف عند ١٢ حتى لو بقي في المخزون" },
  { room: "Deluxe Room Partial Haram View", roomAr: "ديلوكس إطلالة جزئية على الحرم", cap: "No cap", capAr: "بلا حد", sells: "4 meal plans · up to 50 a night", sellsAr: "٤ خطط وجبات · حتى ٥٠ ليلًا" },
];

export interface RateSeason {
  name: string;
  nameAr: string;
  dates: string;
  datesAr: string;
  nights: number;
  rule: string;
  ruleAr: string;
  result: string;
  base?: boolean;
  /** The swatch UI 03.1F paints on the month map and in the legend. */
  colour?: string;
  /** The nights the season covers, for the map. */
  from?: string;
  to?: string;
}

export const rateSeasons: RateSeason[] = [
  { name: "Base contract rate · incl. VAT", nameAr: "سعر العقد الأساسي · شامل الضريبة", dates: "Every night without a season", datesAr: "كل ليلة بلا موسم", nights: 262, rule: "Contract price", ruleAr: "سعر العقد", result: "400 / 500", base: true, colour: "#eef1ee" },
  { name: "Ramadan", nameAr: "رمضان", dates: "18 Feb - 09 Mar 27", datesAr: "١٨ فبراير - ٩ مارس ٢٧", nights: 20, rule: "Base 640 / 740", ruleAr: "أساس ٦٤٠ / ٧٤٠", result: "640 / 740", colour: "#4a3aa7", from: "2027-02-18", to: "2027-03-09" },
  { name: "Last ten nights", nameAr: "العشر الأواخر", dates: "10 - 19 Mar 27", datesAr: "١٠ - ١٩ مارس ٢٧", nights: 10, rule: "Base 1,000 / 1,100", ruleAr: "أساس ١٬٠٠٠ / ١٬١٠٠", result: "1,000 / 1,100", colour: "#e87ba4", from: "2027-03-10", to: "2027-03-19" },
  { name: "Hajj", nameAr: "الحج", dates: "10 - 20 May 27", datesAr: "١٠ - ٢٠ مايو ٢٧", nights: 11, rule: "Base 880 / 980", ruleAr: "أساس ٨٨٠ / ٩٨٠", result: "880 / 980", colour: "#2a78d6", from: "2027-05-10", to: "2027-05-20" },
  { name: "Summer", nameAr: "الصيف", dates: "01 Jul - 31 Aug 27", datesAr: "١ يوليو - ٣١ أغسطس ٢٧", nights: 62, rule: "Base 500 / 600", ruleAr: "أساس ٥٠٠ / ٦٠٠", result: "500 / 600", colour: "#1aa3b8", from: "2027-07-01", to: "2027-08-31" },
];

export interface ContractRestriction {
  scope: string;
  scopeAr: string;
  updated: string;
  updatedAr: string;
  dates: string;
  datesAr: string;
  overlap?: string;
  overlapAr?: string;
  minNights: string;
  minNightsAr: string;
  checks: string;
  checksAr: string;
  active: boolean;
}

export const contractRestrictions: ContractRestriction[] = [
  { scope: "All rooms", scopeAr: "كل الغرف", updated: "Updated 12 Sep · Abdullrahman", updatedAr: "حُدّث ١٢ سبتمبر · عبدالرحمن", dates: "01 - 30 Sep 2026", datesAr: "١ - ٣٠ سبتمبر ٢٠٢٦", overlap: "20 - 25 Sep: a newer rule applies", overlapAr: "٢٠ - ٢٥ سبتمبر: تنطبق قاعدة أحدث", minNights: "2 nights", minNightsAr: "ليلتان", checks: "Every day open", checksAr: "كل الأيام مفتوحة", active: true },
  { scope: "All rooms", scopeAr: "كل الغرف", updated: "Updated 14 Sep · Abdullrahman", updatedAr: "حُدّث ١٤ سبتمبر · عبدالرحمن", dates: "20 - 25 Sep 2026", datesAr: "٢٠ - ٢٥ سبتمبر ٢٠٢٦", minNights: "4 nights", minNightsAr: "٤ ليالٍ", checks: "No check-in 23 Sep", checksAr: "لا وصول ٢٣ سبتمبر", active: true },
  { scope: "Deluxe Room City View", scopeAr: "ديلوكس إطلالة المدينة", updated: "Updated 14 Sep · Abdullrahman", updatedAr: "حُدّث ١٤ سبتمبر · عبدالرحمن", dates: "18 Feb - 09 Mar 2027", datesAr: "١٨ فبراير - ٩ مارس ٢٠٢٧", minNights: "3 nights", minNightsAr: "٣ ليالٍ", checks: "No check-in Fri · No check-out Sat", checksAr: "لا وصول الجمعة · لا مغادرة السبت", active: false },
];

export interface SeasonPolicy {
  season: string;
  seasonAr: string;
  dates: string;
  datesAr: string;
  policy: string;
  policyAr: string;
  own: boolean;
}

export const seasonPolicies: SeasonPolicy[] = [
  { season: "Contract policy", seasonAr: "سياسة العقد", dates: "All other nights", datesAr: "كل الليالي الأخرى", policy: "Free until 7 days · 3-6 days 1 night · then 100%", policyAr: "مجاني حتى ٧ أيام · ٣-٦ أيام ليلة · ثم ١٠٠٪", own: false },
  { season: "Ramadan", seasonAr: "رمضان", dates: "18 Feb - 09 Mar", datesAr: "١٨ فبراير - ٩ مارس", policy: "Own policy · free until 14 days, then 100%", policyAr: "سياسة خاصة · مجاني حتى ١٤ يومًا ثم ١٠٠٪", own: true },
  { season: "Last ten nights · Hajj · Summer", seasonAr: "العشر الأواخر · الحج · الصيف", dates: "their dates", datesAr: "في تواريخها", policy: "Same as the contract policy", policyAr: "نفس سياسة العقد", own: false },
];

/** Weekday price for a room on a meal plan, per Figma's price list. */
export function roomPrice(
  room: ContractRoom,
  meal: MealPlan,
  weekend = false,
  /** OV 03.12 — a season prices from its own base, not the contract's. */
  seasonBase?: { weekday: number; weekend: number }
) {
  const from = seasonBase
    ? weekend
      ? seasonBase.weekend
      : seasonBase.weekday
    : weekend
      ? BASE_WEEKEND
      : BASE_WEEKDAY;
  const base = from + room.supplement;
  if (meal.supplement === null) return base;
  return base + meal.supplement * (meal.perPerson ? room.guests : 1);
}

export const MONTHS = [
  "SEP",
  "OCT",
  "NOV",
  "DEC",
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
];


export interface ContractStat {
  label: string;
  labelAr: string;
  value: string;
  hint: string;
  hintAr: string;
}

export interface ContractStateView {
  /** Trailing clause on the header meta line. */
  meta: string;
  metaAr: string;
  banner?: {
    tone: "warning" | "success" | "danger" | "info";
    title: string;
    titleAr: string;
    body: string;
    bodyAr: string;
  };
  stats: ContractStat[];
}

const liveStats: ContractStat[] = [
  { label: "Confirmed bookings", labelAr: "الحجوزات المؤكدة", value: "23", hint: "under this contract", hintAr: "ضمن هذا العقد" },
  { label: "On Request · waiting", labelAr: "عند الطلب · بالانتظار", value: "6", hint: "avg 12 min left · SLA 30", hintAr: "متوسط ١٢ دقيقة متبقية · المهلة ٣٠" },
  { label: "Rooms left tonight", labelAr: "الغرف المتبقية الليلة", value: "17", hint: "of 40 · 3 room types", hintAr: "من ٤٠ · ٣ أنواع غرف" },
  { label: "Above stock", labelAr: "فوق المخزون", value: "2", hint: "overbooking +2 used on 14 Sep", hintAr: "استُخدم تجاوز +٢ في ١٤ سبتمبر" },
];

/** One entry per contract state drawn in Figma UI 03.3, 03.18B-03.21B. */
export const contractStateViews: Record<string, ContractStateView> = {
  "SC-2026-0142": {
    meta: "published v1.3 on 13 Sep by Supplier Admin",
    metaAr: "نُشر v1.3 في ١٣ سبتمبر بواسطة مدير المورّد",
    stats: liveStats,
  },
  "SC-2026-0189": {
    meta: "published v1.1 on 20 Jun by Supplier Admin",
    metaAr: "نُشر v1.1 في ٢٠ يونيو بواسطة مدير المورّد",
    banner: {
      tone: "warning",
      title: "Ends in 14 days · 29 Sep 2026",
      titleAr: "ينتهي خلال ١٤ يومًا · ٢٩ سبتمبر ٢٠٢٦",
      body: "After the end date the contract becomes Expired and read only. Extend the term through Amend (new version, effective from a date you choose) or copy it to a new period.",
      bodyAr: "بعد تاريخ الانتهاء يصبح العقد منتهيًا وللقراءة فقط. مدّد المدة عبر التعديل التعاقدي (إصدار جديد بتاريخ سريان تختاره) أو انسخه إلى فترة جديدة.",
    },
    stats: [
      { label: "Confirmed bookings", labelAr: "الحجوزات المؤكدة", value: "11", hint: "check-outs by 29 Sep", hintAr: "مغادرات حتى ٢٩ سبتمبر" },
      { label: "On Request · waiting", labelAr: "عند الطلب · بالانتظار", value: "1", hint: "42 min past SLA", hintAr: "تجاوز المهلة بـ٤٢ دقيقة" },
      { label: "Nights left", labelAr: "الليالي المتبقية", value: "14", hint: "then expires (read only)", hintAr: "ثم ينتهي (للقراءة فقط)" },
      { label: "Above stock", labelAr: "فوق المخزون", value: "0", hint: "On Request · no stock", hintAr: "عند الطلب · بلا مخزون" },
    ],
  },
  "SC-2027-0031": {
    meta: "paused 15 Sep by Abdullrahman Najeh",
    metaAr: "أُوقف في ١٥ سبتمبر بواسطة عبدالرحمن ناجح",
    banner: {
      tone: "warning",
      title: "Paused since 15 Sep - agents cannot see this contract",
      titleAr: "موقوف منذ ١٥ سبتمبر - لا يراه الوكلاء",
      body: "Existing bookings are unaffected and still honoured. Resume restores every night to exactly the state it had before the pause - prices, stock and stop-sells included.",
      bodyAr: "الحجوزات القائمة غير متأثرة وتُحترم. والاستئناف يعيد كل ليلة إلى حالتها تمامًا قبل الإيقاف - الأسعار والمخزون وإيقاف البيع.",
    },
    stats: [
      { label: "Confirmed bookings", labelAr: "الحجوزات المؤكدة", value: "4", hint: "honoured while paused", hintAr: "تُحترم أثناء الإيقاف" },
      { label: "On Request · waiting", labelAr: "عند الطلب · بالانتظار", value: "0", hint: "new requests blocked", hintAr: "الطلبات الجديدة موقوفة" },
      { label: "Rooms left tonight", labelAr: "الغرف المتبقية الليلة", value: "-", hint: "hidden from agents", hintAr: "مخفية عن الوكلاء" },
      { label: "Paused for", labelAr: "مدة الإيقاف", value: "1 day", hint: "since 15 Sep · 09:12 KSA", hintAr: "منذ ١٥ سبتمبر · ٠٩:١٢ بتوقيت السعودية" },
    ],
  },
  "SC-2026-0098": {
    meta: "expired 31 Aug 2026",
    metaAr: "انتهى في ٣١ أغسطس ٢٠٢٦",
    banner: {
      tone: "info",
      title: "Expired on 31 Aug 2026 - read only",
      titleAr: "انتهى في ٣١ أغسطس ٢٠٢٦ - للقراءة فقط",
      body: "Nothing can be edited. Bookings, versions and activity stay here for your records and for Finance. Copy it to a new period to sell it again.",
      bodyAr: "لا يمكن تعديل شيء. تبقى الحجوزات والإصدارات والنشاط هنا لسجلاتك وللمالية. انسخه إلى فترة جديدة لبيعه مجددًا.",
    },
    stats: [
      { label: "Confirmed bookings", labelAr: "الحجوزات المؤكدة", value: "58", hint: "all checked out", hintAr: "غادروا جميعًا" },
      { label: "Cancelled", labelAr: "الملغاة", value: "3", hint: "under the contract policy", hintAr: "وفق سياسة العقد" },
      { label: "Occupancy", labelAr: "الإشغال", value: "92%", hint: "of 186 room-nights (rooms × nights)", hintAr: "من ١٨٦ ليلة-غرفة (غرف × ليالٍ)" },
      { label: "Versions", labelAr: "الإصدارات", value: "2", hint: "v1.0 → v1.1", hintAr: "v1.0 ← v1.1" },
    ],
  },
  "SC-2025-0211": {
    meta: "terminated 12 Apr 2026 by Abdullrahman Najeh",
    metaAr: "أُنهي في ١٢ أبريل ٢٠٢٦ بواسطة عبدالرحمن ناجح",
    banner: {
      tone: "danger",
      title: "Terminated on 12 Apr 2026 - irreversible",
      titleAr: "أُنهي في ١٢ أبريل ٢٠٢٦ - غير قابل للتراجع",
      body: "Reason: hotel relationship ended. 3 confirmed bookings were honoured to check-out; no new bookings were accepted after termination. Kept for records.",
      bodyAr: "السبب: انتهت العلاقة مع الفندق. احتُرمت ٣ حجوزات مؤكدة حتى المغادرة، ولم تُقبل حجوزات جديدة بعد الإنهاء. محفوظ للسجلات.",
    },
    stats: [
      { label: "Confirmed bookings", labelAr: "الحجوزات المؤكدة", value: "3", hint: "honoured after termination", hintAr: "احتُرمت بعد الإنهاء" },
      { label: "Declined after", labelAr: "المرفوضة بعده", value: "0", hint: "no new requests", hintAr: "لا طلبات جديدة" },
      { label: "Terminated by", labelAr: "أنهاه", value: "Abdullrahman", hint: "12 Apr 2026 · 16:20", hintAr: "١٢ أبريل ٢٠٢٦ · ١٦:٢٠" },
      { label: "Versions", labelAr: "الإصدارات", value: "1", hint: "v1.0", hintAr: "v1.0" },
    ],
  },
};

/** The three working modes the active contract can be viewed in. */
export const contractModes = {
  edit: {
    tone: "warning" as const,
    title: "Edit mode · 2 changes held - nothing is live yet",
    titleAr: "وضع التعديل · تعديلان محجوزان - لا شيء يعمل بعد",
    body: "Operational changes go live only after Review & publish. Agents keep seeing v1.3 as published until then.",
    bodyAr: "تعمل التعديلات التشغيلية فقط بعد المراجعة والنشر. ويستمر الوكلاء في رؤية v1.3 المنشور حتى ذلك الحين.",
    actions: ["View changes only", "Discard changes", "Review & publish"],
    actionsAr: ["عرض التعديلات فقط", "تجاهل التعديلات", "المراجعة والنشر"],
  },
  changes: {
    tone: "warning" as const,
    title: "Showing the 2 changed items only",
    titleAr: "\u0639\u0631\u0636 \u0627\u0644\u0639\u0646\u0635\u0631\u064a\u0646 \u0627\u0644\u0645\u064f\u0639\u062f\u0651\u0644\u064a\u0646 \u0641\u0642\u0637",
    body: "Base room \u00b7 weekday cost 400 \u2192 420 SAR. Inventory \u00b7 Stop sale on 14 Sep for Standard Room. Everything else is unchanged.",
    bodyAr:
      "\u0627\u0644\u063a\u0631\u0641\u0629 \u0627\u0644\u0623\u0633\u0627\u0633 \u00b7 \u0633\u0639\u0631 \u0623\u064a\u0627\u0645 \u0627\u0644\u0623\u0633\u0628\u0648\u0639 \u0664\u0660\u0660 \u2192 \u0664\u0662\u0660 \u0631.\u0633. \u0627\u0644\u0645\u062e\u0632\u0648\u0646 \u00b7 \u0625\u064a\u0642\u0627\u0641 \u0627\u0644\u0628\u064a\u0639 \u064a\u0648\u0645 \u0661\u0664 \u0633\u0628\u062a\u0645\u0628\u0631 \u0644\u0644\u063a\u0631\u0641\u0629 \u0627\u0644\u0642\u064a\u0627\u0633\u064a\u0629. \u0648\u0643\u0644 \u0645\u0627 \u0639\u062f\u0627 \u0630\u0644\u0643 \u062f\u0648\u0646 \u062a\u063a\u064a\u064a\u0631.",
    actions: ["Show all sections", "Discard changes", "Review & publish"],
    actionsAr: [
      "\u0639\u0631\u0636 \u0643\u0644 \u0627\u0644\u0623\u0642\u0633\u0627\u0645",
      "\u062a\u062c\u0627\u0647\u0644 \u0627\u0644\u062a\u0639\u062f\u064a\u0644\u0627\u062a",
      "\u0627\u0644\u0645\u0631\u0627\u062c\u0639\u0629 \u0648\u0627\u0644\u0646\u0634\u0631",
    ],
  },
  published: {
    tone: "success" as const,
    title: "Published · 2 changes are live · still v1.3",
    titleAr: "منشور · تعديلان يعملان · ما زال v1.3",
    body: "Base weekday cost 420 SAR from the next booking · Stop sale 14 Sep · Standard Room. Recorded in Activity with your user and time.",
    bodyAr: "سعر أيام الأسبوع الأساسي ٤٢٠ ر.س من الحجز التالي · إيقاف بيع ١٤ سبتمبر · غرفة ستاندرد. مسجّل في النشاط باسمك ووقتك.",
    actions: [] as string[],
    actionsAr: [] as string[],
  },
  amending: {
    tone: "info" as const,
    title: "Amending the commercial contract · v1.4 draft · effective from 01 Oct 2026",
    titleAr: "تعديل تعاقدي · مسودة v1.4 · سارية من ١ أكتوبر ٢٠٢٦",
    body: "Term extended to 30 Sep 2027. v1.3 keeps selling until the effective date; bookings confirmed before it keep v1.3 (snapshot). Nothing changes for agents until you publish.",
    bodyAr: "مُدّدت المدة حتى ٣٠ سبتمبر ٢٠٢٧. ويستمر v1.3 في البيع حتى تاريخ السريان، وتحتفظ الحجوزات المؤكدة قبله بـv1.3. ولا يتغير شيء للوكلاء حتى تنشر.",
    actions: ["Discard amendment", "Review & publish v1.4"],
    actionsAr: ["تجاهل التعديل", "مراجعة ونشر v1.4"],
  },
};

export interface QueueRequest {
  id: string;
  agent: string;
  agentAr: string;
  stay: string;
  stayAr: string;
  room: string;
  roomAr: string;
  guests: string;
  guestsAr: string;
  cost: string;
  held: number;
  timeLeft: string;
  pastSla?: boolean;
}

/** The six waiting requests in Figma UI 03.23. */
export const onRequestQueue: QueueRequest[] = [
  { id: "HTL-9241", agent: "Al Rajhi Travel", agentAr: "الراجحي للسفر", stay: "13 - 16 Sep · 3 nights", stayAr: "١٣ - ١٦ سبتمبر · ٣ ليالٍ", room: "Standard Room · Room Only", roomAr: "غرفة ستاندرد · الغرفة فقط", guests: "2 adults", guestsAr: "بالغان", cost: "1,200 SAR", held: 1, timeLeft: "Past SLA", pastSla: true },
  { id: "HTL-9238", agent: "Noor Umrah", agentAr: "نور العمرة", stay: "14 - 15 Sep · 1 night", stayAr: "١٤ - ١٥ سبتمبر · ليلة", room: "Deluxe Haram View · Bed & Breakfast", roomAr: "ديلوكس إطلالة الحرم · إفطار", guests: "3 adults", guestsAr: "٣ بالغين", cost: "905 SAR", held: 1, timeLeft: "04:50" },
  { id: "HTL-9236", agent: "Safar Hub", agentAr: "سفر هَب", stay: "18 - 20 Sep · 2 nights", stayAr: "١٨ - ٢٠ سبتمبر · ليلتان", room: "Deluxe Haram View · Half Board", roomAr: "ديلوكس إطلالة الحرم · نصف إقامة", guests: "4 adults", guestsAr: "٤ بالغين", cost: "1,700 SAR", held: 1, timeLeft: "11:32" },
  { id: "HTL-9233", agent: "Diyafa Tours", agentAr: "ضيافة تورز", stay: "19 - 22 Sep · 3 nights", stayAr: "١٩ - ٢٢ سبتمبر · ٣ ليالٍ", room: "Deluxe City View · Bed & Breakfast", roomAr: "ديلوكس إطلالة المدينة · إفطار", guests: "2 adults · 1 child", guestsAr: "بالغان · طفل", cost: "1,300 SAR", held: 1, timeLeft: "18:07" },
  { id: "HTL-9230", agent: "Al Rajhi Travel", agentAr: "الراجحي للسفر", stay: "20 - 21 Sep · 1 night", stayAr: "٢٠ - ٢١ سبتمبر · ليلة", room: "Standard Room · Half Board", roomAr: "غرفة ستاندرد · نصف إقامة", guests: "2 adults", guestsAr: "بالغان", cost: "520 SAR", held: 1, timeLeft: "21:14" },
  { id: "HTL-9227", agent: "Noor Umrah", agentAr: "نور العمرة", stay: "22 - 24 Sep · 2 nights", stayAr: "٢٢ - ٢٤ سبتمبر · ليلتان", room: "Deluxe City View · Room Only", roomAr: "ديلوكس إطلالة المدينة · الغرفة فقط", guests: "3 adults", guestsAr: "٣ بالغين", cost: "1,000 SAR", held: 1, timeLeft: "26:40" },
];

export interface PerRoomStock {
  room: string;
  roomAr: string;
  rooms: string;
  roomsAr: string;
  draws: string;
  drawsAr: string;
}

/** UI 03.1N — each room type carries its own number of rooms a night. */
export const perRoomStock: PerRoomStock[] = [
  { room: "Standard Room", roomAr: "غرفة ستاندرد", rooms: "20", roomsAr: "٢٠", draws: "3 meal plans · Room Only · B&B · Half Board", drawsAr: "٣ خطط وجبات · بدون وجبات · إفطار · نصف إقامة" },
  { room: "Deluxe Room City View", roomAr: "ديلوكس إطلالة المدينة", rooms: "12", roomsAr: "١٢", draws: "3 meal plans", drawsAr: "٣ خطط وجبات" },
  { room: "Deluxe Room Partial Haram View", roomAr: "ديلوكس إطلالة جزئية على الحرم", rooms: "8", roomsAr: "٨", draws: "4 meal plans", drawsAr: "٤ خطط وجبات" },
];

export interface FixedPriceRoom {
  room: string;
  roomAr: string;
  meal: string;
  mealAr: string;
  weekday: string;
  weekdayAr: string;
  weekend: string;
  weekendAr: string;
  added?: boolean;
}

/** UI 03.1O / 03.1O2 — a fixed-price contract prices each room outright. */
export const fixedPriceRooms: FixedPriceRoom[] = [
  { room: "Standard Room", roomAr: "غرفة ستاندرد", meal: "Room Only · City View", mealAr: "بدون وجبات · إطلالة المدينة", weekday: "400 SAR", weekdayAr: "٤٠٠ ر.س", weekend: "500 SAR", weekendAr: "٥٠٠ ر.س" },
  { room: "Standard Room", roomAr: "غرفة ستاندرد", meal: "Bed & Breakfast · City View", mealAr: "إفطار · إطلالة المدينة", weekday: "490 SAR", weekdayAr: "٤٩٠ ر.س", weekend: "590 SAR", weekendAr: "٥٩٠ ر.س" },
  { room: "Standard Room", roomAr: "غرفة ستاندرد", meal: "Half Board · Haram View", mealAr: "نصف إقامة · إطلالة الحرم", weekday: "640 SAR", weekdayAr: "٦٤٠ ر.س", weekend: "740 SAR", weekendAr: "٧٤٠ ر.س" },
  { room: "Standard Room", roomAr: "غرفة ستاندرد", meal: "Bed & Breakfast · Haram View", mealAr: "إفطار · إطلالة الحرم", weekday: "610 SAR", weekdayAr: "٦١٠ ر.س", weekend: "710 SAR", weekendAr: "٧١٠ ر.س", added: true },
  { room: "Deluxe Room", roomAr: "غرفة ديلوكس", meal: "Bed & Breakfast · City View", mealAr: "إفطار · إطلالة المدينة", weekday: "650 SAR", weekdayAr: "٦٥٠ ر.س", weekend: "750 SAR", weekendAr: "٧٥٠ ر.س" },
  { room: "Deluxe Room", roomAr: "غرفة ديلوكس", meal: "Bed & Breakfast · Haram View", mealAr: "إفطار · إطلالة الحرم", weekday: "790 SAR", weekdayAr: "٧٩٠ ر.س", weekend: "890 SAR", weekendAr: "٨٩٠ ر.س" },
  { room: "Family Room", roomAr: "غرفة عائلية", meal: "Room Only · City View", mealAr: "بدون وجبات · إطلالة المدينة", weekday: "620 SAR", weekdayAr: "٦٢٠ ر.س", weekend: "720 SAR", weekendAr: "٧٢٠ ر.س" },
  { room: "Junior Suite", roomAr: "جناح جونيور", meal: "Half Board · Haram View", mealAr: "نصف إقامة · إطلالة الحرم", weekday: "960 SAR", weekdayAr: "٩٦٠ ر.س", weekend: "1,060 SAR", weekendAr: "١٬٠٦٠ ر.س" },
];
