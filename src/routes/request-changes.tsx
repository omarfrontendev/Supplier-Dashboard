import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Building2,
  Check,
  FileText,
  Info,
  Landmark,
  ListChecks,
  Lock,
  Paperclip,
  Pencil,
  Trash2,
  Upload,
} from "lucide-react";
import {
  BackLink,
  PageHeader,
  PageShell,
  SectionCard,
  StatusPill,
} from "@/components/layout/page-shell";
import { IconModal } from "@/components/layout/overlay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fill, useLanguage } from "@/lib/i18n";
import { usePortal } from "@/lib/portal-store";
import { companyRecord, openChangeRequestId } from "@/lib/demo-data";
import { fieldLabel } from "@/lib/field-labels";
import { changeFieldCopy } from "@/lib/company-change-copy";

export const Route = createFileRoute("/request-changes")({
  /* OV 01.6J — the bank letter is only asked for once CHG-00042 is decided. */
  validateSearch: (
    search: Record<string, unknown>
  ): { unlock?: "iban"; select?: string } => ({
    ...(search["unlock"] === "iban" ? { unlock: "iban" as const } : {}),
    /* UI 07.36 - "Ask to change the bank" arrives here with the detail
       it is about already ticked, so nobody has to find it in a list of
       thirteen. */
    ...(typeof search["select"] === "string"
      ? { select: search["select"] }
      : {}),
  }),
  head: () => ({
    meta: [
      { title: "Request company changes · Hoteliana Supplier Portal" },
      {
        name: "description",
        content:
          "Select the registered company details you need to change and submit them to Hoteliana for review.",
      },
      {
        property: "og:title",
        content: "Request company changes · Hoteliana Supplier Portal",
      },
      {
        property: "og:description",
        content: "Submit a change request for your registered supplier record.",
      },
    ],
  }),
  component: RequestChangesPage,
});

const groups = ["company", "documents", "owner"] as const;

