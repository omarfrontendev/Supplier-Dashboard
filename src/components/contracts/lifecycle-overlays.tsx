import { useState } from "react";
import { Check, ChevronRight, Clock3, History, Pencil, ShieldAlert, Undo2 } from "lucide-react";
import { Drawer, IconModal } from "@/components/layout/overlay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type {
  FinalizationIssue,
  HotelContractFinalizationReview,
  FinalizeHotelContractResult,
} from "@/api/modules/hotel-contract/finalization-types";
import {
  activateDrawer,
  activityDrawer,
  amendDialog,
  answerDialog,
  pauseReason,
  publishDrawer,
  terminateReason,
  type Bilingual,
  type LifecycleDialog,
} from "@/lib/contract-lifecycle-data";

const DRAWER_WIDTH = "640px";

/** The tick the two review drawers ask for before they go live. */
function Acknowledgement({
  text,
  on,
  onToggle,
  disabled = false,
}: {
  text: string;
  on: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={on}
      className="flex w-full items-start gap-3 text-start disabled:cursor-not-allowed disabled:opacity-70"
    >
      <span
        className={cn(
          "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border",
          on ? "border-brand-deep bg-brand-deep text-text-inverse" : "border-border-strong",
        )}
      >
        {on && <Check className="h-3 w-3" aria-hidden="true" />}
      </span>
      <span className="text-[12.5px] leading-5 text-text-secondary">{text}</span>
    </button>
  );
}

