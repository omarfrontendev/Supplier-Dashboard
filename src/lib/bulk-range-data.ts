/**
 * OV 04.BS* / 04.BR* / 04.BX* — the bulk overlays Flow 12 rebuilt.
 *
 * Stop sale / On Request, Release and Restrictions are one component in the
 * frames with three middles. The shell is the same every time: pick nights,
 * pick rooms, set the one thing this overlay sets, add it to a list, and
 * nothing is saved until the list is reviewed and saved together.
 *
 * That last part is the point of the rebuild - the old overlays saved as
 * you went. These build a list first, so a session of changes is reviewed
 * once rather than a dialog at a time.
 */

import { contractRestrictions } from "@/lib/contract-data";

export interface Bi {
  en: string;
  ar: string;
}

const t = (en: string, ar: string): Bi => ({ en, ar });

export type BulkKind =
  | "bulkRates"
  | "stopSale"
  | "release"
  | "restrictions";

/**
 * Only Stop sale applies the moment you confirm it. Prices, release and
 * stay rules are all saved as a draft and reach agents at Review &
 * publish - which is the frames' own division, and a sound one: you cannot
 * sell a night you have already closed, so closing one cannot wait.
 */
export const appliesAtOnce: Record<BulkKind, boolean> = {
  bulkRates: false,
  stopSale: true,
  release: false,
  restrictions: false,
};

/**
 * OV 04.BSAC - "Apply to every contract on this hotel" reaches the other
 * contracts on the same hotel, matching by the hotel's own room names. A
 * contract that does not carry a room simply does not get it.
 */
export const hotelContracts: Array<{ name: Bi; rooms: string[] }> = [
  {
    name: t("Makkah Annual Block", "\u062d\u0635\u0629 \u0645\u0643\u0629 \u0627\u0644\u0633\u0646\u0648\u064a\u0629"),
    rooms: [
      "Standard Room \u00b7 City View",
      "Standard Room \u00b7 Haram View",
      "Triple Room \u00b7 City View",
      "Quad Room \u00b7 City View",
      "Deluxe Room \u00b7 City View",
      "Deluxe Room \u00b7 Partial Haram View",
      "Deluxe Room \u00b7 Haram View",
      "Family Room \u00b7 City View",
      "Junior Suite \u00b7 Haram View",
    ],
  },
  {
    name: t("Ramadan Block", "\u062d\u0635\u0629 \u0631\u0645\u0636\u0627\u0646"),
    /* No Quad Room, which is why the frame says so out loud. */
    rooms: [
      "Standard Room \u00b7 City View",
      "Standard Room \u00b7 Haram View",
      "Deluxe Room \u00b7 City View",
      "Deluxe Room \u00b7 Haram View",
      "Family Room \u00b7 City View",
    ],
  },
  {
    name: t("Makkah Rooms Block", "\u062d\u0635\u0629 \u063a\u0631\u0641 \u0645\u0643\u0629"),
    rooms: [
      "Standard Room \u00b7 City View",
      "Triple Room \u00b7 City View",
      "Quad Room \u00b7 City View",
      "Deluxe Room \u00b7 City View",
      "Junior Suite \u00b7 Haram View",
    ],
  },
];

/** BR-04-xx - the release window the contract itself carries, in days. */
export const contractRelease = 3;
/* The contract's own floor, which a restriction replaces and then hands
   back: "All rooms · 01 - 30 Sep · 2 nights" in its Restrictions table. */
export const contractMinNights = 2;
/** The ceiling OV 04.BRRE refuses to go past. */
export const MAX_RELEASE_DAYS = 30;

/** The rooms every one of them offers, with All first. */
export const bulkRooms: Bi[] = [
  t("All rooms", "كل الغرف"),
  t("Standard Room · City View", "غرفة قياسية · إطلالة المدينة"),
  t("Standard Room · Haram View", "غرفة قياسية · إطلالة الحرم"),
  t("Triple Room · City View", "غرفة ثلاثية · إطلالة المدينة"),
  t("Quad Room · City View", "غرفة رباعية · إطلالة المدينة"),
  t("Deluxe Room · City View", "غرفة ديلوكس · إطلالة المدينة"),
  t("Deluxe Room · Partial Haram View", "غرفة ديلوكس · إطلالة جزئية على الحرم"),
  t("Deluxe Room · Haram View", "غرفة ديلوكس · إطلالة الحرم"),
  t("Family Room · City View", "غرفة عائلية · إطلالة المدينة"),
  t("Junior Suite · Haram View", "جناح صغير · إطلالة الحرم"),
];

export interface AlreadySet {
  when: Bi;
  rooms: Bi;
  /** The right-hand value: what this row sets. */
  value: Bi;
  tone?: "danger" | "warning" | undefined;
  /** A row that comes from the contract is edited there, not here. */
  fromContract?: boolean;
  /** A contract rule whose dates have not started - Inactive, there. */
  inactive?: boolean;
  /** Saved, but not yet published - OV 04.BPPE draws one. */
  draft?: boolean;
}

