export type TeamRole = "owner" | "admin" | "revenue" | "reservations" | "frontOffice" | "finance" | "auditor";
export type TeamStatus = "active" | "invited" | "expired" | "deactivated" | "inactive";
export type ActivityArea = "rates" | "inventory" | "bookings" | "finance" | "hotels" | "users";
export type ActivityActor = "team" | "hoteliana" | "system" | "api";

export interface TeamMember {
  id: string;
  name: string;
  nameAr: string;
  email: string;
  role: TeamRole;
  status: TeamStatus;
  lastSeen: string;
  lastSeenAr: string;
  addedBy: string;
  /** UI 08.0 — what the row prints when it is not simply the role name. */
  roleLabel?: string | undefined;
  roleLabelAr?: string | undefined;
  /** UI 08.0 — the reach chips drawn on the row itself. */
  reach: string[];
  reachAr: string[];
  /** UI 08.0E keeps the expired-invitation chip on the row after it is accepted. */
  inviteExpired?: boolean | undefined;
  isCurrent?: boolean | undefined;
  auditorReach?: string[] | undefined;
}

export interface ActivityEntry {
  id: string;
  when: string;
  whenAr: string;
  actor: string;
  actorAr: string;
  actorType: ActivityActor;
  role: string;
  roleAr: string;
  action: string;
  actionAr: string;
  record: string;
  recordAr: string;
  area: ActivityArea;
}

export const roleOrder: TeamRole[] = ["owner", "admin", "revenue", "reservations", "frontOffice", "finance", "auditor"];

