export type NoticeKind = "action" | "information" | "reminder" | "thread";
export interface PortalNotice { id:string; title:string; titleAr:string; detail:string; detailAr:string; chips:string[]; chipsAr:string[]; time:string; timeAr:string; kind:NoticeKind; read:boolean; action:string; actionAr:string; to:"/bookings"|"/bookings/change-requests"|"/finance"|"/rate-contracts"|"/team"|"/information-requests"|"/rates/win-list" }
export const notices:PortalNotice[]=[
 {id:"WIN-2026-W40",title:"Your Win list is ready · 6 lines",titleAr:"قائمة فرصك جاهزة · ٣ سطور",detail:"Rooms and dates agents searched for and did not book from you.",detailAr:"غرف وتواريخ بحث عنها الوكلاء ولم يحجزوها منك.",chips:["Weekly","Emailed"],chipsAr:["أسبوعي","أُرسل بالبريد"],time:"Mon 06:00",timeAr:"الاثنين ٦:٠٠",kind:"information",read:false,action:"Open your Win list",actionAr:"افتح قائمة فرصك",to:"/rates/win-list"},
 {id:"HTL-88198",title:"An On Request booking needs your answer",titleAr:"حجز عند الطلب يحتاج إجابتك",detail:"HTL-88198 · Hilton Makkah · Deluxe Room · 12 – 15 Oct",detailAr:"HTL-88198 · هيلتون مكة · غرفة ديلوكس · ١٢ – ١٥ أكتوبر",chips:["Needs action","Due in 3h 12m","Emailed"],chipsAr:["يحتاج إجراء","متبقي ٣س ١٢د","أُرسل بالبريد"],time:"22 min ago",timeAr:"منذ ٢٢ دقيقة",kind:"action",read:true,action:"Answer now",actionAr:"أجب الآن",to:"/bookings"},
 {id:"HTL-88102",title:"A cancellation is waiting for a charge amount",titleAr:"إلغاء ينتظر تحديد مبلغ الرسوم",detail:"HTL-88102 · Swissôtel Al Maqam · cancelled by the agent",detailAr:"HTL-88102 · سويس أوتيل المقام · ألغاه الوكيل",chips:["Needs action","Due today 18:00","Emailed"],chipsAr:["يحتاج إجراء","مستحق اليوم ١٨:٠٠","أُرسل بالبريد"],time:"1 h ago",timeAr:"منذ ساعة",kind:"action",read:false,action:"Set the amount",actionAr:"حدد المبلغ",to:"/bookings/change-requests"},
 {id:"HTL-88177",title:"An amendment is waiting for your response",titleAr:"تعديل ينتظر ردك",detail:"HTL-88177 · Hilton Makkah · 2 nights added",detailAr:"HTL-88177 · هيلتون مكة · أضيفت ليلتان",chips:["Needs action","Due in 1 day"],chipsAr:["يحتاج إجراء","متبقي يوم"],time:"3 h ago",timeAr:"منذ ٣ ساعات",kind:"action",read:false,action:"Decide",actionAr:"اتخذ قرارًا",to:"/bookings/change-requests"},
 {id:"DOC-2041",title:"Two documents are still needed",titleAr:"ما زالت وثيقتان مطلوبتين",detail:"Hilton Madinah · blocking sale on every contract",detailAr:"هيلتون المدينة · تمنع البيع في كل العقود",chips:["Needs action","Blocking sale"],chipsAr:["يحتاج إجراء","يمنع البيع"],time:"yesterday",timeAr:"أمس",kind:"action",read:false,action:"Open the request",actionAr:"افتح الطلب",to:"/information-requests"},
 {id:"HTL-88201",title:"A booking was confirmed",titleAr:"تم تأكيد حجز",detail:"HTL-88201 · Hilton Makkah · confirmed automatically",detailAr:"HTL-88201 · هيلتون مكة · تأكد تلقائيًا",chips:["Information","No action"],chipsAr:["معلومة","لا إجراء"],time:"40 min ago",timeAr:"منذ ٤٠ دقيقة",kind:"information",read:true,action:"Open the booking",actionAr:"افتح الحجز",to:"/bookings"},
 {id:"ENT-20418",title:"Your statement was updated",titleAr:"تم تحديث كشف حسابك",detail:"September 2026 · SAR 1,240 entry added",detailAr:"سبتمبر ٢٠٢٦ · أضيف قيد ١٬٢٤٠ ر.س",chips:["Information"],chipsAr:["معلومة"],time:"2 h ago",timeAr:"منذ ساعتين",kind:"information",read:true,action:"Open statements",actionAr:"افتح الكشوف",to:"/finance"},
 {id:"SC-2026-0142",title:"A contract ends in 28 days",titleAr:"عقد ينتهي خلال ٢٨ يومًا",detail:"Makkah Annual Block · ends 31 Dec 2026",detailAr:"حصة مكة السنوية · ينتهي ٣١ ديسمبر ٢٠٢٦",chips:["Reminder"],chipsAr:["تذكير"],time:"today",timeAr:"اليوم",kind:"reminder",read:true,action:"Open the contract",actionAr:"افتح العقد",to:"/rate-contracts"},
 {id:"TEAM-LAYLA",title:"Layla was added to your team",titleAr:"تمت إضافة ليلى إلى فريقك",detail:"Reservations · invited by you",detailAr:"الحجوزات · دعوتها أنت",chips:["Information"],chipsAr:["معلومة"],time:"2 days ago",timeAr:"منذ يومين",kind:"information",read:true,action:"Open the team",actionAr:"افتح الفريق",to:"/team"},
];
export type CaseState="open"|"review"|"waiting"|"resolved"|"closed";
export const supportCases=[
 {id:"FIN-N-2291",subject:"Finance question",subjectAr:"سؤال مالي",linked:"ADJ-2026-0041 · − 3,540 SAR",linkedAr:"ADJ-2026-0041 · − ٣٬٥٤٠ ر.س",state:"open" as CaseState,updated:"today 10:24",updatedAr:"اليوم ١٠:٢٤"},
 {id:"CTR-N-3108",subject:"Contract follow-up",subjectAr:"متابعة عقد",linked:"Umrah Q3 · lift the pause",linkedAr:"عمرة الربع الثالث · رفع الإيقاف",state:"open" as CaseState,updated:"15 Sep 14:20",updatedAr:"١٥ سبتمبر ١٤:٢٠"},
 {id:"ISS-2026-0184",subject:"Booking issue · cannot honour",subjectAr:"مشكلة حجز · تعذّر الوفاء",linked:"HTL-88214 · Al Noor Makkah",linkedAr:"HTL-88214 · النور مكة",state:"review" as CaseState,updated:"today 12:58",updatedAr:"اليوم ١٢:٥٨"},
 {id:"CASE-20481",subject:"Room not matched",subjectAr:"الغرفة غير مطابقة",linked:"Executive Suite · Hilton Makkah",linkedAr:"الجناح التنفيذي · هيلتون مكة",state:"open" as CaseState,updated:"2 hours ago",updatedAr:"منذ ساعتين"},
 {id:"CASE-20462",subject:"Hotel request has not moved",subjectAr:"طلب الفندق لم يتحرك",linked:"Conrad Makkah · request",linkedAr:"كونراد مكة · طلب",state:"review" as CaseState,updated:"yesterday",updatedAr:"أمس"},
 {id:"CASE-20451",subject:"Statement looks wrong",subjectAr:"كشف الحساب يبدو خاطئًا",linked:"September 2026 · ENT-2026-0418",linkedAr:"سبتمبر ٢٠٢٦ · ENT-2026-0418",state:"waiting" as CaseState,updated:"3 days ago",updatedAr:"منذ ٣ أيام"},
 {id:"CASE-20399",subject:"Hotel missing from the library",subjectAr:"فندق مفقود من المكتبة",linked:"Novotel Thakher",linkedAr:"نوفوتيل ذاخر",state:"resolved" as CaseState,updated:"11 days ago",updatedAr:"منذ ١١ يومًا"},
 {id:"CASE-20344",subject:"Something else",subjectAr:"شيء آخر",linked:"-",linkedAr:"-",state:"closed" as CaseState,updated:"24 days ago",updatedAr:"منذ ٢٤ يومًا"},
];
export interface PreferenceRow { event:string; eventAr:string; why:"Critical"|"Security"|"Information"|"Digest"; required:boolean }
/** UI 11.20 — what reaches your inbox, and what you may switch off. */
export const preferenceRows:PreferenceRow[]=[
 {event:"An On Request booking needs an answer",eventAr:"حجز عند الطلب يحتاج إجابة",why:"Critical",required:true},
 {event:"An On Request booking is about to expire",eventAr:"حجز عند الطلب على وشك الانتهاء",why:"Critical",required:true},
 {event:"A name change is waiting for you",eventAr:"تغيير اسم بانتظارك",why:"Critical",required:true},
 {event:"A cancellation needs a charge amount",eventAr:"إلغاء يحتاج تحديد رسم",why:"Critical",required:true},
 {event:"A contract is ending",eventAr:"عقد على وشك الانتهاء",why:"Critical",required:true},
 {event:"Account, sign-in and security",eventAr:"الحساب وتسجيل الدخول والأمان",why:"Security",required:true},
 {event:"A booking was confirmed",eventAr:"تأكّد حجز",why:"Information",required:false},
 {event:"A statement was updated",eventAr:"حُدّث كشف حساب",why:"Information",required:false},
 {event:"An entry was posted against you",eventAr:"سُجّل قيد عليك",why:"Information",required:false},
 {event:"A hotel request was approved or declined",eventAr:"اعتُمد طلب فندق أو رُفض",why:"Information",required:false},
 {event:"Someone joined or left your team",eventAr:"انضمّ أحد إلى فريقك أو غادره",why:"Information",required:false},
 {event:"A weekly summary of your account",eventAr:"ملخص أسبوعي لحسابك",why:"Digest",required:false},
];
export interface CaseMessage { who:string; whoAr:string; when:string; whenAr:string; text:string; textAr:string; mine:boolean }
export interface CaseView {
  title: string; titleAr: string;
  meta: string; metaAr: string;
  bannerTitle: string; bannerTitleAr: string;
  bannerBody: string; bannerBodyAr: string;
  actions: Array<{label:string;labelAr:string;primary?:boolean}>;
  messages: CaseMessage[];
  attached: Array<{label:string;labelAr:string;value:string;valueAr:string}>;
  ends: Array<[string,string,string]>;
}

