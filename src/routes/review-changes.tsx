import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import {
  BackLink,
  PageHeader,
  PageShell,
  SectionCard,
} from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Clock3, ListChecks } from "lucide-react";
import { fill, useLanguage } from "@/lib/i18n";
import { notify, wait } from "@/lib/notify";
import { usePortal } from "@/lib/portal-store";
import { companyRecord } from "@/lib/demo-data";
import { fieldLabel } from "@/lib/field-labels";
import { changeFieldCopy } from "@/lib/company-change-copy";

export const Route = createFileRoute("/review-changes")({
  head: () => ({
    meta: [
      { title: "Review requested changes · Hoteliana Supplier Portal" },
      {
        name: "description",
        content:
          "Compare current and requested company values before submitting the change request to Hoteliana.",
      },
      {
        property: "og:title",
        content: "Review requested changes · Hoteliana Supplier Portal",
      },
      {
        property: "og:description",
        content: "Final check before your supplier change request is submitted.",
      },
    ],
  }),
  component: ReviewChangesPage,
});

function ReviewChangesPage() {
  const { c, lang } = useLanguage();
  const navigate = useNavigate();
  const { selectedFields, entries, submitRequest } = usePortal();
  const [sending, setSending] = useState(false);
  const selected = companyRecord.filter((f) => selectedFields.includes(f.id));

  const steps = [c.review.steps.one, c.review.steps.two, c.review.steps.three, c.review.steps.four];

  return (
    <PageShell>
      <BackLink to="/request-changes" label={c.common.backToEditRequest} />
      <PageHeader
        overline={c.review.overline}
        title={c.review.title}
        subtitle={c.review.subtitle}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <SectionCard>
          <StepIcon icon={<ListChecks className="h-4 w-4" aria-hidden="true" />}>
            <p className="text-overline text-brand-deep">
              {fill(c.review.cardOverline, { count: selected.length })}
            </p>
            <h2 className="mt-0.5 text-base font-semibold text-text-primary">
              {c.review.cardTitle}
            </h2>
          </StepIcon>
          {selected.length === 0 ? (
            <p className="text-sm text-text-secondary">{c.changes.emptyBody}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-start">
                <thead>
                  <tr className="border-b border-border-subtle">
                    {[c.review.field, c.review.currentRecord, c.review.requested, c.review.evidence].map(
                      (head) => (
                        <th
                          key={head}
                          className="text-overline whitespace-nowrap py-2 text-start text-text-muted"
                        >
                          {head}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {selected.map((field) => {
                    const entry = entries[field.id];
                    return (
                      <tr key={field.id} className="border-b border-border-subtle">
                        <td className="py-3 pe-4 text-sm font-medium text-text-primary">
                          {fieldLabel(c, field.id)}
                        </td>
                        <td className="font-data py-3 pe-4 text-sm text-text-secondary">
                          {(lang === "ar"
                            ? changeFieldCopy[field.id]?.currentAr
                            : changeFieldCopy[field.id]?.current) ??
                            field.current}
                        </td>
                        <td className="font-data py-3 pe-4 text-sm font-medium text-text-primary">
                          {entry?.value || entry?.file || "—"}
                        </td>
                        <td className="py-3 text-sm text-text-secondary">
                          {changeFieldCopy[field.id]
                            ? lang === "ar"
                              ? changeFieldCopy[field.id]!.evidenceAr
                              : changeFieldCopy[field.id]!.evidence
                            : (entry?.file ?? c.review.notRequired)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <p className="mt-4 text-xs leading-relaxed text-text-muted">
            {c.review.note}
          </p>
        </SectionCard>

        <SectionCard>
          <StepIcon icon={<Clock3 className="h-4 w-4" aria-hidden="true" />}>
            <p className="text-overline text-brand-deep">{c.review.nextOverline}</p>
            <h2 className="mt-0.5 text-base font-semibold text-text-primary">
              {c.review.nextTitle}
            </h2>
          </StepIcon>
          <ol className="space-y-4">
            {steps.map((step, index) => (
              <li key={step.title} className="flex gap-3">
                <span
                  className={
                    index === 0
                      ? "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-brand-deep"
                      : "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-subtle text-xs font-semibold text-text-muted"
                  }
                >
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {step.title}
                  </p>
                  <p className="mt-0.5 text-sm text-text-secondary">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </SectionCard>
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-3">

            <Link to="/request-changes">
              <Button variant="outline">{c.review.backToEdit}</Button>
            </Link>
            <Button
              disabled={selected.length === 0}
              loading={sending}
              onClick={async () => {
                setSending(true);
                await wait(700);
                submitRequest();
                notify.success(c.toast.changesSubmitted, {
                  description: c.toast.changesSubmittedDesc,
                });
                setSending(false);
                navigate({ to: "/request-submitted" });
              }}
            >
              {c.review.submit}
            </Button>
      </div>
    </PageShell>
  );
}

/** UI 01.6D — each card opens with a small tinted icon tile. */
function StepIcon({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-subtle text-brand-deep">
        {icon}
      </span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
