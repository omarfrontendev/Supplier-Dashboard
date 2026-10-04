/**
 * REF 08.R — the permission keys, and the rule that decides what a screen
 * draws when the answer is no.
 *
 * `docs/front-end-states.md` §0.5, the two rules that matter:
 *
 *   1. "الشرط بيتفحص بالمفتاح مش باسم الدور" — a screen asks
 *      `can("rates.publish")`, never `role === "finance"`. A custom role
 *      (UI 08.20-08.25) carries keys and no role name at all, so a name test
 *      silently locks those people out of work they are allowed to do.
 *
 *   2. "مخفي غير مقفول" — hidden, not disabled. Cannot see: the element is
 *      not drawn. Can see but not act: the value stays, the control goes, and
 *      a line takes its place naming who can. "زرار Disabled من غير شرح
 *      ممنوع" - a disabled button with no explanation is forbidden.
 *
 * Provenance of each key is marked below: `§0.5` and `§07` are named in the
 * specification itself, `OV 08.21` is a tick in the role overlay, and
 * `portal` is an action the built screens gate. REF 08.R says the count is
 * 31; `roadmap.md` records that the exact list needs the designer's page.
 */

import type { TeamRole } from "./team-data";

export interface Bi {
  en: string;
  ar: string;
}

const t = (en: string, ar: string): Bi => ({ en, ar });

export type PermissionKey =
  /* Hotels and contracts */
  | "hotels.view"
  | "hotels.request"
  | "contracts.view"
  | "contracts.create"
  | "contracts.edit"
  | "contracts.publish"
  | "contracts.terminate"
  /* Rates and inventory */
  | "rates.view"
  | "rates.edit_draft"
  | "rates.publish"
  | "inventory.edit"
  | "inventory.stop_sale"
  /* Bookings */
  | "bookings.view"
  | "bookings.confirm"
  | "bookings.reject"
  | "bookings.cancel"
  | "bookings.amend"
  | "bookings.view_arrivals"
  | "bookings.view_financial"
  | "bookings.charge_override"
  | "guest.pii"
  /* Finance */
  | "finance.view"
  | "finance.export"
  | "finance.contact"
  | "finance.dispute"
  | "statement.accept"
  | "bank.change"
  /* People */
  | "users.view"
  | "users.invite"
  | "users.change_role"
  | "users.deactivate";

export type PermissionArea =
  | "hotels"
  | "rates"
  | "bookings"
  | "finance"
  | "users";

interface PermissionEntry {
  area: PermissionArea;
  label: Bi;
  /** §0.5 / §07 — the Owner's alone; no role and no custom role can hold it. */
  ownerOnly?: boolean;
  /** Where the key comes from, so the list stays auditable. */
  from: "§0.5" | "§07" | "OV 08.21" | "portal";
}

export const permissionCatalogue: Record<PermissionKey, PermissionEntry> = {
  "hotels.view": { area: "hotels", label: t("See hotels", "رؤية الفنادق"), from: "OV 08.21" },
  "hotels.request": { area: "hotels", label: t("Request a hotel", "طلب فندق"), from: "§0.5" },
  "contracts.view": { area: "hotels", label: t("See contracts", "رؤية العقود"), from: "OV 08.21" },
  "contracts.create": { area: "hotels", label: t("Create a contract", "إنشاء عقد"), from: "portal" },
  "contracts.edit": { area: "hotels", label: t("Edit a contract", "تعديل عقد"), from: "portal" },
  "contracts.publish": { area: "hotels", label: t("Publish a contract", "نشر عقد"), from: "portal" },
  "contracts.terminate": { area: "hotels", label: t("Terminate a contract", "إنهاء عقد"), from: "portal" },

  "rates.view": { area: "rates", label: t("See rates", "رؤية الأسعار"), from: "OV 08.21" },
  "rates.edit_draft": { area: "rates", label: t("Edit rates", "تعديل الأسعار"), from: "OV 08.21" },
  "rates.publish": { area: "rates", label: t("Publish rates", "نشر الأسعار"), from: "§0.5" },
  "inventory.edit": { area: "rates", label: t("Edit inventory", "تعديل المخزون"), from: "OV 08.21" },
  "inventory.stop_sale": { area: "rates", label: t("Stop sale", "إيقاف البيع"), from: "OV 08.21" },

  "bookings.view": { area: "bookings", label: t("See bookings", "رؤية الحجوزات"), from: "OV 08.21" },
  "bookings.confirm": { area: "bookings", label: t("Confirm bookings", "تأكيد الحجوزات"), from: "§0.5" },
  "bookings.reject": { area: "bookings", label: t("Reject bookings", "رفض الحجوزات"), from: "§0.5" },
  "bookings.cancel": { area: "bookings", label: t("Handle cancellations", "معالجة الإلغاءات"), from: "OV 08.21" },
  "bookings.amend": { area: "bookings", label: t("Answer amendments", "الرد على التعديلات"), from: "OV 08.21" },
  "bookings.view_arrivals": { area: "bookings", label: t("See arrivals and guest details", "رؤية الوصول وبيانات الضيف"), from: "OV 08.21" },
  "bookings.view_financial": { area: "bookings", label: t("See booking money", "رؤية مبالغ الحجوزات"), from: "§0.5" },
  "bookings.charge_override": { area: "bookings", label: t("Charge less or waive", "خصم أقل أو إعفاء"), from: "§0.5" },
  /* §0.5 — "مفيش صلاحية تانية بتفتحها ضمنيًا": no other key implies this one. */
  "guest.pii": { area: "bookings", label: t("See guest identity", "رؤية هوية الضيف"), from: "§0.5" },

  "finance.view": { area: "finance", label: t("See finance", "رؤية المالية"), from: "§07" },
  "finance.export": { area: "finance", label: t("Export finance", "تصدير المالية"), from: "§07" },
  "finance.contact": { area: "finance", label: t("Contact about a statement", "التواصل بشأن كشف"), from: "§07" },
  "finance.dispute": { area: "finance", label: t("Dispute a line", "الاعتراض على سطر"), from: "§07" },
  "statement.accept": { area: "finance", label: t("Accept statements and upload invoices", "قبول الكشوف ورفع الفواتير"), ownerOnly: true, from: "§07" },
  "bank.change": { area: "finance", label: t("Change the bank details", "تغيير البيانات البنكية"), ownerOnly: true, from: "§07" },

  "users.view": { area: "users", label: t("See users", "رؤية المستخدمين"), from: "OV 08.21" },
  "users.invite": { area: "users", label: t("Invite people", "دعوة أشخاص"), from: "OV 08.21" },
  "users.change_role": { area: "users", label: t("Change roles", "تغيير الأدوار"), from: "§0.5" },
  "users.deactivate": { area: "users", label: t("Deactivate people", "تعطيل الأشخاص"), from: "§0.5" },
};

