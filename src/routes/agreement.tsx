import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  EyeOff,
  FileCheck2,
  FileText,
  Lock,
  Scale,
} from "lucide-react";
import {
  Banner,
  DataRow,
  PageHeader,
  PageShell,
  SectionCard,
  StatusPill,
} from "@/components/layout/page-shell";
import {
  IconModal,
  Modal,
  OverlaySummary,
  panelMotion,
  scrimMotion,
  useDismiss,
} from "@/components/layout/overlay";

import { Button } from "@/components/ui/button";
import { fill, useLanguage } from "@/lib/i18n";
import { useRemoteData } from "@/lib/use-remote-data";
import { RowsSkeleton } from "@/components/ui/skeletons";
import { notify } from "@/lib/notify";
import { usePortal } from "@/lib/portal-store";
import {
  agreementVersions,
  agreementHistory,
  companyRecord,
  type ComplianceDocument,
  complianceDocuments,
} from "@/lib/demo-data";
import { fieldLabel } from "@/lib/field-labels";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/agreement")({
  validateSearch: (
    search: Record<string, unknown>
  ): { state?: "new"; as?: "member" } => ({
    ...(search["state"] === "new" ? { state: "new" as const } : {}),
    ...(search["as"] === "member" ? { as: "member" as const } : {}),
  }),
  head: () => ({
    meta: [
      { title: "Company & agreement · Hoteliana Supplier Portal" },
      {
        name: "description",
        content:
          "Review the legal profile, compliance documents and commercial agreement Hoteliana holds for your company.",
      },
      {
        property: "og:title",
        content: "Company & agreement · Hoteliana Supplier Portal",
      },
      {
        property: "og:description",
        content: "Read-only supplier legal profile, compliance and agreement records.",
      },
    ],
  }),
  component: AgreementPage,
});

