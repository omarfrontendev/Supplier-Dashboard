/**
 * The rate-calendar overlays — Figma OV 04.1A (bulk rates), OV 04.2 (stop
 * sale / on request), OV 04.3 (release), OV 04.4 (night status), OV 04.5
 * (one night) and OV 04.6 (the pool breakdown behind a night).
 */

import { contractRooms, fixedPriceRooms } from "@/lib/contract-data";

export interface Bi {
  en: string;
  ar: string;
}

const t = (en: string, ar: string): Bi => ({ en, ar });

/** Arabic copy carries Arabic-Indic digits, the way the rest of it reads. */
export const arNum = (value: number | string) =>
  String(value).replace(/[0-9]/g, (digit) => "٠١٢٣٤٥٦٧٨٩"[Number(digit)]!);

/** The seven day boxes a date range is narrowed by, Saturday first. */
/** Flow 12 · Row J — weekday chips, Sunday first, as the picker draws them. */
export const dayChips: Bi[] = [
  t("Su", "أح"),
  t("Mo", "إث"),
  t("Tu", "ثل"),
  t("We", "أر"),
  t("Th", "خم"),
  t("Fr", "جم"),
  t("Sa", "سب"),
];

/** The one field that replaced the From and To boxes. */
export const pickNights: Bi = t("Pick nights", "اختر الليالي");

/** OV 04.1A — the nine rooms the contract sells, priced off the base. */
export interface BulkRateRow {
  room: Bi;
  /** What the room adds to the base; 0 on the base room itself. */
  supplement: number;
}

export const bulkRateRows: BulkRateRow[] = contractRooms
  .filter((room) => room.onSale)
  .map((room) => ({
    room: t(
      `${room.type} · ${room.view}`,
      `${room.typeAr} · ${room.viewAr}`
    ),
    supplement: room.supplement,
  }));

export const bulkRates = {
  overline: t(
    "Makkah Annual Block · Base + supplements",
    "حصة مكة السنوية · أساس + فروق"
  ),
  title: t("Bulk rates", "الأسعار الجماعية"),
  body: t(
    "Set or adjust the room price for many nights at once. Meals keep their per-person supplement from the contract.",
    "اضبط سعر الغرفة أو عدّله لليالٍ كثيرة دفعة واحدة. وتبقى الوجبات على فرقها لكل شخص من العقد."
  ),

  roomsTitle: t("Rooms", "الغرف"),
  allRooms: t("All rooms", "كل الغرف"),

  datesTitle: t("Dates", "التواريخ"),
  from: t("From", "من"),
  to: t("To", "إلى"),
  add: t("+ Add", "+ إضافة"),
  to2: t("to", "إلى"),
  noDates: t(
    "No dates added yet - pick From and To, choose the days, then Add.",
    "لم تُضف تواريخ بعد - اختر «من» و«إلى»، وحدّد الأيام، ثم أضف."
  ),
  removeRange: t("Delete", "حذف"),

  priceTitle: t("Price", "السعر"),
  colRoom: t("Room", "الغرفة"),
  colWeekday: t("Weekdays · Sat - Wed", "أيام الأسبوع · السبت - الأربعاء"),
  colWeekend: t("Weekend · Thu, Fri", "نهاية الأسبوع · الخميس والجمعة"),
  allSelectedRooms: t("All selected rooms", "كل الغرف المختارة"),
  fillsEvery: t("fills every row below", "يملأ كل صفّ أدناه"),
  samePrice: t("Same price for all", "السعر نفسه للجميع"),
  baseRoom: t("BASE room", "الغرفة الأساس"),
  supplementRow: t("base + {amount}", "الأساس + {amount}"),
  footNote: t(
    "Other rooms follow the base (+ their supplement from the contract)",
    "بقية الغرف تتبع الأساس (+ فرقها من العقد)"
  ),

  cancel: t("Cancel", "إلغاء"),
  save: t("Save changes", "حفظ التغييرات"),
};

/** OV 04.2 — the ranges already closed or held, and the one being added. */
export interface SetRange {
  dates: Bi;
  rooms: Bi;
  state: "stop" | "request" | "open";
}

export const stopSaleRanges: SetRange[] = [
  {
    dates: t("18 - 19 Sep 2026", "١٨ - ١٩ سبتمبر ٢٠٢٦"),
    rooms: t("Deluxe Room · City View", "غرفة ديلوكس · إطلالة المدينة"),
    state: "stop",
  },
  {
    dates: t("26 - 27 Sep 2026", "٢٦ - ٢٧ سبتمبر ٢٠٢٦"),
    rooms: t("Quad Room · City View", "غرفة رباعية · إطلالة المدينة"),
    state: "request",
  },
];

export const stopSale = {
  overline: t("Makkah Annual Block", "حصة مكة السنوية"),
  title: t("Stop sale / On Request", "إيقاف البيع / عند الطلب"),
  body: t(
    "Close or open nights for many dates and rooms at once. Prices and rooms held stay as they are.",
    "أغلق ليالي أو افتحها لتواريخ وغرف كثيرة دفعة واحدة. ويبقى السعر والغرف المحجوزة كما هي."
  ),

  alreadySet: t("Already set", "المضبوط بالفعل"),
  delete: t("Delete", "حذف"),

  addTitle: t("Add", "إضافة"),
  datesTitle: t("Dates", "التواريخ"),
  roomsTitle: t("Rooms", "الغرف"),
  allRooms: t("All rooms", "كل الغرف"),
  from: t("From", "من"),
  to: t("To", "إلى"),

  setTo: t("Set these nights to", "اضبط هذه الليالي على"),
  open: t("Open sale", "البيع مفتوح"),
  stop: t("Stop sale", "إيقاف البيع"),
  request: t(
    "On Request - the hotel confirms each booking",
    "عند الطلب - يؤكد الفندق كل حجز"
  ),
  requestShort: t("On Request", "عند الطلب"),

  everyContract: t(
    "Apply to every contract on this hotel",
    "طبّق على كل عقود هذا الفندق"
  ),
  everyContractNote: t(
    "Makkah Annual Block · Ramadan Block · Makkah Rooms Block - useful when the hotel closes a date for everyone.",
    "حصة مكة السنوية · حصة رمضان · حصة غرف مكة - مفيد حين يغلق الفندق تاريخًا على الجميع."
  ),

  cancel: t("Cancel", "إلغاء"),
  save: t("Save changes", "حفظ التغييرات"),
};

