/**
 * The season editor — Figma OV 03.12 (base + supplements) and OV 03.12B
 * (fixed price per room). Same structure as the contract, scoped to the
 * season's dates.
 */

export interface Bi {
  en: string;
  ar: string;
}

const t = (en: string, ar: string): Bi => ({ en, ar });

export const seasonPage = {
  overline: t(
    "RATE SEASON · BASE + SUPPLEMENTS · SAME STRUCTURE AS THE CONTRACT",
    "موسم الأسعار · أساس + فروق · بنية العقد نفسها"
  ),
  overlineFixed: t(
    "RATE SEASON · FIXED PRICE PER ROOM · SAME STRUCTURE AS THE CONTRACT",
    "موسم الأسعار · سعر ثابت لكل غرفة · بنية العقد نفسها"
  ),
  title: t("{season} season", "موسم {season}"),
  /* OV 03.12N — the same modal, showing the other tab. */
  overlineNationality: t(
    "RATE SEASON · NATIONALITY PRICES",
    "موسم الأسعار · أسعار الجنسيات"
  ),
  bodyNationality: t(
    "Prices for guests of certain nationalities. Everyone else pays the season prices.",
    "أسعار لضيوف جنسيات بعينها. ويدفع الباقون أسعار الموسم."
  ),
  body: t(
    "A season has its own prices - set every number for these dates. Nothing here is tied to the contract’s numbers; nights outside the season keep the contract prices.",
    "للموسم أسعاره الخاصة - اضبط كل رقم لهذه التواريخ. ولا شيء هنا مرتبط بأرقام العقد؛ والليالي خارج الموسم تحتفظ بأسعار العقد."
  ),
  bodyFixed: t(
    "A season has its own prices - type the full price of every row for these dates. Nights outside the season keep the contract prices.",
    "للموسم أسعاره الخاصة - اكتب السعر الكامل لكل صفّ لهذه التواريخ. والليالي خارج الموسم تحتفظ بأسعار العقد."
  ),

  section1: t(
    "1 · SEASON NAME, DATES & COLOUR",
    "١ · اسم الموسم وتواريخه ولونه"
  ),
  nameLabel: t("Season name", "اسم الموسم"),
  datesLabel: t("Dates", "التواريخ"),
  colourLabel: t("Season colour", "لون الموسم"),
  colourHint: t("Shows on the rate calendar", "يظهر في تقويم الأسعار"),

  section2: t("2 - 5 · PRICES FOR THESE DATES", "٢ - ٥ · الأسعار لهذه التواريخ"),
  section2Fixed: t(
    "2 · ROOMS AS SOLD · FULL PRICE FOR THESE DATES",
    "٢ · الغرف كما تُباع · السعر الكامل لهذه التواريخ"
  ),
  pricingBody: t(
    "Base + supplements, like the contract. Pick this season’s base room and its price - every other room and meal is a supplement on top.",
    "أساس + فروق، كالعقد. اختر الغرفة الأساس لهذا الموسم وسعرها - وكل غرفة ووجبة أخرى فرق يُضاف فوقه."
  ),
  roomsBody: t(
    "Every room this contract sells. The base room is locked here - its season price is in the section above. Supplements can differ from the contract.",
    "كل غرفة يبيعها هذا العقد. والغرفة الأساس مقفلة هنا - وسعرها الموسمي في القسم أعلاه. وقد تختلف الفروق عن العقد."
  ),
  priceListTitle: t(
    "Price list · what every room sells at during {season}",
    "قائمة الأسعار · بكم تُباع كل غرفة خلال {season}"
  ),
  baseNote: t("{price} · this season’s base", "{price} · أساس هذا الموسم"),

  section6: t("6 · RESTRICTIONS & RULES", "٦ · القيود والقواعد"),
  section6Fixed: t("3 · RESTRICTIONS & RULES", "٣ · القيود والقواعد"),
  restrictionsValue: t(
    "Same as contract · Min stay 1 night · no other rules",
    "كالعقد · أدنى إقامة ليلة واحدة · بلا قواعد أخرى"
  ),
  restrictionsHint: t(
    "Add a minimum stay, a booking window or a cut-off that applies only on these dates.",
    "أضف حدًا أدنى للإقامة أو نافذة حجز أو إقفالًا ينطبق على هذه التواريخ وحدها."
  ),
  addRestriction: t(
    "Add restriction for these dates",
    "إضافة قيد لهذه التواريخ"
  ),

  section7: t("7 · POLICIES", "٧ · السياسات"),
  section7Fixed: t("4 · POLICIES", "٤ · السياسات"),
  policyValue: t(
    "Own policy · free until 14 days, then 100% of the stay",
    "سياسة خاصة · مجاني حتى ١٤ يومًا، ثم ١٠٠٪ من الإقامة"
  ),
  policyHint: t(
    "Shown next to the contract policy in the contract’s Policies section.",
    "تظهر بجانب سياسة العقد في قسم السياسات."
  ),

  removeSeason: t("Remove season", "حذف الموسم"),
  cancel: t("Cancel", "إلغاء"),
  save: t("Save season", "حفظ الموسم"),
};
