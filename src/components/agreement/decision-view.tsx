import { Link } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  BackLink,
  PageHeader,
  PageShell,
  SectionCard,
  StatusPill,
} from "@/components/layout/page-shell";
import { Timeline } from "@/components/layout/overlay";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { changeDecision } from "@/lib/demo-data";
import { fieldLabel } from "@/lib/field-labels";

export type DecisionOutcome = "approved" | "rejected" | "partly";

/**
 * Result of a company change request — Figma UI 01.6F (approved),
 * UI 01.6G (rejected) and UI 01.6H (partly approved).
 */
export function DecisionView({ outcome }: { outcome: DecisionOutcome }) {
  const { c, lang } = useLanguage();
  const d = c.decision;
  const rows = changeDecision[outcome];
  const good = outcome === "approved";
  const partly = outcome === "partly";

  const head = {
    approved: {
      overline: d.approvedOverline,
      title: d.approvedTitle,
      body: d.approvedBody,
      status: d.approvedStatus,
      tone: "success" as const,
      cardOverline: d.appliedOverline,
      cardTitle: d.appliedTitle,
      note: d.approvedNoteFooter,
      timeline: d.approvedNote,
    },
    rejected: {
      overline: d.rejectedOverline,
      title: d.rejectedTitle,
      body: d.rejectedBody,
      status: d.rejectedStatus,
      tone: "danger" as const,
      cardOverline: d.appliedOverline,
      cardTitle: d.rejectedListTitle,
      note: d.rejectedNoteFooter,
      timeline: d.rejectedNote,
    },
    partly: {
      overline: d.partlyOverline,
      title: d.partlyTitle,
      body: d.partlyBody,
      status: d.partlyStatus,
      tone: "warning" as const,
      cardOverline: d.partlyAppliedOverline,
      cardTitle: d.partlyListTitle,
      note: d.partlyNoteFooter,
      timeline: d.partlyNote,
    },
  }[outcome];

  return (
    <PageShell>
      <BackLink to="/agreement" label={c.common.backToAgreement} />
      <PageHeader
        overline={head.overline}
        title={head.title}
        subtitle={head.body}
        right={
          <div className="flex flex-wrap items-center gap-3">
            <StatusPill tone={head.tone}>{head.status}</StatusPill>
            <span className="text-sm text-text-muted">{d.decided}</span>
          </div>
        }
      />

      <div
        className={
          good
            ? "mb-6 flex items-center gap-3 rounded-xl border border-status-success/25 bg-status-success-bg p-4 text-status-success"
            : partly
              ? "mb-6 flex items-center gap-3 rounded-xl border border-status-warning/25 bg-status-warning-bg p-4 text-status-warning"
              : "mb-6 flex items-center gap-3 rounded-xl border border-status-danger/25 bg-status-danger-bg p-4 text-status-danger"
        }
      >
        {good ? (
          <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
        ) : (
          <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden="true" />
        )}
        <p className="font-data text-sm">{d.reference}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <SectionCard overline={head.cardOverline} title={head.cardTitle}>
            <div className="space-y-3">
              {rows.map((row) => {
                const reason = lang === "ar" ? row.reasonAr : row.reason;
                return (
                  <div
                    key={row.id}
                    className="flex flex-wrap items-center gap-3 rounded-xl border border-border-subtle p-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-text-primary">
                        {fieldLabel(c, row.id)}
                      </p>
                      <p className="font-data mt-1 text-sm text-text-secondary">
                        {reason ? `${row.value} · ${reason}` : row.value}
                      </p>
                    </div>
                    <StatusPill tone={row.approved ? "success" : "danger"}>
                      {row.approved ? d.applied : d.notApplied}
                    </StatusPill>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-text-secondary">
              {head.note}
            </p>
          </SectionCard>

          <div className="flex flex-wrap gap-3">
            {good || partly ? (
              <>
                <Link to="/agreement">
                  <Button>{d.viewRecord}</Button>
                </Link>
                {partly ? (
                  <Link to="/request-changes">
                    <Button variant="outline">{d.resubmitRejected}</Button>
                  </Link>
                ) : (
                  <Link to="/hotels">
                    <Button variant="outline">{d.continueLibrary}</Button>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/agreement">
                  <Button variant="outline">{d.returnAgreement}</Button>
                </Link>
                <Link to="/request-changes">
                  <Button>{d.editResubmit}</Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <SectionCard overline={d.timelineOverline} title={d.timelineTitle}>
          <Timeline
            items={[
              { title: d.submitted, note: d.submittedNote, state: "done" },
              { title: d.review, note: d.reviewNote, state: "done" },
              { title: d.decision, note: head.timeline, state: "done" },
              { title: d.notified, note: d.notifiedNote, state: "done" },
            ]}
          />
        </SectionCard>
      </div>
    </PageShell>
  );
}
