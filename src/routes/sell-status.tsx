import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, CheckCircle2, Send } from "lucide-react";
import { Drawer } from "@/components/layout/overlay";
import { PageHeader, PageShell, SectionCard, StatusPill } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { blockerSpec } from "@/lib/blockers";
import { activePauses, blockers, pauseStats, type Blocker, type BlockerOwner, type SellPause } from "@/lib/business-exception-data";
import { useLanguage } from "@/lib/i18n";

export const Route=createFileRoute("/sell-status")({head:()=>({meta:[{title:"Sell status · Hoteliana Supplier Portal"},{name:"description",content:"Review active sales pauses and offer blockers."},{property:"og:title",content:"Sell status · Hoteliana Supplier Portal"},{property:"og:description",content:"Review active sales pauses and offer blockers."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"}]}),component:SellStatusPage});

type Overlay={kind:"pause";pause:SellPause}|{kind:"follow"}|{kind:"sent"}|{kind:"check"}|{kind:"codes"}|null;

const GROUPS: Array<{owner:BlockerOwner;overline:string;overlineAr:string;title:string;titleAr:string;desc:string;descAr:string;mark:"yes"|"info"|"no"}> = [
  {owner:"supplier",overline:"YOU CAN CLEAR THESE NOW",overlineAr:"يمكنك رفعها الآن",title:"You can clear these now",titleAr:"يمكنك رفعها الآن",desc:"Seven blocks, all inside your own screens.",descAr:"سبعة حواجز، كلها داخل شاشاتك أنت.",mark:"yes"},
  {owner:"hoteliana",overline:"HOTELIANA MUST CLEAR THESE",overlineAr:"ترفعها هوتيليانا",title:"Hoteliana must clear these",titleAr:"على هوتيليانا رفعها",desc:"You cannot lift these yourself - but you can see the reason and follow up.",descAr:"لا يمكنك رفعها بنفسك - لكن ترى السبب وتتابع.",mark:"info"},
  {owner:"structural",overline:"STRUCTURAL",overlineAr:"بنيوي",title:"Structural - the contract has to change",titleAr:"بنيوي - على العقد أن يتغير",desc:"These do not clear by editing a price.",descAr:"هذه لا تُرفع بتعديل سعر.",mark:"no"},
];

function SellStatusPage(){
  const {lang}=useLanguage();
  const ar=lang==="ar";
  const [tab,setTab]=useState<"pauses"|"blockers">("pauses");
  const [overlay,setOverlay]=useState<Overlay>(null);
  return <PageShell>
    <PageHeader
      overline={ar?"حالة البيع":"SELL STATUS"}
      title={tab==="pauses"?(ar?"ما أوقفته هوتيليانا":"What Hoteliana paused"):(ar?"لماذا لا يمكن بيع هذه الغرف":"Why these rooms cannot be sold")}
      pill={<StatusPill tone={tab==="pauses"?"warning":"danger"}>{tab==="pauses"?(ar?"٣ فعّالة":"3 active"):(ar?"١٧ حاجزًا":"17 blocks")}</StatusPill>}
      subtitle={tab==="pauses"
        ?(ar?"يحجب الإيقاف المبيعات الجديدة لنطاق محدد. ولا يحذف سعرًا ولا مخزونًا أبدًا، ولا يمس حجزًا مؤكدًا، ولا يعطّل حسابك.":"A pause blocks new sales for a defined scope. It never deletes rates or inventory, never touches a confirmed booking, and never deactivates your account.")
        :(ar?"كل سطر هنا يأتي من محرك حواجز قابلية البيع - المصدر نفسه الذي يقرأه التقويم ولوحة اليوم.":"Every line here comes from the Sellability Blocker Engine - the same source the calendar and the dashboard read.")}
      right={<div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={()=>setOverlay({kind:"codes"})}><BookOpen className="h-4 w-4"/>{ar?"مرجع الأكواد":"Blocker code reference"}</Button>
        <Button variant="outline" onClick={()=>setOverlay({kind:"follow"})}>{tab==="pauses"?(ar?"المتابعة مع هوتيليانا":"Follow up with Hoteliana"):(ar?"اسأل هوتيليانا":"Ask Hoteliana")}</Button>
      </div>}
    />
    <div className="mb-5 flex gap-2">
      <Button variant={tab==="pauses"?"dark":"outline"} onClick={()=>setTab("pauses")}>{ar?"ما أوقفته هوتيليانا":"What Hoteliana paused"}</Button>
      <Button variant={tab==="blockers"?"dark":"outline"} onClick={()=>setTab("blockers")}>{ar?"لماذا لا يمكن بيع الغرف":"Why these rooms cannot be sold"}</Button>
    </div>
    {tab==="pauses"?<Pauses ar={ar} onOpen={(pause)=>setOverlay({kind:"pause",pause})}/>:<Blockers ar={ar} onCheck={()=>setOverlay({kind:"check"})}/>}
    <ExceptionOverlay value={overlay} setValue={setOverlay} ar={ar}/>
  </PageShell>;
}

function Pauses({ar,onOpen}:{ar:boolean;onOpen:(p:SellPause)=>void}){
  return <>
    <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {pauseStats.map(stat=><div key={stat.label} className="rounded-[14px] border border-border-subtle bg-surface-default p-5">
        <p className="text-overline text-text-muted">{ar?stat.labelAr:stat.label}</p>
        <p className="font-data mt-1 text-2xl font-semibold text-brand-deep">{stat.value}</p>
        <p className="mt-1 text-xs text-text-secondary">{ar?stat.noteAr:stat.note}</p>
      </div>)}
    </div>
    <section className="mb-5 overflow-hidden rounded-lg border border-border-subtle bg-surface-default">
      <div className="hidden overflow-x-auto lg:block"><div className="min-w-[1120px]">
        <div className="grid grid-cols-[110px_1fr_130px_180px_200px_90px] gap-3 bg-surface-subtle px-4 py-3 text-overline text-text-muted">
          <span>{ar?"النطاق":"SCOPE"}</span><span>{ar?"ما يغطيه":"WHAT IT COVERS"}</span><span>{ar?"منذ":"SINCE"}</span><span>{ar?"تواريخ الإقامة المحجوبة":"BLOCKED STAY DATES"}</span><span>{ar?"من ضبطه":"SET BY"}</span><span>{ar?"إجراء":"ACTION"}</span>
        </div>
        {activePauses.map(pause=><div key={pause.id} className="grid grid-cols-[110px_1fr_130px_180px_200px_90px] items-center gap-3 border-t border-border-subtle px-4 py-3 text-xs">
          <StatusPill tone="warning">{ar?pause.scopeAr:pause.scope}</StatusPill>
          <span className="text-text-primary">{ar?pause.coversAr:pause.covers}</span>
          <span>{ar?pause.sinceAr:pause.since}</span>
          <span>{ar?pause.blockedAr:pause.blocked}</span>
          <span className="text-text-muted">{ar?pause.setByAr:pause.setBy}</span>
          <Button size="sm" variant="outline" onClick={()=>onOpen(pause)}>{ar?"فتح":"Open"}</Button>
        </div>)}
      </div></div>
      <div className="grid gap-3 p-3 lg:hidden">{activePauses.map(pause=><article key={pause.id} className="rounded-lg border border-border-subtle p-4">
        <div className="flex items-start justify-between gap-3"><StatusPill tone="warning">{ar?pause.scopeAr:pause.scope}</StatusPill><span className="text-xs text-text-muted">{ar?pause.sinceAr:pause.since}</span></div>
        <p className="mt-2 text-sm text-text-primary">{ar?pause.coversAr:pause.covers}</p>
        <p className="mt-1 text-xs text-text-muted">{ar?pause.blockedAr:pause.blocked} · {ar?pause.setByAr:pause.setBy}</p>
        <Button className="mt-3 w-full" size="sm" variant="outline" onClick={()=>onOpen(pause)}>{ar?"فتح":"Open"}</Button>
      </article>)}</div>
    </section>
    <div className="grid gap-5 lg:grid-cols-2">
      <SectionCard title={ar?"كيف تتصرف الإيقافات المتداخلة":"How overlapping pauses behave"} description={ar?"اقرأ هذا قبل أن تلاحق أحدها.":"Read this before you chase one of them."}>
        <Rules ar={ar} rows={[
          ["info","The widest pause wins. A hotel pause keeps a room unsellable even if the room pause is lifted.","الإيقاف الأوسع يغلب. فإيقاف الفندق يُبقي الغرفة غير قابلة للبيع حتى لو رُفع إيقاف الغرفة."],
          ["info","Lifting a narrow pause never lifts a wider one.","رفع إيقاف ضيق لا يرفع إيقافًا أوسع أبدًا."],
          ["yes","This screen always shows every pause on a scope - not only the first one found.","تعرض هذه الشاشة دائمًا كل إيقاف على النطاق - لا أول ما يُعثر عليه فقط."],
          ["info","A pause window blocks selling for a period of time. Blocked stay dates block specific nights. They are two different fields and can both be set.","نافذة الإيقاف تحجب البيع لفترة زمنية، وتواريخ الإقامة المحجوبة تحجب ليالي بعينها. وهما حقلان مختلفان ويمكن ضبطهما معًا."],
        ]}/>
      </SectionCard>
      <SectionCard title={ar?"الإيقاف تجاوز لقابلية البيع لا أكثر":"A pause is a sellability override - nothing else"} description={ar?"يعلو هذا كل شرط آخر في المحرك.":"This sits above every other condition in the engine."}>
        <Rules ar={ar} rows={[
          ["yes","Contract active, rate valid, inventory available…","العقد فعّال والسعر صالح والمخزون متاح…"],
          ["no","…and Hoteliana pause = not sellable. The pause wins.","…ومع إيقاف هوتيليانا = غير قابل للبيع. الإيقاف يغلب."],
          ["info","Blocker code: Paused by Hoteliana · highest priority.","كود الحاجز: أوقفته هوتيليانا · الأولوية القصوى."],
        ]}/>
      </SectionCard>
    </div>
  </>;
}

function Blockers({ar,onCheck}:{ar:boolean;onCheck:()=>void}){
  return <>
    <SectionCard className="mb-5" title={ar?"مرتّبة حسب من يستطيع رفعها":"Sorted by who can clear it"} description={ar?"الأعراض وحدها بلا فائدة. وكل حاجز أدناه مجموع تحت الشخص الوحيد القادر على رفعه.":"Symptoms are useless on their own. Each block below is grouped by the only person who can remove it."} right={<Button size="sm" variant="outline" onClick={onCheck}>{ar?"الفحص الكامل لليلة":"The full check on one night"}</Button>}>
      <Rules ar={ar} rows={[
        ["yes","You can clear these now - each line opens the exact screen that fixes it.","يمكنك رفعها الآن - وكل سطر يفتح الشاشة التي تصلحه بالضبط."],
        ["info","Hoteliana must clear these - you can follow up, but you cannot lift them.","على هوتيليانا رفعها - يمكنك المتابعة ولا يمكنك رفعها."],
        ["no","Structural - the contract itself has to change.","بنيوي - على العقد نفسه أن يتغير."],
      ]}/>
    </SectionCard>
    <div className="grid gap-5">
      {GROUPS.map(group=>{
        const rows=blockers.filter(b=>b.owner===group.owner);
        return <SectionCard key={group.owner} overline={ar?group.overlineAr:group.overline} title={ar?group.titleAr:group.title} description={ar?group.descAr:group.desc}>
          <div className="overflow-x-auto"><div className="min-w-[980px]">
            <div className="grid grid-cols-[210px_1fr_1fr_140px_80px_150px] gap-3 border-b border-border-subtle pb-3 text-overline text-text-muted">
              <span>{ar?"الحاجز":"BLOCKER"}</span><span>{ar?"ما يؤثر عليه":"WHAT IT AFFECTS"}</span><span>{ar?"لماذا":"WHY"}</span><span>{ar?"الليالي":"NIGHTS"}</span><span>{ar?"منذ":"SINCE"}</span><span>{ar?"الإصلاح":"FIX"}</span>
            </div>
            {rows.map((row,index)=><BlockerRow key={`${row.name}-${index}`} row={row} ar={ar} mark={group.mark}/>)}
          </div></div>
        </SectionCard>;
      })}
    </div>
  </>;
}

/* §0.7 - the name, the meaning and the fix come from the one table; the
   row itself only knows what this instance affects. */
function BlockerRow({row,ar,mark}:{row:Blocker;ar:boolean;mark:"yes"|"info"|"no"}){
  const k=ar?"ar":"en";
  const spec=blockerSpec(row.code);
  return <div className="grid grid-cols-[210px_1fr_1fr_140px_80px_150px] items-center gap-3 border-b border-border-subtle py-3 text-xs last:border-0">
    <span><b className="block text-text-primary">{spec.name[k]}</b><code className="mt-0.5 block font-data text-[10px] text-text-muted">{row.code}</code></span>
    <span className="text-text-primary">{ar?row.affectsAr:row.affects}</span>
    <span className="text-text-secondary">{ar?row.whyAr:row.why}</span>
    <span className="font-data">{ar?row.nightsAr:row.nights}</span>
    <span className="text-text-muted">{ar?row.sinceAr:row.since}</span>
    <Link to={spec.to} search={{} as never}><Button size="sm" variant={mark==="yes"?"outline":"ghost"}>{spec.action[k]}</Button></Link>
  </div>;
}

function Rules({rows,ar}:{rows:Array<[string,string,string]>;ar:boolean}){
  return <div className="space-y-3">{rows.map(([mark,en,arabic])=><div key={en} className="flex gap-3 text-sm text-text-primary">
    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${mark==="no"?"bg-status-danger-bg text-status-danger":mark==="info"?"bg-status-neutral-bg text-text-secondary":"bg-status-success-bg text-status-success"}`}>{mark==="no"?"✕":mark==="info"?"i":"✓"}</span>
    <span className="leading-5">{ar?arabic:en}</span>
  </div>)}</div>;
}

function ExceptionOverlay({value,setValue,ar}:{value:Overlay;setValue:(v:Overlay)=>void;ar:boolean}){
  if(!value)return null;
  if(value.kind==="sent")return <Drawer
    title={ar?"أُرسلت الرسالة إلى هوتيليانا":"Message sent to Hoteliana"}
    meta={ar?"عمرة الربع الثالث · ١٥ سبتمبر ٢٠٢٦، ١٤:٢٠":"Umrah Q3 · 15 Sep 2026, 14:20"}
    onClose={()=>setValue(null)}
    footer={<><Button variant="outline" onClick={()=>setValue(null)}>{ar?"متابعة هذا الطلب":"Follow this request"}</Button><Button variant="outline" onClick={()=>setValue(null)}>{ar?"العودة إلى حالة البيع":"Back to sell status"}</Button><Button onClick={()=>setValue(null)}>{ar?"إغلاق":"Close"}</Button></>}>
    <div className="mb-4 flex gap-3 rounded-xl bg-status-success-bg p-4 text-status-success"><CheckCircle2 className="h-5 w-5"/><p className="text-sm">{ar?"لدى هوتيليانا رسالتك.":"Hoteliana has your message."}</p></div>
    <p className="text-overline text-text-muted">{ar?"ماذا يحدث الآن":"What happens now"}</p>
    <div className="mt-3 space-y-3">{([
      ["yes","Reference CTR-N-3108 · your message and any attachment are on the pause record and in Your cases.","المرجع CTR-N-3108 · رسالتك وأي مرفق مسجّلان على سجل الإيقاف وفي «حالاتك»."],
      ["info","The pause stays on until Hoteliana lifts it.","يبقى الإيقاف قائمًا حتى ترفعه هوتيليانا."],
      ["yes","You keep managing rates, inventory and bookings in the meantime.","وتواصل إدارة الأسعار والمخزون والحجوزات في هذه الأثناء."],
      ["info","You will see it in your notifications the moment it is lifted.","وستراه في إشعاراتك لحظة رفعه."],
    ] as Array<[string,string,string]>).map(([mark,en,arabic])=><div key={en} className="flex gap-3 text-sm text-text-primary">
      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${mark==="info"?"bg-status-neutral-bg text-text-secondary":"bg-status-success-bg text-status-success"}`}>{mark==="info"?"i":"✓"}</span>
      <span className="leading-5">{ar?arabic:en}</span>
    </div>)}</div>
  </Drawer>;
  if(value.kind==="follow")return <Drawer title={ar?"المتابعة مع هوتيليانا":"Follow up with Hoteliana"} meta={ar?"اسأل عن هذا الإيقاف دون تغيير نطاقه.":"Ask about this pause without changing its scope."} onClose={()=>setValue(null)} footer={<><Button variant="outline" onClick={()=>setValue(null)}>{ar?"إلغاء":"Cancel"}</Button><Button onClick={()=>setValue({kind:"sent"})}><Send className="h-4 w-4"/>{ar?"إرسال":"Send follow-up"}</Button></>}><div className="space-y-4"><Input label={ar?"الموضوع":"Subject"} defaultValue="Pause PAU-1042 · Umrah Q3"/><Textarea className="min-h-40" placeholder={ar?"اكتب رسالتك":"Write your message"}/><Input type="file" label={ar?"مرفق اختياري":"Optional attachment"}/></div></Drawer>;
  if(value.kind==="pause"){
    const p=value.pause;
    return <Drawer title={ar?"نطاق هذا الإيقاف":"The scope of this pause"} overline={p.id} meta={ar?"الإيقاف لا يكون أوسع مما يلزم أبدًا.":"A pause is never wider than it needs to be."} onClose={()=>setValue(null)} footer={<Button onClick={()=>setValue({kind:"follow"})}>{ar?"المتابعة مع هوتيليانا":"Follow up with Hoteliana"}</Button>}>
      <div className="space-y-3">
        <Info label={ar?"النطاق":"Scope"} value={ar?p.scopeAr:p.scope}/>
        <Info label={ar?"ما يغطيه":"What it covers"} value={ar?p.coversAr:p.covers}/>
        <Info label={ar?"نافذة الإيقاف":"Pause window"} value={`${ar?p.sinceAr:p.since} → ${ar?"حتى يُرفع":"until lifted"}`}/>
        <Info label={ar?"تواريخ الإقامة المحجوبة":"Blocked stay dates"} value={ar?p.blockedAr:p.blocked}/>
        <Info label={ar?"من ضبطه":"Set by"} value={ar?p.setByAr:p.setBy}/>
      </div>
    </Drawer>;
  }
  if(value.kind==="check")return <Drawer width="660px" title={ar?"الفحص الكامل لليلة واحدة":"The full check on one night"} meta="Deluxe Room · B&B · 22 Sep 2026" onClose={()=>setValue(null)}><p className="mb-5 text-sm text-text-secondary">{ar?"تُنفذ الفحوص بالترتيب ويعرض كل عرض blockers[].":"Checks run in order and every offer exposes blockers[]."}</p>{["Contract active","Supplier hotel active","Access approved","Room mapped","Required information complete","Rate exists","Inventory exists","Stop sale is off","Release not passed","Restrictions pass"].map((x,i)=><div key={x} className="flex items-center gap-3 border-b border-border-subtle py-3"><span className={`flex h-6 w-6 items-center justify-center rounded-full ${i===4||i===8?"bg-status-danger-bg text-status-danger":"bg-status-success-bg text-status-success"}`}>{i===4||i===8?"×":"✓"}</span><span className="flex-1 text-sm text-text-primary">{x}</span>{(i===4||i===8)&&<StatusPill tone="danger">Blocked</StatusPill>}</div>)}</Drawer>;
  return <Drawer width="700px" title={ar?"مرجع أكواد الحظر":"Blocker codes · Reference"} meta={ar?"الأكواد التي يعيدها محرك قابلية البيع.":"The codes the sellability engine returns."} onClose={()=>setValue(null)}>{blockers.map((b,i)=><div key={`${b.name}-${i}`} className="border-b border-border-subtle py-3"><code className="text-xs font-semibold text-brand-deep">{ar?b.nameAr:b.name}</code><p className="mt-1 text-sm text-text-secondary">{ar?b.whyAr:b.why}</p></div>)}</Drawer>;
}

function Info({label,value}:{label:string;value:string}){return <div className="rounded-xl bg-surface-subtle p-4"><p className="text-overline text-text-muted">{label}</p><p className="mt-1 text-sm text-text-primary">{value}</p></div>}
