import type { BlockerCode } from "./blockers";

export type BlockerOwner = "supplier" | "hoteliana" | "structural";
export type IncidentState = "none" | "underReview" | "closed";

export interface SellPause {
  id: string;
  scope: string; scopeAr: string;
  covers: string; coversAr: string;
  since: string; sinceAr: string;
  blocked: string; blockedAr: string;
  setBy: string; setByAr: string;
}

/** UI 10.4 — every pause Hoteliana has on a scope, widest first. */
export const activePauses: SellPause[] = [
  { id:"PAU-1042", scope:"Contract", scopeAr:"عقد", covers:"Umrah Q3 · Swissôtel Al Maqam · all rooms", coversAr:"عمرة الربع الثالث · سويس أوتيل المقام · كل الغرف", since:"12 Sep 2026", sinceAr:"١٢ سبتمبر ٢٠٢٦", blocked:"All dates in term", blockedAr:"كل تواريخ المدة", setBy:"Hoteliana · Operations", setByAr:"هوتيليانا · العمليات" },
  { id:"PAU-1048", scope:"Hotel", scopeAr:"فندق", covers:"Hilton Madinah · every contract on this hotel", coversAr:"هيلتون المدينة · كل عقود هذا الفندق", since:"14 Sep 2026", sinceAr:"١٤ سبتمبر ٢٠٢٦", blocked:"All dates", blockedAr:"كل التواريخ", setBy:"Hoteliana · Compliance", setByAr:"هوتيليانا · الالتزام" },
  { id:"PAU-1051", scope:"Room", scopeAr:"غرفة", covers:"Deluxe Room · HB · Makkah Annual Block", coversAr:"غرفة ديلوكس · نصف إقامة · حصة مكة السنوية", since:"15 Sep 2026", sinceAr:"١٥ سبتمبر ٢٠٢٦", blocked:"01 - 15 Nov 2026", blockedAr:"١ - ١٥ نوفمبر ٢٠٢٦", setBy:"Hoteliana · Operations", setByAr:"هوتيليانا · العمليات" },
];

export const pauseStats = [
  { label:"Pauses active now", labelAr:"إيقافات فعّالة الآن", value:"3", note:"across 3 scopes", noteAr:"على ٣ نطاقات" },
  { label:"Rooms not sellable", labelAr:"غرف لا تُباع", value:"18", note:"because of a pause", noteAr:"بسبب إيقاف" },
  { label:"Nights affected", labelAr:"ليالٍ متأثرة", value:"412", note:"in the next 90 days", noteAr:"خلال ٩٠ يومًا القادمة" },
  { label:"Longest pause", labelAr:"أطول إيقاف", value:"since 12 Sep 2026", note:"Umrah Q3", noteAr:"عمرة الربع الثالث" },
];

export interface Blocker {
  /**
   * §0.7 - the code is the join to `blockers.ts`. The table there owns what
   * a code means and how it is cleared; this row owns only what it affects.
   */
  code: BlockerCode;
  owner: BlockerOwner;
  name: string; nameAr: string;
  affects: string; affectsAr: string;
  why: string; whyAr: string;
  nights: string; nightsAr: string;
  since: string; sinceAr: string;
  fix: string; fixAr: string;
}

