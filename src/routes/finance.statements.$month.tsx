/**
 * UI 07.23 — one month's statement.
 *
 * The frame splits the lines in two because they answer different
 * questions: **bookings** are what the month earned, **penalties and
 * deductions** are what was added to or taken from them. The four totals
 * sit above both as tiles, which is BR-07-23's arithmetic made visible -
 * bookings + penalties − deductions.
 *
 * The rules the screen holds:
 *
 *   BR-07-28  Accepting is final. No undo, ever.
 *   BR-07-30  A disputed line does not hold the rest: "Accept the rest".
 *   BR-07-31  After the window, Dispute goes and a line says where to go.
 *   BR-07-35  A dispute never delays the payment, and BR-07-36 pays the
 *             amount the statement was issued for.
 *   BR-07-45  A missing invoice never holds the payment up.
 */

import { createFileRoute, notFound } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { BackLink, PageShell, StatusPill } from "@/components/layout/page-shell";
import { Modal } from "@/components/layout/overlay";
import { DiscardGuard, useDiscardGuard } from "@/components/system/discard-guard";
import { Gated } from "@/components/system/permission-gate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { arabicDigits } from "@/components/ui/date-field";
import { fill, useLanguage } from "@/lib/i18n";
import { money } from "@/lib/money";
import { notify } from "@/lib/notify";
import { statementCopy } from "@/lib/statement-data";
import {
  monthStatements,
  statementScreen,
  totals,
  type BookingLine,
  type BookingLineState,
} from "@/lib/statement-lines";
import {
  outcomeFrom,
  outcomes,
  type StatementOutcome,
} from "@/lib/statement-outcomes";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/finance/statements/$month")({
  /* UI 07.23A-F are one month's six endings, reachable as ?state=. */
  validateSearch: (search: Record<string, unknown>): { state?: string } =>
    typeof search["state"] === "string" ? { state: search["state"] } : {},
  loader: ({ params }) => {
    const statement = monthStatements.find((item) => item.month === params.month);
    if (!statement) throw notFound();
    return statement;
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.label.en ?? "Statement"} · Hoteliana Supplier Portal`,
      },
      {
        name: "description",
        content: "One month's statement, its bookings, and what is due.",
      },
      { property: "og:title", content: "Statement · Hoteliana Supplier Portal" },
      {
        property: "og:description",
        content: "Review a monthly statement and accept or dispute its lines.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: StatementPage,
});

const LINE_TONE: Record<
  BookingLineState,
  "neutral" | "warning" | "success" | "danger"
> = {
  inStatement: "neutral",
  disputed: "warning",
  agreed: "success",
  rejected: "danger",
  paid: "neutral",
};

/**
 * The band that replaces the blue strip once the month is settled. Green
 * says the statement is closed and the money is moving; amber says a line
 * is still being argued, or has just been answered - and the frames keep
 * it amber whichever way the answer went, because the line was disputed
 * either way.
 */
function Band({
  tone,
  title,
  body,
}: {
  tone: "success" | "warning";
  title: string;
  body: string;
}) {
  return (
    <div
      className={cn(
        "mb-5 rounded-xl p-4",
        tone === "success" ? "bg-[#e8f6ec]" : "bg-[#fdf0d9]"
      )}
    >
      <p
        className={cn(
          "text-[12px] font-semibold",
          tone === "success" ? "text-[#1e7a4c]" : "text-[#8a5a00]"
        )}
      >
        {title}
      </p>
      <p
        className={cn(
          "mt-0.5 text-[12px] leading-5",
          tone === "success" ? "text-[#1e7a4c]" : "text-[#8a5a00]"
        )}
      >
        {body}
      </p>
    </div>
  );
}

/** The frame's tile, tinted at the two ends of the sum. */
function Tile({
  label,
  value,
  note,
  tint,
}: {
  label: string;
  value: string;
  note: string;
  tint?: "minus" | "due";
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border-subtle p-4",
        tint === "minus"
          ? "bg-[#fdeceb]"
          : tint === "due"
            ? "bg-[#edffd6]"
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
        <h2 className="mt-2 text-base font-semibold text-text-primary">
          {title}
        </h2>
      )}
      <div className="mt-3">{children}</div>
    </section>
  );
}

/** The label-and-value row the invoice and payment cards share. */
function Row({
  label,
  last,
  children,
}: {
  label: string;
  last?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 py-2.5 sm:flex-row sm:items-center sm:gap-3",
        !last && "border-b border-border-subtle"
      )}
    >
      <p className="text-[12px] text-text-body sm:w-[160px] sm:shrink-0">
        {label}
      </p>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function StatementPage() {
  const statement = Route.useLoaderData();
  const { lang } = useLanguage();
  const k = lang === "ar" ? ("ar" as const) : ("en" as const);
  const ar = k === "ar";
  const c = statementScreen;

  const search = Route.useSearch();
  /* The URL names the ending; accepting or disputing moves to one. */
  const urlOutcome = outcomeFrom(search.state);
  const [outcome, setOutcome] = useState<StatementOutcome>(urlOutcome);
  const [states, setStates] = useState<Record<string, BookingLineState>>({});
  const [accepted, setAccepted] = useState(statement.state !== "open");

  /*
   * Moving to another month, or to another of September's endings, changes
   * the URL but does not remount this route - so the page would otherwise
   * carry what it was holding for the screen it just left. It drops it
   * here, while rendering, rather than in an effect that paints twice.
   */
  const showing = `${statement.month}:${urlOutcome}`;
  const shown = useRef(showing);
  if (shown.current !== showing) {
    shown.current = showing;
    setOutcome(urlOutcome);
    setStates({});
    setAccepted(statement.state !== "open");
  }

  const view = outcomes[outcome];
  const [disputing, setDisputing] = useState<BookingLine | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [hotel, setHotel] = useState("all");
  const [contract, setContract] = useState("all");

  const sums = totals(statement);
  const lines = useMemo(
    () =>
      statement.bookings.map((item) => ({
        ...item,
        state:
          view.line && view.line.id === item.id
            ? view.line.state
            : (states[item.id] ?? item.state),
      })),
    [statement.bookings, states, view.line]
  );
  const disputed = lines.filter((item) => item.state === "disputed");
  /* BR-07-31 — accepting closes the window, and so does the 5th. A line
     sent back does not close it: the rest of the statement stays open. */
  const closed =
    accepted ||
    statement.state !== "open" ||
    (outcome !== "open" && outcome !== "disputeSent");
  /* The band, from the month itself or from the ending it is showing. */
  const band = view.band ?? statement.band;
  /* A dispute moves the amount due; nothing else does. */
  const due = view.due ?? sums.due;
  const paid = statement.payment.state === "paid";
  const invoice = view.invoice ?? statement.invoice;
  /* The separator the tables already use: ar-EG writes ١٨٬٤٥٠,
     and a page that prints money two ways looks like two pages. */
  const num = (v: number) => v.toLocaleString(ar ? "ar-EG" : "en-US");

  return (
    <PageShell>
      <BackLink to="/finance/statements" label={c.back[k]} />

      <header className="mb-5 flex flex-wrap items-start gap-5">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.8px] text-text-quiet">
            {statement.overline[k]}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h1 className="text-[26px] font-semibold leading-[34px] text-[#09241a]">
              {statement.label[k]}
            </h1>
            <StatusPill
              tone={outcome === "open" ? (closed ? "success" : "warning") : view.pillTone}
            >
              {outcome !== "open"
                ? view.pill[k]
                : closed
                  ? (statement.acceptedNote?.[k] ?? c.acceptedPill[k])
                  : fill(c.openForReview[k], { when: statement.reviewUntil[k] })}
            </StatusPill>
          </div>
          <p className="mt-1 max-w-[880px] text-[13px] leading-5 text-text-body">
            {statement.subtitle[k]}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          {/* BR-07-30 — a line under review never holds up the rest. */}
          {(!closed || view.acceptRest) && (
            <Gated permission="statement.accept" instead={null}>
              <Button onClick={() => setConfirming(true)}>
                {disputed.length > 0 || view.acceptRest
                  ? statementCopy.acceptRest[k]
                  : c.accept[k]}
              </Button>
            </Gated>
          )}
          <Gated permission="finance.export" instead={null}>
            <Button variant="outline">{c.downloadPdf[k]}</Button>
          </Gated>
        </div>
      </header>

      {/* BR-07-04 — the filter changes what is listed, never what is due. */}
      <div className="mb-5 grid max-w-[640px] gap-3 sm:grid-cols-2">
        <Select
          label={c.hotel[k]}
          value={hotel}
          onChange={setHotel}
          searchable={false}
          options={[{ value: "all", label: c.allHotels[k] }]}
        />
        <Select
          label={c.contract[k]}
          value={contract}
          onChange={setContract}
          searchable={false}
          options={[{ value: "all", label: c.allContracts[k] }]}
        />
      </div>

      {/* The sum, as four tiles. */}
      <div className="mb-5 grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        <Tile
          label={c.bookingsTile[k]}
          value={num(sums.bookings)}
          note={fill(c.bookingsNote[k], {
            n: arabicDigits(statement.bookingCount, ar),
          })}
        />
        <Tile
          label={c.penaltiesTile[k]}
          value={num(sums.penalties)}
          note={statement.penaltyNote[k]}
        />
        <Tile
          tint="minus"
          label={c.deductionsTile[k]}
          value={`− ${num(Math.abs(sums.deductions))}`}
          note={statement.deductionNote[k]}
        />
        <Tile
          tint="due"
          label={c.dueTile[k]}
          value={num(due)}
          note={
            view.dueNote?.[k] ?? fill(c.dueNote[k], { when: statement.payOn[k] })
          }
        />
      </div>

      {/*
        * While the month is open, the blue strip explains the cycle. Once
        * it has an ending, the ending replaces it: the cycle is no longer
        * the thing you need to be told.
        */}
      {band ? (
        <Band tone={band.tone} title={band.title[k]} body={band.body[k]} />
      ) : (
        <div className="mb-5 rounded-xl bg-[#e8f1f8] p-4">
          <p className="text-[12px] font-semibold text-[#2f5673]">
            {c.howTitle[k]}
          </p>
          <p className="mt-0.5 text-[12px] leading-5 text-[#2f5673]">
            {c.howBody[k]}
          </p>
        </div>
      )}

      <div className="grid gap-5">
        <Card
          overline={c.bookingsCard[k]}
          title={fill(c.bookingsHeading[k], {
            n: arabicDigits(statement.bookingCount, ar),
            total: num(sums.bookings),
          })}
        >
          <div className="overflow-hidden rounded-xl border border-border-subtle">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] border-collapse text-sm">
                <thead>
                  <tr className="bg-[#f8f9f7]">
                    {[
                      c.colBooking[k],
                      c.colCheckOut[k],
                      c.colStay[k],
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
                  {lines.map((line) => (
                    <tr key={line.id} className="border-t border-border-subtle">
                      <td className="px-4 py-2">
                        <p className="text-[12.5px] font-medium text-text-primary">
                          {line.id}
                        </p>
                        <p className="mt-px text-[11px] text-text-body">
                          {line.who[k]}
                        </p>
                      </td>
                      <td className="px-4 py-2 text-[12.5px] text-text-primary">
                        {line.checkOut[k]}
                      </td>
                      <td className="px-4 py-2 text-[12.5px] text-text-primary">
                        {line.stay[k]}
                      </td>
                      <td className="px-4 py-2 text-[13px] font-semibold text-text-primary">
                        {money(line.amount, lang)}
                      </td>
                      <td className="px-4 py-2">
                        <StatusPill tone={LINE_TONE[line.state]}>
                          {/* The ending names its own line: "Agreed · +560
                              in Oct" says more than "Agreed" ever could. */}
                          {view.line && view.line.id === line.id
                            ? view.line.label[k]
                            : line.state === "inStatement"
                              ? c.inStatement[k]
                              : line.state === "disputed"
                                ? c.disputed[k]
                                : line.state === "agreed"
                                  ? c.agreed[k]
                                  : line.state === "paid"
                                    ? c.paidLine[k]
                                    : c.rejected[k]}
                        </StatusPill>
                      </td>
                      <td className="px-4 py-2 text-end">
                        {/* BR-07-37 — one dispute a line, none once closed. */}
                        {!closed && line.state === "inStatement" ? (
                          <Gated permission="finance.dispute" instead={null}>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setDisputing(line)}
                            >
                              {c.dispute[k]}
                            </Button>
                          </Gated>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="border-t border-border-subtle px-4 py-3 text-[12px] text-text-body">
              {fill(c.showing[k], {
                shown: arabicDigits(statement.shown, ar),
                total: arabicDigits(statement.bookingCount, ar),
                sum: num(sums.bookings),
              })}
            </p>
          </div>
          {/* BR-07-31 — the window closed, so say where a line goes now.
              A band already says it, so this is for the months that have
              none: it would otherwise repeat the sentence above it. */}
          {closed && !band && (
            <p className="mt-3 flex flex-wrap items-center gap-3 rounded-xl bg-surface-subtle p-3.5 text-[12px] leading-5 text-text-body">
              {fill(statementCopy.windowClosed[k], {
                when: statement.reviewUntil[k],
              })}
              <Gated permission="finance.contact" instead={null}>
                <Button size="sm" variant="outline">
                  {statementCopy.contactHoteliana[k]}
                </Button>
              </Gated>
            </p>
          )}
        </Card>

        <Card overline={c.adjustmentsCard[k]} title={c.adjustmentsHeading[k]}>
          {/* A clean month says so in a sentence, not in an empty table. */}
          {statement.adjustments.length === 0 ? (
            <p className="text-[12.5px] text-text-body">{c.noAdjustments[k]}</p>
          ) : (
          <div className="overflow-hidden rounded-xl border border-border-subtle">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <thead>
                  <tr className="bg-[#f8f9f7]">
                    {[c.colReference[k], c.colWhat[k], c.colAdjAmount[k]].map(
                      (cell) => (
                        <th
                          key={cell}
                          className="px-4 py-3 text-start text-[10px] font-semibold uppercase text-text-quiet"
                        >
                          {cell}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {statement.adjustments.map((row) => (
                    <tr
                      key={row.reference}
                      className="border-t border-border-subtle align-top"
                    >
                      <td className="px-4 py-2">
                        <p className="text-[12.5px] font-medium text-text-primary">
                          {row.reference}
                        </p>
                        <p className="mt-px text-[11px] text-text-body">
                          {row.sub[k]}
                        </p>
                      </td>
                      <td className="px-4 py-2 text-[12.5px] text-text-primary">
                        {row.what[k]}
                      </td>
                      <td
                        className={cn(
                          "px-4 py-2 text-[13px] font-semibold",
                          row.amount < 0
                            ? "text-status-danger"
                            : "text-text-primary"
                        )}
                      >
                        {row.amount < 0 ? "− " : "+ "}
                        {money(Math.abs(row.amount), lang)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          )}
        </Card>

        <Card overline={c.invoiceCard[k]} title={c.invoiceHeading[k]}>
          {/*
            * BR-07-45 — the invoice never holds the payment up, so this is
            * a record, not a gate. It reads as a prompt only while the money
            * has not moved and nothing has been sent; once the month is paid,
            * or an invoice is in, the frames show what is on file instead.
            */}
          {invoice.state === "missing" && !paid ? (
            <>
              <div className="rounded-xl bg-[#fdf0d9] p-3.5 text-[#8a5a00]">
                <p className="text-[13px] font-semibold">{c.notUploaded[k]}</p>
                <p className="mt-0.5 text-[12px] leading-5">
                  {c.notUploadedBody[k]}
                </p>
              </div>
              {/*
                * BR-07-47 waits for the statement to be final, and UI 07.23B
                * draws the button anyway with a line still under review. The
                * frame is right: what is asked for is the invoice for the
                * amount being paid, and by then that amount is settled. So
                * the button appears as soon as the window has produced an
                * answer - accepted, auto-accepted, or a line sent back - and
                * only the untouched open month is without it.
                */}
              {(closed || outcome !== "open") && (
                <div className="mt-3">
                  <Gated permission="statement.accept" instead={null}>
                    <Button onClick={() => notify.info(c.uploadInvoice[k])}>
                      <Upload className="h-4 w-4" aria-hidden="true" />
                      {c.uploadInvoice[k]}
                    </Button>
                  </Gated>
                </div>
              )}
            </>
          ) : (
            <>
              <div>
                <Row label={c.invoiceRef[k]}>
                  <span className="text-[12.5px] text-text-primary">
                    {invoice.ref?.[k] ?? c.notUploaded[k]}
                  </span>
                </Row>
                <Row label={c.invoiceCheck[k]}>
                  <StatusPill tone={invoice.checkTone ?? "success"}>
                    {invoice.check?.[k] ?? c.notUploaded[k]}
                  </StatusPill>
                </Row>
                <Row label={c.invoiceUploaded[k]} last>
                  <span className="text-[12.5px] text-text-primary">
                    {invoice.uploaded?.[k] ?? "—"}
                  </span>
                </Row>
              </div>
              {invoice.action && (
                <div className="mt-3">
                  <Gated permission="statement.accept" instead={null}>
                    <Button
                      variant="outline"
                      onClick={() => notify.info(invoice.action?.[k] ?? "")}
                    >
                      {invoice.action[k]}
                    </Button>
                  </Gated>
                </div>
              )}
            </>
          )}
        </Card>

        <Card overline={c.paymentCard[k]} title={c.paymentHeading[k]}>
          <div>
            {(
              [
                [c.paymentDate[k], statement.payment.date[k]],
                [c.paymentTo[k], statement.payment.to[k]],
              ] as Array<[string, string]>
            ).map(([label, value]) => (
              <Row key={label} label={label}>
                <span className="text-[12.5px] text-text-primary">{value}</span>
              </Row>
            ))}
            <Row label={c.paymentStatus[k]} last>
              <StatusPill tone="success">
                {paid
                  ? fill(c.paidStatus[k], {
                      amount: num(due),
                      when: statement.paidOn?.[k] ?? statement.payOn[k],
                    })
                  : fill(c.scheduled[k], { amount: num(due) })}
              </StatusPill>
            </Row>
          </div>
        </Card>
      </div>

      {confirming && (
        <Modal
          title={fill(statementCopy.acceptTitle[k], {
            month: statement.label[k],
          })}
          meta={
            disputed.length === 0
              ? statementCopy.acceptBody[k]
              : disputed.length === 1
                ? fill(statementCopy.acceptRestOne[k], {
                    when: statement.payOn[k],
                  })
                : fill(statementCopy.acceptRestBody[k], {
                    count: arabicDigits(disputed.length, ar),
                    when: statement.payOn[k],
                  })
          }
          onClose={() => setConfirming(false)}
          className="max-w-[520px]"
          footer={
            <>
              <Button variant="outline" onClick={() => setConfirming(false)}>
                {statementCopy.cancel[k]}
              </Button>
              <Button
                onClick={() => {
                  setAccepted(true);
                  /* UI 07.23A - what you get after accepting. */
                  setOutcome("accepted");
                  setConfirming(false);
                  notify.success(
                    fill(statementCopy.accepting[k], {
                      when: statement.payOn[k],
                    })
                  );
                }}
              >
                {statementCopy.acceptConfirm[k]}
              </Button>
            </>
          }
        />
      )}

      {disputing && (
        <DisputeLine
          line={disputing}
          onClose={() => setDisputing(null)}
          onSend={() => {
            setStates((current) => ({ ...current, [disputing.id]: "disputed" }));
            /* UI 07.23B - the band, the tile and the pill all follow. */
            if (disputing.id === "HTL-88205") setOutcome("disputeSent");
            setDisputing(null);
            notify.success(statementCopy.disputeSla[k]);
          }}
        />
      )}
    </PageShell>
  );
}

/** OV 07.25 — disputing one line, without stopping the rest. */
function DisputeLine({
  line,
  onClose,
  onSend,
}: {
  line: BookingLine;
  onClose: () => void;
  onSend: () => void;
}) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? ("ar" as const) : ("en" as const);
  const c = statementCopy;
  const [reason, setReason] = useState("");
  const [should, setShould] = useState("");
  const [note, setNote] = useState("");
  const dirty = note.trim().length > 0 || should.trim().length > 0;
  const guard = useDiscardGuard(dirty, onClose);

  return (
    <Modal
      overline={`${line.id} · ${line.who[k]}`}
      title={c.disputeTitle[k]}
      meta={c.disputeBody[k]}
      onClose={guard.close}
      dirty={dirty}
      onGuard={guard.ask}
      className="max-w-[560px]"
      footer={
        <>
          <Button variant="outline" onClick={guard.close}>
            {c.cancel[k]}
          </Button>
          <Button
            onClick={onSend}
            disabled={!reason}
            reason={!reason ? c.disputeTitle[k] : undefined}
          >
            {c.disputeSend[k]}
          </Button>
        </>
      }
    >
      {guard.asking && (
        <DiscardGuard onKeep={guard.keep} onDiscard={guard.discard} />
      )}
      <RadioGroup value={reason} onValueChange={setReason}>
        {c.disputeReasons.map((item) => (
          <label
            key={item.en}
            className="flex cursor-pointer items-center gap-3 rounded-[10px] border border-border-subtle p-3.5 text-sm text-text-primary"
          >
            <RadioGroupItem value={item[k]} />
            {item[k]}
          </label>
        ))}
      </RadioGroup>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Input
          label={c.disputeWhat[k]}
          inputMode="numeric"
          value={should}
          onChange={(event) => setShould(event.target.value)}
          placeholder={String(line.amount)}
        />
      </div>
      <div className="mt-3">
        <p className="text-overline text-text-muted">{c.disputeNote[k]}</p>
        <Textarea
          className="mt-1.5 min-h-24 border-border-default bg-surface-default"
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
      </div>
      <p className="mt-3 text-[11.5px] leading-4 text-text-muted">
        {c.disputeSla[k]}
      </p>
    </Modal>
  );
}