function AgreementPage() {
  const { c, lang } = useLanguage();
  const {
    agreementVersion,
    agreementSentToOwner,
    viewerIsOwner,
  } = usePortal();
  const [contractOpen, setContractOpen] = useState(false);
  /* OV 01.6B — Download PDF opens it straight from the agreement row. */
  const [downloadOpen, setDownloadOpen] = useState(false);
  /* UI 01.6 — the whole compliance row opens its document. */
  const [openDoc, setOpenDoc] = useState<string | null>(null);
  const [acceptOpen, setAcceptOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const { loading } = useRemoteData(() => companyRecord);

  const a = c.agreement;
  const version = agreementVersions[agreementVersion];
  // UI 01.6 is read only with v1.3 in force; UI 01.6N is the new-version state.
  const { state: agreementState, as: viewerParam } = Route.useSearch();
  const needsAcceptance = agreementVersion === "1.3" && agreementState === "new";

  const value = (id: string) =>
    companyRecord.find((field) => field.id === id)?.current ?? "";
  const locked = (id: string) =>
    Boolean(companyRecord.find((field) => field.id === id)?.lockedBy);

  return (
    <PageShell>
      <PageHeader
        overline={a.overline}
        title={a.title}
        subtitle={a.subtitle}
        right={
          <div className="flex flex-wrap items-center gap-3">
            <StatusPill tone="neutral">{c.common.readOnly}</StatusPill>
            <Link to="/request-changes">
              <Button size="sm">{a.strip.request}</Button>
            </Link>
          </div>
        }
      />

      {agreementVersion === "1.4" && (
        <Banner
          tone="success"
          icon={<CheckCircle2 className="h-5 w-5" aria-hidden="true" />}
          title={a.acceptedBanner}
        />
      )}

      {needsAcceptance && (
        <Banner
          tone="warning"
          icon={<Scale className="h-5 w-5" aria-hidden="true" />}
          title={a.newVersion.title}
          body={a.newVersion.body}
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAcceptOpen(true)}
            >
              {viewerIsOwner && viewerParam !== "member"
                ? a.newVersion.cta
                : a.newVersion.ctaOwnerOnly}
            </Button>
          }
        />
      )}

      <Banner
        tone="warning"
        icon={<Clock className="h-5 w-5" aria-hidden="true" />}
        title={a.pending.title}
        body={a.pending.body}
        action={
          <Link to="/requests">
            <Button variant="outline" size="sm">
              {a.pending.cta}
            </Button>
          </Link>
        }
      />

      {loading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border-subtle bg-surface-default p-6 shadow-card">
            <RowsSkeleton rows={9} />
          </div>
          <div className="rounded-2xl border border-border-subtle bg-surface-default p-6 shadow-card">
            <RowsSkeleton rows={5} />
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard
            icon={<Building2 className="h-4 w-4" aria-hidden="true" />}
            overline={a.company.overline}
            title={a.company.title}
          >
            <div>
              <DataRow label={a.company.legalName}>
                <span className="text-sm font-medium text-text-primary">
                  {value("legalName")}
                </span>
              </DataRow>
              <DataRow label={a.company.country}>
                <span className="text-sm text-text-primary">
                  {a.company.countryCity}
                </span>
              </DataRow>
              <DataRow label={a.company.phone}>
                <MaskedValue id="phone" />
                {locked("phone") && (
                  <StatusPill tone="warning">{a.changePending}</StatusPill>
                )}
              </DataRow>
              <DataRow label={a.company.email}>
                <span className="font-data text-sm text-text-primary">
                  {value("email")}
                </span>
              </DataRow>
              <DataRow label={a.company.owner}>
                {/* UI 01.6 prints the record's label here, not the person. */}
                <span className="text-sm text-text-primary">
                  {c.account.ownerValue}
                </span>
              </DataRow>
              <DataRow label={a.company.ownerContact}>
                <MaskedValue id="ownerPhone" />
                <span className="font-data text-sm text-text-primary">
                  · {value("ownerEmail")}
                </span>
              </DataRow>
              <DataRow label={a.supplier.ownerId}>
                <MaskedValue id="ownerId" />
              </DataRow>
              <DataRow label={a.supplier.iban}>
                <MaskedValue id="iban" />
                {locked("iban") && (
                  <StatusPill tone="warning">{a.changePending}</StatusPill>
                )}
              </DataRow>
              <DataRow label={a.supplier.guarantee}>
                <span className="text-sm text-text-muted">
                  {a.supplier.guaranteeValue}
                </span>
              </DataRow>
            </div>
          </SectionCard>

          <SectionCard
            icon={<FileCheck2 className="h-4 w-4" aria-hidden="true" />}
            overline={a.documents.overline}
            title={a.documents.title}
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-sm">
                <thead>
                  <tr className="text-overline text-text-muted">
                    <th className="py-2 text-start font-semibold">
                      {a.documents.document}
                    </th>
                    <th className="py-2 text-start font-semibold">
                      {a.documents.issued}
                    </th>
                    <th className="py-2 text-start font-semibold">
                      {a.documents.expires}
                    </th>
                    <th className="py-2 text-start font-semibold">
                      {a.documents.status}
                    </th>
                    <th className="py-2 text-end font-semibold" />
                  </tr>
                </thead>
                <tbody>
                  {complianceDocuments.map((doc) => (
                    <tr
                      key={doc.id}
                      onClick={() => setOpenDoc(doc.id)}
                      className="cursor-pointer border-t border-border-subtle align-middle transition-colors hover:bg-surface-subtle"
                    >
                      <td className="py-3 pe-3 text-text-primary">
                        {fieldLabel(c, doc.id)}
                      </td>
                      <td className="font-data py-3 pe-3 text-text-secondary">
                        {doc.issued}
                      </td>
                      <td className="font-data py-3 pe-3 text-text-secondary">
                        {lang === "ar" ? doc.expiresAr : doc.expires}
                      </td>
                      <td className="py-3 pe-3">
                        <StatusPill
                          tone={doc.status === "valid" ? "success" : "warning"}
                        >
                          {doc.status === "valid"
                            ? a.documents.valid
                            : a.documents.expiring}
                        </StatusPill>
                      </td>
                      <td className="py-3 text-end">
                        <DocumentValue
                          doc={doc}
                          name={value(doc.id)}
                          label={a.documents.view}
                          open={openDoc === doc.id}
                          onOpenChange={(next) =>
                            setOpenDoc(next ? doc.id : null)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-text-muted">
              {a.documents.note}
            </p>
          </SectionCard>
        </div>
      )}

      <div className="mt-6">
        <SectionCard
          icon={<Scale className="h-4 w-4" aria-hidden="true" />}
          overline={a.contract.overline}
          title={fill(a.contract.title, { version: version.version })}
          right={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setHistoryOpen(true)}
            >
              {a.contract.history}
            </Button>
          }
        >
          <div className="grid gap-x-8 sm:grid-cols-2">
            <div>
              <DataRow label={a.contract.term}>
                <span className="font-data text-sm text-text-primary">
                  {version.term}
                </span>
              </DataRow>
              <DataRow label={a.contract.model}>
                <span className="text-sm text-text-primary">
                  {lang === "ar" ? version.modelAr : version.model}
                </span>
              </DataRow>
              <DataRow label={a.contract.settlement}>
                <span className="text-sm text-text-primary">
                  {lang === "ar" ? version.settlementAr : version.settlement}
                </span>
              </DataRow>
              <DataRow label={a.contract.currency}>
                <span className="font-data text-sm text-text-primary">
                  {version.currency}
                </span>
              </DataRow>
              {/* UI 01.6 — the file, then Preview and Download PDF. */}
              <DataRow label={a.contract.file}>
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-data text-sm text-text-primary">
                    {version.file}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setContractOpen(true)}
                  >
                    {c.common.preview}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDownloadOpen(true)}
                  >
                    {c.common.downloadPdf}
                  </Button>
                </div>
              </DataRow>
            </div>
            <div>
              <DataRow label={a.contract.acceptedBy}>
                <span className="text-sm text-text-primary">
                  {lang === "ar" ? version.acceptedByAr : version.acceptedBy}
                </span>
              </DataRow>
              <DataRow label={a.contract.acceptedAt}>
                <span className="font-data text-sm text-text-primary">
                  {version.acceptedAt}
                </span>
              </DataRow>
              <DataRow label={a.contract.record}>
                <span className="text-sm text-text-secondary">
                  {a.contract.recordValue}
                </span>
              </DataRow>
              <DataRow label={a.contract.previous}>
                <span className="font-data text-sm text-text-secondary">
                  {version.previous}
                </span>
              </DataRow>
            </div>
          </div>

          <div className="mt-4 flex gap-3 rounded-xl border border-border-subtle bg-surface-subtle p-4">
            <Lock
              className="mt-0.5 h-4 w-4 shrink-0 text-text-muted"
              aria-hidden="true"
            />
            <p className="text-xs leading-relaxed text-text-secondary">
              {a.contract.note}
            </p>
          </div>
        </SectionCard>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl border border-border-subtle bg-surface-default p-5 shadow-card">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-text-primary">
            {a.strip.title}
          </p>
          <p className="mt-1 text-sm text-text-secondary">{a.strip.body}</p>
        </div>
        <Link to="/requests">
          <Button variant="outline">{a.strip.view}</Button>
        </Link>
        <Link to="/request-changes">
          <Button>{a.strip.request}</Button>
        </Link>
        <Link to="/hotels">
          <Button variant="secondary">{c.common.continueToLibrary}</Button>
        </Link>
      </div>

      {contractOpen && <ContractModal onClose={() => setContractOpen(false)} />}
      {downloadOpen && <DownloadModal onClose={() => setDownloadOpen(false)} />}
      {historyOpen && <HistoryModal onClose={() => setHistoryOpen(false)} />}

      {acceptOpen && (
        <AcceptVersionModal
          isOwner={viewerIsOwner && viewerParam !== "member"}
          sent={agreementSentToOwner}
          onClose={() => setAcceptOpen(false)}
        />
      )}
    </PageShell>
  );
}

