/**
 * UI 07.32 / 07.32R / 07.32E — Finance / Payments.
 *
 * Every transfer Hoteliana made, and what each one covered. The frame
 * leads with three tiles because the three questions a supplier actually
 * opens this page with are: how much this year, when was the last one, and
 * when is the next - and only the third of those is not already known.
 *
 * BR-07-17 moves a payment that lands on a Friday, Saturday or a bank
 * holiday *backwards* to the last working day, never later, so a date here
 * is the date it left, not the date it was scheduled for.
 *
 * UI 07.32R is the one that matters: a transfer the bank sent back is
 * still on the list, because it happened, and marked, because it is not
 * money you have. The banner asks for the one thing that fixes it.
 */

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, PageShell, StatusPill } from "@/components/layout/page-shell";
import { Gated } from "@/components/system/permission-gate";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { downloadText } from "@/lib/download";
import { RemittanceAdvice } from "@/components/finance/remittance-advice";
import { financePayments, financeTotals } from "@/lib/finance-data";
import { fill, useLanguage } from "@/lib/i18n";
import { paymentsCopy } from "@/lib/payments-copy";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/finance/payments/")({
  /*
   * 07.32R and 07.32E are states a server produces, reachable as ?state=.
   * ?advice= opens OV 07.11 on one payment, which is also where an old
   * UI 07.6 link lands - BR-07-05 sends a removed screen's links to the
   * page that replaced it, and a payment's own page is now its advice.
   */
  validateSearch: (
    search: Record<string, unknown>
  ): { state?: string; advice?: string } => ({
    ...(typeof search["state"] === "string" ? { state: search["state"] } : {}),
    ...(typeof search["advice"] === "string"
      ? { advice: search["advice"] }
      : {}),
  }),
  head: () => ({
    meta: [
      { title: "Payments · Hoteliana Supplier Portal" },
      {
        name: "description",
        content: "Every transfer Hoteliana made to you and what it covered.",
      },
      { property: "og:title", content: "Payments · Hoteliana Supplier Portal" },
      {
        property: "og:description",
        content: "Every transfer Hoteliana made to you and what it covered.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PaymentsPage,
});

function PaymentsPage() {
  const { lang } = useLanguage();
  const k = lang === "ar" ? ("ar" as const) : ("en" as const);
  const ar = k === "ar";
  const c = paymentsCopy;
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/finance/payments" });
  const returned = search.state === "returned";
  /* BR-07-51 - the account was put right and the same money went again. */
  const repaid = search.state === "repaid";
  const empty = search.state === "empty";

  const [period, setPeriod] = useState("2026");
  const [hotel, setHotel] = useState("all");

  const n = (value: number) => value.toLocaleString(ar ? "ar-EG" : "en-US");
  /*
   * The returned transfer is only on the list once it has come back, and
   * the re-payment only once the new account has been verified - so the
   * ordinary list carries neither.
   */
  const rows = empty
    ? []
    : financePayments.filter((payment) =>
        payment.rePaymentOf
          ? repaid
          : payment.returned
            ? returned || repaid
            : true
      );
  const advice = rows.find((payment) => payment.id === search.advice);
  const closeAdvice = () =>
    void navigate({
      search: (old: { state?: string }) =>
        old.state ? { state: old.state } : {},
    });

  const tiles: Array<{
    label: string;
    value: string;
    note: string;
    tint?: boolean;
  }> = [
    {
      /* The returned transfer was never money; the re-payment is. */
      label: c.paidThisYear[k],
      value: empty
        ? n(0)
        : n(repaid ? financeTotals.paid + 18450 : financeTotals.paid),
      note: empty
        ? c.noPaymentsYetNote[k]
        : fill(c.paymentsCount[k], { n: n(repaid ? 17 : 16) }),
      tint: true,
    },
    {
      label: c.lastPayment[k],
      value: empty ? c.dash[k] : n(repaid ? 18450 : 21300),
      note: empty
        ? c.noPaymentYet[k]
        : repaid
          ? c.lastPaymentRepaid[k]
          : c.lastPaymentNote[k],
    },
    {
      label: c.nextPayment[k],
      value: empty ? c.dash[k] : n(4800),
      note: empty ? c.nothingScheduled[k] : c.nextPaymentNote[k],
    },
  ];

  return (
    <PageShell>
      <PageHeader
        overline={c.overline[k]}
        title={c.title[k]}
        subtitle={c.subtitle[k]}
        right={
          <Gated permission="finance.export" instead={null}>
            <Button
              variant="outline"
              disabled={empty}
              reason={empty ? c.emptyTitle[k] : undefined}
              onClick={() =>
                downloadText(
                  "hoteliana-payments.csv",
                  rows
                    .map((p) => `${p.id},${p.paidOn},${p.amount}`)
                    .join("\n")
                )
              }
            >
              {c.export[k]}
            </Button>
          </Gated>
        }
      />

      {/* UI 07.32R - the bank sent one back, and only one thing fixes it. */}
      {returned && (
        <section className="mb-5">
          <div className="rounded-xl bg-[#fbe7e3] p-4">
            <p className="text-[12.5px] font-semibold text-status-danger">
              {c.cameBackTitle[k]}
            </p>
            <p className="mt-0.5 text-[12px] leading-5 text-status-danger">
              {c.cameBackBody[k]}
            </p>
          </div>
          <div className="mt-3">
            <Gated permission="bank.change" instead={null}>
              <Link to="/finance/bank">
                <Button>{c.updateBank[k]}</Button>
              </Link>
            </Gated>
          </div>
        </section>
      )}

      {/* BR-07-51 - it came back, it was fixed, and it went again. */}
      {repaid && (
        <div className="mb-5 rounded-xl bg-[#edffd6] p-4">
          <p className="text-[12.5px] font-semibold text-text-primary">
            {c.sentAgainTitle[k]}
          </p>
          <p className="mt-0.5 text-[12px] leading-5 text-text-body">
            {c.sentAgainBody[k]}
          </p>
        </div>
      )}

      <div className="mb-5 grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className={cn(
              "rounded-2xl border p-5",
              tile.tint
                ? "border-transparent bg-[#edffd6]"
                : "border-border-subtle bg-surface-default"
            )}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.04em] text-text-quiet">
              {tile.label}
            </p>
            <p className="mt-1.5 text-[26px] font-semibold leading-8 text-text-primary">
              {tile.value}
            </p>
            <p className="mt-0.5 text-[11.5px] text-text-body">{tile.note}</p>
          </div>
        ))}
      </div>

      {/* BR-07-04 - the filters change what is listed, never what is owed. */}
      <div className="mb-5 grid max-w-[520px] gap-3 sm:grid-cols-2">
        <Select
          label={c.period[k]}
          value={period}
          onChange={setPeriod}
          searchable={false}
          options={[{ value: "2026", label: ar ? "٢٠٢٦" : "2026" }]}
        />
        <Select
          label={c.hotel[k]}
          value={hotel}
          onChange={setHotel}
          searchable={false}
          options={[{ value: "all", label: c.allHotels[k] }]}
        />
      </div>

      {/* UI 07.32E - nothing has been paid yet, which is not a failure. */}
      {rows.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-border-subtle bg-surface-default px-6 py-12 text-center">
          <p className="text-[15px] font-semibold text-text-primary">
            {c.emptyTitle[k]}
          </p>
          <p className="max-w-[560px] text-[12.5px] leading-5 text-text-body">
            {c.emptyBody[k]}
          </p>
          <Link className="mt-2" to="/finance/bank">
            <Button variant="outline">{c.seeTerms[k]}</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-default">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px] border-collapse text-sm">
                <thead>
                  <tr className="bg-[#f8f9f7]">
                    {[
                      c.colPayment[k],
                      c.colPaidOn[k],
                      c.colCovers[k],
                      c.colAmount[k],
                      c.colBankRef[k],
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
                  {rows.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-t border-border-subtle align-middle"
                    >
                      <td className="px-4 py-3.5 text-[12.5px] text-text-primary">
                        {payment.id}
                      </td>
                      <td className="px-4 py-3.5 text-[12.5px] text-text-primary">
                        {ar ? payment.paidOnAr : payment.paidOn}
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-[12.5px] font-medium text-text-primary">
                          {payment.rePaymentOf
                            ? fill(c.rePaymentOf[k], {
                                id: payment.rePaymentOf,
                              })
                            : ar
                              ? payment.coversAr
                              : payment.covers}
                        </p>
                        <p className="mt-px text-[11px] text-text-body">
                          {payment.rePaymentOf
                            ? `${ar ? payment.coversAr : payment.covers} · ${ar ? payment.coversSubAr : payment.coversSub}`
                            : ar
                              ? payment.coversSubAr
                              : payment.coversSub}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 text-[13px] font-semibold text-text-primary">
                        {n(payment.amount)} {ar ? "ر.س" : "SAR"}
                      </td>
                      <td className="px-4 py-3.5 text-[12.5px] text-text-secondary">
                        {payment.bankReference}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap items-center justify-end gap-2.5">
                          {payment.returned && (
                            <StatusPill tone="danger">
                              {c.returned[k]}
                            </StatusPill>
                          )}
                          {payment.rePaymentOf && (
                            <StatusPill tone="success">{c.paid[k]}</StatusPill>
                          )}
                          {/* Step 11 - the advice is what a payment opens. */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              void navigate({
                                search: (old: { state?: string }) => ({
                                  ...(old.state ? { state: old.state } : {}),
                                  advice: payment.id,
                                }),
                              })
                            }
                          >
                            {c.remittance[k]}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-3 text-[11.5px] text-text-quiet">
            {fill(c.footer[k], {
              shown: n(rows.length),
              total: n(repaid ? 17 : 16),
              bank: repaid ? c.bankNew[k] : c.bank[k],
            })}
          </p>
        </>
      )}

      {advice && (
        <RemittanceAdvice payment={advice} onClose={closeAdvice} />
      )}
    </PageShell>
  );
}
