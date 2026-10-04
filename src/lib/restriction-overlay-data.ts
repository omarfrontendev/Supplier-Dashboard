/**
 * The restriction drawer and its neighbours — Figma OV 03.RS, RSB, RSS,
 * RSE, RSW, RSK, RSD and RSDP.
 */

export interface Bi {
  en: string;
  ar: string;
}

const t = (en: string, ar: string): Bi => ({ en, ar });

/** Whether a day in the range takes check-ins, check-outs, both or neither. */
export type DayState = "open" | "noIn" | "noOut" | "closed" | "outside";

export const restrictionDrawer = {
  overline: t(
    "RESTRICTIONS · MAKKAH ANNUAL BLOCK",
    "القيود · حصة مكة السنوية"
  ),
  addTitle: t("Add restriction", "إضافة قيد"),
  editTitle: t("Edit restriction", "تعديل القيد"),
  addBody: t(
    "Minimum nights and the days guests can check in or out. Where dates overlap an older rule, the newest rule wins on those dates.",
    "أدنى عدد ليالٍ والأيام التي يدخل فيها الضيوف أو يخرجون. وحيث تتداخل التواريخ مع قاعدة أقدم، تفوز الأحدث في تلك التواريخ."
  ),
  editBody: t(
    "Last updated by Abdullrahman Najeh · 14 Sep 2026 · created 10 Sep 2026. Changes apply to new bookings and searches only.",
    "آخر تحديث بواسطة عبدالرحمن ناجح · ١٤ سبتمبر ٢٠٢٦ · أُنشئ ١٠ سبتمبر ٢٠٢٦. وتسري التغييرات على الحجوزات والبحث الجديد فقط."
  ),
  roomLabel: t("Room type", "نوع الغرفة"),
  allRooms: t("All rooms", "كل الغرف"),
  datesLabel: t("Dates", "التواريخ"),
  datesPlaceholder: t("Start - end", "البداية - النهاية"),
  minLabel: t("Minimum nights", "أدنى عدد ليالٍ"),
  minPlaceholder: t("e.g. 3", "مثال: ٣"),
  minValue: t("4 nights", "٤ ليالٍ"),
  termNote: t(
    "Dates must sit inside the contract term · 01 Sep 2026 - 31 Aug 2027.",
    "يجب أن تقع التواريخ داخل مدة العقد · ١ سبتمبر ٢٠٢٦ - ٣١ أغسطس ٢٠٢٧."
  ),
  seasonNote: t(
    "Dates filled from the season Ramadan. Shorten them if the rule covers only part of it.",
    "التواريخ مملوءة من موسم رمضان. اختصرها إن كانت القاعدة تغطي جزءًا منه."
  ),
  /* OV 03.RSK — one night is no rule at all. */
  minError: t(
    "Minimum nights is at least 1. With 1 there is no rule - choose None instead of adding one.",
    "أدنى عدد الليالي واحد على الأقل. ومع واحدة لا توجد قاعدة - اختر «بلا قيود» بدل إضافة واحدة."
  ),
  minFix: t("Use 2", "استخدم ٢"),
  appliesLabel: t("Applies on", "ينطبق في"),
  everyDay: t("Every day in the range", "كل يوم في النطاق"),
  weekendOnly: t("Weekend days only · Thu, Fri", "نهاية الأسبوع فقط · الخميس، الجمعة"),
  everyDayHint: t(
    "Weekend days come from Contract basics. On other days the booking sells as if this rule didn’t exist.",
    "تأتي أيام نهاية الأسبوع من أساسيات العقد. وفي الأيام الأخرى يُباع الحجز كأن هذه القاعدة غير موجودة."
  ),
  weekendHint: t(
    "The rule covers Thursdays and Fridays only - the weekend days set in Contract basics. Other days sell as if there were no rule.",
    "تغطي القاعدة الخميس والجمعة فقط - أيام نهاية الأسبوع المحددة في أساسيات العقد. وتُباع الأيام الأخرى كأن لا قاعدة."
  ),
  daysLabel: t("Check-in & check-out days", "أيام الدخول والخروج"),
  daysHint: t(
    "Every day is open. Tap a day to open or close its check-in / check-out, or tap a weekday name to do it for every week of the range.",
    "كل يوم مفتوح. انقر يومًا لفتح أو إغلاق دخوله وخروجه، أو انقر اسم يوم الأسبوع لتفعل ذلك في كل أسابيع النطاق."
  ),
  emptyCalendar: t(
    "Pick dates above - the calendar of your range shows here.",
    "اختر التواريخ أعلاه - ويظهر تقويم نطاقك هنا."
  ),
  legendIn: t("In", "دخول"),
  legendOut: t("Out", "خروج"),
  legendOpen: t("open", "مفتوح"),
  legendClosed: t("closed", "مغلق"),
  legendWeekend: t("weekend", "نهاية أسبوع"),
  legendNotInRule: t("Not in rule", "خارج القاعدة"),
  legendNoIn: t("no in", "بلا دخول"),
  legendNoOut: t("no out", "بلا خروج"),
  legendTap: t(
    "· Tap a day or a weekday name to change it",
    "· انقر يومًا أو اسم يوم لتغييره"
  ),
  /* OV 03.RSB / RSW — what this rule takes over from an older one. */
  replaces: t(
    "This rule replaces “All rooms · 01 - 30 Sep · min 2 nights” on 20 - 25 Sep only. The older rule stays as it is on its other dates.",
    "تحلّ هذه القاعدة محل «كل الغرف · ١ - ٣٠ سبتمبر · ليلتان كحد أدنى» في ٢٠ - ٢٥ سبتمبر فقط. وتبقى القاعدة الأقدم كما هي في تواريخها الأخرى."
  ),
  replacesWeekend: t(
    "This rule replaces “All rooms · 01 - 30 Sep · min 2 nights” on Thu 24 and Fri 25 Sep only. Every other date keeps the older rule.",
    "تحلّ هذه القاعدة محل «كل الغرف · ١ - ٣٠ سبتمبر · ليلتان كحد أدنى» في الخميس ٢٤ والجمعة ٢٥ سبتمبر فقط. وتحتفظ بقية التواريخ بالقاعدة الأقدم."
  ),
  active: t("Active", "فعّال"),
  inactive: t("Inactive", "غير فعّال"),
  activeHint: t(
    "Inactive rules are kept on the contract but not applied to searches or bookings.",
    "تبقى القواعد غير الفعّالة على العقد لكنها لا تُطبَّق على البحث ولا الحجوزات."
  ),
  deleteRule: t("Delete restriction", "حذف القيد"),
  cancel: t("Cancel", "إلغاء"),
  save: t("Save restriction", "حفظ القيد"),
  saveChanges: t("Save changes", "حفظ التغييرات"),
  month: t("September 2026", "سبتمبر ٢٠٢٦"),
  weekdays: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
  /** The calendar heads are short; the sentences use the full name. */
  weekdaysLong: [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ],
  weekdaysAr: ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"],
};