/**
 * OV 01.6L / L1 / L3 / L4 — accepting v1.4. Acceptance unlocks only after the
 * document is opened, and only the account Owner can bind the company.
 */
function AcceptVersionModal({
  sent,
  onClose,
  isOwner,
}: {
  sent: boolean;
  onClose: () => void;
  isOwner: boolean;
}) {
  const { c } = useLanguage();
  const { acceptAgreement, sendAgreementToOwner } = usePortal();
  const viewerIsOwner = isOwner;
  const t = c.agreement.accept;
  const [opened, setOpened] = useState(false);
  /* OV 01.6A-L — the document opens over the sheet, and closing it is
     what counts as having read it. */
  const [reading, setReading] = useState(false);
  const [sentNow, setSentNow] = useState(sent);

  const title = !viewerIsOwner
    ? sentNow
      ? t.titleSent
      : t.titleOwnerOnly
    : t.title;

  return (
    <Modal
      overline={t.overline}
      title={title}
      meta={t.meta}
      onClose={onClose}
      footer={
        !viewerIsOwner ? (
          sentNow ? (
            <Button onClick={onClose}>{t.done}</Button>
          ) : (
            <>
              <Button variant="ghost" onClick={onClose}>
                {c.common.close}
              </Button>
              <Button
                onClick={() => {
                  sendAgreementToOwner();
                  setSentNow(true);
                  notify.success(t.sentToast);
                }}
              >
                {t.sendToOwner}
              </Button>
            </>
          )
        ) : (
          <>
            <Button variant="ghost" onClick={onClose}>
              {t.later}
            </Button>
            <Button
              disabled={!opened}
              onClick={() => {
                acceptAgreement();
                notify.success(t.accepted);
                onClose();
              }}
            >
              {t.submit}
            </Button>
          </>
        )
      }
    >
      <div className="space-y-5">
        <div>
          <p className="text-overline text-text-muted">{t.changedOverline}</p>
          <ul className="mt-2 space-y-2">
            {t.changes.map((change) => (
              <li
                key={change}
                className="flex gap-2 text-sm leading-relaxed text-text-secondary"
              >
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                  aria-hidden="true"
                />
                {change}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border-subtle bg-surface-subtle p-4">
          <FileText className="h-5 w-5 text-text-muted" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="font-data truncate text-sm text-text-primary">
              {t.file}
            </p>
            <p className="mt-0.5 text-xs text-text-muted">
              {opened ? t.pagesOpened : viewerIsOwner ? t.pages : t.pagesHash}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setReading(true)}
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
            {t.read}
          </Button>
        </div>

        <p className="text-sm leading-relaxed text-text-secondary">
          {!viewerIsOwner ? (sentNow ? t.sent : t.ownerOnly) : t.declaration}
        </p>

        {viewerIsOwner && !opened && (
          <div className="flex gap-2 rounded-xl border border-status-warning/25 bg-status-warning-bg p-3.5">
            <Lock
              className="mt-0.5 h-4 w-4 shrink-0 text-status-warning"
              aria-hidden="true"
            />
            <p className="text-[13px] leading-[1.5] text-text-secondary">
              {t.gate}
            </p>
          </div>
        )}
      </div>

      {/* OV 01.6A-L — closing the document is what counts as reading it. */}
      {reading && (
        <ContractModal
          onClose={() => {
            setReading(false);
            setOpened(true);
          }}
        />
      )}
    </Modal>
  );
}

function MaskedValue({ id }: { id: string }) {
  const { c } = useLanguage();
  const [revealed, setRevealed] = useState(false);
  const field = companyRecord.find((f) => f.id === id);
  if (!field) return null;

  return (
    <>
      <span className="font-data text-sm text-text-primary">
        {revealed ? field.current : (field.masked ?? field.current)}
      </span>
      {/* UI 01.6 — the row ends in an eye, not in a word. */}
      <button
        type="button"
        onClick={() => setRevealed((prev) => !prev)}
        aria-label={revealed ? c.common.hide : c.common.reveal}
        title={revealed ? c.common.hide : c.common.reveal}
        className="order-last ms-auto shrink-0 rounded-md p-1 text-text-muted transition-colors hover:bg-surface-subtle hover:text-text-primary"
      >
        {revealed ? (
          <EyeOff className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Eye className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    </>
  );
}

/** OV 01.6M — every version, newest first, with who accepted it. */
function HistoryModal({ onClose }: { onClose: () => void }) {
  const { c, lang } = useLanguage();
  const ar = lang === "ar";
  const h = c.agreement.history;
  return (
    <Modal
      overline={h.overline}
      title={h.title}
      meta={h.body}
      onClose={onClose}
      footer={<Button onClick={onClose}>{c.common.close}</Button>}
    >
      <div className="space-y-3">
        {agreementHistory.map((entry) => (
          <div
            key={entry.version}
            className="rounded-xl border border-border-subtle p-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <b className="font-data text-sm text-text-primary">
                {entry.version}
              </b>
              <StatusPill
                tone={
                  entry.state === "active"
                    ? "success"
                    : entry.state === "waiting"
                      ? "warning"
                      : "neutral"
                }
              >
                {h[entry.state]}
              </StatusPill>
            </div>
            <p className="mt-2 text-xs leading-5 text-text-secondary">
              {ar ? entry.publishedAr : entry.published}
            </p>
            <p className="mt-1 text-xs leading-5 text-text-muted">
              {ar ? entry.acceptedAr : entry.accepted}
            </p>
          </div>
        ))}
      </div>
    </Modal>
  );
}

function DocumentValue({
  doc,
  name,
  label: action,
  open: openProp,
  onOpenChange,
}: {
  doc: ComplianceDocument;
  name: string;
  /** UI 01.6 — the compliance table says "View"; elsewhere it previews. */
  label?: string;
  /** Set when the whole row opens it, the way the prototype does. */
  open?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
}) {
  const { c, lang } = useLanguage();
  const ar = lang === "ar";
  const a = c.agreement;
  const v = c.docViewer;
  const [openLocal, setOpenLocal] = useState(false);
  const open = openProp ?? openLocal;
  const setOpen = onOpenChange ?? setOpenLocal;
  const label = fieldLabel(c, doc.id);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-text-link hover:underline"
      >
        {!action && <Eye className="h-3.5 w-3.5" aria-hidden="true" />}
        {action ?? c.common.preview}
      </button>

      {open && (
        <Modal
          overline={v.overline}
          title={label}
          meta={ar ? doc.issuerAr : doc.issuer}
          onClose={() => setOpen(false)}
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                {c.common.close}
              </Button>
              <Link to="/request-changes">
                <Button>{v.requestReplacement}</Button>
              </Link>
            </>
          }
        >
          {/* OV 01.6 — the dates and the status, then the file itself. */}
          <div className="grid gap-3 sm:grid-cols-3">
            {(
              [
                [v.issueDate, ar ? doc.issuedFullAr : doc.issuedFull],
                [v.expiryDate, ar ? doc.expiresFullAr : doc.expiresFull],
              ] as Array<[string, string]>
            ).map(([head, text]) => (
              <div key={head} className="rounded-xl bg-surface-subtle p-3.5">
                <p className="text-overline text-text-muted">{head}</p>
                <p className="font-data mt-1 text-sm text-text-primary">{text}</p>
              </div>
            ))}
            <div className="rounded-xl bg-surface-subtle p-3.5">
              <p className="text-overline text-text-muted">{v.statusLabel}</p>
              <StatusPill
                className="mt-1"
                tone={doc.status === "expiring" ? "warning" : "success"}
              >
                {doc.status === "expiring" ? v.expiring : v.valid}
              </StatusPill>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-border-subtle p-4">
            <p className="font-data text-sm font-semibold text-text-primary">
              {name}
            </p>
            <p className="mt-1 text-xs leading-5 text-text-secondary">{v.body}</p>
            <p className="text-overline mt-3 text-text-muted">{v.currentFile}</p>
          </div>

          <p className="mt-4 text-xs leading-5 text-text-muted">
            {doc.status === "expiring"
              ? fill(v.expiryNote, {
                  date: ar ? doc.expiresFullAr : doc.expiresFull,
                })
              : v.viewOnly}
          </p>
        </Modal>
      )}
    </>
  );
}

/** OV 01.6A / 01.6A2 — the agreement summary, drawn as the two pages of the file. */
function ContractModal({ onClose }: { onClose: () => void }) {
  const { c, dir } = useLanguage();
  const m = c.agreement.contractModal;
  const [page, setPage] = useState(1);
  const [downloaded, setDownloaded] = useState(false);

  const sheets = [
    {
      overline: m.summaryOverline,
      rows: [
        [m.reference, m.referenceValue],
        [m.term, m.termValue],
        [m.model, m.modelValue],
        [m.currency, m.currencyValue],
        [m.settlement, m.settlementValue],
      ],
    },
    {
      overline: m.clausesOverline,
      rows: [
        [m.noShow, m.noShowValue],
        [m.parity, m.parityValue],
        [m.stopSell, m.stopSellValue],
        [m.disputes, m.disputesValue],
        [m.law, m.lawValue],
      ],
    },
  ];
  const sheet = sheets[page - 1] ?? sheets[0]!;
  const rtl = dir === "rtl";
  const Back = rtl ? ChevronRight : ChevronLeft;
  const Forward = rtl ? ChevronLeft : ChevronRight;
  const dismiss = useDismiss({ onClose });

  if (downloaded) {
    return <DownloadModal onClose={() => setDownloaded(false)} />;
  }

  return (
    <div
      dir={dir}
      {...dismiss.scrim}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-brand-deep/40 p-4",
        scrimMotion
      )}
    >
      <div
        {...dismiss.panel}
        className={cn(
          "flex w-full max-w-[920px] flex-col gap-[14px] rounded-[16px] bg-surface-default px-6 py-[22px] shadow-overlay",
          panelMotion
        )}
      >
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            <p className="text-overline text-brand-deep">{m.overline}</p>
            <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
              {m.file}
            </h2>
            <p className="text-[13px] leading-5 text-text-secondary">
              {m.meta}
              <br />
              <button
                type="button"
                onClick={() => setDownloaded(true)}
                className="hover:underline"
              >
                {m.download}
              </button>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={c.common.close}
            className="shrink-0 rounded-lg bg-surface-subtle px-2.5 py-1.5 text-xs font-medium text-text-primary transition-colors hover:bg-border-subtle"
          >
            ✕
          </button>
        </div>

        {/* The file itself, one printed page at a time. */}
        <div className="rounded-xl border border-border-subtle bg-surface-subtle p-6">
          <div className="mx-auto w-full max-w-[600px] space-y-2.5 rounded-[4px] border border-border-default bg-surface-default px-9 py-8">
            <p className="text-overline text-brand-deep">{sheet.overline}</p>
            <p className="text-[15px] font-semibold text-text-primary">
              {m.party}
            </p>
            {sheet.rows.map(([label, value]) => (
              <div
                key={label}
                className="flex items-center gap-3 border-b border-border-subtle py-[9px]"
              >
                <span className="w-40 shrink-0 text-xs text-text-muted">
                  {label}
                </span>
                <span className="text-[12.5px] font-medium text-text-primary">
                  {value}
                </span>
              </div>
            ))}
            <p className="text-[11.5px] leading-[17px] text-text-muted">
              {m.note}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2.5">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage(1)}
            aria-label={m.prevPage}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border-default text-brand-deep transition-colors enabled:hover:bg-surface-subtle disabled:text-text-muted disabled:opacity-60"
          >
            <Back className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <span className="text-[12.5px] font-medium text-text-body">
            {fill(m.pager, { page, total: sheets.length })}
          </span>
          <button
            type="button"
            disabled={page === sheets.length}
            onClick={() => setPage(sheets.length)}
            aria-label={m.nextPage}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border-default text-brand-deep transition-colors enabled:hover:bg-surface-subtle disabled:text-text-muted disabled:opacity-60"
          >
            <Forward className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

/** OV 01.6B — what the portal says once the file is on its way down. */
function DownloadModal({ onClose }: { onClose: () => void }) {
  const { c } = useLanguage();
  const d = c.agreement.download;

  return (
    <IconModal
      icon={<FileText className="h-5 w-5" aria-hidden="true" />}
      overline={d.overline}
      title={d.title}
      body={d.body}
      onClose={onClose}
      footer={<Button onClick={onClose}>{d.done}</Button>}
    >
      <OverlaySummary>
        {[
          [d.fileLabel, d.fileValue],
          [d.sizeLabel, d.sizeValue],
          [d.statusLabel, d.statusValue],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center gap-2.5">
            <span className="w-[70px] shrink-0 text-xs text-text-muted">
              {label}
            </span>
            <span className="text-[12.5px] font-medium text-text-primary">
              {value}
            </span>
          </div>
        ))}
      </OverlaySummary>
    </IconModal>
  );
}
