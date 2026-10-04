import hotel1 from "@/assets/hotel-1.jpg";
import hotel2 from "@/assets/hotel-2.jpg";
import hotel3 from "@/assets/hotel-3.jpg";
import room1 from "@/assets/room-1.jpg";

export interface CompanyField {
  id: string;
  group: "company" | "documents" | "owner";
  current: string;
  masked?: string;
  kind: "text" | "file";
  requiresEvidence?: boolean;
  /** Optional details can be added but are not part of the registered record. */
  optional?: boolean;
  /** Already inside an open change request, so it cannot be requested again. */
  lockedBy?: string;
}

/** The change request that currently holds three details (Figma UI 01.6C). */
export const openChangeRequestId = "CHG-00042";

/** Registered company record, as read-only data owned by Hoteliana. */
export const companyRecord: CompanyField[] = [
  { id: "legalName", group: "company", kind: "text", current: "Jewar Al-Safwah for Travel & Tourism" },
  { id: "country", group: "company", kind: "text", current: "Saudi Arabia" },
  { id: "city", group: "company", kind: "text", current: "Makkah" },
  { id: "phone", group: "company", kind: "text", current: "+966 55 123 4567", masked: "+966 •• ••• ••••", lockedBy: openChangeRequestId },
  { id: "email", group: "company", kind: "text", current: "registered@jewaralsafwah.com" },
  { id: "cr", group: "documents", kind: "file", current: "Commercial_Registration.pdf", lockedBy: openChangeRequestId },
  { id: "tax", group: "documents", kind: "file", current: "Tax_Certificate.pdf" },
  { id: "license", group: "documents", kind: "file", current: "Tourism_License.pdf" },
  { id: "guarantee", group: "documents", kind: "file", current: "", optional: true },
  { id: "ownerName", group: "owner", kind: "text", current: "Abdulaziz Al-Safwah" },
  { id: "ownerPhone", group: "owner", kind: "text", current: "+966 55 987 6543", masked: "+966 •• ••• ••••" },
  { id: "ownerEmail", group: "owner", kind: "text", current: "owner@jewaralsafwah.com" },
  { id: "ownerId", group: "owner", kind: "text", current: "ID-1093847265", masked: "ID-••••••••••" },
  {
    id: "iban",
    group: "owner",
    kind: "text",
    current: "SA03 8000 0000 6080 1016 7519",
    masked: "SA•• •••• •••• •••• •••• ••••",
    requiresEvidence: true,
    lockedBy: openChangeRequestId,
  },
];

export interface AgreementVersion {
  version: "1.3" | "1.4";
  term: string;
  model: string;
  modelAr: string;
  settlement: string;
  settlementAr: string;
  currency: string;
  file: string;
  acceptedBy: string;
  acceptedByAr: string;
  acceptedAt: string;
  previous: string;
}

/** The commercial agreement in force, per Figma UI 01.6 and UI 01.6P. */
export const agreementVersions: Record<"1.3" | "1.4", AgreementVersion> = {
  "1.3": {
    version: "1.3",
    term: "1 Sep 2026 - 31 Aug 2027",
    model: "Allotment",
    modelAr: "حصة مخصّصة",
    settlement: "Monthly statement · net 30 days",
    settlementAr: "كشف شهري · صافي ٣٠ يومًا",
    currency: "SAR",
    file: "Supplier_Agreement_v1.3.pdf",
    acceptedBy: "Abdullrahman Najeh · Authorized representative",
    acceptedByAr: "عبدالرحمن ناجح · ممثل مخوّل",
    acceptedAt: "1 Sep 2026 · 10:42 (UTC+3)",
    previous: "v1.2 · accepted 15 Feb 2026 · superseded",
  },
  "1.4": {
    version: "1.4",
    term: "15 Sep 2026 - 14 Sep 2027",
    model: "Allotment",
    modelAr: "حصة مخصّصة",
    settlement: "Monthly statement · net 21 days",
    settlementAr: "كشف شهري · صافي ٢١ يومًا",
    currency: "SAR",
    file: "Hoteliana_Supplier_Agreement_v1.4.pdf",
    acceptedBy: "Abdullrahman Najeh · Authorized representative",
    acceptedByAr: "عبدالرحمن ناجح · ممثل مخوّل",
    acceptedAt: "15 Sep 2026 · 09:12 (UTC+3)",
    previous: "v1.3 · accepted 1 Sep 2026 · superseded",
  },
};