export const teamSeed: TeamMember[] = [
  { id:"USR-001", name:"Abdullrahman Najeh", nameAr:"عبدالرحمن ناجح", email:"owner@jewaralsafwah.com", role:"owner", status:"active", lastSeen:"you · now", lastSeenAr:"أنت · الآن", addedBy:"Account creator",reach:["Everything","Users","Hands over the account"],reachAr:["كل شيء","المستخدمون","يسلّم الحساب"], isCurrent:true },
  { id:"USR-002", name:"Ahmed Saleh", nameAr:"أحمد صالح", email:"ahmed@jewaralsafwah.com", role:"revenue", status:"active", lastSeen:"today 08:12", lastSeenAr:"اليوم ٠٨:١٢", addedBy:"You · 3 March 2026",reach:["Hotels","Rates","Inventory","Sold counts, no names"],reachAr:["الفنادق","الأسعار","المخزون","أعداد البيع دون أسماء"] },
  { id:"USR-003", name:"Layla Hassan", nameAr:"ليلى حسن", email:"layla@jewaralsafwah.com", role:"reservations", roleLabel:"Night desk", roleLabelAr:"مكتب الليل", status:"active", lastSeen:"yesterday 22:10", lastSeenAr:"أمس ٢٢:١٠", addedBy:"You · 3 March 2026",reach:["Bookings · answers them","Guest details","Stop sale"],reachAr:["الحجوزات · يرد عليها","بيانات النزيل","إيقاف البيع"] },
  { id:"USR-004", name:"Noura Saad", nameAr:"نورة سعد", email:"noura@jewaralsafwah.com", role:"frontOffice", status:"active", lastSeen:"today 07:05", lastSeenAr:"اليوم ٠٧:٠٥", addedBy:"You · 4 March 2026",reach:["The desk · arrivals","Guest details","No money"],reachAr:["الاستقبال · الوصول","بيانات النزيل","دون مالية"] },
  { id:"USR-005", name:"Faisal Al-Otaibi", nameAr:"فيصل العتيبي", email:"faisal@jewaralsafwah.com", role:"finance", status:"active", lastSeen:"8 Sep 16:20", lastSeenAr:"٨ سبتمبر ١٦:٢٠", addedBy:"You · 8 March 2026",reach:["Finance","Booking money, no names"],reachAr:["المالية","قيمة الحجز دون أسماء"] },
  { id:"USR-006", name:"Khalid Al-Amri", nameAr:"خالد العمري", email:"khalid@jewaralsafwah.com", role:"reservations", status:"invited", lastSeen:"never · expires in 5 days", lastSeenAr:"لم يدخل · تنتهي خلال ٥ أيام", addedBy:"You · today",reach:["nothing until he accepts"],reachAr:["لا شيء حتى يقبل الدعوة"] },
  { id:"USR-008", name:"Tariq Bin Saleh", nameAr:"طارق بن صالح", email:"tariq@jewaralsafwah.com", role:"admin", roleLabel:"was to be Admin", roleLabelAr:"كان سيصبح مديرًا", status:"expired", lastSeen:"never · expired 2 Sep", lastSeenAr:"لم يدخل · انتهت ٢ سبتمبر", addedBy:"You · 26 August 2026", reach:["nothing - the link is dead"], reachAr:["لا شيء - الرابط منتهٍ"] },
  { id:"USR-007", name:"Mariam Zaki", nameAr:"مريم زكي", email:"mariam@jewaralsafwah.com", role:"auditor", roleLabel:"Auditor · read only", roleLabelAr:"مدقّق · قراءة فقط", status:"deactivated", lastSeen:"12 Aug 11:05", lastSeenAr:"١٢ أغسطس ١١:٠٥", addedBy:"You · 2 February 2026",reach:["nothing while deactivated"],reachAr:["لا شيء ما دام الحساب معطّلًا"], auditorReach:["finance"] },
  { id:"USR-006", name:"Khalid Al-Amri", nameAr:"خالد العمري", email:"khalid@jewaralsafwah.com", role:"reservations", status:"invited", lastSeen:"never · expires in 5 days", lastSeenAr:"لم يدخل · تنتهي خلال ٥ أيام", addedBy:"You · today",reach:["nothing until he accepts"],reachAr:["لا شيء حتى يقبل الدعوة"] },
  { id:"USR-008", name:"Tariq Bin Saleh", nameAr:"طارق بن صالح", email:"tariq@jewaralsafwah.com", role:"admin", roleLabel:"was to be Admin", roleLabelAr:"كان سيصبح مديرًا", status:"expired", lastSeen:"never · expired 2 Sep", lastSeenAr:"لم يدخل · انتهت ٢ سبتمبر", addedBy:"You · 26 August 2026", reach:["nothing - the link is dead"], reachAr:["لا شيء - الرابط منتهٍ"] },
  { id:"USR-007", name:"Mariam Zaki", nameAr:"مريم زكي", email:"mariam@jewaralsafwah.com", role:"auditor", roleLabel:"Auditor · read only", roleLabelAr:"مدقّق · قراءة فقط", status:"deactivated", lastSeen:"12 Aug 11:05", lastSeenAr:"١٢ أغسطس ١١:٠٥", addedBy:"You · 2 February 2026",reach:["nothing while deactivated"],reachAr:["لا شيء ما دام الحساب معطّلًا"], auditorReach:["finance"] },
  { id:"USR-006", name:"Khalid Al-Amri", nameAr:"خالد العمري", email:"khalid@jewaralsafwah.com", role:"reservations", status:"invited", lastSeen:"never · expires in 5 days", lastSeenAr:"لم يدخل · تنتهي خلال ٥ أيام", addedBy:"You · today",reach:["nothing until he accepts"],reachAr:["لا شيء حتى يقبل الدعوة"] },
  { id:"USR-008", name:"Tariq Bin Saleh", nameAr:"طارق بن صالح", email:"tariq@jewaralsafwah.com", role:"admin", roleLabel:"was to be Admin", roleLabelAr:"كان سيصبح مديرًا", status:"expired", lastSeen:"never · expired 2 Sep", lastSeenAr:"لم يدخل · انتهت ٢ سبتمبر", addedBy:"You · 26 August 2026", reach:["nothing - the link is dead"], reachAr:["لا شيء - الرابط منتهٍ"] },
  { id:"USR-007", name:"Mariam Zaki", nameAr:"مريم زكي", email:"mariam@jewaralsafwah.com", role:"auditor", roleLabel:"Auditor · read only", roleLabelAr:"مدقّق · قراءة فقط", status:"deactivated", lastSeen:"12 Aug 11:05", lastSeenAr:"١٢ أغسطس ١١:٠٥", addedBy:"You · 2 February 2026",reach:["nothing while deactivated"],reachAr:["لا شيء ما دام الحساب معطّلًا"], auditorReach:["finance"] },
  { id:"USR-006", name:"Khalid Al-Amri", nameAr:"خالد العمري", email:"khalid@jewaralsafwah.com", role:"reservations", status:"invited", lastSeen:"never · expires in 5 days", lastSeenAr:"لم يدخل · تنتهي خلال ٥ أيام", addedBy:"You · today",reach:["nothing until he accepts"],reachAr:["لا شيء حتى يقبل الدعوة"] },
  { id:"USR-008", name:"Tariq Bin Saleh", nameAr:"طارق بن صالح", email:"tariq@jewaralsafwah.com", role:"admin", roleLabel:"was to be Admin", roleLabelAr:"كان سيصبح مديرًا", status:"expired", lastSeen:"never · expired 2 Sep", lastSeenAr:"لم يدخل · انتهت ٢ سبتمبر", addedBy:"You · 26 August 2026", reach:["nothing - the link is dead"], reachAr:["لا شيء - الرابط منتهٍ"] },
  { id:"USR-007", name:"Mariam Zaki", nameAr:"مريم زكي", email:"mariam@jewaralsafwah.com", role:"auditor", roleLabel:"Auditor · read only", roleLabelAr:"مدقّق · قراءة فقط", status:"deactivated", lastSeen:"12 Aug 11:05", lastSeenAr:"١٢ أغسطس ١١:٠٥", addedBy:"You · 2 February 2026",reach:["nothing while deactivated"],reachAr:["لا شيء ما دام الحساب معطّلًا"], auditorReach:["finance"] },
  { id:"USR-006", name:"Khalid Al-Amri", nameAr:"خالد العمري", email:"khalid@jewaralsafwah.com", role:"reservations", status:"invited", lastSeen:"never · expires in 5 days", lastSeenAr:"لم يدخل · تنتهي خلال ٥ أيام", addedBy:"You · today",reach:["nothing until he accepts"],reachAr:["لا شيء حتى يقبل الدعوة"] },
  { id:"USR-008", name:"Tariq Bin Saleh", nameAr:"طارق بن صالح", email:"tariq@jewaralsafwah.com", role:"admin", roleLabel:"was to be Admin", roleLabelAr:"كان سيصبح مديرًا", status:"expired", lastSeen:"never · expired 2 Sep", lastSeenAr:"لم يدخل · انتهت ٢ سبتمبر", addedBy:"You · 26 August 2026", reach:["nothing - the link is dead"], reachAr:["لا شيء - الرابط منتهٍ"] },
  { id:"USR-007", name:"Mariam Zaki", nameAr:"مريم زكي", email:"mariam@jewaralsafwah.com", role:"auditor", roleLabel:"Auditor · read only", roleLabelAr:"مدقّق · قراءة فقط", status:"deactivated", lastSeen:"12 Aug 11:05", lastSeenAr:"١٢ أغسطس ١١:٠٥", addedBy:"You · 2 February 2026",reach:["nothing while deactivated"],reachAr:["لا شيء ما دام الحساب معطّلًا"], auditorReach:["finance"] },
  { id:"USR-006", name:"Khalid Al-Amri", nameAr:"خالد العمري", email:"khalid@jewaralsafwah.com", role:"reservations", status:"invited", lastSeen:"never · expires in 5 days", lastSeenAr:"لم يدخل · تنتهي خلال ٥ أيام", addedBy:"You · today",reach:["nothing until he accepts"],reachAr:["لا شيء حتى يقبل الدعوة"] },
  { id:"USR-008", name:"Tariq Bin Saleh", nameAr:"طارق بن صالح", email:"tariq@jewaralsafwah.com", role:"admin", roleLabel:"was to be Admin", roleLabelAr:"كان سيصبح مديرًا", status:"expired", lastSeen:"never · expired 2 Sep", lastSeenAr:"لم يدخل · انتهت ٢ سبتمبر", addedBy:"You · 26 August 2026", reach:["nothing - the link is dead"], reachAr:["لا شيء - الرابط منتهٍ"] },
  { id:"USR-007", name:"Mariam Zaki", nameAr:"مريم زكي", email:"mariam@jewaralsafwah.com", role:"auditor", roleLabel:"Auditor · read only", roleLabelAr:"مدقّق · قراءة فقط", status:"deactivated", lastSeen:"12 Aug 11:05", lastSeenAr:"١٢ أغسطس ١١:٠٥", addedBy:"You · 2 February 2026",reach:["nothing while deactivated"],reachAr:["لا شيء ما دام الحساب معطّلًا"], auditorReach:["finance"] },
  { id:"USR-006", name:"Khalid Al-Amri", nameAr:"خالد العمري", email:"khalid@jewaralsafwah.com", role:"reservations", status:"invited", lastSeen:"never · expires in 5 days", lastSeenAr:"لم يدخل · تنتهي خلال ٥ أيام", addedBy:"You · today",reach:["nothing until he accepts"],reachAr:["لا شيء حتى يقبل الدعوة"] },
  { id:"USR-008", name:"Tariq Bin Saleh", nameAr:"طارق بن صالح", email:"tariq@jewaralsafwah.com", role:"admin", roleLabel:"was to be Admin", roleLabelAr:"كان سيصبح مديرًا", status:"expired", lastSeen:"never · expired 2 Sep", lastSeenAr:"لم يدخل · انتهت ٢ سبتمبر", addedBy:"You · 26 August 2026", reach:["nothing - the link is dead"], reachAr:["لا شيء - الرابط منتهٍ"] },
  { id:"USR-007", name:"Mariam Zaki", nameAr:"مريم زكي", email:"mariam@jewaralsafwah.com", role:"auditor", roleLabel:"Auditor · read only", roleLabelAr:"مدقّق · قراءة فقط", status:"deactivated", lastSeen:"12 Aug 11:05", lastSeenAr:"١٢ أغسطس ١١:٠٥", addedBy:"You · 2 February 2026",reach:["nothing while deactivated"],reachAr:["لا شيء ما دام الحساب معطّلًا"], auditorReach:["finance"] },
];