const REPLY_OPS:CaseMessage={who:"Hoteliana · Operations",whoAr:"هوتيليانا · العمليات",when:"Today, 12:58",whenAr:"اليوم ١٢:٥٨",text:"Thanks - we have it. We are checking with the agent whether the guest takes the Deluxe room. We will answer you here and by email.",textAr:"شكرًا - وصلنا. ونحن نتحقق مع الوكيل هل يأخذ الضيف غرفة الديلوكس. وسنجيبك هنا وبالبريد.",mine:false};
const REPLY_FIN:CaseMessage={who:"Hoteliana · Finance",whoAr:"هوتيليانا · المالية",when:"15 Sep, 10:00",whenAr:"١٥ سبتمبر ١٠:٠٠",text:"Still waiting on that email. The entry stays on the statement until we can compare the two.",textAr:"ما زلنا ننتظر ذلك البريد. ويبقى القيد على الكشف حتى نتمكن من المقارنة بينهما.",mine:false};
const ENDS_MONEY:[string,string,string]=["yes","Either way the money and the reason stay linked. That is the whole point of the case.","في الحالتين يبقى المال والسبب مرتبطين. وهذا هو مغزى الحالة كلها."];

/** UI 11.25 / 11.25B / 11.25C / 11.25D — the four case details the design writes out. */
export const caseViews:Record<string,CaseView>={
 "CASE-20451":{
  title:"CASE-20451 · Statement looks wrong",titleAr:"CASE-20451 · كشف الحساب يبدو خاطئًا",
  meta:"Opened 13 Sep 2026 · linked to entry ENT-2026-0418 · September 2026 statement",metaAr:"فُتحت ١٣ سبتمبر ٢٠٢٦ · مرتبطة بالقيد ENT-2026-0418 · كشف سبتمبر ٢٠٢٦",
  bannerTitle:"Hoteliana is waiting for something from you.",bannerTitleAr:"تنتظر هوتيليانا شيئًا منك.",
  bannerBody:"The email where you offered the agent a Superior room. Until it arrives, the entry stays on your statement and this case does not move.",bannerBodyAr:"البريد الذي عرضت فيه على الوكيل غرفة سوبيريور. وحتى يصل يبقى القيد على كشفك ولا تتحرك هذه الحالة.",
  actions:[{label:"Attach the email",labelAr:"إرفاق البريد",primary:true},{label:"Reply without it",labelAr:"الرد بدونه"}],
  messages:[
   {who:"Abdullrahman · you",whoAr:"عبدالرحمن · أنت",when:"13 Sep, 09:20",whenAr:"١٣ سبتمبر ٠٩:٢٠",text:"The SAR 1,240 entry on the September statement does not look right to us. The agent booked directly because the hotel was oversold, but we had already offered them a Superior room at the same rate.",textAr:"قيد الـ١٬٢٤٠ ر.س على كشف سبتمبر لا يبدو صحيحًا لنا. فقد حجز الوكيل مباشرة لأن الفندق بيع فوق طاقته، لكننا كنا قد عرضنا عليه غرفة سوبيريور بالسعر نفسه.",mine:true},
   {who:"Hoteliana · Finance",whoAr:"هوتيليانا · المالية",when:"13 Sep, 14:05",whenAr:"١٣ سبتمبر ١٤:٠٥",text:"Thanks - we can see the incident on HTL-88231. To match it against what the agent paid, can you send the email where you offered the Superior room?",textAr:"شكرًا - نرى الحادثة على HTL-88231. ولمطابقتها بما دفعه الوكيل، هل ترسل البريد الذي عرضت فيه غرفة السوبيريور؟",mine:false},
   REPLY_FIN,
  ],
  attached:[
   {label:"Reference",labelAr:"المرجع",value:"CASE-20451",valueAr:"CASE-20451"},
   {label:"Category",labelAr:"الفئة",value:"Statement looks wrong",valueAr:"كشف الحساب يبدو خاطئًا"},
   {label:"Linked entry",labelAr:"القيد المرتبط",value:"ENT-2026-0418 · SAR 1,240",valueAr:"ENT-2026-0418 · ١٬٢٤٠ ر.س"},
   {label:"Linked booking",labelAr:"الحجز المرتبط",value:"HTL-88231 · Hilton Makkah",valueAr:"HTL-88231 · هيلتون مكة"},
   {label:"Source incident",labelAr:"الحادثة المصدر",value:"Fulfilment issue",valueAr:"مشكلة تنفيذ"},
   {label:"Screen",labelAr:"الشاشة",value:"Finance · your account",valueAr:"المالية · حسابك"},
   {label:"Raised by",labelAr:"رفعها",value:"Abdullrahman · Owner",valueAr:"عبدالرحمن · المالك"},
   {label:"Status",labelAr:"الحالة",value:"Waiting on you since 15 Sep, 10:00",valueAr:"بانتظارك منذ ١٥ سبتمبر ١٠:٠٠"},
  ],
  ends:[
   ["info","If we agree the entry is wrong, it is reversed on the statement and the case closes with that written on it.","إن اتفقنا على أن القيد خاطئ فهو يُعكس على الكشف وتُغلق الحالة وذلك مكتوب عليها."],
   ["info","If it stands, the reason stays on the case - you are never left guessing why.","وإن ثبت بقي السبب على الحالة - فلا تُترك تخمّن أبدًا."],
   ENDS_MONEY,
  ],
 },
 "ISS-2026-0184":{
  title:"ISS-2026-0184 · Booking issue · HTL-88214",titleAr:"ISS-2026-0184 · مشكلة حجز · HTL-88214",
  meta:"Opened today 12:41 · linked to booking HTL-88214 · Nour Al-Sayed · 24 - 26 Sep",metaAr:"فُتحت اليوم ١٢:٤١ · مرتبطة بالحجز HTL-88214 · نور السيد · ٢٤ - ٢٦ سبتمبر",
  bannerTitle:"Hoteliana is on it - nothing is needed from you right now.",bannerTitleAr:"هوتيليانا تتولاها - ولا شيء مطلوب منك الآن.",
  bannerBody:"We are asking the agent whether the guest accepts the Deluxe Room City View you offered. You can add information any time.",bannerBodyAr:"نسأل الوكيل هل يقبل الضيف غرفة الديلوكس بإطلالة المدينة التي عرضتها. ويمكنك إضافة معلومات في أي وقت.",
  actions:[{label:"Add information",labelAr:"إضافة معلومات",primary:true},{label:"Reply without it",labelAr:"الرد بدونها"}],
  messages:[
   {who:"Abdullrahman · you",whoAr:"عبدالرحمن · أنت",when:"Today, 12:41",whenAr:"اليوم ١٢:٤١",text:"The hotel cannot honour HTL-88214 on 24 - 26 Sep. We can offer Deluxe Room City View on the same nights. Stop sale is on for Standard Room.",textAr:"لا يستطيع الفندق الوفاء بـHTL-88214 في ٢٤ - ٢٦ سبتمبر. ويمكننا عرض ديلوكس بإطلالة المدينة في الليالي نفسها. وإيقاف البيع مفعّل على الغرفة القياسية.",mine:true},
   REPLY_OPS,REPLY_FIN,
  ],
  attached:[
   {label:"Reference",labelAr:"المرجع",value:"ISS-2026-0184",valueAr:"ISS-2026-0184"},
   {label:"Type",labelAr:"النوع",value:"Booking issue · the hotel cannot honour it",valueAr:"مشكلة حجز · تعذّر على الفندق الوفاء به"},
   {label:"What you offered",labelAr:"ما عرضته",value:"Deluxe Room City View · same nights",valueAr:"ديلوكس بإطلالة المدينة · الليالي نفسها"},
   {label:"Linked booking",labelAr:"الحجز المرتبط",value:"HTL-88214 · Al Noor Makkah Hotel",valueAr:"HTL-88214 · فندق النور مكة"},
   {label:"Also applied",labelAr:"طُبق أيضًا",value:"Stop sale · Standard Room · 24 - 26 Sep",valueAr:"إيقاف بيع · غرفة قياسية · ٢٤ - ٢٦ سبتمبر"},
   {label:"Screen",labelAr:"الشاشة",value:"Bookings · report an issue",valueAr:"الحجوزات · الإبلاغ عن مشكلة"},
   {label:"Raised by",labelAr:"رفعها",value:"Abdullrahman · Owner",valueAr:"عبدالرحمن · المالك"},
   {label:"Status",labelAr:"الحالة",value:"In review since today, 12:58",valueAr:"قيد المراجعة منذ اليوم ١٢:٥٨"},
  ],
  ends:[
   ["info","If the guest takes the Deluxe room, the booking moves to it - nothing is cancelled.","إن أخذ الضيف غرفة الديلوكس انتقل الحجز إليها - ولا يُلغى شيء."],
   ["info","If not, Hoteliana places the guest elsewhere and tells you here, with the reason.","وإن لم يأخذها أنزلت هوتيليانا الضيف في مكان آخر وأخبرتك هنا بالسبب."],
   ENDS_MONEY,
  ],
 },
 "FIN-N-2291":{
  title:"FIN-N-2291 · Finance question · ADJ-2026-0041",titleAr:"FIN-N-2291 · سؤال مالي · ADJ-2026-0041",
  meta:"Sent today 10:24 · linked to entry ADJ-2026-0041 · − 3,540 SAR",metaAr:"أُرسل اليوم ١٠:٢٤ · مرتبط بالقيد ADJ-2026-0041 · − ٣٬٥٤٠ ر.س",
  bannerTitle:"Reem Tarek has your message - she usually calls back within one working day.",bannerTitleAr:"لدى ريم طارق رسالتك - وتعاود الاتصال عادةً خلال يوم عمل واحد.",
  bannerBody:"Nothing is held: the entry stays on your account as it is. To hold the money while it is checked, dispute the entry instead.",bannerBodyAr:"لا شيء محجوز: يبقى القيد على حسابك كما هو. ولحجز المال أثناء المراجعة اعترض على القيد بدلًا من ذلك.",
  actions:[{label:"Add information",labelAr:"إضافة معلومات",primary:true},{label:"Reply",labelAr:"الرد"}],
  messages:[
   {who:"Abdullrahman · you",whoAr:"عبدالرحمن · أنت",when:"Today, 10:24",whenAr:"اليوم ١٠:٢٤",text:"The group was moved on 29 August, not 28 - one night was ours. Can we look at the invoice together?",textAr:"نُقلت المجموعة في ٢٩ أغسطس لا ٢٨ - ليلة واحدة كانت علينا. هل ننظر في الفاتورة معًا؟",mine:true},
   REPLY_OPS,REPLY_FIN,
  ],
  attached:[
   {label:"Reference",labelAr:"المرجع",value:"FIN-N-2291",valueAr:"FIN-N-2291"},
   {label:"Type",labelAr:"النوع",value:"Finance question · a line on your account",valueAr:"سؤال مالي · سطر على حسابك"},
   {label:"Linked entry",labelAr:"القيد المرتبط",value:"ADJ-2026-0041 · − 3,540 SAR · guest relocated",valueAr:"ADJ-2026-0041 · − ٣٬٥٤٠ ر.س · نُقل نزيل"},
   {label:"Linked booking",labelAr:"الحجز المرتبط",value:"HTL-88121 · Nasser Al-Amri",valueAr:"HTL-88121 · ناصر العامري"},
   {label:"Money held",labelAr:"حجز المال",value:"No - a message does not hold money",valueAr:"لا - الرسالة لا تحجز مالًا"},
   {label:"Screen",labelAr:"الشاشة",value:"Finance · your account",valueAr:"المالية · حسابك"},
   {label:"Raised by",labelAr:"رفعها",value:"Abdullrahman · Owner",valueAr:"عبدالرحمن · المالك"},
   {label:"Status",labelAr:"الحالة",value:"Open since today, 10:24",valueAr:"مفتوحة منذ اليوم ١٠:٢٤"},
  ],
  ends:[
   ["info","If Hoteliana agrees, a correcting entry is posted on your account and linked here.","إن وافقت هوتيليانا نُشر قيد مصحح على حسابك ورُبط هنا."],
   ["info","If the entry stands, the answer and the reason stay on this case.","وإن ثبت القيد بقيت الإجابة والسبب على هذه الحالة."],
   ENDS_MONEY,
  ],
 },
 "CTR-N-3108":{
  title:"CTR-N-3108 · Contract follow-up · Umrah Q3",titleAr:"CTR-N-3108 · متابعة عقد · عمرة الربع الثالث",
  meta:"Sent 15 Sep 14:20 · linked to contract Umrah Q3 · paused since 12 Sep",metaAr:"أُرسل ١٥ سبتمبر ١٤:٢٠ · مرتبط بعقد عمرة الربع الثالث · موقوف منذ ١٢ سبتمبر",
  bannerTitle:"Hoteliana’s contracts team has your request - they answer within one working day.",bannerTitleAr:"لدى فريق العقود في هوتيليانا طلبك - ويجيبون خلال يوم عمل واحد.",
  bannerBody:"The pause stays on until Hoteliana lifts it. You keep managing rates, inventory and bookings in the meantime.",bannerBodyAr:"يبقى الإيقاف قائمًا حتى ترفعه هوتيليانا. وتواصل إدارة الأسعار والمخزون والحجوزات في هذه الأثناء.",
  actions:[{label:"Add information",labelAr:"إضافة معلومات",primary:true},{label:"Reply",labelAr:"الرد"}],
  messages:[
   {who:"Abdullrahman · you",whoAr:"عبدالرحمن · أنت",when:"15 Sep, 14:20",whenAr:"١٥ سبتمبر ١٤:٢٠",text:"We sent the signed allotment confirmation on 14 Sep - please lift the pause on Umrah Q3.",textAr:"أرسلنا تأكيد الحصة الموقّع في ١٤ سبتمبر - نرجو رفع الإيقاف عن عمرة الربع الثالث.",mine:true},
   REPLY_OPS,REPLY_FIN,
  ],
  attached:[
   {label:"Reference",labelAr:"المرجع",value:"CTR-N-3108",valueAr:"CTR-N-3108"},
   {label:"Type",labelAr:"النوع",value:"Contract follow-up · lift the pause",valueAr:"متابعة عقد · رفع الإيقاف"},
   {label:"Linked contract",labelAr:"العقد المرتبط",value:"Umrah Q3 · paused since 12 Sep 2026",valueAr:"عمرة الربع الثالث · موقوف منذ ١٢ سبتمبر ٢٠٢٦"},
   {label:"Linked booking",labelAr:"الحجز المرتبط",value:"HTL-88121 · Nasser Al-Amri",valueAr:"HTL-88121 · ناصر العامري"},
   {label:"Contract paused",labelAr:"العقد موقوف",value:"Yes - until Hoteliana lifts it",valueAr:"نعم - حتى ترفعه هوتيليانا"},
   {label:"Screen",labelAr:"الشاشة",value:"Contracts · sell status",valueAr:"العقود · حالة البيع"},
   {label:"Raised by",labelAr:"رفعها",value:"Abdullrahman · Owner",valueAr:"عبدالرحمن · المالك"},
   {label:"Status",labelAr:"الحالة",value:"Open since 15 Sep, 14:20",valueAr:"مفتوحة منذ ١٥ سبتمبر ١٤:٢٠"},
  ],
  ends:[
   ["info","If Hoteliana lifts the pause, the contract is live again and you get a notification.","إن رفعت هوتيليانا الإيقاف عاد العقد فعّالًا ووصلك إشعار."],
   ["info","If something is still missing, Hoteliana says what here - you reply on this case.","وإن بقي شيء ناقصًا قالت هوتيليانا ما هو هنا - وترد أنت على هذه الحالة."],
   ["yes","Either way the pause and the reason stay linked. That is the whole point of the case.","في الحالتين يبقى الإيقاف والسبب مرتبطين. وهذا هو مغزى الحالة كلها."],
  ],
 },
};

