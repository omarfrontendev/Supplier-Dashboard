/**
 * OV CH.1 — one box that looks everywhere the account is allowed to look.
 *
 * The guide (P1.3) fixes the shape: one field, results grouped as
 * BOOKINGS, RATES & AVAILABILITY, CONTRACTS, CHANGE REQUESTS and HOTELS
 * in that order, five to a group with a way to see the rest, and a group
 * with nothing in it is not drawn at all — an empty heading reads as a
 * broken search rather than as an answer.
 *
 * BR-00-24 governs the guest's name: without `guest.pii` it is neither
 * shown nor searchable. Hiding the column while the search still matches
 * on it hands the name back to whoever guesses it.
 */

import { bookingSeed, type Booking } from "./booking-data";
import { changeRequestSeed } from "./change-request-data";
import { hotels, roomCatalogue, supplyContracts } from "./demo-data";
import { seasonDetails } from "./season-detail-data";
import type { Bi } from "./library-overlay-data";

const t = (en: string, ar: string): Bi => ({ en, ar });

export type Lang = "en" | "ar";
export type HitKind = "booking" | "rate" | "contract" | "change" | "hotel";

export interface Hit {
  kind: HitKind;
  /** The record's own id, which is also how the result is reached. */
  id: string;
  title: string;
  meta: string;
  /** A hotel you have no access to is a library entry, not a page. */
  linked?: boolean;
}

export interface HitGroup {
  kind: HitKind;
  label: string;
  hits: Hit[];
  /** How many matched beyond the five that are shown. */
  more: number;
}

/** The least a search can work with. Shorter than this matches the world. */
export const MIN_CHARS = 2;
const PER_GROUP = 5;

export const searchCopy = {
  title: t("Search everything", "ابحث في كل شيء"),
  body: t(
    "Bookings, change requests, contracts, rates and hotels.",
    "الحجوزات وطلبات التغيير والعقود والأسعار والفنادق."
  ),
  placeholder: t(
    "A reference, a hotel or a contract name",
    "مرجع أو فندق أو اسم عقد"
  ),
  /* The fixed line the guide puts under the box. */
  scope: t(
    "Search only reaches what this account is allowed to. A hotel you have no access to will not appear here - request access from My hotels instead.",
    "يصل البحث إلى ما يُسمح لهذا الحساب به فقط. والفندق الذي لا تملك وصولًا إليه لا يظهر هنا - اطلب الوصول من «فنادقي»."
  ),
  short: t(
    "Type at least two characters.",
    "اكتب حرفين على الأقل."
  ),
  emptyTitle: t("No matches for “{term}”.", "لا نتائج لـ«{term}»."),
  emptyBody: t(
    "Check the reference, or search by hotel or contract name.",
    "تحقق من المرجع، أو ابحث باسم الفندق أو العقد."
  ),
  seeAll: t("See all", "عرض الكل"),
  seeAllCount: t("See all {count}", "عرض الكل · {count}"),
  close: t("Close", "إغلاق"),
  hint: t("Esc closes · Enter opens the first result", "Esc يغلق · Enter يفتح أول نتيجة"),
  groups: {
    booking: t("Bookings", "الحجوزات"),
    rate: t("Rates & availability", "الأسعار والإتاحة"),
    contract: t("Contracts", "العقود"),
    change: t("Change requests", "طلبات التغيير"),
    hotel: t("Hotels", "الفنادق"),
  } as Record<HitKind, Bi>,
};

const has = (haystack: string, needle: string) =>
  haystack.toLowerCase().includes(needle);

/**
 * Every group, in the guide's order, with the empty ones left out.
 * `seesGuest` is `can("guest.pii")` at the call site.
 */
export function searchPortal(
  raw: string,
  { lang, seesGuest }: { lang: Lang; seesGuest: boolean }
): HitGroup[] {
  const term = raw.trim().toLowerCase();
  if (term.length < MIN_CHARS) return [];
  const ar = lang === "ar";

  const bookingHits: Hit[] = bookingSeed
    .filter((booking: Booking) =>
      has(
        [
          booking.id,
          booking.hotel,
          booking.hotelAr,
          booking.room,
          /* BR-00-24 - the name is only searchable to whoever may read it. */
          ...(seesGuest ? [booking.guest, booking.guestAr] : []),
        ].join(" "),
        term
      )
    )
    .map((booking: Booking) => ({
      kind: "booking" as const,
      id: booking.id,
      title: seesGuest
        ? `${booking.id} · ${ar ? booking.guestAr : booking.guest}`
        : booking.id,
      meta: [
        ar ? booking.hotelAr : booking.hotel,
        ar ? booking.stayAr : booking.stay,
        ar ? booking.offerAr : booking.offer,
      ].join(" · "),
    }));

  const rateHits: Hit[] = [
    ...seasonDetails
      .filter((season) => has(`${season.name.en} ${season.name.ar}`, term))
      .map((season) => ({
        kind: "rate" as const,
        id: season.key,
        title: season.name[lang],
        meta: season.meta[lang],
      })),
    ...roomCatalogue
      .filter((room) => has(`${room.name} ${room.nameAr}`, term))
      .map((room) => ({
        kind: "rate" as const,
        id: room.name,
        title: ar ? room.nameAr : room.name,
        meta: [
          ar ? room.viewAr : room.view,
          room.size,
          ar ? room.bedsAr : room.beds,
        ].join(" · "),
      })),
  ];

  const contractHits: Hit[] = supplyContracts
    .filter((contract) =>
      has(
        [
          contract.id,
          contract.name,
          contract.nameAr,
          contract.period,
          contract.periodAr,
        ].join(" "),
        term
      )
    )
    .map((contract) => ({
      kind: "contract" as const,
      id: contract.id,
      title: ar ? contract.nameAr : contract.name,
      meta: [contract.id, ar ? contract.datesAr : contract.dates].join(" · "),
    }));

  const changeHits: Hit[] = changeRequestSeed
    .filter((request) =>
      has(
        [
          request.id,
          request.bookingId,
          request.hotel,
          request.hotelAr,
          ...(seesGuest ? [request.guest, request.guestAr] : []),
        ].join(" "),
        term
      )
    )
    .map((request) => ({
      kind: "change" as const,
      id: request.id,
      title: `${request.id} · ${ar ? request.titleAr : request.title}`,
      meta: [
        request.bookingId,
        ar ? request.hotelAr : request.hotel,
        ar ? request.stayAr : request.stay,
      ].join(" · "),
    }));

  const hotelHits: Hit[] = hotels
    .filter((hotel) =>
      has(
        [
          hotel.id,
          hotel.nameEn,
          hotel.nameAr,
          hotel.city,
          hotel.cityAr,
          hotel.district,
          hotel.districtAr,
        ].join(" "),
        term
      )
    )
    .map((hotel) => ({
      kind: "hotel" as const,
      id: hotel.id,
      title: ar ? hotel.nameAr : hotel.nameEn,
      meta: [
        ar ? hotel.districtAr : hotel.district,
        ar ? hotel.cityAr : hotel.city,
        hotel.id,
      ].join(" · "),
      linked: hotel.relation === "linked",
    }));

  const order: Array<[HitKind, Hit[]]> = [
    ["booking", bookingHits],
    ["rate", rateHits],
    ["contract", contractHits],
    ["change", changeHits],
    ["hotel", hotelHits],
  ];

  return order
    .filter(([, hits]) => hits.length > 0)
    .map(([kind, hits]) => ({
      kind,
      label: searchCopy.groups[kind][lang],
      hits: hits.slice(0, PER_GROUP),
      more: Math.max(0, hits.length - PER_GROUP),
    }));
}
