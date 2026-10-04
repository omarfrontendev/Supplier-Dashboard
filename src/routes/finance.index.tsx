/**
 * UI 07.20 — Finance overview.
 *
 * Four tiles, then three cards, in the order a supplier asks: how much is
 * coming and when, how much is owed altogether, whether anything is owed
 * the other way, and what wants attention now.
 *
 * Its other states are 07.20H (payments paused), 07.20N (you owe
 * Hoteliana) and UI 11.18 (nothing due yet), reachable as `?state=`.
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, PauseCircle } from "lucide-react";
import { PayWhatYouOwe } from "@/components/finance/pay-what-you-owe";
import {
  Banner,
  PageShell,
  StatusPill,
} from "@/components/layout/page-shell";
import { Gated } from "@/components/system/permission-gate";
import { Button } from "@/components/ui/button";
import { arabicDigits } from "@/components/ui/date-field";
import { fill, useLanguage } from "@/lib/i18n";
import { money } from "@/lib/money";
import {
  contractTerms,
  overviewCopy,
  owedAmount,
  owedBooking,
  owedNextPayment,
  upcomingPayments,
  type PaymentRowState,
} from "@/lib/finance-overview-data";
import { statementCopy } from "@/lib/statement-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/finance/")({
  validateSearch: (
    search: Record<string, unknown>
  ): { state?: "paused" | "owed" | "nothing" } =>
    ["paused", "owed", "nothing"].includes(String(search["state"]))
      ? { state: search["state"] as never }
      : {},
  head: () => ({
    meta: [
      { title: "Finance overview · Hoteliana Supplier Portal" },
      {
        name: "description",
        content:
          "What Hoteliana pays you, when, and what needs your attention.",
      },
      {
        property: "og:title",
        content: "Finance overview · Hoteliana Supplier Portal",
      },
      {
        property: "og:description",
        content: "Next payments, what needs you, and how each contract pays.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FinanceOverview,
});

const STATE_TONE: Record<PaymentRowState, "info" | "success" | "neutral"> = {
  dueOnArrival: "info",
  scheduled: "success",
  building: "neutral",
};

/** The frame's tile: 16 padding, 12 radius, 10/22/11 type. */
function Tile({
  label,
  value,
  note,
  tint,
}: {
  label: string;
  value: string;
  note: string;
  /** Green for the next payment, amber for the statement waiting on you. */
  tint?: "next" | "review";
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border-subtle p-4",
        tint === "next"
          ? "bg-[#edffd6]"
          : tint === "review"
            ? "bg-[#fff1d6]"
            : "bg-surface-default"
      )}
    >
      <p className="text-[10px] font-semibold uppercase text-text-quiet">
        {label}
      </p>
      <p className="mt-0.5 text-[22px] font-semibold leading-tight text-text-primary">
        {value}
      </p>
      <p className="mt-0.5 text-[11px] leading-4 text-text-body">{note}</p>
    </div>
  );
}

/** Every card on this page: 20 padding, 16 radius, an overline and a title. */
function Card({
  overline,
  title,
  children,
}: {
  overline: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border-subtle bg-surface-default p-5">
      <p className="text-[10px] font-semibold uppercase text-text-quiet">
        {overline}
      </p>
      {title && (
        <h2 className="mt-3 text-base font-semibold text-text-primary">
          {title}
        </h2>
      )}
      <div className="mt-3">{children}</div>
    </section>
  );
}