export const activitySeed: ActivityEntry[] = [
  {id:"LOG-0001",when:"today 11:04",whenAr:"اليوم ١١:٠٤",actor:"you",actorAr:"أنت",actorType:"team",role:"Owner",roleAr:"المالك",action:"Applied 3 rate changes and a 2-night minimum stay",actionAr:"طبّقت ٣ تغييرات سعر وحدًا أدنى ليلتين",record:"Al Noor Makkah · 24-26 Sep, 1-3 Oct · not published yet",recordAr:"النور مكة · ٢٤–٢٦ سبتمبر · ١–٣ أكتوبر · لم تُنشر",area:"rates"},
  {id:"LOG-0002",when:"today 10:58",whenAr:"اليوم ١٠:٥٨",actor:"you",actorAr:"أنت",actorType:"team",role:"Owner",roleAr:"المالك",action:"Created 10 draft room rates from the contract",actionAr:"أنشأت ١٠ أسعار غرف مسودة من العقد",record:"Al Noor Makkah · 3 rooms · contract v1.3",recordAr:"النور مكة · ٣ غرف · العقد v1.3",area:"hotels"},
  {id:"LOG-0003",when:"today 10:12",whenAr:"اليوم ١٠:١٢",actor:"Layla Hassan",actorAr:"ليلى حسن",actorType:"team",role:"Reservations",roleAr:"الحجوزات",action:"Confirmed a cancellation at the policy amount",actionAr:"أكدت إلغاءً بقيمة السياسة",record:"HTL-88191 · Yousef Rahman · 1,420 SAR",recordAr:"HTL-88191 · يوسف رحمن · ١٬٤٢٠ ر.س",area:"bookings"},
  {id:"LOG-0004",when:"today 09:40",whenAr:"اليوم ٠٩:٤٠",actor:"Reem Tarek",actorAr:"ريم طارق",actorType:"hoteliana",role:"Hoteliana operations",roleAr:"عمليات Hoteliana",action:"Forwarded a cancellation request",actionAr:"حوّلت طلب إلغاء",record:"HTL-88191 · Yousef Rahman",recordAr:"HTL-88191 · يوسف رحمن",area:"bookings"},
  {id:"LOG-0005",when:"today 08:41",whenAr:"اليوم ٠٨:٤١",actor:"you",actorAr:"أنت",actorType:"team",role:"Owner",roleAr:"المالك",action:"Approved a name change on a booking",actionAr:"وافقت على تغيير اسم في حجز",record:"HTL-88176 · Bader Al-Harbi → Faisal Al-Harbi · booking v2 · AMD-001",recordAr:"HTL-88176 · بدر الحربي ← فيصل الحربي · الحجز v2 · AMD-001",area:"bookings"},
  {id:"LOG-0006",when:"today 08:20",whenAr:"اليوم ٠٨:٢٠",actor:"System",actorAr:"النظام",actorType:"system",role:"automation",roleAr:"تشغيل آلي",action:"Stop sale applied automatically — the release window passed",actionAr:"طُبق إيقاف البيع آليًا — انتهت مهلة الإصدار",record:"Standard Room · 18 Sep · Al Noor Makkah",recordAr:"غرفة قياسية · ١٨ سبتمبر · النور مكة",area:"inventory"},
  {id:"LOG-0007",when:"today 08:15",whenAr:"اليوم ٠٨:١٥",actor:"Reem Tarek",actorAr:"ريم طارق",actorType:"hoteliana",role:"Hoteliana operations",roleAr:"عمليات Hoteliana",action:"Forwarded a name change request",actionAr:"حوّلت طلب تغيير اسم",record:"HTL-88176 · Bader Al-Harbi",recordAr:"HTL-88176 · بدر الحربي",area:"bookings"},
  {id:"LOG-0008",when:"today 08:12",whenAr:"اليوم ٠٨:١٢",actor:"Ahmed Saleh",actorAr:"أحمد صالح",actorType:"team",role:"Revenue manager",roleAr:"مدير الإيرادات",action:"Signed in",actionAr:"سجّل الدخول",record:"-",recordAr:"-",area:"users"},
  {id:"LOG-0009",when:"today 07:30",whenAr:"اليوم ٠٧:٣٠",actor:"Channel",actorAr:"القناة",actorType:"api",role:"API · token JW-441",roleAr:"API · الرمز JW-441",action:"Inventory synced from the channel",actionAr:"تزامن المخزون من القناة",record:"Al Noor Makkah · 3 rooms · 14 nights",recordAr:"النور مكة · ٣ غرف · ١٤ ليلة",area:"inventory"},
  {id:"LOG-0010",when:"yesterday 22:10",whenAr:"أمس ٢٢:١٠",actor:"Layla Hassan",actorAr:"ليلى حسن",actorType:"team",role:"Reservations",roleAr:"الحجوزات",action:"Confirmed an On Request booking",actionAr:"أكدت حجزًا عند الطلب",record:"HTL-88203 · Dana Al-Mutairi",recordAr:"HTL-88203 · دانا المطيري",area:"bookings"},
  {id:"LOG-0011",when:"14 Sep 16:40",whenAr:"١٤ سبتمبر ١٦:٤٠",actor:"Reem Tarek",actorAr:"ريم طارق",actorType:"hoteliana",role:"Hoteliana operations",roleAr:"عمليات Hoteliana",action:"Posted an entry against your account",actionAr:"سجّلت قيدًا على حسابك",record:"ADJ-2026-0042 · − 1,200 SAR · August file",recordAr:"ADJ-2026-0042 · −١٬٢٠٠ ر.س · ملف أغسطس",area:"finance"},
  {id:"LOG-0012",when:"13 Sep 11:20",whenAr:"١٣ سبتمبر ١١:٢٠",actor:"Reem Tarek",actorAr:"ريم طارق",actorType:"hoteliana",role:"Hoteliana operations",roleAr:"عمليات Hoteliana",action:"Posted an entry against your account",actionAr:"سجّلت قيدًا على حسابك",record:"ADJ-2026-0041 · − 3,540 SAR · guest relocated",recordAr:"ADJ-2026-0041 · −٣٬٥٤٠ ر.س · نقل نزيل",area:"finance"},
  {id:"LOG-0013",when:"12 Sep 09:02",whenAr:"١٢ سبتمبر ٠٩:٠٢",actor:"you",actorAr:"أنت",actorType:"team",role:"Owner",roleAr:"المالك",action:"Changed what a person reaches",actionAr:"غيّرت صلاحيات أحد الأشخاص",record:"Layla Hassan · Front office → Reservations",recordAr:"ليلى حسن · الاستقبال ← الحجوزات",area:"users"},
  {id:"LOG-0014",when:"9 Sep 16:20",whenAr:"٩ سبتمبر ١٦:٢٠",actor:"Faisal Al-Otaibi",actorAr:"فيصل العتيبي",actorType:"team",role:"Finance",roleAr:"المالية",action:"Opened the September account",actionAr:"فتح حساب سبتمبر",record:"11 movements · balance 9,500 SAR",recordAr:"١١ حركة · الرصيد ٩٬٥٠٠ ر.س",area:"finance"},
  {id:"LOG-0015",when:"8 Sep 14:32",whenAr:"٨ سبتمبر ١٤:٣٢",actor:"Ahmed Saleh",actorAr:"أحمد صالح",actorType:"team",role:"Revenue manager",roleAr:"مدير الإيرادات",action:"Published rate and availability changes",actionAr:"نشر تغييرات الأسعار والتوفر",record:"Al Noor Makkah · 8-23 Sep · PUB-20260908-0004",recordAr:"النور مكة · ٨–٢٣ سبتمبر · PUB-20260908-0004",area:"rates"},
  {id:"LOG-0016",when:"12 Aug 11:05",whenAr:"١٢ أغسطس ١١:٠٥",actor:"you",actorAr:"أنت",actorType:"team",role:"Owner",roleAr:"المالك",action:"Deactivated a person",actionAr:"عطّلت حساب شخص",record:"Mariam Zaki · Auditor · read only",recordAr:"مريم زكي · مدقق · قراءة فقط",area:"users"},
];

