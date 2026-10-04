/**
 * UI 07.35.1–8 and 07.35E — one report.
 *
 * Eight reports share this page, and the sameness is the design's argument:
 * the shape is learned once - back, title, four filters, the tiles, the
 * table - and every report after the first is read without relearning it.
 * Only the tiles, the columns and the third filter's question change.
 *
 * The third filter is the one that is not decoration. "Date based on" is a
 * different question per report - a payment date, a check-out, a due date -
 * and getting it wrong is how two reports that should agree stop agreeing.
 *
 * BR-07-01 — every amount includes VAT at 15%, which is why only the VAT
 * report breaks it out, and then only because a return asks for it.
 */

import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { BackLink, PageShell } from "@/components/layout/page-shell";
import { Gated } from "@/components/system/permission-gate";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useLanguage } from "@/lib/i18n";
import { notify } from "@/lib/notify";
import { reportCopy, reportFor, type ReportTile } from "@/lib/report-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/finance/reports/$report")({
  /* UI 07.35E is the same report over dates that hold nothing. */
  validateSearch: (search: Record<string, unknown>): { empty?: true } => {
    const flag = search["empty"];
    /* The router hands a bare ?empty=1 back as the number 1. */
    return flag === "1" || flag === 1 || flag === true ? { empty: true } : {};
  },
  loader: ({ params }) => {
    const report = reportFor(params.report);
    if (!report) throw notFound();
    return report;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title.en ?? "Report"} · Hoteliana Supplier Portal` },
      { name: "description", content: loaderData?.blurb.en ?? "A finance report." },
      { property: "og:title", content: "Report · Hoteliana Supplier Portal" },
      { property: "og:description", content: loaderData?.blurb.en ?? "" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ReportPage,
});

/** The frame tints the two ends of an answer, and leaves the middle plain. */
function Tile({
  tile,
  k,
  empty,
}: {
  tile: ReportTile;
  k: "en" | "ar";
  empty: boolean;
}) {
  const c = reportCopy;
  return (
    <div
      className={cn(
        "rounded-2xl border p-5",
        tile.tint === "good"
          ? "border-transparent bg-[#edffd6]"
          : tile.tint === "minus"
            ? "border-transparent bg-[#fdeceb]"
            : "border-border-subtle bg-surface-default"
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.04em] text-text-quiet">
        {tile.label[k]}
      </p>
      <p className="mt-1.5 text-[26px] font-semibold leading-8 text-text-primary">
        {empty ? (tile.emptyValue?.[k] ?? c.dash[k]) : tile.value[k]}
      </p>
      <p className="mt-0.5 text-[11.5px] text-text-body">
        {empty ? (tile.emptyNote?.[k] ?? tile.note[k]) : tile.note[k]}
      </p>
    </div>
  );
}

function ReportPage() {
  const report = Route.useLoaderData();
  const search = Route.useSearch();
  const { lang } = useLanguage();
  const k = lang === "ar" ? ("ar" as const) : ("en" as const);
  const c = reportCopy;
  const empty = search.empty === true;

  const [from, setFrom] = useState("from");
  const [to, setTo] = useState("to");
  const [basedOn, setBasedOn] = useState("basedOn");
  const [hotel, setHotel] = useState("all");

  return (
    <PageShell>
      <BackLink to="/finance/reports" label={c.back[k]} />

      <header className="mb-5 flex flex-wrap items-start gap-5">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.8px] text-text-quiet">
            {c.detailOverline[k]}
          </p>
          <h1 className="mt-1 text-[26px] font-semibold leading-[34px] text-[#09241a]">
            {report.title[k]}
          </h1>
          <p className="mt-1 max-w-[880px] text-[13px] leading-5 text-text-body">
            {report.blurb[k]}
          </p>
        </div>
        {/* §0.4 - export is off while there is nothing to export. */}
        <Gated permission="finance.export" instead={null}>
          <div className="flex flex-wrap items-center gap-2.5">
            {[c.excel[k], c.pdf[k]].map((label) => (
              <Button
                key={label}
                variant="outline"
                disabled={empty}
                reason={empty ? c.emptyTitle[k] : undefined}
                onClick={() => notify.success(label)}
              >
                {label}
              </Button>
            ))}
          </div>
        </Gated>
      </header>

      {/* BR-07-04 - the filters change what is listed, never what is owed. */}
      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Select
          label={c.from[k]}
          value={from}
          onChange={setFrom}
          searchable={false}
          options={[{ value: "from", label: c.fromValue[k] }]}
        />
        <Select
          label={c.to[k]}
          value={to}
          onChange={setTo}
          searchable={false}
          options={[{ value: "to", label: c.toValue[k] }]}
        />
        <Select
          label={c.basedOn[k]}
          value={basedOn}
          onChange={setBasedOn}
          searchable={false}
          options={[{ value: "basedOn", label: report.basedOn[k] }]}
        />
        <Select
          label={c.hotel[k]}
          value={hotel}
          onChange={setHotel}
          searchable={false}
          options={[{ value: "all", label: c.allHotels[k] }]}
        />
      </div>

      <div
        className={cn(
          "mb-5 grid gap-3.5",
          report.tiles.length === 2
            ? "sm:grid-cols-2"
            : "sm:grid-cols-2 xl:grid-cols-3"
        )}
      >
        {report.tiles.map((tile) => (
          <Tile key={tile.label.en} tile={tile} k={k} empty={empty} />
        ))}
      </div>

      {/* UI 07.35E - empty dates are an answer, not a failure. */}
      {empty ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-border-subtle bg-surface-default px-6 py-12 text-center">
          <p className="text-[15px] font-semibold text-text-primary">
            {c.emptyTitle[k]}
          </p>
          <p className="max-w-[560px] text-[12.5px] leading-5 text-text-body">
            {c.emptyBody[k]}
          </p>
          <Button className="mt-2" variant="outline">
            {c.changeDates[k]}
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-default">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="bg-[#f8f9f7]">
                  {report.columns.map((column) => (
                    <th
                      key={column.en}
                      className="px-4 py-3 text-start text-[10px] font-semibold uppercase text-text-quiet"
                    >
                      {column[k]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {report.rows.map((row, index) => (
                  <tr
                    key={`${row[0]?.en}-${index}`}
                    className="border-t border-border-subtle"
                  >
                    {row.map((cell, column) => (
                      <td
                        key={`${cell.en}-${column}`}
                        className={cn(
                          "px-4 py-3 text-[12.5px] text-text-primary",
                          (report.strong?.includes(column) ||
                            report.strongRows?.includes(index)) &&
                            "font-semibold"
                        )}
                      >
                        {cell[k]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PageShell>
  );
}
