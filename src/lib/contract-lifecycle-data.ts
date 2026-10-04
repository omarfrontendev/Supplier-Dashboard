/**
 * The drawers and dialogs a live contract opens — Figma OV 03.2 through
 * OV 03.23R2. Everything here is what the frames print.
 */

export interface Bilingual {
  en: string;
  ar: string;
}

const t = (en: string, ar: string): Bilingual => ({ en, ar });

/** OV 03.2 / 03.2C / 03.2L — the drawer that activates the contract. */
export const activateDrawer = {
  overline: t(
    "MAKKAH ANNUAL BLOCK · AL NOOR MAKKAH HOTEL",
    "حصة مكة السنوية · فندق النور مكة"
  ),
  title: t("Review & activate", "المراجعة والتفعيل"),
  body: t(
    "Everything below goes live the moment you confirm. Hoteliana does not approve supply contracts.",
    "كل ما في الأسفل يعمل لحظة تأكيدك. وهوتيليانا لا تعتمد عقود التوريد."
  ),
  rows: [
    {
      label: t("1 · Contract basics", "١ · أساسيات العقد"),
      value: t(
        "01 Sep 2026 - 31 Aug 2027 · Allotment / Block · SAR · Thu · Fri weekend",
        "١ سبتمبر ٢٠٢٦ - ٣١ أغسطس ٢٠٢٧ · حصة مخصّصة · SAR · نهاية الأسبوع الخميس والجمعة"
      ),
    },
    {
      label: t("2 · Pricing model & base", "٢ · نموذج التسعير والأساس"),
      value: t(
        "Standard Room · Room Only · 400 / 500 SAR",
        "غرفة ستاندرد · بدون وجبات · ٤٠٠ / ٥٠٠ ر.س"
      ),
    },
    {
      label: t("3 · Rooms", "٣ · الغرف"),
      value: t(
        "Standard 400 / 500 · Deluxe City 560 / 720 · Deluxe Haram 700 / 880",
        "ستاندرد ٤٠٠ / ٥٠٠ · ديلوكس المدينة ٥٦٠ / ٧٢٠ · ديلوكس الحرم ٧٠٠ / ٨٨٠"
      ),
    },
    {
      label: t("5 · Meal plans", "٥ · خطط الوجبات"),
      value: t(
        "R/O · B&B +45 pp · H-B +90 pp",
        "بدون وجبات · إفطار +٤٥ للفرد · نصف إقامة +٩٠ للفرد"
      ),
    },
    {
      label: t("6 · Inventory", "٦ · المخزون"),
      value: t(
        "Shared pool 50 rooms a night · City View capped at 12 · Allotment · Overbooking +2",
        "مخزون مشترك ٥٠ غرفة ليلًا · إطلالة المدينة بحد ١٢ · حصة مخصّصة · حجز زائد +٢"
      ),
    },
    {
      label: t("7 · Rate seasons", "٧ · مواسم الأسعار"),
      value: t(
        "4 seasons · 103 nights · base rate on 262 nights",
        "٤ مواسم · ١٠٣ ليالٍ · السعر الأساسي على ٢٦٢ ليلة"
      ),
    },
    {
      label: t("8 · Restrictions", "٨ · القيود"),
      value: t("3 restrictions · 2 active", "٣ قيود · اثنان فعّالان"),
    },
    {
      label: t("9 · Policies", "٩ · السياسات"),
      value: t(
        "Free until 7 d · 3-7 d 1 night · < 3 d 100% · release 3 d 18:00 · SLA 30 min",
        "مجاني حتى ٧ أيام · ٣-٧ أيام ليلة · أقل من ٣ أيام ١٠٠٪ · إفراج ٣ أيام ١٨:٠٠ · مهلة ٣٠ دقيقة"
      ),
    },
  ],
  acknowledgement: t(
    "I confirm these rates, stock and rules on behalf of Jewar Al-Safwah. Confirmed bookings under this contract are contractually binding.",
    "أؤكد هذه الأسعار والمخزون والقواعد نيابةً عن جوار الصفوة. والحجوزات المؤكدة بموجب هذا العقد مُلزِمة تعاقديًا."
  ),
  cancel: t("Back to editing", "العودة إلى التحرير"),
  confirm: t("Activate contract", "تفعيل العقد"),
  working: t("Activating…", "جارٍ التفعيل…"),
};

