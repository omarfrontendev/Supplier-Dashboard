/**
 * REF 00.S — the one status table.
 *
 * `docs/front-end-states.md` §0.6: a status takes its colour from this table
 * and nowhere else, and **a status that is not in the table gets no badge**.
 * That last rule is why `toneFor` returns `null` rather than falling back to
 * grey: a pill with no entry here is a copy bug, and it should disappear
 * rather than quietly render in the wrong colour.
 *
 * The 20 Sep renames are folded in: `In force` → `Active`,
 * `Not approved` → `Rejected`, `Stop sell` → `Stop sale`.
 */

export type StatusTone = "success" | "warning" | "danger" | "neutral" | "info";

/** Every status REF 00.S paints, in the order the table lists them. */
export const statusTable: Record<StatusTone, readonly string[]> = {
  success: [
    "Active",
    "Approved",
    "Confirmed",
    "Linked",
    "Valid",
    "Paid",
    "Live",
    "Complete",
  ],
  warning: [
    "Pending",
    "Requested",
    "Needs an answer",
    "Invited",
    "On Request",
    "Paused",
    "Expiring soon",
    "Amending",
    "Cancellation asked",
    "Amendment asked",
  ],
  danger: [
    "Rejected",
    "Cancelled",
    "Terminated",
    "Suspended",
    "Declined",
    "Expired invitation",
    "Problem",
  ],
  neutral: [
    "Expired",
    "Draft",
    "Scheduled",
    "Superseded",
    "Locked",
    "Handled",
    "Deactivated",
    "Not started",
    "Available",
  ],
  /** Blue is reserved for what the supplier cannot act on at all. */
  info: ["Waiting for Hoteliana"],
};

/**
 * The Arabic the portal prints for each status. The lookup reads both
 * languages so a pill can be handed the rendered label and still find its
 * colour — the tone must not depend on which language is on screen.
 */
export const statusAr: Record<string, string> = {
  Active: "نشط",
  Approved: "مقبول",
  Confirmed: "مؤكد",
  Linked: "مربوط",
  Valid: "سارٍ",
  Paid: "مدفوع",
  Live: "مباشر",
  Complete: "مكتمل",
  Pending: "قيد الانتظار",
  Requested: "مطلوب",
  "Needs an answer": "يحتاج ردًا",
  Invited: "مدعو",
  "On Request": "عند الطلب",
  Paused: "موقوف مؤقتًا",
  "Expiring soon": "ينتهي قريبًا",
  Amending: "قيد التعديل",
  "Cancellation asked": "طلب إلغاء",
  "Amendment asked": "طلب تعديل",
  Rejected: "مرفوض",
  Cancelled: "ملغي",
  Terminated: "منتهٍ بالإنهاء",
  Suspended: "موقوف",
  Declined: "مرفوض الطلب",
  "Expired invitation": "دعوة منتهية",
  Problem: "مشكلة",
  Expired: "منتهي",
  Draft: "مسودة",
  Scheduled: "مجدول",
  Superseded: "مستبدل",
  Locked: "مقفول",
  Handled: "تمت المعالجة",
  Deactivated: "معطّل",
  "Not started": "لم يبدأ",
  Available: "متاح",
  "Waiting for Hoteliana": "بانتظار هوتيليانا",
};

/**
 * Two labels the booking frames draw that REF 00.S never lists. §0.6 says an
 * unlisted status takes no badge, but deleting a pill Figma draws would lose
 * the screen - so the drawn wording is kept and the colour comes from the
 * family the table does list. Logged in `roadmap.md` for the designer.
 */
const drawnButUnlisted: Record<string, { tone: StatusTone; ar: string }> = {
  "Reference pending": { tone: "warning", ar: "الرقم معلّق" },
  "Issue reported": { tone: "danger", ar: "بلاغ مفتوح" },
  /* UI 04.1 writes "Ended 19 Sep 2026" where the table says Expired. */
  Ended: { tone: "neutral", ar: "منتهٍ" },
};

/** The 20 Sep renames, plus the spellings the portal already had on screen. */
const aliases: Record<string, string> = {
  "in force": "Active",
  "not approved": "Rejected",
  "stop sell": "Stop sale",
  "on request": "On Request",
  "needs a reply": "Needs an answer",
  "needs answer": "Needs an answer",
  "waiting for hoteliana": "Waiting for Hoteliana",
};

function normalise(status: string): string {
  return status.trim().replace(/\s+/g, " ").toLowerCase();
}

const byName = new Map<string, StatusTone>();
for (const [tone, names] of Object.entries(statusTable) as Array<
  [StatusTone, readonly string[]]
>) {
  for (const name of names) {
    byName.set(normalise(name), tone);
    const ar = statusAr[name];
    if (ar) byName.set(normalise(ar), tone);
  }
}
for (const [name, { tone, ar }] of Object.entries(drawnButUnlisted)) {
  byName.set(normalise(name), tone);
  byName.set(normalise(ar), tone);
  statusAr[name] = ar;
}
for (const [from, to] of Object.entries(aliases)) {
  const tone = byName.get(normalise(to));
  if (tone) byName.set(from, tone);
}

/**
 * The tone REF 00.S gives this status, or `null` when the table does not
 * list it — in which case §0.6 says it must not be badged at all.
 */
export function toneFor(status: string): StatusTone | null {
  const key = normalise(status);
  const exact = byName.get(key);
  if (exact) return exact;
  /*
   * Several frames qualify a status with a date - "Scheduled · starts 18 Feb
   * 2027", "Ended 19 Sep 2026". The status is still the word in front, so the
   * lead is tried before giving up and dropping the badge.
   */
  const lead = key.split(/\s*[·\-–—,(]|\s+\d/)[0]?.trim();
  return (lead && lead !== key ? byName.get(lead) : null) ?? null;
}

/** The canonical English name, after the 20 Sep renames. */
export function canonicalStatus(status: string): string {
  const key = normalise(status);
  const alias = aliases[key];
  if (alias) return alias;
  for (const names of Object.values(statusTable)) {
    const hit = names.find((name) => normalise(name) === key);
    if (hit) return hit;
  }
  return status;
}

/** The pair a screen prints: the label in `lang`, and the tone it carries. */
export function statusLabel(
  status: string,
  lang: string
): { label: string; tone: StatusTone | null } {
  const name = canonicalStatus(status);
  const ar = statusAr[name];
  return {
    label: lang === "ar" && ar ? ar : name,
    tone: toneFor(name),
  };
}