/** UI 10.5 — the Sellability Blocker Engine, grouped by who can clear it. */
export const blockers: Blocker[] = [
  { code:"NO_RATE", owner:"supplier", name:"No price set", nameAr:"لا سعر محدد", affects:"Deluxe Room · B&B · Makkah Annual Block", affectsAr:"غرفة ديلوكس · مع الإفطار · حصة مكة السنوية", why:"No price exists for these nights", whyAr:"لا سعر لهذه الليالي", nights:"12 - 20 Nov · 9", nightsAr:"١٢ - ٢٠ نوفمبر · ٩", since:"2 days", sinceAr:"يومان", fix:"Open rates", fixAr:"فتح الأسعار" },
  { code:"NO_INVENTORY", owner:"supplier", name:"No rooms left", nameAr:"لا غرف متبقية", affects:"Standard Room · RO · Makkah Annual Block", affectsAr:"غرفة قياسية · بدون وجبات · حصة مكة السنوية", why:"Stock is 0 on these nights", whyAr:"المخزون صفر في هذه الليالي", nights:"03 - 09 Dec · 7", nightsAr:"٣ - ٩ ديسمبر · ٧", since:"5 days", sinceAr:"٥ أيام", fix:"Open inventory", fixAr:"فتح المخزون" },
  { code:"STOP_SALE", owner:"supplier", name:"Stopped by you", nameAr:"أوقفته أنت", affects:"Standard Room · all meal plans", affectsAr:"غرفة قياسية · كل خطط الوجبات", why:"You stopped the sale yourself", whyAr:"أوقفت البيع بنفسك", nights:"01 - 31 Oct · 31", nightsAr:"١ - ٣١ أكتوبر · ٣١", since:"11 days", sinceAr:"١١ يومًا", fix:"Lift stop sale", fixAr:"رفع إيقاف البيع" },
  { code:"RELEASE_PASSED", owner:"supplier", name:"Release date passed", nameAr:"انقضى تاريخ الإتاحة", affects:"Deluxe Room · HB · Umrah Q3", affectsAr:"غرفة ديلوكس · نصف إقامة · عمرة الربع الثالث", why:"Release date passed - stock went back to the hotel", whyAr:"انقضى تاريخ الإتاحة - وعاد المخزون إلى الفندق", nights:"22 - 26 Sep · 5", nightsAr:"٢٢ - ٢٦ سبتمبر · ٥", since:"today", sinceAr:"اليوم", fix:"Open release & cut-off", fixAr:"فتح الإتاحة والإغلاق" },
  { code:"RESTRICTION_FAILED", owner:"supplier", name:"A restriction blocks it", nameAr:"قيد يمنعه", affects:"All rooms · Makkah Annual Block", affectsAr:"كل الغرف · حصة مكة السنوية", why:"MinLOS 3 - one and two-night stays cannot book", whyAr:"حد أدنى ٣ ليالٍ - لا تُحجز إقامة ليلة أو ليلتين", nights:"01 - 30 Nov · 30", nightsAr:"١ - ٣٠ نوفمبر · ٣٠", since:"1 day", sinceAr:"يوم واحد", fix:"Open restrictions", fixAr:"فتح القيود" },
  { code:"NOT_ON_CONTRACT", owner:"supplier", name:"Not on the contract", nameAr:"ليست على العقد", affects:"Deluxe Room · HB · Haram View · Makkah Annual Block", affectsAr:"غرفة ديلوكس · نصف إقامة · إطلالة الحرم · حصة مكة السنوية", why:"This room isn't offered with this meal / view on the contract", whyAr:"هذه الغرفة غير معروضة بهذه الوجبة أو الإطلالة على العقد", nights:"All dates", nightsAr:"كل التواريخ", since:"3 days", sinceAr:"٣ أيام", fix:"Open Rooms", fixAr:"فتح الغرف" },
  { code:"BOOKING_WINDOW_CLOSED", owner:"supplier", name:"Booking window closed", nameAr:"نافذة الحجز مغلقة", affects:"All rooms · Umrah Q3", affectsAr:"كل الغرف · عمرة الربع الثالث", why:"Stay dates open only 120 days ahead", whyAr:"تفتح تواريخ الإقامة قبل ١٢٠ يومًا فقط", nights:"after 13 Jan 2027", nightsAr:"بعد ١٣ يناير ٢٠٢٧", since:"-", sinceAr:"-", fix:"Open booking window", fixAr:"فتح نافذة الحجز" },

  { code:"HOTELIANA_PAUSED", owner:"hoteliana", name:"Paused by Hoteliana", nameAr:"أوقفته هوتيليانا", affects:"Umrah Q3 · Swissôtel Al Maqam", affectsAr:"عمرة الربع الثالث · سويس أوتيل المقام", why:"Hoteliana paused new bookings on this contract", whyAr:"أوقفت هوتيليانا الحجوزات الجديدة على هذا العقد", nights:"All dates in term", nightsAr:"كل تواريخ المدة", since:"3 days", sinceAr:"٣ أيام", fix:"Open the pause", fixAr:"فتح الإيقاف" },
  { code:"HOTELIANA_PAUSED", owner:"hoteliana", name:"Paused by Hoteliana", nameAr:"أوقفته هوتيليانا", affects:"Hilton Madinah · every contract", affectsAr:"هيلتون المدينة · كل العقود", why:"Hotel-level pause - wider than the room pause", whyAr:"إيقاف على مستوى الفندق - أوسع من إيقاف الغرفة", nights:"All dates", nightsAr:"كل التواريخ", since:"1 day", sinceAr:"يوم واحد", fix:"Open the pause", fixAr:"فتح الإيقاف" },
  { code:"ACCESS_NOT_APPROVED", owner:"hoteliana", name:"Hotel access not approved yet", nameAr:"لم يُعتمد وصولك للفندق بعد", affects:"Conrad Makkah · all rooms", affectsAr:"كونراد مكة · كل الغرف", why:"Your access to this hotel is still under review", whyAr:"وصولك إلى هذا الفندق ما زال قيد المراجعة", nights:"All dates", nightsAr:"كل التواريخ", since:"6 days", sinceAr:"٦ أيام", fix:"Open the request", fixAr:"فتح الطلب" },
  { code:"ROOM_NOT_MAPPED", owner:"hoteliana", name:"Room is not mapped yet", nameAr:"الغرفة غير مربوطة بعد", affects:"Executive Suite · Hilton Makkah", affectsAr:"الجناح التنفيذي · هيلتون مكة", why:"The room is not mapped to the hotel library yet", whyAr:"الغرفة غير مربوطة بمكتبة الفندق بعد", nights:"All dates", nightsAr:"كل التواريخ", since:"9 days", sinceAr:"٩ أيام", fix:"Follow up", fixAr:"المتابعة" },
  { code:"MORE_INFO_REQUIRED", owner:"hoteliana", name:"More information needed", nameAr:"مطلوب معلومات إضافية", affects:"Every contract on Hilton Madinah", affectsAr:"كل عقد على هيلتون المدينة", why:"Hoteliana is waiting for two corrections from you", whyAr:"تنتظر هوتيليانا تصحيحين منك", nights:"All dates", nightsAr:"كل التواريخ", since:"4 days", sinceAr:"٤ أيام", fix:"Open the request", fixAr:"فتح الطلب" },

  { code:"OUTSIDE_CONTRACT_TERM", owner:"structural", name:"Night is outside the contract term", nameAr:"الليلة خارج مدة العقد", affects:"Makkah Annual Block · all rooms", affectsAr:"حصة مكة السنوية · كل الغرف", why:"Stay dates fall after the contract end date", whyAr:"تقع تواريخ الإقامة بعد تاريخ نهاية العقد", nights:"after 31 Dec 2026", nightsAr:"بعد ٣١ ديسمبر ٢٠٢٦", since:"-", sinceAr:"-", fix:"Renew the term", fixAr:"تجديد المدة" },
  { code:"CONTRACT_EXPIRED", owner:"structural", name:"Contract has ended", nameAr:"انتهى العقد", affects:"Ramadan 2026 · Pullman ZamZam", affectsAr:"رمضان ٢٠٢٦ · بولمان زمزم", why:"The term ended on its own date", whyAr:"انتهت المدة في تاريخها", nights:"All dates", nightsAr:"كل التواريخ", since:"92 days", sinceAr:"٩٢ يومًا", fix:"Renew for a new period", fixAr:"التجديد لفترة جديدة" },
  { code:"CONTRACT_TERMINATED", owner:"structural", name:"Contract was terminated", nameAr:"أُنهي العقد", affects:"Jeddah Corporate 2026", affectsAr:"جدة للشركات ٢٠٢٦", why:"Ended early, permanently", whyAr:"أُنهي مبكرًا ونهائيًا", nights:"All dates", nightsAr:"كل التواريخ", since:"-", sinceAr:"-", fix:"Open the contract", fixAr:"فتح العقد" },
  { code:"CONFIRMATION_MODE_INVALID", owner:"structural", name:"Confirmation mode does not match", nameAr:"وضع التأكيد غير مطابق", affects:"Umrah Q3 · On Request bookings", affectsAr:"عمرة الربع الثالث · حجوزات عند الطلب", why:"On Request SLA is not set, so nothing can be answered in time", whyAr:"لم تُضبط مهلة «عند الطلب»، فلا يمكن الرد في الوقت", nights:"All dates", nightsAr:"كل التواريخ", since:"2 days", sinceAr:"يومان", fix:"Open confirmation", fixAr:"فتح التأكيد" },
  { code:"SUPPLIER_HOTEL_INACTIVE", owner:"structural", name:"Hotel is not active with you", nameAr:"الفندق غير فعّال معك", affects:"Novotel Thakher · all contracts", affectsAr:"نوفوتيل ثاخر · كل العقود", why:"The hotel relationship is no longer active", whyAr:"لم تعد العلاقة مع الفندق فعّالة", nights:"All dates", nightsAr:"كل التواريخ", since:"15 days", sinceAr:"١٥ يومًا", fix:"Open the hotel", fixAr:"فتح الفندق" },
];

