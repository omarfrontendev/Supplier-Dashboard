import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, ArrowRight, FileWarning } from "lucide-react";
import {
  BackLink,
  DataRow,
  PageShell,
  SectionCard,
  StatusPill,
} from "@/components/layout/page-shell";
import { ChangeRequestStatus } from "@/components/change-requests/change-request-status";
import {
  AmendmentOutcome,
  CancellationOutcome,
  DeclineDialog,
  WaiveDialog,
} from "@/components/change-requests/change-request-outcome";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { changeRequestCopy, crFill } from "@/lib/change-request-copy";
import {
  amendmentMoves,
  cancellationWindow,
  changeRequestDetails,
} from "@/lib/change-request-data";
import { useLanguage } from "@/lib/i18n";
import { usePortal } from "@/lib/portal-store";

export const Route = createFileRoute("/bookings/change-requests/$requestId/")({
  validateSearch: (
    search: Record<string, unknown>
  ): { state?: "charged" | "waived" | "auto" | "approved" | "declined" | "expired" } =>
    ["charged", "waived", "auto", "approved", "declined", "expired"].includes(
      String(search["state"])
    )
      ? { state: search["state"] as never }
      : {},
  head: () => ({
    meta: [
      { title: "Change request · Hoteliana Supplier Portal" },
      {
        name: "description",
        content:
          "Decide a cancellation charge or approve a non-commercial amendment on a confirmed booking.",
      },
      {
        property: "og:title",
        content: "Change request · Hoteliana Supplier Portal",
      },
      {
        property: "og:description",
        content: "Answer what an agent asked to change on a confirmed booking.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ChangeRequestDetailPage,
});

/** Figma UI 06.1 (cancellation) and UI 06.10 (non-commercial amendment). */
function ChangeRequestDetailPage() {
  const { requestId } = Route.useParams();
  const { state } = Route.useSearch();
  const { lang } = useLanguage();
  const t = changeRequestCopy[lang];
  const ar = lang === "ar";
  const { changeRequests, decideChangeRequest } = usePortal();

  const r = changeRequests.find((item) => item.id === requestId);
  if (!r) throw notFound();

  const d = changeRequestDetails[r.id];
  const cancellation = ["cancellation", "partial", "shortened"].includes(r.kind);
  const [charge, setCharge] = useState(String(r.ceiling));
  const [idChecked, setIdChecked] = useState(false);
  const [action, setAction] = useState<
    "full" | "less" | "approve" | null
  >(null);
  const [waiveOpen, setWaiveOpen] = useState(false);
  const [declineOpen, setDeclineOpen] = useState(false);
  const [waiveReason, setWaiveReason] = useState("Guest emergency");

  const decided =
    state ?? (r.state === "handled" ? "charged" : r.state === "approved" ? "approved" : r.state === "declined" ? "declined" : undefined);

  return (
    <PageShell>
      <BackLink to="/bookings/change-requests" label={t.back} />

      <header className="mb-6">
        <div className="flex flex-wrap items-center gap-2">
          {decided ? (
            cancellation ? (
              <>
                <StatusPill tone="danger">{t.outCancelled}</StatusPill>
                <StatusPill tone="neutral">
                  {crFill(t.outCharged, {
                    amount: r.ceiling.toLocaleString(ar ? "ar-EG" : "en-US"),
                  })}
                </StatusPill>
                <StatusPill tone={decided === "waived" ? "neutral" : "warning"}>
                  {decided === "waived"
                    ? crFill(t.outWaivedPill, { reason: waiveReason })
                    : decided === "auto"
                      ? t.outAutoPill
                      : t.outChargePending}
                </StatusPill>
              </>
            ) : (
              <>
                <StatusPill
                  tone={decided === "approved" ? "success" : "neutral"}
                >
                  {decided === "approved"
                    ? t.amendedPill
                    : decided === "expired"
                      ? t.expiredPill
                      : t.declinedPill}
                </StatusPill>
                <StatusPill tone="neutral">
                  {decided === "approved" ? t.amendedConfirmed : t.unchangedPill}
                </StatusPill>
                {decided === "approved" && (
                  <StatusPill tone="neutral">{t.amendedNoCost}</StatusPill>
                )}
              </>
            )
          ) : cancellation ? (
            <>
              <StatusPill tone="warning">{t.cancelAskedPill}</StatusPill>
              <StatusPill tone="neutral">{t.stillConfirmed}</StatusPill>
              <StatusPill tone="neutral">{t.noChargeYet}</StatusPill>
            </>
          ) : (
            t.amendPills.map((pill, index) => (
              <StatusPill key={pill} tone={index === 0 ? "warning" : "neutral"}>
                {pill}
              </StatusPill>
            ))
          )}
        </div>
        <h1 className="mt-2 text-2xl font-semibold text-text-primary sm:text-[28px]">
          {ar ? r.guestAr : r.guest}
        </h1>
        <p className="font-data mt-1 text-xs text-text-muted">
          {decided
            ? crFill(
                cancellation
                  ? decided === "auto"
                    ? ar
                      ? t.outAutoMeta
                      : t.outAutoMeta
                    : t.outCancelMeta
                  : decided === "approved"
                    ? t.amendedMeta
                    : decided === "expired"
                      ? t.expiredMeta
                      : t.declinedMeta,
                { id: r.bookingId, hotel: ar ? r.hotelAr : r.hotel }
              )
            : d
              ? ar
                ? d.metaAr
                : d.meta
              : `${r.bookingId} · ${ar ? r.hotelAr : r.hotel}`}
        </p>
      </header>

      {d && !decided && (
        <section
          className={cn(
            "mb-6 flex flex-wrap items-start justify-between gap-5 rounded-2xl border p-5 sm:p-6",
            cancellation
              ? "border-status-warning/30 bg-status-warning-bg"
              : "border-status-info/25 bg-status-info-bg"
          )}
        >
          <div className="min-w-0 flex-1">
            <p className="text-base font-semibold text-text-primary">
              {ar ? d.headlineAr : d.headline}
            </p>
            <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-text-secondary">
              {ar ? d.leadAr : d.lead}
            </p>
          </div>
          <div className="rounded-xl bg-surface-default px-5 py-3 text-center">
            <p className="font-data text-xl font-semibold text-text-primary">
              {d.amount}
            </p>
            <p className="mt-0.5 text-xs text-text-muted">
              {ar ? d.amountNoteAr : d.amountNote}
            </p>
          </div>
        </section>
      )}

      {decided ? (
        cancellation ? (
          <CancellationOutcome
            request={r}
            t={t}
            ar={ar}
            mode={decided as "charged" | "waived" | "auto"}
            reason={waiveReason}
          />
        ) : (
          <AmendmentOutcome
            t={t}
            mode={decided as "approved" | "declined" | "expired"}
          />
        )
      ) : cancellation ? (
        <>
          <SectionCard
            className="mb-6"
            overline={t.policyOverline}
            title={t.policyTitle}
            description={t.policyBody}
          >
            <div className="grid gap-3 sm:grid-cols-3">
              {cancellationWindow.map(([label, labelAr, note, noteAr], index) => (
                <div
                  key={label}
                  className={cn(
                    "rounded-xl border p-4",
                    index === 2
                      ? "border-status-danger/25 bg-status-danger-bg"
                      : "border-border-subtle"
                  )}
                >
                  <p className="text-sm font-medium text-text-primary">
                    {ar ? labelAr : label}
                  </p>
                  <p className="mt-0.5 text-xs text-text-secondary">
                    {ar ? noteAr : note}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            className="mb-6"
            overline={t.decisionOverline}
            title={crFill(t.decisionTitle, {
              amount: r.ceiling.toLocaleString(ar ? "ar-EG" : "en-US"),
            })}
            description={t.decisionBody}
          >
            <div className="grid gap-3 sm:grid-cols-3">
              {(
                [
                  [
                    "full",
                    crFill(t.full, { amount: r.ceiling.toLocaleString(ar ? "ar-EG" : "en-US") }),
                    t.chargeFullNote,
                  ],
                  ["less", t.less, t.chargeLessNote],
                  ["waive" as const, t.waive, t.waiveNote],
                ] as Array<["full" | "less" | "waive", string, string]>
              ).map(([key, label, note]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() =>
                    key === "waive" ? setWaiveOpen(true) : setAction(key)
                  }
                  className="rounded-xl border border-border-default p-4 text-start transition-colors hover:bg-surface-subtle"
                >
                  <p className="text-sm font-semibold text-text-primary">{label}</p>
                  <p className="mt-1 text-xs leading-5 text-text-muted">{note}</p>
                </button>
              ))}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                [t.statusBooking, t.statusBookingValue],
                [t.statusFinancial, t.statusFinancialValue],
                [t.statusSettles, t.statusSettlesValue],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-surface-subtle p-4">
                  <p className="text-overline text-text-muted">{label}</p>
                  <p className="mt-1 text-sm font-medium text-text-primary">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs leading-5 text-text-muted">
              {d ? (ar ? d.respondByAr : d.respondBy) : ""}
            </p>

            <div className="mt-5 flex flex-wrap justify-end gap-3">
              <Button variant="outline">
                <FileWarning className="h-4 w-4" aria-hidden="true" />
                {t.reportInstead}
              </Button>
              <Button onClick={() => setAction("full")}>
                {t.confirmCancellation}
              </Button>
            </div>
          </SectionCard>

          <SectionCard
            className="mb-6"
            overline={t.confirmingOverline}
            title={t.confirmingTitle}
          >
            <div className="grid gap-3 sm:grid-cols-3">
              {t.confirmingPoints.map(([title, body]) => (
                <div key={title} className="rounded-xl bg-surface-subtle p-4">
                  <p className="text-sm font-semibold text-text-primary">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-text-secondary">
                    {body}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-text-muted">
              <AlertTriangle
                className="mt-0.5 h-3.5 w-3.5 shrink-0"
                aria-hidden="true"
              />
              {t.confirmingNote}
            </p>
          </SectionCard>
        </>
      ) : (
        <>
          <SectionCard
            className="mb-6"
            overline={t.movesOverline}
            title={t.movesTitle}
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-sm">
                <tbody>
                  {amendmentMoves.map(([label, labelAr, before, after]) => (
                    <tr key={label} className="border-b border-border-subtle last:border-0">
                      <td className="text-overline py-3 pe-3 text-text-muted">
                        {ar ? labelAr : label}
                      </td>
                      <td className="py-3 pe-3 text-text-secondary line-through">
                        {before}
                      </td>
                      <td className="py-3 pe-3">
                        <ArrowRight
                          className="h-3.5 w-3.5 text-text-muted rtl:rotate-180"
                          aria-hidden="true"
                        />
                      </td>
                      <td className="py-3 font-medium text-text-primary">{after}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs leading-5 text-text-muted">{t.movesNote}</p>
          </SectionCard>

          <SectionCard
            className="mb-6"
            overline={t.amendAnswerOverline}
            title={t.amendAnswerTitle}
            description={t.amendAnswerBody}
          >
            <div className="grid gap-3 sm:grid-cols-3">
              {t.amendPoints.map(([title, body]) => (
                <div key={title} className="rounded-xl bg-surface-subtle p-4">
                  <p className="text-sm font-semibold text-text-primary">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-text-secondary">
                    {body}
                  </p>
                </div>
              ))}
            </div>

            <label className="mt-4 flex cursor-pointer items-start gap-2.5">
              <input
                type="checkbox"
                checked={idChecked}
                onChange={(e) => setIdChecked(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[var(--brand-deep)]"
              />
              <span className="text-[13px] leading-[1.5] text-text-secondary">
                {t.idCheck}
              </span>
            </label>

            <p className="mt-4 text-xs leading-5 text-text-muted">
              {d ? (ar ? d.respondByAr : d.respondBy) : ""}
            </p>

            <div className="mt-5 flex flex-wrap justify-end gap-3">
              <Button variant="outline" onClick={() => setDeclineOpen(true)}>
                {t.declineChange}
              </Button>
              <Button disabled={!idChecked} onClick={() => setAction("approve")}>
                {t.approveName}
              </Button>
            </div>
          </SectionCard>

          <SectionCard
            className="mb-6"
            overline={t.versionsOverline}
            title={t.versionsTitle}
          >
            <div className="space-y-2">
              {t.versionRows.map(([name, state, detail, note]) => (
                <div
                  key={name}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-border-subtle p-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-text-primary">{name}</p>
                    <p className="mt-0.5 text-xs text-text-secondary">{detail}</p>
                  </div>
                  <StatusPill
                    tone={
                      state === "Live" || state === "ساري"
                        ? "success"
                        : state === "Pending" || state === "معلّق"
                          ? "warning"
                          : "neutral"
                    }
                  >
                    {state}
                  </StatusPill>
                  <span className="text-xs text-text-muted">{note}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs leading-5 text-text-muted">
              {t.versionsNote}
            </p>
          </SectionCard>
        </>
      )}

      {d && (
        <div className="grid gap-6 xl:grid-cols-2">
          <SectionCard
            overline={cancellation ? t.detailsOverline : t.amendDetailsOverline}
            title={cancellation ? t.detailsTitle : t.amendDetailsTitle}
          >
            <div>
              <DataRow label={t.statusLabel}>
                <span className="text-sm text-text-primary">
                  {cancellation ? t.statusCancel : t.statusAmend}
                </span>
                <ChangeRequestStatus request={r} />
              </DataRow>
              {d.rows.map(([label, labelAr, value, valueAr]) => (
                <DataRow key={label} label={ar ? labelAr : label}>
                  <span className="text-sm text-text-primary">
                    {ar ? valueAr : value}
                  </span>
                </DataRow>
              ))}
            </div>
          </SectionCard>

          {d.guests.length > 0 && (
            <SectionCard overline={t.guestsOverline} title={t.guestsTitle}>
              <div>
                {d.guests.map(([label, labelAr, value, valueAr]) => (
                  <DataRow key={label} label={ar ? labelAr : label}>
                    <span className="text-sm text-text-primary">
                      {ar ? valueAr : value}
                    </span>
                  </DataRow>
                ))}
              </div>
            </SectionCard>
          )}
        </div>
      )}

      <div className="mt-6">
        <Link to="/bookings/$bookingId" params={{ bookingId: r.bookingId }}>
          <Button variant="outline">{t.openBooking}</Button>
        </Link>
      </div>

      {waiveOpen && (
        <WaiveDialog
          request={r}
          onClose={() => setWaiveOpen(false)}
          onWaive={(reason) => {
            setWaiveReason(reason);
            decideChangeRequest(r.id, "handled", 0, reason);
            setWaiveOpen(false);
          }}
        />
      )}

      {declineOpen && (
        <DeclineDialog
          request={r}
          onClose={() => setDeclineOpen(false)}
          onDecline={(reason) => {
            decideChangeRequest(r.id, "declined", undefined, reason);
            setDeclineOpen(false);
          }}
        />
      )}

      <Dialog open={action !== null} onOpenChange={(open) => !open && setAction(null)}>
        <DialogContent className="max-w-[560px] rounded-2xl border-border-subtle bg-surface-default">
          <DialogHeader>
            <DialogTitle>
              {action === "approve" ? t.approveName : t.confirmCancellation}
            </DialogTitle>
            <DialogDescription>
              {d ? (ar ? d.respondByAr : d.respondBy) : ""}
            </DialogDescription>
          </DialogHeader>

          {action === "less" && (
            <Input
              label={t.amount}
              value={charge}
              onChange={(e) => setCharge(e.target.value)}
              suffix="SAR"
            />
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setAction(null)}>
              {t.cancel}
            </Button>
            <Button
              onClick={() => {
                if (action === "approve") decideChangeRequest(r.id, "approved");
                else
                  decideChangeRequest(
                    r.id,
                    "handled",
                    action === "less" ? Number(charge) || 0 : r.ceiling
                  );
                setAction(null);
              }}
            >
              {t.confirmCancellation}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
