/**
 * UI 10.5 — why a night is not selling, in the three sections BR-10-28 sets.
 *
 * Every screen that answers that question renders this, so none of them can
 * answer it differently: the calendar's drawer, the sell-status page, and
 * the dashboard's tile all hand it the same `blockers[]`.
 */

import { Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { StatusPill } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { fill, useLanguage } from "@/lib/i18n";
import {
  blockerCopy,
  blockerSpec,
  firstBlocker,
  groupBlockers,
  sells,
  type BlockerCode,
} from "@/lib/blockers";

/** BR-10-29 — the badge, which shows one blocker and never a list. */
export function BlockerBadge({ blockers }: { blockers: readonly BlockerCode[] }) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? ("ar" as const) : ("en" as const);
  const first = firstBlocker(blockers);

  if (!first) {
    return <StatusPill tone="success">{blockerCopy.sells[k]}</StatusPill>;
  }
  return <StatusPill tone="danger">{blockerSpec(first).name[k]}</StatusPill>;
}

export function BlockerList({
  blockers,
  /** Drawn once under the list, where the frame draws it. */
  note = true,
}: {
  blockers: readonly BlockerCode[];
  note?: boolean;
}) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? ("ar" as const) : ("en" as const);
  const sections = groupBlockers(blockers);

  if (sells(blockers)) {
    return (
      <div className="flex items-center gap-2.5 rounded-xl border border-status-success/25 bg-status-success-bg p-4">
        <CheckCircle2
          className="h-5 w-5 shrink-0 text-status-success"
          aria-hidden="true"
        />
        <p className="text-sm text-text-secondary">{blockerCopy.sells[k]}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <section key={section.clearedBy}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-overline text-text-muted">
              {blockerCopy[section.clearedBy][k]}
            </p>
            <span className="text-[11px] text-text-muted">
              {fill(blockerCopy.count[k], {
                n: section.items.length,
                total: blockers.length,
              })}
            </span>
          </div>
          <div className="mt-2 overflow-hidden rounded-xl border border-border-subtle">
            {section.items.map((spec) => (
              <div
                key={spec.code}
                className="flex flex-wrap items-center gap-3 border-b border-border-subtle p-3.5 last:border-b-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] font-semibold text-text-primary">
                    {spec.name[k]}
                  </p>
                  <p className="mt-0.5 text-[11.5px] leading-4 text-text-muted">
                    {spec.means[k]}
                  </p>
                  <code className="mt-1 block font-data text-[10px] text-text-muted">
                    {spec.code}
                  </code>
                </div>
                <Link to={spec.to} search={{} as never}>
                  <Button size="sm" variant="outline">
                    {spec.action[k]}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </section>
      ))}

      {note && (
        <p className="text-[11.5px] leading-4 text-text-muted">
          {blockerCopy.oneList[k]}
        </p>
      )}
    </div>
  );
}
