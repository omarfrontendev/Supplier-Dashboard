/**
 * UI 07.36 — Bank & payment terms. Read only, both halves.
 *
 * BR-07-12 keeps the terms read only because they belong to the contract,
 * and `bank.change` is the Owner's alone - never given to another role, not
 * even a custom one - with a confirming phone call behind it.
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { Landmark } from "lucide-react";
import {
  DataRow,
  PageHeader,
  PageShell,
  SectionCard,
  StatusPill,
} from "@/components/layout/page-shell";
import { Gated } from "@/components/system/permission-gate";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { bankCopy, bankDetails, earningsCopy } from "@/lib/finance-terms";
import { statementCopy } from "@/lib/statement-data";

export const Route = createFileRoute("/finance/bank")({
  head: () => ({
    meta: [
      { title: "Bank & payment terms · Hoteliana Supplier Portal" },
      {
        name: "description",
        content:
          "Where Hoteliana sends your money and on what terms, per contract.",
      },
      {
        property: "og:title",
        content: "Bank & payment terms · Hoteliana Supplier Portal",
      },
      {
        property: "og:description",
        content: "Bank details and per-contract payment terms, read only.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BankPage,
});

function BankPage() {
  const { lang } = useLanguage();
  const k = lang === "ar" ? ("ar" as const) : ("en" as const);
  const c = bankCopy;

  return (
    <PageShell>
      <PageHeader
        overline={statementCopy.overline[k]}
        title={c.title[k]}
        subtitle={c.subtitle[k]}
      />

      <SectionCard
        icon={<Landmark className="h-5 w-5" aria-hidden="true" />}
        title={c.bankSection[k]}
        right={
          /* BR-07-90 / §0.5 - no key, no button, and a line naming who can. */
          <Gated permission="bank.change">
            {/* The guide's entry point: this is a company change like any
                other, so it opens UI 01.6C with the IBAN already ticked
                rather than inventing a second way to ask. */}
            <Link to="/request-changes" search={{ select: "iban" }}>
              <Button variant="outline" size="sm">
                {c.changeBank[k]}
              </Button>
            </Link>
          </Gated>
        }
      >
        <div className="rounded-xl border border-border-subtle px-4">
          <DataRow label={c.holder[k]}>{bankDetails.holder[k]}</DataRow>
          <DataRow label={c.bank[k]}>{bankDetails.bank[k]}</DataRow>
          <DataRow label={c.iban[k]}>
            <span className="font-data">{bankDetails.iban}</span>
          </DataRow>
          <DataRow label={c.currency[k]}>{bankDetails.currency}</DataRow>
        </div>
        <p className="mt-3 text-[11.5px] leading-4 text-text-muted">
          {c.ibanNote[k]} {c.changeNote[k]}
        </p>
      </SectionCard>

      <SectionCard className="mt-5" title={c.termsSection[k]} bodyClassName="px-0 pb-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="bg-surface-subtle text-overline text-text-muted">
                {[c.colContract[k], c.colHotels[k], c.colTerm[k], c.colWhen[k]].map(
                  (cell) => (
                    <th key={cell} className="px-4 py-3 text-start font-semibold">
                      {cell}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {bankDetails.contracts.map((row) => (
                <tr key={row.name.en} className="border-t border-border-subtle">
                  <td className="px-4 py-3.5 font-medium text-text-primary">
                    {row.name[k]}
                  </td>
                  <td className="px-4 py-3.5 text-text-secondary">
                    {row.hotels[k]}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusPill
                      tone={
                        row.term === "onBooking"
                          ? "success"
                          : row.term === "onArrival"
                            ? "warning"
                            : "neutral"
                      }
                    >
                      {earningsCopy[row.term][k]}
                    </StatusPill>
                  </td>
                  <td className="px-4 py-3.5 text-text-secondary">
                    {row.when[k]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="border-t border-border-subtle p-4 text-xs leading-5 text-text-muted">
          {c.termsNote[k]}
        </p>
      </SectionCard>
    </PageShell>
  );
}
