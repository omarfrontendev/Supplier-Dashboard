import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CopyPlus, OctagonX } from "lucide-react";
import { isAxiosError, type AxiosError } from "axios";

import { Drawer, IconModal } from "@/components/layout/overlay";
import { Button } from "@/components/ui/button";
import { DateField, readableDay } from "@/components/ui/date-field";
import type { DayRange } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { ReusablePagination } from "@/components/ui/ReusablePagination";
import { ConfirmOverlay } from "@/components/contracts/contract-overlays";
import { LifecycleDialogOverlay } from "@/components/contracts/lifecycle-overlays";
import type {
  ContractActionError,
  ContractActivity,
  ContractActivityChange,
  ContractStopSalePreview,
} from "@/api/modules/hotel-contract/contract-actions-types";
import type { SupplyContract } from "@/api/modules/hotel-contract/types";
import {
  useCopyHotelContract,
  useDeleteHotelContract,
  useHotelContractActivity,
  usePauseHotelContract,
  usePreviewContractStopSale,
  useResumeHotelContract,
  useSaveContractStopSale,
  useTerminateHotelContract,
} from "@/api/modules/hotel-contract/useHotelContractActions";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  activityCopy,
  contractActionCopy,
  copyPeriodCopy,
  liveDeletePanel,
  livePauseDialog,
  liveResumePanel,
  liveTerminateDialog,
  statusName,
  stopSaleCopy,
} from "@/lib/contract-actions-data";
import { fill, useLanguage } from "@/lib/i18n";
import { notify } from "@/lib/notify";

export type ContractAction =
  | "pause"
  | "resume"
  | "delete"
  | "terminate"
  | "stopSell"
  | "copy"
  | "activity";

type Language = "en" | "ar";

const useK = (): Language => (useLanguage().lang === "ar" ? "ar" : "en");

const dayOf = (value: string) => value.slice(0, 10);

const isConflict = (error: unknown) => isAxiosError(error) && error.response?.status === 409;

const riyadhToday = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Riyadh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

function ContractDecision({
  contract,
  action,
  onClose,
}: {
  contract: SupplyContract;
  action: "pause" | "resume" | "delete" | "terminate";
  onClose: () => void;
}) {
  const k = useK();
  const c = contractActionCopy;
  const pause = usePauseHotelContract();
  const resume = useResumeHotelContract();
  const remove = useDeleteHotelContract();
  const terminate = useTerminateHotelContract();

  const mutations = {
    pause: { run: pause, done: c.paused },
    resume: { run: resume, done: c.resumed },
    delete: { run: remove, done: c.deleted },
    terminate: { run: terminate, done: c.terminated },
  };
  const current = mutations[action];

  const submit = (reason: string) => {
    current.run.mutate(
      {
        id: contract.id,
        expectedVersion: contract.version,
        ...(reason.trim() ? { reason } : {}),
      },
      {
        onSuccess: () => {
          notify.success(current.done[k]);
          onClose();
        },
        onError: (error) => {
          if (isConflict(error)) {
            notify.error(getApiErrorMessage(error, c.stale[k]));
            onClose();
            return;
          }
          notify.error(getApiErrorMessage(error, c.failed[k]));
        },
      },
    );
  };

  const saving = current.run.isPending;

  if (action === "pause" || action === "terminate") {
    return (
      <LifecycleDialogOverlay
        live
        kind={action}
        dialog={
          action === "pause"
            ? livePauseDialog(contract.name, contract.status)
            : liveTerminateDialog(contract.name, contract.status)
        }
        saving={saving}
        onClose={onClose}
        onConfirm={submit}
      />
    );
  }

  return (
    <ConfirmOverlay
      panel={action === "resume" ? liveResumePanel(contract.name) : liveDeletePanel(contract.name)}
      reasonLabel={c.reason[k]}
      saving={saving}
      onClose={onClose}
      onConfirm={submit}
    />
  );
}