/** OV 03.3C — what two held changes do once they are published. */
export const publishDrawer = {
  overline: t("MAKKAH ANNUAL BLOCK · VERSION 1.3", "حصة مكة السنوية · الإصدار ١.٣"),
  title: t("Review & publish 2 changes", "مراجعة ونشر تعديلين"),
  body: t(
    "Operational changes only - the version stays 1.3. Live for agents the moment you publish.",
    "تعديلات تشغيلية فقط - ويبقى الإصدار ١.٣. وتعمل للوكلاء لحظة نشرك."
  ),
  head: [
    t("Change", "التعديل"),
    t("Before", "قبل"),
    t("After", "بعد"),
    t("Effect", "الأثر"),
  ],
  rows: [
    [
      t("Base room · weekday cost", "الغرفة الأساس · سعر أيام الأسبوع"),
      t("400 SAR", "٤٠٠ ر.س"),
      t("420 SAR", "٤٢٠ ر.س"),
      t("New bookings only · 262 base nights", "الحجوزات الجديدة فقط · ٢٦٢ ليلة أساسية"),
    ],
    [
      t("Bookings re-priced", "حجوزات أُعيد تسعيرها"),
      t("", ""),
      t("0", "٠"),
      t("Confirmed bookings keep their price", "الحجوزات المؤكدة تحتفظ بسعرها"),
    ],
    [
      t("Nights affected", "الليالي المتأثرة"),
      t("", ""),
      t("263", "٢٦٣"),
      t("262 base nights + 1 stop sale", "٢٦٢ ليلة أساسية + ليلة إيقاف بيع"),
    ],
    [
      t("Restriction conflicts", "تعارضات القيود"),
      t("", ""),
      t("None", "لا شيء"),
      t(
        "Checked against the contract’s Restrictions",
        "فُحصت مقابل قيود العقد"
      ),
    ],
  ],
  acknowledgement: t(
    "Publish these changes now. They are recorded in Activity with my user and time.",
    "انشر هذه التعديلات الآن. وتُسجَّل في النشاط باسمي ووقتي."
  ),
  cancel: t("Back to editing", "العودة إلى التحرير"),
  confirm: t("Publish changes", "نشر التعديلات"),
};

