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
    room: t(`${room.type} · ${room.view}`, `${room.typeAr} · ${room.viewAr}`),
    supplement: room.supplement,
  }));

export const bulkRates = {
  overline: t("Makkah Annual Block · Base + supplements", "حصة مكة السنوية · أساس + فروق"),
  title: t("Bulk rates", "الأسعار الجماعية"),
  body: t(
    "Set or adjust the room price for many nights at once. Meals keep their per-person supplement from the contract.",
    "اضبط سعر الغرفة أو عدّله لليالٍ كثيرة دفعة واحدة. وتبقى الوجبات على فرقها لكل شخص من العقد.",
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
    "لم تُضف تواريخ بعد - اختر «من» و«إلى»، وحدّد الأيام، ثم أضف.",
  ),
  removeRange: t("Delete", "حذف"),

  priceTitle: t("Price", "السعر"),
  colRoom: t("Room", "الغرفة"),
  colWeekday: t("Weekdays", "أيام الأسبوع"),
  /* {days} = the selected contract's weekend. */
  colWeekend: t("Weekend · {days}", "نهاية الأسبوع · {days}"),
  allSelectedRooms: t("All selected rooms", "كل الغرف المختارة"),
  fillsEvery: t("fills every row below", "يملأ كل صفّ أدناه"),
  samePrice: t("Same price for all", "السعر نفسه للجميع"),
  baseRoom: t("BASE room", "الغرفة الأساس"),
  supplementRow: t("base + {amount}", "الأساس + {amount}"),
  footNote: t(
    "Other rooms follow the base (+ their supplement from the contract)",
    "بقية الغرف تتبع الأساس (+ فرقها من العقد)",
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
    "أغلق ليالي أو افتحها لتواريخ وغرف كثيرة دفعة واحدة. ويبقى السعر والغرف المحجوزة كما هي.",
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
  request: t("On Request - the hotel confirms each booking", "عند الطلب - يؤكد الفندق كل حجز"),
  requestShort: t("On Request", "عند الطلب"),

  everyContract: t("Apply to every contract on this hotel", "طبّق على كل عقود هذا الفندق"),
  everyContractNote: t(
    "Makkah Annual Block · Ramadan Block · Makkah Rooms Block - useful when the hotel closes a date for everyone.",
    "حصة مكة السنوية · حصة رمضان · حصة غرف مكة - مفيد حين يغلق الفندق تاريخًا على الجميع.",
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
    "كم يومًا قبل الوصول تعود الغرف غير المباعة إلى الفندق. العقد يضع الافتراضي؛ وتغيّره هنا لبعض الليالي أو الغرف.",
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
    "ما الذي يحدث للحجوزات الجديدة لهذه الغرفة في هذه الليلة.",
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
        "لا حجوزات جديدة. ويُحتفظ بالسعر والغرف.",
      ),
    },
    {
      key: "request",
      label: t("On Request", "عند الطلب"),
      note: t(
        "Bookings wait for the hotel to confirm - within the contract SLA.",
        "تنتظر الحجوزات تأكيد الفندق - ضمن مهلة العقد.",
      ),
    },
  ] as const,
  footNote: t(
    "More nights or rooms? Use Stop sale / On Request in the toolbar",
    "ليالٍ أو غرف أكثر؟ استخدم «إيقاف البيع / عند الطلب» في الشريط",
  ),
  cancel: t("Cancel", "إلغاء"),
  apply: t("Apply", "تطبيق"),
};

/** OV 04.5 — one room, one night, and everything that night carries. */
export const oneNight = {
  overline: t(
    "Standard Room · City View · base room",
    "غرفة ستاندرد · إطلالة المدينة · الغرفة الأساس",
  ),
  title: t("Change prices", "تغيير الأسعار"),
  body: t(
    "Room-only price for the nights you pick. The contract stays as it is.",
    "سعر الغرفة وحدها لليالي التي تختارها. ويبقى العقد كما هو.",
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
  /* {days} = the selected contract's weekend. */
  weekendNightHint: t(
    "Weekend night ({days} in your contract)",
    "ليلة نهاية أسبوع ({days} في عقدك)",
  ),
  weekdayNightHint: t("Weekday night", "ليلة يوم أسبوع"),
  /* The split, as two cards rather than two radios on a line. */
  onePriceTitle: t("One price for every night", "سعر واحد لكل ليلة"),
  onePriceBody: t("Weekdays and weekend pay the same", "أيام الأسبوع ونهايته بالسعر نفسه"),
  apartTitle: t("Weekdays and weekend apart", "أيام الأسبوع ونهايته كلّ على حدة"),
  apartBody: t("Two prices, as in your contract", "سعران، كما في عقدك"),
  applyDays: t("Apply to these days", "طبّق على هذه الأيام"),
  allDaysTicked: t(
    "All {n} days are ticked. Untick a day to leave those nights as they are.",
    "كل الأيام الـ{n} معلّمة. أزل علامة يوم لتترك لياليه كما هي.",
  ),
  someDaysTicked: t(
    "{n} of 7 days are ticked. The nights on the days you untick stay as they are.",
    "{n} من أصل ٧ أيام معلّمة. وليالي الأيام التي تزيل علامتها تبقى كما هي.",
  ),
  weekdaysPrice: t("Weekdays · {nights} · SAR", "أيام الأسبوع · {nights} · ر.س"),
  weekendPriceLabel: t("Weekend · {nights} · SAR", "نهاية الأسبوع · {nights} · ر.س"),
  everyNightPrice: t("Price for every night · SAR", "سعر كل ليلة · ر.س"),
  contractIs: t("Contract {price}", "العقد {price}"),
  /* BR-03-91 - nationality prices live inside a season only, which is
     why a night outside one says so before you wonder. */
  noSeason: t(
    "These nights are not in a season, so every nationality pays the price above. Nationality prices are set inside a season.",
    "هذه الليالي ليست في موسم، فكل الجنسيات تدفع السعر أعلاه. وأسعار الجنسيات تُضبط داخل موسم.",
  ),
  /* OV 04.6N / 04.6G - inside a season the nationality groups apply, so
     the grey band above is replaced by what each group will pay. */
  nationalityHead: t(
    "Nationality prices for these nights",
    "\u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u062c\u0646\u0633\u064a\u0627\u062a \u0644\u0647\u0630\u0647 \u0627\u0644\u0644\u064a\u0627\u0644\u064a",
  ),
  nationalitySub: t(
    "From the {season} season \u00b7 everyone else pays the price above",
    "\u0645\u0646 \u0645\u0648\u0633\u0645 {season} \u00b7 \u0648\u064a\u062f\u0641\u0639 \u0627\u0644\u0628\u0627\u0642\u0648\u0646 \u0627\u0644\u0633\u0639\u0631 \u0623\u0639\u0644\u0627\u0647",
  ),
  openSeason: t("Open the season", "\u0627\u0641\u062a\u062d \u0627\u0644\u0645\u0648\u0633\u0645"),
  adjustOnYourPrice: t(
    "{sign} {amount} SAR on your price",
    "{sign} {amount} \u0631.\u0633 \u0639\u0644\u0649 \u0633\u0639\u0631\u0643",
  ),
  fixedInSeason: t(
    "Fixed price in the season - keep it or type a new one",
    "\u0633\u0639\u0631 \u062b\u0627\u0628\u062a \u0641\u064a \u0627\u0644\u0645\u0648\u0633\u0645 \u2014 \u0623\u0628\u0642\u0647 \u0623\u0648 \u0627\u0643\u062a\u0628 \u063a\u064a\u0631\u0647",
  ),
  seasonIs: t("Season {price}", "\u0627\u0644\u0645\u0648\u0633\u0645 {price}"),
  seasonNightHint: t(
    "{tag} \u00b7 {season} season",
    "{tag} \u00b7 \u0645\u0648\u0633\u0645 {season}",
  ),
  seasonContract: t("{season} {price}", "{season} {price}"),
  /* OV 04.6G / 04.6O - a run of nights can cross a season boundary, and
     the price being typed replaces both sides of it. */
  twoSeasons: t("These nights are in {n}", "هذه الليالي في {n}"),
  twoSeasonsBody: t(
    "{list}. The new prices replace both. Each night keeps the nationality rules of its own season.",
    "{list}. والأسعار الجديدة تستبدل الاثنين. وتحتفظ كل ليلة بقواعد جنسيات موسمها.",
  ),
  seasonSpan: t("{season} {from} - {to} ({nights})", "{season} {from} - {to} ({nights})"),
  seasonsHave: t(
    "{list} have the same groups · everyone else pays the price above",
    "{list} لها المجموعات نفسها · ويدفع الباقون السعر أعلاه",
  ),
  fixedInEach: t(
    "Fixed in each season - one price replaces both",
    "ثابت في كل موسم — وسعر واحد يستبدل الاثنين",
  ),
  seasonsCount: t("{n} seasons", "{n} مواسم"),

  /* OV 04.6H - what a run of nights may already be carrying. */
  /* A count decides the verb as well as the noun: "1 night already
     have their own price" is a sentence a reader stops at. */
  alreadyPriced: t(
    "{n} already have their own price",
    "{n} \u0644\u0647\u0627 \u0633\u0639\u0631\u0647\u0627 \u0627\u0644\u062e\u0627\u0635 \u0628\u0627\u0644\u0641\u0639\u0644",
  ),
  alreadyPricedOne: t("{n} already has its own price", "{n} لها سعرها الخاص بالفعل"),
  alreadyPricedBody: t(
    "{list}. Saving replaces them with this price. Untick those days to keep them.",
    "{list}. \u0648\u0627\u0644\u062d\u0641\u0638 \u064a\u0633\u062a\u0628\u062f\u0644\u0647\u0627 \u0628\u0647\u0630\u0627 \u0627\u0644\u0633\u0639\u0631. \u0623\u0632\u0644 \u0639\u0644\u0627\u0645\u0629 \u062a\u0644\u0643 \u0627\u0644\u0623\u064a\u0627\u0645 \u0644\u062a\u0628\u0642\u064a\u0647\u0627.",
  ),
  alreadyPricedBodyOne: t(
    "{list}. Saving replaces it with this price. Untick that day to keep it.",
    "{list}. والحفظ يستبدله بهذا السعر. أزل علامة ذلك اليوم لتبقيه.",
  ),
  nightsClosed: t("{n} are closed", "{n} \u0645\u063a\u0644\u0642\u0629"),
  nightsClosedOne: t("{n} is closed", "{n} مغلقة"),
  nightsClosedBody: t(
    "{list} are closed. The price is saved on them and they stay closed until you open them.",
    "{list} \u0645\u063a\u0644\u0642\u0629. \u0648\u064a\u064f\u062d\u0641\u0638 \u0627\u0644\u0633\u0639\u0631 \u0639\u0644\u064a\u0647\u0627 \u0648\u062a\u0628\u0642\u0649 \u0645\u063a\u0644\u0642\u0629 \u062d\u062a\u0649 \u062a\u0641\u062a\u062d\u0647\u0627.",
  ),
  nightsClosedBodyOne: t(
    "{list} is closed. The price is saved on it and it stays closed until you open it.",
    "{list} مغلقة. ويُحفظ السعر عليها وتبقى مغلقة حتى تفتحها.",
  ),
  bookingsKeep: t(
    "Bookings already made keep their price",
    "\u0627\u0644\u062d\u062c\u0648\u0632\u0627\u062a \u0627\u0644\u0642\u0627\u0626\u0645\u0629 \u062a\u062d\u062a\u0641\u0638 \u0628\u0633\u0639\u0631\u0647\u0627",
  ),
  bookingsKeepBody: t(
    "{n} are booked on these nights. Their price was locked when they were booked.",
    "{n} \u0645\u062d\u062c\u0648\u0632\u0629 \u0641\u064a \u0647\u0630\u0647 \u0627\u0644\u0644\u064a\u0627\u0644\u064a. \u0648\u0642\u064f\u0641\u0644 \u0633\u0639\u0631\u0647\u0627 \u0633\u0627\u0639\u0629 \u062d\u062c\u0632\u0647\u0627.",
  ),
  bookedOne: t(
    "{n} is booked on these nights. Its price was locked when it was booked.",
    "{n} محجوزة في هذه الليالي. وقُفل سعرها ساعة حجزها.",
  ),

  /* OV 04.6J - a room cannot be given away, and OV 04.6I - it can be
     sold under your own floor, as long as you are told what you did. */
  enterPrice: t(
    "Enter a price above 0",
    "\u0627\u0643\u062a\u0628 \u0633\u0639\u0631\u064b\u0627 \u0623\u0643\u0628\u0631 \u0645\u0646 \u0635\u0641\u0631",
  ),
  belowFloor: t(
    "Below your minimum selling price ({floor}). You can still save - agents will see {price}.",
    "\u062f\u0648\u0646 \u062d\u062f\u0651\u0643 \u0627\u0644\u0623\u062f\u0646\u0649 \u0644\u0644\u0628\u064a\u0639 ({floor}). \u0648\u064a\u0645\u0643\u0646\u0643 \u0627\u0644\u062d\u0641\u0638 \u0631\u063a\u0645 \u0630\u0644\u0643 \u2014 \u0648\u0633\u064a\u0631\u0649 \u0627\u0644\u0648\u0643\u0644\u0627\u0621 {price}.",
  ),
  /* Base + Supplements only - the typed price is the whole price. */
  priceIncludesAll: t(
    "The price you enter is the total selling price, including the base room price, meal plan, and all applicable supplements.",
    "السعر الذي تدخله هو إجمالي سعر البيع، ويشمل سعر الغرفة الأساسية والوجبة وجميع الإضافات المطبقة.",
  ),
  pricePerNight: t(
    "Price per night \u00b7 {nights} \u00b7 SAR",
    "\u0633\u0639\u0631 \u0627\u0644\u0644\u064a\u0644\u0629 \u00b7 {nights} \u00b7 \u0631.\u0633",
  ),
  contractBoth: t(
    "Contract {weekday} weekdays \u00b7 {weekend} weekend",
    "\u0627\u0644\u0639\u0642\u062f {weekday} \u0623\u064a\u0627\u0645 \u0627\u0644\u0623\u0633\u0628\u0648\u0639 \u00b7 {weekend} \u0646\u0647\u0627\u064a\u062a\u0647",
  ),

  saveOne: t("Save 1 night", "احفظ ليلة واحدة"),

  supplementsLabel: t("This room’s supplements · from the contract", "فروق هذه الغرفة · من العقد"),
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
      label: t("Child 6 - 11 sharing · no extra bed", "طفل ٦ - ١١ مشارك · بلا سرير إضافي"),
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
    "Saved straight away · new bookings get it at once",
    "يُحفظ فورًا · وتأخذه الحجوزات الجديدة مباشرة",
  ),
  cancel: t("Cancel", "إلغاء"),
  save: t("Save change", "حفظ التغيير"),
};