/** OV 04.3 — the release rules already in force on this month. */
export interface ReleaseRule {
  dates: Bi;
  rooms: Bi;
  rule: Bi;
  source: Bi;
  /** A rule that differs from the contract's reads in amber. */
  changed?: boolean;
  /** The contract's own rule is read here and edited over there. */
  fromContract?: boolean;
}

export const releaseRules: ReleaseRule[] = [
  {
    dates: t("Every night", "كل ليلة"),
    rooms: t("All rooms", "كل الغرف"),
    rule: t("3 days before · 18:00", "٣ أيام قبل · ١٨:٠٠"),
    source: t("From the contract", "من العقد"),
    fromContract: true,
  },
  {
    dates: t("24 - 30 Sep 2026", "٢٤ - ٣٠ سبتمبر ٢٠٢٦"),
    rooms: t("Standard Room · City View", "غرفة ستاندرد · إطلالة المدينة"),
    rule: t("1 day before · 18:00", "يوم واحد قبل · ١٨:٠٠"),
    source: t("Changed 14 Sep · Abdullrahman", "غُيّرت ١٤ سبتمبر · عبدالرحمن"),
    changed: true,
  },
];

export const releaseRange = {
  overline: t("Makkah Annual Block", "حصة مكة السنوية"),
  title: t("Release", "الإفراج"),
  body: t(
    "How many days before arrival unsold rooms go back to the hotel. The contract sets the default; change it here for some nights or rooms.",
    "كم يومًا قبل الوصول تعود الغرف غير المباعة إلى الفندق. العقد يضع الافتراضي؛ وتغيّره هنا لبعض الليالي أو الغرف."
  ),

  inForce: t("Already set", "المضبوط بالفعل"),
  editInContract: t("Edit in contract ↗", "تعديل في العقد ↗"),
  edit: t("Edit", "تعديل"),
  delete: t("Delete", "حذف"),

  addTitle: t("Add", "إضافة"),
  datesTitle: t("Dates", "التواريخ"),
  roomsTitle: t("Rooms", "الغرف"),
  allRooms: t("All rooms", "كل الغرف"),
  from: t("From", "من"),
  to: t("To", "إلى"),

  sameDay: t("Same day", "اليوم نفسه"),
  numberOfDays: t("Number of days", "عدد الأيام"),
  daysBefore: t("Days before arrival", "أيام قبل الوصول"),
  daysHint: t("e.g. 2", "مثال ٢"),
  at: t("At", "الساعة"),
  releaseTitle: t("Release", "الإفراج"),

  cancel: t("Cancel", "إلغاء"),
  save: t("Save changes", "حفظ التغييرات"),
};

/** OV 04.4 — what one room does on one night. */
export const nightStatus = {
  title: t("Sat 26 Sep 2026", "السبت ٢٦ سبتمبر ٢٠٢٦"),
  room: t("Quad Room · City View", "غرفة رباعية · إطلالة المدينة"),
  body: t(
    "What happens to new bookings for this room on this night.",
    "ما الذي يحدث للحجوزات الجديدة لهذه الغرفة في هذه الليلة."
  ),
  options: [
    {
      key: "open",
      label: t("Open sale", "البيع مفتوح"),
      note: t("Sells from the pool as normal", "تُباع من المخزون كالمعتاد"),
    },
    {
      key: "stop",
      label: t("Stop sale", "إيقاف البيع"),
      note: t(
        "No new bookings. Price and rooms are kept.",
        "لا حجوزات جديدة. ويُحتفظ بالسعر والغرف."
      ),
    },
    {
      key: "request",
      label: t("On Request", "عند الطلب"),
      note: t(
        "Bookings wait for the hotel to confirm - within the contract SLA.",
        "تنتظر الحجوزات تأكيد الفندق - ضمن مهلة العقد."
      ),
    },
  ] as const,
  footNote: t(
    "More nights or rooms? Use Stop sale / On Request in the toolbar",
    "ليالٍ أو غرف أكثر؟ استخدم «إيقاف البيع / عند الطلب» في الشريط"
  ),
  cancel: t("Cancel", "إلغاء"),
  apply: t("Apply", "تطبيق"),
};

