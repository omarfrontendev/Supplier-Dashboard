/**
 * BR-07-10 — the three payment terms a contract can carry, and BR-07-11's
 * rule that a booking keeps the one it was confirmed on.
 *
 *   After check-out   the booking joins the month's statement and is paid
 *                     N days from the statement date (15 by default).
 *   On arrival        paid on the day the guest checks in, in that day's run.
 *   On booking        paid on the day it is confirmed, in that day's run.
 *
 * BR-07-12: the portal never edits a term. It belongs to the contract, so
 * changing one is a conversation with the account manager.
 */

export interface Bi {
  en: string;
  ar: string;
}

const t = (en: string, ar: string): Bi => ({ en, ar });

export type PaymentTerm = "afterCheckout" | "onArrival" | "onBooking";

/**
 * Which term a booking was confirmed on. The demo spreads the three across
 * the seeded bookings; a real portal reads the snapshot on the booking.
 */
const SNAPSHOT: Record<string, PaymentTerm> = {
  "HTL-88205": "afterCheckout",
  "HTL-88198": "afterCheckout",
  "HTL-88190": "onArrival",
  "HTL-88176": "afterCheckout",
  "HTL-88160": "onBooking",
  "HTL-88104": "afterCheckout",
};

export function termOf(bookingId: string): PaymentTerm {
  return SNAPSHOT[bookingId] ?? "afterCheckout";
}

export const earningsCopy = {
  title: t("Earnings", "الأرباح"),
  subtitle: t(
    "Every confirmed booking and what it earns, grouped by the payment term it was confirmed on.",
    "كل حجز مؤكد وما يدرّه، مجموعًا بشرط الدفع الذي أُكّد عليه."
  ),
  termLabel: t("Payment term", "شرط الدفع"),
  allTerms: t("All terms", "كل الشروط"),
  afterCheckout: t("After check-out", "بعد المغادرة"),
  onArrival: t("On arrival", "عند الوصول"),
  onBooking: t("On booking", "عند الحجز"),
  colBooking: t("BOOKING", "الحجز"),
  colHotel: t("HOTEL", "الفندق"),
  colStay: t("STAY", "الإقامة"),
  colTerm: t("TERM", "الشرط"),
  colAmount: t("EARNS · INCL. VAT", "يدرّ · شامل الضريبة"),
  open: t("Open", "افتح"),
  total: t("Total", "الإجمالي"),
  /* BR-07-11 — the term is the booking's, not the contract's. */
  snapshotNote: t(
    "Each booking keeps the term it was confirmed on.",
    "يحتفظ كل حجز بالشرط الذي أُكّد عليه."
  ),
  /* BR-07-12 / BR-07-13 — what the statement gathers, and who changes a term. */
  termsNote: t(
    "Only After check-out bookings join the monthly statement. On arrival and On booking are paid in their own daily run. To change a term, talk to your account manager - it changes the contract.",
    "لا تدخل الكشف الشهري إلا حجوزات «بعد المغادرة». أمّا «عند الوصول» و«عند الحجز» فتُدفع في دفعتها اليومية. ولتغيير شرط، حدّث مدير حسابك — فهو يغيّر العقد."
  ),
} as const;

export const bankCopy = {
  title: t("Bank & payment terms", "البنك وشروط الدفع"),
  subtitle: t(
    "Where Hoteliana sends your money, and on what terms. Read only.",
    "إلى أين ترسل هوتيليانا مالك، وبأي شروط. للقراءة فقط."
  ),
  bankSection: t("Bank account", "الحساب البنكي"),
  holder: t("Account holder", "صاحب الحساب"),
  bank: t("Bank", "البنك"),
  iban: t("IBAN", "الآيبان"),
  currency: t("Currency", "العملة"),
  termsSection: t("Payment terms, per contract", "شروط الدفع لكل عقد"),
  colContract: t("CONTRACT", "العقد"),
  colHotels: t("HOTELS", "الفنادق"),
  colTerm: t("TERM", "الشرط"),
  colWhen: t("WHEN IT IS PAID", "متى يُدفع"),
  /* BR-07-34 — the log never holds a full IBAN. */
  ibanNote: t(
    "Only the last four digits are shown, here and in the activity log.",
    "لا تظهر إلا الأرقام الأربعة الأخيرة، هنا وفي سجل النشاط."
  ),
  /* BR-07-12 — a term is the contract's, so the portal cannot edit it. */
  termsNote: t(
    "To change a term, talk to your account manager - it changes the contract.",
    "لتغيير شرط، حدّث مدير حسابك — فهو يغيّر العقد."
  ),
  /* Owner only, and a call to confirm (OV 07.36). */
  changeBank: t("Ask to change the bank", "اطلب تغيير البنك"),
  changeNote: t(
    "We will call the owner to confirm.",
    "سنتصل بالمالك للتأكيد."
  ),
} as const;

export const bankDetails = {
  holder: t("Jewar Al-Safwah for Hospitality", "جوار الصفوة للضيافة"),
  bank: t("Al Rajhi Bank", "مصرف الراجحي"),
  /* BR-07-34 — masked, always. */
  iban: "SA•• •••• •••• •••• •••• 4417",
  currency: "SAR",
  contracts: [
    {
      name: t("Makkah Annual Block", "حصة مكة السنوية"),
      hotels: t("Al Noor Makkah Hotel", "فندق النور مكة"),
      term: "afterCheckout" as PaymentTerm,
      when: t("15 days from the statement date", "١٥ يومًا من تاريخ الكشف"),
    },
    {
      name: t("Makkah Rooms Block", "تكتلة غرف مكة"),
      hotels: t("Central Haram Hotel", "فندق الحرم المركزي"),
      term: "onArrival" as PaymentTerm,
      when: t("On the day the guest checks in", "يوم دخول النزيل"),
    },
    {
      name: t("Madinah Winter", "شتاء المدينة"),
      hotels: t("Makkah Grand Suites", "أجنحة مكة الكبرى"),
      term: "onBooking" as PaymentTerm,
      when: t("On the day it is confirmed", "يوم تأكيده"),
    },
  ],
};