/** OV 04.6 — where the night's rooms went. */
export const poolBreakdown = {
  overline: t("Contract pool", "مخزون العقد"),
  title: t("Fri 25 Sep 2026", "الجمعة ٢٥ سبتمبر ٢٠٢٦"),
  body: t("Every room type sells from these 50 rooms.", "كل أنواع الغرف تُباع من هذه الـ٥٠ غرفة."),
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
      value: t("Deluxe City View · 12 of 12 sold", "ديلوكس إطلالة المدينة · بيعت ١٢ من ١٢"),
    },
  ],
  note: t(
    "The pool is full. The contract allows controlled overbooking - up to 2 more bookings, then the night stops selling.",
    "المخزون ممتلئ. ويسمح العقد بحجز زائد محكوم - حتى حجزين إضافيين، ثم تتوقف الليلة عن البيع.",
  ),
  close: t("Close", "إغلاق"),
};

/** OV 04.8 — the months the grid is drawn across. */
export const monthPicker = {
  overline: t("Within the contract term", "ضمن مدة العقد"),
  title: t("Show months", "إظهار الشهور"),
  body: t("Pick where the grid starts and ends.", "اختر أين يبدأ الجدول وأين ينتهي."),
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
    "نصيحة: اختر ٣ شهور على الأكثر - يتسع الجدول كثيرًا بعدها.",
  ),
  done: t("Done", "تم"),
};

/** OV 04.9 / 04.9B — the contracts this hotel holds. */
export const contractPicker = {
  title: t("Choose contract", "اختيار العقد"),
  placeholder: t("Select Contract", "اختر العقد"),
  includeEnded: t("Include ended contracts", "تضمين العقود المنتهية"),
  loading: t("Loading contracts…", "جارٍ تحميل العقود…"),
  error: t("We couldn't load the contracts.", "تعذّر تحميل العقود."),
  empty: t("No contracts for this hotel yet.", "لا توجد عقود لهذا الفندق بعد."),
  emptyActive: t(
    "No current contracts. Tick Include ended contracts to see the rest.",
    "لا توجد عقود حالية. فعّل تضمين العقود المنتهية لترى البقية.",
  ),
  pickHotelFirst: t("Pick a hotel first", "اختر فندقًا أولًا"),
  status: {
    draft: t("Draft", "مسودة"),
    active: t("Active", "نشط"),
    paused: t("Paused", "موقوف مؤقتًا"),
    terminated: t("Terminated", "تم إنهاؤه"),
    scheduled: t("Scheduled", "مجدول"),
    expired: t("Expired", "منتهي"),
  },
  model: {
    base_plus_supplements: t("Base + supplements", "أساس + فروق"),
    fixed_per_room: t("Fixed price", "سعر ثابت"),
  },
  booking: {
    allotment_block: t("Allotment", "حصة"),
    on_request: t("On Request", "عند الطلب"),
  },
};

/** OV 04.10 — the hotels this account is linked to. */
export const pickerSearch = {
  hotels: t("Search hotels by name or city", "ابحث عن فندق بالاسم أو المدينة"),
  contracts: t("Search contracts by name or number", "ابحث عن عقد بالاسم أو الرقم"),
  noMatch: t("Nothing matches your search.", "لا توجد نتائج مطابقة."),
  dates: t("Contracts active between… (From - To)", "عقود سارية بين… (من - إلى)"),
  clearDates: t("Clear dates", "مسح التواريخ"),
};

export const hotelPicker = {
  overline: t("Your linked hotels", "فنادقك المرتبطة"),
  title: t("Choose hotel", "اختيار الفندق"),
  placeholder: t("Select Hotel", "اختر الفندق"),
  loading: t("Loading hotels…", "جارٍ تحميل الفنادق…"),
  error: t("We couldn't load your hotels.", "تعذّر تحميل فنادقك."),
  retry: t("Try again", "حاول مجددًا"),
  empty: t(
    "No hotels to show yet. A hotel appears here once your link to it is approved.",
    "لا توجد فنادق بعد. يظهر الفندق هنا بعد اعتماد ربطك به.",
  ),
  stars: t("{n}-star", "{n} نجوم"),
};