/** OV 04.5 — one room, one night, and everything that night carries. */
export const oneNight = {
  overline: t(
    "Standard Room · City View · base room",
    "غرفة ستاندرد · إطلالة المدينة · الغرفة الأساس"
  ),
  title: t("Change prices", "تغيير الأسعار"),
  body: t(
    "Room-only price for the nights you pick. The contract stays as it is.",
    "سعر الغرفة وحدها لليالي التي تختارها. ويبقى العقد كما هو."
  ),

  /** The frame names the base room on the overline, and the weekend on the date. */
  baseTag: t("base room", "الغرفة الأساس"),
  weekendTag: t("Weekend", "نهاية الأسبوع"),
  dateLabel: t("Nights", "الليالي"),
  dateValue: t("Thu 24 Sep 2026 · Weekend", "الخميس ٢٤ سبتمبر ٢٠٢٦ · نهاية الأسبوع"),
  priceLabel: t("Price for this night · SAR", "سعر هذه الليلة · ر.س"),
  priceValue: 520,
  contractPrice: t("Contract 500", "العقد ٥٠٠"),

  /* OV 04.6A-F - what the frames put around the two fields. */
  weekendNightHint: t(
    "Weekend night (Thu, Fri in your contract)",
    "ليلة نهاية أسبوع (الخميس والجمعة في عقدك)"
  ),
  weekdayNightHint: t(
    "Weekday night",
    "ليلة يوم أسبوع"
  ),
  /* The split, as two cards rather than two radios on a line. */
  onePriceTitle: t("One price for every night", "سعر واحد لكل ليلة"),
  onePriceBody: t(
    "Weekdays and weekend pay the same",
    "أيام الأسبوع ونهايته بالسعر نفسه"
  ),
  apartTitle: t("Weekdays and weekend apart", "أيام الأسبوع ونهايته كلّ على حدة"),
  apartBody: t(
    "Two prices, as in your contract",
    "سعران، كما في عقدك"
  ),
  applyDays: t("Apply to these days", "طبّق على هذه الأيام"),
  allDaysTicked: t(
    "All {n} days are ticked. Untick a day to leave those nights as they are.",
    "كل الأيام الـ{n} معلّمة. أزل علامة يوم لتترك لياليه كما هي."
  ),
  someDaysTicked: t(
    "{n} of 7 days are ticked. The nights on the days you untick stay as they are.",
    "{n} من أصل ٧ أيام معلّمة. وليالي الأيام التي تزيل علامتها تبقى كما هي."
  ),
  weekdaysPrice: t("Weekdays · {nights} · SAR", "أيام الأسبوع · {nights} · ر.س"),
  weekendPriceLabel: t("Weekend · {nights} · SAR", "نهاية الأسبوع · {nights} · ر.س"),
  everyNightPrice: t("Price for every night · SAR", "سعر كل ليلة · ر.س"),
  contractIs: t("Contract {price}", "العقد {price}"),
  /* BR-03-91 - nationality prices live inside a season only, which is
     why a night outside one says so before you wonder. */
  noSeason: t(
    "These nights are not in a season, so every nationality pays the price above. Nationality prices are set inside a season.",
    "هذه الليالي ليست في موسم، فكل الجنسيات تدفع السعر أعلاه. وأسعار الجنسيات تُضبط داخل موسم."
  ),
  /* OV 04.6N / 04.6G - inside a season the nationality groups apply, so
     the grey band above is replaced by what each group will pay. */
  nationalityHead: t(
    "Nationality prices for these nights",
    "\u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u062c\u0646\u0633\u064a\u0627\u062a \u0644\u0647\u0630\u0647 \u0627\u0644\u0644\u064a\u0627\u0644\u064a"
  ),
  nationalitySub: t(
    "From the {season} season \u00b7 everyone else pays the price above",
    "\u0645\u0646 \u0645\u0648\u0633\u0645 {season} \u00b7 \u0648\u064a\u062f\u0641\u0639 \u0627\u0644\u0628\u0627\u0642\u0648\u0646 \u0627\u0644\u0633\u0639\u0631 \u0623\u0639\u0644\u0627\u0647"
  ),
  openSeason: t("Open the season", "\u0627\u0641\u062a\u062d \u0627\u0644\u0645\u0648\u0633\u0645"),
  adjustOnYourPrice: t(
    "{sign} {amount} SAR on your price",
    "{sign} {amount} \u0631.\u0633 \u0639\u0644\u0649 \u0633\u0639\u0631\u0643"
  ),
  fixedInSeason: t(
    "Fixed price in the season - keep it or type a new one",
    "\u0633\u0639\u0631 \u062b\u0627\u0628\u062a \u0641\u064a \u0627\u0644\u0645\u0648\u0633\u0645 \u2014 \u0623\u0628\u0642\u0647 \u0623\u0648 \u0627\u0643\u062a\u0628 \u063a\u064a\u0631\u0647"
  ),
  seasonIs: t("Season {price}", "\u0627\u0644\u0645\u0648\u0633\u0645 {price}"),
  seasonNightHint: t("{tag} \u00b7 {season} season", "{tag} \u00b7 \u0645\u0648\u0633\u0645 {season}"),
  seasonContract: t("{season} {price}", "{season} {price}"),
  /* OV 04.6G / 04.6O - a run of nights can cross a season boundary, and
     the price being typed replaces both sides of it. */
  twoSeasons: t(
    "These nights are in {n}",
    "هذه الليالي في {n}"
  ),
  twoSeasonsBody: t(
    "{list}. The new prices replace both. Each night keeps the nationality rules of its own season.",
    "{list}. والأسعار الجديدة تستبدل الاثنين. وتحتفظ كل ليلة بقواعد جنسيات موسمها."
  ),
  seasonSpan: t("{season} {from} - {to} ({nights})", "{season} {from} - {to} ({nights})"),
  seasonsHave: t(
    "{list} have the same groups · everyone else pays the price above",
    "{list} لها المجموعات نفسها · ويدفع الباقون السعر أعلاه"
  ),
  fixedInEach: t(
    "Fixed in each season - one price replaces both",
    "ثابت في كل موسم — وسعر واحد يستبدل الاثنين"
  ),
  seasonsCount: t("{n} seasons", "{n} مواسم"),

  /* OV 04.6H - what a run of nights may already be carrying. */
  /* A count decides the verb as well as the noun: "1 night already
     have their own price" is a sentence a reader stops at. */
  alreadyPriced: t(
    "{n} already have their own price",
    "{n} \u0644\u0647\u0627 \u0633\u0639\u0631\u0647\u0627 \u0627\u0644\u062e\u0627\u0635 \u0628\u0627\u0644\u0641\u0639\u0644"
  ),
  alreadyPricedOne: t(
    "{n} already has its own price",
    "{n} لها سعرها الخاص بالفعل"
  ),
  alreadyPricedBody: t(
    "{list}. Saving replaces them with this price. Untick those days to keep them.",
    "{list}. \u0648\u0627\u0644\u062d\u0641\u0638 \u064a\u0633\u062a\u0628\u062f\u0644\u0647\u0627 \u0628\u0647\u0630\u0627 \u0627\u0644\u0633\u0639\u0631. \u0623\u0632\u0644 \u0639\u0644\u0627\u0645\u0629 \u062a\u0644\u0643 \u0627\u0644\u0623\u064a\u0627\u0645 \u0644\u062a\u0628\u0642\u064a\u0647\u0627."
  ),
  alreadyPricedBodyOne: t(
    "{list}. Saving replaces it with this price. Untick that day to keep it.",
    "{list}. والحفظ يستبدله بهذا السعر. أزل علامة ذلك اليوم لتبقيه."
  ),
  nightsClosed: t("{n} are closed", "{n} \u0645\u063a\u0644\u0642\u0629"),
  nightsClosedOne: t("{n} is closed", "{n} مغلقة"),
  nightsClosedBody: t(
    "{list} are closed. The price is saved on them and they stay closed until you open them.",
    "{list} \u0645\u063a\u0644\u0642\u0629. \u0648\u064a\u064f\u062d\u0641\u0638 \u0627\u0644\u0633\u0639\u0631 \u0639\u0644\u064a\u0647\u0627 \u0648\u062a\u0628\u0642\u0649 \u0645\u063a\u0644\u0642\u0629 \u062d\u062a\u0649 \u062a\u0641\u062a\u062d\u0647\u0627."
  ),
  nightsClosedBodyOne: t(
    "{list} is closed. The price is saved on it and it stays closed until you open it.",
    "{list} مغلقة. ويُحفظ السعر عليها وتبقى مغلقة حتى تفتحها."
  ),
  bookingsKeep: t(
    "Bookings already made keep their price",
    "\u0627\u0644\u062d\u062c\u0648\u0632\u0627\u062a \u0627\u0644\u0642\u0627\u0626\u0645\u0629 \u062a\u062d\u062a\u0641\u0638 \u0628\u0633\u0639\u0631\u0647\u0627"
  ),
  bookingsKeepBody: t(
    "{n} are booked on these nights. Their price was locked when they were booked.",
    "{n} \u0645\u062d\u062c\u0648\u0632\u0629 \u0641\u064a \u0647\u0630\u0647 \u0627\u0644\u0644\u064a\u0627\u0644\u064a. \u0648\u0642\u064f\u0641\u0644 \u0633\u0639\u0631\u0647\u0627 \u0633\u0627\u0639\u0629 \u062d\u062c\u0632\u0647\u0627."
  ),
  bookedOne: t(
    "{n} is booked on these nights. Its price was locked when it was booked.",
    "{n} محجوزة في هذه الليالي. وقُفل سعرها ساعة حجزها."
  ),

  /* OV 04.6J - a room cannot be given away, and OV 04.6I - it can be
     sold under your own floor, as long as you are told what you did. */
  enterPrice: t("Enter a price above 0", "\u0627\u0643\u062a\u0628 \u0633\u0639\u0631\u064b\u0627 \u0623\u0643\u0628\u0631 \u0645\u0646 \u0635\u0641\u0631"),
  belowFloor: t(
    "Below your minimum selling price ({floor}). You can still save - agents will see {price}.",
    "\u062f\u0648\u0646 \u062d\u062f\u0651\u0643 \u0627\u0644\u0623\u062f\u0646\u0649 \u0644\u0644\u0628\u064a\u0639 ({floor}). \u0648\u064a\u0645\u0643\u0646\u0643 \u0627\u0644\u062d\u0641\u0638 \u0631\u063a\u0645 \u0630\u0644\u0643 \u2014 \u0648\u0633\u064a\u0631\u0649 \u0627\u0644\u0648\u0643\u0644\u0627\u0621 {price}."
  ),
  pricePerNight: t(
    "Price per night \u00b7 {nights} \u00b7 SAR",
    "\u0633\u0639\u0631 \u0627\u0644\u0644\u064a\u0644\u0629 \u00b7 {nights} \u00b7 \u0631.\u0633"
  ),
  contractBoth: t(
    "Contract {weekday} weekdays \u00b7 {weekend} weekend",
    "\u0627\u0644\u0639\u0642\u062f {weekday} \u0623\u064a\u0627\u0645 \u0627\u0644\u0623\u0633\u0628\u0648\u0639 \u00b7 {weekend} \u0646\u0647\u0627\u064a\u062a\u0647"
  ),

  saveOne: t("Save 1 night", "احفظ ليلة واحدة"),

  supplementsLabel: t(
    "This room’s supplements · from the contract",
    "فروق هذه الغرفة · من العقد"
  ),
  editSupplements: t("Edit for this night", "تعديل لهذه الليلة"),
  supplements: [
    {
      label: t("Room supplement", "فرق الغرفة"),
      value: t("Base room · none", "الغرفة الأساس · بلا فرق"),
    },
    {
      label: t("Bed & Breakfast", "إفطار"),
      value: t("+ 45 per person", "+ ٤٥ لكل شخص"),
    },
    {
      label: t("Half Board", "نصف إقامة"),
      value: t("+ 90 per person", "+ ٩٠ لكل شخص"),
    },
    {
      label: t("Child 0 - 5 sharing", "طفل ٠ - ٥ مشارك"),
      value: t("free", "مجانًا"),
    },
    {
      label: t(
        "Child 6 - 11 sharing · no extra bed",
        "طفل ٦ - ١١ مشارك · بلا سرير إضافي"
      ),
      value: t("+ 50", "+ ٥٠"),
    },
    {
      label: t("Child 6 - 11 · extra bed", "طفل ٦ - ١١ · سرير إضافي"),
      value: t("+ 100", "+ ١٠٠"),
    },
  ],

  poolLabel: t("Pool", "المخزون"),
  poolValue: t("2 left of 50 · 48 sold", "بقيت ٢ من ٥٠ · بيعت ٤٨"),
  breakdown: t("Breakdown", "التفصيل"),
  statusLabel: t("Status", "الحالة"),
  statusValue: t("Open sale", "البيع مفتوح"),
  change: t("Change", "تغيير"),
  minNightsLabel: t("Min nights", "أدنى ليالٍ"),
  minNightsValue: t("4 · check-in open", "٤ · الوصول مفتوح"),
  openRule: t("Open rule", "فتح القاعدة"),
  releaseLabel: t("Release", "الإفراج"),
  releaseValue: t("1 day before · 18:00", "يوم واحد قبل · ١٨:٠٠"),

  undo: t("Undo change", "التراجع عن التغيير"),
  draftNote: t(
    "Saved as a draft · goes live when you publish",
    "محفوظ كمسودة · يعمل عند النشر"
  ),
  cancel: t("Cancel", "إلغاء"),
  save: t("Save change", "حفظ التغيير"),
};

