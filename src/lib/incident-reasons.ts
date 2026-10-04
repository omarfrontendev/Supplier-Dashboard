/**
 * OV 10.6 — why a confirmed booking cannot be honoured.
 *
 * Flow 12 rewrote this list on 26 Sep (BR-10-37) and added a fourth reason.
 * The old sheet offered "No availability / Rate error / Other", which is not
 * the same question: a rate error is a finance dispute, not a fulfilment
 * incident, and "no availability" hides which of three quite different
 * things went wrong.
 *
 * The codes are Hoteliana's own setting, so they are written out rather
 * than derived from the label - the label may be reworded; the code is what
 * the case carries.
 */

export interface Bi {
  en: string;
  ar: string;
}

const t = (en: string, ar: string): Bi => ({ en, ar });

export type IncidentReason =
  | "hotel_overbooked"
  | "room_out_of_service"
  | "hotel_closed"
  | "guest_nationality_differs";

export const incidentReasons: Array<{
  code: IncidentReason;
  label: Bi;
  means: Bi;
}> = [
  {
    code: "hotel_overbooked",
    label: t("The hotel is overbooked", "الفندق محجوز زيادة"),
    means: t(
      "The hotel cannot provide the rooms we hold.",
      "لا يستطيع الفندق توفير الغرف المحجوزة لدينا."
    ),
  },
  {
    code: "room_out_of_service",
    label: t("The room is out of service", "الغرفة خارج الخدمة"),
    means: t(
      "Maintenance, damage or a closed floor.",
      "صيانة أو تلف أو دور مغلق."
    ),
  },
  {
    code: "hotel_closed",
    label: t("The hotel is closed", "الفندق مغلق"),
    means: t(
      "Closure, renovation or an official instruction.",
      "إغلاق أو تجديد أو تعليمات رسمية."
    ),
  },
  {
    code: "guest_nationality_differs",
    label: t("Guest nationality differs", "جنسية النزيل مختلفة"),
    means: t(
      "The guest's passport is from a different country than the booking. The agent pays the price difference.",
      "جواز النزيل من بلد غير البلد المذكور في الحجز. ويدفع الوكيل فرق السعر."
    ),
  },
];

export const incidentCopy = {
  pick: t("WHY IT CANNOT BE HONOURED · REQUIRED", "لماذا لا يمكن تنفيذه · مطلوب"),
  /* BR-10-36 - one open incident per booking, and never on a booking that
     is already cancelled, rejected, or whose stay has ended. */
  onePerBooking: t(
    "One open report per booking.",
    "بلاغ مفتوح واحد لكل حجز."
  ),
} as const;