/** OV 04.11 — the grid as a file. */
export const exportView = {
  overline: t(
    "September 2026 · 9 rooms · Makkah Annual Block",
    "سبتمبر ٢٠٢٦ · ٩ غرف · حصة مكة السنوية",
  ),
  title: t("Export this view", "تصدير هذا العرض"),
  body: t(
    "Exactly what you see: the months, the rooms and the rows you have switched on.",
    "ما تراه تمامًا: الشهور والغرف والصفوف التي شغّلتها.",
  ),
  formats: [
    {
      key: "xlsx",
      label: t("Excel workbook (.xlsx)", "مصنّف إكسل (.xlsx)"),
      note: t(
        "One sheet per room · rate, inventory, stop sale, restrictions, release",
        "ورقة لكل غرفة · السعر والمخزون وإيقاف البيع والقيود والإفراج",
      ),
    },
    {
      key: "csv",
      label: t("CSV (.csv)", "CSV (.csv)"),
      note: t("One row per room-night - for your own system", "صفّ لكل غرفة-ليلة - لنظامك الخاص"),
    },
    {
      key: "pdf",
      label: t("PDF (.pdf)", "PDF (.pdf)"),
      note: t(
        "The grid as it looks now, for sending or printing",
        "الجدول كما يبدو الآن، للإرسال أو الطباعة",
      ),
    },
  ] as const,
  note: t(
    "Unpublished changes are marked in the file so you can tell them apart from what agents can see.",
    "التغييرات غير المنشورة مُعلَّمة في الملف حتى تميّزها عمّا يراه الوكلاء.",
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
    "لا شيء يصل الوكلاء حتى تنشر. وتحتفظ الحجوزات المؤكدة بالسعر والقواعد التي حُجزت بها. ولعكس تغيير منشور، غيّر الليلة مرة أخرى وانشر.",
  ),
  changes: [
    {
      tag: t("Rate", "السعر"),
      what: t(
        "Standard Room · City View · Thu 24 Sep",
        "غرفة ستاندرد · إطلالة المدينة · الخميس ٢٤ سبتمبر",
      ),
      from: t("Room only 500 → 520", "الغرفة فقط ٥٠٠ ← ٥٢٠"),
    },
    {
      tag: t("On Request", "عند الطلب"),
      tone: "warning",
      what: t(
        "Quad Room · City View · 26 - 27 Sep",
        "غرفة رباعية · إطلالة المدينة · ٢٦ - ٢٧ سبتمبر",
      ),
      from: t("Open sale → On Request", "البيع مفتوح ← عند الطلب"),
    },
    {
      tag: t("Release", "الإفراج"),
      what: t(
        "Standard Room · City View · 24 - 30 Sep",
        "غرفة ستاندرد · إطلالة المدينة · ٢٤ - ٣٠ سبتمبر",
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
    "{nights} nights · {weekdays} weekdays + {weekend} weekend ({days})",
    "{nights} ليالٍ · {weekdays} أيام أسبوع + {weekend} نهاية أسبوع ({days})",
  ),
  oneNight: t("{nights} night", "{nights} ليلة"),
  followsBase: t("base + {amount} · follows the base", "الأساس + {amount} · يتبع الأساس"),
  typingHint: t(
    "Whole SAR · fills all {count} rooms · press Enter",
    "ريالات صحيحة · تملأ كل الغرف الـ{count} · اضغط Enter",
  ),
  summary: t(
    "{rooms} rooms × {nights} nights ({range}) = {total} room-nights. Held as a draft until you publish.",
    "{rooms} غرف × {nights} ليالٍ ({range}) = {total} غرفة-ليلة. محفوظة كمسودة حتى تنشر.",
  ),
  saveCount: t("Save {count} changes", "حفظ {count} تغييرًا"),
  fixTitle: t(
    "2 things to fix before you can hold these changes: pick the dates, and type a price for at least one room.",
    "أمران يجب إصلاحهما قبل حفظ هذه التغييرات: اختر التواريخ، واكتب سعرًا لغرفة واحدة على الأقل.",
  ),
  fixDates: t(
    "Add at least one date range - pick From and To, then press Add.",
    "أضف نطاق تواريخ واحدًا على الأقل - اختر «من» و«إلى»، ثم اضغط إضافة.",
  ),
  fixPrice: t(
    "Type a price for at least one room - or one price in “All selected rooms”",
    "اكتب سعرًا لغرفة واحدة على الأقل - أو سعرًا واحدًا في «كل الغرف المختارة»",
  ),
  overlap: t(
    "{range} overlaps {added}, which is already added. Pick other dates, or delete the added range first.",
    "{range} يتداخل مع {added} المضاف بالفعل. اختر تواريخ أخرى، أو احذف النطاق المضاف أولًا.",
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
    "أُزيل - {rooms} مفتوحة للبيع مجددًا في {range}. محفوظ كمسودة حتى تنشر.",
  ),
  releaseRemoved: t(
    "Removed - {rooms} goes back to the contract release ({rule}) on {range}.",
    "أُزيل - {rooms} تعود إلى إفراج العقد ({rule}) في {range}.",
  ),

  /** OV 04.2B / 04.2O — what the hotel-wide flag will actually do. */
  everyContractDone: t(
    "Makkah Annual Block · Ramadan Block · Makkah Rooms Block will all close these nights for {rooms}.",
    "حصة مكة السنوية · حصة رمضان · حصة غرف مكة ستُغلق جميعها هذه الليالي لـ{rooms}.",
  ),
  roomsPicked: t("the {count} rooms you picked", "الغرف الـ{count} التي اخترتها"),

  /** OV 04.2O — a stop sale laid over nights that are already On Request. */
  stopOverlap: t(
    "{room} is On Request on {range}. Adding this turns those nights into Stop sale as well, so {span} is closed.",
    "{room} عند الطلب في {range}. وإضافة هذا تحوّل تلك الليالي إلى إيقاف بيع أيضًا، فيُغلق {span}.",
  ),

  /** OV 04.3E — the band turns into an edit of one change. */
  editing: t("Edit · {range} · {rooms}", "تعديل · {range} · {rooms}"),

  /** OV 04.3S — what the same day means. */
  sameDayNote: t(
    "Same day: unsold rooms go back to the hotel at {at} on the arrival day. Agents can still book until then.",
    "اليوم نفسه: تعود الغرف غير المباعة إلى الفندق الساعة {at} يوم الوصول. ويظل بإمكان الوكلاء الحجز حتى ذلك الحين.",
  ),

  /** OV 04.3O — a change laid over a change. */
  releaseOverlap: t(
    "Overlaps your change on {range} ({rule}). The newest wins, so {span} will be {days} days before.",
    "يتداخل مع تغييرك في {range} ({rule}). والأحدث يفوز، فيصير {span} {days} أيام قبل الوصول.",
  ),

  /** OV 04.3K — the ceiling on how early rooms may go back. */
  tooManyDays: t(
    "Release can’t be more than {max} days before arrival.",
    "لا يمكن أن يكون الإفراج قبل الوصول بأكثر من {max} يومًا.",
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
    "سعر الغرفة وحدها لليالي التي تختارها. ويبقى العقد كما هو.",
  ),
  /* The count is a phrase, so one night reads "· 1 night" rather than
     "· 1 nights" and two read "ليلتان". */
  dateMany: t("{range} · {nights}", "{range} · {nights}"),
  /* OV 04.6B-G - what the nights are made of, under the field. */
  nightsBreakdown: t(
    "{weekdays} ({weekdayList}) · {weekend} ({list})",
    "{weekdays} ({weekdayList}) · {weekend} ({list})",
  ),
  /*
   * OV 04.6B / 04.6C - a run that is all one kind has nothing to split,
   * so the overlay drops the two cards and says what the nights are
   * instead. "1 weekday · 0 weekend nights" would be an arithmetic
   * answer to a question nobody asked.
   */
  bothWeekday: t("Both are weekdays", "كلتاهما يوما أسبوع"),
  bothWeekend: t("Both are weekend nights", "كلتاهما ليلتا نهاية أسبوع"),
  allWeekday: t("All {n} are weekdays", "الـ{n} جميعها أيام أسبوع"),
  allWeekend: t("All {n} are weekend nights", "الـ{n} جميعها ليالي نهاية أسبوع"),
  perNightWeekday: t("Price per night · weekdays · SAR", "السعر لليلة · أيام الأسبوع · ر.س"),
  perNightWeekend: t("Price per night · weekend · SAR", "السعر لليلة · نهاية الأسبوع · ر.س"),
  weekdayPrice: t("Weekdays · Sat · contract {price}", "أيام الأسبوع · السبت · العقد {price}"),
  /* {days} = the selected contract's weekend. */
  weekendPrice: t(
    "Weekend · {days} · contract {price}",
    "نهاية الأسبوع · {days} · العقد {price}",
  ),
  editMany: t("Edit for these nights", "تعديل لهذه الليالي"),
  poolMany: t("2 · 0 · 16 left of 50 (24 · 25 · 26)", "٢ · ٠ · ١٦ متبقية من ٥٠ (٢٤ · ٢٥ · ٢٦)"),
  minMany: t("4 nights on all {count}", "٤ ليالٍ في الثلاث جميعها"),
  releaseMany: t("1 day before · 18:00 on all {count}", "يوم واحد قبل · ١٨:٠٠ في الثلاث جميعها"),
  saveMany: t("Save {count} nights", "حفظ {count} ليالٍ"),

  /** OV 04.5U / 04.5RU — a supplement that no longer matches the contract. */
  mealChanged: t("+ {now} per person · contract {was}", "+ {now} لكل شخص · العقد {was}"),
  mealChangedWeekend: t(
    "+ {now} · weekend + {weekend} per person · contract {was}",
    "+ {now} · نهاية الأسبوع + {weekend} لكل شخص · العقد {was}",
  ),

  /** OV 04.5K / 04.5KF — a room cannot be given away. */
  zero: t(
    "A room can’t sell for 0. Type the price - or close the night with Stop sale.",
    "لا يمكن بيع غرفة بصفر. اكتب السعر - أو أغلق الليلة بإيقاف البيع.",
  ),
  stopInstead: t("Stop sale instead", "إيقاف البيع بدلًا من ذلك"),

  /** OV 04.5E / 04.5ES / 04.5EW — this room’s supplements for these nights. */
  supTitle: t("Supplements · {when}", "الفروق · {when}"),
  supBody: t(
    "For this night and this room only. Leave a field as it is to keep the contract value.",
    "لهذه الليلة ولهذه الغرفة وحدهما. واترك أي حقل كما هو للإبقاء على قيمة العقد.",
  ),
  supBodyMany: t(
    "For these nights and this room only. Leave a field as it is to keep the contract value.",
    "لهذه الليالي ولهذه الغرفة وحدهما. واترك أي حقل كما هو للإبقاء على قيمة العقد.",
  ),
  supHead: t(
    "Supplement · this night  (contract value in grey)",
    "الفرق · هذه الليلة  (قيمة العقد بالرمادي)",
  ),
  supHeadMany: t(
    "Supplement · same price on all {count} nights  (contract value in grey)",
    "الفرق · السعر نفسه في الليالي الـ{count}  (قيمة العقد بالرمادي)",
  ),
  supHeadPlain: t("Supplement", "الفرق"),
  colWeekdays: t("Weekdays", "أيام الأسبوع"),
  /* {days} = the selected contract's weekend. */
  colWeekend: t("Weekend · {days}", "نهاية الأسبوع · {days}"),
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
    "غرفة ستاندرد · إفطار · إطلالة المدينة",
  ),
  fixedBody: t(
    "Full price for this room and meal plan. Fixed-price contract - no supplements.",
    "السعر الكامل لهذه الغرفة وخطة الوجبات. عقد بسعر ثابت — بلا فروق.",
  ),
  fixedBodyMany: t(
    "Full price for this room and meal plan. Fixed-price contract - no supplements.",
    "السعر الكامل لهذه الغرفة وخطة الوجبات. عقد بسعر ثابت — بلا فروق.",
  ),
  fixedLabel: t("Full price for this night · SAR", "السعر الكامل لهذه الليلة · ر.س"),
  fixedValue: 620,
  fixedContract: t("Contract 590", "العقد ٥٩٠"),
  fixedWeekday: t("Weekdays · {nights} · SAR", "أيام الأسبوع · {nights} · ر.س"),
  fixedWeekend: t("Weekend · {nights} · SAR", "نهاية الأسبوع · {nights} · ر.س"),

  /** OV 04.6F — a pool every priced line sells from. */
  poolFixedBody: t("Every line sells from these 50 rooms.", "كل صفّ يُباع من هذه الـ٥٠ غرفة."),
  poolFixedCapped: t(
    "Deluxe Room · Bed & Breakfast · Haram View · 12 of 12 sold",
    "غرفة ديلوكس · إفطار · إطلالة الحرم · بيعت ١٢ من ١٢",
  ),

  /** OV 04.4F — a status set on one priced line. */
  statusFixedBody: t(
    "What happens to new bookings for this line on this night.",
    "ما الذي يحدث للحجوزات الجديدة لهذا الصفّ في هذه الليلة.",
  ),
  statusFixedFoot: t(
    "More nights or lines? Use Stop sale / On Request in the tool",
    "ليالٍ أو صفوف أكثر؟ استخدم «إيقاف البيع / عند الطلب» في الأداة",
  ),
};

/** UI 04.1VS — the bar that appears once cells are picked. */
export const selectionBar = {
  count: t(
    "{count} offer-nights selected · {rooms} rooms × {range}",
    "{count} ليلة-عرض مختارة · {rooms} غرف × {range}",
  ),
  countOneRoom: t(
    "{count} offer-nights selected · 1 room × {range}",
    "{count} ليلة-عرض مختارة · غرفة واحدة × {range}",
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
    line: t(`${room.room} · ${room.meal}`, `${room.roomAr} · ${room.mealAr}`),
    meta: t(
      `fixed price · weekday ${weekday} · weekend ${weekend}`,
      `سعر ثابت · أيام الأسبوع ${arNum(weekday)} · نهاية الأسبوع ${arNum(weekend)}`,
    ),
    weekday,
    weekend,
  };
});