/** The amber banner the NEEDS YOU card repeats. */
function Needs({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl bg-[#fff1d6] p-3.5 text-[#8a5a00]">
      <p className="text-[13px] font-semibold">{title}</p>
      <p className="mt-0.5 text-[12px] leading-5">{body}</p>
    </div>
  );
}

function FinanceOverview() {
  const { lang } = useLanguage();
  const k = lang === "ar" ? ("ar" as const) : ("en" as const);
  const ar = k === "ar";
  const { state } = Route.useSearch();
  const c = overviewCopy;

  const owed = state === "owed";
  /* OV 07.38 - the transfer details, for a supplier who would rather
     not wait for the next statement to take it. */
  const [paying, setPaying] = useState(false);
  const nothing = state === "nothing";
  const paused = state === "paused";
  const num = (value: number) =>
    value.toLocaleString(ar ? "ar-EG" : "en-US");

  return (
    <PageShell>
      {/* The frame's header: overline, title with a pill, one paragraph. */}
      <header className="mb-5 flex flex-wrap items-start gap-5">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.8px] text-text-quiet">
            {c.overline[k]}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h1 className="text-[26px] font-semibold leading-[34px] text-[#09241a]">
              {c.title[k]}
            </h1>
            <StatusPill tone="neutral">{c.nextPaymentPill[k]}</StatusPill>
          </div>
          <p className="mt-1 max-w-[820px] text-[13px] leading-5 text-text-body">
            {c.subtitle[k]}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link to="/finance/reports">
            <Button variant="outline">{c.reports[k]}</Button>
          </Link>
          <Gated permission="finance.export" instead={null}>
            <Button variant="outline">{c.export[k]}</Button>
          </Gated>
        </div>
      </header>

      {paused && (
        <Banner
          tone="warning"
          icon={<PauseCircle className="h-5 w-5" aria-hidden="true" />}
          title={statementCopy.pausedTitle[k]}
          body={statementCopy.pausedBody[k]}
        />
      )}
      {owed && (
        <>
          <Banner
            tone="warning"
            icon={<AlertTriangle className="h-5 w-5" aria-hidden="true" />}
            title={fill(statementCopy.owedTitle[k], {
              amount: money(owedAmount, lang),
            })}
            body={fill(statementCopy.owedBody[k], {
              booking: owedBooking,
              amount: money(owedAmount, lang),
              by: overviewCopy.owedBy[k],
            })}
          />
          <div className="mb-5">
            <Button variant="outline" onClick={() => setPaying(true)}>
              {c.howToPay[k]}
            </Button>
          </div>
        </>
      )}

      {nothing ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border-subtle bg-surface-default px-6 py-16 text-center">
          <p className="text-lg font-semibold text-text-primary">
            {statementCopy.nothingDueTitle[k]}
          </p>
          <p className="max-w-[460px] text-sm leading-6 text-text-secondary">
            {statementCopy.nothingDueBody[k]}
          </p>
          <Link to="/finance/statements">
            <Button variant="outline">{statementCopy.openStatements[k]}</Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Four tiles, 14px apart, the first and last tinted. */}
          <div className="mb-5 grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
            <Tile
              tint="next"
              label={c.nextPayment[k]}
              /* A debt smaller than the payment is subtracted from it;
                 only a paused account pays nothing at all. */
              value={
                paused ? num(0) : owed ? num(owedNextPayment) : num(18450)
              }
              note={owed ? c.nextPaymentNoteOwed[k] : c.nextPaymentNote[k]}
            />
            <Tile
              label={c.dueToYou[k]}
              value={num(31920)}
              note={c.dueToYouNote[k]}
            />
            <Tile
              label={c.youOwe[k]}
              value={num(owed ? owedAmount : 0)}
              note={owed ? c.youOweNoteOwed[k] : c.youOweNote[k]}
            />
            <Tile
              tint="review"
              label={c.toReview[k]}
              value={c.toReviewValue[k]}
              note={c.toReviewNote[k]}
            />
          </div>

          <div className="grid gap-5">
            <Card
              overline={c.needsYou[k]}
              title={fill(c.things[k], { n: arabicDigits(2, ar) })}
            >
              <div className="grid gap-3">
                <Needs
                  title={c.statementReady[k]}
                  body={c.statementReadyBody[k]}
                />
                <Needs
                  title={c.invoiceMissing[k]}
                  body={c.invoiceMissingBody[k]}
                />
                <div className="flex flex-wrap gap-2">
                  <Link
                    to="/finance/statements/$month"
                    params={{ month: "2026-09" }}
                  >
                    <Button>{c.reviewSeptember[k]}</Button>
                  </Link>
                  <Gated permission="statement.accept" instead={null}>
                    <Link to="/finance/tax-invoices">
                      <Button variant="outline">{c.uploadAugust[k]}</Button>
                    </Link>
                  </Gated>
                </div>
              </div>
            </Card>

            <Card overline={c.comingUp[k]} title={c.nextPayments[k]}>
              <div className="overflow-hidden rounded-xl border border-border-subtle">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] border-collapse text-sm">
                    <thead>
                      <tr className="bg-[#f8f9f7]">
                        {[
                          c.colDate[k],
                          c.colWhat[k],
                          c.colTerm[k],
                          c.colAmount[k],
                          c.colStatus[k],
                          "",
                        ].map((cell, index) => (
                          <th
                            key={`${cell}-${index}`}
                            className="px-4 py-3 text-start text-[10px] font-semibold uppercase text-text-quiet"
                          >
                            {cell}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingPayments.map((row) => (
                        <tr
                          key={row.what.en}
                          className="border-t border-border-subtle"
                        >
                          <td className="px-4 py-2 text-[12.5px] text-text-primary">
                            {row.date[k]}
                          </td>
                          <td className="px-4 py-2">
                            <p className="text-[12.5px] font-medium text-text-primary">
                              {row.what[k]}
                            </p>
                            <p className="mt-px text-[11px] text-text-body">
                              {row.detail[k]}
                            </p>
                          </td>
                          <td className="px-4 py-2 text-[12.5px] text-text-primary">
                            {row.term[k]}
                          </td>
                          <td className="px-4 py-2 text-[13px] font-semibold text-text-primary">
                            {money(row.amount, lang)}
                          </td>
                          <td className="px-4 py-2">
                            <StatusPill tone={STATE_TONE[row.state]}>
                              {c[row.state][k]}
                            </StatusPill>
                          </td>
                          <td className="px-4 py-2 text-end">
                            {row.month ? (
                              <Link
                                to="/finance/statements/$month"
                                params={{ month: row.month }}
                              >
                                <Button size="sm" variant="outline">
                                  {c.open[k]}
                                </Button>
                              </Link>
                            ) : row.bookingId ? (
                              <Link
                                to="/bookings/$bookingId"
                                params={{ bookingId: row.bookingId }}
                              >
                                <Button size="sm" variant="outline">
                                  {c.open[k]}
                                </Button>
                              </Link>
                            ) : (
                              <Link to="/finance/statements">
                                <Button size="sm" variant="outline">
                                  {c.open[k]}
                                </Button>
                              </Link>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="border-t border-border-subtle px-4 py-3 text-[12px] leading-5 text-text-body">
                  {c.termsFoot[k]}
                </p>
              </div>
            </Card>

            <Card overline={c.paymentTerms[k]} title={c.howPaid[k]}>
              <div>
                {contractTerms.map((row) => (
                  <div
                    key={row.contract.en}
                    className="flex flex-col gap-1 border-b border-border-subtle py-2 sm:flex-row sm:gap-3"
                  >
                    <p className="text-[12px] text-text-body sm:w-[200px] sm:shrink-0">
                      {row.contract[k]}
                    </p>
                    <p className="min-w-0 flex-1 text-[12.5px] font-medium text-text-primary">
                      {row.how[k]}
                    </p>
                  </div>
                ))}
                <div className="mt-3">
                  <Link to="/finance/bank">
                    <Button variant="outline">{c.allTerms[k]}</Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}

      {paying && <PayWhatYouOwe onClose={() => setPaying(false)} />}
    </PageShell>
  );
}