/** OV 04.6 — where the night's rooms went. */
export const poolBreakdown = {
  overline: t("Contract pool", "مخزون العقد"),
  title: t("Fri 25 Sep 2026", "الجمعة ٢٥ سبتمبر ٢٠٢٦"),
  body: t(
    "Every room type sells from these 50 rooms.",
    "كل أنواع الغرف تُباع من هذه الـ٥٠ غرفة."
  ),
  rows: [
    { label: t("Rooms in the pool", "الغرف في المخزون"), value: t("50", "٥٠") },
    { label: t("Sold", "المباعة"), value: t("50", "٥٠") },
    { label: t("Left", "المتبقية"), value: t("0", "٠"), danger: true },
    {
      label: t("Overbooking allowed", "الحجز الزائد المسموح"),
      value: t("+2 · 0 used", "+٢ · استُخدم ٠"),
    },
    {
      label: t("Capped rooms", "الغرف المحدودة"),
      value: t(
        "Deluxe City View · 12 of 12 sold",
        "ديلوكس إطلالة المدينة · بيعت ١٢ من ١٢"
      ),
    },
  ],
  note: t(
    "The pool is full. The contract allows controlled overbooking - up to 2 more bookings, then the night stops selling.",
    "المخزون ممتلئ. ويسمح العقد بحجز زائد محكوم - حتى حجزين إضافيين، ثم تتوقف الليلة عن البيع."
  ),
  close: t("Close", "إغلاق"),
};