function CopyPeriodOverlay({
  contract,
  onClose,
}: {
  contract: SupplyContract;
  onClose: () => void;
}) {
  const k = useK();
  const c = copyPeriodCopy;
  const navigate = useNavigate();
  const copy = useCopyHotelContract();
  const [period, setPeriod] = useState<DayRange>({ start: "", end: null });
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [showRequired, setShowRequired] = useState(false);

  const failure = copy.error as AxiosError<ContractActionError> | null;
  const nameTaken = failure?.response?.data?.data?.code === "contract_name_conflict";
  const conflicts = failure?.response?.data?.data?.conflicts ?? [];
  const complete = Boolean(period.start && period.end);

  const submit = () => {
    if (!period.start || !period.end) {
      setShowRequired(true);
      return;
    }
    copy.mutate(
      {
        id: contract.id,
        startDate: period.start,
        endDate: period.end,
        ...(name.trim() ? { name } : {}),
        ...(reason.trim() ? { reason } : {}),
      },
      {
        onSuccess: (draft) => {
          notify.success(`${c.done[k]} · ${draft.name}`);
          const skipped = draft.copy.skippedRestrictionIds.length;
          if (skipped > 0) notify.warning(fill(c.skipped[k], { count: skipped }));
          onClose();
          void navigate({
            to: "/rate-contracts/$contractId/edit",
            params: { contractId: String(draft.id) },
          });
        },
        onError: (error) => {
          const code = error.response?.data?.data;
          if (code?.code === "contract_name_conflict" || code?.conflicts?.length) return;
          notify.error(getApiErrorMessage(error, contractActionCopy.failed[k]));
        },
      },
    );
  };

  return (
    <IconModal
      icon={<CopyPlus className="h-5 w-5" aria-hidden="true" />}
      overline={c.overline[k]}
      title={c.title[k]}
      body={c.body[k]}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {contractActionCopy.cancel[k]}
          </Button>
          <Button loading={copy.isPending} onClick={submit}>
            {c.confirm[k]}
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <DateField
          mode="range"
          label={c.period[k]}
          placeholder={c.periodPlaceholder[k]}
          value={period}
          invalid={(showRequired && !complete) || conflicts.length > 0}
          onChange={(next) => {
            setPeriod(next);
            setShowRequired(false);
            copy.reset();
          }}
        />
        {showRequired && !complete && (
          <p className="text-xs text-status-danger">{c.periodRequired[k]}</p>
        )}
        {conflicts.length > 0 && (
          <div className="rounded-[10px] bg-status-danger-bg px-3.5 py-3 text-xs leading-5 text-status-danger">
            <p className="font-medium">{c.conflicts[k]}</p>
            <ul className="mt-1 max-h-32 space-y-0.5 overflow-y-auto">
              {conflicts.map((item) => (
                <li key={item.id}>
                  {item.name} · {readableDay(dayOf(item.startDate), k)} –{" "}
                  {readableDay(dayOf(item.endDate), k)} · {statusName(item.status, k)}
                </li>
              ))}
            </ul>
          </div>
        )}
        <Input
          label={c.name[k]}
          placeholder={c.namePlaceholder[k]}
          maxLength={200}
          value={name}
          {...(nameTaken ? { error: c.nameTaken[k] } : {})}
          onChange={(event) => {
            setName(event.target.value);
            copy.reset();
          }}
        />
        <Input
          label={contractActionCopy.reason[k]}
          maxLength={500}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
      </div>
    </IconModal>
  );
}

