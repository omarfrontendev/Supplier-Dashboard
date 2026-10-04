/**
 * Supplier / Date picker — the component Flow 12 Row I introduced, and the
 * strings OV 04.6P1 / 04.6P2 and OV 03.0M print around it.
 */
export const datePickerCopy = {
  en: {
    prev: "Previous month",
    next: "Next month",
    weekdays: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    months: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ],
    monthsShort: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ],
    daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    thisWeekend: "This weekend",
    next7: "Next 7 nights",
    next30: "Next 30 nights",
    wholeSeason: "Whole season",
    weekendNight: "weekend night",
    weekdayNight: "weekday night",
    oneHint: "Click another day to make it a range.",
    pastClosed: "Days before today are closed.",
    nights: "{count} nights",
    oneNight: "1 night",
    /* §0.2 - "الليالي المقفولة بتتشال ويظهر سطر يقول عددها". */
    closedDropped: "{count} closed nights are not included",
    oneClosedDropped: "1 closed night is not included",
    weekdaysCount: "{count} weekdays",
    weekendNights: "{count} weekend nights ({list})",
    oneWeekendNight: "1 weekend night ({list})",
    alreadyChanged: "{count} already changed",
    legendWeekend: "Weekend in your contract: {days}",
    legendChanged: "Already changed",
    legendToday: "Today",
    cancel: "Cancel",
    use: "Use {label}",
    pickFirst: "Pick a night to start",
  },
  ar: {
    prev: "الشهر السابق",
    next: "الشهر التالي",
    weekdays: ["أح", "إث", "ثل", "أر", "خم", "جم", "سب"],
    months: [
      "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
    ],
    monthsShort: [
      "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
    ],
    daysShort: [
      "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت",
    ],
    thisWeekend: "هذه العطلة",
    next7: "الليالي السبع القادمة",
    next30: "الثلاثون ليلة القادمة",
    wholeSeason: "الموسم كله",
    weekendNight: "ليلة عطلة",
    weekdayNight: "ليلة أسبوع",
    oneHint: "اضغط يومًا آخر ليصبح نطاقًا.",
    pastClosed: "والأيام قبل اليوم مغلقة.",
    nights: "{count} ليالٍ",
    closedDropped: "{count} ليالٍ مقفولة غير محتسبة",
    oneClosedDropped: "ليلة مقفولة واحدة غير محتسبة",
    oneNight: "ليلة واحدة",
    weekdaysCount: "{count} أيام أسبوع",
    weekendNights: "{count} ليالي عطلة ({list})",
    oneWeekendNight: "ليلة عطلة واحدة ({list})",
    alreadyChanged: "{count} مغيّرة بالفعل",
    legendWeekend: "عطلة عقدك: {days}",
    legendChanged: "مغيّرة بالفعل",
    legendToday: "اليوم",
    cancel: "إلغاء",
    use: "استخدم {label}",
    pickFirst: "اختر ليلة للبدء",
  },
} as const;

export type DatePickerCopy = (typeof datePickerCopy)["en"];
