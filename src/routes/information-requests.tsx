import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, PageShell, SectionCard, StatusPill } from "@/components/layout/page-shell";
import { VersionSent } from "@/components/exceptions/version-sent";
import { Button } from "@/components/ui/button";
import { acceptedDetails, informationRequests, type DetailState, type DetailVersion, type InformationRequest } from "@/lib/business-exception-data";
import { useLanguage } from "@/lib/i18n";

export const Route=createFileRoute("/information-requests")({
  validateSearch:(search:Record<string,unknown>):{state?:"clear"}=>search["state"]==="clear"?{state:"clear"}:{},
  head:()=>({meta:[{title:"More information required · Hoteliana Supplier Portal"},{name:"description",content:"Correct and track the details Hoteliana asked for."},{property:"og:title",content:"More information required · Hoteliana Supplier Portal"},{property:"og:description",content:"Correct and track the details Hoteliana asked for."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"}]}),
  component:InformationRequests,
});

const stateTone:Record<DetailState,"danger"|"warning"|"neutral"|"success">={rejected:"danger",review:"warning",required:"neutral",accepted:"success"};

function InformationRequests(){
  const {lang}=useLanguage();
  const ar=lang==="ar";
  const {state}=Route.useSearch();
  const clear=state==="clear";
  /* OV 10.9B - which version is being read, if any. */
  const [sent,setSent]=useState<DetailVersion|null>(null);
  return <PageShell>
    <PageHeader
      overline={ar?"الفندق · المعلومات":"PROPERTY · INFORMATION"}
      title={ar?"مطلوب معلومات إضافية":"More information required"}
      pill={<StatusPill tone={clear?"success":"warning"}>{clear?(ar?"كل شيء مكتمل":"All clear"):(ar?"٢ مطلوبان منك · ١ قيد المراجعة":"2 needed from you · 1 in review")}</StatusPill>}
      subtitle={clear
        ?(ar?"لا شيء مفتوح. قبلت هوتيليانا كل تفصيل.":"Nothing is open. Hoteliana accepted every detail.")
        :(ar?"راجعت هوتيليانا تفاصيلك عن هيلتون المدينة - اثنان منها يحتاجانك. وحتى تُقبل يبقى كل عقد على هذا الفندق محجوبًا عن البيع.":"Hoteliana checked your details for Hilton Madinah - two need you. Until they are accepted, every contract on this hotel stays blocked from sale.")}
      right={clear
        ?<Link to="/sell-status"><Button variant="dark">{ar?"فتح حالة البيع":"Open sell status"}</Button></Link>
        :<Button variant="dark">{ar?"صحّح التفصيلين":"Correct the 2 details"}</Button>}
    />

    <section className={`mb-5 rounded-lg border p-5 ${clear?"border-status-success/20 bg-status-success-bg":"border-status-warning/20 bg-status-warning-bg"}`}>
      <h2 className="text-base font-semibold text-text-primary">{clear?(ar?"هيلتون المدينة يبيع من جديد.":"Hilton Madinah is selling again."):(ar?"لهذا لا يبيع هيلتون المدينة.":"This is why Hilton Madinah is not selling.")}</h2>
      <p className="mt-2 max-w-[880px] text-xs leading-5 text-text-secondary">{clear
        ?(ar?"قُبل آخر تفصيل في ١٦ سبتمبر ٢٠٢٦ وارتفع حاجز «مطلوب معلومات إضافية» من تلقاء نفسه. افتح حالة البيع لترى ما الذي يُباع.":"The last detail was accepted on 16 Sep 2026 and the More information needed blocker lifted by itself. Open sell status to check what is selling.")
        :(ar?"يجلس حاجز «مطلوب معلومات إضافية» على كل عقد لهذا الفندق. ويرتفع من تلقاء نفسه لحظة قبول آخر تفصيل - ولا يلزمك طلبه.":"Blocker More information needed sits on every contract for this hotel. It lifts by itself the moment the last detail is accepted - you do not have to ask for it.")}</p>
      <Link to="/sell-status" className="mt-3 inline-block text-xs font-medium text-text-link">{ar?"عرض ما يمنع البيع":"See what is blocking sale"}</Link>
    </section>

    <SectionCard
      title={clear?(ar?"الطلبات، مغلقة":"The requests, closed"):(ar?"ما طلبته هوتيليانا":"What Hoteliana asked for")}
      {...(clear?{}:{description:ar?"لكل طلب حالته الخاصة. والقائمة التي تضع علامات فقط لا تكفي - فأنت تحتاج أن تعرف هل نظر أحد فيها.":"Every request has a state of its own. A checklist that only ticks boxes is not enough - you need to know whether someone has looked at it."})}>
      <div className="divide-y divide-border-subtle">{informationRequests.map(request=>
        <RequestRow key={request.id} request={request} ar={ar} clear={clear} onRead={setSent}/>)}
      </div>
    </SectionCard>

    <SectionCard
      className="mt-5"
      title={clear?(ar?"أمران تذكرهما":"Two things to keep in mind"):(ar?"كيف يتصرف طلب التصحيح":"How a correction request behaves")}>
      <div className="space-y-3">{(clear?[
        ["info","If you change any of these later, the change goes to Hoteliana first - sale keeps running on the accepted version meanwhile.","إن غيّرت أيًا منها لاحقًا فالتغيير يذهب إلى هوتيليانا أولًا - ويستمر البيع على النسخة المقبولة في هذه الأثناء."],
        ["yes","Every rejected version is still on the record - the audit trail never loses a step.","وكل نسخة مرفوضة ما زالت في السجل - ولا يفقد سجل التدقيق خطوة أبدًا."],
      ]:[
        ["info","States: Required → Sent → Under review → Accepted, or Rejected · needs correcting.","الحالات: مطلوب ← أُرسل ← قيد المراجعة ← مقبول، أو مرفوض · يحتاج تصحيحًا."],
        ["yes","Every version you send is kept. A correction never erases the one before it.","تُحفظ كل نسخة ترسلها. ولا يمحو التصحيح ما قبله أبدًا."],
        ["no","A rejection always carries a written reason - otherwise you would send the same mistake twice.","يحمل الرفض دائمًا سببًا مكتوبًا - وإلا أرسلت الخطأ نفسه مرتين."],
        ["info","Hoteliana never asks for your contract with the hotel - only that what you sell here is described correctly.","لا تطلب هوتيليانا عقدك مع الفندق أبدًا - إنما أن يوصف ما تبيعه هنا وصفًا صحيحًا."],
      ]).map(([mark,en,arabic])=><div key={en} className="flex gap-3 text-sm text-text-primary">
        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${mark==="no"?"bg-status-danger-bg text-status-danger":mark==="info"?"bg-status-neutral-bg text-text-secondary":"bg-status-success-bg text-status-success"}`}>{mark==="no"?"✕":mark==="info"?"i":"✓"}</span>
        <span className="leading-5">{ar?arabic:en}</span>
      </div>)}</div>
    </SectionCard>

    {!clear&&<SectionCard className="mt-5" title={ar?"تفاصيل مقبولة بالفعل":"Details already accepted"}>
      <div className="divide-y divide-border-subtle">{acceptedDetails.map(detail=>
        <div key={detail.name} className="flex flex-wrap items-center justify-between gap-3 py-3">
          <span className="text-sm text-text-primary">{ar?detail.nameAr:detail.name}</span>
          <StatusPill tone="success">{ar?detail.whenAr:detail.when}</StatusPill>
        </div>)}
      </div>
    </SectionCard>}

    {sent&&<VersionSent version={sent} onClose={()=>setSent(null)}/>}
  </PageShell>;
}

function RequestRow({request,ar,clear,onRead}:{request:InformationRequest;ar:boolean;clear:boolean;onRead:(version:DetailVersion)=>void}){
  const versions=clear&&request.acceptedVersion?[request.acceptedVersion,...request.versions]:request.versions;
  const actions=clear?request.acceptedActions:request.actions;
  /* "See why" and "View" both open the newest version there is. */
  const newest=versions.find(version=>version.sent);
  return <div className="py-4">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-text-primary">{ar?request.nameAr:request.name}</h3>
          <StatusPill tone={clear?"success":stateTone[request.state]}>{clear?(ar?"مقبول":"Accepted"):(ar?request.stateNoteAr:request.stateNote)}</StatusPill>
        </div>
        <p className="mt-1 text-xs text-text-secondary">{clear?(ar?request.acceptedNoteAr:request.acceptedNote):(ar?request.aboutAr:request.about)}</p>
      </div>
      <div className="flex flex-wrap gap-2">{actions.map(action=>
        <Button key={action.label} size="sm" variant={action.primary?"dark":"outline"}
          {...(action.opens==="sent"&&newest?{onClick:()=>onRead(newest)}:{})}>{ar?action.labelAr:action.label}</Button>)}
      </div>
    </div>
    {/* One block, a row a version - and a version you can still read is a
        row you can open (OV 10.9B). */}
    {versions.length>0&&<div className="mt-3 overflow-hidden rounded-lg bg-surface-subtle">{versions.map(version=>{
      const line=<>
        <b className="font-data text-text-muted">{version.version}</b>
        <span className={`flex-1 text-start ${version.state==="rejected"?"text-status-danger":"text-text-secondary"}`}>{ar?version.noteAr:version.note}</span>
        <span className="font-data text-text-muted">{ar?version.whenAr:version.when}</span>
      </>;
      return version.sent
        ?<button key={version.version} type="button" onClick={()=>onRead(version)} className="flex w-full flex-wrap items-center gap-3 px-3 py-2 text-xs transition-colors hover:bg-border-subtle">{line}</button>
        :<div key={version.version} className="flex flex-wrap items-center gap-3 px-3 py-2 text-xs">{line}</div>;
    })}
    </div>}
  </div>;
}
