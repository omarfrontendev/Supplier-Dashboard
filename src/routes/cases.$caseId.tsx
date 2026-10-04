import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHeader, SectionCard, StatusPill } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { caseViews, supportCases, type CaseState } from "@/lib/system-state-data";
import { useLanguage } from "@/lib/i18n";

export const Route=createFileRoute("/cases/$caseId")({head:()=>({meta:[{title:"Case detail · Hoteliana"},{name:"description",content:"Review a Hoteliana support case."},{property:"og:title",content:"Case detail · Hoteliana"},{property:"og:description",content:"Review a Hoteliana support case."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"}]}),component:Page});

const tones:Record<CaseState,"info"|"warning"|"success"|"neutral">={open:"info",review:"info",waiting:"warning",resolved:"success",closed:"neutral"};
const stateLabels:Record<CaseState,[string,string]>={
  open:["Open","مفتوحة"],
  review:["In review","قيد المراجعة"],
  waiting:["Waiting on you","بانتظارك"],
  resolved:["Resolved","محلولة"],
  closed:["Closed","مغلقة"],
};

function Page(){
  const {caseId}=Route.useParams();
  const {lang}=useLanguage();
  const ar=lang==="ar";
  const row=supportCases.find(item=>item.id===caseId);
  const view=caseViews[caseId];
  const state=row?.state??"open";

  if(!view)return <PageShell>
    <PageHeader overline={caseId} title={row?(ar?row.subjectAr:row.subject):caseId} subtitle={row?(ar?row.linkedAr:row.linked):""} pill={<StatusPill tone={tones[state]}>{stateLabels[state][ar?1:0]}</StatusPill>}/>
    <Link to="/cases"><Button variant="outline">{ar?"العودة إلى حالاتي":"Back to my cases"}</Button></Link>
  </PageShell>;

  return <PageShell>
    <PageHeader
      overline={caseId}
      title={ar?view.titleAr:view.title}
      subtitle={ar?view.metaAr:view.meta}
      pill={<StatusPill tone={tones[state]}>{stateLabels[state][ar?1:0]}</StatusPill>}
      right={<Button variant="outline">{ar?"الرد":"Reply"}</Button>}
    />

    <section className={`mb-5 rounded-lg border p-5 ${state==="waiting"?"border-status-warning/20 bg-status-warning-bg":"border-border-subtle bg-surface-subtle"}`}>
      <h2 className="text-base font-semibold text-text-primary">{ar?view.bannerTitleAr:view.bannerTitle}</h2>
      <p className="mt-2 max-w-[880px] text-xs leading-5 text-text-secondary">{ar?view.bannerBodyAr:view.bannerBody}</p>
      <div className="mt-4 flex flex-wrap gap-2">{view.actions.map(action=>
        <Button key={action.label} size="sm" variant={action.primary?"dark":"outline"}>{ar?action.labelAr:action.label}</Button>)}
      </div>
    </section>

    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_420px]">
      <SectionCard title={ar?"المحادثة":"The conversation"}>
        <div className="space-y-3">{view.messages.map((message,index)=>
          <article key={`${message.who}-${index}`} className={`rounded-lg border p-4 ${message.mine?"border-primary-subtle-border bg-primary-subtle":"border-border-subtle bg-surface-default"}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <b className="text-xs text-text-primary">{ar?message.whoAr:message.who}</b>
              <span className="font-data text-[11px] text-text-muted">{ar?message.whenAr:message.when}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-text-secondary">{ar?message.textAr:message.text}</p>
          </article>)}
        </div>
      </SectionCard>

      <div className="space-y-5">
        <SectionCard title={ar?"المرفق بهذه الحالة":"Attached to this case"} description={ar?"التُقط عند فتحها - ولم يُكتب شيء هنا يدويًا.":"Captured when you opened it - nothing here was typed by hand."}>
          <div className="divide-y divide-border-subtle">{view.attached.map(row2=>
            <div key={row2.label} className="grid gap-1 py-3 sm:grid-cols-[150px_1fr]">
              <span className="text-xs text-text-muted">{ar?row2.labelAr:row2.label}</span>
              <span className="text-sm text-text-primary">{ar?row2.valueAr:row2.value}</span>
            </div>)}
          </div>
        </SectionCard>

        <SectionCard title={ar?"كيف تنتهي هذه":"How this one ends"}>
          <div className="space-y-3">{view.ends.map(([mark,en,arabic])=>
            <div key={en} className="flex gap-3 text-sm text-text-primary">
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${mark==="info"?"bg-status-neutral-bg text-text-secondary":"bg-status-success-bg text-status-success"}`}>{mark==="info"?"i":"✓"}</span>
              <span className="leading-5">{ar?arabic:en}</span>
            </div>)}
          </div>
        </SectionCard>
      </div>
    </div>

    <div className="mt-5 flex flex-wrap gap-2">
      {view.actions.map(action=><Button key={action.label} variant={action.primary?"dark":"outline"}>{ar?action.labelAr:action.label}</Button>)}
      <Link to="/cases"><Button variant="ghost">{ar?"العودة إلى حالاتي":"Back to my cases"}</Button></Link>
    </div>
  </PageShell>;
}