export const bulkCopy = {
  /* The shell. */
  nights: t("NIGHTS", "الليالي"),
  pickNights: t("Pick nights", "اختر ليالي"),
  add: t("+ Add", "+ أضف"),
  nightsHint: t(
    "Pick one night or a range, choose the rooms and what to set, then press + Add. Nothing is saved until you review and save.",
    "اختر ليلة واحدة أو فترة، ثم الغرف وما تريد ضبطه، ثم اضغط + أضف. ولا يُحفظ شيء حتى تراجع وتحفظ."
  ),
  rooms: t("ROOMS", "الغرف"),
  whatWillHappen: t("WHAT WILL HAPPEN", "ماذا سيحدث"),
  whatWillHappenBody: t(
    "Pick nights and rooms. You will see here exactly what changes - how many nights, which rooms, and what it replaces - before you save.",
    "اختر الليالي والغرف. وسترى هنا بالضبط ما سيتغير — كم ليلة وأي غرف وما الذي يستبدله — قبل أن تحفظ."
  ),
  alreadySet: t("ALREADY SET · {kind}", "مضبوط بالفعل · {kind}"),
  onThisContract: t("{n} on this contract · all live", "{n} على هذا العقد · كلها حية"),
  /* Not every rule on a contract is in force today - one can be dated
     for a season that has not started, and "all live" would be a lie. */
  onThisContractSome: t(
    "{n} on this contract · {inactive} not active yet",
    "{n} على هذا العقد · {inactive} غير فعّالة بعد"
  ),
  notActive: t("Not active yet", "غير فعّالة بعد"),
  /* OV 04.BPF draws the other half of the same honesty: a row saved but
     not published is not live either, and the count says so. */
  onThisContractDraft: t(
    "{n} on this contract · {drafts} not published yet",
    "{n} على هذا العقد · {drafts} لم تُنشر بعد"
  ),
  minPrefix: t("Min {value}", "الحد الأدنى {value}"),
  live: t("Live", "حيّ"),
  fromContract: t("From the contract", "من العقد"),
  editInContract: t("Edit in contract", "عدّل في العقد"),
  edit: t("Edit", "تعديل"),
  delete: t("Delete", "حذف"),
  cancel: t("Cancel", "إلغاء"),
  nothingYet: t("Nothing in the list yet", "لا شيء في القائمة بعد"),
  reviewSaveAll: t("Review & save all", "راجع واحفظ الكل"),
  weekdays: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  weekdaysAr: ["أح", "إث", "ثل", "أر", "خم", "جم", "سب"],

  /* Stop sale / On Request. */
  stopSaleTitle: t("Stop sale / On Request", "إيقاف البيع / عند الطلب"),
  stopSaleBody: t(
    "Close or open nights for many dates and rooms at once. Prices and rooms held stay as they are.",
    "أغلق أو افتح ليالي لتواريخ وغرف كثيرة دفعة واحدة. وتبقى الأسعار والغرف المحجوزة كما هي."
  ),
  setTo: t("SET THESE NIGHTS TO", "اضبط هذه الليالي على"),
  stopSale: t("Stop sale", "إيقاف البيع"),
  openSale: t("Open sale", "فتح البيع"),
  onRequest: t("On Request", "عند الطلب"),
  onRequestHint: t("the hotel confirms each booking", "يؤكد الفندق كل حجز"),
  everyContract: t(
    "Apply to every contract on this hotel",
    "طبّق على كل عقود هذا الفندق"
  ),
  everyContractHint: t(
    "Makkah Annual Block · Ramadan Block · Makkah Rooms Block · useful when the hotel closes a date for everyone.",
    "حصة مكة السنوية · حصة رمضان · تكتلة غرف مكة · مفيد حين يغلق الفندق تاريخًا على الجميع."
  ),

  /* Release. */
  releaseTitle: t("Release", "الإصدار"),
  releaseBody: t(
    "Change when unsold rooms go back to the hotel, for many nights and rooms at once.",
    "غيّر متى تعود الغرف غير المباعة إلى الفندق، لليالٍ وغرف كثيرة دفعة واحدة."
  ),
  release: t("RELEASE", "الإصدار"),
  numberOfDays: t("Number of days", "عدد الأيام"),
  sameDay: t("Same day", "اليوم نفسه"),
  sameDayHint: t(
    "closes at the cut-off on the night itself",
    "يُغلق عند موعد القطع في الليلة نفسها"
  ),
  daysBefore: t("Days before arrival", "أيام قبل الوصول"),
  daysRange: t("1 to 30 days", "من ١ إلى ٣٠ يومًا"),
  at: t("At", "عند"),
  makkahTime: t("Makkah time", "بتوقيت مكة"),

  /* Restrictions. */
  restrictionsTitle: t("Restrictions", "القيود"),
  restrictionsBody: t(
    "Set minimum nights and check-in / check-out days on specific nights. After them, the contract rules apply again.",
    "اضبط أقل عدد ليالٍ وأيام الوصول والمغادرة على ليالٍ بعينها. وبعدها تسري قواعد العقد من جديد."
  ),
  stayRules: t("STAY RULES", "قواعد الإقامة"),
  minimumNights: t("Minimum nights", "أقل عدد ليالٍ"),
  noMinimum: t("0 = no minimum", "٠ = بلا حدّ أدنى"),
  checkIn: t("Check-in", "الوصول"),
  checkOut: t("Check-out", "المغادرة"),
  open: t("Open", "مفتوح"),
  closed: t("Closed", "مغلق"),
  stayRulesHint: t(
    "Only for the nights you pick - the contract rules apply again after them. Use the day buttons above for weekend days only.",
    "للّيالي التي تختارها وحدها — وتسري قواعد العقد بعدها من جديد. واستخدم أزرار الأيام أعلاه لأيام نهاية الأسبوع فقط."
  ),

  /* ---------------------------------------- OV 04.BP*, the fourth middle */
  bulkRatesTitle: t("Bulk rates", "\u0623\u0633\u0639\u0627\u0631 \u0628\u0627\u0644\u062c\u0645\u0644\u0629"),
  bulkRatesBody: t(
    "Change prices for many nights and rooms at once. Saved as a draft until you publish.",
    "\u063a\u064a\u0651\u0631 \u0623\u0633\u0639\u0627\u0631 \u0644\u064a\u0627\u0644\u064d \u0648\u063a\u0631\u0641 \u0643\u062b\u064a\u0631\u0629 \u062f\u0641\u0639\u0629 \u0648\u0627\u062d\u062f\u0629. \u0648\u062a\u064f\u062d\u0641\u0638 \u0643\u0645\u0633\u0648\u062f\u0629 \u062d\u062a\u0649 \u062a\u0646\u0634\u0631."
  ),
  price: t("PRICE \u00b7 INCL. VAT", "\u0627\u0644\u0633\u0639\u0631 \u00b7 \u0634\u0627\u0645\u0644 \u0627\u0644\u0636\u0631\u064a\u0628\u0629"),
  onePrice: t("One price for every night", "\u0633\u0639\u0631 \u0648\u0627\u062d\u062f \u0644\u0643\u0644 \u0644\u064a\u0644\u0629"),
  apartPrice: t("Weekdays and weekend apart", "\u0623\u064a\u0627\u0645 \u0627\u0644\u0623\u0633\u0628\u0648\u0639 \u0648\u0646\u0647\u0627\u064a\u062a\u0647 \u0643\u0644\u0651 \u0639\u0644\u0649 \u062d\u062f\u0629"),
  baseEvery: t("Base room \u00b7 every night", "\u0627\u0644\u063a\u0631\u0641\u0629 \u0627\u0644\u0623\u0633\u0627\u0633 \u00b7 \u0643\u0644 \u0644\u064a\u0644\u0629"),
  baseWeekday: t(
    "Base room \u00b7 weekdays (Sun - Wed)",
    "\u0627\u0644\u063a\u0631\u0641\u0629 \u0627\u0644\u0623\u0633\u0627\u0633 \u00b7 \u0623\u064a\u0627\u0645 \u0627\u0644\u0623\u0633\u0628\u0648\u0639 (\u0627\u0644\u0623\u062d\u062f - \u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621)"
  ),
  baseWeekend: t(
    "Base room \u00b7 weekend (Thu, Fri)",
    "\u0627\u0644\u063a\u0631\u0641\u0629 \u0627\u0644\u0623\u0633\u0627\u0633 \u00b7 \u0646\u0647\u0627\u064a\u0629 \u0627\u0644\u0623\u0633\u0628\u0648\u0639 (\u0627\u0644\u062e\u0645\u064a\u0633 \u0648\u0627\u0644\u062c\u0645\u0639\u0629)"
  ),
  othersFollow: t(
    "Other rooms follow the base + their supplement. Nationality prices in a season follow by their own rules.",
    "\u062a\u062a\u0628\u0639 \u0628\u0642\u064a\u0629 \u0627\u0644\u063a\u0631\u0641 \u0627\u0644\u0623\u0633\u0627\u0633 + \u0641\u0631\u0642\u0647\u0627. \u0648\u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u062c\u0646\u0633\u064a\u0627\u062a \u062f\u0627\u062e\u0644 \u0645\u0648\u0633\u0645 \u062a\u062a\u0628\u0639 \u0642\u0648\u0627\u0639\u062f\u0647\u0627 \u0627\u0644\u062e\u0627\u0635\u0629."
  ),
  /* OV 04.BPPE - the one field that stops the Add. */
  needWeekendPrice: t(
    "Enter a price for the weekend nights.",
    "\u0627\u0643\u062a\u0628 \u0633\u0639\u0631\u064b\u0627 \u0644\u0644\u064a\u0627\u0644\u064a \u0646\u0647\u0627\u064a\u0629 \u0627\u0644\u0623\u0633\u0628\u0648\u0639."
  ),
  needPrice: t("Enter a price.", "\u0627\u0643\u062a\u0628 \u0633\u0639\u0631\u064b\u0627."),

  /* ------------------------------------------- the nights, once picked */
  nightsPicked: t("{nights} · {ranges}", "{nights} · {ranges}"),
  rangeChip: t("{when} · {nights}", "{when} · {nights}"),
  clearNights: t("Clear nights", "\u0627\u0645\u0633\u062d \u0627\u0644\u0644\u064a\u0627\u0644\u064a"),
  pickedHint: t(
    "{nights} · {weekdays} and {weekend}. Choose the rooms and what to set below, then press + Add to put it in your list.",
    "{nights} · {weekdays} و{weekend}. اختر الغرف وما تريد ضبطه أدناه، ثم اضغط + أضف لتضعه في قائمتك."
  ),
  againHint: t(
    "Pick one night or a range (pick again to add another range). Nothing changes until you press Save.",
    "\u0627\u062e\u062a\u0631 \u0644\u064a\u0644\u0629 \u0623\u0648 \u0641\u062a\u0631\u0629 (\u0648\u0627\u062e\u062a\u0631 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649 \u0644\u062a\u0636\u064a\u0641 \u0641\u062a\u0631\u0629 \u0623\u062e\u0631\u0649). \u0648\u0644\u0627 \u064a\u062a\u063a\u064a\u0631 \u0634\u064a\u0621 \u062d\u062a\u0649 \u062a\u0636\u063a\u0637 \u062d\u0641\u0638."
  ),
  weekendIn: t("{weekend} ({list})", "{weekend} ({list})"),
  /* No weekend nights at all: the sentence stops rather than saying
     "and 0 weekend nights ()", which reads like a bug. */
  pickedHintWeekdaysOnly: t(
    "{nights} · {weekdays}. Choose the rooms and what to set below, then press + Add to put it in your list.",
    "{nights} · {weekdays}. اختر الغرف وما تريد ضبطه أدناه، ثم اضغط + أضف لتضعه في قائمتك."
  ),
  nightsPickedHappen: t(
    "{nights} picked ({when}). Now choose the rooms and what to set. Nothing is saved until you press Save.",
    "اخترت {nights} ({when}). والآن اختر الغرف وما تريد ضبطه. ولا يُحفظ شيء حتى تضغط حفظ."
  ),

  /* ------------------------------------------------- what will happen */
  roomNights: t(
    "{what} on {nights} × {rooms} = {total}",
    "{what} على {nights} × {rooms} = {total}"
  ),
  roomNightsOne: t("{what} on {nights} × {rooms}", "{what} على {nights} × {rooms}"),
  roomNightsShort: t("{what} on {total}", "{what} على {total}"),
  acrossContracts: t(
    "{what} on {nights} × {rooms} in {contracts} = {total}",
    "{what} على {nights} × {rooms} في {contracts} = {total}"
  ),
  bulletRooms: t("{rooms} \u00b7 {when} \u00b7 every day.", "{rooms} \u00b7 {when} \u00b7 \u0643\u0644 \u064a\u0648\u0645."),
  bulletHotel: t(
    "Al Noor Makkah Hotel \u00b7 {contracts} \u00b7 {when}.",
    "\u0641\u0646\u062f\u0642 \u0627\u0644\u0646\u0648\u0631 \u0645\u0643\u0629 \u00b7 {contracts} \u00b7 {when}."
  ),
  bulletHeld: t(
    "Prices and rooms held stay as they are. The 4 confirmed bookings on these nights are not touched.",
    "\u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u0648\u0627\u0644\u063a\u0631\u0641 \u0627\u0644\u0645\u062d\u062c\u0648\u0632\u0629 \u062a\u0628\u0642\u0649 \u0643\u0645\u0627 \u0647\u064a. \u0648\u0627\u0644\u062d\u062c\u0648\u0632\u0627\u062a \u0627\u0644\u0623\u0631\u0628\u0639\u0629 \u0627\u0644\u0645\u0624\u0643\u062f\u0629 \u0641\u064a \u0647\u0630\u0647 \u0627\u0644\u0644\u064a\u0627\u0644\u064a \u0644\u0627 \u062a\u064f\u0645\u0633."
  ),
  bulletDraft: t(
    "Saved as a draft - agents can still book these nights until you publish.",
    "\u062a\u064f\u062d\u0641\u0638 \u0643\u0645\u0633\u0648\u062f\u0629 \u2014 \u0648\u064a\u0645\u0643\u0646 \u0644\u0644\u0648\u0643\u0644\u0627\u0621 \u062d\u062c\u0632 \u0647\u0630\u0647 \u0627\u0644\u0644\u064a\u0627\u0644\u064a \u062d\u062a\u0649 \u062a\u0646\u0634\u0631."
  ),
  /*
   * OV 04.BXF - Restrictions asks two questions the other three do not.
   *
   * "Applies on" is not the day pills the other overlays share: a stay
   * rule either covers the whole range or only the contract's weekend,
   * and on the nights it does not cover a guest books as though the rule
   * were not there at all. That is a sentence, not a set of ticks.
   *
   * And check-in / check-out is per night rather than per range, because
   * closing arrivals on one Friday is the ordinary case. So the picked
   * nights come back as a calendar with two chips on each.
   */
  appliesOn: t("Applies on", "ينطبق على"),
  appliesEvery: t("Every day in the range", "كل يوم في المدى"),
  appliesWeekend: t(
    "Weekend days only · Thu, Fri",
    "أيام نهاية الأسبوع فقط · الخميس، الجمعة"
  ),
  appliesOnHint: t(
    "Weekend days come from the contract. On the other nights guests book as if this rule did not exist.",
    "أيام نهاية الأسبوع تأتي من العقد. وفي الليالي الأخرى يحجز النزلاء كأن هذه القاعدة غير موجودة."
  ),
  checkDays: t("CHECK-IN & CHECK-OUT DAYS", "أيام الدخول والخروج"),
  checkDaysLead: t(
    "Every picked night is open for check-in and check-out until you close one.",
    "كل ليلة اخترتها مفتوحة للدخول والخروج حتى تغلق واحدة."
  ),
  checkDaysEmpty: t(
    "Pick nights first. They show here as a calendar, so you can open or close check-in and check-out day by day.",
    "اختر الليالي أولًا. تظهر هنا كتقويم، فتفتح أو تغلق الدخول والخروج يومًا بيوم."
  ),
  inTag: t("In", "دخول"),
  outTag: t("Out", "خروج"),
  legendOpen: t("open", "مفتوح"),
  legendClosed: t("closed", "مغلق"),
  legendTap: t(
    "· Tap a day or a weekday name to change it",
    "· اضغط يومًا أو اسم يوم لتغييره"
  ),
  /* The calendar's week starts on Saturday, so the contract's weekend
     (Thu, Fri) closes it rather than being split across two ends. */
  calWeekdays: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
  calWeekdaysAr: [
    "السبت",
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
  ],
  /* OV 04.BXF - what a restriction will do, in the frame's own order. */
  roomNightsNoTotal: t("{what} on {nights} × {rooms}", "{what} على {nights} × {rooms}"),
  bulletChecksBoth: t(
    "No check-in on {in} and no check-out on {out}. Every other night stays open.",
    "لا دخول يوم {in} ولا خروج يوم {out}. وتبقى كل ليلة أخرى مفتوحة."
  ),
  bulletChecksIn: t(
    "No check-in on {in}. Every other night stays open.",
    "لا دخول يوم {in}. وتبقى كل ليلة أخرى مفتوحة."
  ),
  bulletChecksOut: t(
    "No check-out on {out}. Every other night stays open.",
    "لا خروج يوم {out}. وتبقى كل ليلة أخرى مفتوحة."
  ),
  bulletChecksNone: t(
    "Check-in and check-out stay open on every one of them.",
    "يبقى الدخول والخروج مفتوحًا في كل واحدة منها."
  ),
  bulletOnlyThese: t(
    "Only on these nights. After them the contract rule (minimum {n} nights) applies again.",
    "في هذه الليالي وحدها. وبعدها تعود قاعدة العقد ({n} ليالٍ كحد أدنى)."
  ),
  /* Stop sale's draft line says agents can still book; a stay rule is
     not a closure, so its draft line says when they will see it. */
  bulletRuleDraft: t(
    "Saved as a draft - agents see it after you publish.",
    "ØªÙØ­ÙØ¸ ÙÙØ³ÙØ¯Ø© - ÙÙØ±Ø§ÙØ§ Ø§ÙÙÙÙØ§Ø¡ Ø¨Ø¹Ø¯ Ø§ÙÙØ´Ø±."
  ),
  bulletSearchesOnly: t(
    "It applies to new searches and bookings only - confirmed bookings keep their rules.",
    "تنطبق على البحث والحجوزات الجديدة وحدها - والحجوزات المؤكدة تحتفظ بقواعدها."
  ),
  bulletReplacesRelease: t(
    "{rooms}. It replaces the contract release ({days} days) on these nights only.",
    "{rooms}. \u0648\u064a\u0633\u062a\u0628\u062f\u0644 \u0625\u0635\u062f\u0627\u0631 \u0627\u0644\u0639\u0642\u062f ({days} \u0623\u064a\u0627\u0645) \u0641\u064a \u0647\u0630\u0647 \u0627\u0644\u0644\u064a\u0627\u0644\u064a \u0648\u062d\u062f\u0647\u0627."
  ),
  bulletReleaseBack: t(
    "Unsold rooms go back to the hotel {days} days before each night, at {at} Makkah time.",
    "\u062a\u0639\u0648\u062f \u0627\u0644\u063a\u0631\u0641 \u063a\u064a\u0631 \u0627\u0644\u0645\u0628\u0627\u0639\u0629 \u0625\u0644\u0649 \u0627\u0644\u0641\u0646\u062f\u0642 \u0642\u0628\u0644 \u0643\u0644 \u0644\u064a\u0644\u0629 \u0628\u0640{days} \u0623\u064a\u0627\u0645\u060c \u0627\u0644\u0633\u0627\u0639\u0629 {at} \u0628\u062a\u0648\u0642\u064a\u062a \u0645\u0643\u0629."
  ),
  bulletReleaseDraft: t(
    "Saved as a draft - the contract release applies until you publish.",
    "\u062a\u064f\u062d\u0641\u0638 \u0643\u0645\u0633\u0648\u062f\u0629 \u2014 \u0648\u064a\u0633\u0631\u064a \u0625\u0635\u062f\u0627\u0631 \u0627\u0644\u0639\u0642\u062f \u062d\u062a\u0649 \u062a\u0646\u0634\u0631."
  ),
  /* OV 04.BRRW - the window has already passed for some of the nights. */
  releaseAlreadyPast: t(
    "{when} are already inside a {days}-day release. When you save, their unsold rooms go back to the hotel right away and those nights stop selling.",
    "{when} \u062f\u0627\u062e\u0644 \u0625\u0635\u062f\u0627\u0631 {days} \u0628\u0627\u0644\u0641\u0639\u0644. \u0648\u062d\u064a\u0646 \u062a\u062d\u0641\u0638 \u062a\u0639\u0648\u062f \u063a\u0631\u0641\u0647\u0627 \u063a\u064a\u0631 \u0627\u0644\u0645\u0628\u0627\u0639\u0629 \u0625\u0644\u0649 \u0627\u0644\u0641\u0646\u062f\u0642 \u0641\u0648\u0631\u064b\u0627 \u0648\u062a\u062a\u0648\u0642\u0641 \u062a\u0644\u0643 \u0627\u0644\u0644\u064a\u0627\u0644\u064a \u0639\u0646 \u0627\u0644\u0628\u064a\u0639."
  ),
  /* OV 04.BRRE / 04.BPPE - the box says nothing while a field is red. */
  fixRed: t(
    "Fix the field in red to see what will change.",
    "\u0623\u0635\u0644\u062d \u0627\u0644\u062d\u0642\u0644 \u0627\u0644\u0623\u062d\u0645\u0631 \u0644\u062a\u0631\u0649 \u0645\u0627 \u0633\u064a\u062a\u063a\u064a\u0631."
  ),
  releaseTooMany: t(
    "Release can't be more than {max} days before arrival.",
    "\u0644\u0627 \u064a\u0645\u0643\u0646 \u0623\u0646 \u064a\u0643\u0648\u0646 \u0627\u0644\u0625\u0635\u062f\u0627\u0631 \u0642\u0628\u0644 \u0627\u0644\u0648\u0635\u0648\u0644 \u0628\u0623\u0643\u062b\u0631 \u0645\u0646 {max} \u064a\u0648\u0645\u064b\u0627."
  ),
  useMaxDays: t("Use {max} days", "\u0627\u0633\u062a\u062e\u062f\u0645 {max} \u064a\u0648\u0645\u064b\u0627"),

  /* OV 04.BSAC - what ticking "every contract" reaches. */
  alsoCloses: t(
    "THIS ALSO CLOSES THE SAME NIGHTS ON",
    "\u0648\u0647\u0630\u0627 \u064a\u063a\u0644\u0642 \u0627\u0644\u0644\u064a\u0627\u0644\u064a \u0646\u0641\u0633\u0647\u0627 \u0639\u0644\u0649"
  ),
  notOnContract: t("({room} is not on this contract)", "({room} \u0644\u064a\u0633\u062a \u0641\u064a \u0647\u0630\u0627 \u0627\u0644\u0639\u0642\u062f)"),
  matchedByName: t(
    "Rooms are matched by the hotel's room names. Untick a contract in the list to leave it open.",
    "\u062a\u064f\u0637\u0627\u0628\u0642 \u0627\u0644\u063a\u0631\u0641 \u0628\u0623\u0633\u0645\u0627\u0626\u0647\u0627 \u0641\u064a \u0627\u0644\u0641\u0646\u062f\u0642. \u0648\u0623\u0632\u0644 \u0639\u0644\u0627\u0645\u0629 \u0639\u0642\u062f \u0645\u0646 \u0627\u0644\u0642\u0627\u0626\u0645\u0629 \u0644\u062a\u062a\u0631\u0643\u0647 \u0645\u0641\u062a\u0648\u062d\u064b\u0627."
  ),

  /* ------------------------------------------------ the list, and after */
  addedTitle: t("Added to the list \u00b7 {what}", "\u0623\u064f\u0636\u064a\u0641 \u0625\u0644\u0649 \u0627\u0644\u0642\u0627\u0626\u0645\u0629 \u00b7 {what}"),
  addedBody: t(
    "Not saved yet. Add another change below, or press Save to keep everything in the list as a draft.",
    "\u0644\u0645 \u064a\u064f\u062d\u0641\u0638 \u0628\u0639\u062f. \u0623\u0636\u0641 \u062a\u063a\u064a\u064a\u0631\u064b\u0627 \u0622\u062e\u0631 \u0623\u062f\u0646\u0627\u0647\u060c \u0623\u0648 \u0627\u0636\u063a\u0637 \u062d\u0641\u0638 \u0644\u062a\u064f\u0628\u0642\u064a \u0643\u0644 \u0645\u0627 \u0641\u064a \u0627\u0644\u0642\u0627\u0626\u0645\u0629 \u0643\u0645\u0633\u0648\u062f\u0629."
  ),
  appliedTitle: t("\u2713 Applied \u00b7 {what} is live now", "\u2713 \u0637\u064f\u0628\u0651\u0642 \u00b7 {what} \u0633\u0627\u0631\u064d \u0627\u0644\u0622\u0646"),
  appliedBody: t(
    "Agents can no longer book these nights. Confirmed bookings are not touched.",
    "\u0644\u0645 \u064a\u0639\u062f \u0628\u0625\u0645\u0643\u0627\u0646 \u0627\u0644\u0648\u0643\u0644\u0627\u0621 \u062d\u062c\u0632 \u0647\u0630\u0647 \u0627\u0644\u0644\u064a\u0627\u0644\u064a. \u0648\u0627\u0644\u062d\u062c\u0648\u0632\u0627\u062a \u0627\u0644\u0645\u0624\u0643\u062f\u0629 \u0644\u0627 \u062a\u064f\u0645\u0633."
  ),
  draftedTitle: t("\u2713 Saved as a draft \u00b7 {what}", "\u2713 \u062d\u064f\u0641\u0638 \u0643\u0645\u0633\u0648\u062f\u0629 \u00b7 {what}"),
  draftedBody: t(
    "Nothing reaches agents until you publish it from Review & publish on the rates page.",
    "\u0648\u0644\u0627 \u064a\u0635\u0644 \u0634\u064a\u0621 \u0625\u0644\u0649 \u0627\u0644\u0648\u0643\u0644\u0627\u0621 \u062d\u062a\u0649 \u062a\u0646\u0634\u0631\u0647 \u0645\u0646 \u00ab\u0631\u0627\u062c\u0639 \u0648\u0627\u0646\u0634\u0631\u00bb \u0641\u064a \u0635\u0641\u062d\u0629 \u0627\u0644\u0623\u0633\u0639\u0627\u0631."
  ),
  removedLine: t(
    "Removed \u00b7 {what} is open for sale again.",
    "\u0623\u064f\u0632\u064a\u0644 \u00b7 {what} \u0645\u0641\u062a\u0648\u062d \u0644\u0644\u0628\u064a\u0639 \u0645\u0646 \u062c\u062f\u064a\u062f."
  ),
  undo: t("Undo", "\u062a\u0631\u0627\u062c\u0639"),
  /* The frame names both halves: which rooms, and on which nights. */
  removedWhat: t("{rooms} on {when}", "{rooms} في {when}"),
  done: t("Done", "\u062a\u0645"),
  inList: t(
    "{n} in the list \u00b7 {m} not saved yet",
    "{n} \u0641\u064a \u0627\u0644\u0642\u0627\u0626\u0645\u0629 \u00b7 {m} \u0644\u0645 \u064a\u064f\u062d\u0641\u0638 \u0628\u0639\u062f"
  ),
  newNotSaved: t("New \u00b7 not saved", "\u062c\u062f\u064a\u062f \u00b7 \u0644\u0645 \u064a\u064f\u062d\u0641\u0638"),
  newLive: t("New \u00b7 Live", "\u062c\u062f\u064a\u062f \u00b7 \u0633\u0627\u0631\u064d"),
  newDraft: t("Draft \u00b7 not published", "\u0645\u0633\u0648\u062f\u0629 \u00b7 \u0644\u0645 \u062a\u064f\u0646\u0634\u0631"),
  removedPill: t("Removed", "\u0623\u064f\u0632\u064a\u0644"),
  pressAddFirst: t("Press + Add first", "\u0627\u0636\u063a\u0637 + \u0623\u0636\u0641 \u0623\u0648\u0644\u064b\u0627"),
  reviewCount: t("Review & save all ({n})", "\u0631\u0627\u062c\u0639 \u0648\u0627\u062d\u0641\u0638 \u0627\u0644\u0643\u0644 ({n})"),

  /* --------------------------------------- OV 04.B*RV, the review step */
  reviewBody: t(
    "Check everything in the list. Nothing is saved until you confirm.",
    "\u0631\u0627\u062c\u0639 \u0643\u0644 \u0645\u0627 \u0641\u064a \u0627\u0644\u0642\u0627\u0626\u0645\u0629. \u0648\u0644\u0627 \u064a\u064f\u062d\u0641\u0638 \u0634\u064a\u0621 \u062d\u062a\u0649 \u062a\u0624\u0643\u0651\u062f."
  ),
  inYourList: t("IN YOUR LIST \u00b7 {n} CHANGES", "\u0641\u064a \u0642\u0627\u0626\u0645\u062a\u0643 \u00b7 {n} \u062a\u063a\u064a\u064a\u0631\u0627\u062a"),
  inYourListOne: t("IN YOUR LIST \u00b7 1 CHANGE", "\u0641\u064a \u0642\u0627\u0626\u0645\u062a\u0643 \u00b7 \u062a\u063a\u064a\u064a\u0631 \u0648\u0627\u062d\u062f"),
  remove: t("Remove", "\u0625\u0632\u0627\u0644\u0629"),
  backToEdit: t("Back to edit", "\u0639\u062f \u0644\u0644\u062a\u062d\u0631\u064a\u0631"),
  takesEffect: t(
    "Takes effect as soon as you confirm",
    "\u064a\u0633\u0631\u064a \u0641\u0648\u0631 \u062a\u0623\u0643\u064a\u062f\u0643"
  ),
  takesEffectBody: t(
    "Agents stop seeing these nights right away - no publishing needed. Confirmed bookings are not touched. Everything is in the activity log.",
    "\u064a\u062a\u0648\u0642\u0641 \u0627\u0644\u0648\u0643\u0644\u0627\u0621 \u0639\u0646 \u0631\u0624\u064a\u0629 \u0647\u0630\u0647 \u0627\u0644\u0644\u064a\u0627\u0644\u064a \u0641\u0648\u0631\u064b\u0627 \u2014 \u0628\u0644\u0627 \u0646\u0634\u0631. \u0648\u0627\u0644\u062d\u062c\u0648\u0632\u0627\u062a \u0627\u0644\u0645\u0624\u0643\u062f\u0629 \u0644\u0627 \u062a\u064f\u0645\u0633. \u0648\u0643\u0644 \u0634\u064a\u0621 \u0641\u064a \u0633\u062c\u0644 \u0627\u0644\u0646\u0634\u0627\u0637."
  ),
  savedDraftBand: t("Saved as a draft", "\u064a\u064f\u062d\u0641\u0638 \u0643\u0645\u0633\u0648\u062f\u0629"),
  savedDraftBandBody: t(
    "Nothing reaches agents until you publish it from Review & publish on the rates page.",
    "\u0648\u0644\u0627 \u064a\u0635\u0644 \u0634\u064a\u0621 \u0625\u0644\u0649 \u0627\u0644\u0648\u0643\u0644\u0627\u0621 \u062d\u062a\u0649 \u062a\u0646\u0634\u0631\u0647 \u0645\u0646 \u00ab\u0631\u0627\u062c\u0639 \u0648\u0627\u0646\u0634\u0631\u00bb \u0641\u064a \u0635\u0641\u062d\u0629 \u0627\u0644\u0623\u0633\u0639\u0627\u0631."
  ),
  appliesNow: t("Applies now", "\u064a\u0633\u0631\u064a \u0627\u0644\u0622\u0646"),
  confirmApply: t("Confirm & apply now", "\u0623\u0643\u0651\u062f \u0648\u0637\u0628\u0651\u0642 \u0627\u0644\u0622\u0646"),
  savedAsDraft: t("Saved as a draft", "\u064a\u064f\u062d\u0641\u0638 \u0643\u0645\u0633\u0648\u062f\u0629"),
  saveAllDraft: t("Save all as draft", "\u0627\u062d\u0641\u0638 \u0627\u0644\u0643\u0644 \u0643\u0645\u0633\u0648\u062f\u0629"),

  /* The words each overlay's line uses in the list. */
  newPrice: t("New price", "\u0633\u0639\u0631 \u062c\u062f\u064a\u062f"),
  /* OV 04.BRF names the cut-off too: a release is a day and an hour,
     and "Release 2 days" leaves out the half that decides the night. */
  releaseLine: t(
    "Release {days} days before · {at}",
    "إصدار قبل {days} · {at}"
  ),
  releaseSameDay: t("Release same day", "\u0625\u0635\u062f\u0627\u0631 \u0641\u064a \u0627\u0644\u064a\u0648\u0645 \u0646\u0641\u0633\u0647"),
  minimumLine: t("Minimum {n} nights", "\u062d\u062f\u0651 \u0623\u062f\u0646\u0649 {n} \u0644\u064a\u0627\u0644\u064d"),
  checkInClosedLine: t("Check-in closed", "\u0627\u0644\u0648\u0635\u0648\u0644 \u0645\u063a\u0644\u0642"),
  checkOutClosedLine: t("Check-out closed", "\u0627\u0644\u0645\u063a\u0627\u062f\u0631\u0629 \u0645\u063a\u0644\u0642\u0629"),
} as const;

