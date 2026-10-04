import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, PageHeader, SectionCard, StatusPill } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { preferenceRows, type PreferenceRow } from "@/lib/system-state-data";
import { useLanguage } from "@/lib/i18n";

export const Route=createFileRoute("/notification-settings")({head:()=>({meta:[{title:"Notification settings · Hoteliana"},{name:"description",content:"Choose what reaches your inbox."},{property:"og:title",content:"Notification settings · Hoteliana"},{property:"og:description",content:"Choose what reaches your inbox."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"}]}),component:Page});

const whyTone={Critical:"danger",Security:"warning",Information:"info",Digest:"neutral"} as const;
const whyAr={Critical:"حَرِج",Security:"أمان",Information:"معلومة",Digest:"ملخص"} as const;

function Page(){
  const {lang}=useLanguage();
  const ar=lang==="ar";
  const [on,setOn]=useState<Record<string,boolean>>({});
  const groups:Array<[boolean,string,string,string,string]>=[
    [true,"Cannot be switched off","لا يمكن إيقافها",
      "Critical events always reach you in the portal and by email - they have a deadline or touch your money, so neither can be switched off. They go to everyone whose role reaches them: reservations for bookings, finance for money.",
      "تصلك الأحداث الحرجة دائمًا في البوابة وبالبريد - فلها موعد نهائي أو تمس مالك، ولا يمكن إيقاف أي منهما. وتذهب إلى كل من يصل إليها دوره: الحجوزات للحجوزات والمالية للمال."],
    [false,"Yours to choose","اختيارك",
      "Turn these anywhere you like. Nothing here blocks work if you miss it.",
      "شغّلها حيث تشاء. ولا شيء هنا يعطّل العمل إن فاتك."],
  ];
  return <PageShell>
    <PageHeader
      overline={ar?"إعداداتك":"YOUR SETTINGS"}
      title={ar?"ما يصل إلى بريدك":"What reaches your inbox"}
      subtitle={ar?"هذه إعداداتك أنت لا إعدادات شركتك. فليلى تضبط إعداداتها على حدة، ولا يستطيع أي منكما إيقاف ما يمنع تعطّل العمل.":"These are your settings, not your company’s. Layla sets hers separately, and neither of you can switch off the things that stop work from stalling."}
      right={<Button variant="dark">{ar?"حفظ":"Save"}</Button>}
    />

    {groups.map(([required,titleEn,titleAr,descEn,descAr])=>
      <SectionCard key={String(required)} className="mb-5" title={ar?titleAr:titleEn} description={ar?descAr:descEn}>
        <div className="overflow-x-auto"><div className="min-w-[860px]">
          <div className="grid grid-cols-[1fr_110px_110px_170px_130px] gap-3 border-b border-border-subtle pb-3 text-overline text-text-muted">
            <span>{ar?"الحدث":"EVENT"}</span><span>{ar?"في البوابة":"IN-APP"}</span><span>{ar?"البريد":"EMAIL"}</span><span>{ar?"واتساب · لاحقًا":"WHATSAPP · LATER"}</span><span>{ar?"لماذا":"WHY"}</span>
          </div>
          {preferenceRows.filter(row=>row.required===required).map((row,index)=>
            <Row key={row.event} row={row} ar={ar} index={index} on={on} setOn={setOn}/>)}
        </div></div>
      </SectionCard>)}

    <div className="grid gap-5 lg:grid-cols-2">
      <SectionCard title={ar?"كيف يُحسم إعداد":"How a setting is decided"} description={ar?"ثلاث طبقات تُحسم بهذا الترتيب.":"Three layers, resolved in this order."}>
        <Marks ar={ar} rows={[
          ["info","1 · The system default for your role - a Finance user starts with settlement mail on.","١ · الافتراضي في النظام لدورك - فمستخدم المالية يبدأ وبريد التسوية مفعّل."],
          ["info","2 · Your Owner’s policy - they can make an event required for a role.","٢ · سياسة مالكك - وله أن يجعل حدثًا إلزاميًا لدور."],
          ["yes","3 · Your own choice, for anything the first two left open.","٣ · اختيارك أنت، لكل ما تركته الطبقتان الأوليان مفتوحًا."],
          ["no","A locked toggle always says who locked it. No grey switch without a reason.","والمفتاح المقفل يقول دائمًا من أقفله. ولا مفتاح رمادي بلا سبب."],
        ]}/>
      </SectionCard>
      <SectionCard title={ar?"قاعدتان يسهل تفويتهما":"Two rules that are easy to miss"}>
        <Marks ar={ar} rows={[
          ["no","You never receive a notification about an area you have no permission for, even if you switch it on.","لا يصلك إشعار عن قسم لا تملك صلاحيته أبدًا، ولو شغّلته."],
          ["info","When your role changes, the events that are new to you take the default for that role - otherwise a new Finance user would sit in silence.","وحين يتغير دورك تأخذ الأحداث الجديدة عليك افتراضي ذلك الدور - وإلا جلس مستخدم المالية الجديد في صمت."],
        ]}/>
      </SectionCard>
    </div>

    <div className="mt-5 flex flex-wrap gap-2">
      <Button variant="dark">{ar?"حفظ":"Save"}</Button>
      <Button variant="outline">{ar?"إعادة إلى افتراضيات دوري":"Reset to my role defaults"}</Button>
      <Link to="/system-states"><Button variant="ghost">{ar?"فتح الإشعارات":"Open notifications"}</Button></Link>
    </div>
  </PageShell>;
}

function Row({row,ar,index,on,setOn}:{row:PreferenceRow;ar:boolean;index:number;on:Record<string,boolean>;setOn:(fn:(s:Record<string,boolean>)=>Record<string,boolean>)=>void}){
  return <div className="grid grid-cols-[1fr_110px_110px_170px_130px] items-center gap-3 border-b border-border-subtle py-3 text-sm last:border-0">
    <span className="text-text-primary">{ar?row.eventAr:row.event}</span>
    {row.required
      ? <StatusPill tone="neutral">{ar?"إلزامي":"Required"}</StatusPill>
      : <Toggle on={on[row.event]??index<4} setOn={value=>setOn(state=>({...state,[row.event]:value}))}/>}
    {row.required
      ? <StatusPill tone="neutral">{ar?"إلزامي":"Required"}</StatusPill>
      : <Toggle on={on[`${row.event}-mail`]??index%3!==0} setOn={value=>setOn(state=>({...state,[`${row.event}-mail`]:value}))}/>}
    <span className="text-text-muted">-</span>
    <StatusPill tone={whyTone[row.why]}>{ar?whyAr[row.why]:row.why}</StatusPill>
  </div>;
}

function Marks({rows,ar}:{rows:Array<[string,string,string]>;ar:boolean}){
  return <div className="space-y-3">{rows.map(([mark,en,arabic])=><div key={en} className="flex gap-3 text-sm text-text-primary">
    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${mark==="no"?"bg-status-danger-bg text-status-danger":mark==="info"?"bg-status-neutral-bg text-text-secondary":"bg-status-success-bg text-status-success"}`}>{mark==="no"?"✕":mark==="info"?"i":"✓"}</span>
    <span className="leading-5">{ar?arabic:en}</span>
  </div>)}</div>;
}

function Toggle({on,setOn}:{on:boolean;setOn:(v:boolean)=>void}){
  return <Button size="icon-sm" variant={on?"dark":"outline"} aria-pressed={on} aria-label="Toggle notification" onClick={()=>setOn(!on)} className="rounded-full"><span className="h-3 w-3 rounded-full bg-current"/></Button>;
}