function StopSaleOverlay({
  contract,
  onClose,
}: {
  contract: SupplyContract;
  onClose: () => void;
}) {
  const k = useK();
  const c = stopSaleCopy;
  const today = riyadhToday();
  const contractStart = dayOf(contract.startDate);
  const min = contractStart > today ? contractStart : today;
  const max = dayOf(contract.endDate);
  const noNights = min > max;

  const [period, setPeriod] = useState<DayRange>(
    noNights ? { start: "", end: null } : { start: min, end: max },
  );
  const [reason, setReason] = useState("");
  const [preview, setPreview] = useState<ContractStopSalePreview | null>(null);
  const previewRequest = usePreviewContractStopSale();
  const save = useSaveContractStopSale();

  const runPreview = () => {
    if (!period.start || !period.end) return;
    previewRequest.mutate(
      {
        id: contract.id,
        startDate: period.start,
        endDate: period.end,
        ...(reason.trim() ? { reason } : {}),
      },
      {
        onSuccess: setPreview,
        onError: (error) =>
          notify.error(getApiErrorMessage(error, contractActionCopy.failed[k])),
      },
    );
  };

  const submit = () => {
    if (!preview || !period.start || !period.end) return;
    save.mutate(
      {
        id: contract.id,
        startDate: period.start,
        endDate: period.end,
        expectedRevision: preview.sellControlsRevision,
        ...(reason.trim() ? { reason } : {}),
      },
      {
        onSuccess: () => {
          notify.success(c.done[k]);
          onClose();
        },
        onError: (error) => {
          if (isConflict(error)) setPreview(null);
          notify.error(getApiErrorMessage(error, contractActionCopy.failed[k]));
        },
      },
    );
  };

  const stats = preview
    ? [
        [c.nights[k], preview.nightCount],
        [c.variations[k], preview.variationCount],
        [c.cells[k], preview.cellCount],
        [c.replacedStop[k], preview.replacedControlCounts.stopSale],
        [c.replacedRequest[k], preview.replacedControlCounts.onRequest],
      ]
    : [];

  return (
    <IconModal
      tone="danger"
      icon={<OctagonX className="h-5 w-5" aria-hidden="true" />}
      overline={c.overline(contract.name, contract.status)[k]}
      title={c.title[k]}
      body={c.body[k]}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {contractActionCopy.cancel[k]}
          </Button>
          {preview ? (
            <Button loading={save.isPending} onClick={submit}>
              {c.confirm[k]}
            </Button>
          ) : (
            <Button
              loading={previewRequest.isPending}
              disabled={noNights || !period.start || !period.end}
              reason={c.noNights[k]}
              onClick={runPreview}
            >
              {c.preview[k]}
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-3">
        {noNights ? (
          <p className="text-sm text-text-muted">{c.noNights[k]}</p>
        ) : (
          <DateField
            mode="range"
            label={c.period[k]}
            min={min}
            max={max}
            value={period}
            onChange={(next) => {
              setPeriod(next);
              setPreview(null);
            }}
          />
        )}
        <Input
          label={contractActionCopy.reason[k]}
          maxLength={1000}
          value={reason}
          onChange={(event) => {
            setReason(event.target.value);
            setPreview(null);
          }}
        />
        {preview && (
          <div>
            <p className="text-overline text-text-muted">{c.summary[k]}</p>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {stats.map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-[10px] border border-border-subtle bg-surface-subtle px-3.5 py-3"
                >
                  <p className="text-[11px] text-text-muted">{label}</p>
                  <p className="font-data mt-0.5 text-sm font-semibold text-text-primary">
                    {Number(value).toLocaleString(k === "ar" ? "ar-EG" : "en-US")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="space-y-1.5 rounded-[12px] bg-surface-subtle px-3.5 py-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.04em] text-text-muted">
            {c.listLabel[k]}
          </p>
          {c.points.map((point) => (
            <p key={point.en} className="text-[12.5px] leading-5 text-text-body">
              {point[k]}
            </p>
          ))}
        </div>
      </div>
    </IconModal>
  );
}

function changeValue(change: ContractActivityChange, value: unknown, k: Language) {
  if (change.field === "status") return statusName(value, k);
  if (change.field === "period" && value && typeof value === "object") {
    const period = value as { startDate?: string; endDate?: string };
    if (period.startDate && period.endDate) {
      return `${readableDay(dayOf(period.startDate), k)} – ${readableDay(dayOf(period.endDate), k)}`;
    }
  }
  if (typeof value === "string" || typeof value === "number") return String(value);
  return null;
}

function ActivityRow({ entry, k }: { entry: ContractActivity; k: Language }) {
  const c = activityCopy;
  const cause = c.causes[entry.reason as keyof typeof c.causes]?.[k];
  const when = new Intl.DateTimeFormat(k === "ar" ? "ar-EG" : "en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Riyadh",
  }).format(new Date(entry.createdAt));

  return (
    <li className="border-t border-border-subtle py-3 first:border-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <p className="text-[13px] font-medium text-text-primary">{c.actions[entry.action][k]}</p>
        <p className="font-data text-[11px] text-text-muted">{when}</p>
      </div>
      <p className="mt-0.5 text-[11.5px] text-text-muted">{entry.actor?.username ?? c.system[k]}</p>
      {entry.changes.length > 0 && (
        <ul className="mt-1.5 space-y-0.5">
          {entry.changes.map((change) => {
            const from = changeValue(change, change.from, k);
            const to = changeValue(change, change.to, k);
            return (
              <li key={change.field} className="text-[12px] leading-5 text-text-secondary">
                <span className="font-medium">
                  {c.fields[change.field as keyof typeof c.fields]?.[k] ?? change.field}
                </span>
                {" · "}
                {from !== null || to !== null ? (
                  <bdi>
                    {from ?? "—"} → {to ?? "—"}
                  </bdi>
                ) : (
                  c.changed[k]
                )}
              </li>
            );
          })}
        </ul>
      )}
      {entry.reason && (
        <p className="mt-1 text-[12px] leading-5 text-text-secondary">
          <span className="font-medium">{c.reason[k]}</span> · {cause ?? entry.reason}
        </p>
      )}
    </li>
  );
}

function ContractActivityDrawer({
  contract,
  onClose,
}: {
  contract: SupplyContract;
  onClose: () => void;
}) {
  const { lang } = useLanguage();
  const k = useK();
  const c = activityCopy;
  const [page, setPage] = useState(1);
  const { data, isPending, isError, isFetching, refetch } = useHotelContractActivity(
    contract.id,
    page,
  );

  return (
    <Drawer
      width="640px"
      overline={c.overline[k]}
      title={c.title[k]}
      meta={contract.name}
      onClose={onClose}
      footer={<Button onClick={onClose}>{c.close[k]}</Button>}
    >
      {isPending ? (
        <div className="space-y-3">
          {[0, 1, 2].map((row) => (
            <div key={row} className="h-14 animate-pulse rounded-[10px] bg-surface-subtle" />
          ))}
        </div>
      ) : isError ? (
        <div className="py-8 text-center">
          <p className="text-sm text-text-muted">{c.failed[k]}</p>
          <Button className="mt-3" variant="outline" size="sm" onClick={() => void refetch()}>
            {c.retry[k]}
          </Button>
        </div>
      ) : data.activities.length === 0 ? (
        <p className="py-8 text-center text-sm text-text-muted">{c.empty[k]}</p>
      ) : (
        <>
          <ol>
            {data.activities.map((entry) => (
              <ActivityRow key={`${entry.action}-${entry.id}`} entry={entry} k={k} />
            ))}
          </ol>
          {data.meta.totalPages > 1 && (
            <ReusablePagination
              page={page}
              totalPages={data.meta.totalPages}
              onPageChange={setPage}
              isLoading={isFetching}
              lang={lang}
            />
          )}
        </>
      )}
    </Drawer>
  );
}

export function ContractActionOverlay({
  contract,
  action,
  onClose,
}: {
  contract: SupplyContract;
  action: ContractAction;
  onClose: () => void;
}) {
  if (action === "copy") return <CopyPeriodOverlay contract={contract} onClose={onClose} />;
  if (action === "stopSell") return <StopSaleOverlay contract={contract} onClose={onClose} />;
  if (action === "activity") return <ContractActivityDrawer contract={contract} onClose={onClose} />;
  return <ContractDecision contract={contract} action={action} onClose={onClose} />;
}
