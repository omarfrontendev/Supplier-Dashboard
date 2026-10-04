/**
 * OV 04.WA / 04.WD / 04.WS — the three panels the Win list opens.
 *
 * The apply panel carries the whole of BR-04W-09 and A9/A10: which nights
 * actually move, which are already at or below the target and stay put, and
 * which nationality group keeps its own fixed price. None of it is decided
 * here — the line says so and the panel prints it.
 */

import { useState } from "react";
import { AlertTriangle, TrendingDown } from "lucide-react";
import { IconModal, Modal } from "@/components/layout/overlay";
import {
  DiscardGuard,
  useDiscardGuard,
} from "@/components/system/discard-guard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { arabicDigits } from "@/components/ui/date-field";
import { fill, useLanguage } from "@/lib/i18n";
import { money } from "@/lib/money";
import {
  applyOverlay,
  dismissOverlay,
  settingsOverlay,
  type WinLine,
  type WinMode,
} from "@/lib/win-list-data";

type Lang = "en" | "ar";

function Row({
  label,
  value,
  note,
  tone,
}: {
  label: string;
  value: string;
  note?: string | undefined;
  tone?: "draft" | undefined;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border-subtle py-2.5 last:border-b-0">
      <span className="text-sm text-text-secondary">{label}</span>
      <span className="flex flex-wrap items-baseline gap-2">
        <b
          className={`font-data text-sm ${
            tone === "draft" ? "text-brand-deep" : "text-text-primary"
          }`}
        >
          {value}
        </b>
        {note && <span className="text-xs text-text-muted">{note}</span>}
      </span>
    </div>
  );
}

/** OV 04.WA — apply this line to the calendar as a draft. */
export function ApplyOverlay({
  line,
  onClose,
  onCreate,
}: {
  line: WinLine;
  onClose: () => void;
  onCreate: (contract?: string) => void;
}) {
  const { lang } = useLanguage();
  const k: Lang = lang === "ar" ? "ar" : "en";
  const a = applyOverlay;
  const [contract, setContract] = useState(
    line.contracts?.[0]?.name[k] ?? ""
  );

  /* E1 — the calendar moved after the list was built, so there is nothing
     left to apply and the panel says so instead of offering a button. */
  const nothingToDo = line.now <= line.target;

  const overline = [
    line.hotel[k].toUpperCase(),
    line.room[k].toUpperCase(),
    line.dates[k].toUpperCase(),
  ].join(" · ");

  return (
    <IconModal
      icon={<TrendingDown className="h-5 w-5" aria-hidden="true" />}
      overline={overline}
      title={
        nothingToDo
          ? fill(a.alreadyThere[k], { price: money(line.now, lang) })
          : fill(a.title[k], { price: line.target })
      }
      body={nothingToDo ? undefined : a.body[k]}
      width="580px"
      onClose={onClose}
      footer={
        nothingToDo ? (
          <Button onClick={onClose}>{a.close[k]}</Button>
        ) : (
          <>
            <Button variant="outline" onClick={onClose}>
              {a.cancel[k]}
            </Button>
            <Button onClick={() => onCreate(contract || undefined)}>
              {a.create[k]}
            </Button>
          </>
        )
      }
    >
      {!nothingToDo && (
        <div className="space-y-4">
          {/* A6 — an unpublished change on the same nights is replaced. */}
          {line.replacesDraft && (
            <p className="flex gap-2.5 rounded-xl border border-status-warning/25 bg-status-warning-bg p-3.5 text-[12.5px] leading-5 text-text-secondary">
              <AlertTriangle
                className="mt-0.5 h-4 w-4 shrink-0 text-status-warning"
                aria-hidden="true"
              />
              {fill(a.replaces[k], {
                count: arabicDigits(line.replacesDraft.nights, k === "ar"),
                price: money(line.replacesDraft.price, lang),
              })}
            </p>
          )}

          {/* #12 — the same room on the same dates under two contracts. */}
          {line.contracts && (
            <div className="rounded-xl border border-border-subtle p-3.5">
              <p className="text-overline text-text-muted">
                {a.whichContract[k]}
              </p>
              <RadioGroup
                className="mt-2.5"
                value={contract}
                onValueChange={setContract}
              >
                {line.contracts.map((option) => (
                  <label
                    key={option.name.en}
                    className="flex cursor-pointer items-center gap-3 rounded-[10px] px-2 py-2 text-sm hover:bg-surface-subtle"
                  >
                    <RadioGroupItem value={option.name[k]} />
                    <span className="text-text-primary">{option.name[k]}</span>
                    <span className="ms-auto font-data text-xs text-text-muted">
                      {fill(a.now[k] === "Now" ? "now {price}" : "الآن {price}", {
                        price: money(option.now, lang),
                      })}
                    </span>
                  </label>
                ))}
              </RadioGroup>
            </div>
          )}

          <div className="rounded-xl border border-border-subtle px-3.5">
            {/* A9 — a span with both kinds of night shows each one moving. */}
            {line.weekend && line.weekdayNights ? (
              <>
                <Row
                  label={fill(a.weekdays[k], { count: arabicDigits(line.weekdayNights, k === "ar") })}
                  value={`${line.now} → ${line.target}`}
                  tone="draft"
                />
                <Row
                  label={fill(a.weekendNights[k], {
                    count: arabicDigits(line.weekend.nights, k === "ar"),
                  })}
                  value={`${line.weekend.now} → ${line.target}`}
                  tone="draft"
                />
              </>
            ) : (
              <>
                <Row
                  label={a.now[k]}
                  value={money(line.now, lang)}
                  note={a.weekday[k]}
                />
                <Row
                  label={a.draft[k]}
                  value={money(line.target, lang)}
                  note={line.dates[k]}
                  tone="draft"
                />
              </>
            )}
            <Row
              label={a.minimum[k]}
              value={money(line.floor, lang)}
              note={a.respected[k]}
            />
            <Row label={line.board[k]} value={line.room[k]} />
          </div>

          {/* A9 — nights already cheap enough are left where they are. */}
          {line.alreadyBelow ? (
            <p className="text-[12px] leading-5 text-text-muted">
              {fill(a.alreadyBelow[k], {
                count: arabicDigits(line.alreadyBelow, k === "ar"),
                price: line.target,
              })}
            </p>
          ) : null}

          {/* BR-04W-12 / A10 — nationality groups and their own rules. */}
          <p className="text-[12px] leading-5 text-text-muted">
            {a.nationalityNote[k]}
          </p>
          {line.fixedNationality && (
            <p className="rounded-[10px] bg-surface-subtle px-3.5 py-2.5 text-[12px] leading-5 text-text-secondary">
              {fill(a.fixedKeeps[k], {
                name: line.fixedNationality.name[k],
                price: line.fixedNationality.price,
              })}
            </p>
          )}
        </div>
      )}
    </IconModal>
  );
}