export const bulkRatesFixed = {
  overline: t(
    "Al Noor Fixed · HTL-2026-0155 · fixed price",
    "النور الثابت · HTL-2026-0155 · سعر ثابت",
  ),
  body: t(
    "Set the full price for many nights at once. Each line is one room with one meal and one view - there are no supplements.",
    "اضبط السعر الكامل لليالٍ كثيرة دفعة واحدة. وكل صفّ غرفة واحدة بوجبة واحدة وإطلالة واحدة - بلا فروق.",
  ),
  linesTitle: t("Lines", "الصفوف"),
  allLines: t("All lines", "كل الصفوف"),
  colLine: t("Line", "الصفّ"),
  allSelectedLines: t("All selected lines", "كل الصفوف المختارة"),
  fillsEveryLine: t("fills every line below", "يملأ كل صفّ أدناه"),
  summary: t(
    "{lines} lines × {nights} nights ({range}) = {total} line-nights. Held as a draft until you publish.",
    "{lines} صفوف × {nights} ليالٍ ({range}) = {total} صفّ-ليلة. محفوظة كمسودة حتى تنشر.",
  ),
};

/** BR-03-96 / OV 04.6I — the lowest this room may be sold for. */
export const sellingFloor = 420;

export const liveGrid = {
  base: t("BASE · {currency}", "الأساس · {currency}"),
  supplement: t("+{amount} on base · {currency}", "+{amount} على الأساس · {currency}"),
  fixed: t("fixed price · {currency}", "سعر ثابت · {currency}"),
  baseLine: t("BASE", "الأساس"),
  supplementLine: t("base + {amount}", "الأساس + {amount}"),
  fixedLine: t("fixed price", "سعر ثابت"),
  weekdayWeekend: t(
    "weekday {weekday} · weekend {weekend}",
    "وسط الأسبوع {weekday} · نهاية الأسبوع {weekend}",
  ),
  everyNight: t("{amount} a night", "{amount} في الليلة"),
  cappedAt: t("capped at {count} a night", "بحد أقصى {count} في الليلة"),
  noStock: t("No stock yet", "لا مخزون بعد"),
  poolMetaLive: t(
    "{capacity} rooms a night · +{overbooking} overbooking · every room sells from it",
    "{capacity} غرفة في الليلة · تجاوز +{overbooking} · كل غرفة تبيع منه",
  ),
  poolCapacity: t("Pool capacity", "سعة المخزون"),
  seasonsLoading: t("Loading seasons…", "جارٍ تحميل المواسم…"),
  seasonsError: t("We couldn't load this contract's seasons.", "تعذّر تحميل مواسم هذا العقد."),
  roomsPickContract: t("Pick a contract to see its rooms.", "اختر عقدًا لعرض غرفه."),
  selectContractTitle: t("Select a Contract", "اختر عقدًا"),
  selectContractFirst: t(
    "Please select a contract to view the Rate Calendar and access calendar controls.",
    "يُرجى اختيار عقد لعرض تقويم الأسعار والوصول إلى أدوات التحكم في التقويم.",
  ),
  roomsLoading: t("Loading rooms…", "جارٍ تحميل الغرف…"),
  roomsError: t("We couldn't load this contract's rooms.", "تعذّر تحميل غرف هذا العقد."),
  roomsEmpty: t("This contract has no rooms yet.", "لا توجد غرف في هذا العقد بعد."),
  seasonNights: t(
    "Season price on {count} of these nights",
    "سعر الموسم في {count} من هذه الليالي",
  ),
  knowPrices: t(
    "Prices are the room only, per night, in {currency}.",
    "الأسعار للغرفة فقط، لكل ليلة، بـ{currency}.",
  ),
  knowWeekend: t("Weekend nights: {days}.", "ليالي نهاية الأسبوع: {days}."),
  knowEdited: t(
    "A dashed cell has its own price for that night. Tap it to change it or put the contract price back.",
    "الخلية المنقّطة لها سعر خاص بتلك الليلة. اضغط عليها لتغييره أو لإرجاع سعر العقد.",
  ),
  allCountries: t("All countries", "كل الدول"),
  plusMealsLive: t("+ meals ({meals})", "+ الوجبات ({meals})"),
  mealShort: {
    bed_and_breakfast: t("B&B", "إفطار"),
    half_board: t("HB", "نصف إقامة"),
    full_board: t("FB", "إقامة كاملة"),
    iftar_and_suhoor: t("Iftar & suhoor", "إفطار وسحور"),
  } as Record<string, Bi>,
  mealFor: t("{meal} · for {guests} guests", "{meal} · لـ{guests} ضيوف"),
  mealPerPerson: t(
    "room + {price} × {guests} · from the contract",
    "الغرفة + {price} × {guests} · من العقد",
  ),
  mealPerRoom: t(
    "room + {price} per room · from the contract",
    "الغرفة + {price} للغرفة · من العقد",
  ),
  saved: t("Prices saved", "تم حفظ الأسعار"),
  restored: t("Back to the contract price", "عاد السعر إلى سعر العقد"),
  notEligible: t(
    "This contract isn't published yet, so its prices can't be changed.",
    "هذا العقد غير منشور بعد، لذلك لا يمكن تغيير أسعاره.",
  ),
  nothingMatches: t("Nothing matches in the months you show.", "لا شيء يطابق في الأشهر المعروضة."),
  clearFilter: t("Clear filter", "إزالة الفلتر"),
  noPastNights: t("No past nights in these dates", "لا ليالٍ فائتة في هذه التواريخ"),
  noBookingData: t("No booking data yet", "لا توجد بيانات حجوزات بعد"),
  slaLabel: t("The hotel answers within", "يرد الفندق خلال"),
  slaHint: t("minutes · 10 - 120", "دقيقة · ١٠ - ١٢٠"),
  expiry: {
    auto_reject: t("No answer: reject the booking", "بلا رد: رفض الحجز"),
    escalate_to_hoteliana: t("No answer: pass it to Hoteliana", "بلا رد: تحويله إلى Hoteliana"),
  },
  sellSaved: t("Sell status saved", "تم حفظ حالة البيع"),
  poolBody: t(
    "Every room type sells from these {count} rooms.",
    "كل أنواع الغرف تُباع من هذه الـ{count} غرفة.",
  ),
  poolRooms: t("Rooms in the pool", "الغرف في المخزون"),
  poolOverbooking: t("Overbooking allowed", "الحجز الزائد المسموح"),
  poolCapped: t("Capped rooms", "الغرف المحدودة"),
  poolCapLine: t("{room} · up to {count} a night", "{room} · حتى {count} في الليلة"),
  poolNone: t("None", "لا يوجد"),
  poolNoBookings: t(
    "Bookings aren't in the system yet, so sold and left rooms can't be shown.",
    "الحجوزات غير موجودة في النظام بعد، لذلك لا يمكن عرض الغرف المباعة والمتبقية.",
  ),
  perRoomUnit: t("per room", "للغرفة"),
  perPersonUnit: t("per person", "للشخص"),
  poolOfNight: t(
    "{count} rooms in the pool · no booking data yet",
    "{count} غرفة في المخزون · لا بيانات حجوزات بعد",
  ),
  openSaleValue: t("Open sale", "البيع مفتوح"),
  checkInClosed: t("Check-in closed", "الوصول مغلق"),
  checkOutClosed: t("Check-out closed", "المغادرة مغلقة"),
  editing: t("Editing", "قيد التعديل"),
  editingHint: t(
    "Change the nights, rooms or status, then press + Add and Review & save.",
    "غيّر الليالي أو الغرف أو الحالة، ثم اضغط + إضافة ثم راجع واحفظ.",
  ),
  sellHeld: t(
    "Prices and rooms held stay as they are. Confirmed bookings are not touched.",
    "الأسعار والغرف المحجوزة تبقى كما هي. والحجوزات المؤكدة لا تُمس.",
  ),
  sellNow: t(
    "Live as soon as you save - new bookings follow it straight away.",
    "يسري فور الحفظ - وتتبعه الحجوزات الجديدة مباشرة.",
  ),
  stopSaleValue: t("Stop sale", "إيقاف البيع"),
  onRequestValue: t("On Request", "عند الطلب"),
  exportHead: {
    en: ["Room", "Night", "Rate", "Currency", "Price from", "Rooms in pool", "Status"],
    ar: ["الغرفة", "الليلة", "السعر", "العملة", "مصدر السعر", "الغرف في المخزون", "الحالة"],
  },
  exportCols: {
    room: t("Room", "الغرفة"),
    night: t("Night", "الليلة"),
    rate: t("Rate", "السعر"),
    currency: t("Currency", "العملة"),
    source: t("Price from", "مصدر السعر"),
    poolLeft: t("Left in pool", "المتبقي في المخزون"),
    roomLeft: t("Left for this room", "المتبقي لهذه الغرفة"),
    status: t("Status", "الحالة"),
    minNights: t("Min nights", "أقل عدد ليالٍ"),
    checkIn: t("Check-in", "الوصول"),
    checkOut: t("Check-out", "المغادرة"),
  },
  exportWaiting: t(
    "Loading this contract's prices for the dates shown. Download opens once they are in.",
    "جارٍ تحميل أسعار هذا العقد للتواريخ المعروضة. يُفتح التنزيل بعد اكتمالها.",
  ),
  exportOpen: t("Open", "مفتوح"),
  exportTitle: t("Rates & Availability", "الأسعار والإتاحة"),
  exportClosed: t("Closed", "مغلق"),
  exportEdited: t("Changed for this night", "معدّل لهذه الليلة"),
  exportContract: t("Contract or season", "العقد أو الموسم"),
  exportRooms: t("{count} rooms", "{count} غرف"),
  terms: {
    basePlus: t(
      "Base + supplements · base {room} {weekday} / {weekend} {currency}",
      "الأساس + الإضافات · الأساس {room} {weekday} / {weekend} {currency}",
    ),
    basePlusFlat: t(
      "Base + supplements · base {room} {amount} {currency}",
      "الأساس + الإضافات · الأساس {room} {amount} {currency}",
    ),
    fixed: t(
      "Fixed price · each room with its meal and view · no supplements",
      "سعر ثابت · كل غرفة بوجبتها وإطلالتها · بلا إضافات",
    ),
    weekend: t("Weekend {days}", "نهاية الأسبوع {days}"),
    sameEveryNight: t("Same price every night", "نفس السعر كل ليلة"),
    pool: t("Allotment · shared pool {count} a night", "حصة · مخزون مشترك {count} في الليلة"),
    overbooking: t(" · overbooking +{count}", " · تجاوز +{count}"),
    perRoom: t("Allotment · a number per room type", "حصة · رقم لكل نوع غرفة"),
    freeSale: t(
      "Free sale · no quantity - bookings confirm straight away",
      "بيع حر · بلا كمية - تتأكد الحجوزات فورًا",
    ),
    onRequest: t("On Request · no rooms held", "عند الطلب · لا غرف محجوزة"),
    releaseDays: t("Release {count} days before · {time}", "الاسترجاع قبل {count} أيام · {time}"),
    releaseSameDay: t("Release on the day · {time}", "الاسترجاع في نفس اليوم · {time}"),
    noRelease: t("No release", "بلا استرجاع"),
    cancelFree: t("Cancellation free until {count} days", "الإلغاء مجاني حتى {count} أيام"),
    cancelCharged: t("Cancellation charged from {count} days", "الإلغاء برسوم من {count} أيام"),
    restrictions: t("{count} restrictions on this contract", "{count} قيود على هذا العقد"),
    noRestrictions: t("No restrictions on this contract", "لا قيود على هذا العقد"),
    term: t("Term {from} - {to}", "المدة {from} - {to}"),
    days: {
      sunday: t("Sun", "الأحد"),
      monday: t("Mon", "الإثنين"),
      tuesday: t("Tue", "الثلاثاء"),
      wednesday: t("Wed", "الأربعاء"),
      thursday: t("Thu", "الخميس"),
      friday: t("Fri", "الجمعة"),
      saturday: t("Sat", "السبت"),
    } as Record<string, Bi>,
  },
  meals: {
    room_only: t("Room only", "الغرفة فقط"),
    bed_and_breakfast: t("Bed & breakfast", "إفطار"),
    half_board: t("Half board", "نصف إقامة"),
    full_board: t("Full board", "إقامة كاملة"),
    iftar_and_suhoor: t("Iftar & suhoor", "إفطار وسحور"),
  },
  views: {
    sea: t("Sea view", "إطلالة البحر"),
    city: t("City view", "إطلالة المدينة"),
    garden: t("Garden view", "إطلالة الحديقة"),
    pool: t("Pool view", "إطلالة المسبح"),
    mountain: t("Mountain view", "إطلالة الجبل"),
    courtyard: t("Courtyard view", "إطلالة الفناء"),
    street: t("Street view", "إطلالة الشارع"),
    landmark: t("Landmark view", "إطلالة المعلم"),
    haram: t("Haram view", "إطلالة الحرم"),
    partial_haram: t("Partial Haram view", "إطلالة جزئية على الحرم"),
    no_view: t("No view", "بدون إطلالة"),
  } as Record<string, Bi>,
};

