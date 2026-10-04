import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Drawer } from "@/components/layout/overlay";
import { PageHeader, PageShell, SectionCard, StatusPill } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { conflictNights, systemStates, type SystemStateKey } from "@/lib/system-state-data";
import { useLanguage } from "@/lib/i18n";

export const Route=createFileRoute("/system-states")({head:()=>({meta:[{title:"System states · Hoteliana"},{name:"description",content:"Understand access, saving and session states."},{property:"og:title",content:"System states · Hoteliana"},{property:"og:description",content:"Understand access, saving and session states."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"}]}),component:Page});

const ORDER:SystemStateKey[]=["permission","scope","readonly","save","publish","partial","session","security","deactivated","changed"];
const FLOW=["Unsaved local changes","Saved draft","Publish failed","Published"];
const FLOW_AR=["تغييرات محلية غير محفوظة","مسودة محفوظة","فشل النشر","منشور"];

function Page(){
  const {lang}=useLanguage();
  const ar=lang==="ar";
  const [state,setState]=useState<SystemStateKey>("permission");
  const [request,setRequest]=useState(false);
  const view=systemStates[state];
  const flow=state==="save"||state==="publish"||state==="partial";

  return <PageShell>
    <PageHeader
      overline={ar?"حالات النظام":"SYSTEM STATES"}
      title={ar?"السبب يكتب الرسالة":"The reason writes the message"}
      subtitle={ar?"كل رفض وفشل وخروج يسمّي سببه والإجراء الصحيح التالي.":"Every denial, failure and sign-out names its cause and the next valid action."}
    />

    <div className="mb-5 flex gap-2 overflow-x-auto pb-2">{ORDER.map(key=>
      <Button key={key} size="sm" variant={state===key?"dark":"outline"} onClick={()=>setState(key)}>{ar?systemStates[key].labelAr:systemStates[key].label}</Button>)}
    </div>

    <section className={`mb-5 rounded-lg border p-5 ${state==="deactivated"||state==="security"?"border-border-subtle bg-surface-subtle":flow?"border-status-warning/20 bg-status-warning-bg":"border-status-info/20 bg-status-info-bg"}`}>
      <StatusPill tone={state==="deactivated"||state==="security"?"neutral":flow?"warning":"info"}>{ar?view.labelAr:view.label}</StatusPill>
      <h2 className="mt-2 text-lg font-semibold text-text-primary">{ar?view.titleAr:view.title}</h2>
      <p className="mt-2 max-w-[880px] text-xs leading-5 text-text-secondary">{ar?view.bodyAr:view.body}</p>
      <div className="mt-4 flex flex-wrap gap-2">{view.actions.map(action=>
        <Button key={action.label} size="sm" variant={action.primary?"dark":"outline"} onClick={state==="permission"&&action.primary?()=>setRequest(true):undefined}>{ar?action.labelAr:action.label}</Button>)}
      </div>
    </section>

    {flow&&<SectionCard className="mb-5" title={ar?"أين أنت":"Where you are"} description={ar?"الحفظ والنشر أمران مختلفان، وبينهما أربع حالات.":"Saving and publishing are two different things, with four states between them."}>
      <div className="flex flex-wrap items-center gap-2">{FLOW.map((step,index)=><span key={step} className="flex items-center gap-2">
        <StatusPill tone={index===2?"danger":index===3?"success":"neutral"}>{ar?FLOW_AR[index]:step}</StatusPill>
        {index<3&&<span className="text-text-muted">→</span>}
      </span>)}</div>
    </SectionCard>}

    {(view.needs||view.has)&&<div className="mb-5 grid gap-5 lg:grid-cols-2">
      {view.needs&&<SectionCard title={(ar?view.needsTitleAr:view.needsTitle)??""} {...(view.needsNote?{description:ar?view.needsNoteAr:view.needsNote}:{})}>
        <div className="flex flex-wrap gap-2">{view.needs.map(key=><StatusPill key={key} tone="danger">{key}</StatusPill>)}</div>
      </SectionCard>}
      {view.has&&<SectionCard title={(ar?view.hasTitleAr:view.hasTitle)??""} {...(view.hasNote?{description:ar?view.hasNoteAr:view.hasNote}:{})}>
        <div className="flex flex-wrap gap-2">{view.has.map(key=><StatusPill key={key} tone={key.endsWith("- off")||key.includes("not in your scope")?"neutral":"success"}>{key}</StatusPill>)}</div>
      </SectionCard>}
    </div>}

    {view.rows&&<SectionCard className="mb-5" title={(ar?view.rowsTitleAr:view.rowsTitle)??""} {...(view.rowsNote?{description:ar?view.rowsNoteAr:view.rowsNote}:{})}>
      <div className="overflow-x-auto"><div className="min-w-[860px]">
        <div className="grid grid-cols-[220px_170px_1fr_180px] gap-3 border-b border-border-subtle pb-3 text-overline text-text-muted">
          {(ar?view.rowHeadsAr??view.rowHeads:view.rowHeads)?.map(head=><span key={head}>{head}</span>)}
        </div>
        {view.rows.map(row=><div key={row.what} className="grid grid-cols-[220px_170px_1fr_180px] items-center gap-3 border-b border-border-subtle py-3 text-xs last:border-0">
          <b className="text-text-primary">{ar?row.whatAr:row.what}</b>
          <span className="font-data">{ar?row.whenAr:row.when}</span>
          <span className="text-text-secondary">{ar?row.whyAr:row.why}</span>
          <span className="text-text-muted">{ar?row.todoAr:row.todo}</span>
        </div>)}
      </div></div>
    </SectionCard>}

    {state==="partial"&&<SectionCard className="mb-5" title={ar?"غرفة ديلوكس · نوفمبر":"Deluxe Room · November"} description={ar?"الخلايا الحمراء وحدها ما زالت غير محفوظة.":"Red cells are the only ones still unsaved."}>
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 xl:grid-cols-10">{conflictNights.map(night=>
        <div key={night.label} className={`rounded-lg border p-2 text-center text-[11px] ${night.conflict?"border-status-danger/30 bg-status-danger-bg text-status-danger":"border-border-subtle bg-surface-default"}`}>
          <p className="font-data">{night.label}</p>
          <p className="mt-1 font-semibold">{night.conflict?(ar?"تعارض":"conflict"):night.value}</p>
        </div>)}
      </div>
    </SectionCard>}

    <SectionCard title={ar?view.cardTitleAr:view.cardTitle}>
      <div className="space-y-3">{view.lines.map(([mark,en,arabic])=>
        <div key={en} className="flex gap-3 text-sm text-text-primary">
          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${mark==="no"?"bg-status-danger-bg text-status-danger":mark==="info"?"bg-status-neutral-bg text-text-secondary":"bg-status-success-bg text-status-success"}`}>{mark==="no"?"✕":mark==="info"?"i":"✓"}</span>
          <span className="leading-5">{ar?arabic:en}</span>
        </div>)}
      </div>
    </SectionCard>

    <div className="mt-5 flex flex-wrap gap-2">
      {view.actions.map(action=><Button key={action.label} variant={action.primary?"dark":"outline"} onClick={state==="permission"&&action.primary?()=>setRequest(true):undefined}>{ar?action.labelAr:action.label}</Button>)}
      <Link to="/dashboard" search={{}}><Button variant="ghost">{ar?"العودة إلى لوحة اليوم":"Back to dashboard"}</Button></Link>
    </div>

    {request&&<Drawer
      title={ar?"اطلب الصلاحية من المالك":"Ask the Owner for access"}
      meta={ar?"يصل عبدالرحمن طلبًا لا رسالة":"This goes to Abdullrahman as a request, not a message"}
      onClose={()=>setRequest(false)}
      footer={<Button onClick={()=>setRequest(false)}>{ar?"إرسال الطلب":"Send the request"}</Button>}>
      <SectionCard title={ar?"ما الذي تحتاجه؟":"What do you need?"}>
        {["see finance","see booking money","see guest identity"].map((key,index)=>
          <label key={key} className="flex gap-3 border-b border-border-subtle py-3"><input type="checkbox" defaultChecked={index===0}/><span>{key}</span></label>)}
      </SectionCard>
      <SectionCard className="mt-3" title={ar?"لماذا تحتاجها":"Why you need it"}>
        <Textarea defaultValue={ar?"أحتاج مراجعة التسوية على الحجوزات التي أؤكدها.":"I need to check the settlement on the bookings I confirm."}/>
      </SectionCard>
    </Drawer>}
  </PageShell>;
}
