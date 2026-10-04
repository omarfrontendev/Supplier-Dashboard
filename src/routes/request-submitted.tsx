import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Clock, X, XCircle } from "lucide-react";
import { useState } from "react";
import {
  PageHeader,
  PageShell,
  SectionCard,
  StatusPill,
} from "@/components/layout/page-shell";
import { IconModal, OverlaySummary } from "@/components/layout/overlay";
import { Button } from "@/components/ui/button";
import { fill, useLanguage } from "@/lib/i18n";
import { usePortal } from "@/lib/portal-store";
import { companyRecord } from "@/lib/demo-data";
import { fieldLabel } from "@/lib/field-labels";
import { changeFieldCopy } from "@/lib/company-change-copy";

export const Route = createFileRoute("/request-submitted")({
  head: () => ({
    meta: [
      { title: "Change request submitted · Hoteliana Supplier Portal" },
      {
        name: "description",
        content:
          "Track the review status of the company change request you submitted to Hoteliana.",
      },
      {
        property: "og:title",
        content: "Change request submitted · Hoteliana Supplier Portal",
      },
      {
        property: "og:description",
        content: "Your requested company changes are pending Hoteliana review.",
      },
    ],
  }),
  component: RequestSubmittedPage,
});

function RequestSubmittedPage() {
  const { c, lang } = useLanguage();
  const { selectedFields, entries } = usePortal();
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const selected = companyRecord.filter((f) => selectedFields.includes(f.id));
  const t = c.submitted.timeline;

  const timeline = [
    { title: t.submitted, note: t.submittedNote, state: "done" as const },
    { title: t.review, note: t.reviewNote, state: "active" as const },
    { title: t.decision, note: t.decisionNote, state: "waiting" as const },
    { title: t.notified, note: t.notifiedNote, state: "waiting" as const },
  ];

  return (
    <PageShell>
      <PageHeader
        overline={c.submitted.overline}
        title={c.submitted.title}
        subtitle={c.submitted.subtitle}
        right={
          <div className="text-end">
            <StatusPill tone="warning">{c.submitted.statusLabel}</StatusPill>
            <p className="mt-1.5 text-xs text-text-muted">
              {c.submitted.statusNote}
            </p>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <SectionCard
          overline={fill(c.submitted.cardOverline, { count: selected.length })}
          title={c.submitted.cardTitle}
        >
          <div className="space-y-3">
            {selected.map((field) => {
              const entry = entries[field.id];
              return (
                <div
                  key={field.id}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-border-subtle p-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-text-primary">
                      {fieldLabel(c, field.id)}
                    </p>
                    <p className="font-data mt-1 text-sm text-text-secondary">
                      {entry?.value || entry?.file || "—"}
                      {changeFieldCopy[field.id] &&
                        ` · ${
                          lang === "ar"
                            ? changeFieldCopy[field.id]!.submittedAr
                            : changeFieldCopy[field.id]!.submitted
                        }`}
                    </p>
                  </div>
                  <StatusPill tone="warning">{c.submitted.pending}</StatusPill>
                </div>
              );
            })}
          </div>
          <p className="font-data mt-4 text-xs text-text-muted">
            {c.submitted.reference}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="danger" onClick={() => setWithdrawOpen(true)}>
              {c.submitted.withdraw}
            </Button>
            <Link to="/agreement">
              <Button variant="outline">{c.submitted.returnToAgreement}</Button>
            </Link>
            <Link to="/hotels">
              <Button variant="secondary">{c.common.continueToLibrary}</Button>
            </Link>
            <Link to="/change-approved">
              <Button variant="ghost">{c.decision.approvedStatus}</Button>
            </Link>
            <Link to="/change-partly-approved">
              <Button variant="ghost">{c.decision.partlyStatus}</Button>
            </Link>
            <Link to="/change-rejected">
              <Button variant="ghost">{c.decision.rejectedStatus}</Button>
            </Link>
          </div>

        </SectionCard>

        <SectionCard
          overline={c.submitted.timelineOverline}
          title={c.submitted.timelineTitle}
        >
          <ol className="space-y-4">
            {timeline.map((item) => (
              <li key={item.title} className="flex gap-3">
                <span
                  className={
                    item.state === "done"
                      ? "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-status-success-bg text-status-success"
                      : item.state === "active"
                        ? "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-status-warning-bg text-status-warning"
                        : "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-subtle text-text-muted"
                  }
                >
                  {item.state === "done" ? (
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                </span>
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-sm text-text-secondary">{item.note}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-xs leading-relaxed text-text-muted">
            {c.submitted.note}
          </p>
        </SectionCard>
      </div>

      {withdrawOpen && (
        <WithdrawModal onClose={() => setWithdrawOpen(false)} />
      )}
    </PageShell>
  );
}

/** OV 01.6K — what stops if the supplier pulls the request back. */
function WithdrawModal({ onClose }: { onClose: () => void }) {
  const { c, lang } = useLanguage();
  const { selectedFields } = usePortal();
  const w = c.submitted.withdrawModal;

  /* The design lists the two details of the open request. */
  const ids = selectedFields.length ? selectedFields : ["ownerEmail", "tax"];
  /* The sentence names the details actually under review, not two fixed ones. */
  const details = ids
    .map((id) => fieldLabel(c, id).toLocaleLowerCase(lang === "ar" ? "ar" : "en"))
    .join(lang === "ar" ? " و" : " and ");
  const items = ids.map((id) => {
    const field = companyRecord.find((f) => f.id === id);
    return fill(field?.kind === "file" ? w.fileItem : w.valueItem, {
      field: fieldLabel(c, id),
    });
  });

  return (
    <IconModal
      tone="danger"
      icon={<XCircle className="h-4 w-4" aria-hidden="true" />}
      overline={w.overline}
      title={w.title}
      body={fill(w.body, { details })}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {w.keep}
          </Button>
          <Button variant="danger" onClick={onClose}>
            {c.submitted.withdraw}
          </Button>
        </>
      }
    >
      <OverlaySummary>
        <p className="text-[10px] font-medium uppercase tracking-[0.04em] text-text-muted">
          {w.listLabel}
        </p>
        {items.map((item) => (
          <p
            key={item}
            className="flex items-center gap-2 text-[12.5px] text-text-body"
          >
            <X className="h-3 w-3 shrink-0 text-text-muted" aria-hidden="true" />
            {item}
          </p>
        ))}
      </OverlaySummary>
    </IconModal>
  );
}