/** Manage date-specific booking restrictions - live copy for the Restrictions overlay. */
export const liveRestrictions = {
  sources: {
    room_override: t("Room override", "استثناء للغرفة"),
    all_rooms_override: t("All-rooms override", "استثناء لكل الغرف"),
    contract: t("Contract", "العقد"),
    default: t("Default", "الافتراضي"),
  },
  open: t("Open", "مفتوح"),
  closed: t("Closed", "مغلق"),
  inherit: t("Inherit", "موروث"),
  nightsValue: t("{n} nights", "{n} ليالٍ"),
  noMinimumValue: t("No minimum", "بلا حدّ أدنى"),

  /* The form. */
  minLabel: t("Minimum nights (0-365)", "أقل عدد ليالٍ (٠-٣٦٥)"),
  minHint: t(
    "Leave blank to keep the inherited minimum. 0 removes the minimum on these nights.",
    "اتركه فارغًا لإبقاء الحد الأدنى الموروث. و٠ يلغي الحد الأدنى في هذه الليالي.",
  ),
  minInvalid: t("Enter a whole number from 0 to 365.", "أدخل رقمًا صحيحًا من ٠ إلى ٣٦٥."),
  weekendIs: t(
    "Weekend on this contract: {days}. Check-in and check-out below are not limited by it.",
    "نهاية الأسبوع في هذا العقد: {days}. ولا تتقيد أيام الوصول والمغادرة أدناه بها.",
  ),
  checkLead: t(
    "Every picked night keeps its current check-in and check-out until you change it. These are not limited by the minimum stay's weekend setting.",
    "كل ليلة مختارة تبقى على وصولها ومغادرتها الحاليين حتى تغيّرها. ولا تتقيد بإعداد نهاية الأسبوع للحد الأدنى للإقامة.",
  ),
  legendInherit: t("inherits (no change)", "موروث (بلا تغيير)"),
  legendOpen: t("open (overrides a closure)", "مفتوح (يتجاوز الإغلاق)"),
  legendClosed: t("closed", "مغلق"),
  legendTap: t(
    "· Tap a chip to cycle Inherit → Closed → Open, or a weekday name to close that column",
    "· اضغط على الشارة للتنقل بين موروث ← مغلق ← مفتوح، أو على اسم اليوم لإغلاق العمود",
  ),
  editingHint: t(
    "Editing replaces this rule's nights, rooms and values. Change them, then press + Add and Review & save.",
    "التعديل يستبدل ليالي هذه القاعدة وغرفها وقيمها. غيّرها ثم اضغط + أضف ثم راجع واحفظ.",
  ),

  /* Why Add is shut. */
  nothingSet: t(
    "Set a minimum stay or at least one check-in / check-out weekday.",
    "اضبط حدًّا أدنى للإقامة أو يومًا واحدًا على الأقل للوصول أو المغادرة.",
  ),
  noMatch: t(
    "None of these settings falls on a picked night. Pick nights that include the weekdays or weekend you set.",
    "لا يقع أي من هذه الإعدادات على ليلة مختارة. اختر ليالي تشمل الأيام أو نهاية الأسبوع التي ضبطتها.",
  ),
  minNoMatch: t(
    "The weekend-only minimum stay falls on none of the picked nights. Pick a weekend night or apply it every day.",
    "الحد الأدنى لنهاية الأسبوع لا يقع على أي ليلة مختارة. اختر ليلة من نهاية الأسبوع أو طبّقه كل يوم.",
  ),
  editNotUniform: t(
    "An edit keeps one rule, so every night of the same weekday needs the same check-in and check-out. Make them match, or remove this rule and add new ones for night-by-night changes.",
    "التعديل يُبقي قاعدة واحدة، لذا يلزم أن يكون للوصول والمغادرة نفس الحالة في كل ليلة من اليوم نفسه. وحّدها، أو احذف هذه القاعدة وأضف قواعد جديدة للتغييرات ليلة بليلة.",
  ),
  addTooManyNights: t(
    "One change can cover at most 366 nights. Pick fewer nights.",
    "التغيير الواحد يغطي ٣٦٦ ليلة على الأكثر. اختر ليالي أقل.",
  ),
  splitNote: t(
    "Night-by-night choices are saved as {count} rules: one for the minimum stay and one per set of nights with the same check-in / check-out.",
    "تُحفظ الاختيارات ليلة بليلة كـ{count} قواعد: واحدة للحد الأدنى وواحدة لكل مجموعة ليالٍ لها نفس الوصول / المغادرة.",
  ),
  limitOperations: t(
    "This list has {n} changes to send; the limit is 100. Save part of it first.",
    "تحتوي هذه القائمة على {n} تغييرًا؛ والحد ١٠٠. احفظ جزءًا منها أولًا.",
  ),
  limitDates: t(
    "This list affects {n} distinct nights, including nights cleared by edits and removals; the limit is 366.",
    "تمس هذه القائمة {n} ليلة مختلفة، بما فيها الليالي التي يزيلها التعديل والحذف؛ والحد ٣٦٦.",
  ),
  limitCells: t(
    "This list affects {n} room-nights, including room-nights cleared by edits and removals; the limit is 10,000.",
    "تمس هذه القائمة {n} ليلة-غرفة، بما فيها ما يزيله التعديل والحذف؛ والحد ١٠٬٠٠٠.",
  ),
  unknownRules: t(
    "The current nights of rules {ids} are not loaded, so the size of this change cannot be checked. Reload the rules; if a rule is gone, take its change out of the list.",
    "ليالي القواعد {ids} الحالية غير محمّلة، فلا يمكن فحص حجم هذا التغيير. أعد تحميل القواعد؛ وإن اختفت قاعدة فاحذف تغييرها من القائمة.",
  ),
  reloadRules: t("Reload rules", "أعد تحميل القواعد"),
  editLocked: t(
    "Edit unavailable: {reason} You can still remove it.",
    "التعديل غير متاح: {reason} ويمكنك حذفها.",
  ),
  lockedMinValues: t(
    "its nights now carry different minimum stays.",
    "لياليها تحمل الآن حدودًا دنيا مختلفة.",
  ),
  lockedShape: t(
    "after later changes, its remaining nights, rooms and values no longer form one rule, so an edit would change nights it does not own.",
    "بعد تغييرات لاحقة، لم تعد لياليها وغرفها وقيمها المتبقية تشكّل قاعدة واحدة، فالتعديل سيغيّر ليالي لا تملكها.",
  ),
  pastNights: t(
    "Past nights are read-only. Pick tonight or later in the hotel's time zone.",
    "الليالي الماضية للقراءة فقط. اختر الليلة أو ما بعدها بتوقيت الفندق.",
  ),
  notEligible: t(
    "This contract cannot take restriction changes right now (it must be published and active, scheduled or paused).",
    "لا يقبل هذا العقد تغييرات القيود الآن (يجب أن يكون منشورًا ونشطًا أو مجدولًا أو موقوفًا مؤقتًا).",
  ),

  /* Rule summaries. */
  minLine: t("Min {n} nights", "حد أدنى {n} ليالٍ"),
  minWeekendLine: t("Min {n} nights on weekends", "حد أدنى {n} ليالٍ في نهاية الأسبوع"),
  minZeroLine: t("No minimum stay", "بلا حد أدنى للإقامة"),
  inClosedLine: t("Check-in closed {days}", "الوصول مغلق {days}"),
  inOpenLine: t("Check-in open {days}", "الوصول مفتوح {days}"),
  outClosedLine: t("Check-out closed {days}", "المغادرة مغلقة {days}"),
  outOpenLine: t("Check-out open {days}", "المغادرة مفتوحة {days}"),
  removeLine: t("Remove rule #{id}", "حذف القاعدة #{id}"),
  removeValue: t("Remove", "حذف"),
  staged: t("In your list", "في قائمتك"),
  allRooms: t("All rooms", "كل الغرف"),
  roomLayer: t("Room-specific", "خاصة بالغرف"),
  allRoomsLayer: t("All-rooms rule", "قاعدة لكل الغرف"),
  shadowedNote: t(
    "Hidden on some nights by a more specific room rule.",
    "مخفية في بعض الليالي بقاعدة أخص للغرفة.",
  ),

  /* What will happen. */
  bulletUntouched: t(
    "Contract restrictions and confirmed bookings are not touched.",
    "قيود العقد والحجوزات المؤكدة لا تُمس.",
  ),
  bulletExpires: t(
    "Saved straight after review. It ends on its own after its last night, and the contract rule applies again.",
    "يُحفظ مباشرة بعد المراجعة. وينتهي تلقائيًا بعد آخر ليلة له، فتعود قاعدة العقد للسريان.",
  ),
  bulletPriority: t(
    "Room-specific rules beat all-rooms rules, which beat the contract.",
    "القواعد الخاصة بالغرف تتقدم على قواعد كل الغرف، وهذه تتقدم على العقد.",
  ),

  /* The effective panel. */
  effectiveTitle: t("WHAT APPLIES NOW", "ما يسري الآن"),
  effectiveLead: t(
    "Current rules on the picked nights and rooms, and where each value comes from.",
    "القواعد الحالية على الليالي والغرف المختارة، ومصدر كل قيمة.",
  ),
  loading: t("Loading…", "جارٍ التحميل…"),
  loadFailed: t("Could not load the current rules.", "تعذّر تحميل القواعد الحالية."),
  tooMany: t(
    "Pick 366 nights or fewer to see what applies now.",
    "اختر ٣٦٦ ليلة أو أقل لترى ما يسري الآن.",
  ),
  colRoom: t("Room", "الغرفة"),
  colNight: t("Night", "الليلة"),
  colMin: t("Min stay", "أقل إقامة"),
  colIn: t("Check-in", "الوصول"),
  colOut: t("Check-out", "المغادرة"),
  colBefore: t("Before", "قبل"),
  colAfter: t("After", "بعد"),
  showingFirst: t(
    "Showing the first {shown} of {total} room-nights.",
    "يُعرض أول {shown} من {total} ليلة-غرفة.",
  ),

  /* Review. */
  previewing: t("Checking the impact…", "جارٍ فحص الأثر…"),
  previewFailed: t("Could not check these changes.", "تعذّر فحص هذه التغييرات."),
  retry: t("Check again", "افحص مجددًا"),
  impactTitle: t("IMPACT", "الأثر"),
  counts: t(
    "{cells} room-nights · {nights} nights · {rooms} rooms",
    "{cells} ليلة-غرفة · {nights} ليالٍ · {rooms} غرف",
  ),
  replaces: t("Replaces rules: {ids}", "يستبدل القواعد: {ids}"),
  changedTitle: t("BEFORE / AFTER", "قبل / بعد"),
  noEffectiveChange: t(
    "No effective value changes. The touched nights already carry these values or a more specific rule wins on them.",
    "لا تتغير أي قيمة سارية. فالليالي المعنية تحمل هذه القيم أصلًا أو تتقدم عليها قاعدة أخص.",
  ),
  takesEffectBody: t(
    "New bookings follow these rules as soon as you save. Contract restrictions and confirmed bookings are not touched.",
    "تتبع الحجوزات الجديدة هذه القواعد فور الحفظ. وقيود العقد والحجوزات المؤكدة لا تُمس.",
  ),
  appliedBody: t(
    "New bookings follow these rules now. The grid and the list on the right are refreshed.",
    "تتبع الحجوزات الجديدة هذه القواعد الآن. وتم تحديث الجدول والقائمة على اليمين.",
  ),
  stale: t(
    "Restrictions on this contract changed since you checked. The latest rules are loaded and the impact was checked again - review it before saving.",
    "تغيّرت القيود على هذا العقد منذ فحصك. حُمّلت أحدث القواعد وأُعيد فحص الأثر - راجعه قبل الحفظ.",
  ),
  saved: t("Restrictions saved", "تم حفظ القيود"),
};

