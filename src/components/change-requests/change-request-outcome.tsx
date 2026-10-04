import { useState } from "react";
import { Modal } from "@/components/layout/overlay";
import { SectionCard, StatusPill } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { changeRequestCopy, crFill } from "@/lib/change-request-copy";
import type { ChangeRequest } from "@/lib/change-request-data";
import { useLanguage } from "@/lib/i18n";

type Copy = typeof changeRequestCopy.en | typeof changeRequestCopy.ar;

/**
 * What a decided cancellation looks like — Figma UI 06.2 (charge pending),
 * UI 06.2W (waived) and UI 06.2X (no answer, policy applied).
 */
export function CancellationOutcome({
  request,
  t,
  ar,
  mode,
  reason,
}: {
  request: ChangeRequest;
  t: Copy;
  ar: boolean;
  mode: "charged" | "waived" | "auto";
  reason?: string;
}) {
  const amount = request.ceiling.toLocaleString(ar ? "ar-EG" : "en-US");
  const waived = mode === "waived";

  return (
    <>
      <section className="mb-6 flex flex-wrap items-start justify-between gap-5 rounded-2xl border border-border-subtle bg-surface-subtle p-5 sm:p-6">
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold text-text-primary">
            {mode === "auto" ? t.outAutoTitle : t.outCancelTitle}
          </p>
          <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-text-secondary">
            {mode === "auto"
              ? crFill(t.outAutoBody, { amount })
              : waived
                ? crFill(t.outWaiveBody, { reason: reason ?? "" })
                : crFill(t.outCancelBody, { amount })}
          </p>
        </div>
        <div className="rounded-xl bg-surface-default px-5 py-3 text-center">
          <p className="font-data text-xl font-semibold text-text-primary">
            {waived ? "0 SAR" : `${amount} SAR`}
          </p>
          <p className="mt-0.5 text-xs text-text-muted">
            {waived
              ? crFill(t.outWaivedNote, { reason: reason ?? "" })
              : t.outAmountNote}
          </p>
        </div>
      </section>

      <SectionCard className="mb-6" overline={t.backOverline} title={t.backTitle}>
        <div className="grid gap-3 sm:grid-cols-2">
          {t.backNights.map(([label, before, after, unit, note]) => (
            <div key={label} className="rounded-xl border border-border-subtle p-4">
              <p className="text-overline text-text-muted">{label}</p>
              <p className="font-data mt-2 text-2xl font-semibold text-text-primary">
                <span className="text-text-muted line-through">{before}</span>{" "}
                {after}
              </p>
              <p className="mt-0.5 text-xs text-text-muted">{unit}</p>
              <p className="mt-1 text-xs text-status-success">{note}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs leading-5 text-text-muted">{t.backNote}</p>
      </SectionCard>

      <SectionCard
        className="mb-6"
        overline={t.moneyOverline}
        title={
          mode === "auto"
            ? crFill(t.moneyAutoTitle, { amount })
            : waived
              ? crFill(t.moneyWaiveTitle, { amount })
              : crFill(t.moneyFullTitle, { amount })
        }
        description={
          mode === "auto"
            ? t.moneyAutoBody
            : waived
              ? crFill(t.moneyWaiveBody, { amount, reason: reason ?? "" })
              : t.moneyFullBody
        }
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <StatusRow label={t.bookingStatusLabel} value={t.outCancelled} tone="danger" />
          <StatusRow
            label={t.financialStatusLabel}
            value={waived ? t.financialWaived : t.financialPending}
            tone={waived ? "neutral" : "warning"}
          />
        </div>
      </SectionCard>
    </>
  );
}

/** A decided amendment — UI 06.4 (approved), 06.6 (declined), 06.6X (expired). */
export function AmendmentOutcome({
  t,
  mode,
}: {
  t: Copy;
  mode: "approved" | "declined" | "expired";
}) {
  const approved = mode === "approved";
  const name = approved ? "Faisal Al-Harbi" : "Bader Al-Harbi";

  return (
    <>
      <section className="mb-6 flex flex-wrap items-start justify-between gap-5 rounded-2xl border border-border-subtle bg-surface-subtle p-5 sm:p-6">
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold text-text-primary">
            {approved
              ? crFill(t.amendedTitle, { name })
              : mode === "expired"
                ? t.expiredTitle
                : t.declinedTitle}
          </p>
          <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-text-secondary">
            {approved
              ? t.amendedBody
              : mode === "expired"
                ? crFill(t.expiredBody, { name })
                : crFill(t.declinedBody, { name })}
          </p>
        </div>
        <div className="rounded-xl bg-surface-default px-5 py-3 text-center">
          <p className="font-data text-xl font-semibold text-text-primary">
            1,120 SAR
          </p>
          <p className="mt-0.5 text-xs text-text-muted">
            {approved ? t.amendedAmountNote : t.unchangedNote}
          </p>
        </div>
      </section>

      <SectionCard
        className="mb-6"
        overline={t.movedOverline}
        title={approved ? t.movedTitle : t.movedNothingTitle}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-sm">
            <tbody>
              {(
                [
                  ["LEAD GUEST", "Bader Al-Harbi", name],
                  ["NIGHTS", "2", "2"],
                  ["ROOMS FREE · 27 - 29 SEP", "9", "9"],
                ] as Array<[string, string, string]>
              ).map(([label, before, after]) => (
                <tr key={label} className="border-b border-border-subtle last:border-0">
                  <td className="text-overline py-3 pe-3 text-text-muted">{label}</td>
                  <td
                    className={cn(
                      "py-3 pe-3",
                      before === after
                        ? "text-text-secondary"
                        : "text-text-secondary line-through"
                    )}
                  >
                    {before}
                  </td>
                  <td className="py-3 font-medium text-text-primary">{after}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs leading-5 text-text-muted">
          {approved ? t.movedNote : t.movedNothingNote}
        </p>
      </SectionCard>

      <SectionCard
        className="mb-6"
        overline={t.moneyStatusOverline}
        title={t.moneyStatusTitle}
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <StatusRow
            label={t.bookingStatusLabel}
            value={approved ? t.amendedConfirmed : t.unchangedPill}
            tone={approved ? "success" : "neutral"}
          />
          {!approved && (
            <StatusRow
              label={t.requestStatusLabel}
              value={mode === "expired" ? t.expiredPill : t.declinedPill}
              tone="neutral"
            />
          )}
          <StatusRow
            label={t.adjustmentLabel}
            value={t.adjustmentNone}
            tone="neutral"
          />
          {approved && (
            <StatusRow
              label={t.settlementLabel}
              value={t.settlementNone}
              tone="neutral"
            />
          )}
        </div>
      </SectionCard>
    </>
  );
}

function StatusRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "success" | "warning" | "danger" | "neutral";
}) {
  return (
    <div className="rounded-xl bg-surface-subtle p-4">
      <p className="text-overline text-text-muted">{label}</p>
      <div className="mt-1.5">
        <StatusPill tone={tone}>{value}</StatusPill>
      </div>
    </div>
  );
}

/** OV 06.1B — waiving the charge, with the fixed reason list. */
export function WaiveDialog({
  request,
  onClose,
  onWaive,
}: {
  request: ChangeRequest;
  onClose: () => void;
  onWaive: (reason: string) => void;
}) {
  const { c, lang } = useLanguage();
  void c;
  const t = changeRequestCopy[lang];
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const amount = request.ceiling.toLocaleString(
    lang === "ar" ? "ar-EG" : "en-US"
  );

  return (
    <Modal
      overline={crFill(t.waiveOverline, {
        id: request.bookingId,
        guest: request.guest.toUpperCase(),
        amount,
      })}
      title={t.waiveTitle}
      meta={t.waiveBody}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t.cancel}
          </Button>
          <Button disabled={!reason} onClick={() => onWaive(reason)}>
            {t.waiveCta}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            [t.waivePolicyAllowed, `${amount} SAR`],
            [t.waiveYouCharge, t.waiveYouChargeValue],
            [t.financialStatusLabel, t.financialWaived],
            [
              t.waiveRecordedAs,
              reason ? crFill(t.waiveRecordedPicked, { reason }) : t.waiveGoodwill,
            ],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-surface-subtle p-3.5">
              <p className="text-overline text-text-muted">{label}</p>
              <p className="mt-1 text-sm font-medium text-text-primary">{value}</p>
            </div>
          ))}
        </div>

        <div>
          <p className="text-overline text-text-muted">{t.waiveReasonLabel}</p>
          <div className="mt-2">
            <Select
              value={reason}
              onChange={setReason}
              placeholder={t.waiveReasonPh}
              searchable={false}
              options={t.waiveReasons.map((value) => ({ value, label: value }))}
            />
          </div>
          <p className="mt-1.5 text-xs text-text-muted">{t.waiveReasonNote}</p>
        </div>

        <div>
          <p className="text-overline text-text-muted">{t.waiveNoteLabel}</p>
          <Textarea
            className="mt-2"
            placeholder={t.waiveNotePh}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <p className="text-xs leading-5 text-text-muted">{t.waiveFooter}</p>
      </div>
    </Modal>
  );
}