export type ContractExceptionState = "ending" | "ended" | "paused" | "terminated";
export interface ContractExceptionView {
  name: string; nameAr: string;
  pill: string; pillAr: string;
  meta: string; metaAr: string;
  actions: Array<{ label: string; labelAr: string; primary?: boolean }>;
  title: string; titleAr: string;
  body: string; bodyAr: string;
  cardTitle: string; cardTitleAr: string;
  lines: Array<{ mark: "yes" | "no" | "info"; text: string; textAr: string }>;
}

/** UI 10.0 – 10.3 — a contract's four exception states. */
export const contractExceptions: Record<ContractExceptionState, ContractExceptionView> = {
  ending: {
    name:"Makkah Annual Block", nameAr:"حصة مكة السنوية",
    pill:"Active · ends in 28 days", pillAr:"فعّال · ينتهي خلال ٢٨ يومًا",
    meta:"Hilton Makkah · Term 01 Jan 2026 → 31 Dec 2026 · SAR", metaAr:"هيلتون مكة · المدة ١ يناير ٢٠٢٦ ← ٣١ ديسمبر ٢٠٢٦ · ر.س",
    actions:[{label:"Renew for a new period",labelAr:"التجديد لفترة جديدة",primary:true},{label:"Follow up with Hoteliana",labelAr:"المتابعة مع هوتيليانا"}],
    title:"This contract ends on 31 Dec 2026 - 28 days from today.", titleAr:"ينتهي هذا العقد في ٣١ ديسمبر ٢٠٢٦ - بعد ٢٨ يومًا من اليوم.",
    body:"Nothing stops now. You keep managing hotels, rates, inventory and bookings exactly as before. What the system will not do is sell stay dates after 31 Dec 2026 - those nights are not sellable even where a rate and inventory exist.",
    bodyAr:"لا يتوقف شيء الآن. تواصل إدارة الفنادق والأسعار والمخزون والحجوزات تمامًا كما كنت. وما لن يفعله النظام هو بيع تواريخ إقامة بعد ٣١ ديسمبر ٢٠٢٦ - فتلك الليالي غير قابلة للبيع حتى مع وجود سعر ومخزون.",
    cardTitle:"What changes on the end date, and what does not", cardTitleAr:"ما الذي يتغير في تاريخ النهاية وما الذي لا يتغير",
    lines:[
      {mark:"no",text:"New sales stop for stay dates after 31 Dec 2026.",textAr:"تتوقف المبيعات الجديدة لتواريخ الإقامة بعد ٣١ ديسمبر ٢٠٢٦."},
      {mark:"yes",text:"Confirmed bookings stay valid and fully serviceable.",textAr:"تبقى الحجوزات المؤكدة صالحة وقابلة للخدمة كاملةً."},
      {mark:"yes",text:"Cancellations, amendments and confirmation numbers continue.",textAr:"تستمر الإلغاءات والتعديلات وأرقام التأكيد."},
      {mark:"yes",text:"Statements, payments and entries continue.",textAr:"تستمر كشوف الحساب والدفعات والقيود."},
      {mark:"info",text:"Rates, inventory and restrictions become read-only for dates after the end date.",textAr:"تصبح الأسعار والمخزون والقيود للقراءة فقط للتواريخ بعد تاريخ النهاية."},
      {mark:"yes",text:"Everything you built stays saved - copy it into a new period in one step.",textAr:"يبقى كل ما بنيته محفوظًا - وتنسخه إلى فترة جديدة بخطوة واحدة."},
    ],
  },
  ended: {
    name:"Makkah Annual Block", nameAr:"حصة مكة السنوية",
    pill:"Expired", pillAr:"منتهٍ",
    meta:"Hilton Makkah · Term 01 Jan 2026 → 31 Dec 2026 · SAR", metaAr:"هيلتون مكة · المدة ١ يناير ٢٠٢٦ ← ٣١ ديسمبر ٢٠٢٦ · ر.س",
    actions:[{label:"Renew for a new period",labelAr:"التجديد لفترة جديدة",primary:true},{label:"Open statements",labelAr:"فتح كشوف الحساب"}],
    title:"This contract ended on 31 Dec 2026. New sales are closed - nothing else is.", titleAr:"انتهى هذا العقد في ٣١ ديسمبر ٢٠٢٦. المبيعات الجديدة مغلقة - ولا شيء سواها.",
    body:"Expiry stops new sales only. It never invalidates a confirmed booking, and it never deletes anything you built.",
    bodyAr:"لا يوقف الانتهاء إلا المبيعات الجديدة. ولا يُبطل حجزًا مؤكدًا أبدًا، ولا يحذف شيئًا مما بنيته.",
    cardTitle:"Still yours", cardTitleAr:"ما زال لك",
    lines:[
      {mark:"yes",text:"Confirmed bookings - open, service and answer them.",textAr:"الحجوزات المؤكدة - افتحها واخدمها وردّ عليها."},
      {mark:"yes",text:"Cancellations and amendments on existing bookings.",textAr:"الإلغاءات والتعديلات على الحجوزات القائمة."},
      {mark:"yes",text:"Confirmation numbers still go to the agent through you.",textAr:"ما زالت أرقام التأكيد تصل الوكيل عبرك."},
      {mark:"yes",text:"Statements, payments and entries.",textAr:"كشوف الحساب والدفعات والقيود."},
      {mark:"yes",text:"Historical rates, inventory and restrictions - visible, read-only.",textAr:"الأسعار والمخزون والقيود السابقة - ظاهرة للقراءة فقط."},
      {mark:"yes",text:"Renew the term, or copy everything into a new version.",textAr:"جدّد المدة أو انسخ كل شيء إلى نسخة جديدة."},
      {mark:"no",text:"New sales, for any stay date.",textAr:"المبيعات الجديدة لأي تاريخ إقامة."},
      {mark:"no",text:"Editing future rates, inventory and restrictions.",textAr:"تعديل الأسعار والمخزون والقيود المستقبلية."},
      {mark:"no",text:"Publishing changes.",textAr:"نشر التغييرات."},
    ],
  },
  paused: {
    name:"Umrah Q3", nameAr:"عمرة الربع الثالث",
    pill:"Paused by Hoteliana", pillAr:"موقوف من هوتيليانا",
    meta:"Swissôtel Al Maqam · Term 01 Jul 2026 → 30 Sep 2026 · SAR", metaAr:"سويس أوتيل المقام · المدة ١ يوليو ٢٠٢٦ ← ٣٠ سبتمبر ٢٠٢٦ · ر.س",
    actions:[{label:"Upload the signed confirmation",labelAr:"رفع التأكيد الموقّع",primary:true},{label:"Follow up with Hoteliana",labelAr:"المتابعة مع هوتيليانا"}],
    title:"Hoteliana paused new bookings on this contract.", titleAr:"أوقفت هوتيليانا الحجوزات الجديدة على هذا العقد.",
    body:"Reason given to you: \"Allotment confirmation from the hotel is out of date.\" Send the signed confirmation and Hoteliana lifts the pause. Paused since 12 Sep 2026. This is a sale block only - it is not a cancellation, not a deactivation, and nothing has been deleted.",
    bodyAr:"السبب المُبلَّغ لك: «تأكيد الحصة من الفندق قديم». أرسل التأكيد الموقّع وترفع هوتيليانا الإيقاف. موقوف منذ ١٢ سبتمبر ٢٠٢٦. وهذا حجب بيع فقط - ليس إلغاءً ولا تعطيلًا، ولم يُحذف شيء.",
    cardTitle:"What the pause does not do", cardTitleAr:"ما الذي لا يفعله الإيقاف",
    lines:[
      {mark:"yes",text:"Your rates are untouched.",textAr:"أسعارك كما هي."},
      {mark:"yes",text:"Your inventory is untouched.",textAr:"مخزونك كما هو."},
      {mark:"yes",text:"Confirmed bookings are untouched and still yours to service.",textAr:"الحجوزات المؤكدة كما هي وما زالت خدمتها عليك."},
      {mark:"yes",text:"Your account and your team are active.",textAr:"حسابك وفريقك فعّالان."},
      {mark:"yes",text:"Edit rates.",textAr:"تعديل الأسعار."},
      {mark:"yes",text:"Edit inventory.",textAr:"تعديل المخزون."},
      {mark:"yes",text:"Prepare changes for future dates.",textAr:"تجهيز تغييرات لتواريخ قادمة."},
      {mark:"yes",text:"Manage bookings - confirm, amend, cancel, send confirmation numbers.",textAr:"إدارة الحجوزات - تأكيد وتعديل وإلغاء وإرسال أرقام التأكيد."},
      {mark:"yes",text:"View finance, statements and entries.",textAr:"عرض المالية وكشوف الحساب والقيود."},
      {mark:"no",text:"Nothing you change goes on sale until Hoteliana lifts the pause.",textAr:"لا يُعرض شيء مما تغيّره للبيع حتى ترفع هوتيليانا الإيقاف."},
    ],
  },
  terminated: {
    name:"Jeddah Corporate 2026", nameAr:"جدة للشركات ٢٠٢٦",
    pill:"Terminated", pillAr:"مُنهى",
    meta:"Movenpick City Star · Term 01 Mar 2026 → 28 Feb 2027 · SAR", metaAr:"موفنبيك سيتي ستار · المدة ١ مارس ٢٠٢٦ ← ٢٨ فبراير ٢٠٢٧ · ر.س",
    actions:[{label:"Open statements",labelAr:"فتح كشوف الحساب",primary:true},{label:"Start a new contract with this hotel",labelAr:"بدء عقد جديد مع هذا الفندق"}],
    title:"This contract was ended early on 30 Sep 2026.", titleAr:"أُنهي هذا العقد مبكرًا في ٣٠ سبتمبر ٢٠٢٦.",
    body:"Reason recorded: \"Ended by agreement - hotel moved to a direct contract.\" Termination is permanent; the term will not resume. Confirmed bookings made before this date stay valid, including stay dates after it.",
    bodyAr:"السبب المسجّل: «أُنهي بالاتفاق - انتقل الفندق إلى عقد مباشر». والإنهاء دائم؛ ولن تُستأنف المدة. وتبقى الحجوزات المؤكدة قبل هذا التاريخ صالحة، بما فيها تواريخ الإقامة بعده.",
    cardTitle:"What termination does", cardTitleAr:"ما الذي يفعله الإنهاء",
    lines:[
      {mark:"no",text:"New sales stop from the termination date.",textAr:"تتوقف المبيعات الجديدة من تاريخ الإنهاء."},
      {mark:"no",text:"The contract cannot be resumed - a new contract is needed.",textAr:"لا يمكن استئناف العقد - ويلزم عقد جديد."},
      {mark:"yes",text:"Confirmed bookings stay valid, even for stay dates after the termination date.",textAr:"تبقى الحجوزات المؤكدة صالحة، حتى لتواريخ الإقامة بعد تاريخ الإنهاء."},
      {mark:"yes",text:"Cancellations, amendments and confirmation numbers continue on those bookings.",textAr:"تستمر الإلغاءات والتعديلات وأرقام التأكيد على تلك الحجوزات."},
      {mark:"yes",text:"Statements, payments and entries continue until the account is clear.",textAr:"تستمر كشوف الحساب والدفعات والقيود حتى يصفو الحساب."},
      {mark:"info",text:"Rates, inventory and restrictions become read-only.",textAr:"تصبح الأسعار والمخزون والقيود للقراءة فقط."},
    ],
  },
};