/** OV 04.8 — the months the grid is drawn across. */
export const monthPicker = {
  overline: t("Within the contract term", "ضمن مدة العقد"),
  title: t("Show months", "إظهار الشهور"),
  body: t(
    "Pick where the grid starts and ends.",
    "اختر أين يبدأ الجدول وأين ينتهي."
  ),
  months: [
    t("Sep 26", "سبتمبر ٢٦"),
    t("Oct 26", "أكتوبر ٢٦"),
    t("Nov 26", "نوفمبر ٢٦"),
    t("Dec 26", "ديسمبر ٢٦"),
    t("Jan 27", "يناير ٢٧"),
    t("Feb 27", "فبراير ٢٧"),
    t("Mar 27", "مارس ٢٧"),
    t("Apr 27", "أبريل ٢٧"),
    t("May 27", "مايو ٢٧"),
    t("Jun 27", "يونيو ٢٧"),
    t("Jul 27", "يوليو ٢٧"),
    t("Aug 27", "أغسطس ٢٧"),
  ],
  /** Which grid month each pill stands for, where the demo holds one. */
  keys: [
    "2026-09",
    null,
    null,
    null,
    null,
    null,
    "2027-03",
    null,
    "2027-05",
    null,
    "2027-07",
    null,
  ] as Array<string | null>,
  tip: t(
    "Tip: pick up to 3 months - the grid gets wide after that.",
    "نصيحة: اختر ٣ شهور على الأكثر - يتسع الجدول كثيرًا بعدها."
  ),
  done: t("Done", "تم"),
};

/** OV 04.9 / 04.9B — the contracts this hotel holds. */
export interface PickerRow {
  title: Bi;
  meta: Bi;
  /** An ended contract is only listed when they are included. */
  ended?: boolean;
}

export const contractPicker = {
  overline: t("Al Noor Makkah Hotel", "فندق النور مكة"),
  title: t("Choose contract", "اختيار العقد"),
  includeEnded: t("Include ended contracts", "تضمين العقود المنتهية"),
  rows: [
    {
      title: t(
        "HTL-2026-0142 · Makkah Annual Block",
        "HTL-2026-0142 · حصة مكة السنوية"
      ),
      meta: t(
        "Active · Base + supplements · Allotment · shared pool 50",
        "نشط · أساس + فروق · حصة · مخزون مشترك ٥٠"
      ),
    },
    {
      title: t(
        "HTL-2026-0148 · Makkah Rooms Block",
        "HTL-2026-0148 · حصة غرف مكة"
      ),
      meta: t(
        "Active · Base + supplements · Allotment · a number per room type",
        "نشط · أساس + فروق · حصة · عدد لكل نوع غرفة"
      ),
    },
    {
      title: t("HTL-2026-0155 · Al Noor Fixed", "HTL-2026-0155 · النور الثابت"),
      meta: t(
        "Active · Fixed price · Allotment · shared pool 30",
        "نشط · سعر ثابت · حصة · مخزون مشترك ٣٠"
      ),
    },
    {
      title: t(
        "HTL-2026-0160 · Al Noor Open Sale",
        "HTL-2026-0160 · النور البيع الحر"
      ),
      meta: t(
        "Active · Base + supplements · Free sale · no quantity",
        "نشط · أساس + فروق · بيع حر · بلا كمية"
      ),
    },
    {
      title: t(
        "HTL-2026-0171 · Al Noor On Request",
        "HTL-2026-0171 · النور عند الطلب"
      ),
      meta: t(
        "Active · Base + supplements · On Request · answer within 2 h",
        "نشط · أساس + فروق · عند الطلب · الرد خلال ساعتين"
      ),
    },
    {
      title: t("HTL-2026-0133 · Ramadan Block", "HTL-2026-0133 · حصة رمضان"),
      meta: t(
        "Scheduled · starts 18 Feb 2027 · Base + supplements · Allotment",
        "مجدول · يبدأ ١٨ فبراير ٢٠٢٧ · أساس + فروق · حصة"
      ),
    },
    {
      title: t(
        "HTL-2026-0091 · Al Noor Summer Block",
        "HTL-2026-0091 · حصة النور الصيفية"
      ),
      meta: t("Ended 19 Sep 2026 · read only", "انتهى ١٩ سبتمبر ٢٠٢٦ · للقراءة فقط"),
      ended: true,
    },
  ] as PickerRow[],
};

/** OV 04.10 — the hotels this account is linked to. */
export const hotelPicker = {
  overline: t("Your linked hotels", "فنادقك المرتبطة"),
  title: t("Choose hotel", "اختيار الفندق"),
  rows: [
    {
      title: t("Al Noor Makkah Hotel", "فندق النور مكة"),
      meta: t("6 contracts", "٦ عقود"),
    },
    {
      title: t("Address Jabal Omar Makkah", "أدرس جبل عمر مكة"),
      meta: t("2 contracts", "عقدان"),
    },
    {
      title: t("Abeer Al Aziziyah Hotel", "فندق عبير العزيزية"),
      meta: t("1 contract", "عقد واحد"),
    },
  ] as PickerRow[],
};