export const permissionKeys = Object.keys(
  permissionCatalogue
) as PermissionKey[];

/** The seven built-in roles §0.5 names, and the keys each one holds. */
export const rolePermissions: Record<TeamRole, PermissionKey[]> = {
  /* The Owner holds every key, including the two that are theirs alone. */
  owner: permissionKeys,
  admin: permissionKeys.filter((key) => !permissionCatalogue[key].ownerOnly),
  revenue: [
    "hotels.view",
    "hotels.request",
    "contracts.view",
    "contracts.create",
    "contracts.edit",
    "contracts.publish",
    "rates.view",
    "rates.edit_draft",
    "rates.publish",
    "inventory.edit",
    "inventory.stop_sale",
    "bookings.view",
    "finance.view",
    "users.view",
  ],
  reservations: [
    "hotels.view",
    "contracts.view",
    "rates.view",
    "inventory.stop_sale",
    "bookings.view",
    "bookings.confirm",
    "bookings.reject",
    "bookings.cancel",
    "bookings.amend",
    "bookings.view_arrivals",
    "guest.pii",
    "users.view",
  ],
  frontOffice: [
    "hotels.view",
    "bookings.view",
    "bookings.view_arrivals",
    "guest.pii",
    "users.view",
  ],
  finance: [
    "hotels.view",
    "contracts.view",
    "rates.view",
    "bookings.view",
    "bookings.view_financial",
    "finance.view",
    "finance.export",
    "finance.contact",
    "finance.dispute",
    "users.view",
  ],
  /* UI 08.0 — the Auditor reads, and its reach is set hotel by hotel. */
  auditor: [
    "hotels.view",
    "contracts.view",
    "rates.view",
    "bookings.view",
    "finance.view",
    "users.view",
  ],
};

/**
 * §0.5 — the reason a request was refused, and the screen that says so.
 * Every refusal maps to one of these; nothing else is a valid answer.
 */
export type DenyReason =
  | "missing_permission"
  | "out_of_scope"
  | "state_readonly"
  | "entity_readonly"
  | "account_suspended";

export const denyScreen: Record<DenyReason, string> = {
  missing_permission: "UI 11.4",
  out_of_scope: "UI 11.5",
  state_readonly: "UI 11.6",
  entity_readonly: "UI 11.6",
  account_suspended: "UI 11.14",
};

export interface Viewer {
  role: TeamRole;
  /** A custom role carries keys and no built-in name (UI 08.20-08.25). */
  keys?: PermissionKey[] | undefined;
  /** §0.5 out_of_scope — the hotels this person reaches; `null` is all. */
  hotels?: string[] | null | undefined;
  /** §0.5 — the Auditor and an ended contract are both read only. */
  readOnly?: boolean | undefined;
  suspended?: boolean | undefined;
}

export interface Ask {
  hotel?: string | undefined;
  /** UI 11.6 — this particular record cannot be written, whoever asks. */
  entityReadOnly?: boolean | undefined;
}

/** The keys a viewer actually holds: a custom list wins over the role. */
export function keysOf(viewer: Viewer): PermissionKey[] {
  return viewer.keys ?? rolePermissions[viewer.role];
}

const writes = new Set<PermissionKey>(
  permissionKeys.filter(
    (key) => !/\.(view|view_arrivals|view_financial)$/.test(key) && key !== "guest.pii"
  )
);

/**
 * `null` when the viewer may do it, otherwise the reason §0.5 requires - so
 * the caller can print the right screen rather than inventing a message.
 */
export function denyReason(
  viewer: Viewer,
  key: PermissionKey,
  ask: Ask = {}
): DenyReason | null {
  if (viewer.suspended) return "account_suspended";
  if (!keysOf(viewer).includes(key)) return "missing_permission";
  if (ask.hotel && viewer.hotels && !viewer.hotels.includes(ask.hotel)) {
    return "out_of_scope";
  }
  if (writes.has(key)) {
    if (ask.entityReadOnly) return "entity_readonly";
    if (viewer.readOnly) return "state_readonly";
  }
  return null;
}

export function can(viewer: Viewer, key: PermissionKey, ask: Ask = {}): boolean {
  return denyReason(viewer, key, ask) === null;
}

/**
 * §0.5 — "الزرار يتشال ومكانه سطر Only the Owner or an Admin can …".
 * The line names whoever can, so it is built from the roles that hold the
 * key rather than written by hand at each call site.
 */
export function whoCan(key: PermissionKey): TeamRole[] {
  return (Object.keys(rolePermissions) as TeamRole[]).filter((role) =>
    rolePermissions[role].includes(key)
  );
}