/** UI 10.0 — nights that have a rate and stock but sit outside the term. */
export const outsideTermNights = [
  { text:"Deluxe Room · B&B · 01 - 07 Jan 2027 · 7 nights · outside contract term", textAr:"غرفة ديلوكس · مع الإفطار · ١ - ٧ يناير ٢٠٢٧ · ٧ ليالٍ · خارج مدة العقد" },
  { text:"Standard Room · RO · 02 - 05 Jan 2027 · 3 nights · outside contract term", textAr:"غرفة قياسية · بدون وجبات · ٢ - ٥ يناير ٢٠٢٧ · ٣ ليالٍ · خارج مدة العقد" },
];

export type DetailState = "required" | "review" | "accepted" | "rejected";
export interface DetailVersion {
  version:string; note:string; noteAr:string; when:string; whenAr:string;
  state:"accepted"|"rejected"|"sent";
  /** OV 10.9B - the page itself, exactly as Hoteliana received it. */
  sent?:string; sentAr?:string;
  /** The written reason in full, for a version that came back rejected.
      The row carries the short form of it; this is the sentence. */
  reason?:string; reasonAr?:string;
}
export interface InformationRequest {
  id: string;
  name: string; nameAr: string;
  about: string; aboutAr: string;
  state: DetailState;
  stateNote: string; stateNoteAr: string;
  acceptedNote: string; acceptedNoteAr: string;
  /** `opens` names the panel a button leads to - "sent" is OV 10.9B. */
  actions: Array<{label:string;labelAr:string;primary?:boolean;opens?:"sent"}>;
  acceptedActions: Array<{label:string;labelAr:string;primary?:boolean;opens?:"sent"}>;
  versions: DetailVersion[];
  acceptedVersion?: DetailVersion;
}

