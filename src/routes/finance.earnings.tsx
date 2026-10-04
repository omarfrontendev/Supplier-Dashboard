/**
 * UI 07.21 — Earnings. Every booking, grouped by the payment term it is
 * actually on rather than the term the contract carries today.
 *
 * BR-07-11 is the reason that distinction matters: a booking snapshots its
 * payment term the moment it is confirmed, the way it snapshots its price.
 * Hoteliana changing a contract's term later leaves the old bookings where
 * they were, so this page shows each booking's own term, not the contract's.
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader, PageShell, StatusPill } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useLanguage } from "@/lib/i18n";
import { money } from "@/lib/money";
import { usePortal } from "@/lib/portal-store";
import { earningsCopy, termOf, type PaymentTerm } from "@/lib/finance-terms";
import { statementCopy } from "@/lib/statement-data";

export const Route = createFileRoute("/finance/earnings")({
  head: () => ({
    meta: [
      { title: "Earnings · Hoteliana Supplier Portal" },
      {
        name: "description",
        content:
          "Every booking and the payment term it was confirmed on, with what it earns.",
      },
      { property: "og:title", content: "Earnings · Hoteliana Supplier Portal" },
      {
        property: "og:description",
        content: "Bookings grouped by their own payment term.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EarningsPage,
});

const TERM_TONE: Record<PaymentTerm, "neutral" | "warning" | "success"> = {
  afterCheckout: "neutral",
  onArrival: "warning",
  onBooking: "success",
};

function EarningsPage() {
  const { lang } = useLanguage();
  const k = lang === "ar" ? ("ar" as const) : ("en" as const);
  const c = earningsCopy;
  const { bookings } = usePortal();
  const [term, setTerm] = useState<"all" | PaymentTerm>("all");

  const rows = useMemo(
    () =>
      bookings
        .filter((booking) => booking.status === "confirmed")
        .map((booking) => ({ booking, term: termOf(booking.id) }))
        .filter((row) => term === "all" || row.term === term),
    [bookings, term]
  );

  const total = rows.reduce((sum, row) => sum + row.booking.rate, 0);

  return (
    <PageShell>
      <PageHeader
        overline={statementCopy.overline[k]}
        title={c.title[k]}
        subtitle={c.subtitle[k]}
      />

      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div className="w-full max-w-[280px]">
          <Select
            label={c.termLabel[k]}
            value={term}
            onChange={(value) => setTerm(value as "all" | PaymentTerm)}
            searchable={false}
            options={[
              { value: "all", label: c.allTerms[k] },
              { value: "afterCheckout", label: c.afterCheckout[k] },
              { value: "onArrival", label: c.onArrival[k] },
              { value: "onBooking", label: c.onBooking[k] },
            ]}
          />
        </div>
        <p className="text-xs text-text-muted">
          {c.snapshotNote[k]}
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-default">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-sm">
            <thead>
              <tr className="bg-surface-subtle text-overline text-text-muted">
                {[c.colBooking[k], c.colHotel[k], c.colStay[k], c.colTerm[k], c.colAmount[k], ""].map(
                  (cell, index) => (
                    <th
                      key={`${cell}-${index}`}
                      className={`px-4 py-3 font-semibold ${
                        index === 5 ? "text-end" : "text-start"
                      }`}
                    >
                      {cell}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map(({ booking, term: own }) => (
                <tr key={booking.id} className="border-t border-border-subtle">
                  <td className="px-4 py-3.5">
                    <p className="font-data text-text-primary">{booking.id}</p>
                    <p className="mt-0.5 text-xs text-text-muted">
                      {k === "ar" ? booking.guestAr : booking.guest}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 text-text-secondary">
                    {k === "ar" ? booking.hotelAr : booking.hotel}
                  </td>
                  <td className="px-4 py-3.5 text-text-secondary">
                    {k === "ar" ? booking.stayAr : booking.stay}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusPill tone={TERM_TONE[own]}>{c[own][k]}</StatusPill>
                  </td>
                  <td className="px-4 py-3.5 font-data font-semibold text-text-primary">
                    {money(booking.rate, lang)}
                  </td>
                  <td className="px-4 py-3.5 text-end">
                    <Link to="/bookings/$bookingId" params={{ bookingId: booking.id }}>
                      <Button size="sm" variant="outline">
                        {c.open[k]}
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-t-2 border-border-default px-4 py-4">
          <p className="text-sm font-semibold text-text-primary">{c.total[k]}</p>
          <b className="font-data text-lg font-semibold text-text-primary">
            {money(total, lang)}
          </b>
        </div>
      </div>

      <p className="mt-4 max-w-4xl text-xs leading-5 text-text-muted">
        {c.termsNote[k]}
      </p>
    </PageShell>
  );
}
