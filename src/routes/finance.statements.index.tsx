/**
 * UI 07.22 — the statements list. One statement a month for the whole
 * supplier company (BR-07-20), whatever the hotel or the contract.
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, PageShell, StatusPill } from "@/components/layout/page-shell";
import { Gated } from "@/components/system/permission-gate";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { money } from "@/lib/money";
import { amountDue, statementCopy, statements, type StatementState } from "@/lib/statement-data";
import { dueFor } from "@/lib/statement-lines";

export const Route = createFileRoute("/finance/statements/")({
  head: () => ({
    meta: [
      { title: "Statements · Hoteliana Supplier Portal" },
      {
        name: "description",
        content:
          "One statement a month for the whole company, with what is due and when it is paid.",
      },
      { property: "og:title", content: "Statements · Hoteliana Supplier Portal" },
      {
        property: "og:description",
        content: "Monthly statements, review and acceptance.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: StatementsPage,
});

/** REF 00.S paints these; the label comes from the statement's own copy. */
const TONE: Record<StatementState, "warning" | "success" | "neutral" | "danger"> =
  {
    open: "warning",
    accepted: "success",
    autoAccepted: "neutral",
    paid: "success",
    owed: "danger",
  };

function StatementsPage() {
  const { lang } = useLanguage();
  const k = lang === "ar" ? ("ar" as const) : ("en" as const);
  const c = statementCopy;

  return (
    <PageShell>
      <PageHeader
        overline={c.overline[k]}
        title={c.statementsTitle[k]}
        subtitle={c.statementsSubtitle[k]}
      />

      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-default">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-sm">
            <thead>
              <tr className="bg-surface-subtle text-overline text-text-muted">
                {[c.colMonth[k], c.colIssued[k], c.colDue[k], c.colState[k], c.colPaid[k], ""].map(
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
              {statements.map((statement) => {
                /* One number per month: the detail wins where a frame draws it. */
                const due = dueFor(statement.month, amountDue(statement));
                const label =
                  statement.state === "open"
                    ? c.open[k]
                    : statement.state === "accepted"
                      ? c.accepted[k]
                      : statement.state === "autoAccepted"
                        ? c.autoAccepted[k]
                        : statement.state === "owed"
                          ? c.owed[k]
                          : c.paid[k];
                return (
                  <tr
                    key={statement.month}
                    className="border-t border-border-subtle"
                  >
                    <td className="px-4 py-3.5 font-medium text-text-primary">
                      {statement.label[k]}
                    </td>
                    <td className="px-4 py-3.5 text-text-secondary">
                      {statement.issued[k]}
                    </td>
                    <td className="px-4 py-3.5 font-data font-semibold text-text-primary">
                      {money(due, lang)}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusPill tone={TONE[statement.state]}>{label}</StatusPill>
                    </td>
                    <td className="px-4 py-3.5 text-text-secondary">
                      {statement.paidOn ? statement.paidOn[k] : "—"}
                    </td>
                    <td className="px-4 py-3.5 text-end">
                      <Gated permission="finance.view" instead={null}>
                        <Link
                          to="/finance/statements/$month"
                          params={{ month: statement.month }}
                        >
                          <Button size="sm" variant="outline">
                            {statement.state === "open" ? c.review[k] : c.view[k]}
                          </Button>
                        </Link>
                      </Gated>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 max-w-4xl text-xs leading-5 text-text-muted">
        {c.autoNote[k]}
      </p>
    </PageShell>
  );
}