export type SystemStateKey = "permission"|"scope"|"readonly"|"save"|"publish"|"partial"|"session"|"security"|"deactivated"|"changed";
export interface SystemStateView {
  label: string; labelAr: string;
  title: string; titleAr: string;
  body: string; bodyAr: string;
  cardTitle: string; cardTitleAr: string;
  lines: Array<[string,string,string]>;
  actions: Array<{label:string;labelAr:string;primary?:boolean}>;
  /** The permission keys the design prints as chips. */
  has?: string[];
  hasTitle?: string; hasTitleAr?: string;
  hasNote?: string; hasNoteAr?: string;
  needs?: string[];
  needsTitle?: string; needsTitleAr?: string;
  needsNote?: string; needsNoteAr?: string;
  /** Rows for the save / publish breakdowns. */
  rows?: Array<{what:string;whatAr:string;when:string;whenAr:string;why:string;whyAr:string;todo:string;todoAr:string}>;
  rowsTitle?: string; rowsTitleAr?: string;
  rowsNote?: string; rowsNoteAr?: string;
  rowHeads?: [string,string,string,string];
  rowHeadsAr?: [string,string,string,string];
}

/** UI 11.4 – 11.14 — every denial, failure and sign-out, in the design's own words. */
export const systemStates:Record<SystemStateKey,SystemStateView>={
 permission:{
  label:"Missing permission",labelAr:"صلاحية ناقصة",
  title:"This screen needs a permission you do not have.",titleAr:"تحتاج هذه الشاشة صلاحية لا تملكها.",
  body:"Your role is Reservations. This screen reads the money side of the account, which sits behind a permission your role does not carry. Nothing is wrong with your account.",
  bodyAr:"دورك هو الحجوزات. وتقرأ هذه الشاشة الجانب المالي للحساب، وهو خلف صلاحية لا يحملها دورك. ولا خلل في حسابك.",
  needsTitle:"What this screen needs",needsTitleAr:"ما تحتاجه هذه الشاشة",
  needsNote:"One key, and you do not have it.",needsNoteAr:"مفتاح واحد ولا تملكه.",
  needs:["see finance"],
  hasTitle:"What you do have",hasTitleAr:"ما تملكه",
  hasNote:"Your role today · Reservations",hasNoteAr:"دورك اليوم · الحجوزات",
  has:["see bookings","confirm bookings","answer amendments","cancel bookings","see guest identity","see hotels","see rates"],
  cardTitle:"What you can do about it",cardTitleAr:"ما يمكنك فعله حيال ذلك",
  lines:[
   ["info","Ask the Owner for the one key you need - it goes to them as a request, not a message.","اطلب من المالك المفتاح الوحيد الذي تحتاجه - ويصله طلبًا لا رسالة."],
   ["yes","Everything else you work on is unaffected.","وكل ما تعمل عليه غير ذلك لا يتأثر."],
   ["info","If someone sent you a link, the notification was for the account - the action is not in your role.","وإن أرسل إليك أحد رابطًا فالإشعار كان للحساب - والإجراء ليس في دورك."],
  ],
  actions:[{label:"Ask the Owner for access",labelAr:"اطلب الصلاحية من المالك",primary:true},{label:"Back to bookings",labelAr:"العودة إلى الحجوزات"}],
 },
 scope:{
  label:"Out of scope",labelAr:"خارج النطاق",
  title:"You have access to Rates - but not for this hotel.",titleAr:"لديك صلاحية الأسعار - لكن ليس لهذا الفندق.",
  body:"Your role carries the rate permissions. This particular hotel is not in the list of hotels you were given. That is a scope, not a role, and it is changed in one step by the Owner.",
  bodyAr:"يحمل دورك صلاحيات الأسعار. لكن هذا الفندق بعينه ليس في قائمة الفنادق التي أُعطيت لك. وهذا نطاق لا دور، ويغيّره المالك بخطوة واحدة.",
  hasTitle:"What you have",hasTitleAr:"ما تملكه",
  hasNote:"Revenue manager",hasNoteAr:"مدير الإيرادات",
  has:["see rates","edit rates","publish rates","edit inventory","restrictions.edit"],
  needsTitle:"Where you have it",needsTitleAr:"أين تملكه",
  needsNote:"Your hotel scope today. This hotel is not in it.",needsNoteAr:"نطاق فنادقك اليوم. وهذا الفندق ليس فيه.",
  needs:["Hilton Makkah","Swissôtel Al Maqam","Pullman ZamZam","this hotel - not in your scope"],
  cardTitle:"What you can do about it",cardTitleAr:"ما يمكنك فعله حيال ذلك",
  lines:[
   ["info","The hotel is not named here on purpose. A screen that refuses you should not tell you what it is refusing you to.","لا يُذكر اسم الفندق هنا عمدًا. فالشاشة التي ترفضك لا ينبغي أن تخبرك بما ترفضك عنه."],
   ["info","Ask the Owner to add this hotel to your scope - the key stays the same.","اطلب من المالك إضافة هذا الفندق إلى نطاقك - ويبقى المفتاح كما هو."],
   ["yes","Your three hotels work exactly as before.","وفنادقك الثلاثة تعمل تمامًا كما كانت."],
  ],
  actions:[{label:"Ask the Owner for this hotel",labelAr:"اطلب هذا الفندق من المالك",primary:true},{label:"Back to rates",labelAr:"العودة إلى الأسعار"}],
 },
 readonly:{
  label:"Read-only state",labelAr:"حالة القراءة فقط",
  title:"You can see this. You cannot change it.",titleAr:"يمكنك رؤية هذا. ولا يمكنك تغييره.",
  body:"You are an Auditor. The account is open to you for reading, and closed for doing - on every screen, not just this one. This is the role working as intended, not a missing permission.",
  bodyAr:"أنت مدقّق. والحساب مفتوح لك للقراءة ومغلق للفعل - في كل شاشة لا هذه وحدها. وهذا هو الدور يعمل كما أُريد له، لا صلاحية ناقصة.",
  hasTitle:"Your reach, as the Owner set it",hasTitleAr:"مداك كما ضبطه المالك",
  has:["see finance","see booking money","see guest identity - off"],
  cardTitle:"What read-only means here",cardTitleAr:"ما تعنيه القراءة فقط هنا",
  lines:[
   ["yes","Open, read, filter, export and follow any number back to its source.","افتح واقرأ وصفِّ وصدّر وتتبّع أي رقم إلى مصدره."],
   ["no","Create, edit, publish, confirm, cancel, invite or settle.","إنشاء أو تعديل أو نشر أو تأكيد أو إلغاء أو دعوة أو تسوية."],
   ["info","Every screen shows the same thing - no screen hides a button that would work.","وكل شاشة تعرض الشيء نفسه - ولا تخفي شاشة زرًا كان سيعمل."],
   ["info","What you can see is set by the Owner, and can be narrower than the whole account.","وما تراه يضبطه المالك، وقد يكون أضيق من الحساب كله."],
   ["info","The contract itself is read-only - expired or terminated. Nobody can edit it, whatever their role.","والعقد نفسه للقراءة فقط - منتهٍ أو مُنهى. ولا يعدّله أحد مهما كان دوره."],
   ["info","A pause from Hoteliana blocks selling, not editing. That one does not send you here.","وإيقاف هوتيليانا يحجب البيع لا التعديل. وذلك لا يرسلك إلى هنا."],
  ],
  actions:[{label:"Ask the Owner for edit access",labelAr:"اطلب صلاحية التعديل من المالك",primary:true},{label:"Back to dashboard",labelAr:"العودة إلى لوحة اليوم"}],
 },
 save:{
  label:"Save failed",labelAr:"فشل الحفظ",
  title:"Your changes did not save.",titleAr:"لم تُحفظ تغييراتك.",
  body:"Nothing was lost. All 18 changes are still on this screen.",bodyAr:"لم يُفقد شيء. وكل الـ١٨ تغييرًا ما زالت على هذه الشاشة.",
  rowsTitle:"46 changes attempted",rowsTitleAr:"٤٦ تغييرًا حاولت",
  rowsNote:"Every line says what happened to it. A bulk edit never reports a single yes or no.",rowsNoteAr:"كل سطر يقول ما حدث له. والتعديل الجماعي لا يبلّغ بنعم واحدة أو لا واحدة أبدًا.",
  rowHeads:["WHAT","WHEN","WHY IT FAILED","WHAT TO DO"],
  rowHeadsAr:["ماذا","متى","لماذا فشل","ماذا تفعل"],
  rows:[
   {what:"28 changes",whatAr:"٢٨ تغييرًا",when:"saved 2 minutes ago",whenAr:"حُفظت قبل دقيقتين",why:"-",whyAr:"-",todo:"Already saved",todoAr:"محفوظة سلفًا"},
   {what:"12 · Deluxe · 01 - 12 Nov",whatAr:"١٢ · ديلوكس · ١ - ١٢ نوفمبر",when:"still unsaved",whenAr:"ما زالت غير محفوظة",why:"The connection dropped mid-request",whyAr:"انقطع الاتصال أثناء الطلب",todo:"Try again",todoAr:"حاول مرة أخرى"},
   {what:"4 · Standard · 03 - 06 Nov",whatAr:"٤ · قياسية · ٣ - ٦ نوفمبر",when:"still unsaved",whenAr:"ما زالت غير محفوظة",why:"Layla changed these since you opened them",whyAr:"غيّرتها ليلى منذ أن فتحتها",todo:"Review the conflict",todoAr:"راجع التعارض"},
   {what:"2 · Superior · 09 Nov",whatAr:"٢ · سوبيريور · ٩ نوفمبر",when:"still unsaved",whenAr:"ما زالت غير محفوظة",why:"Inventory cannot be higher than the contracted allotment",whyAr:"لا يزيد المخزون على الحصة المتعاقد عليها",todo:"Fix the value",todoAr:"صحّح القيمة"},
  ],
  cardTitle:"The rules behind this screen",cardTitleAr:"القواعد خلف هذه الشاشة",
  lines:[
   ["yes","Retrying is safe. The same change sent twice is applied once.","إعادة المحاولة آمنة. والتغيير نفسه إن أُرسل مرتين طُبّق مرة."],
   ["yes","Your unsaved work survives a refresh - it is held locally and a draft is written to the server every few seconds.","وعملك غير المحفوظ ينجو من التحديث - فهو محفوظ محليًا وتُكتب مسودة على الخادم كل بضع ثوانٍ."],
   ["no","Leaving this page with unsaved changes warns you first.","ومغادرة هذه الصفحة بتغييرات غير محفوظة تنبّهك أولًا."],
   ["info","If the real reason was that your session ended, you get the sign-out screen instead of this one. Two causes, two messages.","وإن كان السبب الحقيقي انتهاء جلستك فستصلك شاشة الخروج بدل هذه. سببان ورسالتان."],
  ],
  actions:[{label:"Try the 12 again",labelAr:"أعد محاولة الـ١٢",primary:true},{label:"Review the 4 conflicts",labelAr:"راجع التعارضات الأربعة"},{label:"Discard the unsaved changes",labelAr:"تجاهل التغييرات غير المحفوظة"}],
 },
 publish:{
  label:"Publish failed",labelAr:"فشل النشر",
  title:"Saved as a draft. The publish did not go through.",titleAr:"حُفظت مسودة. ولم يمر النشر.",
  body:"Your work is on the server. What did not happen is the part that puts it on sale. Nothing was lost and nothing was half-applied to what agents can see.",
  bodyAr:"عملك على الخادم. وما لم يحدث هو الجزء الذي يضعه للبيع. ولم يُفقد شيء ولم يُطبّق شيء نصف تطبيق على ما يراه الوكلاء.",
  rowsTitle:"A publish can land in parts",rowsTitleAr:"قد يصل النشر أجزاءً",
  rowsNote:"Which periods went live, and which did not. Never a single \"it failed\".",rowsNoteAr:"أي الفترات صارت حية وأيها لم تصر. ولا تُقال أبدًا «فشل» وحدها.",
  rowHeads:["PERIOD","ROOMS","RESULT","WHAT TO DO"],
  rowHeadsAr:["الفترة","الغرف","النتيجة","ماذا تفعل"],
  rows:[
   {what:"01 - 31 Oct 2026",whatAr:"١ - ٣١ أكتوبر ٢٠٢٦",when:"Deluxe · Standard",whenAr:"ديلوكس · قياسية",why:"Published · live now",whyAr:"منشورة · حية الآن",todo:"-",todoAr:"-"},
   {what:"01 - 30 Nov 2026",whatAr:"١ - ٣٠ نوفمبر ٢٠٢٦",when:"Deluxe · Standard",whenAr:"ديلوكس · قياسية",why:"Publish failed - the request timed out",whyAr:"فشل النشر - انتهت مهلة الطلب",todo:"Publish this period",todoAr:"انشر هذه الفترة"},
   {what:"01 - 31 Dec 2026",whatAr:"١ - ٣١ ديسمبر ٢٠٢٦",when:"Deluxe",whenAr:"ديلوكس",why:"Not attempted - publishing stopped at the failure",whyAr:"لم تُحاول - توقف النشر عند الفشل",todo:"Publish this period",todoAr:"انشر هذه الفترة"},
  ],
  cardTitle:"Why these are separate states",cardTitleAr:"لماذا هذه حالات منفصلة",
  lines:[
   ["info","Agents are seeing the version you published on 14 Sep 2026.","يرى الوكلاء النسخة التي نشرتها في ١٤ سبتمبر ٢٠٢٦."],
   ["no","Your new prices are not live. Nothing changed for anyone while the publish was failing.","وأسعارك الجديدة ليست حية. ولم يتغير شيء لأحد بينما كان النشر يفشل."],
   ["info","Saved draft means the server has your work. Published means agents can buy it.","والمسودة المحفوظة تعني أن الخادم يملك عملك. والمنشور يعني أن الوكلاء يستطيعون شراءه."],
   ["no","A failed publish never leaves half a rate on sale.","والنشر الفاشل لا يترك نصف سعر للبيع أبدًا."],
   ["yes","Publishing again only sends what is not live yet.","وإعادة النشر لا ترسل إلا ما ليس حيًا بعد."],
  ],
  actions:[{label:"Publish again",labelAr:"انشر مرة أخرى",primary:true},{label:"Open the draft",labelAr:"فتح المسودة"},{label:"See what is live",labelAr:"عرض ما هو حي"}],
 },
 partial:{
  label:"Partial save",labelAr:"حفظ جزئي",
  title:"37 of 40 nights were saved. Three need you.",titleAr:"حُفظت ٣٧ ليلة من ٤٠. وثلاث تحتاجك.",
  body:"A bulk edit is not one action. The nights nobody else touched are already saved. Only the three that changed under you are waiting, and they are marked on the calendar itself.",
  bodyAr:"التعديل الجماعي ليس إجراءً واحدًا. فالليالي التي لم يمسسها أحد محفوظة سلفًا. ولا ينتظر إلا الثلاث التي تغيّرت من تحتك، وهي معلّمة على التقويم نفسه.",
  rowsTitle:"The three that stopped",rowsTitleAr:"الثلاث التي توقفت",
  rowsNote:"Each one opens the same diff - you are never asked to guess.",rowsNoteAr:"وكل واحدة تفتح المقارنة نفسها - ولا يُطلب منك التخمين أبدًا.",
  rowHeads:["NIGHT","YOUR VALUE","CURRENT VALUE","CHANGED BY"],
  rowHeadsAr:["الليلة","قيمتك","القيمة الحالية","من غيّرها"],
  rows:[
   {what:"12 Nov 2026",whatAr:"١٢ نوفمبر ٢٠٢٦",when:"8",whenAr:"٨",why:"6",whyAr:"٦",todo:"Layla · 3 min ago",todoAr:"ليلى · قبل ٣ دقائق"},
   {what:"13 Nov 2026",whatAr:"١٣ نوفمبر ٢٠٢٦",when:"8",whenAr:"٨",why:"6",whyAr:"٦",todo:"Layla · 3 min ago",todoAr:"ليلى · قبل ٣ دقائق"},
   {what:"26 Nov 2026",whatAr:"٢٦ نوفمبر ٢٠٢٦",when:"8",whenAr:"٨",why:"0 · sold out",whyAr:"٠ · نفدت",todo:"System · 12 min ago",todoAr:"النظام · قبل ١٢ دقيقة"},
  ],
  cardTitle:"Why the other 37 went through",cardTitleAr:"لماذا مرّت الـ٣٧ الأخرى",
  lines:[
   ["yes","They had not changed since you opened the calendar.","لم تتغير منذ أن فتحت التقويم."],
   ["no","Rejecting all 40 because of 3 would make bulk editing useless.","ورفض الأربعين بسبب ثلاث يجعل التعديل الجماعي بلا فائدة."],
   ["info","The 37 are live or drafted according to what you chose - saving and publishing stay separate here too.","والـ٣٧ حية أو مسوّدة بحسب ما اخترت - ويبقى الحفظ والنشر منفصلين هنا أيضًا."],
  ],
  actions:[{label:"Resolve the three",labelAr:"حلّ الثلاث",primary:true},{label:"Open the calendar",labelAr:"فتح التقويم"}],
 },
 session:{
  label:"Session expired",labelAr:"انتهت الجلسة",
  title:"Your session ended.",titleAr:"انتهت جلستك.",
  body:"Sign in again and you come back to the same screen. Nothing you were working on was sent anywhere.",
  bodyAr:"سجّل الدخول مرة أخرى وتعود إلى الشاشة نفسها. ولم يُرسل ما كنت تعمل عليه إلى أي مكان.",
  cardTitle:"What happens to your work",cardTitleAr:"ماذا يحدث لعملك",
  lines:[
   ["yes","Unsaved changes are kept on this device until you sign in again.","تبقى التغييرات غير المحفوظة على هذا الجهاز حتى تسجّل الدخول من جديد."],
   ["info","A session ends on its own schedule - it is not a sign that anything went wrong.","والجلسة تنتهي بجدولها - وليست دليلًا على خلل."],
  ],
  actions:[{label:"Sign in again",labelAr:"سجّل الدخول مرة أخرى",primary:true}],
 },
 security:{
  label:"Security sign-out",labelAr:"خروج أمني",
  title:"You were signed out for security.",titleAr:"سُجّل خروجك لأسباب أمنية.",
  body:"Every session on every device was ended. Local work was cleared deliberately.",
  bodyAr:"أُنهيت كل جلسة على كل جهاز. ومُسح العمل المحلي عمدًا.",
  cardTitle:"What to do now",cardTitleAr:"ماذا تفعل الآن",
  lines:[
   ["info","Set a new password, then sign in again.","اضبط كلمة مرور جديدة ثم سجّل الدخول."],
   ["no","Local work was cleared - this one does not keep your drafts.","ومُسح العمل المحلي - فهذه لا تحتفظ بمسوداتك."],
  ],
  actions:[{label:"Set a new password",labelAr:"اضبط كلمة مرور جديدة",primary:true}],
 },
 deactivated:{
  label:"Account deactivated",labelAr:"حساب معطّل",
  title:"Your access to this account has been turned off.",titleAr:"أُوقفت صلاحيتك على هذا الحساب.",
  body:"This was done by the Owner on 15 Sep 2026. There is no sign-in to try - signing in again would fail, so we do not offer it.",
  bodyAr:"فعل ذلك المالك في ١٥ سبتمبر ٢٠٢٦. ولا يوجد تسجيل دخول لتجربه - فالمحاولة ستفشل، ولذلك لا نعرضها.",
  cardTitle:"What this means",cardTitleAr:"ماذا يعني هذا",
  lines:[
   ["no","You cannot sign in, and every session you had was ended.","لا يمكنك تسجيل الدخول، وأُنهيت كل جلسة كانت لك."],
   ["yes","Everything you did stays on the account - bookings, changes, notes, and your name in the activity log.","وكل ما فعلته يبقى على الحساب - الحجوزات والتغييرات والملاحظات واسمك في سجل النشاط."],
   ["yes","Your work is not deleted and does not need to be handed over.","وعملك غير محذوف ولا يحتاج تسليمًا."],
   ["info","Deactivation is not deletion. The Owner can turn your access back on, and your history comes back with you.","والتعطيل ليس حذفًا. وللمالك أن يعيد صلاحيتك، ويعود تاريخك معك."],
   ["info","Talk to the Owner of the supplier account - they control this, not Hoteliana.","تحدث إلى مالك حساب المورّد - فهو من يتحكم بهذا لا هوتيليانا."],
   ["info","If the Owner is unreachable, Hoteliana can confirm who holds the account.","وإن تعذّر الوصول إلى المالك فبإمكان هوتيليانا تأكيد من يملك الحساب."],
  ],
  actions:[{label:"Contact the Owner",labelAr:"تواصل مع المالك",primary:true},{label:"Contact Hoteliana",labelAr:"تواصل مع هوتيليانا"}],
 },
 changed:{
  label:"Permissions changed",labelAr:"تغيّرت الصلاحيات",
  title:"Your role changed while you were working.",titleAr:"تغيّر دورك وأنت تعمل.",
  body:"The screen you were on is no longer in your reach. Nothing you already saved was undone.",
  bodyAr:"الشاشة التي كنت عليها لم تعد في مدّك. ولم يُلغَ شيء حفظته بالفعل.",
  cardTitle:"What changed",cardTitleAr:"ما الذي تغيّر",
  lines:[
   ["info","The Owner changed what your role reaches - it is recorded in the activity log.","غيّر المالك ما يصل إليه دورك - وهو مسجّل في سجل النشاط."],
   ["yes","Whatever you saved before the change stayed saved.","وما حفظته قبل التغيير بقي محفوظًا."],
  ],
  actions:[{label:"Back to dashboard",labelAr:"العودة إلى لوحة اليوم",primary:true}],
 },
};

/** UI 11.11 — the November grid, with the three cells that stopped. */
export const conflictNights = Array.from({length:40},(_,i)=>{
  const day=i+1;
  const label=day<=30?`${day} Nov`:`${day-30} Dec`;
  const conflict=day===12||day===13||day===26;
  return {label,value:conflict?"conflict":"8",conflict};
});
