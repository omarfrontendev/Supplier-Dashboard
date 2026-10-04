import { useState } from "react";
import {
  Check,
  ChevronRight,
  Clock3,
  History,
  Pencil,
  ShieldAlert,
  Undo2,
} from "lucide-react";
import { Drawer, IconModal } from "@/components/layout/overlay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
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
}: {
  text: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-start gap-3 text-start"
    >
      <span
        className={cn(
          "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border",
          on
            ? "border-brand-deep bg-brand-deep text-text-inverse"
            : "border-border-strong"
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
  onActivate,
  working = false,
}: {
  onClose: () => void;
  onActivate: () => void;
  working?: boolean;
}) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const d = activateDrawer;
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
          <Button disabled={!agreed} loading={working} onClick={onActivate}>
            {working ? d.working[k] : d.confirm[k]}
          </Button>
        </>
      }
    >
      <div className="space-y-0">
        {d.rows.map((row) => (
          <div
            key={row.label.en}
            className="border-b border-border-subtle py-3 last:border-0"
          >
            <p className="text-[12.5px] font-medium text-text-primary">
              {row.label[k]}
            </p>
            <p className="mt-1 text-[12px] leading-5 text-text-muted">
              {row.value[k]}
            </p>
          </div>
        ))}
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
                      index === 0
                        ? "font-medium text-text-primary"
                        : "text-text-secondary"
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
                        : "text-text-secondary"
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
              <p className="text-[12px] font-medium text-text-primary">
                {entry.day[k]}
              </p>
              <p className="font-data text-[11px] text-text-muted">
                {entry.time[k]}
              </p>
            </div>
            <div className="min-w-0 border-s border-border-subtle ps-3">
              <p className="text-[12.5px] font-medium text-text-primary">
                {entry.title[k]}
              </p>
              <p className="mt-0.5 text-[11.5px] leading-4 text-text-secondary">
                {entry.detail[k]}
              </p>
              <p className="mt-0.5 text-[11px] text-text-muted">
                {entry.meta[k]}
              </p>
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
}: {
  dialog: LifecycleDialog;
  kind: "discard" | "pause" | "terminate";
  onClose: () => void;
  onConfirm: () => void;
}) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const [reason, setReason] = useState(
    kind === "terminate" ? terminateReason.value[k] : ""
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
            onClick={onConfirm}
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
            label={terminateReason.label[k]}
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
export function AmendOverlay({
  onClose,
  onStart,
}: {
  onClose: () => void;
  onStart: () => void;
}) {
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
          <p className="mt-1 text-[12.5px] font-medium text-text-primary">
            {d.effectiveValue[k]}
          </p>
          <p className="mt-1 text-[11px] text-text-muted">{d.effectiveHint[k]}</p>
        </div>
        <div className="rounded-[10px] border border-border-subtle bg-surface-subtle px-3.5 py-3">
          <p className="text-overline text-text-muted">{d.changesLabel[k]}</p>
          <p className="mt-1 text-[12.5px] font-medium text-text-primary">
            {d.changesValue[k]}
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        {d.fields.map((field) => (
          <div
            key={field.label.en}
            className="flex items-center justify-between gap-3 border-b border-border-subtle py-2 last:border-0"
          >
            <span className="text-[12px] text-text-muted">{field.label[k]}</span>
            <span className="text-[12.5px] font-medium text-text-primary">
              {field.value[k]}
            </span>
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
export function AnswerOverlay({
  onClose,
  onSend,
}: {
  onClose: () => void;
  onSend: () => void;
}) {
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
        <p className="mb-1.5 text-sm font-medium text-text-primary">
          {d.decisionLabel[k]}
        </p>
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
                  : "border-border-default text-text-secondary hover:bg-surface-subtle"
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
            <p className="mb-1.5 text-sm font-medium text-text-primary">
              {d.reasonLabel[k]}
            </p>
            <button
              type="button"
              className="flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-border-default bg-surface-default px-3 text-start text-sm text-text-muted"
            >
              {d.reasonPlaceholder[k]}
              <Pencil className="h-4 w-4 shrink-0" aria-hidden="true" />
            </button>
          </div>
          <p className="text-[11.5px] leading-5 text-text-muted">
            {d.declineNote[k]}
          </p>
        </>
      )}
    </IconModal>
  );
}
