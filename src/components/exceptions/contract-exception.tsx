import { Link } from "@tanstack/react-router";
import { PageHeader, SectionCard, StatusPill } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { contractExceptions, outsideTermNights, type ContractExceptionState } from "@/lib/business-exception-data";

const pillTone: Record<ContractExceptionState, "warning" | "neutral" | "danger"> = {
  ending:"warning", ended:"neutral", paused:"warning", terminated:"danger",
};

/** UI 10.0 – 10.3 — the four states a supply contract can be read in. */
export function ContractException({state,ar}:{state:ContractExceptionState;ar:boolean}){
  const view=contractExceptions[state];
  return <>
    <PageHeader
      overline={ar?view.metaAr:view.meta}
      title={ar?view.nameAr:view.name}
      pill={<StatusPill tone={pillTone[state]}>{ar?view.pillAr:view.pill}</StatusPill>}
      right={<div className="flex flex-wrap gap-2">{view.actions.map(action=>
        <Button key={action.label} variant={action.primary?"dark":"outline"}>{ar?action.labelAr:action.label}</Button>)}
      </div>}
    />

    <section className={`mb-5 rounded-lg border p-5 ${state==="terminated"?"border-status-danger/20 bg-status-danger-bg":state==="ended"?"border-border-subtle bg-surface-subtle":"border-status-warning/20 bg-status-warning-bg"}`}>
      <h2 className="text-base font-semibold text-text-primary">{ar?view.titleAr:view.title}</h2>
      <p className="mt-2 max-w-[880px] text-xs leading-5 text-text-secondary">{ar?view.bodyAr:view.body}</p>
    </section>

    <SectionCard title={ar?view.cardTitleAr:view.cardTitle}>
      <div className="space-y-3">{view.lines.map(line=><div key={line.text} className="flex gap-3 text-sm text-text-primary">
        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${line.mark==="no"?"bg-status-danger-bg text-status-danger":line.mark==="info"?"bg-status-neutral-bg text-text-secondary":"bg-status-success-bg text-status-success"}`}>{line.mark==="no"?"✕":line.mark==="info"?"i":"✓"}</span>
        <span className="leading-5">{ar?line.textAr:line.text}</span>
      </div>)}</div>
    </SectionCard>

    {state==="ending"&&<SectionCard
      className="mt-5"
      title={ar?"ليالٍ خارج مدة العقد - لا تُباع إلا بعد التجديد":"Nights outside the contract term - they sell only after you renew"}
      description={ar?"لهذه الليالي سعر ومخزون، لكنها تقع خارج مدة العقد.":"These nights have a rate and stock, but sit outside the contract term."}>
      <div className="space-y-3">{outsideTermNights.map(night=><div key={night.text} className="flex gap-3 text-sm text-text-primary">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-status-danger-bg text-xs text-status-danger">✕</span>
        <span className="leading-5">{ar?night.textAr:night.text}</span>
      </div>)}</div>
    </SectionCard>}

    {state==="ending"&&<SectionCard
      className="mt-5"
      title={ar?"نافذة التحذير إعداد لا رقم ثابت":"The warning window is a setting, not a fixed number"}
      description={ar?"تتحكم هوتيليانا في موعد ظهور هذا التنبيه. وهو غير مثبّت على ٢٨ يومًا.":"Hoteliana controls when this banner appears. It is not hard-coded at 28 days."}>
      <div className="rounded-lg bg-surface-subtle p-4">
        <p className="text-overline text-text-muted">{ar?"متى يبدأ هذا التحذير":"When this warning starts"}</p>
        <p className="mt-1 text-sm text-text-primary">{ar?"الافتراضي ٣٠ يومًا · هذا المورّد: ٢٨ يومًا":"default 30 days · this supplier: 28 days"}</p>
      </div>
    </SectionCard>}

    {state==="terminated"&&<SectionCard
      className="mt-5"
      title={ar?"المنتهي والموقوف والمُنهى ليست شيئًا واحدًا":"Expired, Paused and Terminated are not the same thing"}
      description={ar?"لكل واحد منها قواعده.":"Each one has its own rules."}>
      <div className="space-y-3">{[
        ["Expired - the term ended on its own date. Renew or copy to a new period.","منتهٍ - انتهت المدة في تاريخها. جدّد أو انسخ إلى فترة جديدة."],
        ["Paused - a temporary hold by Hoteliana. Reversible in one step.","موقوف - حجب مؤقت من هوتيليانا. ويُرفع بخطوة واحدة."],
        ["Terminated - ended early and permanently. Not reversible.","مُنهى - أُنهي مبكرًا ونهائيًا. وغير قابل للرجوع."],
      ].map(([en,arabic])=><div key={en} className="flex gap-3 text-sm text-text-primary">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-status-neutral-bg text-xs text-text-secondary">i</span>
        <span className="leading-5">{ar?arabic:en}</span>
      </div>)}</div>
    </SectionCard>}

    {state==="ended"&&<SectionCard
      className="mt-5"
      title={ar?"التقويم بعد تاريخ النهاية":"The calendar after the end date"}
      description={ar?"للقراءة فقط. وتبقى الأرقام حيث كانت في آخر يوم من المدة.":"Read-only. The numbers stay where they were on the last day of the term."}>
      <div className="grid gap-2 sm:grid-cols-4">
        {[["28 Dec","SAR 420","6 rooms left"],["29 Dec","SAR 420","6 rooms left"],["30 Dec","SAR 420","6 rooms left"],["31 Dec","SAR 420","6 rooms left"],["01 Jan","-","outside term"],["02 Jan","-","outside term"],["03 Jan","-","outside term"],["04 Jan","-","outside term"]].map(([day,rate,stock])=>
          <div key={day} className={`rounded-lg border p-3 text-xs ${stock==="outside term"?"border-border-subtle bg-surface-subtle text-text-muted":"border-border-subtle bg-surface-default"}`}>
            <p className="font-data font-semibold text-text-primary">{day}</p>
            <p className="font-data mt-1">{rate}</p>
            <p className="mt-1 text-text-muted">{stock}</p>
          </div>)}
      </div>
    </SectionCard>}

    <p className="mt-5 text-xs text-text-muted">
      <Link to="/sell-status" className="text-text-link">{ar?"عرض ما يمنع البيع":"See what is blocking sale"}</Link>
    </p>
  </>;
}