/** OV 03.3A — every version and every change, with who and when. */
export const activityDrawer = {
  overline: t(
    "MAKKAH ANNUAL BLOCK · AL NOOR MAKKAH HOTEL",
    "حصة مكة السنوية · فندق النور مكة"
  ),
  title: t("Activity & versions", "النشاط والإصدارات"),
  body: t(
    "Every publish, amendment and rule change, with who and when. A booking keeps the version in force at confirmation.",
    "كل نشر وتعديل وتغيير قاعدة، بمن ومتى. ويحتفظ الحجز بالإصدار الساري عند تأكيده."
  ),
  versionsLabel: t("VERSIONS", "الإصدارات"),
  versionsHead: [
    t("Version", "الإصدار"),
    t("Effective", "السريان"),
    t("Status", "الحالة"),
    t("By", "بواسطة"),
  ],
  versions: [
    [
      t("v1.4 · draft", "v1.4 · مسودة"),
      t("from 01 Oct 2026", "من ١ أكتوبر ٢٠٢٦"),
      t("Amending", "قيد التعديل"),
      t("Abdullrahman Najeh", "عبدالرحمن ناجح"),
    ],
    [
      t("v1.3", "v1.3"),
      t("01 Sep 2026 - 31 Aug 2027", "١ سبتمبر ٢٠٢٦ - ٣١ أغسطس ٢٠٢٧"),
      t("Active", "نشط"),
      t("Supplier Admin", "مدير المورّد"),
    ],
    [
      t("v1.2", "v1.2"),
      t("01 Mar - 31 Aug 2026", "١ مارس - ٣١ أغسطس ٢٠٢٦"),
      t("Superseded", "مستبدل"),
      t("Supplier Admin", "مدير المورّد"),
    ],
    [
      t("v1.0", "v1.0"),
      t("28 Aug 2025 - 29 Feb 2026", "٢٨ أغسطس ٢٠٢٥ - ٢٩ فبراير ٢٠٢٦"),
      t("Superseded", "مستبدل"),
      t("Supplier Admin", "مدير المورّد"),
    ],
  ],
  activityLabel: t("ACTIVITY", "النشاط"),
  activity: [
    {
      day: t("16 Sep", "١٦ سبتمبر"),
      time: t("10:12", "١٠:١٢"),
      title: t("Stay restriction added", "أُضيف قيد إقامة"),
      detail: t(
        "Closed to arrival · Hajj · Fridays - none → Closed",
        "مغلق للوصول · الحج · الجمعة - لا شيء ← مغلق"
      ),
      meta: t(
        "Sara Al-Otaibi · Manual · v1.3 · PUB-20260908-0019",
        "سارة العتيبي · يدوي · v1.3 · PUB-20260908-0019"
      ),
    },
    {
      day: t("15 Sep", "١٥ سبتمبر"),
      time: t("09:40", "٠٩:٤٠"),
      title: t("Night stopped · Rates & Availability", "أُوقفت ليلة · الأسعار والإتاحة"),
      detail: t(
        "14 Sep · Standard Room - Open → Stop sale (sold out)",
        "١٤ سبتمبر · غرفة ستاندرد - مفتوح ← إيقاف بيع (نفد)"
      ),
      meta: t(
        "Abdullrahman Najeh · Manual · v1.3 · PUB-20260908-0018",
        "عبدالرحمن ناجح · يدوي · v1.3 · PUB-20260908-0018"
      ),
    },
    {
      day: t("13 Sep", "١٣ سبتمبر"),
      time: t("18:42", "١٨:٤٢"),
      title: t("Prices published", "نُشرت الأسعار"),
      detail: t(
        "Base weekday 380 → 400 · Triple occupancy extra 90 → 100",
        "أيام الأسبوع الأساسي ٣٨٠ ← ٤٠٠ · إضافة الإشغال الثلاثي ٩٠ ← ١٠٠"
      ),
      meta: t(
        "Supplier Admin · Bulk · v1.3 · PUB-20260908-0017",
        "مدير المورّد · جماعي · v1.3 · PUB-20260908-0017"
      ),
    },
    {
      day: t("01 Sep", "١ سبتمبر"),
      time: t("08:00", "٠٨:٠٠"),
      title: t("Amendment effective", "سريان التعديل"),
      detail: t("Contract version v1.2 → v1.3", "إصدار العقد v1.2 ← v1.3"),
      meta: t("System · System · v1.3", "النظام · النظام · v1.3"),
    },
    {
      day: t("28 Aug", "٢٨ أغسطس"),
      time: t("14:05", "١٤:٠٥"),
      title: t("Contract activated", "فُعّل العقد"),
      detail: t("Status Draft → Active", "الحالة مسودة ← نشط"),
      meta: t(
        "Abdullrahman Najeh · Manual · v1.0 · PUB-20260908-001",
        "عبدالرحمن ناجح · يدوي · v1.0 · PUB-20260908-001"
      ),
    },
  ],
  note: t(
    "Bookings snapshot the contract version, cancellation tiers, release and SLA in force when they were confirmed - later edits never touch them. Finance settles each booking on its own snapshot.",
    "تلتقط الحجوزات صورة من إصدار العقد وشرائح الإلغاء والإفراج والمهلة السارية عند تأكيدها - ولا تمسّها التعديلات اللاحقة. وتسوّي المالية كل حجز على صورته."
  ),
  close: t("Close", "إغلاق"),
};

export interface LifecycleDialog {
  overline: Bilingual;
  title: Bilingual;
  body: Bilingual;
  listLabel?: Bilingual;
  points?: Bilingual[];
  cancel: Bilingual;
  confirm: Bilingual;
  /** The tile beside the title. */
  tone: "brand" | "danger";
  /** What the confirm button is, which is not always the same thing. */
  confirmTone: "default" | "destructive" | "warning";
}

