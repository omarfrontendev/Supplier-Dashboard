/**
 * OV 03.12N / N0 / NA / NE — nationality prices, Flow 12 Row C.
 *
 * The rules that shape every screen below:
 *
 *   BR-03-91  Nationality prices live **inside a season only**. Outside one,
 *             every nationality pays the same price.
 *   BR-03-92  A group is a name, a list of countries, and one of two ways of
 *             differing: an adjustment on the season price, which follows it
 *             whenever the season moves, or a fixed price per room, which
 *             stays where it is until someone edits it.
 *   BR-03-93  A country belongs to one group per season. Saving a clash is
 *             refused (OV 03.12NX); the same country may be in a different
 *             group in another season.
 *   BR-03-94  Meals, extra children, restrictions and policies are the
 *             season's own - they do not change by nationality.
 *   BR-03-95  Agents search with the lead guest's nationality, defaulting to
 *             the agency's country. A nationality in no group pays the season.
 *   BR-03-96  A group price under the supplier's own minimum warns, per room.
 *             Ten groups per season is the suggested ceiling - a warning,
 *             never a block.
 */

export interface Bi {
  en: string;
  ar: string;
}

const t = (en: string, ar: string): Bi => ({ en, ar });

/** BR-03-92 — the two ways a group's price can differ. */
export type PriceMode = "adjust" | "fixed";

export interface NationalityGroup {
  id: string;
  name: Bi;
  countries: Bi[];
  mode: PriceMode;
  /** `adjust`: SAR on the season price, per room per night. Negative takes off. */
  adjust?: number | undefined;
  /** `fixed`: a full price per room, weekday and weekend. */
  fixed?: Record<string, { weekday: number; weekend: number }> | undefined;
}

/** The three groups the frame draws, and the season they sit in. */
export const nationalityGroups: NationalityGroup[] = [
  {
    id: "NG-01",
    name: t("GCC nationals", "مواطنو الخليج"),
    countries: [
      t("Saudi Arabia", "السعودية"),
      t("UAE", "الإمارات"),
      t("Kuwait", "الكويت"),
      t("Qatar", "قطر"),
      t("Bahrain", "البحرين"),
      t("Oman", "عُمان"),
    ],
    mode: "adjust",
    adjust: -40,
  },
  {
    id: "NG-02",
    name: t("Indonesia & Malaysia", "إندونيسيا وماليزيا"),
    countries: [
      t("Indonesia", "إندونيسيا"),
      t("Malaysia", "ماليزيا"),
    ],
    mode: "adjust",
    adjust: 60,
  },
  {
    id: "NG-03",
    name: t("Pakistan", "باكستان"),
    countries: [t("Pakistan", "باكستان")],
    mode: "fixed",
    fixed: {
      "Standard Room · City View": { weekday: 690, weekend: 790 },
      "Standard Room · Haram View": { weekday: 800, weekend: 900 },
      "Triple Room · City View": { weekday: 780, weekend: 880 },
    },
  },
];

/** The rooms a season prices, and what the season itself charges. */
export const seasonRoomPrices: Array<{
  room: Bi;
  /* The column head in the tab's table: five rooms across a modal need
     the short name, and the row underneath carries the price anyway. */
  short: Bi;
  weekday: number;
  weekend: number;
  /** BR-03-96 — the supplier's own floor for this room. */
  floor: number;
}> = [
  {
    room: t("Standard Room · City View", "غرفة قياسية · إطلالة مدينة"),
    short: t("STANDARD · CITY", "قياسية · مدينة"),
    weekday: 640,
    weekend: 740,
    floor: 560,
  },
  {
    room: t("Standard Room · Haram View", "غرفة قياسية · إطلالة حرم"),
    short: t("STANDARD · HARAM", "قياسية · حرم"),
    weekday: 760,
    weekend: 860,
    floor: 680,
  },
  {
    room: t("Triple Room · City View", "غرفة ثلاثية · إطلالة مدينة"),
    short: t("TRIPLE · CITY", "ثلاثية · مدينة"),
    weekday: 740,
    weekend: 840,
    floor: 660,
  },
];

/** The countries the picker offers. A short list, as the frame draws it. */
export const countryList: Bi[] = [
  t("Saudi Arabia", "السعودية"),
  t("United Arab Emirates", "الإمارات"),
  t("Kuwait", "الكويت"),
  t("Qatar", "قطر"),
  t("Bahrain", "البحرين"),
  t("Oman", "عُمان"),
  t("Egypt", "مصر"),
  t("Jordan", "الأردن"),
  t("Pakistan", "باكستان"),
  t("India", "الهند"),
  t("Indonesia", "إندونيسيا"),
  t("Malaysia", "ماليزيا"),
  t("Turkey", "تركيا"),
  t("Nigeria", "نيجيريا"),
  t("United Kingdom", "المملكة المتحدة"),
];