export interface ComplianceDocument {
  id: string;
  issued: string;
  expires: string;
  expiresAr: string;
  /** OV 01.6 — who issued it, the dates in full, and how it stands. */
  issuer: string;
  issuerAr: string;
  issuedFull: string;
  issuedFullAr: string;
  expiresFull: string;
  expiresFullAr: string;
  status: "valid" | "expiring";
}

/** Licences and certificates table, per Figma UI 01.6. */
export const complianceDocuments: ComplianceDocument[] = [
  { id: "cr", issuer: "Issued by the Ministry of Commerce", issuerAr: "صادر عن وزارة التجارة", issuedFull: "14 Mar 2024", issuedFullAr: "١٤ مارس ٢٠٢٤", expiresFull: "14 Mar 2027", expiresFullAr: "١٤ مارس ٢٠٢٧", status: "valid", issued: "14 Mar 24", expires: "14 Mar 27", expiresAr: "١٤ مارس ٢٧" },
  { id: "tax", issuer: "Issued by ZATCA", issuerAr: "صادرة عن هيئة الزكاة والضريبة والجمارك", issuedFull: "01 Jan 2026", issuedFullAr: "١ يناير ٢٠٢٦", expiresFull: "31 Dec 2026", expiresFullAr: "٣١ ديسمبر ٢٠٢٦", status: "expiring", issued: "01 Jan 26", expires: "31 Dec 26", expiresAr: "٣١ ديسمبر ٢٦" },
  { id: "license", issuer: "Issued by the Ministry of Tourism", issuerAr: "صادرة عن وزارة السياحة", issuedFull: "01 Jul 2024", issuedFullAr: "١ يوليو ٢٠٢٤", expiresFull: "30 Jun 2027", expiresFullAr: "٣٠ يونيو ٢٠٢٧", status: "valid", issued: "01 Jul 24", expires: "30 Jun 27", expiresAr: "٣٠ يونيو ٢٧" },
];

export type HotelRelation = "available" | "requested" | "linked" | "notApproved" | "suspended";

/**
 * Flow 12 · Row B — the licence belongs to Hoteliana's library. Suppliers
 * never type it; they read it once the hotel is linked.
 */
export const hotelLicences: Record<string, { number: string; issuer: string; issuerAr: string; expiry: string; expiryAr: string }> = {
  "HTL-1048": { number: "7010231144", issuer: "Ministry of Tourism", issuerAr: "وزارة السياحة", expiry: "12 Mar 2027 · valid", expiryAr: "١٢ مارس ٢٠٢٧ · سارية" },
  "HTL-1052": { number: "7010238820", issuer: "Ministry of Tourism", issuerAr: "وزارة السياحة", expiry: "04 Aug 2027 · valid", expiryAr: "٤ أغسطس ٢٠٢٧ · سارية" },
  "HTL-1077": { number: "7010244071", issuer: "Ministry of Tourism", issuerAr: "وزارة السياحة", expiry: "29 Nov 2026 · valid", expiryAr: "٢٩ نوفمبر ٢٠٢٦ · سارية" },
};

export interface Hotel {
  id: string;
  nameEn: string;
  nameAr: string;
  city: string;
  cityAr: string;
  district: string;
  districtAr: string;
  countryEn: string;
  countryAr: string;
  address: string;
  addressAr: string;
  descEn: string;
  descAr: string;
  distance: string;
  distanceAr: string;
  /**
   * UI 02.2L - the photographs Hoteliana holds for the hotel. The frame
   * prints "1 / 12 images" over the cover; a counter is only honest if
   * the list behind it is the list you can reach, so it is the list that
   * is counted here and not a number written beside it.
   */
  images: string[];
  stars: number;
  relation: HotelRelation;
  contract?: "selling" | "draft" | "none";
  contractNote?: string;
  contractNoteAr?: string;
  contractCount?: string;
  contractCountAr?: string;
  contractAction?: "open" | "draft" | "expiring";
  needsAttention?: boolean;
  image?: string;
}

const sa = { countryEn: "Saudi Arabia", countryAr: "السعودية" };

/** The four photographs we hold, a hotel's own cover leading its own. */
const library = [hotel1, hotel2, hotel3, room1];
const gallery = (cover: string): string[] => [
  cover,
  ...library.filter((photo) => photo !== cover),
];