/** OV 03.2 / 03.2C / 03.2L — every section at a glance, then activate. */
export function ActivateDrawer({
  onClose,
  rows,
  loading,
  loadingLabel,
  error,
  retryLabel,
  onRetry,
  actionLabel,
  review,
  reviewKey,
  confirmationAccepted,
  onConfirmationChange,
  onFinalize,
  finalizationPending,
  submissionBlocked,
  submissionBlockedMessage,
  finalizationError,
  onRetryFinalization,
  finalizationSuccess,
}: {
  onClose: () => void;
  rows: Array<{ label: string; value: string }>;
  loading: boolean;
  loadingLabel: string;
  error: string | null;
  retryLabel: string;
  onRetry: () => void;
  actionLabel: string;
  review: HotelContractFinalizationReview | undefined;
  reviewKey: string | null;
  confirmationAccepted: boolean;
  onConfirmationChange: (accepted: boolean) => void;
  onFinalize: () => void;
  finalizationPending: boolean;
  submissionBlocked: boolean;
  submissionBlockedMessage: string | null;
  finalizationError: {
    message: string;
    detail?: string;
    issues?: FinalizationIssue[];
    version?: number;
    retryable: boolean;
  } | null;
  onRetryFinalization: () => void;
  finalizationSuccess: FinalizeHotelContractResult | null;
}) {
  const { c, lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const d = activateDrawer;
  const issueGroups = new Map<string, FinalizationIssue[]>();
  const allIssues = [...(review?.issues ?? []), ...(finalizationError?.issues ?? [])];
  for (const issue of allIssues) {
    const group = issueGroups.get(issue.section);
    if (group) group.push(issue);
    else issueGroups.set(issue.section, [issue]);
  }
  const hasBlockingIssues = allIssues.some((issue) => issue.severity === "error");
  const canContinue = Boolean(
    review &&
    !loading &&
    !error &&
    review.canFinalize === true &&
    !hasBlockingIssues &&
    confirmationAccepted,
  );
  const disabledReason = finalizationPending
    ? c.builder.finalizationInProgress
    : finalizationSuccess
      ? c.builder.finalizationAlreadySucceeded
      : finalizationError?.retryable
        ? c.builder.finalizationRetryRequired
        : submissionBlocked
          ? submissionBlockedMessage
          : loading
            ? c.builder.reviewActionLoading
            : error || !review
              ? c.builder.reviewActionUnavailable
              : hasBlockingIssues
                ? c.builder.reviewActionResolveErrors
                : !review.canFinalize
                  ? c.builder.reviewActionNotAllowed
                  : !confirmationAccepted
                    ? c.builder.reviewActionAcceptConfirmation
                    : undefined;
  const sectionLabels: Record<string, string> = c.builder.reviewIssueSections;

  return (
    <Drawer
      width={DRAWER_WIDTH}
      overline={d.overline[k]}
      title={d.title[k]}
      meta={d.body[k]}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={finalizationPending}>
            {d.cancel[k]}
          </Button>
          <Button
            disabled={
              !canContinue ||
              finalizationPending ||
              finalizationSuccess !== null ||
              finalizationError?.retryable === true ||
              submissionBlocked
            }
            reason={disabledReason ?? undefined}
            onClick={onFinalize}
          >
            {finalizationPending ? c.builder.finalizationInProgress : actionLabel}
          </Button>
        </>
      }
    >
      <div className="space-y-0">
        {rows.map((row) => (
          <div key={row.label} className="border-b border-border-subtle py-3 last:border-0">
            <p className="text-[12.5px] font-medium text-text-primary">{row.label}</p>
            <p className="mt-1 text-[12px] leading-5 text-text-muted">{row.value || "—"}</p>
          </div>
        ))}
      </div>
      {loading && <p className="mt-3 text-sm text-text-muted">{loadingLabel}</p>}
      {error && (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <p className="text-sm text-status-danger">{error}</p>
          <Button variant="outline" size="sm" onClick={onRetry} disabled={finalizationPending}>
            {retryLabel}
          </Button>
        </div>
      )}
      {finalizationPending && (
        <p className="mt-3 text-sm text-text-muted">{c.builder.finalizationInProgress}</p>
      )}
      {finalizationError && (
        <div className="mt-3 space-y-2 rounded-xl border border-status-danger/25 bg-status-danger-bg p-3">
          <p className="text-sm font-semibold text-status-danger">{finalizationError.message}</p>
          {finalizationError.detail && (
            <p className="text-sm leading-5 text-text-primary">{finalizationError.detail}</p>
          )}
          {finalizationError.version !== undefined && (
            <p className="text-xs text-text-muted">
              {c.builder.finalizationValidationVersion}: {finalizationError.version}
            </p>
          )}
          {finalizationError.retryable && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetryFinalization}
              disabled={finalizationPending}
            >
              {c.builder.finalizationRetry}
            </Button>
          )}
        </div>
      )}
      {finalizationSuccess && (
        <section className="mt-4 space-y-2 rounded-xl border border-status-success/25 bg-status-success-bg p-4">
          <h3 className="text-sm font-semibold text-status-success">
            {c.builder.finalizationSuccess}
          </h3>
          <p className="text-sm text-text-primary">
            {finalizationSuccess.contract.name} · {c.builder.finalizationStatus}:{" "}
            {finalizationSuccess.contract.status}
          </p>
          <p className="text-xs text-text-secondary">
            {c.builder.finalizationPublicationStatus}:{" "}
            {finalizationSuccess.contract.publicationStatus}
          </p>
          {finalizationSuccess.contract.publication && (
            <div className="text-xs leading-5 text-text-secondary">
              <p>
                {c.builder.finalizationPublicationId}: {finalizationSuccess.contract.publication.id}
              </p>
              <p>
                {c.builder.finalizationTimezone}:{" "}
                {finalizationSuccess.contract.publication.timezone}
              </p>
              <p>
                {c.builder.finalizationAt}: {finalizationSuccess.contract.publication.finalizedAt}
              </p>
            </div>
          )}
          <p className="text-xs font-medium text-text-secondary">
            {c.builder.finalizationGeneratedRecords}
          </p>
          <ul className="space-y-1 text-xs text-text-secondary">
            {Object.entries(finalizationSuccess.generation).map(([category, count]) => (
              <li key={category}>
                {category}: {count}
              </li>
            ))}
          </ul>
        </section>
      )}
      {allIssues.length > 0 && (
        <section className="mt-4 space-y-3" aria-labelledby="finalization-issues-heading">
          <h3 id="finalization-issues-heading" className="text-sm font-semibold text-text-primary">
            {c.builder.reviewIssuesHeading}
          </h3>
          {[...issueGroups.entries()].map(([section, issues]) => (
            <div key={section} className="space-y-2">
              <h4 className="text-[12.5px] font-medium text-text-secondary">
                {sectionLabels[section] ??
                  c.builder.reviewUnknownSection.replace("{section}", section)}
              </h4>
              {issues.map((issue, index) => {
                const isError = issue.severity === "error";
                const metadata = [
                  `${c.builder.reviewIssueCode}: ${issue.code}`,
                  `${c.builder.reviewIssueSection}: ${issue.section}`,
                  `${c.builder.reviewIssuePath}: ${issue.path}`,
                  ...(issue.entityId == null
                    ? []
                    : [`${c.builder.reviewIssueEntityId}: ${issue.entityId}`]),
                ].join(" · ");
                return (
                  <article
                    key={`${issue.code}:${issue.path}:${issue.entityId ?? ""}:${index}`}
                    className={cn(
                      "rounded-xl border p-3",
                      isError
                        ? "border-status-danger/25 bg-status-danger-bg"
                        : "border-status-warning/25 bg-status-warning-bg",
                    )}
                  >
                    <p
                      className={cn(
                        "text-[12px] font-semibold",
                        isError ? "text-status-danger" : "text-status-warning",
                      )}
                    >
                      {isError ? c.builder.reviewIssueError : c.builder.reviewIssueWarning}
                    </p>
                    <p className="mt-1 text-[12.5px] leading-5 text-text-primary">
                      {issue.message}
                    </p>
                    <p className="mt-1 break-words text-[11px] leading-4 text-text-muted">
                      {metadata}
                    </p>
                  </article>
                );
              })}
            </div>
          ))}
        </section>
      )}
      {review && !review.canFinalize && !hasBlockingIssues && (
        <p className="mt-3 rounded-xl border border-status-warning/25 bg-status-warning-bg p-3 text-sm text-status-warning">
          {c.builder.reviewCannotFinalize}
        </p>
      )}
      <div className="mt-4">
        {review && reviewKey !== null ? (
          <Acknowledgement
            key={reviewKey}
            text={review.confirmation.text}
            on={confirmationAccepted}
            onToggle={() => onConfirmationChange(!confirmationAccepted)}
            disabled={finalizationPending || finalizationSuccess !== null}
          />
        ) : (
          <Acknowledgement
            text={c.builder.reviewConfirmationUnavailable}
            on={false}
            onToggle={() => undefined}
            disabled
          />
        )}
      </div>
    </Drawer>
  );
}