/** OV 03.RSD — deleting a rule cannot be undone. */
export const deleteRestrictionDialog = {
  title: t("Delete this restriction?", "هل تحذف هذا القيد؟"),
  body: t(
    "It is removed from the contract straight away.",
    "يُزال من العقد فورًا."
  ),
  note: t(
    "New searches and bookings stop following it. Confirmed bookings keep the rules they were booked with. This can’t be undone - to pause a rule instead, edit it and set it to Inactive.",
    "يتوقف البحث والحجوزات الجديدة عن اتباعه. وتحتفظ الحجوزات المؤكدة بالقواعد التي حُجزت بها. ولا يمكن التراجع - ولإيقاف قاعدة بدل حذفها، حرّرها واجعلها غير فعّالة."
  ),
  cancel: t("Cancel", "إلغاء"),
  confirm: t("Delete", "حذف"),
};

/** OV 03.RSDP — the range picker that fills the Dates field. */
export const datePickerPanel = {
  title: t("Pick the dates", "اختر التواريخ"),
  picked: t("20 - 25 Sep · 6 nights", "٢٠ - ٢٥ سبتمبر · ٦ ليالٍ"),
  month: t("September 2026", "سبتمبر ٢٠٢٦"),
  nextMonth: t("October 2026", "أكتوبر ٢٠٢٦"),
  weekdays: ["Sa", "Su", "Mo", "Tu", "We", "Th", "Fr"],
  weekdaysAr: ["سب", "أح", "إث", "ثل", "أر", "خم", "جم"],
  note: t(
    "Contract term 01 Sep 2026 - 31 Aug 2027 · dates outside it can’t be picked",
    "مدة العقد ١ سبتمبر ٢٠٢٦ - ٣١ أغسطس ٢٠٢٧ · ولا يمكن اختيار تواريخ خارجها"
  ),
  apply: t("Apply", "تطبيق"),
};