export const hotels: Hotel[] = [
  { id: "HTL-1048", nameEn: "Al Noor Makkah Hotel", nameAr: "فندق النور مكة", city: "Makkah", cityAr: "مكة", district: "Al Aziziyah", districtAr: "العزيزية", ...sa, address: "Al Masjid Al Haram Rd", addressAr: "طريق المسجد الحرام", descEn: "Central hotel near Haram", descAr: "فندق مركزي بالقرب من الحرم", distance: "1.2 km · shuttle", distanceAr: "١٫٢ كم · نقل مكوكي", stars: 4, relation: "linked", contract: "selling", contractCount: "2 contracts", contractCountAr: "عقدان", contractNote: "2 unpublished changes · 14 Sep sold out", contractNoteAr: "تعديلان غير منشورين · نفدت ١٤ سبتمبر", contractAction: "open", needsAttention: true, image: hotel1, images: gallery(hotel1) },
  { id: "HTL-1052", nameEn: "Central Haram Hotel", nameAr: "فندق الحرم المركزي", city: "Makkah", cityAr: "مكة", district: "Central Area", districtAr: "المنطقة المركزية", ...sa, address: "Ajyad Al Masafi St", addressAr: "شارع أجياد المصافي", descEn: "Walking distance to the Haram", descAr: "على مسافة قريبة من الحرم", distance: "150 m to Haram", distanceAr: "١٥٠ م إلى الحرم", stars: 5, relation: "linked", contract: "selling", contractCount: "2 contracts", contractCountAr: "عقدان", contractNote: "Umrah Q3 ends in 14 days", contractNoteAr: "عمرة الربع الثالث تنتهي خلال ١٤ يومًا", contractAction: "expiring", needsAttention: true, image: hotel2, images: gallery(hotel2) },
  { id: "HTL-1077", nameEn: "Rawdah Suites", nameAr: "أجنحة الروضة", city: "Madinah", cityAr: "المدينة", district: "Central Area", districtAr: "المنطقة المركزية", ...sa, address: "King Faisal Rd", addressAr: "طريق الملك فيصل", descEn: "Apartment-style suites for families", descAr: "أجنحة عائلية بنمط الشقق", distance: "200 m to the Prophet’s Mosque", distanceAr: "٢٠٠ م إلى المسجد النبوي", stars: 4, relation: "linked", contract: "draft", contractCount: "Madinah Winter · not published", contractCountAr: "شتاء المدينة · غير منشور", contractNote: "Madinah Hajj Block is paused", contractNoteAr: "بلوك حج المدينة موقوف", contractAction: "draft", image: hotel3, images: gallery(hotel3) },
  { id: "HTL-1091", nameEn: "Al Safa City Hotel", nameAr: "فندق الصفا سيتي", city: "Makkah", cityAr: "مكة", district: "Al Aziziyah", districtAr: "العزيزية", ...sa, address: "Al Misfalah Main St", addressAr: "شارع العزيزية", descEn: "Budget city hotel with shuttle", descAr: "فندق اقتصادي مع خدمة نقل", distance: "4.2 km to Haram", distanceAr: "٤.٢ كم إلى الحرم", stars: 3, relation: "requested", image: hotel1, images: gallery(hotel1) },
  { id: "HTL-1104", nameEn: "Jabal View Hotel", nameAr: "فندق جبل فيو", city: "Makkah", cityAr: "مكة", district: "Jabal Omar", districtAr: "جبل عمر", ...sa, address: "Jabal Omar", addressAr: "جبل عمر", descEn: "Mountain-view rooms in Jabal Omar", descAr: "غرف بإطلالة جبلية في جبل عمر", distance: "500 m to Haram", distanceAr: "٥٠٠ م إلى الحرم", stars: 4, relation: "notApproved", image: hotel2, images: gallery(hotel2) },
  { id: "HTL-1118", nameEn: "Taibah Grand Hotel", nameAr: "فندق طيبة الكبير", city: "Madinah", cityAr: "المدينة", district: "Qurban", districtAr: "قربان", ...sa, address: "Qurban St", addressAr: "شارع قربان", descEn: "Large hotel with conference rooms", descAr: "فندق كبير بقاعات مؤتمرات", distance: "1.1 km · shuttle", distanceAr: "١.١ كم · باص", stars: 5, relation: "available", image: hotel3, images: gallery(hotel3) },
  { id: "HTL-1126", nameEn: "Ajyad Makarim Hotel", nameAr: "فندق أجياد مكارم", city: "Makkah", cityAr: "مكة", district: "Ajyad", districtAr: "أجياد", ...sa, address: "Ajyad St", addressAr: "شارع أجياد", descEn: "Compact hotel steps from the Haram", descAr: "فندق صغير على خطوات من الحرم", distance: "500 m · walking", distanceAr: "٥٠٠ م · سيرًا", stars: 4, relation: "available", image: hotel1, images: gallery(hotel1) },
  { id: "HTL-1133", nameEn: "Anwar Al Madinah", nameAr: "أنوار المدينة", city: "Madinah", cityAr: "المدينة", district: "Central Area", districtAr: "المنطقة المركزية", ...sa, address: "Abu Bakr Al Siddiq Rd", addressAr: "طريق أبي بكر الصديق", descEn: "Family hotel facing the central area", descAr: "فندق عائلي مقابل المنطقة المركزية", distance: "400 m · walking", distanceAr: "٤٠٠ م · سيرًا", stars: 4, relation: "available", image: hotel2, images: gallery(hotel2) },
  { id: "HTL-1147", nameEn: "Diyar Al Rahmah", nameAr: "ديار الرحمة", city: "Makkah", cityAr: "مكة", district: "Al Aziziyah", districtAr: "العزيزية", ...sa, address: "Al Aziziyah St", addressAr: "شارع العزيزية", descEn: "Simple rooms with shuttle service", descAr: "غرف بسيطة مع خدمة نقل", distance: "2.6 km · shuttle", distanceAr: "٢.٦ كم · باص", stars: 3, relation: "available", image: hotel3, images: gallery(hotel3) },
  { id: "HTL-1162", nameEn: "Palm District Hotel", nameAr: "فندق حي النخيل", city: "Jeddah", cityAr: "جدة", district: "Al Hamra", districtAr: "الحمراء", ...sa, address: "Al Hamra District", addressAr: "حي الحمراء", descEn: "Modern rooms on the Corniche", descAr: "غرف حديثة على الكورنيش", distance: "Corniche", distanceAr: "الكورنيش", stars: 5, relation: "suspended", image: hotel3, images: gallery(hotel3) },
];

