/**
 * UI 07.34 — Tax invoices. One per statement, plus one a month for the
 * bookings paid on booking or on arrival (BR-07-46).
 *
 * The rule the page exists to make obvious is BR-07-45: a missing invoice,
 * or one that differs, **never holds the payment up**. It is chased, and the
 * difference is noted and followed by hand, and the money still moves.
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { Upload } from "lucide-react";
import { PageHeader, PageShell, StatusPill } from "@/components/layout/page-shell";
import { Gated } from "@/components/system/permission-gate";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { invoicesCopy } from "@/lib/finance-pages";
import { statementCopy, statements } from "@/lib/statement-data";

export const Route = createFileRoute("/finance/tax-invoices")({
  head: () => ({
    meta: [
      { title: "Tax invoices · Hoteliana Supplier Portal" },
      {
        name: "description",
        content: "One tax invoice per statement, and one for the daily runs.",
      },
      { property: "og:title", content: "Tax invoices · Hoteliana Supplier Portal" },
      {
        property: "og:description",
        content: "Upload and replace the monthly tax invoices.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: InvoicesPage,
});

function InvoicesPage() {
  const { lang } = useLanguage();
  const k = lang === "ar" ? ("ar" as const) : ("en" as const);
  const c = invoicesCopy;

  return (
    <PageShell>
      <PageHeader
        overline={statementCopy.overline[k]}
        title={c.title[k]}
        subtitle={c.subtitle[k]}
      />

      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-default">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] border-collapse text-sm">
            <thead>
              <tr className="bg-surface-subtle text-overline text-text-muted">
                {[c.colPeriod[k], c.colCovers[k], c.colInvoice[k], c.colState[k], ""].map(
                  (cell, index) => (
                    <th
                      key={`${cell}-${index}`}
                      className={`px-4 py-3 font-semibold ${
                        index === 4 ? "text-end" : "text-start"
                      }`}
                    >
                      {cell}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {statements.map((statement) => {
                const invoice = statement.invoice;
                /* BR-07-47 — uploading waits for the statement to be final. */
                const final = statement.state !== "open";
                return (
                  <tr
                    key={statement.month}
                    className="border-t border-border-subtle"
                  >
                    <td className="px-4 py-3.5">
                      <Link
                        to="/finance/statements/$month"
                        params={{ month: statement.month }}
                        className="font-medium text-text-link hover:underline"
                      >
                        {statement.label[k]}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5 text-text-secondary">
                      {c.coversStatement[k]}
                    </td>
                    <td className="px-4 py-3.5 font-data text-text-primary">
                      {invoice?.file ?? "—"}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusPill
                        tone={
                          invoice?.state === "uploaded"
                            ? "success"
                            : invoice?.state === "differs"
                              ? "warning"
                              : "neutral"
                        }
                      >
                        {invoice?.state === "uploaded"
                          ? c.uploaded[k]
                          : invoice?.state === "differs"
                            ? c.differs[k]
                            : c.missing[k]}
                      </StatusPill>
                      {invoice?.note && (
                        <p className="mt-1 max-w-[240px] text-[11px] leading-4 text-text-muted">
                          {invoice.note[k]}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-end">
                      {final ? (
                        <Gated permission="statement.accept" instead={null}>
                          <Button size="sm" variant="outline">
                            <Upload className="h-4 w-4" aria-hidden="true" />
                            {invoice?.file ? c.replace[k] : c.upload[k]}
                          </Button>
                        </Gated>
                      ) : (
                        <span className="text-[11.5px] text-text-muted">
                          {c.afterAccept[k]}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <p className="max-w-4xl text-xs leading-5 text-text-muted">
          {c.neverBlocks[k]}
        </p>
        <p className="max-w-4xl text-xs leading-5 text-text-muted">
          {c.checked[k]}
        </p>
      </div>
    </PageShell>
  );
}