/** UI 10.9 / 10.10 — what Hoteliana asked for about Hilton Madinah. */
export const informationRequests: InformationRequest[] = [
  {
    id:"REQ-ROOMS", name:"Room types you sell", nameAr:"أنواع الغرف التي تبيعها",
    about:"The hotel rooms your contracts sell · asked on 11 Sep 2026", aboutAr:"غرف الفندق التي تبيعها عقودك · طُلبت في ١١ سبتمبر ٢٠٢٦",
    state:"rejected", stateNote:"Rejected · needs correcting", stateNoteAr:"مرفوض · يحتاج تصحيحًا",
    acceptedNote:"Accepted 16 Sep 2026 · version 3", acceptedNoteAr:"قُبل ١٦ سبتمبر ٢٠٢٦ · النسخة ٣",
    actions:[{label:"Correct it",labelAr:"صحّحه",primary:true},{label:"See why",labelAr:"معرفة السبب",opens:"sent"}],
    acceptedActions:[{label:"View",labelAr:"عرض",opens:"sent"}],
    versions:[
      {version:"v2",note:"Rejected - Deluxe Haram View is not a hotel room",noteAr:"مرفوض - ديلوكس بإطلالة الحرم ليست غرفة فندق",when:"14 Sep · 16:10",whenAr:"١٤ سبتمبر · ١٦:١٠",state:"rejected",
        sent:"Standard Room · Deluxe City View · Deluxe Haram View",
        sentAr:"غرفة قياسية · ديلوكس بإطلالة المدينة · ديلوكس بإطلالة الحرم",
        reason:"Rejected because Deluxe Haram View is not in the hotel’s room list. Correct it from the request.",
        reasonAr:"رُفضت لأن «ديلوكس بإطلالة الحرم» ليست في قائمة غرف الفندق. صحّحها من الطلب."},
      {version:"v1",note:"Rejected - room names typed in Arabic only",noteAr:"مرفوض - أسماء الغرف مكتوبة بالعربية فقط",when:"12 Sep · 09:30",whenAr:"١٢ سبتمبر · ٠٩:٣٠",state:"rejected",
        /* Both languages read the same here, because one language is all
           that was sent - and that is the whole reason it came back. */
        sent:"غرفة قياسية · ديلوكس بإطلالة المدينة · ديلوكس بإطلالة الحرم",
        sentAr:"غرفة قياسية · ديلوكس بإطلالة المدينة · ديلوكس بإطلالة الحرم",
        reason:"Rejected because the room names were typed in Arabic only. Hoteliana matches them against the hotel’s English room list - send both.",
        reasonAr:"رُفضت لأن أسماء الغرف كُتبت بالعربية فقط. تطابقها هوتيليانا مع قائمة غرف الفندق بالإنجليزية - أرسلها بالاثنتين."},
    ],
    acceptedVersion:{version:"v3",note:"Accepted",noteAr:"مقبول",when:"16 Sep · 10:05",whenAr:"١٦ سبتمبر · ١٠:٠٥",state:"accepted",
      sent:"Standard Room · Deluxe City View",
      sentAr:"غرفة قياسية · ديلوكس بإطلالة المدينة"},
  },
  {
    id:"REQ-CONTACT", name:"Reservations contact for this hotel", nameAr:"جهة اتصال الحجوزات لهذا الفندق",
    about:"Who Hoteliana calls about a booking here · asked on 11 Sep 2026", aboutAr:"بمن تتصل هوتيليانا بشأن حجز هنا · طُلبت في ١١ سبتمبر ٢٠٢٦",
    state:"review", stateNote:"Under review", stateNoteAr:"قيد المراجعة",
    acceptedNote:"Accepted 15 Sep 2026", acceptedNoteAr:"قُبل ١٥ سبتمبر ٢٠٢٦",
    actions:[{label:"Edit",labelAr:"تعديل"},{label:"View",labelAr:"عرض",opens:"sent"}],
    acceptedActions:[{label:"Edit",labelAr:"تعديل"},{label:"View",labelAr:"عرض",opens:"sent"}],
    versions:[{version:"v1",note:"Sent - with Hoteliana since 13 Sep",noteAr:"أُرسل - لدى هوتيليانا منذ ١٣ سبتمبر",when:"13 Sep · 11:02",whenAr:"١٣ سبتمبر · ١١:٠٢",state:"sent",
      sent:"Reservations desk · Ahmed Saleh · +966 55 812 4477 · res.madinah@jewar.sa",
      sentAr:"مكتب الحجوزات · أحمد صالح · ٠٥٥ ٨١٢ ٤٤٧٧ · res.madinah@jewar.sa"}],
  },
  {
    id:"REQ-TIMES", name:"Check-in and check-out times", nameAr:"أوقات الدخول والمغادرة",
    about:"The times guests are told at this hotel · asked on 11 Sep 2026", aboutAr:"الأوقات التي تُبلَّغ للنزلاء في هذا الفندق · طُلبت في ١١ سبتمبر ٢٠٢٦",
    state:"required", stateNote:"Required", stateNoteAr:"مطلوب",
    acceptedNote:"Accepted 15 Sep 2026", acceptedNoteAr:"قُبل ١٥ سبتمبر ٢٠٢٦",
    actions:[{label:"Add them",labelAr:"أضفها",primary:true}],
    acceptedActions:[{label:"View",labelAr:"عرض"}],
    versions:[],
  },
];