/**
 * Manage Release - live copy for the Release overlay. Generic batch, preview
 * and source wording is shared with liveRestrictions.
 */
export const bulkSupplements = {
  loading: t(
    "Loading the contract's meal and child prices…",
    "جارٍ تحميل أسعار الوجبات والأطفال من العقد…",
  ),
  fixedIncluded: t(
    "Fixed price: the room price already includes its meal plan. Child prices below are set apart.",
    "سعر ثابت: سعر الغرفة يشمل خطة وجباتها. أسعار الأطفال أدناه تُضبط بشكل منفصل.",
  ),
  pickOneRoom: t(
    "Fixed price: pick one room type at a time. Its meal plans show below with their own price.",
    "سعر ثابت: اختر نوع غرفة واحد في كل مرة. تظهر خطط وجباتها بالأسفل ولكل منها سعره.",
  ),
  pickOneRoomBase: t("Pick one room at a time.", "اختر غرفة واحدة في كل مرة."),
  pickRoomFirst: t("Pick a room above to see its prices.", "اختر غرفة بالأعلى لتظهر أسعارها."),
  offerTitle: t("{meal} · price includes the meal plan", "{meal} · السعر يشمل خطة الوجبات"),
  everyNight: t("Every night", "كل ليلة"),
  weekdays: t("Weekdays", "أيام الأسبوع"),
  weekend: t("Weekend", "نهاية الأسبوع"),
  contractOffer: t("Now: {price}.", "الآن: {price}."),
  badOffer: t(
    "Enter a price of 0 or more for every night type.",
    "اكتب سعرًا يساوي ٠ أو أكثر لكل نوع ليلة.",
  ),
  roomSupplementsTitle: t("SUPPLEMENTS · ROOMS AND VIEWS", "الفروق · الغرف والإطلالات"),
  contractSupplement: t("Now: +{amount} on the base", "الآن: +{amount} على الأساس"),
  roomSupplementsHint: t(
    "What this room adds on top of the base for these nights, filled in with its current value. Change it to set it for these nights.",
    "ما تضيفه هذه الغرفة فوق الأساس في هذه الليالي، معبأ بقيمتها الحالية. غيّره لتضبطه لهذه الليالي.",
  ),
  supplementNeedsBase: t(
    "Enter the base price above to change a supplement.",
    "اكتب سعر الأساس بالأعلى لتغيير الفرق.",
  ),
  roomSupplements: t("Supplements", "الفروق"),
  mealsTitle: t("MEAL PLANS · PER NIGHT", "خطط الوجبات · لكل ليلة"),
  mealsHint: t(
    "Filled in with this room's current prices. Change a price to set it for these nights. Only the meal plans this contract offers are listed.",
    "معبأة بأسعار هذه الغرفة الحالية. غيّر السعر لتضبطه لهذه الليالي. تظهر فقط خطط الوجبات التي يقدمها هذا العقد.",
  ),
  contractMeal: t("Now: {price} · {basis}", "الآن: {price} · {basis}"),
  basis: {
    per_person: t("Per person", "للشخص"),
    per_room: t("Per room", "للغرفة"),
  },
  badPrice: t("Enter a price of 0 or more.", "اكتب سعرًا يساوي ٠ أو أكثر."),
  childrenTitle: t("CHILDREN · PER CHILD PER NIGHT", "الأطفال · لكل طفل في الليلة"),
  childrenHint: t(
    "Filled in with the current values. Once you change one, all three bands are saved together for these nights.",
    "معبأة بالقيم الحالية. وعند تغيير أي حقل، تُحفظ الفئات الثلاث معًا لهذه الليالي.",
  ),
  childLabels: {
    sharing_parents: t("Sharing parents' bed", "سرير الوالدين"),
    shared_bed: t("Shared bed", "سرير مشترك"),
    extra_bed: t("Extra bed", "سرير إضافي"),
  },
  fromAge: t("From age", "من عمر"),
  toAge: t("To age", "إلى عمر"),
  childPrice: t("Price", "السعر"),
  alwaysFree: t("Always free.", "مجاني دائمًا."),
  badAges: t(
    "Ages 0 to 17, From no higher than To.",
    "الأعمار من ٠ إلى ١٧، و«من» لا يزيد عن «إلى».",
  ),
  nightPriceIncludes: t(
    "This is the room's full price for the night: the base price plus this room's supplement. Meal plans and children are added on top.",
    "هذا هو السعر الكامل للغرفة في الليلة: سعر الأساس مع فرق هذه الغرفة. وتُضاف الوجبات والأطفال فوقه.",
  ),
  mealPrices: t("Meal prices", "أسعار الوجبات"),
  childPrices: t("Child prices", "أسعار الأطفال"),
  counts: t(
    "Meals and children: {affected} room-nights affected · {changed} prices changed",
    "الوجبات والأطفال: {affected} ليلة-غرفة متأثرة · {changed} سعر يتغير",
  ),
};

