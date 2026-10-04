/**
 * §0.7 / REF 10.R — the sellability engine, as one list.
 *
 * "كل ليلة × غرفة ليها قايمة blockers[]. القايمة فاضية يبقى الليلة بتتباع.
 *  كل الشاشات بتقرا نفس القايمة: التقويم، و'ليه مش بيتباع'، والداشبورد،
 *  والـ API. مفيش شاشة بتحسب السبب بنفسها."
 *
 * That last sentence is the whole point. Before this, the calendar, the
 * sell-status drawer and the dashboard each decided for themselves why a
 * night was not selling, and three screens deciding separately is three
 * chances to disagree. They now read this.
 *
 * Two orderings matter and they are different:
 *
 *   BR-10-29  the badge shows one blocker, by priority.
 *   BR-10-28  the drawer shows them all, grouped by who can clear them:
 *             you first, then Hoteliana, then structural.
 */

export interface Bi {
  en: string;
  ar: string;
}

const t = (en: string, ar: string): Bi => ({ en, ar });

export type BlockerCode =
  | "HOTELIANA_PAUSED"
  | "ACCESS_NOT_APPROVED"
  | "ROOM_NOT_MAPPED"
  | "SUPPLIER_HOTEL_INACTIVE"
  | "MORE_INFO_REQUIRED"
  | "CONTRACT_EXPIRED"
  | "CONTRACT_TERMINATED"
  | "OUTSIDE_CONTRACT_TERM"
  | "NOT_ON_CONTRACT"
  | "CONFIRMATION_MODE_INVALID"
  | "NO_RATE"
  | "NO_INVENTORY"
  | "STOP_SALE"
  | "OVERBOOKING_RULE"
  | "RELEASE_PASSED"
  | "BOOKING_WINDOW_CLOSED"
  | "RESTRICTION_FAILED"
  | "SUPPLIER_FULFILMENT_INCIDENT";

/** BR-10-28 — the three sections UI 10.5 draws, in this order. */
export type ClearedBy = "supplier" | "hoteliana" | "structural";

export interface BlockerSpec {
  code: BlockerCode;
  name: Bi;
  means: Bi;
  clearedBy: ClearedBy;
  /** The button UI 10.5 puts on the row, and where it goes. */
  action: Bi;
  to: string;
}

/**
 * The table REF 10.C prints, in the engine's own priority order. The array
 * order *is* BR-10-29's badge priority, so a night's badge is simply the
 * first of its blockers found here - no screen re-sorts them.
 */