/** OV 04.11 — the grid as a file. */
export const exportView = {
  overline: t(
    "September 2026 · 9 rooms · Makkah Annual Block",
    "سبتمبر ٢٠٢٦ · ٩ غرف · حصة مكة السنوية"
  ),
  title: t("Export this view", "تصدير هذا العرض"),
  body: t(
    "Exactly what you see: the months, the rooms and the rows you have switched on.",
    "ما تراه تمامًا: الشهور والغرف والصفوف التي شغّلتها."
  ),
  formats: [
    {
      key: "xlsx",
      label: t("Excel workbook (.xlsx)", "مصنّف إكسل (.xlsx)"),
      note: t(
        "One sheet per room · rate, inventory, stop sale, restrictions, release",
        "ورقة لكل غرفة · السعر والمخزون وإيقاف البيع والقيود والإفراج"
      ),
    },
    {
      key: "csv",
      label: t("CSV (.csv)", "CSV (.csv)"),
      note: t(
        "One row per room-night - for your own system",
        "صفّ لكل غرفة-ليلة - لنظامك الخاص"
      ),
    },
    {
      key: "pdf",
      label: t("PDF (.pdf)", "PDF (.pdf)"),
      note: t(
        "The grid as it looks now, for sending or printing",
        "الجدول كما يبدو الآن، للإرسال أو الطباعة"
      ),
    },
  ] as const,
  note: t(
    "Unpublished changes are marked in the file so you can tell them apart from what agents can see.",
    "التغييرات غير المنشورة مُعلَّمة في الملف حتى تميّزها عمّا يراه الوكلاء."
  ),
  cancel: t("Cancel", "إلغاء"),
  download: t("Download", "تنزيل"),
};

/** OV 04.7 / 04.7L — everything changed but not yet live. */
export interface PendingChange {
  tag: Bi;
  /** An On Request change is tagged in amber; the rest read plain. */
  tone?: "warning";
  what: Bi;
  from: Bi;
}

export const reviewPublish = {
  overline: t("Makkah Annual Block", "حصة مكة السنوية"),
  title: t("Review & publish", "المراجعة والنشر"),
  body: t(
    "Nothing reaches agents until you publish. Confirmed bookings keep the price and rules they were booked with. To reverse a published change, change the night again and publish.",
    "لا شيء يصل الوكلاء حتى تنشر. وتحتفظ الحجوزات المؤكدة بالسعر والقواعد التي حُجزت بها. ولعكس تغيير منشور، غيّر الليلة مرة أخرى وانشر."
  ),
  changes: [
    {
      tag: t("Rate", "السعر"),
      what: t(
        "Standard Room · City View · Thu 24 Sep",
        "غرفة ستاندرد · إطلالة المدينة · الخميس ٢٤ سبتمبر"
      ),
      from: t("Room only 500 → 520", "الغرفة فقط ٥٠٠ ← ٥٢٠"),
    },
    {
      tag: t("On Request", "عند الطلب"),
      tone: "warning",
      what: t(
        "Quad Room · City View · 26 - 27 Sep",
        "غرفة رباعية · إطلالة المدينة · ٢٦ - ٢٧ سبتمبر"
      ),
      from: t("Open sale → On Request", "البيع مفتوح ← عند الطلب"),
    },
    {
      tag: t("Release", "الإفراج"),
      what: t(
        "Standard Room · City View · 24 - 30 Sep",
        "غرفة ستاندرد · إطلالة المدينة · ٢٤ - ٣٠ سبتمبر"
      ),
      from: t("3 days → 1 day before · 18:00", "٣ أيام ← يوم واحد قبل · ١٨:٠٠"),
    },
  ] as PendingChange[],
  undo: t("Undo", "تراجع"),
  discardAll: t("Discard all", "تجاهل الكل"),
  keepEditing: t("Keep editing", "متابعة التعديل"),
  publish: t("Publish {count} changes", "نشر {count} تغييرات"),
  publishing: t("Publishing {count} changes…", "جارٍ نشر {count} تغييرات…"),
};

/** OV 04.1B / 04.1I / 04.1K / 04.1O / 04.1V — the states bulk rates moves through. */
export const bulkRateStates = {
  rangeMeta: t(
    "{nights} nights · {weekdays} weekdays (Sat - Wed) + {weekend} weekend ({days})",
    "{nights} ليالٍ · {weekdays} أيام أسبوع (السبت - الأربعاء) + {weekend} نهاية أسبوع ({days})"
  ),
  oneNight: t("{nights} night", "{nights} ليلة"),
  followsBase: t("base + {amount} · follows the base", "الأساس + {amount} · يتبع الأساس"),
  typingHint: t(
    "Whole SAR · fills all {count} rooms · press Enter",
    "ريالات صحيحة · تملأ كل الغرف الـ{count} · اضغط Enter"
  ),
  summary: t(
    "{rooms} rooms × {nights} nights ({range}) = {total} room-nights. Held as a draft until you publish.",
    "{rooms} غرف × {nights} ليالٍ ({range}) = {total} غرفة-ليلة. محفوظة كمسودة حتى تنشر."
  ),
  saveCount: t("Save {count} changes", "حفظ {count} تغييرًا"),
  fixTitle: t(
    "2 things to fix before you can hold these changes: pick the dates, and type a price for at least one room.",
    "أمران يجب إصلاحهما قبل حفظ هذه التغييرات: اختر التواريخ، واكتب سعرًا لغرفة واحدة على الأقل."
  ),
  fixDates: t(
    "Add at least one date range - pick From and To, then press Add.",
    "أضف نطاق تواريخ واحدًا على الأقل - اختر «من» و«إلى»، ثم اضغط إضافة."
  ),
  fixPrice: t(
    "Type a price for at least one room - or one price in “All selected rooms”",
    "اكتب سعرًا لغرفة واحدة على الأقل - أو سعرًا واحدًا في «كل الغرف المختارة»"
  ),
  overlap: t(
    "{range} overlaps {added}, which is already added. Pick other dates, or delete the added range first.",
    "{range} يتداخل مع {added} المضاف بالفعل. اختر تواريخ أخرى، أو احذف النطاق المضاف أولًا."
  ),
  pickOther: t("Pick other dates", "اختر تواريخ أخرى"),
};

