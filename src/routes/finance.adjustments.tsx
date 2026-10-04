/**
 * UI 07.33 — Adjustments. The entries Hoteliana raised for or against the
 * supplier, and BR-07-06's replacement for the old running balance: each row
 * says where it lands, not what the balance became.
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, PageShell, StatusPill } from "@/components/layout/page-shell";
import { Gated } from "@/components/system/permission-gate";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { money } from "@/lib/money";
import { adjustments, adjustmentsCopy } from "@/lib/finance-pages";
import { statementCopy } from "@/lib/statement-data";

export const Route = createFileRoute("/finance/adjustments")({
  head: () => ({
    meta: [
      { title: "Adjustments · Hoteliana Supplier Portal" },
      {
        name: "description",
        content: "Entries Hoteliana raised for or against you, and where each lands.",
      },
      { property: "og:title", content: "Adjustments · Hoteliana Supplier Portal" },
      {
        property: "og:description",
        content: "Finance entries, disputes and where each one is taken from.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdjustmentsPage,
});

function AdjustmentsPage() {
  const { lang } = useLanguage();
  const k = lang === "ar" ? ("ar" as const) : ("en" as const);
  const c = adjustmentsCopy;

  return (
    <PageShell>
      <PageHeader
        overline={statementCopy.overline[k]}
        title={c.title[k]}
        subtitle={c.subtitle[k]}
      />

      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-default">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead>
              <tr className="bg-surface-subtle text-overline text-text-muted">
                {[
                  c.colEntry[k],
                  c.colBooking[k],
                  c.colDate[k],
                  c.colAmount[k],
                  c.colWhere[k],
                  "",
                ].map((cell, index) => (
                  <th
                    key={`${cell}-${index}`}
                    className={`px-4 py-3 font-semibold ${
                      index === 5 ? "text-end" : "text-start"
                    }`}
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {adjustments.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-border-subtle align-top"
                >
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-text-primary">
                        {item.title[k]}
                      </p>
                      <StatusPill
                        tone={item.side === "against" ? "danger" : "success"}
                      >
                        {item.side === "against" ? c.against[k] : c.favour[k]}
                      </StatusPill>
                    </div>
                    <p className="mt-0.5 max-w-[420px] text-xs leading-5 text-text-muted">
                      {item.detail[k]}
                    </p>
                    <p className="mt-1 font-data text-[11px] text-text-muted">
                      {item.id}
                    </p>
                  </td>
                  <td className="px-4 py-3.5">
                    {item.booking ? (
                      <Link
                        to="/bookings/$bookingId"
                        params={{ bookingId: item.booking }}
                        className="font-data text-xs text-text-link hover:underline"
                      >
                        {item.booking}
                      </Link>
                    ) : (
                      <span className="text-xs text-text-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-text-secondary">
                    {item.date[k]}
                  </td>
                  <td className="px-4 py-3.5">
                    <b
                      className={`font-data text-sm ${
                        item.amount < 0
                          ? "text-status-danger"
                          : "text-text-primary"
                      }`}
                    >
                      {item.amount < 0 ? "−" : "+"}
                      {money(Math.abs(item.amount), lang)}
                    </b>
                  </td>
                  {/* BR-07-06 — where it lands, never a running balance. */}
                  <td className="px-4 py-3.5 text-xs text-text-secondary">
                    {item.takenFrom[k]}
                  </td>
                  <td className="px-4 py-3.5 text-end">
                    {item.state === "open" ? (
                      /* BR-07-40 — this is the entry's own dispute. */
                      <Gated permission="finance.dispute" instead={null}>
                        <Button size="sm" variant="outline">
                          {c.dispute[k]}
                        </Button>
                      </Gated>
                    ) : (
                      <StatusPill
                        tone={item.state === "disputed" ? "warning" : "neutral"}
                      >
                        {item.state === "disputed" ? c.disputed[k] : c.settled[k]}
                      </StatusPill>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 max-w-4xl text-xs leading-5 text-text-muted">
        {c.cannotRaise[k]}
      </p>
    </PageShell>
  );
}