export interface RoomType {
  name: string;
  nameAr: string;
  base: number;
  /** Maximum occupancy in guests. */
  occupancy: number;
  adults: number;
  children: number;
  maxChildAge: number;
  extra: string;
  beds: string;
  bedsAr: string;
  size: string;
  view: string;
  viewAr: string;
  units: number;
  images: number;
  status: "available" | "pending";
}

export const roomCatalogue: RoomType[] = [
  { name: "Standard Room", nameAr: "غرفة ستاندرد", base: 2, occupancy: 2, adults: 2, children: 1, maxChildAge: 5, extra: "Up to 5", beds: "1 king", bedsAr: "سرير كينج", size: "28 m²", view: "City", viewAr: "إطلالة المدينة", units: 6, images: 6, status: "available" },
  { name: "Deluxe Room City View", nameAr: "ديلوكس إطلالة المدينة", base: 3, occupancy: 3, adults: 3, children: 1, maxChildAge: 5, extra: "Up to 5", beds: "3 single", bedsAr: "٣ أسرّة فردية", size: "34 m²", view: "City", viewAr: "إطلالة المدينة", units: 8, images: 8, status: "available" },
  { name: "Deluxe Room Partial Haram View", nameAr: "ديلوكس إطلالة جزئية على الحرم", base: 4, occupancy: 4, adults: 4, children: 2, maxChildAge: 5, extra: "Up to 5", beds: "2 queen", bedsAr: "سريران كوين", size: "42 m²", view: "Partial Haram", viewAr: "إطلالة جزئية على الحرم", units: 10, images: 10, status: "available" },
  { name: "Junior Suite", nameAr: "جناح جونيور", base: 2, occupancy: 2, adults: 2, children: 1, maxChildAge: 5, extra: "Up to 5", beds: "1 king", bedsAr: "سرير كينج", size: "48 m²", view: "Haram", viewAr: "إطلالة الحرم", units: 12, images: 12, status: "available" },
  { name: "Family Suite", nameAr: "جناح عائلي", base: 6, occupancy: 6, adults: 4, children: 2, maxChildAge: 12, extra: "Up to 12", beds: "2 king", bedsAr: "سريران كينج", size: "58 m²", view: "Partial Haram", viewAr: "إطلالة جزئية على الحرم", units: 4, images: 4, status: "pending" },
];