/** OV 04.2B / 04.2D / 04.2O and OV 04.3B/D/E/S/O/K — their added states. */
export const rangeStates = {
  everyDay: t("{nights} nights · every day", "{nights} ليلة · كل يوم"),
  someDays: t("{nights} nights · {days}", "{nights} ليلة · {days}"),

  /** OV 04.2D / 04.3D — a set range taken off, and the way back. */
  undo: t("Undo", "تراجع"),
  stopRemoved: t(
    "Removed - {rooms} is open again on {range}. Held as a draft until you publish.",
    "أُزيل - {rooms} مفتوحة للبيع مجددًا في {range}. محفوظ كمسودة حتى تنشر."
  ),
  releaseRemoved: t(
    "Removed - {rooms} goes back to the contract release ({rule}) on {range}.",
    "أُزيل - {rooms} تعود إلى إفراج العقد ({rule}) في {range}."
  ),

  /** OV 04.2B / 04.2O — what the hotel-wide flag will actually do. */
  everyContractDone: t(
    "Makkah Annual Block · Ramadan Block · Makkah Rooms Block will all close these nights for {rooms}.",
    "حصة مكة السنوية · حصة رمضان · حصة غرف مكة ستُغلق جميعها هذه الليالي لـ{rooms}."
  ),
  roomsPicked: t("the {count} rooms you picked", "الغرف الـ{count} التي اخترتها"),

  /** OV 04.2O — a stop sale laid over nights that are already On Request. */
  stopOverlap: t(
    "{room} is On Request on {range}. Adding this turns those nights into Stop sale as well, so {span} is closed.",
    "{room} عند الطلب في {range}. وإضافة هذا تحوّل تلك الليالي إلى إيقاف بيع أيضًا، فيُغلق {span}."
  ),

  /** OV 04.3E — the band turns into an edit of one change. */
  editing: t("Edit · {range} · {rooms}", "تعديل · {range} · {rooms}"),

  /** OV 04.3S — what the same day means. */
  sameDayNote: t(
    "Same day: unsold rooms go back to the hotel at {at} on the arrival day. Agents can still book until then.",
    "اليوم نفسه: تعود الغرف غير المباعة إلى الفندق الساعة {at} يوم الوصول. ويظل بإمكان الوكلاء الحجز حتى ذلك الحين."
  ),

  /** OV 04.3O — a change laid over a change. */
  releaseOverlap: t(
    "Overlaps your change on {range} ({rule}). The newest wins, so {span} will be {days} days before.",
    "يتداخل مع تغييرك في {range} ({rule}). والأحدث يفوز، فيصير {span} {days} أيام قبل الوصول."
  ),

  /** OV 04.3K — the ceiling on how early rooms may go back. */
  tooManyDays: t(
    "Release can’t be more than {max} days before arrival.",
    "لا يمكن أن يكون الإفراج قبل الوصول بأكثر من {max} يومًا."
  ),
  useMax: t("Use {max}", "استخدم {max}"),
};


/** OV 04.5E-KF, 04.6F and 04.4F — the states one night moves through. */
export const oneNightStates = {
  /** OV 04.5R — the same overlay over a run of nights. */
  /* One night or seven, the frames give it the same name: the count is
     already in the field below, and again on the button. */
  titleMany: t("Change prices", "تغيير الأسعار"),
  bodyMany: t(
    "Room-only price for the nights you pick. The contract stays as it is.",
    "سعر الغرفة وحدها لليالي التي تختارها. ويبقى العقد كما هو."
  ),
  /* The count is a phrase, so one night reads "· 1 night" rather than
     "· 1 nights" and two read "ليلتان". */
  dateMany: t("{range} · {nights}", "{range} · {nights}"),
  /* OV 04.6B-G - what the nights are made of, under the field. */
  nightsBreakdown: t(
    "{weekdays} ({weekdayList}) · {weekend} ({list})",
    "{weekdays} ({weekdayList}) · {weekend} ({list})"
  ),
  /*
   * OV 04.6B / 04.6C - a run that is all one kind has nothing to split,
   * so the overlay drops the two cards and says what the nights are
   * instead. "1 weekday · 0 weekend nights" would be an arithmetic
   * answer to a question nobody asked.
   */
  bothWeekday: t("Both are weekdays", "كلتاهما يوما أسبوع"),
  bothWeekend: t(
    "Both are weekend nights",
    "كلتاهما ليلتا نهاية أسبوع"
  ),
  allWeekday: t("All {n} are weekdays", "الـ{n} جميعها أيام أسبوع"),
  allWeekend: t(
    "All {n} are weekend nights",
    "الـ{n} جميعها ليالي نهاية أسبوع"
  ),
  perNightWeekday: t(
    "Price per night · weekdays · SAR",
    "السعر لليلة · أيام الأسبوع · ر.س"
  ),
  perNightWeekend: t(
    "Price per night · weekend · SAR",
    "السعر لليلة · نهاية الأسبوع · ر.س"
  ),
  weekdayPrice: t(
    "Weekdays · Sat · contract {price}",
    "أيام الأسبوع · السبت · العقد {price}"
  ),
  weekendPrice: t(
    "Weekend · Thu, Fri · contract {price}",
    "نهاية الأسبوع · الخميس والجمعة · العقد {price}"
  ),
  editMany: t("Edit for these nights", "تعديل لهذه الليالي"),
  poolMany: t(
    "2 · 0 · 16 left of 50 (24 · 25 · 26)",
    "٢ · ٠ · ١٦ متبقية من ٥٠ (٢٤ · ٢٥ · ٢٦)"
  ),
  minMany: t("4 nights on all {count}", "٤ ليالٍ في الثلاث جميعها"),
  releaseMany: t(
    "1 day before · 18:00 on all {count}",
    "يوم واحد قبل · ١٨:٠٠ في الثلاث جميعها"
  ),
  saveMany: t("Save {count} nights", "حفظ {count} ليالٍ"),

  /** OV 04.5U / 04.5RU — a supplement that no longer matches the contract. */
  mealChanged: t(
    "+ {now} per person · contract {was}",
    "+ {now} لكل شخص · العقد {was}"
  ),
  mealChangedWeekend: t(
    "+ {now} · weekend + {weekend} per person · contract {was}",
    "+ {now} · نهاية الأسبوع + {weekend} لكل شخص · العقد {was}"
  ),

  /** OV 04.5K / 04.5KF — a room cannot be given away. */
  zero: t(
    "A room can’t sell for 0. Type the price - or close the night with Stop sale.",
    "لا يمكن بيع غرفة بصفر. اكتب السعر - أو أغلق الليلة بإيقاف البيع."
  ),
  stopInstead: t("Stop sale instead", "إيقاف البيع بدلًا من ذلك"),

  /** OV 04.5E / 04.5ES / 04.5EW — this room’s supplements for these nights. */
  supTitle: t("Supplements · {when}", "الفروق · {when}"),
  supBody: t(
    "For this night and this room only. Leave a field as it is to keep the contract value.",
    "لهذه الليلة ولهذه الغرفة وحدهما. واترك أي حقل كما هو للإبقاء على قيمة العقد."
  ),
  supBodyMany: t(
    "For these nights and this room only. Leave a field as it is to keep the contract value.",
    "لهذه الليالي ولهذه الغرفة وحدهما. واترك أي حقل كما هو للإبقاء على قيمة العقد."
  ),
  supHead: t(
    "Supplement · this night  (contract value in grey)",
    "الفرق · هذه الليلة  (قيمة العقد بالرمادي)"
  ),
  supHeadMany: t(
    "Supplement · same price on all {count} nights  (contract value in grey)",
    "الفرق · السعر نفسه في الليالي الـ{count}  (قيمة العقد بالرمادي)"
  ),
  supHeadPlain: t("Supplement", "الفرق"),
  colWeekdays: t("Weekdays · Sat", "أيام الأسبوع · السبت"),
  colWeekend: t("Weekend · Thu, Fri", "نهاية الأسبوع · الخميس والجمعة"),
  perPerson: t("/ person", "/ شخص"),
  contractValue: t("contract {value}", "العقد {value}"),
  differentWeekend: t("+ Different weekend price", "+ سعر مختلف لنهاية الأسبوع"),
  sameAllNights: t("Same price on all nights", "السعر نفسه في كل الليالي"),
  back: t("Back", "رجوع"),
  useNight: t("Use for this night", "استخدمه لهذه الليلة"),
  useNights: t("Use for these nights", "استخدمه لهذه الليالي"),

  /** OV 04.5F / FR / PF / KF — a line that carries its own full price. */
  fixedOverline: t(
    "Standard Room · Bed & Breakfast · City View",
    "غرفة ستاندرد · إفطار · إطلالة المدينة"
  ),
  fixedBody: t(
    "Full price for this room and meal plan. Fixed-price contract - no supplements.",
    "السعر الكامل لهذه الغرفة وخطة الوجبات. عقد بسعر ثابت — بلا فروق."
  ),
  fixedBodyMany: t(
    "Full price for this room and meal plan. Fixed-price contract - no supplements.",
    "السعر الكامل لهذه الغرفة وخطة الوجبات. عقد بسعر ثابت — بلا فروق."
  ),
  fixedLabel: t(
    "Full price for this night · SAR",
    "السعر الكامل لهذه الليلة · ر.س"
  ),
  fixedValue: 620,
  fixedContract: t("Contract 590", "العقد ٥٩٠"),
  fixedWeekday: t(
    "Weekdays · {nights} · SAR",
    "أيام الأسبوع · {nights} · ر.س"
  ),
  fixedWeekend: t(
    "Weekend · {nights} · SAR",
    "نهاية الأسبوع · {nights} · ر.س"
  ),

  /** OV 04.6F — a pool every priced line sells from. */
  poolFixedBody: t(
    "Every line sells from these 50 rooms.",
    "كل صفّ يُباع من هذه الـ٥٠ غرفة."
  ),
  poolFixedCapped: t(
    "Deluxe Room · Bed & Breakfast · Haram View · 12 of 12 sold",
    "غرفة ديلوكس · إفطار · إطلالة الحرم · بيعت ١٢ من ١٢"
  ),

  /** OV 04.4F — a status set on one priced line. */
  statusFixedBody: t(
    "What happens to new bookings for this line on this night.",
    "ما الذي يحدث للحجوزات الجديدة لهذا الصفّ في هذه الليلة."
  ),
  statusFixedFoot: t(
    "More nights or lines? Use Stop sale / On Request in the tool",
    "ليالٍ أو صفوف أكثر؟ استخدم «إيقاف البيع / عند الطلب» في الأداة"
  ),
};

