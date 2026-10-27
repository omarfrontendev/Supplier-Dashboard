import { useMemo, useState } from "react";
import { AlertTriangle, CalendarDays, Check, Trash2 } from "lucide-react";

import { CancellationDrawer } from "@/components/contracts/policy-overlays";
import { Band, Part } from "@/components/contracts/season-page";
import { policyLines } from "@/components/contracts/contract-form/policies-summary";
import { seasonIssues, seasonOverlap } from "@/components/contracts/contract-form/schema";
import { AmountInput, formatAmount } from "@/components/contracts/contract-form/shared";
import { IconModal } from "@/components/layout/overlay";
import { Button } from "@/components/ui/button";
import { DateField, readableDay } from "@/components/ui/date-field";
import { addDays, dateOf } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { fill, useLanguage } from "@/lib/i18n";
import { seasonPolicy } from "@/lib/policy-overlay-data";
import { seasonPage } from "@/lib/season-page-data";
import { cn } from "@/lib/utils";
import { toAmount } from "@/store/features/contracts/contract-payload";
import {
  CHILD_RULES,
  SEASON_COLOURS,
  SEASON_NAME_MAX,
  type CancellationPolicy,
  type ChildRules,
  type SeasonRule,
} from "@/store/features/contracts/types";

const emptySeason = (): SeasonRule => ({
  id: `new-${Date.now()}`,
  name: "",
  startDate: "",
  endDate: "",
  color: SEASON_COLOURS[0],
  childPrices: { sharing_parents: "", shared_bed: "", extra_bed: "" },
  cancellation: null,
  keptPricing: null,
  issues: [],
});

export const seasonNights = (season: Pick<SeasonRule, "startDate" | "endDate">) =>
  season.startDate && season.endDate && season.endDate >= season.startDate
    ? Math.round((dateOf(season.endDate).getTime() - dateOf(season.startDate).getTime()) / 86_400_000) + 1
    : 0;

function nightsOf(seasons: SeasonRule[]) {
  const nights: string[] = [];
  for (const season of seasons) {
    if (!season.startDate || !season.endDate) continue;
    for (let day = season.startDate; day <= season.endDate && nights.length < 4000; day = addDays(day, 1)) {
      nights.push(day);
    }
  }
  return nights;
}