export const liveRelease = {
  /* The form. */
  daysRange: t("1 to 365 days", "من ١ إلى ٣٦٥ يومًا"),
  daysInvalid: t("Enter a whole number from 1 to 365.", "أدخل رقمًا صحيحًا من ١ إلى ٣٦٥."),
  timeHint: t(
    "24-hour HH:MM, hotel time ({timezone})",
    "صيغة ٢٤ ساعة HH:MM، بتوقيت الفندق ({timezone})",
  ),
  timeInvalid: t(
    "Enter the time as HH:MM, from 00:00 to 23:59.",
    "أدخل الوقت بصيغة HH:MM، من ٠٠:٠٠ إلى ٢٣:٥٩.",
  ),
  sameDayAt: t("Release same day · {at}", "إصدار في اليوم نفسه · {at}"),
  daysAt: t("Release {days} days before · {at}", "إصدار قبل {days} يوم · {at}"),

  /* Why writes are shut for the whole contract. */
  loading: t("Loading this contract's release settings…", "جارٍ تحميل إعدادات الإصدار لهذا العقد…"),
  loadFailed: t(
    "Could not load this contract's release settings, so changes are off.",
    "تعذّر تحميل إعدادات الإصدار لهذا العقد، لذا التغييرات متوقفة.",
  ),
  notEligible: t(
    "This contract cannot take release changes right now (it must be published and active, scheduled or paused).",
    "لا يقبل هذا العقد تغييرات الإصدار الآن (يجب أن يكون منشورًا ونشطًا أو مجدولًا أو موقوفًا مؤقتًا).",
  ),
  cannotOverride: t(
    "Release can't be changed here: the contract has no release policy to override, or isn't eligible.",
    "لا يمكن تغيير الإصدار هنا: لا توجد سياسة إصدار في العقد لتجاوزها، أو العقد غير مؤهل.",
  ),
  noTimezone: t(
    "The hotel's published time zone is missing, so release dates can't be checked and changes are off.",
    "المنطقة الزمنية المنشورة للفندق غير متوفرة، فلا يمكن فحص تواريخ الإصدار والتغييرات متوقفة.",
  ),

  /* Why Add or Review is shut - one per release-format issue code. */
  issues: {
    invalidAction: t("This change is not a release change.", "هذا التغيير ليس تغيير إصدار."),
    invalidRuleId: t(
      "This change has no valid rule to edit or remove.",
      "لا توجد قاعدة صالحة لتعديلها أو حذفها.",
    ),
    forbiddenField: t(
      "This change carries a field a release override can't send.",
      "يحمل هذا التغيير حقلًا لا يمكن إرساله في استثناء الإصدار.",
    ),
    noRooms: t("Pick at least one room.", "اختر غرفة واحدة على الأقل."),
    roomsConflict: t(
      "Pick All rooms or single rooms, not both.",
      "اختر كل الغرف أو غرفًا محددة، لا الاثنين.",
    ),
    invalidVariationId: t(
      "One of the picked rooms is not on this contract.",
      "إحدى الغرف المختارة ليست في هذا العقد.",
    ),
    duplicateVariationIds: t("A room is picked twice.", "غرفة مختارة مرتين."),
    noNights: t("Pick at least one night.", "اختر ليلة واحدة على الأقل."),
    datesConflict: t(
      "Pick single nights or a range, not both.",
      "اختر ليالي منفردة أو مدى، لا الاثنين.",
    ),
    incompleteRange: t(
      "The range needs a first and a last night.",
      "يحتاج المدى إلى أول ليلة وآخر ليلة.",
    ),
    invalidDate: t(
      "One of the picked nights is not a valid date.",
      "إحدى الليالي المختارة ليست تاريخًا صالحًا.",
    ),
    rangeReversed: t("The range ends before it starts.", "ينتهي المدى قبل أن يبدأ."),
    tooManySelectedNights: t(
      "One change can cover at most 366 nights. Pick fewer nights.",
      "التغيير الواحد يغطي ٣٦٦ ليلة على الأكثر. اختر ليالي أقل.",
    ),
    invalidWeekdays: t("Pick at least one weekday.", "اختر يومًا واحدًا على الأقل من الأسبوع."),
    noMatchingNights: t(
      "None of the picked nights falls on the picked weekdays.",
      "لا تقع أي من الليالي المختارة في أيام الأسبوع المختارة.",
    ),
    pastNight: t(
      "Past nights are read-only. Pick tonight or later in the hotel's time zone.",
      "الليالي الماضية للقراءة فقط. اختر الليلة أو ما بعدها بتوقيت الفندق.",
    ),
    outsideTerm: t("Pick nights inside the contract term.", "اختر ليالي ضمن مدة العقد."),
    invalidType: t("Choose Number of days or Same day.", "اختر عدد الأيام أو اليوم نفسه."),
    invalidDays: t(
      "Enter a whole number of days from 1 to 365.",
      "أدخل عدد أيام صحيحًا من ١ إلى ٣٦٥.",
    ),
    daysNotAllowed: t("Same day takes no number of days.", "اليوم نفسه لا يأخذ عدد أيام."),
    invalidTime: t(
      "Enter the time as HH:MM, from 00:00 to 23:59.",
      "أدخل الوقت بصيغة HH:MM، من ٠٠:٠٠ إلى ٢٣:٥٩.",
    ),
    noOperations: t("Add a change first.", "أضف تغييرًا أولًا."),
    tooManyOperations: t(
      "This list has more than 100 changes; save part of it first.",
      "تحتوي هذه القائمة على أكثر من ١٠٠ تغيير؛ احفظ جزءًا منها أولًا.",
    ),
    tooManyNights: t(
      "This list affects more than 366 distinct nights, including nights cleared by removals.",
      "تمس هذه القائمة أكثر من ٣٦٦ ليلة مختلفة، بما فيها ما يزيله الحذف.",
    ),
    tooManyCells: t(
      "This list affects more than 10,000 room-nights, including room-nights cleared by removals.",
      "تمس هذه القائمة أكثر من ١٠٬٠٠٠ ليلة-غرفة، بما فيها ما يزيله الحذف.",
    ),
  },

  /* The contract's own policy, read-only. */
  fromContractWhen: t("Every night of the contract", "كل ليالي العقد"),
  noPolicy: t("No release policy", "لا توجد سياسة إصدار"),
  valueDays: t("{days} days before · {time}", "قبل {days} يوم · {time}"),
  valueSameDay: t("Same day · {time}", "اليوم نفسه · {time}"),
  afterStopSale: t("After release: Stop sale", "بعد الإصدار: إيقاف البيع"),
  afterOnRequest: t("After release: On Request", "بعد الإصدار: عند الطلب"),
  sla: t(
    "On Request SLA: {minutes} min, then {expiry}",
    "مهلة الطلب: {minutes} دقيقة، ثم {expiry}",
  ),
  expiry: {
    auto_reject: t("auto-reject", "رفض تلقائي"),
    escalate_to_hoteliana: t("escalate to Hoteliana", "تصعيد إلى هوتيليانا"),
  } as Record<string, Bi>,

  /* Override rules in the list. */
  ruleValue: t("Release rule #{id}", "قاعدة إصدار #{id}"),
  scopeUnknown: t("Nights and rooms couldn't be confirmed", "تعذّر تأكيد الليالي والغرف"),
  allShadowedNote: t(
    "Hidden on every remaining night by a more specific room rule.",
    "مخفية في كل لياليها المتبقية بقاعدة أخص للغرفة.",
  ),
  /* Why Edit is off for one rule. Remove stays available unless removeLocked says otherwise. */
  lockedScope: t(
    "Edit unavailable: this rule's remaining nights and rooms couldn't be confirmed.",
    "التعديل غير متاح: تعذّر تأكيد الليالي والغرف المتبقية لهذه القاعدة.",
  ),
  lockedTiming: t(
    "Edit unavailable: this rule's release timing couldn't be read. Remove it and add a new one instead.",
    "التعديل غير متاح: تعذّرت قراءة توقيت الإصدار لهذه القاعدة. احذفها وأضف قاعدة جديدة بدلًا منها.",
  ),
  lockedLayer: t(
    "Edit unavailable: whether this rule is for all rooms or specific rooms couldn't be read. Remove it and add a new one instead.",
    "التعديل غير متاح: تعذّرت معرفة ما إذا كانت هذه القاعدة لكل الغرف أو لغرف محددة. احذفها وأضف قاعدة جديدة بدلًا منها.",
  ),
  lockedShape: t(
    "Edit unavailable: this rule covers different nights on different rooms, so one edit can't rebuild it exactly. Remove it and add new rules instead.",
    "التعديل غير متاح: تغطي هذه القاعدة ليالي مختلفة في غرف مختلفة، فلا يمكن لتعديل واحد إعادة بنائها بدقة. احذفها وأضف قواعد جديدة بدلًا منها.",
  ),
  lockedRooms: t(
    "Edit unavailable: this rule's rooms no longer match the contract's Room + Views exactly, so editing it would change which rooms it covers.",
    "التعديل غير متاح: لم تعد غرف هذه القاعدة تطابق غرف العقد بدقة، فتعديلها سيغيّر الغرف التي تشملها.",
  ),
  lockedTooManyNights: t(
    "Edit unavailable: this rule has more remaining nights than one edit can carry (366).",
    "التعديل غير متاح: لهذه القاعدة ليالٍ متبقية أكثر مما يحمله تعديل واحد (٣٦٦).",
  ),
  /* Editing a saved rule: its layer and rooms are fixed. */
  editingRuleHint: t(
    "Change the nights or release timing, then press Save changes. The rule keeps its rooms. Cancel leaves the rule as it was.",
    "غيّر الليالي أو توقيت الإصدار، ثم اضغط حفظ التغييرات. تحتفظ القاعدة بغرفها. والإلغاء يُبقي القاعدة كما كانت.",
  ),
  roomsFixed: t(
    "Rooms stay as the rule has them: a saved rule can't move between all rooms and specific rooms.",
    "تبقى الغرف كما هي في القاعدة: لا يمكن نقل قاعدة محفوظة بين كل الغرف وغرف محددة.",
  ),
  removeLocked: t(
    "Remove unavailable: this rule's remaining nights and rooms couldn't be confirmed.",
    "الحذف غير متاح: تعذّر تأكيد الليالي والغرف المتبقية لهذه القاعدة.",
  ),
  removeLine: t("Remove release rule #{id}", "حذف قاعدة الإصدار #{id}"),

  /* What will happen. */
  bulletTimingOnly: t(
    "Changes only when unsold rooms go back. What happens after release, and its SLA, still come from the contract.",
    "يغيّر موعد عودة الغرف غير المبيعة فقط. وما يحدث بعد الإصدار ومهلته يبقيان من العقد.",
  ),
  bulletPriority: t(
    "Room-specific release beats all-rooms release, which beats the contract.",
    "إصدار الغرف المحددة يتقدم على إصدار كل الغرف، وهذا يتقدم على العقد.",
  ),
  bulletNow: t(
    "Saved straight after review. Confirmed bookings are not touched.",
    "يُحفظ مباشرة بعد المراجعة. ولا تُمس الحجوزات المؤكدة.",
  ),

  /* Review. */
  noValue: t("No release", "بلا إصدار"),
  deadline: t("Deadline {date} {time} ({timezone})", "الموعد {date} {time} ({timezone})"),
  takesEffectBody: t(
    "New release timing applies as soon as you save. The contract and confirmed bookings are not touched.",
    "يسري توقيت الإصدار الجديد فور الحفظ. ولا يُمس العقد ولا الحجوزات المؤكدة.",
  ),
  appliedBody: t(
    "Release timing is saved. The list on the right is refreshed.",
    "تم حفظ توقيت الإصدار. وتم تحديث القائمة على اليمين.",
  ),
  stale: t(
    "Release on this contract changed since you checked. The latest rules are loaded and the impact was checked again - review it before saving.",
    "تغيّر الإصدار على هذا العقد منذ فحصك. حُمّلت أحدث القواعد وأُعيد فحص الأثر - راجعه قبل الحفظ.",
  ),
  saved: t("Release saved", "تم حفظ الإصدار"),
};