/**
 * OV 10.9B - what you sent, kept whole.
 *
 * A rejection in the list gets one line, which answers what was wrong and
 * not what was written. The second question is the one a supplier asks
 * first, so the page is shown as it was received and the written reason
 * sits under it - under the page, never in place of it.
 */
export const sentCopy = {
  title:"What you sent · version {n}", titleAr:"ما أرسلته · النسخة {n}",
  download:"Download", downloadAr:"تنزيل",
  downloaded:"Version {n} downloaded", downloadedAr:"نُزّلت النسخة {n}",
};

export const acceptedDetails = [
  {name:"Hotel name and address, as you sell it",nameAr:"اسم الفندق وعنوانه كما تبيعه",when:"Accepted 04 Mar 2026",whenAr:"قُبل ٤ مارس ٢٠٢٦"},
  {name:"Meal plans you sell",nameAr:"خطط الوجبات التي تبيعها",when:"Accepted 04 Mar 2026",whenAr:"قُبل ٤ مارس ٢٠٢٦"},
  {name:"Child and extra-bed rules",nameAr:"قواعد الأطفال والسرير الإضافي",when:"Accepted 06 Mar 2026",whenAr:"قُبل ٦ مارس ٢٠٢٦"},
];

export interface CaseStep { title:string; titleAr:string; note:string; noteAr:string; when:string; whenAr:string; state:"done"|"active"|"waiting" }

