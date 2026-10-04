import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, PageHeader, SectionCard, StatusPill } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

export const Route=createFileRoute("/empty-states")({head:()=>({meta:[{title:"Empty states · Hoteliana"},{name:"description",content:"Contextual empty states for supplier operations."},{property:"og:title",content:"Empty states · Hoteliana"},{property:"og:description",content:"Contextual empty states for supplier operations."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"}]}),component:Page});

type View="hotels"|"bookings"|"finance"|"new";
const TABS:Array<[View,string,string]>=[
  ["hotels","My Hotels","فنادقي"],
  ["bookings","Bookings","الحجوزات"],
  ["finance","Your account","حسابك"],
  ["new","Brand new supplier","مورّد جديد"],
];

function Page(){
  const {lang}=useLanguage();
  const ar=lang==="ar";
  const [view,setView]=useState<View>("hotels");
  return <PageShell>
    <div className="mb-5 flex gap-2 overflow-x-auto pb-2">{TABS.map(([key,en,arabic])=>
      <Button key={key} size="sm" variant={view===key?"dark":"outline"} onClick={()=>setView(key)}>{ar?arabic:en}</Button>)}
    </div>
    {view==="hotels"?<Hotels ar={ar}/>:view==="bookings"?<Bookings ar={ar}/>:view==="finance"?<Finance ar={ar}/>:<NewSupplier ar={ar}/>}
  </PageShell>;
}

function Marks({rows,ar}:{rows:Array<[string,string,string]>;ar:boolean}){
  return <div className="space-y-3">{rows.map(([mark,en,arabic])=><div key={en} className="flex gap-3 text-sm text-text-primary">
    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${mark==="no"?"bg-status-danger-bg text-status-danger":mark==="info"?"bg-status-neutral-bg text-text-secondary":"bg-status-success-bg text-status-success"}`}>{mark==="no"?"✕":mark==="info"?"i":"✓"}</span>
    <span className="leading-5">{ar?arabic:en}</span>
  </div>)}</div>;
}

/** UI 11.16 — nothing approved yet, and where each request stopped. */
function Hotels({ar}:{ar:boolean}){
  const requests:Array<[string,string,string,string,string,string,string]>=[
    ["review","Under review","قيد المراجعة","Hilton Makkah","Sent 11 Sep 2026 · with Hoteliana for 4 days","أُرسل ١١ سبتمبر ٢٠٢٦ · لدى هوتيليانا منذ ٤ أيام","Track the request"],
    ["review","Under review","قيد المراجعة","Swissôtel Al Maqam","Sent 12 Sep 2026","أُرسل ١٢ سبتمبر ٢٠٢٦","Track the request"],
    ["review","Under review","قيد المراجعة","Hilton Madinah","Sent 11 Sep 2026 · with Hoteliana for 4 days","أُرسل ١١ سبتمبر ٢٠٢٦ · لدى هوتيليانا منذ ٤ أيام","Track the request"],
    ["declined","Declined","مرفوض","Conrad Makkah","The hotel already has a direct contract for this period","للفندق عقد مباشر بالفعل لهذه الفترة","See why"],
  ];
  return <>
    <PageHeader overline="MY HOTELS" title={ar?"فنادقي":"My Hotels"}
      subtitle={ar?"لم يُعتمد أي فندق بعد. وكل طلب أرسلته أدناه، مع موضع توقفه بالضبط.":"No hotel is approved yet. Every request you sent is below, with exactly where it stopped."}
      right={<Link to="/hotels"><Button variant="dark">{ar?"تصفح مكتبة الفنادق":"Browse the hotel library"}</Button></Link>}/>
    <SectionCard title={ar?"أين وصلت طلباتك":"Where your requests stand"} description={ar?"أربعة طلبات في ثلاث حالات مختلفة. وهذه القائمة مولّدة من الطلبات نفسها - وليست رسالة كتبناها مرة واحدة.":"Four requests, three different states. This list is generated from the requests themselves - it is not a message we wrote once."}>
      <div className="divide-y divide-border-subtle">{requests.map(([tone,stateEn,stateAr,hotel,noteEn,noteAr,action])=>
        <div key={hotel} className="grid gap-2 py-4 sm:grid-cols-[150px_1fr_auto] sm:items-center">
          <StatusPill tone={tone==="declined"?"danger":"warning"}>{ar?stateAr:stateEn}</StatusPill>
          <div><b className="text-sm text-text-primary">{hotel}</b><p className="mt-1 text-xs text-text-muted">{ar?noteAr:noteEn}</p></div>
          <Link to="/requests"><Button size="sm" variant="outline">{ar?(action==="See why"?"معرفة السبب":"تتبّع الطلب"):action}</Button></Link>
        </div>)}
      </div>
    </SectionCard>
    <SectionCard className="mt-5" title={ar?"ماذا يحدث عند اعتماد أحدها":"What happens when one is approved"}>
      <Marks ar={ar} rows={[
        ["yes","The hotel appears here and you can build a contract on it.","يظهر الفندق هنا ويمكنك بناء عقد عليه."],
        ["info","Until then nothing you build can be sold - there is no hotel to sell.","وحتى ذلك الحين لا يُباع شيء تبنيه - فلا فندق ليُباع."],
        ["info","You will be told the moment a request moves, on the channels you chose.","وستُخبَر لحظة تحرّك أي طلب، على القنوات التي اخترتها."],
      ]}/>
    </SectionCard>
    <SectionCard className="mt-5" title={ar?"تبحث عن فندق لم تطلبه بعد؟":"Looking for a hotel you have not asked for yet?"} description={ar?"تضم المكتبة كل فندق تعمل معه هوتيليانا. وإن لم يكن فندقك فيها فبإمكانك إضافته.":"The library has every hotel Hoteliana works with. If yours is not there, you can add it."}>
      <div className="flex flex-wrap gap-2">
        <Link to="/hotels"><Button variant="dark">{ar?"تصفح مكتبة الفنادق":"Browse the hotel library"}</Button></Link>
        <Link to="/hotels"><Button variant="outline">{ar?"أضف فندقًا ناقصًا":"Add a missing hotel"}</Button></Link>
        <Link to="/requests"><Button variant="ghost">{ar?"تتبّع كل الطلبات":"Track all requests"}</Button></Link>
      </div>
    </SectionCard>
  </>;
}

/** UI 11.17 — no bookings, with the four blockers that explain it. */
function Bookings({ar}:{ar:boolean}){
  const blocks:Array<[string,string,string,string,string,string,string,string]>=[
    ["No price set","لا سعر محدد","3 rooms have no price","٣ غرف بلا سعر","Deluxe · Standard · Superior - November","ديلوكس · قياسية · سوبيريور - نوفمبر","Open rates","فتح الأسعار"],
    ["No rooms left","لا غرف متبقية","2 rooms have no stock","غرفتان بلا مخزون","Standard · RO - December","قياسية · بدون وجبات - ديسمبر","Open inventory","فتح المخزون"],
    ["Stopped by you","أوقفته أنت","1 room is stopped by you","غرفة واحدة أوقفتها أنت","Standard Room · all of October","الغرفة القياسية · أكتوبر كله","Lift the stop sale","رفع إيقاف البيع"],
    ["Contract has ended","انتهى العقد","1 contract is not active","عقد واحد غير فعّال","Ramadan 2026 · ended 92 days ago","رمضان ٢٠٢٦ · انتهى قبل ٩٢ يومًا","Copy to a new period","انسخه إلى فترة جديدة"],
  ];
  return <>
    <PageHeader overline="BOOKINGS" title={ar?"الحجوزات":"Bookings"}
      subtitle={ar?"لا حجوزات بعد. وليس هذا لغزًا - فأربعة أمور تمنع الوكلاء من الشراء، وكلها بيدك أنت.":"No bookings yet. That is not a mystery - four things are stopping agents from buying, and all four are yours to clear."}
      right={<Link to="/sell-status"><Button variant="dark">{ar?"عرض كل الحواجز":"See every blocker"}</Button></Link>}/>
    <SectionCard title={ar?"لماذا لا يمكن شراء شيء الآن":"Why nothing can be bought right now"} description={ar?"القائمة نفسها التي تراها على التقويم ولوحة اليوم.":"The same list you see on the calendar and the dashboard."}>
      <div className="divide-y divide-border-subtle">{blocks.map(([nameEn,nameAr,countEn,countAr,detailEn,detailAr,fixEn,fixAr])=>
        <div key={nameEn} className="grid gap-2 py-4 sm:grid-cols-[200px_1fr_auto] sm:items-center">
          <StatusPill tone="danger">{ar?nameAr:nameEn}</StatusPill>
          <div><b className="text-sm text-text-primary">{ar?countAr:countEn}</b><p className="mt-1 text-xs text-text-muted">{ar?detailAr:detailEn}</p></div>
          <Link to="/rate-calendar" search={{}}><Button size="sm" variant="outline">{ar?fixAr:fixEn}</Button></Link>
        </div>)}
      </div>
    </SectionCard>
    <SectionCard className="mt-5" title={ar?"متى ترتفع هذه":"When these clear"}>
      <Marks ar={ar} rows={[
        ["yes","Rooms go on sale the moment the last blocker on them is gone - nothing to publish twice.","تُعرض الغرف للبيع لحظة زوال آخر حاجز عليها - ولا شيء يُنشر مرتين."],
        ["info","Bookings land here as they come, newest first.","وتصل الحجوزات هنا كما تأتي، الأحدث أولًا."],
        ["info","This screen never says \"no bookings\" on its own. If it has nothing to blame, it says so.","ولا تقول هذه الشاشة «لا حجوزات» وحدها أبدًا. وإن لم تجد ما تلومه قالت ذلك."],
      ]}/>
    </SectionCard>
    <SectionCard className="mt-5" title={ar?"النسخة الأخرى من هذه الشاشة":"The other version of this screen"} description={ar?"حين يكون كل شيء قابلًا للبيع ولا حجوزات بعد، تتغير الرسالة - لأن الإجابة تتغير.":"When everything is sellable and there are still no bookings, the message changes - because the answer changes."}>
      <div className="rounded-lg bg-surface-subtle p-4">
        <b className="text-sm text-text-primary">{ar?"كل ما تعرضه للبيع. ولا حجوزات بعد.":"Everything you offer is on sale. No bookings yet."}</b>
        <p className="mt-2 text-xs leading-5 text-text-secondary">{ar?"لا شيء لإصلاحه هنا. وهذا الآن سؤال طلب - التسعير أو التواريخ أو موقعك في المقارنة لدى الوكيل. والتحليلات هي موضع النظر.":"There is nothing to fix here. This is now a demand question - pricing, dates, or how you compare on the agent side. Analytics is the place to look."}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link to="/sell-status"><Button variant="outline">{ar?"عرض كل الحواجز":"See every blocker"}</Button></Link>
        <Link to="/rate-calendar" search={{}}><Button variant="outline">{ar?"فتح التقويم":"Open the calendar"}</Button></Link>
        <Link to="/dashboard" search={{view:"analytics" as const}}><Button variant="ghost">{ar?"عرض التحليلات":"Show the analytics"}</Button></Link>
      </div>
    </SectionCard>
  </>;
}

/** UI 11.18 — business on the books, nothing due yet. */
function Finance({ar}:{ar:boolean}){
  const tiles:Array<[string,string,string,string,string]>=[
    ["Upcoming","قادم","SAR 42,000","50 bookings, after checkout","٥٠ حجزًا بعد المغادرة"],
    ["Waiting to be settled","بانتظار التسوية","SAR 0","nothing is eligible yet","لا شيء مستحق بعد"],
    ["Paid","مدفوع","SAR 0","no payment cycle has run","لم تُنفّذ أي دورة دفع"],
    ["Entries against you","قيود عليك","SAR 0","clean account","حساب نظيف"],
  ];
  return <>
    <PageHeader overline="FINANCE" title={ar?"حسابك":"Your account"}
      subtitle={ar?"لديك أعمال. ولا شيء منها مستحق بعد - وهذه حقيقة توقيت لا حساب فارغ.":"You have business. None of it is due yet - that is a timing fact, not an empty account."}
      right={<Link to="/bookings"><Button variant="dark">{ar?"فتح الحجوزات":"Open bookings"}</Button></Link>}/>
    <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{tiles.map(([labelEn,labelAr,value,noteEn,noteAr])=>
      <div key={labelEn} className="rounded-lg border border-border-subtle bg-surface-default p-4">
        <p className="text-overline text-text-muted">{ar?labelAr:labelEn}</p>
        <p className="font-data mt-1 text-xl font-semibold text-text-primary">{value}</p>
        <p className="mt-1 text-[10px] leading-4 text-text-secondary">{ar?noteAr:noteEn}</p>
      </div>)}
    </div>
    <SectionCard title={ar?"لماذا لا شيء بانتظار التسوية":"Why nothing is waiting to be settled"}>
      <Marks ar={ar} rows={[
        ["info","A booking becomes eligible after the guest checks out. Your earliest checkout is 12 Oct 2026.","يصبح الحجز مستحقًا بعد مغادرة النزيل. وأقرب مغادرة لديك ١٢ أكتوبر ٢٠٢٦."],
        ["yes","50 confirmed bookings are already counted in Upcoming - the money is real, just not due.","و٥٠ حجزًا مؤكدًا محسوبة بالفعل في «قادم» - والمال حقيقي لكنه غير مستحق."],
        ["info","There is no payment cycle to wait for. Hoteliana pays what is owed and deducts any entries from the same total.","ولا دورة دفع تنتظرها. فهوتيليانا تدفع المستحق وتخصم أي قيود من الإجمالي نفسه."],
        ["yes","Nothing has been raised against you.","ولم يُرفع عليك شيء."],
      ]}/>
    </SectionCard>
    <SectionCard className="mt-5" title={ar?"وهذا ليس كحساب جديد":"This is not the same as a new account"} description={ar?"المورّد الذي لا أعمال له إطلاقًا يرى شاشة أخرى - تشرح كيف يصل إلى أول حجز، لا متى يصل المال.":"A supplier with no business at all sees a different screen - one that explains how to get to a first booking, not when money arrives."}>
      <div className="flex flex-wrap gap-2">
        <Link to="/bookings"><Button variant="outline">{ar?"فتح الحجوزات":"Open bookings"}</Button></Link>
        <Link to="/finance" search={{}}><Button variant="outline">{ar?"فتح كشوف الحساب":"Open statements"}</Button></Link>
        <Link to="/dashboard" search={{view:"analytics" as const}}><Button variant="ghost">{ar?"عرض التحليلات":"Show the analytics"}</Button></Link>
      </div>
    </SectionCard>
  </>;
}

/** UI 11.19 — the only empty screen that teaches. */
function NewSupplier({ar}:{ar:boolean}){
  const steps:Array<[string,string,string,string,string,string,string]>=[
    ["✓","Your account is active","حسابك فعّال","Signed the supplier agreement on 15 Sep 2026","وُقّعت اتفاقية المورّد في ١٥ سبتمبر ٢٠٢٦","Done","تم"],
    ["2","Ask for access to a hotel","اطلب صلاحية فندق","Pick it from the library, or add one we do not have","اخترْه من المكتبة أو أضف واحدًا ليس لدينا","Browse the hotel library","تصفح مكتبة الفنادق"],
    ["3","Build a supply contract","ابنِ عقد توريد","Term, rooms, meal plans, prices and stock","المدة والغرف وخطط الوجبات والأسعار والمخزون","After approval","بعد الاعتماد"],
    ["4","Put it on sale","اعرضه للبيع","Publish, and agents can buy","انشر، ويستطيع الوكلاء الشراء","Last step","الخطوة الأخيرة"],
  ];
  return <>
    <PageHeader overline="GETTING STARTED" title={ar?"أهلًا - لا شيء هنا بعد":"Welcome - nothing here yet"}
      subtitle={ar?"هذه الشاشة الفارغة الوحيدة التي تُعلّم. وتراها لأن حسابك جديد، لا لأن اليوم هادئ.":"This is the only empty screen that teaches. You see it because your account is new, not because today is quiet."}/>
    <SectionCard title={ar?"أربع خطوات إلى أول حجز":"Four steps to your first booking"} description={ar?"كل خطوة تفتح التي بعدها - وهذا هو الطريق من التسجيل إلى أول حجز.":"Each step opens the next one - this is the road from sign-up to your first booking."}>
      <div className="divide-y divide-border-subtle">{steps.map(([badge,titleEn,titleAr,noteEn,noteAr,actionEn,actionAr])=>
        <div key={titleEn} className="grid gap-3 py-4 sm:grid-cols-[36px_1fr_auto] sm:items-center">
          <span className={`flex h-9 w-9 items-center justify-center rounded-full font-data text-sm ${badge==="✓"?"bg-status-success-bg text-status-success":"bg-primary-subtle text-brand-deep"}`}>{badge}</span>
          <div><b className="text-sm text-text-primary">{ar?titleAr:titleEn}</b><p className="mt-1 text-xs text-text-muted">{ar?noteAr:noteEn}</p></div>
          {actionEn==="Browse the hotel library"
            ? <Link to="/hotels"><Button size="sm" variant="dark">{ar?actionAr:actionEn}</Button></Link>
            : <StatusPill tone={badge==="✓"?"success":"neutral"}>{ar?actionAr:actionEn}</StatusPill>}
        </div>)}
      </div>
    </SectionCard>
    <SectionCard className="mt-5" title={ar?"ما لن يُطلب منك":"What you will not be asked for"}>
      <Marks ar={ar} rows={[
        ["no","No PDF contract to upload. The contract is built inside the system so agents can actually buy from it.","لا عقد PDF لترفعه. فالعقد يُبنى داخل النظام ليتمكن الوكلاء من الشراء منه فعلًا."],
        ["yes","No payment setup before you sell. Money comes after checkout.","ولا إعداد دفع قبل أن تبيع. فالمال يأتي بعد المغادرة."],
        ["info","Your team can be invited at any point - you do not have to do this alone.","ويمكن دعوة فريقك في أي وقت - ولست مضطرًا لفعل هذا وحدك."],
      ]}/>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link to="/hotels"><Button variant="dark">{ar?"تصفح مكتبة الفنادق":"Browse the hotel library"}</Button></Link>
        <Link to="/hotels"><Button variant="outline">{ar?"أضف فندقًا ناقصًا":"Add a missing hotel"}</Button></Link>
        <Link to="/team" search={{}}><Button variant="ghost">{ar?"ادعُ فريقك":"Invite your team"}</Button></Link>
      </div>
    </SectionCard>
  </>;
}
