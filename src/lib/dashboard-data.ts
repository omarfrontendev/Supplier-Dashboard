import type { TeamRole } from "./team-data";

export const dashboardMonths = [
  { month:"Oct", monthAr:"أكتوبر", nights:74, rate:352, yoy:"+4%", cash:42 },
  { month:"Nov", monthAr:"نوفمبر", nights:82, rate:358, yoy:"+9%", cash:47 },
  { month:"Dec", monthAr:"ديسمبر", nights:98, rate:372, yoy:"+6%", cash:54 },
  { month:"Jan", monthAr:"يناير", nights:90, rate:381, yoy:"−2%", cash:53 },
  { month:"Feb", monthAr:"فبراير", nights:126, rate:425, yoy:"+18%", cash:72 },
  { month:"Mar", monthAr:"مارس", nights:156, rate:448, yoy:"+21%", cash:95 },
  { month:"Apr", monthAr:"أبريل", nights:113, rate:392, yoy:"+7%", cash:67 },
  { month:"May", monthAr:"مايو", nights:92, rate:366, yoy:"−3%", cash:51 },
  { month:"Jun", monthAr:"يونيو", nights:84, rate:358, yoy:"−5%", cash:46 },
  { month:"Jul", monthAr:"يوليو", nights:100, rate:352, yoy:"+2%", cash:55 },
  { month:"Aug", monthAr:"أغسطس", nights:110, rate:371, yoy:"+11%", cash:64 },
  { month:"Sep", monthAr:"سبتمبر", nights:111, rate:379, yoy:"+8%", cash:60 },
];

export const kpis = [
  { key:"nights", value:"1,236", delta:"+12% vs last year", positive:true },
  { key:"earned", value:"486,300", delta:"SAR · +9% vs last year", positive:true },
  { key:"rate", value:"379", delta:"SAR a room-night · −3%", positive:false },
  { key:"sold", value:"71%", delta:"+4 points", positive:true },
  { key:"clock", value:"92%", delta:"−5 points · 11 expired", positive:false },
] as const;

export const pickupData = Array.from({length:13},(_,i)=>({night:i*5,now:[6,8,5,12,9,7,13,10,18,14,16,15,16]![i],last:[5,9,6,11,8,9,12,9,14,13,15,15,16]![i]}));
export const leadTimeData = [{label:"0-3 days",value:214},{label:"4-7",value:268},{label:"8-14",value:312},{label:"15-30",value:256},{label:"31-60",value:152},{label:"60+",value:82}];
/**
 * UI 09.0 - how full each room is over the fourteen nights the frame
 * draws. 1 is empty and 7 is full, which are the seven steps of the scale
 * printed under the plot; "blocked" is a night nothing can be bought on,
 * and the frame draws it as a white cell with a pink outline rather than
 * as a step on the ramp - it is not a low number, it is not a number.
 *
 * The values are the frame's own, read off the marks, not generated.
 */
export type HeatCell = number | "blocked";