export const MAX_GROUPS = 10;

export const nationalityCopy = {
  tab: t("Nationality prices", "أسعار الجنسيات"),
  seasonTab: t("Season prices", "أسعار الموسم"),

  /* N0 — the season has no groups. */
  emptyTitle: t(
    "No nationality prices in this season",
    "لا أسعار جنسيات في هذا الموسم"
  ),
  emptyBody: t(
    "Every nationality pays the season prices. Add a group only if the hotel prices some nationalities differently.",
    "كل الجنسيات تدفع أسعار الموسم. ولا تضف مجموعة إلا إن كان الفندق يسعّر بعض الجنسيات على نحو مختلف."
  ),
  add: t("Add nationality prices", "أضف أسعار جنسيات"),

  /* N — the season has groups. */
  intro: t(
    "Agents search with the lead guest's nationality. Nationalities you don't list pay the season prices. Meals and extra children cost the same for every nationality.",
    "يبحث الوكلاء بجنسية الضيف الرئيسي. والجنسيات التي لا تدرجها تدفع أسعار الموسم. وتكلفة الوجبات والأطفال الزائدين واحدة لكل الجنسيات."
  ),
  tableTitle: t("Nationality prices · {season}", "أسعار الجنسيات · {season}"),
  tableSub: t(
    "{groups} · weekday / weekend, SAR per room per night",
    "{groups} · يوم أسبوع / نهاية أسبوع، ر.س لكل غرفة في الليلة"
  ),
  colGroup: t("NATIONALITY GROUP", "مجموعة الجنسية"),
  colDiffers: t("HOW IT DIFFERS", "كيف يختلف"),
  edit: t("Edit", "تعديل"),
  /* The last row, which is always there. */
  everyoneElse: t("All other nationalities", "كل الجنسيات الأخرى"),
  seasonPrices: t("Season prices", "أسعار الموسم"),
  /* The frame writes it on two lines: the amount, then what it is on. */
  adjustedBy: t("{sign} {amount} SAR", "{sign} {amount} ر.س"),
  onSeasonPrice: t("on the season price", "على سعر الموسم"),
  fixedPrice: t("Fixed price", "سعر ثابت"),
  perRoom: t("per room", "لكل غرفة"),
  fixedPerRoom: t("Fixed price per room", "سعر ثابت لكل غرفة"),

  /* NA / NE — the drawer. */
  addOverline: t("{season} SEASON · NATIONALITY PRICES", "موسم {season} · أسعار الجنسيات"),
  /* N0 has no groups yet, so it has no season to name in the title. */
  noneTitle: t("Nationality prices", "أسعار الجنسيات"),
  addTitle: t("Add nationality prices", "إضافة أسعار جنسيات"),
  editTitle: t("Edit {group}", "تعديل {group}"),
  addBody: t(
    "Pick the countries and how their price differs from the season. Everyone else keeps the season price.",
    "اختر الدول وكيف يختلف سعرها عن الموسم. ويبقى الباقون على سعر الموسم."
  ),
  editNote: t(
    "Changes apply to new bookings only; confirmed bookings keep their price.",
    "تسري التغييرات على الحجوزات الجديدة فقط؛ وتحتفظ الحجوزات المؤكدة بسعرها."
  ),

  step1: t("1 · Who pays this price", "١ · من يدفع هذا السعر"),
  step1Sub: t(
    "Group name and the countries in it",
    "اسم المجموعة والدول التي فيها"
  ),
  groupName: t("Group name", "اسم المجموعة"),
  countriesLabel: t("Countries", "الدول"),
  groupNameHint: t("Shown only to you", "يظهر لك وحدك"),
  groupNamePlaceholder: t("e.g. GCC nationals", "مثال: مواطنو الخليج"),
  searchCountries: t("Search and add countries", "ابحث وأضف دولًا"),
  oneGroupRule: t(
    "A country can be in one group per season",
    "يمكن أن تكون الدولة في مجموعة واحدة لكل موسم"
  ),
  /* BR-03-93 / OV 03.12NX — the clash that stops the save, as a banner
     over the whole form: it is not a note beside one field, it is the
     reason the button will not work. */
  clashTitle: t(
    "{country} is already in another group",
    "{country} موجودة بالفعل في مجموعة أخرى"
  ),
  clash: t(
    "{country} is in \"{group}\" in this season. A country can be in one group per season - remove it there or here. Nothing is saved until you fix it.",
    "{country} في «{group}» في هذا الموسم. والدولة تكون في مجموعة واحدة لكل موسم — أزلها هناك أو هنا. ولا يُحفظ شيء حتى تصلح ذلك."
  ),

  step2: t("2 · How the price differs", "٢ · كيف يختلف السعر"),
  step2Sub: t(
    "Pick one way for this group",
    "اختر طريقة واحدة لهذه المجموعة"
  ),
  adjustLabel: t("Adjust the season price", "عدّل سعر الموسم"),
  adjustHint: t(
    "Add or take off an amount per room per night.",
    "أضف أو اخصم مبلغًا لكل غرفة في الليلة."
  ),
  fixedLabel: t("Fixed price per room", "سعر ثابت لكل غرفة"),
  fixedHint: t(
    "Type a full price for every room.",
    "اكتب سعرًا كاملًا لكل غرفة."
  ),
  adjustBy: t("AMOUNT PER ROOM PER NIGHT", "المبلغ لكل غرفة في الليلة"),

  step3: t("3 · Prices for this group", "٣ · أسعار هذه المجموعة"),
  fillsIn: t(
    "Fills in as you type · weekday / weekend",
    "تُملأ أثناء الكتابة · يوم أسبوع / نهاية أسبوع"
  ),
  /* Editing already knows the answer, so it names it. */
  becomes: t("Season price → price for {group}", "سعر الموسم ← سعر {group}"),
  changePlaceholder: t("± SAR", "± ر.س"),
  /* The unit the change input writes beside the number. */
  sar: t("SAR", "ر.س"),
  /* BR-03-94, and the frame ends the form with it. */
  seasonOwn: t(
    "Meals, extra children, restrictions and policies are the season's own - they do not change by nationality.",
    "الوجبات والأطفال الزائدون والقيود والسياسات كلها للموسم — ولا تتغير بالجنسية."
  ),
  colRoom: t("ROOM", "الغرفة"),
  colSeasonPrice: t("SEASON PRICE · INCL. VAT", "سعر الموسم · شامل الضريبة"),
  colChange: t("CHANGE", "التغيير"),
  colGroupPrice: t("GROUP PRICE · INCL. VAT", "سعر المجموعة · شامل الضريبة"),
  weekday: t("Weekday", "يوم أسبوع"),
  weekend: t("Weekend", "نهاية الأسبوع"),
  /* BR-03-96 — under the supplier's own floor. */
  belowFloor: t(
    "Below your minimum for this room ({floor}).",
    "دون حدّك الأدنى لهذه الغرفة ({floor})."
  ),
  /* The room added to the season after the group was made. */
  noPriceYet: t(
    "{group} has no price for {room} · it falls to the season price until you type one.",
    "لا سعر لـ{group} في {room} · ويقع على سعر الموسم حتى تكتب سعرًا."
  ),
  tooMany: t(
    "That is {n} groups in one season. It still saves, but a season is easier to read with fewer.",
    "هذه {n} مجموعات في موسم واحد. وتُحفظ رغم ذلك، لكنّ الموسم أسهل قراءة بعدد أقل."
  ),

  cancel: t("Cancel", "إلغاء"),
  save: t("Save nationality prices", "احفظ أسعار الجنسيات"),
  saveChanges: t("Save changes", "احفظ التغييرات"),
  removeGroup: t("Remove group", "إزالة المجموعة"),

  /* The confirm no frame draws. */
  removeTitle: t("Remove the group {name}?", "إزالة مجموعة {name}؟"),
  removeBody: t(
    "Guests from its {n} countries pay the season prices from the next booking. Confirmed bookings keep their price.",
    "يدفع ضيوف دولها الـ{n} أسعار الموسم من الحجز التالي. وتحتفظ الحجوزات المؤكدة بسعرها."
  ),
  keepGroup: t("Keep group", "أبقِ المجموعة"),

  /* The line Review & publish prints when the season price moved. */
  reviewLine: t(
    "Nationality groups · {follow} follow the new price · {fixed} fixed ({names}) keeps its price",
    "مجموعات الجنسيات · {follow} تتبع السعر الجديد · {fixed} ثابتة ({names}) تحتفظ بسعرها"
  ),
} as const;