export interface SupplyContract {
  id: string;
  hotelId: string;
  name: string;
  nameAr: string;
  dates: string;
  datesAr: string;
  model: "instant" | "onRequest";
  /**
   * BR-03-xx - how the contract prices a room, fixed for its lifetime.
   * "supplements" prices one base room and adds for everything else;
   * "fixed" gives every room-and-meal line its own full price. Seasons
   * follow whichever the contract uses - a season cannot change the model.
   */
  pricing?: "supplements" | "fixed";
  rooms: number;
  state: "active" | "scheduled" | "draft" | "paused" | "expired" | "terminated" | "attention";
  /** Room names (from roomCatalogue) sold under this contract. */
  roomNames: string[];
  period: string;
  periodAr: string;
  allotment: number;
  /** How many room types the allotment is split across. */
  roomTypes: number;
  soldOut: "stop" | "onRequest" | "overbooking" | "notSet";
  /** Extra rooms allowed past the allotment, when soldOut is "overbooking". */
  overbooking?: number;
  /** Release window in days, or null when the contract sets none. */
  releaseDays: number | null;
  attention?: string;
  attentionAr?: string;
  version: string;
}

export const supplyContracts: SupplyContract[] = [
  { id: "SC-2026-0142", hotelId: "HTL-1048", name: "Makkah Annual Block", nameAr: "حصة مكة السنوية", dates: "01 Sep 2026 - 31 Aug 2027", datesAr: "١ سبتمبر ٢٠٢٦ - ٣١ أغسطس ٢٠٢٧", period: "Annual 2026/27", periodAr: "سنوي ٢٠٢٦/٢٧", model: "instant", rooms: 3, state: "active", roomNames: ["Double", "Triple", "Quad"], allotment: 40, roomTypes: 3, soldOut: "overbooking", overbooking: 2, releaseDays: 3, attention: "2 unpublished changes", attentionAr: "تعديلان غير منشورين", version: "v1.3" },
  { id: "SC-2026-0155", hotelId: "HTL-1048", name: "Al Noor Fixed", nameAr: "النور بسعر ثابت", dates: "01 Sep 2026 - 31 Aug 2027", datesAr: "١ سبتمبر ٢٠٢٦ - ٣١ أغسطس ٢٠٢٧", period: "Annual 2026/27", periodAr: "سنوي ٢٠٢٦/٢٧", model: "instant", pricing: "fixed", rooms: 3, state: "active", roomNames: ["Standard", "Deluxe", "Junior Suite"], allotment: 30, roomTypes: 3, soldOut: "stop", releaseDays: 3, version: "v1.1" },
  { id: "SC-2026-0189", hotelId: "HTL-1052", name: "Umrah Q3", nameAr: "عمرة الربع الثالث", dates: "01 Jul - 29 Sep 2026", datesAr: "١ يوليو - ٢٩ سبتمبر ٢٠٢٦", period: "Q3 2026", periodAr: "الربع الثالث ٢٠٢٦", model: "onRequest", rooms: 2, state: "active", roomNames: ["Double", "Triple"], allotment: 8, roomTypes: 2, soldOut: "stop", releaseDays: 7, attention: "Ends in 14 days", attentionAr: "ينتهي خلال ١٤ يومًا", version: "v1.3" },
  { id: "SC-2027-0004", hotelId: "HTL-1052", name: "Ramadan Block", nameAr: "حصة رمضان", dates: "01 - 30 Ramadan 1448", datesAr: "١ - ٣٠ رمضان ١٤٤٨", period: "Ramadan 1448", periodAr: "رمضان ١٤٤٨", model: "onRequest", rooms: 3, state: "scheduled", roomNames: ["Double", "Triple", "Quad"], allotment: 12, roomTypes: 3, soldOut: "stop", releaseDays: 7, version: "v1.0" },
  { id: "SC-DRAFT-018", hotelId: "HTL-1077", name: "Madinah Winter", nameAr: "شتاء المدينة", dates: "15 Nov 2026 - 28 Feb 2027", datesAr: "١٥ نوفمبر ٢٠٢٦ - ٢٨ فبراير ٢٠٢٧", period: "Winter 2026/27", periodAr: "شتاء ٢٠٢٦/٢٧", model: "instant", rooms: 2, state: "draft", roomNames: ["Double", "Triple"], allotment: 5, roomTypes: 2, soldOut: "notSet", releaseDays: null, version: "Draft" },
  { id: "SC-2027-0031", hotelId: "HTL-1077", name: "Madinah Hajj Block", nameAr: "حصة حج المدينة", dates: "01 Oct 2026 - 31 Jan 2027", datesAr: "١ أكتوبر ٢٠٢٦ - ٣١ يناير ٢٠٢٧", period: "Hajj 1448", periodAr: "حج ١٤٤٨", model: "instant", rooms: 1, state: "paused", roomNames: ["Double"], allotment: 4, roomTypes: 1, soldOut: "overbooking", overbooking: 1, releaseDays: 3, version: "v1.3" },
  { id: "SC-2026-0098", hotelId: "HTL-1048", name: "Makkah August Block", nameAr: "حصة مكة أغسطس", dates: "01 - 31 Aug 2026", datesAr: "١ - ٣١ أغسطس ٢٠٢٦", period: "August 2026", periodAr: "أغسطس ٢٠٢٦", model: "instant", rooms: 2, state: "expired", roomNames: ["Double", "Triple"], allotment: 6, roomTypes: 2, soldOut: "stop", releaseDays: 3, version: "v1.0" },
  { id: "SC-2025-0211", hotelId: "HTL-1077", name: "Taiba Block", nameAr: "حصة طيبة", dates: "01 Jan - 30 Jun 2026", datesAr: "١ يناير - ٣٠ يونيو ٢٠٢٦", period: "H1 2026", periodAr: "النصف الأول ٢٠٢٦", model: "onRequest", rooms: 0, state: "terminated", roomNames: [], allotment: 0, roomTypes: 0, soldOut: "notSet", releaseDays: null, version: "v1.0" },
];