/** What each overlay already has on this contract, as the frames draw it. */
export const alreadySet: Record<BulkKind, AlreadySet[]> = {
  bulkRates: [
    {
      when: t("24 - 30 Sep 2026", "\u0662\u0664 - \u0663\u0660 \u0633\u0628\u062a\u0645\u0628\u0631 \u0662\u0660\u0662\u0666"),
      rooms: t("All rooms", "\u0643\u0644 \u0627\u0644\u063a\u0631\u0641"),
      value: t("450 / 550", "\u0664\u0665\u0660 / \u0665\u0665\u0660"),
    },
    {
      when: t("1 - 3 Oct 2026", "\u0661 - \u0663 \u0623\u0643\u062a\u0648\u0628\u0631 \u0662\u0660\u0662\u0666"),
      rooms: t("All rooms", "\u0643\u0644 \u0627\u0644\u063a\u0631\u0641"),
      value: t("480 / 580", "\u0664\u0668\u0660 / \u0665\u0668\u0660"),
      draft: true,
    },
  ],
  stopSale: [
    {
      when: t("21 - 22 Sep 2026", "٢١ - ٢٢ سبتمبر ٢٠٢٦"),
      rooms: t("Deluxe Room · City View", "غرفة ديلوكس · إطلالة المدينة"),
      value: t("Stop sale", "إيقاف البيع"),
      tone: "danger",
    },
    {
      when: t("26 - 27 Sep 2026", "٢٦ - ٢٧ سبتمبر ٢٠٢٦"),
      rooms: t("Quad Room · City View", "غرفة رباعية · إطلالة المدينة"),
      value: t("On Request", "عند الطلب"),
      tone: "warning",
    },
  ],
  release: [
    {
      when: t("Every night", "كل ليلة"),
      rooms: t("All rooms", "كل الغرف"),
      value: t("3 days · 18:00", "٣ أيام · ١٨:٠٠"),
      fromContract: true,
    },
    {
      when: t("24 - 30 Sep 2026", "٢٤ - ٣٠ سبتمبر ٢٠٢٦"),
      rooms: t("Standard Room · City View", "غرفة قياسية · إطلالة المدينة"),
      value: t("1 day · 18:00", "يوم واحد · ١٨:٠٠"),
    },
  ],
  /*
   * The restrictions already on this contract are the contract's own
   * rules, read from it rather than written down twice. They were
   * written twice, and the two copies disagreed: the panel showed two
   * rules where the contract has three, called them all live where one
   * is dated for next February, and put a Fridays-only check-in closure
   * on 20 - 25 Sep where the contract says four nights minimum and no
   * check-in on the 23rd. A supplier reading both would not know which
   * to believe, and the contract is the one that decides.
   */
  restrictions: contractRestrictions.map((rule) => ({
    when: {
      en: rule.overlap ? `${rule.dates} · ${rule.overlap}` : rule.dates,
      ar: rule.overlapAr
        ? `${rule.datesAr} · ${rule.overlapAr}`
        : rule.datesAr,
    },
    rooms: {
      en: `${rule.scope} · ${rule.updated}`,
      ar: `${rule.scopeAr} · ${rule.updatedAr}`,
    },
    value: {
      en: `Min ${rule.minNights} · ${rule.checks}`,
      ar: `الحد الأدنى ${rule.minNightsAr} · ${rule.checksAr}`,
    },
    fromContract: true,
    ...(rule.active ? {} : { inactive: true }),
  })),
};

export const bulkKindLabel: Record<BulkKind, Bi> = {
  bulkRates: t("BULK RATES", "\u0623\u0633\u0639\u0627\u0631 \u0628\u0627\u0644\u062c\u0645\u0644\u0629"),
  stopSale: t("STOP SALE / ON REQUEST", "إيقاف البيع / عند الطلب"),
  release: t("RELEASE", "الإصدار"),
  restrictions: t("RESTRICTIONS", "القيود"),
};
