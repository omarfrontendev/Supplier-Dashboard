import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock, XCircle } from "lucide-react";
import { PageHeader, PageShell, SectionCard, StatusPill } from "@/components/layout/page-shell";
import { Drawer } from "@/components/layout/overlay";
import { RequestDetailDrawer } from "@/components/hotels/request-detail";
import { detailFor, requestDetail } from "@/lib/request-detail-data";
import { AskHoteliana } from "@/components/system/ask-hoteliana";
import { usePortal } from "@/lib/portal-store";
import { notify } from "@/lib/notify";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fill, useLanguage } from "@/lib/i18n";
import {
  supplierRequests,
  type SupplierRequest,
  type SupplierRequestKind,
  type SupplierRequestState,
} from "@/lib/demo-data";
import { useRemoteData } from "@/lib/use-remote-data";
import { RowsSkeleton, StatsSkeleton } from "@/components/ui/skeletons";
import { useMetrics } from "@/api/modules/team/userMetrics";
import { useRequests } from "@/api/modules/requests/useRequests";
import { formatDate } from "./team.index";

export const Route = createFileRoute("/requests")({
  head: () => ({
    meta: [
      { title: "Requests · Hoteliana Supplier Portal" },
      {
        name: "description",
        content:
          "Follow every hotel access, new hotel, new room and company change request you sent to Hoteliana.",
      },
      { property: "og:title", content: "Requests · Hoteliana Supplier Portal" },
      {
        property: "og:description",
        content: "Request status, decisions and what Hoteliana still needs from you.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RequestsPage,
});

/** Needs you first, then the oldest waiting — the sort Figma UI 02.5 states. */
const STATE_ORDER: Record<SupplierRequestState, number> = {
  needsYou: 0,
  waiting: 1,
  rejected: 2,
  linked: 3,
  approved: 4,
};

function RequestsPage() {
  const { c, lang } = useLanguage();
  const r = c.requests;
  const navigate = useNavigate();
  const [openId, setOpenId] = useState<number | null>(null);
  /* OV 02.5B - a request pulled back, and the case opened instead. */
  const { withdrawnRequests, withdrawRequest } = usePortal();
  const [asking, setAsking] = useState<SupplierRequest | null>(null);
  const [filter, setFilter] = useState<SupplierRequestKind | "all">("all");
  const { loading } = useRemoteData(() => true);

  const items = useMemo(
    () =>
      [...supplierRequests]
        .filter((item) => !withdrawnRequests.includes(item.id))
        .sort((a, b) => STATE_ORDER[a.state] - STATE_ORDER[b.state]),
    [withdrawnRequests],
  );

  const visible = items.filter((item) => filter === "all" || item.kind === filter);

  const count = (state: SupplierRequestState) =>
    items.filter((item) => item.state === state).length;
  const kindCount = (kind: SupplierRequestKind) =>
    items.filter((item) => item.kind === kind).length;

  const kindLabel: Record<SupplierRequestKind, string> = {
    access: r.kindAccess,
    hotel: r.kindHotel,
    room: r.kindRoom,
    company: r.kindCompany,
  };

  /* UI 02.5 - amber is the one that needs you, red is the refusal, and
     waiting and linked are both quiet: neither is asking anything. */
  const stateTone = {
    pending: "neutral",
    submitted: "warning",
    approved: "success",
    // submitted: "neutral",
    rejected: "danger",
  } as const;

  const stateLabel = {
    pending: r.statePending,
    submitted: r.stateNeedsYou,
    approved: r.stateApproved,
    // submitted: r.stateLinked,
    rejected: r.stateNotApproved,
  } as const;

  const tabs = (
    [
      { key: "all", label: r.filterAll, count: items.length },
      { key: "access", label: r.filterAccess, count: kindCount("access") },
      { key: "hotel", label: r.filterHotels, count: kindCount("hotel") },
      { key: "room", label: r.filterRooms, count: kindCount("room") },
      // { key: "company", label: r.filterCompany, count: kindCount("company") },
    ] as Array<{ key: SupplierRequestKind | "all"; label: string; count: number }>
  ).filter((tab) => tab.key === "all" || tab.count > 0);

  const { data: metrics, isLoading: metricsLoading } = useMetrics();

  const { requests, meta, isLoading } = useRequests({
    type: filter,
    page: 1,
    limit: 100,
    // status: "approved",
  });

  const open = requests.find((item) => +item.id === Number(openId)) ?? null;
  const shape = open ? detailFor("access", open.status) : null;

  return (
    <PageShell>
      <PageHeader
        overline={r.overline}
        title={r.title}
        subtitle={r.subtitle}
        right={
          <Link to="/hotels">
            <Button variant="outline">{r.browseLibrary}</Button>
          </Link>
        }
      />

      <div className="scrollbar-none mb-5 flex max-w-full items-center gap-1 overflow-x-auto rounded-xl border border-border-subtle bg-surface-default p-1 shadow-card sm:w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={cn(
              "shrink-0 whitespace-nowrap rounded-lg px-4 py-2 text-sm transition-colors",
              filter === tab.key
                ? "bg-surface-inverse font-semibold text-text-inverse"
                : "font-medium text-text-secondary hover:text-text-primary",
            )}
          >
            {tab.label}
            <span className="font-data ms-2 text-xs opacity-70">{tab.count}</span>
          </button>
        ))}
      </div>

      {metricsLoading ? (
        <StatsSkeleton className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" />
      ) : (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat
            icon={<Clock className="h-4 w-4" aria-hidden="true" />}
            label={r.statWaiting}
            value={metrics?.hotelRequests[0]?.value}
            note={r.statWaitingNote}
          />
          <Stat
            icon={<AlertTriangle className="h-4 w-4" aria-hidden="true" />}
            label={r.statNeedsYou}
            value={metrics?.hotelRequests[1]?.value}
            note={r.statNeedsYouNote}
          />
          <Stat
            icon={<CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
            label={r.statApproved}
            /* The tile reads "linked or added", so a room the catalogue
               already had is counted here rather than nowhere. */
            value={metrics?.hotelRequests[2]?.value}
            note={r.statApprovedNote}
          />
          <Stat
            icon={<XCircle className="h-4 w-4" aria-hidden="true" />}
            label={r.statRejected}
            value={metrics?.hotelRequests[3]?.value}
            note={r.statRejectedNote}
          />
        </div>
      )}

      <SectionCard>
        {loading ? (
          <RowsSkeleton />
        ) : requests.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border-default p-10 text-center text-sm text-text-secondary">
            {r.empty}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-sm">
              <thead>
                <tr className="text-overline text-text-muted">
                  <th className="py-2 text-start font-semibold">{r.colRequest}</th>
                  <th className="py-2 text-start font-semibold">{r.colType}</th>
                  <th className="py-2 text-start font-semibold">{r.colWhat}</th>
                  <th className="py-2 text-start font-semibold">{r.colSent}</th>
                  <th className="py-2 text-start font-semibold">{r.colStatus}</th>
                  <th className="py-2 text-start font-semibold">{r.colUpdate}</th>
                  <th className="py-2 text-end font-semibold">{r.colAction}</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((item) => (
                  <tr key={item.id} className="border-t border-border-subtle align-middle">
                    <td className="font-data py-3 pe-3 text-text-primary">{"ACC-04830"}</td>
                    <td className="py-3 pe-3 text-text-secondary">{"Hotel access"}</td>
                    <td className="py-3 pe-3 text-text-primary">
                      {lang === "ar" ? item.hotel?.nameAr : item.hotel?.nameEn}
                    </td>
                    <td className="py-3 pe-3 text-text-secondary">
                      {/* {lang === "ar" ? item.sentAr : item.sent} */}
                      {formatDate(item.createdAt, lang)}
                    </td>
                    <td className="py-3 pe-3">
                      <StatusPill tone={stateTone[item.status]}>
                        {stateLabel[item.status]}
                      </StatusPill>
                    </td>
                    <td className="py-3 pe-3 text-text-secondary">
                      {formatDate(item.updatedAt, lang)}
                    </td>
                    <td className="py-3 text-end">
                      <Button variant="outline" size="sm" onClick={() => setOpenId(item.id)}>
                        {/* {lang === "ar" ? item.actionAr : item.action} */}
                        {lang === "en" ? "Open" : "فتح"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-4 text-xs text-text-muted">
          {fill(r.showing, { shown: visible.length, total: items.length })}
        </p>
      </SectionCard>

      <p className="mt-5 max-w-4xl text-xs leading-relaxed text-text-muted">
        {count("needsYou") === 0 ? r.emptyFooter : r.footer}
      </p>

      {/* OV 02.5B - 02.5F2 — the request, and what is left to do. */}
      {open && shape && (
        <RequestDetailDrawer
          request={open}
          overline={`${open.status} · ${"ACC-04830"}`}
          title={lang === "ar" ? open.hotel?.nameAr : open?.hotel?.nameEn}
          meta={formatDate(open.createdAt, lang)}
          shape={shape}
          onClose={() => setOpenId(null)}
          onPrimary={() => {
            setOpenId(null);
            /* The same button reads differently on each state, so what
               it does is read off the shape rather than the state. */
            if (shape.primary === requestDetail.withdraw) {
              withdrawRequest(`${open.id}`, `${open.hotelId}`);
              notify.success(r.withdrawn, { description: r.withdrawnNote });
              return;
            }
            if (open.status === "approved" && open.hotelId) {
              // cosnole.log("TEST")
              navigate({
                to: "/hotel/$hotelId",
                params: { hotelId: `${open.hotelId}` },
              });
            }
          }}
          onSecondary={(action) => {
            setOpenId(null);
            if (action === requestDetail.askHoteliana) setAsking(open);
            else if (action === requestDetail.withdrawShort) {
              withdrawRequest(open.id, open.hotelId);
              notify.success(r.withdrawn, { description: r.withdrawnNote });
            }
          }}
        />
      )}

      {/* A company change keeps the generic drawer; no frame draws it. */}
      {open && !shape && (
        <Drawer
          overline={kindLabel[filter]}
          title={lang === "ar" ? open.whatAr : open.what}
          meta={`${open.id} · ${lang === "ar" ? open.sentAr : open.sent}`}
          onClose={() => setOpenId(null)}
          footer={
            <>
              {open.state === "needsYou" && (
                <Link to="/request-changes">
                  <Button>{r.respond}</Button>
                </Link>
              )}
              <Button variant="outline" onClick={() => setOpenId(null)}>
                {c.common.close}
              </Button>
            </>
          }
        >
          <div className="space-y-5">
            <StatusPill tone={stateTone[open.state]}>{stateLabel[open.state]}</StatusPill>
            <p className="text-sm leading-relaxed text-text-secondary">
              {lang === "ar" ? open.updateAr : open.update}
            </p>
          </div>
        </Drawer>
      )}

      {asking && (
        <AskHoteliana
          from={`${kindLabel[asking.kind]} · ${
            lang === "ar" ? asking.whatAr : asking.what
          } · ${asking.id}`}
          /* The case carries the row it came from, not another
             screen's example. */
          attached={[
            [r.colWhat, lang === "ar" ? asking.whatAr : asking.what],
            [r.colRequest, asking.id],
            [r.colSent, lang === "ar" ? asking.sentAr : asking.sent],
            [r.colStatus, stateLabel[asking.state]],
          ]}
          onClose={() => setAsking(null)}
          onCreated={() => {
            setAsking(null);
            notify.success(r.caseOpened);
          }}
        />
      )}
    </PageShell>
  );
}

function Stat({
  icon,
  label,
  value,
  note,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | undefined;
  note: string;
}) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-default p-5 shadow-card">
      <div className="flex items-center gap-2 text-text-muted">
        {icon}
        <p className="text-overline">{label}</p>
      </div>
      <p className="font-data mt-3 text-3xl font-semibold text-text-primary">{value}</p>
      <p className="mt-1 text-xs text-text-muted">{note}</p>
    </div>
  );
}