export interface ChangeDecisionRow {
  id: string;
  value: string;
  reason?: string;
  reasonAr?: string;
  approved: boolean;
}

/** The CHG-00042 decision drawn in Figma UI 01.6F / 01.6G / 01.6H. */
export const changeDecision: Record<
  "approved" | "rejected" | "partly",
  ChangeDecisionRow[]
> = {
  approved: [
    { id: "phone", value: "+966 54 321 9876", approved: true },
    { id: "iban", value: "SA44 5000 0000 1234 5678 9012", approved: true },
    { id: "cr", value: "Commercial_Registration_2026.pdf", approved: true },
  ],
  rejected: [
    {
      id: "phone",
      value: "+966 54 321 9876",
      reason: "not the number on the commercial registration",
      reasonAr: "ليس الرقم المدوّن في السجل التجاري",
      approved: false,
    },
    {
      id: "iban",
      value: "SA44 5000 0000 1234 5678 9012",
      reason: "letter does not match the registered legal name",
      reasonAr: "الخطاب لا يطابق الاسم القانوني المسجّل",
      approved: false,
    },
    {
      id: "cr",
      value: "Commercial_Registration_2026.pdf",
      reason: "file is unreadable",
      reasonAr: "الملف غير قابل للقراءة",
      approved: false,
    },
  ],
  partly: [
    { id: "phone", value: "+966 54 321 9876", approved: true },
    {
      id: "iban",
      value: "SA44 5000 0000 1234 5678 9012",
      reason: "letter does not match the registered legal name",
      reasonAr: "الخطاب لا يطابق الاسم القانوني المسجّل",
      approved: false,
    },
    { id: "cr", value: "Commercial_Registration_2026.pdf", approved: true },
  ],
};

export type SupplierRequestState =
  | "needsYou"
  | "waiting"
  | "approved"
  /** OV 02.5C3 — the room was already in the catalogue under another name. */
  | "linked"
  | "rejected";

export type SupplierRequestKind = "access" | "hotel" | "room" | "company";

export interface SupplierRequest {
  id: string;
  kind: SupplierRequestKind;
  what: string;
  whatAr: string;
  sent: string;
  sentAr: string;
  state: SupplierRequestState;
  update: string;
  updateAr: string;
  action: string;
  actionAr: string;
  hotelId?: string;
}

