/**
 * UI 07.35 — Finance / Reports.
 *
 * Eight cards, and nothing else. The frame gives the page no filters and no
 * export of its own, because neither means anything until a report is
 * chosen: the dates belong to the report, not to the shelf it sits on.
 *
 * §0.4 sends anything over 5,000 rows by email rather than pretending a
 * browser download will cope, and BR-00-35 exports only what the viewer's
 * keys allow - both of which live on the report itself.
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, PageShell } from "@/components/layout/page-shell";
import { Gated } from "@/components/system/permission-gate";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { reportCopy, reports } from "@/lib/report-data";

export const Route = createFileRoute("/finance/reports/")({
  head: () => ({
    meta: [
      { title: "Reports · Hoteliana Supplier Portal" },
      {
        name: "description",
        content: "Finance reports for your accountant, in Excel or PDF.",
      },
      { property: "og:title", content: "Reports · Hoteliana Supplier Portal" },
      {
        property: "og:description",
        content:
          "Account statement, earnings, bookings, due dates, payments, deductions, cancellations and VAT.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ReportsIndex,
});

function ReportsIndex() {
  const { lang } = useLanguage();
  const k = lang === "ar" ? ("ar" as const) : ("en" as const);
  const c = reportCopy;

  return (
    <PageShell>
      <PageHeader
        overline={c.overline[k]}
        title={c.title[k]}
        subtitle={c.subtitle[k]}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {reports.map((report) => (
          <section
            key={report.key}
            className="rounded-2xl border border-border-subtle bg-surface-default p-5"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.04em] text-text-quiet">
              {c.cardOverline[k]}
            </p>
            <h2 className="mt-2 text-[15px] font-semibold text-text-primary">
              {report.title[k]}
            </h2>
            <p className="mt-1 text-[12.5px] leading-5 text-text-body">
              {report.blurb[k]}
            </p>
            <div className="mt-3.5">
              <Gated permission="finance.view" instead={null}>
                <Link
                  to="/finance/reports/$report"
                  params={{ report: report.key }}
                >
                  <Button variant="outline">{c.open[k]}</Button>
                </Link>
              </Gated>
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