/** UI 08.0 — every role's chips carry that role's own tint. */
export const roleTint: Record<TeamRole, "lime" | "blue" | "grey" | "amber"> = {
  owner: "lime",
  admin: "lime",
  revenue: "blue",
  reservations: "blue",
  frontOffice: "grey",
  finance: "amber",
  auditor: "grey",
};

export const roleReach: Record<TeamRole, string[]> = {
  owner:["Everything","Users","Ownership"], admin:["Everything","Users","- no ownership"], revenue:["Hotels","Rates","Inventory","Sold counts only - no guest names"], reservations:["Bookings · confirm, reject, cancellations, amendments","Guest details","Stop sale","- no charge or rate overrides"], frontOffice:["Bookings · operational view","Guest details","- no cost, no finance, no rate history"], finance:["Finance","Booking money · reference, stay, cost, fees","- no guest identity"], auditor:["View across the portal","Finance · optional, off by default","- no guest identity"]
};

export const roleReachAr: Record<TeamRole, string[]> = {
  owner:["كل شيء","المستخدمون","الملكية"], admin:["كل شيء","المستخدمون","- دون نقل الملكية"], revenue:["الفنادق","الأسعار","المخزون","أعداد البيع فقط - دون أسماء النزلاء"], reservations:["الحجوزات · تأكيد ورفض وإلغاء وتعديل","بيانات النزيل","إيقاف البيع","- دون تعديل الرسوم أو الأسعار"], frontOffice:["الحجوزات · العرض التشغيلي","بيانات النزيل","- دون تكلفة أو مالية أو سجل أسعار"], finance:["المالية","قيمة الحجز · المرجع والإقامة والتكلفة والرسوم","- دون هوية النزيل"], auditor:["عرض جميع أقسام البوابة","المالية · اختيارية ومغلقة افتراضيًا","- دون هوية النزيل"]
};
export type RoleKind = "builtIn" | "custom";