/**
 * The rows UI 02.5 draws, in the order the design lists them: what needs
 * you first, then the oldest still waiting.
 *
 * A new room can end four ways, not two - approved, linked to a room the
 * catalogue already had, sent back with a question, or refused with a
 * reason - and the list says which before it is opened.
 */
export const supplierRequests: SupplierRequest[] = [
  {
    id: "ACC-04830",
    kind: "access",
    what: "Al Safa City Hotel",
    whatAr: "فندق الصفا سيتي",
    sent: "11 Sep · Abdullrahman",
    sentAr: "١١ سبتمبر · عبدالرحمن",
    state: "needsYou",
    update: "Decision within 2 working days",
    updateAr: "القرار خلال يومي عمل",
    action: "Open",
    actionAr: "فتح",
    hotelId: "HTL-1091",
  },
  {
    id: "HOT-10391",
    kind: "hotel",
    what: "Makkah Gate Hotel",
    whatAr: "فندق بوابة مكة",
    sent: "02 Sep · Abdullrahman",
    sentAr: "٢ سبتمبر · عبدالرحمن",
    state: "needsYou",
    update: "Map pin and Arabic name need correcting",
    updateAr: "موقع الخريطة والاسم العربي يحتاجان تصحيحًا",
    action: "Open the form to fix",
    actionAr: "فتح النموذج للتصحيح",
  },
  {
    id: "CHG-00042",
    kind: "company",
    what: "Phone · Bank IBAN · Commercial registration",
    whatAr: "الهاتف · الآيبان · السجل التجاري",
    sent: "12 Sep · Sara",
    sentAr: "١٢ سبتمبر · سارة",
    state: "needsYou",
    update: "IBAN rejected - resubmit that one detail",
    updateAr: "رُفض الآيبان - أعد إرسال هذا البيان وحده",
    action: "Resubmit IBAN",
    actionAr: "إعادة إرسال الآيبان",
  },
  {
    id: "ROM-20502",
    kind: "room",
    what: "Deluxe · Partial Haram - Al Noor Makkah Hotel",
    whatAr: "ديلوكس · إطلالة جزئية - فندق النور مكة",
    sent: "23 Sep · Abdullrahman",
    sentAr: "٢٣ سبتمبر · عبدالرحمن",
    state: "needsYou",
    update: "Question from Hoteliana · 24 Sep",
    updateAr: "سؤال من هوتيليانا · ٢٤ سبتمبر",
    action: "Open",
    actionAr: "فتح",
    hotelId: "HTL-1048",
  },
  {
    id: "ROM-20490",
    kind: "room",
    what: "Deluxe King Haram - Al Noor Makkah Hotel",
    whatAr: "ديلوكس كينج حرم - فندق النور مكة",
    sent: "20 Sep · Abdullrahman",
    sentAr: "٢٠ سبتمبر · عبدالرحمن",
    state: "linked",
    update: "Linked to Deluxe · Haram view · 21 Sep",
    updateAr: "رُبط بديلوكس · إطلالة الحرم · ٢١ سبتمبر",
    action: "Open",
    actionAr: "فتح",
    hotelId: "HTL-1048",
  },
  {
    id: "ROM-20455",
    kind: "room",
    what: "Triple Room - Al Noor Makkah Hotel",
    whatAr: "غرفة ثلاثية - فندق النور مكة",
    sent: "18 Sep · Abdullrahman",
    sentAr: "١٨ سبتمبر · عبدالرحمن",
    state: "rejected",
    update: "Reason in detail · 19 Sep",
    updateAr: "السبب في التفاصيل · ١٩ سبتمبر",
    action: "Open",
    actionAr: "فتح",
    hotelId: "HTL-1048",
  },
  {
    id: "ROM-20481",
    kind: "room",
    what: "Family Suite - Al Noor Makkah Hotel",
    whatAr: "جناح عائلي - فندق النور مكة",
    sent: "12 Sep · Sara",
    sentAr: "١٢ سبتمبر · سارة",
    state: "waiting",
    update: "With Hoteliana since 12 Sep",
    updateAr: "لدى هوتيليانا منذ ١٢ سبتمبر",
    action: "Open",
    actionAr: "فتح",
    hotelId: "HTL-1048",
  },
  {
    id: "ACC-04822",
    kind: "access",
    what: "Jabal View Hotel",
    whatAr: "فندق جبل فيو",
    sent: "09 Sep · Abdullrahman",
    sentAr: "٩ سبتمبر · عبدالرحمن",
    state: "rejected",
    update: "Reason in request detail",
    updateAr: "السبب في تفاصيل الطلب",
    action: "Open",
    actionAr: "فتح",
    hotelId: "HTL-1104",
  },
  {
    id: "ACC-04821",
    kind: "access",
    what: "Rawdah Suites",
    whatAr: "أجنحة الروضة",
    sent: "05 Sep · Abdullrahman",
    sentAr: "٥ سبتمبر · عبدالرحمن",
    state: "approved",
    update: "Linked to My Hotels on 08 Sep",
    updateAr: "ارتبط بفنادقي في ٨ سبتمبر",
    action: "Open",
    actionAr: "فتح",
    hotelId: "HTL-1077",
  },
  {
    id: "ACC-04819",
    kind: "access",
    what: "Central Haram Hotel",
    whatAr: "فندق الحرم المركزي",
    sent: "01 Sep · Sara",
    sentAr: "١ سبتمبر · سارة",
    state: "approved",
    update: "Linked to My Hotels on 03 Sep",
    updateAr: "ارتبط بفنادقي في ٣ سبتمبر",
    action: "Open",
    actionAr: "فتح",
    hotelId: "HTL-1052",
  },
  {
    id: "ROM-20377",
    kind: "room",
    what: "Junior Suite - Al Noor Makkah Hotel",
    whatAr: "جناح جونيور - فندق النور مكة",
    sent: "08 Sep · Abdullrahman",
    sentAr: "٨ سبتمبر · عبدالرحمن",
    state: "approved",
    update: "Added to official catalogue · 09 Sep",
    updateAr: "أُضيف إلى الدليل الرسمي · ٩ سبتمبر",
    action: "Open",
    actionAr: "فتح",
    hotelId: "HTL-1048",
  },
];