export const blockerTable: BlockerSpec[] = [
  {
    code: "HOTELIANA_PAUSED",
    name: t("Paused by Hoteliana", "موقوف من هوتيليانا"),
    means: t(
      "Hoteliana paused selling on some scope that covers this night.",
      "أوقفت هوتيليانا البيع على نطاق يشمل هذه الليلة."
    ),
    clearedBy: "hoteliana",
    action: t("Open the pause", "افتح الإيقاف"),
    to: "/sell-status",
  },
  {
    code: "ACCESS_NOT_APPROVED",
    name: t("Hotel access not approved yet", "لم يُقبل الوصول للفندق بعد"),
    means: t(
      "Hoteliana has not approved your request for this hotel.",
      "لم تقبل هوتيليانا طلبك على هذا الفندق."
    ),
    clearedBy: "hoteliana",
    action: t("Open the request", "افتح الطلب"),
    to: "/requests",
  },
  {
    code: "ROOM_NOT_MAPPED",
    name: t("Room is not mapped yet", "الغرفة غير مربوطة بعد"),
    means: t(
      "The room is not linked to the hotel's own catalogue.",
      "الغرفة غير مربوطة بكتالوج الفندق."
    ),
    clearedBy: "hoteliana",
    action: t("Follow up", "تابع"),
    to: "/requests",
  },
  {
    code: "SUPPLIER_HOTEL_INACTIVE",
    name: t("Hotel is not active with you", "الفندق غير نشط معك"),
    means: t(
      "The relationship with this hotel is not active.",
      "العلاقة بهذا الفندق غير نشطة."
    ),
    clearedBy: "structural",
    action: t("Open the hotel", "افتح الفندق"),
    to: "/my-hotels",
  },
  {
    code: "MORE_INFO_REQUIRED",
    name: t("More information needed", "مطلوب معلومات إضافية"),
    means: t(
      "Hoteliana has an open request for a correction.",
      "لدى هوتيليانا طلب تصحيح مفتوح."
    ),
    clearedBy: "supplier",
    action: t("Open the request", "افتح الطلب"),
    to: "/information-requests",
  },
  {
    code: "CONTRACT_TERMINATED",
    name: t("Contract was terminated", "أُنهي العقد"),
    means: t("Ended early, and for good.", "أُنهي مبكرًا ونهائيًا."),
    clearedBy: "structural",
    action: t("Open the contract", "افتح العقد"),
    to: "/rate-contracts",
  },
  {
    code: "CONTRACT_EXPIRED",
    name: t("Contract has ended", "انتهى العقد"),
    means: t("The term ran out on its own date.", "انتهت المدة في تاريخها."),
    clearedBy: "structural",
    action: t("Renew for a new period", "جدّد لفترة جديدة"),
    to: "/rate-contracts",
  },
  {
    code: "OUTSIDE_CONTRACT_TERM",
    name: t("Night is outside the contract term", "الليلة خارج مدة العقد"),
    means: t("The stay date is outside the term.", "تاريخ الإقامة خارج المدة."),
    clearedBy: "structural",
    action: t("Renew the term", "جدّد المدة"),
    to: "/rate-contracts",
  },
  {
    code: "NOT_ON_CONTRACT",
    name: t("Not on the contract", "غير مدرجة في العقد"),
    means: t(
      "The room, or this view and board, is not offered on the contract.",
      "الغرفة، أو هذه الإطلالة والوجبة، غير معروضة في العقد."
    ),
    clearedBy: "supplier",
    action: t("Open Rooms", "افتح الغرف"),
    to: "/rate-contracts",
  },
  {
    code: "CONFIRMATION_MODE_INVALID",
    name: t("Confirmation mode does not match", "طريقة التأكيد غير متطابقة"),
    means: t(
      "The confirmation mode, or the On Request SLA, is not set.",
      "طريقة التأكيد أو مهلة «عند الطلب» غير محدّدة."
    ),
    clearedBy: "structural",
    action: t("Open confirmation", "افتح التأكيد"),
    to: "/rate-contracts",
  },
  {
    code: "NO_RATE",
    name: t("No price set", "لا سعر محدد"),
    means: t("No price on these nights.", "لا سعر على هذه الليالي."),
    clearedBy: "supplier",
    action: t("Open rates", "افتح الأسعار"),
    to: "/rate-calendar",
  },
  {
    code: "NO_INVENTORY",
    name: t("No rooms left", "لا غرف متبقية"),
    means: t("Inventory is at zero.", "المخزون صفر."),
    clearedBy: "supplier",
    action: t("Open inventory", "افتح المخزون"),
    to: "/rate-calendar",
  },
  {
    code: "STOP_SALE",
    name: t("Stopped by you", "موقوف منك"),
    means: t(
      "A stop sale you set, or one that came from a case.",
      "إيقاف بيع وضعته، أو جاء من قضية."
    ),
    clearedBy: "supplier",
    action: t("Lift stop sale", "ارفع إيقاف البيع"),
    to: "/rate-calendar",
  },
  {
    code: "OVERBOOKING_RULE",
    name: t("Overbooking rule", "قاعدة الحجز الزائد"),
    means: t("A sold-out rule closed the night.", "أغلقت قاعدة النفاد الليلة."),
    clearedBy: "supplier",
    action: t("Open inventory & confirmation", "افتح المخزون والتأكيد"),
    to: "/rate-calendar",
  },
  {
    code: "RELEASE_PASSED",
    name: t("Release date passed", "مرّ تاريخ الإصدار"),
    means: t("The release or the cut-off has gone by.", "مرّ الإصدار أو موعد القطع."),
    clearedBy: "supplier",
    action: t("Open release & cut-off", "افتح الإصدار والقطع"),
    to: "/rate-contracts",
  },
  {
    code: "BOOKING_WINDOW_CLOSED",
    name: t("Booking window closed", "أُغلقت نافذة الحجز"),
    means: t(
      "The stay date is outside the booking window.",
      "تاريخ الإقامة خارج نافذة الحجز."
    ),
    clearedBy: "supplier",
    action: t("Open booking window", "افتح نافذة الحجز"),
    to: "/rate-contracts",
  },
  {
    code: "RESTRICTION_FAILED",
    name: t("A restriction blocks it", "يمنعها قيد"),
    means: t(
      "MinLOS, MaxLOS, CTA, CTD, a compulsory stay, or the whole period.",
      "أقل إقامة أو أطولها، أو منع الوصول أو المغادرة، أو إقامة إجبارية، أو الفترة كاملة."
    ),
    clearedBy: "supplier",
    action: t("Open restrictions", "افتح القيود"),
    to: "/rate-contracts",
  },
  {
    code: "SUPPLIER_FULFILMENT_INCIDENT",
    name: t("An open incident", "حادثة مفتوحة"),
    means: t(
      "A fulfilment incident is open on this room.",
      "حادثة تنفيذ مفتوحة على هذه الغرفة."
    ),
    clearedBy: "hoteliana",
    action: t("Open the case", "افتح القضية"),
    to: "/cases",
  },
];