/** OV 03.3D — held changes were never live, so nothing is lost outside. */
export const discardDialog: LifecycleDialog = {
  overline: t("EDIT MODE · 2 CHANGES HELD", "وضع التعديل · تعديلان محجوزان"),
  title: t("Discard the 2 held changes?", "هل تتجاهل التعديلين المحجوزين؟"),
  body: t(
    "The contract stays exactly as published (v1.3). Nothing was live, so agents notice nothing.",
    "يبقى العقد كما نُشر تمامًا (v1.3). ولم يكن شيء يعمل، فلا يلاحظ الوكلاء شيئًا."
  ),
  cancel: t("Keep editing", "متابعة التحرير"),
  confirm: t("Discard changes", "تجاهل التعديلات"),
  tone: "danger",
  confirmTone: "destructive",
};

/** OV 03.18 — pause hides the contract; it does not stop the bookings. */
export const pauseDialog: LifecycleDialog = {
  overline: t("MAKKAH ANNUAL BLOCK · ACTIVE", "حصة مكة السنوية · نشط"),
  title: t("Pause this contract?", "هل توقف هذا العقد مؤقتًا؟"),
  body: t(
    "Agents stop seeing it immediately. Reversible any time.",
    "يتوقف الوكلاء عن رؤيته فورًا. وقابل للتراجع في أي وقت."
  ),
  listLabel: t("WHAT PAUSE MEANS", "ماذا يعني الإيقاف المؤقت"),
  points: [
    t(
      "Existing bookings are unaffected - 23 confirmed stays are honoured as booked.",
      "الحجوزات القائمة غير متأثرة - وتُحترم ٢٣ إقامة مؤكدة كما حُجزت."
    ),
    t(
      "On Request bookings already waiting keep their SLA; new requests are blocked.",
      "الطلبات المنتظرة تحتفظ بمهلتها؛ والطلبات الجديدة موقوفة."
    ),
    t(
      "Resume restores every night to exactly its state before the pause: prices, stock, stop-sells and rules.",
      "والاستئناف يعيد كل ليلة إلى حالتها تمامًا قبل الإيقاف: الأسعار والمخزون وإيقاف البيع والقواعد."
    ),
    t(
      "Different from Stop sale: a stopped contract stays visible; a paused one is hidden.",
      "ويختلف عن إيقاف البيع: فالعقد الموقوف بيعه يبقى ظاهرًا، والموقوف مؤقتًا مخفي."
    ),
  ],
  cancel: t("Cancel", "إلغاء"),
  confirm: t("Pause contract", "إيقاف العقد مؤقتًا"),
  tone: "brand",
  confirmTone: "warning",
};

/** OV 03.21 — terminate closes the contract for good. */
export const terminateDialog: LifecycleDialog = {
  overline: t("MAKKAH ANNUAL BLOCK · ACTIVE", "حصة مكة السنوية · نشط"),
  title: t("Terminate this contract?", "هل تنهي هذا العقد؟"),
  body: t(
    "Irreversible. The contract closes today and can never be resumed or amended.",
    "غير قابل للتراجع. يُغلق العقد اليوم ولا يمكن استئنافه ولا تعديله أبدًا."
  ),
  points: [
    t(
      "23 confirmed bookings are still honoured to check-out - Hoteliana and the agents are notified.",
      "٢٣ حجزًا مؤكدًا تُحترم حتى المغادرة - وتُبلَّغ هوتيليانا والوكلاء."
    ),
    t(
      "6 On Request bookings waiting are handed to Hoteliana.",
      "٦ طلبات منتظرة تُسلَّم إلى هوتيليانا."
    ),
    t(
      "Rooms, seasons and rules stay readable for records; nothing can be sold.",
      "تبقى الغرف والمواسم والقواعد قابلة للقراءة للسجلات؛ ولا يمكن بيع شيء."
    ),
  ],
  cancel: t("Cancel", "إلغاء"),
  confirm: t("Terminate contract", "إنهاء العقد"),
  tone: "danger",
  confirmTone: "destructive",
};

export const terminateReason = {
  label: t("Reason", "السبب"),
  value: t("Hotel relationship ended", "انتهت العلاقة مع الفندق"),
  typedLabel: t("Type TERMINATE to confirm", "اكتب TERMINATE للتأكيد"),
  typed: "TERMINATE",
};

export const pauseReason = {
  label: t("Reason · optional", "السبب · اختياري"),
  placeholder: t("e.g. renovation on floors 3-4", "مثال: ترميم الطابقين ٣-٤"),
};