/** UI 10.7 — the case while Hoteliana is deciding. */
export const incidentReviewCase: CaseStep[] = [
  {title:"You reported that you cannot honour it",titleAr:"أبلغت أنك لا تستطيع الوفاء به",note:"Reason: the hotel is overbooked",noteAr:"السبب: الفندق محجوز فوق طاقته",when:"15 Sep · 09:41",whenAr:"١٥ سبتمبر · ٠٩:٤١",state:"done"},
  {title:"Hoteliana is deciding the outcome",titleAr:"تقرر هوتيليانا النتيجة",note:"Relocate · replace · or cancel",noteAr:"نقل · استبدال · أو إلغاء",when:"in progress",whenAr:"جارٍ",state:"active"},
  {title:"Outcome recorded",titleAr:"تسجيل النتيجة",note:"With or without an entry against you",noteAr:"بقيد عليك أو بدونه",when:"-",whenAr:"-",state:"waiting"},
  {title:"Stop sale lifted",titleAr:"رفع إيقاف البيع",note:"Lifts automatically when the case closes",noteAr:"يُرفع تلقائيًا عند إغلاق الحالة",when:"-",whenAr:"-",state:"waiting"},
];

/** UI 10.8 — the same case once it is closed. */
export const incidentClosedCase: CaseStep[] = [
  {title:"You reported that you cannot honour it",titleAr:"أبلغت أنك لا تستطيع الوفاء به",note:"Reason: the hotel is overbooked",noteAr:"السبب: الفندق محجوز فوق طاقته",when:"15 Sep · 09:41",whenAr:"١٥ سبتمبر · ٠٩:٤١",state:"done"},
  {title:"Hoteliana reviewed it",titleAr:"راجعته هوتيليانا",note:"Hotel confirmed it was oversold",noteAr:"أكّد الفندق أنه بيع فوق طاقته",when:"15 Sep · 11:05",whenAr:"١٥ سبتمبر · ١١:٠٥",state:"done"},
  {title:"Outcome: cancelled by Hoteliana",titleAr:"النتيجة: ألغته هوتيليانا",note:"Agent booked the hotel directly",noteAr:"حجز الوكيل الفندق مباشرة",when:"16 Sep · 08:20",whenAr:"١٦ سبتمبر · ٠٨:٢٠",state:"done"},
  {title:"Entry posted against you",titleAr:"قيد سُجّل عليك",note:"SAR 1,240 · attached to this case",noteAr:"١٬٢٤٠ ر.س · مرفق بهذه الحالة",when:"16 Sep · 08:22",whenAr:"١٦ سبتمبر · ٠٨:٢٢",state:"done"},
  {title:"Stop sale lifted",titleAr:"رُفع إيقاف البيع",note:"Lifted automatically when the case closed · 18 Sep",noteAr:"رُفع تلقائيًا عند إغلاق الحالة · ١٨ سبتمبر",when:"18 Sep · 10:00",whenAr:"١٨ سبتمبر · ١٠:٠٠",state:"done"},
];

export const incidentEntry = [
  {label:"Entry reference",labelAr:"مرجع القيد",value:"ENT-2026-0418",valueAr:"ENT-2026-0418"},
  {label:"Amount",labelAr:"المبلغ",value:"SAR 1,240 · against you",valueAr:"١٬٢٤٠ ر.س · عليك"},
  {label:"Source",labelAr:"المصدر",value:"Fulfilment issue · HTL-88231",valueAr:"مشكلة تنفيذ · HTL-88231"},
  {label:"Posted by",labelAr:"سجّله",value:"Hoteliana · Finance",valueAr:"هوتيليانا · المالية"},
  {label:"Shows on",labelAr:"يظهر في",value:"Statement · September 2026",valueAr:"كشف الحساب · سبتمبر ٢٠٢٦"},
  {label:"Status",labelAr:"الحالة",value:"Deducted from your next payout",valueAr:"يُخصم من دفعتك القادمة"},
];