export interface RoleRow {
  id: string;
  name: string;
  nameAr: string;
  kind: RoleKind;
  people: number;
  reaches: string;
  reachesAr: string;
  /** Built-in roles cannot be changed; a custom one can be edited or deleted. */
  locked: boolean;
}

/** UI 08.20 — the Roles tab, exactly as the design draws it. */
export const roleCatalogue: RoleRow[] = [
  { id:"ROLE-OWNER",name:"Owner",nameAr:"\u0627\u0644\u0645\u0627\u0644\u0643",kind:"builtIn",people:1,reaches:"Everything, including ownership and billing details",reachesAr:"\u0643\u0644 \u0634\u064a\u0621\u060c \u0628\u0645\u0627 \u0641\u064a\u0647 \u0627\u0644\u0645\u0644\u0643\u064a\u0629 \u0648\u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u0641\u0648\u062a\u0631\u0629",locked:true },
  { id:"ROLE-ADMIN",name:"Admin",nameAr:"\u0645\u062f\u064a\u0631",kind:"builtIn",people:1,reaches:"Everything except ownership",reachesAr:"\u0643\u0644 \u0634\u064a\u0621 \u0639\u062f\u0627 \u0627\u0644\u0645\u0644\u0643\u064a\u0629",locked:true },
  { id:"ROLE-REVENUE",name:"Revenue manager",nameAr:"\u0645\u062f\u064a\u0631 \u0627\u0644\u0625\u064a\u0631\u0627\u062f\u0627\u062a",kind:"builtIn",people:1,reaches:"Hotels, contracts, rates and inventory",reachesAr:"\u0627\u0644\u0641\u0646\u0627\u062f\u0642 \u0648\u0627\u0644\u0639\u0642\u0648\u062f \u0648\u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u0648\u0627\u0644\u0645\u062e\u0632\u0648\u0646",locked:false },
  { id:"ROLE-RESERVATIONS",name:"Reservations",nameAr:"\u0627\u0644\u062d\u062c\u0648\u0632\u0627\u062a",kind:"builtIn",people:1,reaches:"Bookings, cancellations, stop sale \u00b7 no money",reachesAr:"\u0627\u0644\u062d\u062c\u0648\u0632\u0627\u062a \u0648\u0627\u0644\u0625\u0644\u063a\u0627\u0621 \u0648\u0625\u064a\u0642\u0627\u0641 \u0627\u0644\u0628\u064a\u0639 \u00b7 \u062f\u0648\u0646 \u0645\u0627\u0644\u064a\u0629",locked:false },
  { id:"ROLE-FINANCE",name:"Finance",nameAr:"\u0627\u0644\u0645\u0627\u0644\u064a\u0629",kind:"builtIn",people:2,reaches:"Finance and booking money \u00b7 no guest identity",reachesAr:"\u0627\u0644\u0645\u0627\u0644\u064a\u0629 \u0648\u0642\u064a\u0645\u0629 \u0627\u0644\u062d\u062c\u0632 \u00b7 \u062f\u0648\u0646 \u0647\u0648\u064a\u0629 \u0627\u0644\u0646\u0632\u064a\u0644",locked:false },
  { id:"ROLE-AUDITOR",name:"Auditor",nameAr:"\u0645\u062f\u0642\u0651\u0642",kind:"builtIn",people:1,reaches:"Everything, read only \u00b7 no guest identity",reachesAr:"\u0643\u0644 \u0634\u064a\u0621 \u0644\u0644\u0642\u0631\u0627\u0621\u0629 \u0641\u0642\u0637 \u00b7 \u062f\u0648\u0646 \u0647\u0648\u064a\u0629 \u0627\u0644\u0646\u0632\u064a\u0644",locked:false },
  { id:"ROLE-NIGHT",name:"Night desk",nameAr:"\u0645\u0643\u062a\u0628 \u0627\u0644\u0644\u064a\u0644",kind:"custom",people:1,reaches:"Arrivals and guest details only \u00b7 no rates, no money",reachesAr:"\u0627\u0644\u0648\u0635\u0648\u0644 \u0648\u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u0646\u0632\u064a\u0644 \u0641\u0642\u0637 \u00b7 \u062f\u0648\u0646 \u0623\u0633\u0639\u0627\u0631 \u0648\u0644\u0627 \u0645\u0627\u0644\u064a\u0629",locked:false },
];

/** UI 08.22 — the role a person just created. */
export const createdRole: RoleRow = { id:"ROLE-WEEKEND",name:"Weekend cover",nameAr:"\u062a\u063a\u0637\u064a\u0629 \u0646\u0647\u0627\u064a\u0629 \u0627\u0644\u0623\u0633\u0628\u0648\u0639",kind:"custom",people:0,reaches:"Bookings and arrivals \u00b7 confirm or reject \u00b7 no money",reachesAr:"\u0627\u0644\u062d\u062c\u0648\u0632\u0627\u062a \u0648\u0627\u0644\u0648\u0635\u0648\u0644 \u00b7 \u062a\u0623\u0643\u064a\u062f \u0623\u0648 \u0631\u0641\u0636 \u00b7 \u062f\u0648\u0646 \u0645\u0627\u0644\u064a\u0629",locked:false };

/** UI 08.9 — the log holds far more than the page shows. */
export const activityTotals = { last30: 1284, perPage: 20, outsideTeam: 114, allAreas: 14, shown: 20 };