/** UI 04.1VS — the bar that appears once cells are picked. */
export const selectionBar = {
  count: t(
    "{count} offer-nights selected · {rooms} rooms × {range}",
    "{count} ليلة-عرض مختارة · {rooms} غرف × {range}"
  ),
  countOneRoom: t(
    "{count} offer-nights selected · 1 room × {range}",
    "{count} ليلة-عرض مختارة · غرفة واحدة × {range}"
  ),
  setRate: t("Set rate", "تعيين السعر"),
  adjust: t("Adjust ±", "تعديل ±"),
  minimumStay: t("Minimum stay", "أدنى إقامة"),
  clear: t("Clear", "مسح"),
};

/** OV 04.1AF — a fixed-price contract prices whole lines, not rooms. */
export interface BulkLineRow {
  line: Bi;
  meta: Bi;
  weekday: number;
  weekend: number;
}

const plain = (value: string) => Number(value.replace(/[^0-9]/g, ""));

export const bulkLineRows: BulkLineRow[] = fixedPriceRooms.map((room) => {
  const weekday = plain(room.weekday);
  const weekend = plain(room.weekend);
  return {
    line: t(
      `${room.room} · ${room.meal}`,
      `${room.roomAr} · ${room.mealAr}`
    ),
    meta: t(
      `fixed price · weekday ${weekday} · weekend ${weekend}`,
      `سعر ثابت · أيام الأسبوع ${arNum(weekday)} · نهاية الأسبوع ${arNum(weekend)}`
    ),
    weekday,
    weekend,
  };
});

export const bulkRatesFixed = {
  overline: t(
    "Al Noor Fixed · HTL-2026-0155 · fixed price",
    "النور الثابت · HTL-2026-0155 · سعر ثابت"
  ),
  body: t(
    "Set the full price for many nights at once. Each line is one room with one meal and one view - there are no supplements.",
    "اضبط السعر الكامل لليالٍ كثيرة دفعة واحدة. وكل صفّ غرفة واحدة بوجبة واحدة وإطلالة واحدة - بلا فروق."
  ),
  linesTitle: t("Lines", "الصفوف"),
  allLines: t("All lines", "كل الصفوف"),
  colLine: t("Line", "الصفّ"),
  allSelectedLines: t("All selected lines", "كل الصفوف المختارة"),
  fillsEveryLine: t("fills every line below", "يملأ كل صفّ أدناه"),
  summary: t(
    "{lines} lines × {nights} nights ({range}) = {total} line-nights. Held as a draft until you publish.",
    "{lines} صفوف × {nights} ليالٍ ({range}) = {total} صفّ-ليلة. محفوظة كمسودة حتى تنشر."
  ),
};

/** BR-03-96 / OV 04.6I — the lowest this room may be sold for. */
export const sellingFloor = 420;