/** OV 06.3B — declining a non-commercial amendment. */
export function DeclineDialog({
  request,
  onClose,
  onDecline,
}: {
  request: ChangeRequest;
  onClose: () => void;
  onDecline: (reason: string) => void;
}) {
  const { lang } = useLanguage();
  const t = changeRequestCopy[lang];
  const [reason, setReason] = useState<string>(t.declineReasons[0] ?? "");
  const [note, setNote] = useState("");

  return (
    <Modal
      overline={crFill(t.declineOverline, {
        id: request.bookingId,
        guest: request.guest.toUpperCase(),
        request: "AMD-001",
      })}
      title={t.declineTitle}
      meta={crFill(t.declineBody, { name: request.guest })}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t.cancel}
          </Button>
          <Button variant="danger" onClick={() => onDecline(reason)}>
            {t.declineChange}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div>
          <p className="text-overline text-text-muted">{t.declineReasonLabel}</p>
          <div className="mt-2">
            <Select
              value={reason}
              onChange={setReason}
              searchable={false}
              options={t.declineReasons.map((value) => ({ value, label: value }))}
            />
          </div>
          <p className="mt-1.5 text-xs text-text-muted">{t.declineReasonNote}</p>
        </div>

        <div>
          <p className="text-overline text-text-muted">{t.declineNoteLabel}</p>
          <Textarea
            className="mt-2"
            placeholder={t.declineNotePh}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <p className="mt-1.5 text-xs text-text-muted">{t.declineNoteHint}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {t.declinePoints.map(([title, body]) => (
            <div key={title} className="rounded-xl bg-surface-subtle p-3.5">
              <p className="text-sm font-semibold text-text-primary">{title}</p>
              <p className="mt-0.5 text-xs leading-5 text-text-secondary">{body}</p>
            </div>
          ))}
        </div>

        <p className="text-xs leading-5 text-text-muted">{t.declineFooter}</p>
      </div>
    </Modal>
  );
}