function RequestChangesPage() {
  const { c, lang } = useLanguage();
  const ar = lang === "ar";
  const navigate = useNavigate();
  const { selectedFields, toggleField, entries, setEntry } = usePortal();
  const [letterOpen, setLetterOpen] = useState(false);
  const ibanEntry = entries["iban"];
  const { unlock, select } = Route.useSearch();

  const record = companyRecord.map((field) =>
    unlock === "iban" && field.id === "iban"
      ? { ...field, lockedBy: undefined }
      : field
  );

  /* Ticked once, on arrival. A detail already inside an open request
     stays where it is - the row says which request holds it. */
  const picked = useRef(false);
  useEffect(() => {
    if (picked.current || !select) return;
    picked.current = true;
    const field = record.find((item) => item.id === select);
    if (field && !field.lockedBy && !selectedFields.includes(field.id)) {
      toggleField(field.id);
    }
  }, [select, record, selectedFields, toggleField]);
  const lockedFields = record.filter((field) => field.lockedBy);
  const selected = record.filter(
    (f) => selectedFields.includes(f.id) && !f.lockedBy
  );
  const ready =
    selected.length > 0 &&
    selected.every((field) => {
      const entry = entries[field.id];
      if (!entry) return false;
      if (field.kind === "file") return Boolean(entry.file);
      if (field.requiresEvidence) return Boolean(entry.value && entry.file);
      return Boolean(entry.value.trim());
    });

  return (
    <PageShell>
      <BackLink to="/agreement" label={c.common.backToAgreement} />
      <PageHeader
        overline={c.changes.overline}
        title={c.changes.title}
        subtitle={c.changes.subtitle}
      />

      <div className="grid gap-6 lg:grid-cols-[356px_minmax(0,1fr)]">
        <div className="space-y-6">
          <SectionCard>
            <StepIcon icon={<ListChecks className="h-4 w-4" aria-hidden="true" />}>
              <p className="text-overline text-brand-deep">
                {c.changes.step1Overline}
              </p>
              <h2 className="mt-0.5 text-base font-semibold text-text-primary">
                {c.changes.step1Title}
              </h2>
            </StepIcon>
            <div className="space-y-5">
              <div className="flex gap-3 rounded-xl border border-status-warning/25 bg-status-warning-bg p-4">
                <Lock
                  className="mt-0.5 h-5 w-5 shrink-0 text-status-warning"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-semibold text-status-warning">
                    {fill(c.changes.lockedTitle, {
                      count: lockedFields.length,
                      id: openChangeRequestId,
                    })}
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">
                    {c.changes.lockedBody}
                  </p>
                </div>
              </div>
              {groups.map((group) => (
                <div key={group}>
                  <p className="text-overline mb-2 flex items-center gap-1.5 text-text-muted">
                    {group === "company" ? (
                      <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : group === "documents" ? (
                      <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <Landmark className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                    {c.changes.groups[group]}
                  </p>
                  <div className="space-y-1.5">
                    {record
                      .filter((field) => field.group === group)
                      .map((field) => {
                        const isLocked = Boolean(field.lockedBy);
                        const active =
                          selectedFields.includes(field.id) && !isLocked;
                        return (
                          <label
                            key={field.id}
                            className={
                              isLocked
                                ? "flex cursor-not-allowed items-center gap-2.5 rounded-lg bg-status-warning-bg px-3 py-2"
                                : "flex cursor-pointer items-center gap-2.5 border-b border-border-subtle px-3 py-2 transition-colors hover:bg-surface-subtle"
                            }
                          >
                            {isLocked ? (
                              <Lock
                                className="h-3.5 w-3.5 shrink-0 text-status-warning"
                                aria-hidden="true"
                              />
                            ) : (
                              <input
                                type="checkbox"
                                checked={active}
                                onChange={() => toggleField(field.id)}
                                className="h-4 w-4 accent-[var(--brand-deep)]"
                              />
                            )}
                            <span
                              className={
                                isLocked
                                  ? "min-w-0 flex-1 text-sm text-text-muted"
                                  : "min-w-0 flex-1 text-sm text-text-primary"
                              }
                            >
                              {fieldLabel(c, field.id)}
                              {field.optional && (
                                <span className="text-text-muted">
                                  {" "}
                                  {c.changes.optional}
                                </span>
                              )}
                            </span>
                            {isLocked && (
                              <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-status-warning">
                                <span
                                  className="h-1.5 w-1.5 rounded-full bg-current"
                                  aria-hidden="true"
                                />
                                {fill(c.changes.lockedPill, {
                                  id: field.lockedBy ?? "",
                                })}
                              </span>
                            )}
                          </label>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <div className="flex gap-3 rounded-xl border border-status-info/25 bg-status-info-bg p-4">
            <Info
              className="mt-0.5 h-5 w-5 shrink-0 text-status-info"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-semibold text-status-info">
                {c.changes.note.title}
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                {c.changes.note.body}
              </p>
            </div>
          </div>
        </div>

        <SectionCard>
          <StepIcon icon={<Pencil className="h-4 w-4" aria-hidden="true" />}>
            <p className="text-overline text-brand-deep">
              {selected.length
                ? fill(c.changes.step2OverlineSelected, { count: selected.length })
                : c.changes.step2Overline}
            </p>
            <h2 className="mt-0.5 text-base font-semibold text-text-primary">
              {c.changes.step2Title}
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              {c.changes.step2Body}
            </p>
          </StepIcon>
          {selected.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border-default p-12 text-center">
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-surface-subtle text-text-muted">
                <Pencil className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="mt-4 text-sm font-semibold text-text-primary">
                {c.changes.emptyTitle}
              </p>
              <p className="mx-auto mt-1.5 max-w-md text-sm text-text-secondary">
                {c.changes.emptyBody}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {selected.map((field) => {
                const entry = entries[field.id] ?? { value: "" };
                const copy = changeFieldCopy[field.id];
                return (
                  <div
                    key={field.id}
                    className="rounded-xl border border-border-subtle p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-text-primary">
                          {fieldLabel(c, field.id)}
                        </p>
                        <p className="font-data mt-1 text-sm text-text-secondary">
                          {c.changes.current}:{" "}
                          {(ar ? copy?.currentAr : copy?.current) ??
                            (field.current ||
                              c.agreement.supplier.guaranteeValue)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleField(field.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-status-danger hover:underline"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        {c.changes.remove}
                      </button>
                    </div>

                    {field.kind === "text" && !copy?.asDocument && (
                      <div className="mt-3">
                        <Input
                          label={
                            copy
                              ? `${ar ? copy.newLabelAr : copy.newLabel}${copy.picker ? " \u25be" : ""}`
                              : c.changes.newValue
                          }
                          placeholder={ar ? copy?.exampleAr : copy?.example}
                          value={entry.value}
                          onChange={(e) =>
                            setEntry(field.id, { ...entry, value: e.target.value })
                          }
                        />
                        {copy && (
                          <p className="mt-1.5 text-xs leading-5 text-text-muted">
                            {ar ? copy.hintAr : copy.hint}
                          </p>
                        )}
                      </div>
                    )}

                    {(field.kind === "file" ||
                      field.requiresEvidence ||
                      copy?.asDocument) && (
                      <div className="mt-3">
                        {field.requiresEvidence && (
                          <div className="mb-3 flex gap-3 rounded-lg border border-status-warning/25 bg-status-warning-bg p-3">
                            <AlertTriangle
                              className="mt-0.5 h-4 w-4 shrink-0 text-status-warning"
                              aria-hidden="true"
                            />
                            <div>
                              <p className="text-sm font-semibold text-status-warning">
                                {c.changes.evidenceTitle}
                              </p>
                              <p className="mt-0.5 text-sm text-text-secondary">
                                {c.changes.evidenceBody}
                              </p>
                            </div>
                          </div>
                        )}
                        {field.requiresEvidence ? (
                          <button
                            type="button"
                            onClick={() => setLetterOpen(true)}
                            className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-dashed border-border-default bg-surface-subtle px-4 py-3 text-start"
                          >
                            <span className="inline-flex items-center gap-2 text-sm text-text-secondary">
                              <Paperclip className="h-4 w-4" aria-hidden="true" />
                              {entry.file
                                ? `${entry.file} · ${c.changes.uploaded}`
                                : c.changes.uploadLetter}
                            </span>
                            <span className="text-xs font-medium text-text-link">
                              {c.common.preview}
                            </span>
                          </button>
                        ) : (
                          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-dashed border-border-default bg-surface-subtle px-4 py-3">
                            <span className="inline-flex items-center gap-2 text-sm text-text-secondary">
                              <Paperclip className="h-4 w-4" aria-hidden="true" />
                              {entry.file
                                ? `${entry.file} · ${c.changes.uploaded}`
                                : c.changes.uploadFile}
                            </span>
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) =>
                                setEntry(field.id, {
                                  ...entry,
                                  file:
                                    e.target.files?.[0]?.name ?? "evidence.pdf",
                                })
                              }
                            />
                            <span className="text-xs font-medium text-text-link">
                              {c.common.preview}
                            </span>
                          </label>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              <p className="text-xs leading-relaxed text-text-muted">
                {c.changes.evidenceRule}
              </p>
            </div>
          )}

        </SectionCard>
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Link to="/agreement">
          <Button variant="outline">{c.common.cancel}</Button>
        </Link>
        <Button
          disabled={!ready}
          onClick={() => navigate({ to: "/review-changes" })}
        >
          {selected.length
            ? fill(c.changes.review, { count: selected.length })
            : c.changes.reviewDisabled}
        </Button>
      </div>

      {letterOpen && (
        <BankLetterModal
          file={ibanEntry?.file}
          onChoose={(name) =>
            setEntry("iban", { value: ibanEntry?.value ?? "", file: name })
          }
          onRemove={() =>
            setEntry("iban", { value: ibanEntry?.value ?? "", file: "" })
          }
          onClose={() => setLetterOpen(false)}
          onAttach={() => setLetterOpen(false)}
        />
      )}
    </PageShell>
  );
}

/** UI 01.6C — each step opens with a small tinted icon tile. */
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

/** OV 01.6J / 01.6J2 — the stamped letter Hoteliana needs before an IBAN moves. */
function BankLetterModal({
  file,
  onChoose,
  onRemove,
  onClose,
  onAttach,
}: {
  file: string | undefined;
  onChoose: (name: string) => void;
  onRemove: () => void;
  onClose: () => void;
  onAttach: () => void;
}) {
  const { c } = useLanguage();
  const l = c.changes.letter;

  return (
    <IconModal
      icon={<Upload className="h-5 w-5" aria-hidden="true" />}
      overline={l.overline}
      title={l.title}
      body={l.body}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {c.common.cancel}
          </Button>
          <Button disabled={!file} onClick={onAttach}>
            {l.attach}
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border-strong bg-surface-subtle px-6 py-7">
        <span className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-surface-default text-brand-deep">
          <Upload className="h-5 w-5" aria-hidden="true" />
        </span>
        <p className="text-sm font-medium text-text-primary">{l.dropTitle}</p>
        <p className="text-xs text-text-muted">{l.dropMeta}</p>
        <label className="mt-1 inline-flex h-11 cursor-pointer items-center justify-center rounded-lg border border-border-strong bg-surface-default px-5 text-sm font-medium text-text-primary transition-colors hover:bg-surface-subtle">
          {file ? l.replace : l.choose}
          <input
            type="file"
            className="hidden"
            onChange={(e) => onChoose(e.target.files?.[0]?.name ?? l.sample)}
          />
        </label>
        {file && (
          <div className="mt-1 inline-flex items-center gap-2.5 rounded-[10px] border border-status-success/25 bg-status-success-bg px-3 py-2">
            <span className="text-[12.5px] font-medium text-status-success">
              {`\u2713  ${file}`}
            </span>
            <button
              type="button"
              onClick={onRemove}
              className="text-xs font-medium text-status-danger hover:underline"
            >
              {l.remove}
            </button>
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <p className="text-[10px] font-medium uppercase tracking-[0.04em] text-text-muted">
          {l.rulesLabel}
        </p>
        {[l.rule1, l.rule2, l.rule3].map((rule) => (
          <p
            key={rule}
            className="flex items-start gap-2 text-[12.5px] text-text-body"
          >
            <Check
              className="mt-0.5 h-3 w-3 shrink-0 text-status-success"
              aria-hidden="true"
            />
            {rule}
          </p>
        ))}
      </div>
    </IconModal>
  );
}