/** OV 03.3C — what the two held changes do, before and after. */
export function PublishDrawer({
  onClose,
  onPublish,
}: {
  onClose: () => void;
  onPublish: () => void;
}) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const d = publishDrawer;
  const [agreed, setAgreed] = useState(false);

  return (
    <Drawer
      width={DRAWER_WIDTH}
      overline={d.overline[k]}
      title={d.title[k]}
      meta={d.body[k]}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {d.cancel[k]}
          </Button>
          <Button disabled={!agreed} onClick={onPublish}>
            {d.confirm[k]}
          </Button>
        </>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[12px]">
          <thead>
            <tr className="text-overline text-text-muted">
              {d.head.map((cell) => (
                <th key={cell.en} className="py-2 text-start font-semibold">
                  {cell[k]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {d.rows.map((row) => (
              <tr key={row[0]!.en} className="border-t border-border-subtle">
                {row.map((cell, index) => (
                  <td
                    key={index}
                    className={cn(
                      "py-2.5 pe-3 align-top",
                      index === 0 ? "font-medium text-text-primary" : "text-text-secondary",
                    )}
                  >
                    {cell[k] || "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <Acknowledgement
          text={d.acknowledgement[k]}
          on={agreed}
          onToggle={() => setAgreed((prev) => !prev)}
        />
      </div>
    </Drawer>
  );
}

/** OV 03.3A — the versions, then everything that happened under them. */
export function ActivityDrawer({ onClose }: { onClose: () => void }) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const d = activityDrawer;

  return (
    <Drawer
      width={DRAWER_WIDTH}
      overline={d.overline[k]}
      title={d.title[k]}
      meta={d.body[k]}
      onClose={onClose}
      footer={<Button onClick={onClose}>{d.close[k]}</Button>}
    >
      <p className="text-overline text-text-muted">{d.versionsLabel[k]}</p>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full border-collapse text-[12px]">
          <thead>
            <tr className="text-overline text-text-muted">
              {d.versionsHead.map((cell) => (
                <th key={cell.en} className="py-2 text-start font-semibold">
                  {cell[k]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {d.versions.map((row) => (
              <tr key={row[0]!.en} className="border-t border-border-subtle">
                {row.map((cell, index) => (
                  <td
                    key={index}
                    className={cn(
                      "py-2.5 pe-3",
                      index === 0
                        ? "font-data font-medium text-text-primary"
                        : "text-text-secondary",
                    )}
                  >
                    {cell[k]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-overline mt-5 text-text-muted">{d.activityLabel[k]}</p>
      <ol className="mt-2 space-y-3">
        {d.activity.map((entry) => (
          <li key={entry.meta.en} className="flex gap-3">
            <div className="w-16 shrink-0">
              <p className="text-[12px] font-medium text-text-primary">{entry.day[k]}</p>
              <p className="font-data text-[11px] text-text-muted">{entry.time[k]}</p>
            </div>
            <div className="min-w-0 border-s border-border-subtle ps-3">
              <p className="text-[12.5px] font-medium text-text-primary">{entry.title[k]}</p>
              <p className="mt-0.5 text-[11.5px] leading-4 text-text-secondary">
                {entry.detail[k]}
              </p>
              <p className="mt-0.5 text-[11px] text-text-muted">{entry.meta[k]}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-5 rounded-xl bg-surface-subtle p-3.5 text-[11.5px] leading-5 text-text-muted">
        {d.note[k]}
      </p>
    </Drawer>
  );
}

const DIALOG_ICON = {
  discard: <Undo2 className="h-5 w-5" aria-hidden="true" />,
  pause: <Clock3 className="h-5 w-5" aria-hidden="true" />,
  terminate: <ShieldAlert className="h-5 w-5" aria-hidden="true" />,
};

/** OV 03.3D / 03.18 / 03.21 — the three ways a contract stops. */
export function LifecycleDialogOverlay({
  dialog,
  kind,
  onClose,
  onConfirm,
  saving = false,
  live = false,
}: {
  dialog: LifecycleDialog;
  kind: "discard" | "pause" | "terminate";
  onClose: () => void;
  onConfirm: (reason: string) => void;
  saving?: boolean;
  live?: boolean;
}) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const [reason, setReason] = useState(
    kind === "terminate" && !live ? terminateReason.value[k] : "",
  );
  const [typed, setTyped] = useState("");
  const needsTyped = kind === "terminate";

  return (
    <IconModal
      tone={dialog.tone}
      icon={DIALOG_ICON[kind]}
      overline={dialog.overline[k]}
      title={dialog.title[k]}
      body={dialog.body[k]}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {dialog.cancel[k]}
          </Button>
          <Button
            variant={dialog.confirmTone}
            disabled={needsTyped && typed !== terminateReason.typed}
            loading={saving}
            onClick={() => onConfirm(reason)}
          >
            {dialog.confirm[k]}
          </Button>
        </>
      }
    >
      {dialog.points && (
        <div className="space-y-1.5 rounded-[12px] bg-surface-subtle px-3.5 py-3">
          {dialog.listLabel && (
            <p className="text-[10px] font-medium uppercase tracking-[0.04em] text-text-muted">
              {dialog.listLabel[k]}
            </p>
          )}
          {dialog.points.map((point) => (
            <p
              key={point.en}
              className="flex items-start gap-2 text-[12.5px] leading-5 text-text-body"
            >
              <ChevronRight
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-text-muted rtl:rotate-180"
                aria-hidden="true"
              />
              {point[k]}
            </p>
          ))}
        </div>
      )}

      {kind === "pause" && (
        <Input
          label={pauseReason.label[k]}
          placeholder={pauseReason.placeholder[k]}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
      )}

      {needsTyped && (
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label={live ? pauseReason.label[k] : terminateReason.label[k]}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
          <Input
            label={terminateReason.typedLabel[k]}
            placeholder={terminateReason.typed}
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
          />
        </div>
      )}
    </IconModal>
  );
}

/** OV 03.22 — the amendment that makes v1.4. */
export function AmendOverlay({ onClose, onStart }: { onClose: () => void; onStart: () => void }) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const d = amendDialog;

  return (
    <IconModal
      icon={<History className="h-5 w-5" aria-hidden="true" />}
      overline={d.overline[k]}
      title={d.title[k]}
      body={d.body[k]}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {d.cancel[k]}
          </Button>
          <Button onClick={onStart}>{d.confirm[k]}</Button>
        </>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-[10px] border border-border-subtle bg-surface-subtle px-3.5 py-3">
          <p className="text-overline text-text-muted">{d.effectiveLabel[k]}</p>
          <p className="mt-1 text-[12.5px] font-medium text-text-primary">{d.effectiveValue[k]}</p>
          <p className="mt-1 text-[11px] text-text-muted">{d.effectiveHint[k]}</p>
        </div>
        <div className="rounded-[10px] border border-border-subtle bg-surface-subtle px-3.5 py-3">
          <p className="text-overline text-text-muted">{d.changesLabel[k]}</p>
          <p className="mt-1 text-[12.5px] font-medium text-text-primary">{d.changesValue[k]}</p>
        </div>
      </div>

      <div className="space-y-1.5">
        {d.fields.map((field) => (
          <div
            key={field.label.en}
            className="flex items-center justify-between gap-3 border-b border-border-subtle py-2 last:border-0"
          >
            <span className="text-[12px] text-text-muted">{field.label[k]}</span>
            <span className="text-[12.5px] font-medium text-text-primary">{field.value[k]}</span>
          </div>
        ))}
      </div>

      <div className="space-y-1.5 rounded-[12px] bg-surface-subtle px-3.5 py-3">
        {d.points.map((point: Bilingual) => (
          <p
            key={point.en}
            className="flex items-start gap-2 text-[12.5px] leading-5 text-text-body"
          >
            <ChevronRight
              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-text-muted rtl:rotate-180"
              aria-hidden="true"
            />
            {point[k]}
          </p>
        ))}
      </div>
    </IconModal>
  );
}

/** OV 03.23R / R2 — confirm or decline one request inside its SLA. */
export function AnswerOverlay({ onClose, onSend }: { onClose: () => void; onSend: () => void }) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const d = answerDialog;
  const [decision, setDecision] = useState<"confirm" | "decline">("confirm");
  const [reference, setReference] = useState("");

  return (
    <IconModal
      icon={<Clock3 className="h-5 w-5" aria-hidden="true" />}
      overline={d.overline[k]}
      title={d.title[k]}
      body={d.body[k]}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {d.cancel[k]}
          </Button>
          <Button onClick={onSend}>{d.confirm[k]}</Button>
        </>
      }
    >
      <div>
        <p className="mb-1.5 text-sm font-medium text-text-primary">{d.decisionLabel[k]}</p>
        <div className="flex gap-2">
          {(
            [
              ["confirm", d.confirmOption[k]],
              ["decline", d.declineOption[k]],
            ] as Array<["confirm" | "decline", string]>
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setDecision(value)}
              className={cn(
                "rounded-lg border px-3.5 py-2 text-sm transition-colors",
                decision === value
                  ? "border-brand-deep bg-primary-subtle font-medium text-text-primary"
                  : "border-border-default text-text-secondary hover:bg-surface-subtle",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {decision === "confirm" ? (
        <Input
          label={d.referenceLabel[k]}
          placeholder={d.referencePlaceholder[k]}
          value={reference}
          onChange={(event) => setReference(event.target.value)}
        />
      ) : (
        <>
          <div>
            <p className="mb-1.5 text-sm font-medium text-text-primary">{d.reasonLabel[k]}</p>
            <button
              type="button"
              className="flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-border-default bg-surface-default px-3 text-start text-sm text-text-muted"
            >
              {d.reasonPlaceholder[k]}
              <Pencil className="h-4 w-4 shrink-0" aria-hidden="true" />
            </button>
          </div>
          <p className="text-[11.5px] leading-5 text-text-muted">{d.declineNote[k]}</p>
        </>
      )}
    </IconModal>
  );
}