/** OV 03.22 — a commercial change makes a new version, not an edit. */
export const amendDialog = {
  overline: t("MAKKAH ANNUAL BLOCK · V1.3 → V1.4", "حصة مكة السنوية · V1.3 ← V1.4"),
  title: t("Amend the commercial contract", "تعديل العقد التجاري"),
  body: t(
    "Term, type or currency change = a new version with an effective-from date. Prices, stock and rules are edited elsewhere, not here.",
    "تغيير المدة أو النوع أو العملة = إصدار جديد بتاريخ سريان. أما الأسعار والمخزون والقواعد فتُحرَّر في مكان آخر، لا هنا."
  ),
  effectiveLabel: t("Effective from", "ساري من"),
  effectiveValue: t("01 Oct 2026", "١ أكتوبر ٢٠٢٦"),
  effectiveHint: t(
    "v1.3 keeps selling until this date.",
    "يستمر v1.3 في البيع حتى هذا التاريخ."
  ),
  changesLabel: t("What changes", "ما الذي يتغيّر"),
  changesValue: t("Term · Type · Currency", "المدة · النوع · العملة"),
  fields: [
    {
      label: t("Contract term", "مدة العقد"),
      value: t("New end date", "تاريخ نهاية جديد"),
    },
    {
      label: t("New end date", "تاريخ النهاية الجديد"),
      value: t("30 Sep 2027", "٣٠ سبتمبر ٢٠٢٧"),
    },
    {
      label: t("Currency", "العملة"),
      value: t("SAR · unchanged", "SAR · دون تغيير"),
    },
  ],
  points: [
    t(
      "Bookings confirmed before 01 Oct keep v1.3 - their snapshot never changes.",
      "الحجوزات المؤكدة قبل ١ أكتوبر تحتفظ بـv1.3 - ولا تتغيّر صورتها أبدًا."
    ),
    t(
      "New bookings from 01 Oct use v1.4. Both versions stay in Activity & versions.",
      "والحجوزات الجديدة من ١ أكتوبر تستخدم v1.4. ويبقى الإصداران في النشاط والإصدارات."
    ),
    t(
      "Finance settles each booking on the version it was confirmed under.",
      "وتسوّي المالية كل حجز على الإصدار الذي أُكّد بموجبه."
    ),
  ],
  cancel: t("Cancel", "إلغاء"),
  confirm: t("Start amendment · v1.4 draft", "بدء التعديل · مسودة v1.4"),
};

/** OV 03.23R / R2 — answering one request inside its SLA. */
export const answerDialog = {
  overline: t(
    "HTL-9241 · AL RAJHI TRAVEL · 04:50 LEFT",
    "HTL-9241 · الراجحي للسفر · بقي ٠٤:٥٠"
  ),
  title: t("Answer the request", "الرد على الطلب"),
  body: t(
    "Standard Room · Room Only · 13 - 16 Sep · 3 nights · 2 adults · 1,200 SAR supplier cost.",
    "غرفة ستاندرد · بدون وجبات · ١٣ - ١٦ سبتمبر · ٣ ليالٍ · بالغان · تكلفة المورّد ١٬٢٠٠ ر.س."
  ),
  decisionLabel: t("Decision", "القرار"),
  confirmOption: t("Confirm", "تأكيد"),
  declineOption: t("Decline", "رفض"),
  referenceLabel: t(
    "Supplier confirmation number · optional",
    "رقم تأكيد المورّد · اختياري"
  ),
  referencePlaceholder: t(
    "Add now or later (Reference pending)",
    "أضفه الآن أو لاحقًا (المرجع معلّق)"
  ),
  reasonLabel: t("Decline reason", "سبب الرفض"),
  reasonPlaceholder: t("Select a reason", "اختر سببًا"),
  declineNote: t(
    "Declining releases the request immediately and the agent is told. Nothing is held, and the night keeps the stock and status it had - a decline is not a stop sale.",
    "الرفض يحرّر الطلب فورًا ويُبلَّغ الوكيل. ولا يُحجز شيء، وتحتفظ الليلة بمخزونها وحالتها - فالرفض ليس إيقاف بيع."
  ),
  cancel: t("Cancel", "إلغاء"),
  confirm: t("Send answer", "إرسال الرد"),
};
