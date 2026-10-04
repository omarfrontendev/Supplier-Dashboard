/**
 * OV 07.11 — the remittance advice.
 *
 * Flow 07 step 11 names everything it carries and nothing more: Payment,
 * Paid on, Bank reference, Paid to, Lines, Total, Held back, a format and a
 * download. That is deliberate — this is not a screen to read, it is the
 * document an accountant reconciles a bank line against, so every field on
 * it has to be one the bank statement also shows.
 *
 * BR-07-54 sets the table: Amount, What, Booking / Entry, in the statement's
 * own order, with the summary under the lines rather than above them.
 *
 * BR-07-53 and BR-07-16 put the held-back amount on the advice. An entry
 * under dispute is not paid and not lost: it is held out of the transfer it
 * belonged to, and the advice says so — otherwise the total looks short for
 * no reason anyone can see.
 *
 * BR-07-55 keeps the advice for a transfer the bank sent back. It is marked
 * Returned with the date, and it still downloads, because the archive needs
 * the transfer that failed as much as the one that worked.
 */

import { useState } from "react";
import { Download } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Modal } from "@/components/layout/overlay";
import { Button } from "@/components/ui/button";
import { counted, linesWord } from "@/lib/arabic-count";
import { downloadText } from "@/lib/download";
import type { FinancePayment } from "@/lib/finance-data";
import { fill, useLanguage } from "@/lib/i18n";
import { notify } from "@/lib/notify";
import { paymentsCopy } from "@/lib/payments-copy";

type Format = "pdf" | "csv";

export function RemittanceAdvice({
  payment,
  onClose,
}: {
  payment: FinancePayment;
  onClose: () => void;
}) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? ("ar" as const) : ("en" as const);
  const ar = k === "ar";
  const c = paymentsCopy;
  const [format, setFormat] = useState<Format>("pdf");

  const n = (value: number) => value.toLocaleString(ar ? "ar-EG" : "en-US");
  const sar = ar ? "ر.س" : "SAR";
  /* The lines add up to more than the transfer whenever something is held. */
  const linesTotal = payment.lines.reduce((sum, line) => sum + line.amount, 0);
  const held = payment.heldBack;

  const run = () => {
    /* Step 12 — the file leaves in the format that was picked, and the
       download is recorded. A PDF is a server's job, so what a browser can
       honestly produce is the same advice as text. */
    const rows = payment.lines.map((line) =>
      [line.ref, ar ? line.whatAr : line.what, line.amount].join(
        format === "csv" ? "," : " · "
      )
    );
    downloadText(
      `remittance-${payment.id}.${format}`,
      [
        payment.id,
        ar ? payment.paidOnAr : payment.paidOn,
        payment.bankReference,
        ar ? payment.bankAr : payment.bank,
        ...rows,
        ...(held ? [`${c.adviceHeldLine[k]} ${held.amount}`] : []),
        `${c.adviceTransferred[k]} ${payment.amount} SAR`,
      ].join("\n")
    );
    notify.success(c.adviceDownloaded[k]);
    onClose();
  };

  return (
    <Modal
      overline={c.adviceOverline[k]}
      title={payment.id}
      meta={c.adviceIntro[k]}
      onClose={onClose}
      className="max-w-[720px]"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {c.adviceClose[k]}
          </Button>
          <Button onClick={run}>
            <Download className="h-4 w-4" aria-hidden="true" />
            {c.adviceDownload[k]}
          </Button>
        </>
      }
    >
      {/* BR-07-55 — the money came back, and the advice says so first. */}
      {payment.returned && (
        <div className="mb-4 rounded-xl bg-[#fbe7e3] p-3.5">
          <p className="text-[12.5px] font-semibold text-status-danger">
            {fill(c.adviceReturned[k], {
              date: (ar ? payment.returnedOnAr : payment.returnedOn) ?? "",
            })}
          </p>
          <p className="mt-0.5 text-[12px] leading-5 text-status-danger">
            {c.adviceReturnedBody[k]}
          </p>
        </div>
      )}

      <div className="grid gap-3 rounded-xl border border-border-subtle p-4 sm:grid-cols-2">
        {(
          [
            [c.advicePaidOn[k], ar ? payment.paidOnLongAr : payment.paidOnLong],
            [c.adviceBankRef[k], payment.bankReference],
            [c.advicePaidTo[k], ar ? payment.bankAr : payment.bank],
          ] as Array<[string, string]>
        ).map(([label, value]) => (
          <div key={label}>
            <p className="text-[11px] text-text-muted">{label}</p>
            <p className="mt-px text-[12.5px] font-medium text-text-primary">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* BR-07-54 — amount first, then what it was, then what it belongs to. */}
      <div className="mt-4 overflow-hidden rounded-xl border border-border-subtle">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-sm">
            <thead>
              <tr className="bg-[#f8f9f7]">
                {[c.adviceColAmount[k], c.adviceColWhat[k], c.adviceColRef[k]].map(
                  (cell) => (
                    <th
                      key={cell}
                      className="px-4 py-2.5 text-start text-[10px] font-semibold uppercase text-text-quiet"
                    >
                      {cell}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {payment.lines.map((line) => (
                <tr key={line.ref} className="border-t border-border-subtle">
                  <td className="whitespace-nowrap px-4 py-3 text-[12.5px] font-semibold text-text-primary">
                    {line.amount < 0 ? "− " : ""}
                    {n(Math.abs(line.amount))} {sar}
                  </td>
                  <td className="px-4 py-3 text-[12px] leading-5 text-text-body">
                    {ar ? line.whatAr : line.what}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[12.5px] text-text-secondary">
                    {(ar && line.refAr) || line.ref}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* The summary sits under the lines, where a document puts it. */}
        <div className="border-t border-border-subtle bg-[#f8f9f7] px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[12px] text-text-body">
            <span>
              {fill(c.adviceLinesSum[k], {
                lines: counted(payment.lines.length, linesWord, k),
                amount: n(linesTotal),
              })}
            </span>
          </div>
          {held && (
            <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-[12px] text-text-body">
              <span>
                {fill(c.adviceHeldLine[k], {
                  amount: n(held.amount),
                  dispute: held.dispute,
                })}
              </span>
              <span className="text-text-muted">
                {ar ? held.whatAr : held.what}
              </span>
            </div>
          )}
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-border-subtle pt-2">
            <span className="text-[12.5px] font-semibold text-text-primary">
              {c.adviceTransferred[k]}
            </span>
            <span className="text-[14px] font-semibold text-text-primary">
              {n(payment.amount)} {sar}
            </span>
          </div>
        </div>
      </div>

      {/* BR-07-53 — why the total is short, and where to take it up. */}
      {held && (
        <div className="mt-4 rounded-xl bg-[#fdf3e3] p-3.5">
          <p className="text-[12px] leading-5 text-[#7a5a21]">
            {c.adviceHeldBody[k]}
          </p>
          {payment.statement && (
            <Link
              className="mt-2 inline-block"
              to="/finance/statements/$month"
              params={{ month: payment.statement }}
              onClick={onClose}
            >
              <Button variant="outline" size="sm">
                {c.adviceSeeEntry[k]}
              </Button>
            </Link>
          )}
        </div>
      )}

      <div className="mt-4">
        <p className="text-overline text-text-muted">{c.adviceFormat[k]}</p>
        <div className="mt-2 grid max-w-[280px] grid-cols-2 gap-2">
          {(["pdf", "csv"] as Format[]).map((option) => (
            <Button
              key={option}
              variant={format === option ? "dark" : "outline"}
              onClick={() => setFormat(option)}
            >
              {option.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>
    </Modal>
  );
}