export function SeasonEditor({
  season,
  others,
  term,
  weekend,
  currency,
  contractChildren,
  contractPolicy,
  onSave,
  onRemove,
  onClose,
}: {
  season: SeasonRule | null;
  others: SeasonRule[];
  term: { startDate: string; endDate: string };
  weekend: number[];
  currency: string | null;
  contractChildren: ChildRules;
  contractPolicy: CancellationPolicy | null;
  onSave: (season: SeasonRule) => void;
  onRemove: (id: string) => void;
  onClose: () => void;
}) {
  const { c, lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const p = seasonPage;
  const f = c.builder.form;
  const [draft, setDraft] = useState<SeasonRule>(() => season ?? emptySeason());
  const [start] = useState(() => JSON.stringify(season ?? draft));
  const [tried, setTried] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);

  const day = (key: string) => readableDay(key, lang);
  const dirty = JSON.stringify(draft) !== start;
  const issues = seasonIssues(draft, others, term, f.v, day);
  const overlap = seasonOverlap(draft, others);
  const shown = tried ? issues : overlap ? issues.filter((message) => message.includes(overlap.season.name)) : [];
  const locked = useMemo(() => nightsOf(others), [others]);
  const nights = seasonNights(draft);
  const update = (patch: Partial<SeasonRule>) => setDraft((prev) => ({ ...prev, ...patch }));
  const requestClose = () => (dirty ? setConfirmClose(true) : onClose());

  const save = () => {
    setTried(true);
    if (issues.length > 0) return;
    onSave({ ...draft, name: draft.name.trim(), issues: [] });
  };

  const datesLabel = draft.startDate && draft.endDate ? `${day(draft.startDate)} – ${day(draft.endDate)}` : "";
  const policyPanel = seasonPolicy(
    draft.id,
    draft.name.trim() || p.newTitle.en,
    draft.name.trim() || p.newTitle.ar,
    datesLabel,
    datesLabel,
  );

  return (
    <IconModal
      width="960px"
      icon={<CalendarDays className="h-5 w-5" aria-hidden="true" />}
      overline={p.editorOverline[k]}
      title={season ? fill(p.title[k], { season: season.name }) : p.newTitle[k]}
      body={p.editorBody[k]}
      onClose={onClose}
      dirty={dirty}
      onGuard={() => setConfirmClose(true)}
      footer={
        <>
          {season && (
            <Button variant="ghost" onClick={() => setConfirmRemove(true)}>
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              {p.removeSeason[k]}
            </Button>
          )}
          <Button variant="outline" onClick={requestClose}>
            {p.cancel[k]}
          </Button>
          <Button onClick={save}>{p.save[k]}</Button>
        </>
      }
    >
      <Band label={p.section1[k]}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-[10px] font-medium uppercase tracking-[0.04em] text-text-muted">
              {p.nameLabel[k]}
            </span>
            <Input
              className="mt-1.5"
              value={draft.name}
              maxLength={SEASON_NAME_MAX + 20}
              placeholder={p.namePlaceholder[k]}
              onChange={(event) => update({ name: event.target.value })}
            />
            <span className="mt-1 block text-end text-[11px] text-text-muted">
              {fill("{count} / {max}", { count: draft.name.trim().length, max: SEASON_NAME_MAX })}
            </span>
          </label>
          <div>
            <DateField
              mode="range"
              label={p.datesLabel[k]}
              value={{ start: draft.startDate, end: draft.endDate || null }}
              placeholder={p.datesPlaceholder[k]}
              min={term.startDate}
              max={term.endDate}
              locked={locked}
              weekend={weekend}
              invalid={Boolean(overlap) || (tried && !nights)}
              onChange={(range) => update({ startDate: range.start, endDate: range.end })}
            />
            <span className="mt-1 block text-[11px] text-text-muted">
              {nights ? fill(p.datesHint[k], { nights }) : p.datesHintEmpty[k]}
            </span>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.04em] text-text-muted">
            {p.colourLabel[k]}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            {SEASON_COLOURS.map((colour) => (
              <button
                key={colour}
                type="button"
                aria-label={colour}
                aria-pressed={draft.color === colour}
                onClick={() => update({ color: colour })}
                style={{ backgroundColor: colour }}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full ring-offset-2 transition",
                  draft.color === colour ? "ring-2 ring-text-primary" : "hover:scale-105"
                )}
              >
                {draft.color === colour && <Check className="h-3.5 w-3.5 text-white" aria-hidden="true" />}
              </button>
            ))}
            <span className="ms-auto text-[11px] text-text-muted">{p.colourHint[k]}</span>
          </div>
        </div>
      </Band>

      <Band label={p.sectionPrices[k]}>
        <p className="rounded-[10px] bg-surface-subtle px-3.5 py-2.5 text-[12px] leading-5 text-text-secondary">
          {p.pricingPending[k]}
        </p>
        <Part title={p.childrenTitle[k]} body={p.childrenBody[k]}>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="text-overline text-text-muted">
                  <th className="py-2 text-start font-semibold">{p.colRule[k]}</th>
                  <th className="py-2 text-start font-semibold">{p.colContractPrice[k]}</th>
                  <th className="py-2 text-start font-semibold">{p.colSeasonPrice[k]}</th>
                </tr>
              </thead>
              <tbody>
                {CHILD_RULES.map((key) => {
                  const rule = contractChildren[key];
                  const contractPrice = toAmount(rule.price);
                  return (
                    <tr key={key} className="border-t border-border-subtle">
                      <td className="py-2.5 pe-3">
                        <p className="font-medium text-text-primary">{f.children.rules[key]}</p>
                        <p className="text-xs text-text-muted">
                          {fill(f.children.ageRange, { from: Number(rule.ageFrom), to: Number(rule.ageTo) })}
                        </p>
                      </td>
                      <td className="py-2.5 pe-3 text-text-secondary">
                        {key === "sharing_parents" || contractPrice === 0
                          ? f.children.free
                          : contractPrice === null
                            ? "—"
                            : formatAmount(contractPrice, lang, currency)}
                      </td>
                      <td className="py-2.5">
                        {key === "sharing_parents" ? (
                          <span className="text-sm font-medium text-brand-deep">{f.children.free}</span>
                        ) : (
                          <AmountInput
                            aria-label={`${f.children.rules[key]} · ${p.colSeasonPrice[k]}`}
                            className="max-w-[180px]"
                            {...(currency ? { suffix: currency } : {})}
                            placeholder={p.colContractPrice[k]}
                            value={draft.childPrices[key]}
                            onValue={(value) =>
                              update({ childPrices: { ...draft.childPrices, [key]: value } })
                            }
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Part>
      </Band>

      <Band label={p.sectionPolicy[k]}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-text-primary">
              {draft.cancellation ? p.policyOwn[k] : p.policyFromContract[k]}
            </p>
            {(draft.cancellation ?? contractPolicy) ? (
              <ul className="mt-1 space-y-0.5">
                {policyLines((draft.cancellation ?? contractPolicy)!, f.policies, lang, currency).map((line) => (
                  <li key={line} className="text-[12px] text-text-secondary">
                    {line}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-[12px] text-text-muted">{p.policyNoContract[k]}</p>
            )}
            <p className="mt-1.5 text-[11.5px] leading-4 text-text-muted">{p.policyHint[k]}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {draft.cancellation && (
              <Button variant="ghost" size="sm" onClick={() => update({ cancellation: null })}>
                {p.useContractPolicy[k]}
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => setPolicyOpen(true)}>
              {draft.cancellation ? p.editPolicy[k] : p.setPolicy[k]}
            </Button>
          </div>
        </div>
      </Band>

      {(shown.length > 0 || draft.issues.length > 0) && (
        <ul className="space-y-1">
          {shown.map((message) => (
            <li key={message} className="text-[12.5px] text-status-danger">
              {message}
            </li>
          ))}
          {draft.issues.map((issue) => (
            <li key={issue.code} className="text-[12.5px] text-status-warning">
              {issue.message}
            </li>
          ))}
        </ul>
      )}

      {policyOpen && (
        <CancellationDrawer
          season={policyPanel}
          initial={draft.cancellation ?? contractPolicy}
          currency={currency}
          onSave={(policy) => update({ cancellation: policy })}
          onClose={() => setPolicyOpen(false)}
        />
      )}

      {confirmClose && (
        <IconModal
          tone="danger"
          icon={<AlertTriangle className="h-5 w-5" aria-hidden="true" />}
          overline={p.editorOverline[k]}
          title={p.discardTitle[k]}
          body={p.discardBody[k]}
          onClose={() => setConfirmClose(false)}
          footer={
            <>
              <Button variant="outline" onClick={() => setConfirmClose(false)}>
                {p.keepEditing[k]}
              </Button>
              <Button variant="destructive" onClick={onClose}>
                {p.discard[k]}
              </Button>
            </>
          }
        />
      )}

      {confirmRemove && season && (
        <IconModal
          tone="danger"
          icon={<Trash2 className="h-5 w-5" aria-hidden="true" />}
          overline={p.editorOverline[k]}
          title={fill(p.removeTitle[k], { season: season.name })}
          body={p.removeBody[k]}
          onClose={() => setConfirmRemove(false)}
          footer={
            <>
              <Button variant="outline" onClick={() => setConfirmRemove(false)}>
                {p.removeKeep[k]}
              </Button>
              <Button variant="destructive" onClick={() => onRemove(season.id)}>
                {p.removeSeason[k]}
              </Button>
            </>
          }
        />
      )}
    </IconModal>
  );
}