export interface AgreementHistoryEntry {
  version: string;
  state: "waiting" | "active" | "superseded";
  published: string;
  publishedAr: string;
  accepted: string;
  acceptedAr: string;
}

/** OV 01.6M — every version Hoteliana published, and who accepted it. */
export const agreementHistory: AgreementHistoryEntry[] = [
  {
    version: "v1.4",
    state: "waiting",
    published: "Published 15 Sep 2026",
    publishedAr: "نُشرت ١٥ سبتمبر ٢٠٢٦",
    accepted: "Waiting for your acceptance · accept by 30 Sep",
    acceptedAr: "بانتظار قبولك · اقبلها قبل ٣٠ سبتمبر",
  },
  {
    version: "v1.3",
    state: "active",
    published:
      "Published 20 Aug 2026 · in force since 1 Sep · changed: settlement net 30, cancellation annex · SHA-256 9f3a…c41e",
    publishedAr:
      "نُشرت ٢٠ أغسطس ٢٠٢٦ · سارية منذ ١ سبتمبر · تغيّر: التسوية صافي ٣٠، ملحق الإلغاء · SHA-256 9f3a…c41e",
    accepted:
      "Accepted by Abdullrahman Najeh · Owner · 1 Sep 2026 10:42 · document opened 10:38",
    acceptedAr:
      "قبلها عبدالرحمن ناجح · المالك · ١ سبتمبر ٢٠٢٦ ١٠:٤٢ · فُتح المستند ١٠:٣٨",
  },
  {
    version: "v1.2",
    state: "superseded",
    published: "Published 1 Feb 2026 · changed: tax certificate clause",
    publishedAr: "نُشرت ١ فبراير ٢٠٢٦ · تغيّر: بند الشهادة الضريبية",
    accepted: "Accepted by Abdullrahman Najeh · 15 Feb 2026 09:10",
    acceptedAr: "قبلها عبدالرحمن ناجح · ١٥ فبراير ٢٠٢٦ ٠٩:١٠",
  },
  {
    version: "v1.1",
    state: "superseded",
    published: "Published 10 Oct 2025 · first version",
    publishedAr: "نُشرت ١٠ أكتوبر ٢٠٢٥ · الإصدار الأول",
    accepted: "Accepted by Khalid Al-Harbi · 12 Oct 2025",
    acceptedAr: "قبلها خالد الحربي · ١٢ أكتوبر ٢٠٢٥",
  },
];