export const heatmapNights = {
  days: [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
  from: "17 Sep",
  fromAr: "١٧ سبتمبر",
  to: "30 Sep",
  toAr: "٣٠ سبتمبر",
};

export const heatmapRooms: Array<{
  room: string;
  roomAr: string;
  values: HeatCell[];
}> = [
  {
    room: "Standard Room",
    roomAr: "غرفة ستاندرد",
    values: [6, 7, 7, 5, 4, 6, 7, 7, 6, 5, 4, 5, 6, 7],
  },
  {
    room: "Deluxe City View",
    roomAr: "غرفة ديلوكس · إطلالة المدينة",
    values: [5, 6, 7, 7, 6, 4, 5, 6, "blocked", "blocked", 5, 4, 5, 6],
  },
  {
    room: "Deluxe Partial Haram View",
    roomAr: "غرفة ديلوكس · إطلالة جزئية على الحرم",
    values: [4, 5, 6, 6, 7, 7, 6, 5, 4, 5, 6, 6, 7, 7],
  },
  {
    room: "Junior Suite",
    roomAr: "جناح جونيور",
    values: [3, 4, "blocked", "blocked", 6, 6, 5, 4, 3, 4, 5, 5, 6, 6],
  },
];

/** What the legend counts - read off the grid, so it cannot disagree. */
export const heatmapBlockedNights = heatmapRooms.reduce(
  (total, row) => total + row.values.filter((v) => v === "blocked").length,
  0
);

/** UI 09.0 — every lost night is owned by you, by a clock, or by Hoteliana. */
export const lostNights = [
  {label:"No price set",value:412,owner:"yours"},
  {label:"Stopped by you",value:268,owner:"yours"},
  {label:"Release date passed",value:176,owner:"a clock"},
  {label:"Not on the contract",value:94,owner:"yours"},
  {label:"Room is not mapped yet",value:61,owner:"Hoteliana"},
  {label:"Paused by Hoteliana",value:0,owner:"Hoteliana"},
];
export const requestOutcomes = [{name:"Confirmed",value:186},{name:"Rejected by you",value:24},{name:"Expired on the clock",value:11}];

export type DashboardRole = Extract<TeamRole,"owner"|"revenue"|"reservations"|"finance"|"frontOffice">;
export type NeedKey = "answer"|"cancellation"|"amendments"|"unsellable"|"entry"|"rates"|"room";
export type NeedTone = "problem"|"answer"|"watch"|"info";
export interface NeedItem {
  key: NeedKey;
  count: number;
  tone: NeedTone;
  title: string; titleAr: string;
  meta: string; metaAr: string;
  detail: string; detailAr: string;
  action: string; actionAr: string;
  to: "/bookings"|"/bookings/change-requests"|"/rate-calendar"|"/requests"|"/finance";
}
export const needItems:Record<NeedKey,NeedItem> = {
 answer:{key:"answer",count:2,tone:"problem",title:"On Request bookings need an answer",titleAr:"حجوزات عند الطلب تحتاج ردًا",meta:"⏱ 18 min left · expires today 11:00",metaAr:"⏱ بقيت ١٨ دقيقة · تنتهي اليوم ١١:٠٠",detail:"After that you cannot take it - the request is auto-rejected and Hoteliana takes it from there.",detailAr:"بعدها لا يمكنك قبوله - يُرفض الطلب تلقائيًا وتتولاه هوتيليانا.",action:"Answer them",actionAr:"الرد عليها",to:"/bookings"},
 cancellation:{key:"cancellation",count:1,tone:"answer",title:"cancellation needs you to confirm the charge",titleAr:"إلغاء يحتاج تأكيدك للرسم",meta:"asked today 09:40 · waiting 1h 02m",metaAr:"طُلب اليوم ٠٩:٤٠ · ينتظر ساعة و٠٢ دقيقة",detail:"You cannot refuse it - only price it. Up to 1,420 SAR is yours to keep.",detailAr:"لا يمكنك رفضه - إنما تسعيره فقط. وحتى ١٬٤٢٠ ر.س من حقك.",action:"Confirm the charge",actionAr:"تأكيد الرسم",to:"/bookings/change-requests"},
 amendments:{key:"amendments",count:2,tone:"answer",title:"amendments need your decision",titleAr:"تعديلان يحتاجان قرارك",meta:"oldest asked today 08:15 · waiting 2h 27m",metaAr:"أقدمها طُلب اليوم ٠٨:١٥ · ينتظر ساعتين و٢٧ دقيقة",detail:"One needs a room you already have free; the other is asking you to quote a night.",detailAr:"أحدهما يحتاج غرفة متاحة لديك بالفعل، والآخر يطلب تسعير ليلة.",action:"Open the queue",actionAr:"فتح القائمة",to:"/bookings/change-requests"},
 unsellable:{key:"unsellable",count:3,tone:"problem",title:"rooms cannot be sold at all",titleAr:"غرف لا يمكن بيعها إطلاقًا",meta:"since Monday · no deadline, but nothing sells meanwhile",metaAr:"منذ الاثنين · بلا موعد نهائي، ولا يُباع شيء في هذه الأثناء",detail:"2 have no rate and 1 is stopped - agents get nothing back when they search these nights.",detailAr:"اثنتان بلا سعر وواحدة موقوفة - ولا يجد الوكلاء شيئًا عند البحث في هذه الليالي.",action:"See why",actionAr:"معرفة السبب",to:"/rate-calendar"},
 entry:{key:"entry",count:1,tone:"watch",title:"entry posted against your account",titleAr:"قيد سُجّل على حسابك",meta:"13 Sep 11:20 · − 3,540 SAR",metaAr:"١٣ سبتمبر ١١:٢٠ · − ٣٬٥٤٠ ر.س",detail:"A guest was relocated. It is already off your balance - call Hoteliana if the number looks wrong.",detailAr:"نُقل نزيل. وقد خُصم القيد من رصيدك فعلًا - اتصل بهوتيليانا إن بدا الرقم خاطئًا.",action:"Open the entry",actionAr:"فتح القيد",to:"/finance"},
 rates:{key:"rates",count:18,tone:"answer",title:"rate changes are not published",titleAr:"تغييرات أسعار لم تُنشر",meta:"held since today 11:04",metaAr:"محتجزة منذ اليوم ١١:٠٤",detail:"Agents are still being quoted your old prices for 24-26 September and 1-3 October.",detailAr:"ما زال الوكلاء يُعرض عليهم سعرك القديم لـ٢٤-٢٦ سبتمبر و١-٣ أكتوبر.",action:"Publish them",actionAr:"نشرها",to:"/rate-calendar"},
 room:{key:"room",count:1,tone:"info",title:"room is waiting on Hoteliana",titleAr:"غرفة بانتظار هوتيليانا",meta:"requested 9 Sep · nothing you can do",metaAr:"طُلبت ٩ سبتمبر · لا شيء بيدك",detail:"Until it is added to the catalogue you cannot sell it - it is not counted as your problem.",detailAr:"لا يمكنك بيعها حتى تُضاف إلى الكتالوج - ولا تُحسب مشكلتك.",action:"See the request",actionAr:"عرض الطلب",to:"/requests"},
};

export const roleNeeds:Record<DashboardRole,NeedKey[]>={owner:["answer","cancellation","amendments","unsellable","entry","rates","room"],revenue:["unsellable","rates","room"],reservations:["answer","cancellation","amendments","rates"],finance:["entry"],frontOffice:["room"]};
/** UI 09.1B — Reservations sees the held rates but cannot publish them. */
export const lockedNeeds:Partial<Record<DashboardRole,{key:NeedKey;action:string;actionAr:string;permission:string}>>={reservations:{key:"rates",action:"Waiting for someone who can publish",actionAr:"بانتظار من يملك صلاحية النشر",permission:"you do not have publish rates"}};

export const roleNames:Record<DashboardRole,string>={owner:"Abdullrahman",revenue:"Ahmed",reservations:"Layla",finance:"Faisal",frontOffice:"Noura"};
export const roleNamesAr:Record<DashboardRole,string>={owner:"عبدالرحمن",revenue:"أحمد",reservations:"ليلى",finance:"فيصل",frontOffice:"نورة"};

export interface RoleIntro { context:string; contextAr:string; title:string; titleAr:string; body:string; bodyAr:string; today:boolean }
export const roleIntro:Record<DashboardRole,RoleIntro>={
 owner:{context:"Thursday 17 September 2026  ·  Jewar Al-Safwah  ·  3 hotels  ·  contract active to 31 Dec 2026",contextAr:"الخميس ١٧ سبتمبر ٢٠٢٦  ·  جوار الصفوة  ·  ٣ فنادق  ·  العقد فعّال حتى ٣١ ديسمبر ٢٠٢٦",title:"Six things need you · one more is for your information",titleAr:"ستة أمور تحتاجك · وأمر آخر للعلم",body:"In the order that costs you most if you leave it - an expiring clock first, then a decision someone is waiting for, then what is blocking a sale, then money, then your own drafts. Everything else in the portal can wait until this list is clear.",bodyAr:"بالترتيب الذي يكلفك أكثر إن تركته - المؤقت المنتهي أولًا، ثم قرار ينتظره أحد، ثم ما يمنع بيعًا، ثم المال، ثم مسوداتك أنت. وكل ما عدا ذلك في البوابة ينتظر حتى تُفرغ هذه القائمة.",today:true},
 revenue:{context:"Thursday 17 September 2026  ·  Jewar Al-Safwah  ·  Revenue manager ·  rates, rooms and availability",contextAr:"الخميس ١٧ سبتمبر ٢٠٢٦  ·  جوار الصفوة  ·  مدير الإيرادات ·  الأسعار والغرف والتوفر",title:"Two things need you · one more is for your information",titleAr:"أمران يحتاجانك · وأمر آخر للعلم",body:"Everything here is about what can be sold and at what price. Bookings and money are not yours to answer - they do not appear, and they are not hidden behind a locked button either.",bodyAr:"كل ما هنا يخص ما يمكن بيعه وبأي سعر. أما الحجوزات والمال فليست من شأنك - ولا تظهر أصلًا، ولا تختبئ خلف زر مقفل.",today:false},
 reservations:{context:"Thursday 17 September 2026  ·  Jewar Al-Safwah  ·  Reservations ·  you answer bookings, you never price them",contextAr:"الخميس ١٧ سبتمبر ٢٠٢٦  ·  جوار الصفوة  ·  الحجوزات ·  ترد على الحجوزات ولا تسعّرها أبدًا",title:"Three things need you · one more is for your information",titleAr:"ثلاثة أمور تحتاجك · وأمر آخر للعلم",body:"Three need an answer from you. The fourth you can see but not act on - it is here so you know why agents are still being quoted the old price.",bodyAr:"ثلاثة تحتاج ردك. والرابع تراه ولا تتصرف فيه - وهو هنا لتعرف لماذا ما زال الوكلاء يُعرض عليهم السعر القديم.",today:true},
 finance:{context:"Thursday 17 September 2026  ·  Jewar Al-Safwah  ·  Finance ·  the account and the money side of a booking",contextAr:"الخميس ١٧ سبتمبر ٢٠٢٦  ·  جوار الصفوة  ·  المالية ·  الحساب والجانب المالي للحجز",title:"One thing is waiting on you",titleAr:"أمر واحد بانتظارك",body:"You see the money side of every booking - reference, stay, your cost and the fees - and never the guest’s identity.",bodyAr:"ترى الجانب المالي لكل حجز - المرجع والإقامة وتكلفتك والرسوم - ولا ترى هوية النزيل أبدًا.",today:false},
 frontOffice:{context:"Thursday 17 September 2026  ·  Jewar Al-Safwah  ·  Front office ·  the desk",contextAr:"الخميس ١٧ سبتمبر ٢٠٢٦  ·  جوار الصفوة  ·  الاستقبال ·  مكتب الاستقبال",title:"Also on your desk",titleAr:"أيضًا على مكتبك",body:"Not arrivals - mostly things waiting on someone else. Nothing here stops a guest checking in.",bodyAr:"ليست وصولات - بل أمور تنتظر غيرك غالبًا. ولا شيء هنا يمنع نزيلًا من تسجيل دخوله.",today:true},
};

export interface SupplyTile { count:number; tone:NeedTone; label:string; labelAr:string; detail:string; detailAr:string; action:string; actionAr:string }
/** UI 09.1 — the next fourteen nights, and which of them are actually problems. */
export const supplyTiles:SupplyTile[]=[
 {count:3,tone:"problem",label:"rooms cannot be sold",labelAr:"غرف لا يمكن بيعها",detail:"2 missing a rate · 1 stopped",detailAr:"اثنتان بلا سعر · وواحدة موقوفة",action:"See why",actionAr:"معرفة السبب"},
 {count:2,tone:"answer",label:"nights you stopped yourself",labelAr:"ليالٍ أوقفتها بنفسك",detail:"Deluxe City View · 18 and 19 Sep",detailAr:"ديلوكس بإطلالة المدينة · ١٨ و١٩ سبتمبر",action:"Review them",actionAr:"مراجعتها"},
 {count:4,tone:"watch",label:"nights running low",labelAr:"ليالٍ يقل مخزونها",detail:"4 rooms or fewer left · 12-15 Sep",detailAr:"٤ غرف أو أقل · ١٢-١٥ سبتمبر",action:"Open the grid",actionAr:"فتح الشبكة"},
 {count:2,tone:"info",label:"nights sold out",labelAr:"ليالٍ نفدت",detail:"Standard Room · 12 and 19 Sep · this one is good news",detailAr:"الغرفة القياسية · ١٢ و١٩ سبتمبر · وهذه بشارة",action:"See what sold",actionAr:"عرض ما بيع"},
];

export interface MoneyTile { label:string; labelAr:string; value:string; valueAr:string; note:string; noteAr:string }
export const moneyTiles:MoneyTile[]=[
 {label:"UPCOMING",labelAr:"قادم",value:"44,180",valueAr:"٤٤٬١٨٠",note:"SAR · 12 bookings not stayed yet - not owed to you yet",noteAr:"ر.س · ١٢ حجزًا لم تُقم بعد - وليست مستحقة لك بعد"},
 {label:"WAITING TO BE SETTLED",labelAr:"بانتظار التسوية",value:"9,500",valueAr:"٩٬٥٠٠",note:"SAR · earned and unpaid · no date promised",noteAr:"ر.س · مكتسبة وغير مدفوعة · بلا تاريخ موعود"},
 {label:"ENTRIES AGAINST YOU",labelAr:"قيود عليك",value:"− 4,740",valueAr:"− ٤٬٧٤٠",note:"SAR this month · relocation and one settlement",noteAr:"ر.س هذا الشهر · نقل نزيل وتسوية واحدة"},
];
export const lastPayment={en:"Last payment 8 Sep · PAY-014 · 11,460 SAR",ar:"آخر دفعة ٨ سبتمبر · PAY-014 · ١١٬٤٦٠ ر.س"};

/** UI 09.1 — every row here is a link, and so is its Open button. */
export interface PendingPerson { initial:string; name:string; nameAr:string; pending:string; pendingAr:string; open:boolean; to:string }
export const pendingPeople:PendingPerson[]=[
 {initial:"L",name:"Layla Hassan · Reservations",nameAr:"ليلى حسن · الحجوزات",pending:"2 On Request bookings · 1 expires in 18 minutes",pendingAr:"حجزان عند الطلب · أحدهما ينتهي خلال ١٨ دقيقة",open:true,to:"/bookings/HTL-88214"},
 {initial:"A",name:"Ahmed Saleh · Revenue manager",nameAr:"أحمد صالح · مدير الإيرادات",pending:"3 rate changes held, unpublished since today 11:04",pendingAr:"٣ تغييرات سعر محتجزة وغير منشورة منذ اليوم ١١:٠٤",open:true,to:"/rate-calendar"},
 {initial:"F",name:"Faisal Al-Otaibi · Finance",nameAr:"فيصل العتيبي · المالية",pending:"nothing pending",pendingAr:"لا شيء معلّق",open:false,to:"/finance"},
 {initial:"N",name:"Noura Saad · Front office",nameAr:"نورة سعد · الاستقبال",pending:"4 arrivals to check in today",pendingAr:"٤ وصولات لتسجيل دخولها اليوم",open:false,to:"/bookings"},
];

export interface DeskGuest { name:string; nameAr:string; stay:string; stayAr:string; reference:string; flag?:string; flagAr?:string }
/** UI 09.1D — the front desk's own day. */
export const arrivingToday:DeskGuest[]=[
 {name:"Sara Khalid",nameAr:"سارة خالد",stay:"Standard Room · Room Only · 4 nights",stayAr:"غرفة قياسية · بدون وجبات · ٤ ليالٍ",reference:"HTL-88198 · ref HL-77412",flag:"⚑ late arrival after 22:00",flagAr:"⚑ وصول متأخر بعد ٢٢:٠٠"},
 {name:"Ahmed Nasser",nameAr:"أحمد ناصر",stay:"Deluxe Partial Haram View · 3 rooms · 4 nights",stayAr:"ديلوكس بإطلالة جزئية على الحرم · ٣ غرف · ٤ ليالٍ",reference:"HTL-88205 · ref HL-77406",flag:"⚑ ground floor if possible",flagAr:"⚑ الدور الأرضي إن أمكن"},
 {name:"Mona Ibrahim",nameAr:"منى إبراهيم",stay:"Standard Room · B&B · 2 nights",stayAr:"غرفة قياسية · مع الإفطار · ليلتان",reference:"HTL-88209 · ref not issued yet"},
 {name:"Salem Al-Ghamdi",nameAr:"سالم الغامدي",stay:"Standard Room · 3 nights",stayAr:"غرفة قياسية · ٣ ليالٍ",reference:"HTL-88131 · on request · not confirmed",flag:"⚑ arriving 15:00 if you take it",flagAr:"⚑ يصل ١٥:٠٠ إن قبلته"},
];
export const leavingToday:DeskGuest[]=[
 {name:"Majed Al-Harbi",nameAr:"ماجد الحربي",stay:"Standard Room · checked out 11:00",stayAr:"غرفة قياسية · غادر ١١:٠٠",reference:""},
 {name:"Hind Al-Zahrani",nameAr:"هند الزهراني",stay:"Deluxe City View · leaving before noon",stayAr:"ديلوكس بإطلالة المدينة · يغادر قبل الظهر",reference:""},
 {name:"Omar Bakr",nameAr:"عمر بكر",stay:"Standard Room · late checkout agreed, 16:00",stayAr:"غرفة قياسية · مغادرة متأخرة متفق عليها ١٦:٠٠",reference:""},
];

export interface InsightCard { title:string; titleAr:string; body:string; bodyAr:string; action:string; actionAr:string; to:"/rate-calendar"|"/bookings"|"/rate-contracts" }
/** UI 09.0 — the three things the year is telling you to do. */
export const insightCards:InsightCard[]=[
 {title:"Price the four weeks around Ramadan before anything else",titleAr:"سعّر الأسابيع الأربعة حول رمضان قبل أي شيء آخر",body:"March is 12% of your year and your highest rate. Last year you opened it 19 days late - 412 of the 1,011 lost nights are simply nights that had no price.",bodyAr:"مارس ١٢٪ من عامك وأعلى أسعارك. وفي العام الماضي فتحته متأخرًا ١٩ يومًا - و٤١٢ من الليالي الضائعة الـ١٬٠١١ هي ببساطة ليالٍ بلا سعر.",action:"Open the calendar on March",actionAr:"فتح التقويم على مارس",to:"/rate-calendar"},
 {title:"Answer On Request faster, or stop taking it on the tightest rooms",titleAr:"رُدّ على «عند الطلب» أسرع، أو أوقف قبوله في أضيق الغرف",body:"Eleven expired on the clock and 62% of your demand arrives inside 14 days. Expiry is the only outcome on this page where nobody decided anything.",bodyAr:"انتهى أحد عشر طلبًا بالمؤقت، و٦٢٪ من طلبك يصل خلال ١٤ يومًا. والانتهاء هو النتيجة الوحيدة في هذه الصفحة التي لم يقررها أحد.",action:"See the On Request queue",actionAr:"عرض قائمة عند الطلب",to:"/bookings"},
 {title:"Your rate is 3% softer while volume is up 12%",titleAr:"سعرك أليَن بـ٣٪ بينما ارتفعت الكمية ١٢٪",body:"You are selling more at slightly less. That is a choice if you made it on purpose and a leak if you did not - the season editor is where it was set.",bodyAr:"تبيع أكثر بأقل قليلًا. وهذا خيار إن قصدته وتسريب إن لم تقصده - ومحرر المواسم هو موضع ضبطه.",action:"Open the contract seasons",actionAr:"فتح مواسم العقد",to:"/rate-contracts"},
];