/** OV 04.WD — dismiss a line, with an optional reason. */
export function DismissOverlay({
  onClose,
  onDismiss,
}: {
  onClose: () => void;
  onDismiss: (reason: string) => void;
}) {
  const { lang } = useLanguage();
  const k: Lang = lang === "ar" ? "ar" : "en";
  const d = dismissOverlay;
  const [reason, setReason] = useState("");
  const [other, setOther] = useState("");
  const isOther = reason === d.reasons[3]![k];
  const guard = useDiscardGuard(other.trim().length > 0, onClose);

  return (
    <Modal
      title={d.title[k]}
      meta={d.body[k]}
      onClose={guard.close}
      /* BR-00-08 - a typed reason keeps the panel open on a stray click. */
      dirty={other.trim().length > 0}
      onGuard={guard.ask}
      className="max-w-[520px]"
      footer={
        <>
          <Button variant="outline" onClick={guard.close}>
            {d.cancel[k]}
          </Button>
          <Button
            onClick={() => onDismiss(isOther ? other.trim() : reason)}
          >
            {d.confirm[k]}
          </Button>
        </>
      }
    >
      <RadioGroup value={reason} onValueChange={setReason}>
        {d.reasons.map((item) => (
          <label
            key={item.en}
            className="flex cursor-pointer items-center gap-3 rounded-[10px] border border-border-subtle p-3.5 text-sm text-text-primary"
          >
            <RadioGroupItem value={item[k]} />
            {item[k]}
          </label>
        ))}
      </RadioGroup>
      {guard.asking && (
        <DiscardGuard onKeep={guard.keep} onDiscard={guard.discard} />
      )}
      {/* A2 — Other opens a field, capped at 200 characters. */}
      {isOther && (
        <Input
          className="mt-3"
          maxLength={200}
          value={other}
          onChange={(event) => setOther(event.target.value)}
          placeholder={d.otherPlaceholder[k]}
        />
      )}
    </Modal>
  );
}

/** OV 04.WS — how often the list arrives, at account level. */
export function SettingsOverlay({
  mode,
  onClose,
  onSave,
}: {
  mode: WinMode;
  onClose: () => void;
  onSave: (mode: WinMode) => void;
}) {
  const { lang } = useLanguage();
  const k: Lang = lang === "ar" ? "ar" : "en";
  const s = settingsOverlay;
  const [picked, setPicked] = useState<WinMode>(mode);

  return (
    <Modal
      title={s.title[k]}
      meta={s.body[k]}
      onClose={onClose}
      className="max-w-[560px]"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {s.cancel[k]}
          </Button>
          <Button onClick={() => onSave(picked)}>{s.save[k]}</Button>
        </>
      }
    >
      <RadioGroup
        value={picked}
        onValueChange={(value) => setPicked(value as WinMode)}
      >
        {s.options.map((option) => (
          <label
            key={option.value}
            className={`flex cursor-pointer gap-3 rounded-xl border p-4 ${
              picked === option.value
                ? "border-primary bg-primary-subtle/40"
                : "border-border-subtle"
            }`}
          >
            <RadioGroupItem value={option.value} className="mt-0.5" />
            <span className="min-w-0">
              <b className="block text-sm text-text-primary">
                {option.label[k]}
              </b>
              <small className="mt-0.5 block text-xs leading-5 text-text-muted">
                {option.note[k]}
              </small>
            </span>
          </label>
        ))}
      </RadioGroup>
    </Modal>
  );
}