const byCode = new Map(blockerTable.map((spec) => [spec.code, spec]));
const priority = new Map(blockerTable.map((spec, index) => [spec.code, index]));

export function blockerSpec(code: BlockerCode): BlockerSpec {
  return byCode.get(code)!;
}

/** §0.7 — an empty list means the night sells. Nothing else does. */
export function sells(blockers: readonly BlockerCode[]): boolean {
  return blockers.length === 0;
}

/** BR-10-29 — the one the badge shows. */
export function firstBlocker(
  blockers: readonly BlockerCode[]
): BlockerCode | null {
  if (blockers.length === 0) return null;
  return [...blockers].sort(
    (a, b) => (priority.get(a) ?? 99) - (priority.get(b) ?? 99)
  )[0]!;
}

/** BR-10-28 — all of them, in the three sections, in the guide's order. */
export function groupBlockers(
  blockers: readonly BlockerCode[]
): Array<{ clearedBy: ClearedBy; items: BlockerSpec[] }> {
  const order: ClearedBy[] = ["supplier", "hoteliana", "structural"];
  return order
    .map((clearedBy) => ({
      clearedBy,
      items: blockerTable.filter(
        (spec) => spec.clearedBy === clearedBy && blockers.includes(spec.code)
      ),
    }))
    /* "القسم الفاضي مايظهرش" — an empty section is not drawn. */
    .filter((section) => section.items.length > 0);
}

export const blockerCopy = {
  supplier: t("You can clear these now", "يمكنك رفع هذه الآن"),
  hoteliana: t("Hoteliana must clear these", "على هوتيليانا رفع هذه"),
  structural: t(
    "Structural - the contract has to change",
    "هيكلي — يجب تغيير العقد"
  ),
  sells: t("Selling", "يُباع"),
  notSelling: t("Not selling", "لا يُباع"),
  /* BR-10-28 — the count the section heading carries. */
  count: t("{n} of {total}", "{n} من {total}"),
  /* The whole point of the engine, said once on the drawer. */
  oneList: t(
    "Every screen reads this same list - the calendar, this drawer, the dashboard and the API.",
    "كل الشاشات تقرأ هذه القائمة نفسها — التقويم وهذا الدرج والداشبورد والواجهة البرمجية."
  ),
  allClear: t(
    "Seven blocks, all inside your own screens.",
    "سبعة موانع، كلها داخل شاشاتك."
  ),
} as const;
