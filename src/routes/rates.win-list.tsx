/**
 * UI 04.W / 04.W0 / 04.W1 — the Win list, Flow 12 Row G.
 *
 * Three screens in one route, because the setting decides which one exists:
 * the weekly list, the off screen, and the on-request screen. The guide's
 * §6 states that no frame draws are here too — the empty week, the finished
 * week, and the account with no live contract.
 *
 * BR-04W-06 is the rule this screen has to keep no matter what: bands only.
 * No competitor is named, no competitor price is shown, and there is no
 * numeric ranking anywhere on it.
 */

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import {
  PageHeader,
  PageShell,
  SectionCard,
  StatusPill,
} from "@/components/layout/page-shell";
import {
  ApplyOverlay,
  DismissOverlay,
  SettingsOverlay,
} from "@/components/rates/win-list-overlays";
import { Gated, usePermission } from "@/components/system/permission-gate";
import { Button } from "@/components/ui/button";
import { arabicDigits } from "@/components/ui/date-field";
import { RowsSkeleton } from "@/components/ui/skeletons";
import { fill, useLanguage } from "@/lib/i18n";
import { money } from "@/lib/money";
import { notify } from "@/lib/notify";
import { cn } from "@/lib/utils";
import {
  applyOverlay,
  dismissOverlay,
  winCopy,
  winLines,
  type LineState,
  type WinLine,
  type WinMode,
} from "@/lib/win-list-data";

export const Route = createFileRoute("/rates/win-list")({
  /* The three screens are reachable directly, the way the 11.x states are. */
  validateSearch: (
    search: Record<string, unknown>
  ): { state?: "off" | "ask" | "empty" | "done" | "no-contract" } =>
    ["off", "ask", "empty", "done", "no-contract"].includes(
      String(search["state"])
    )
      ? { state: search["state"] as never }
      : {},
  head: () => ({
    meta: [
      { title: "Win list · Hoteliana Supplier Portal" },
      {
        name: "description",
        content:
          "Rooms and dates agents searched for and did not book from you, with the price that would put you in the cheapest three.",
      },
      { property: "og:title", content: "Win list · Hoteliana Supplier Portal" },
      {
        property: "og:description",
        content: "The weekly Win list, built from agent searches.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: WinListPage,
});

const DEMAND: Record<WinLine["demand"], keyof typeof winCopy> = {
  high: "high",
  medium: "medium",
};
const POSITION: Record<WinLine["position"], keyof typeof winCopy> = {
  top3: "top3",
  top5: "top5",
  outside: "outside",
};

/* The frame tints the middle card - this week's lines are the live number. */
function Kpi({
  label,
  value,
  note,
  tint = false,
}: {
  label: string;
  value: string;
  note: string;
  tint?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border-subtle p-4",
        tint ? "bg-[#edffd6]" : "bg-surface-default"
      )}
    >
      <p className="text-[10px] font-semibold uppercase text-text-quiet">
        {label}
      </p>
      <p className="mt-0.5 text-[22px] font-semibold text-text-primary">
        {value}
      </p>
      <p className="mt-0.5 text-[11px] text-text-body">{note}</p>
    </div>
  );
}

function WinListPage() {
  const { lang } = useLanguage();
  const k = lang === "ar" ? ("ar" as const) : ("en" as const);
  const navigate = useNavigate();
  const { state } = Route.useSearch();
  const { can } = usePermission();
  const c = winCopy;

  const [mode, setMode] = useState<WinMode>(
    state === "off" ? "off" : state === "ask" ? "onAsk" : "weekly"
  );
  const [building, setBuilding] = useState(false);
  const [built, setBuilt] = useState(state !== "ask");
  const [states, setStates] = useState<Record<string, LineState>>({});
  const [apply, setApply] = useState<WinLine | null>(null);
  const [dismiss, setDismiss] = useState<WinLine | null>(null);
  const [settings, setSettings] = useState(false);

  /* BR-04W-11 / E5 — applying writes a draft, so it needs the draft key. */
  const mayApply = can("rates.edit_draft");

  const lines = useMemo(
    () =>
      winLines
        .map((line) => ({ ...line, state: states[line.id] ?? line.state }))
        .filter((line) => line.state !== "dismissed" && line.state !== "expired"),
    [states]
  );

  const applied = Object.values(states).filter((s) => s === "draft").length;
  const dismissed = Object.values(states).filter((s) => s === "dismissed").length;

  const header = (
    <PageHeader
      overline={c.overline[k]}
      title={c.title[k]}
      subtitle={c.subtitle[k]}
      pill={
        mode === "off" ? (
          <StatusPill tone="neutral">{c.off[k]}</StatusPill>
        ) : mode === "onAsk" ? (
          <StatusPill tone="warning">{c.onRequest[k]}</StatusPill>
        ) : (
          <StatusPill tone="brand">{c.cadence[k]}</StatusPill>
        )
      }
      right={
        <>
          <Gated permission="rates.edit_draft" instead={null}>
            <Button variant="outline" onClick={() => setSettings(true)}>
              {c.settings[k]}
            </Button>
          </Gated>
          <Link to="/rate-calendar">
            <Button variant="outline">{c.backToRates[k]}</Button>
          </Link>
        </>
      }
    />
  );

  /* BR-04W-19 — no live contract, no list, whatever the setting says. */
  if (state === "no-contract") {
    return (
      <PageShell>
        {header}
        <Empty
          title={c.noContractTitle[k]}
          body={c.noContractBody[k]}
          action={
            <Link to="/rate-contracts">
              <Button>{c.openContracts[k]}</Button>
            </Link>
          }
        />
      </PageShell>
    );
  }

  /* UI 04.W0 — switched off. Searches are still counted. */
  if (mode === "off") {
    return (
      <PageShell>
        {header}
        <Empty
          title={c.offTitle[k]}
          body={c.offBody[k]}
          action={
            <Gated permission="rates.edit_draft" instead={null}>
              <Button onClick={() => setMode("weekly")}>{c.turnOn[k]}</Button>
            </Gated>
          }
        />
        {settings && (
          <SettingsOverlay
            mode={mode}
            onClose={() => setSettings(false)}
            onSave={(next) => {
              setMode(next);
              setSettings(false);
            }}
          />
        )}
      </PageShell>
    );
  }

  /* UI 04.W1 — on request, and nothing has been asked for yet. */
  if (mode === "onAsk" && !built) {
    return (
      <PageShell>
        {header}
        {building ? (
          <SectionCard>
            <p className="mb-4 text-sm text-text-secondary">{c.building[k]}</p>
            <RowsSkeleton rows={3} />
          </SectionCard>
        ) : (
          <Empty
            title={c.noListTitle[k]}
            body={c.noListBody[k]}
            action={
              <Gated permission="rates.edit_draft" instead={null}>
                <Button
                  onClick={() => {
                    setBuilding(true);
                    /* BR-04W-15 — "It takes a few seconds". */
                    window.setTimeout(() => {
                      setBuilding(false);
                      setBuilt(true);
                    }, 1400);
                  }}
                >
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  {c.getNow[k]}
                </Button>
              </Gated>
            }
          />
        )}
        {settings && (
          <SettingsOverlay
            mode={mode}
            onClose={() => setSettings(false)}
            onSave={(next) => {
              setMode(next);
              setSettings(false);
            }}
          />
        )}
      </PageShell>
    );
  }

  /* §6 #2 and #7 — a week with nothing to say, and a week fully answered. */
  const nothing = state === "empty" || lines.length === 0;
  const finished = state === "done" || (lines.length === 0 && applied + dismissed > 0);

  return (
    <PageShell>
      {header}

      {/* BR-04W-17 — the three tiles, and never a competitor's number. */}
      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <Kpi
          label={c.demandKpi[k]}
          value={c.demandValue[k]}
          note={fill(c.demandNote[k], { count: arabicDigits(3, k === "ar") })}
        />
        <Kpi
          tint
          label={c.linesKpi[k]}
          value={arabicDigits(lines.length, k === "ar")}
          note={c.linesNote[k]}
        />
        <Kpi
          label={c.lastKpi[k]}
          value={c.lastValue[k]}
          note={c.lastNote[k]}
        />
      </div>

      {nothing ? (
        <Empty
          title={finished ? c.doneTitle[k] : c.emptyTitle[k]}
          body={
            finished
              ? fill(c.doneBody[k], {
                  applied: arabicDigits(applied, k === "ar"),
                  dismissed: arabicDigits(dismissed, k === "ar"),
                })
              : c.emptyBody[k]
          }
          action={
            <Link to="/rate-calendar">
              <Button variant="outline">{c.backToRates[k]}</Button>
            </Link>
          }
        />
      ) : (
        <SectionCard bodyClassName="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] border-collapse text-sm">
              <thead>
                <tr className="bg-surface-subtle text-overline text-text-muted">
                  {[
                    c.colHotel[k],
                    c.colDates[k],
                    c.colDemand[k],
                    c.colPosition[k],
                    c.colTarget[k],
                    "",
                  ].map((cell, index) => (
                    <th
                      key={`${cell}-${index}`}
                      className={`px-4 py-3 font-semibold ${
                        index === 5 ? "text-end" : "text-start"
                      }`}
                    >
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lines.map((line) => (
                  <tr
                    key={line.id}
                    className="border-t border-border-subtle align-top"
                  >
                    <td className="px-4 py-2">
                      <p className="text-[12.5px] font-medium text-text-primary">
                        {line.hotel[k]}
                      </p>
                      <p className="mt-0.5 text-[11px] text-text-body">
                        {line.room[k]} · {line.board[k]}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 text-text-secondary">
                      {line.dates[k]}
                    </td>
                    {/* Demand is plain text; only the position is a pill. */}
                    <td className="px-4 py-2">
                      <p className="text-[12.5px] font-medium text-text-primary">
                        {c[DEMAND[line.demand]][k]}
                      </p>
                      <p className="mt-0.5 text-[11px] text-text-body">
                        {fill(c.yourBookings[k], {
                          count: arabicDigits(line.yourBookings, k === "ar"),
                        })}
                      </p>
                    </td>
                    <td className="px-4 py-2">
                      <StatusPill
                        tone={line.position === "outside" ? "danger" : "warning"}
                      >
                        {c[POSITION[line.position]][k]}
                      </StatusPill>
                    </td>
                    <td className="px-4 py-2">
                      <b className="text-[13px] font-semibold text-text-primary">
                        {/* The frame prints the bare number: "540 or less". */}
                        {fill(c.orLess[k], {
                          price: arabicDigits(
                            line.target.toLocaleString(k === "ar" ? "ar-EG" : "en-US"),
                            k === "ar"
                          ),
                        })}
                      </b>
                      {/* E4 — paused by Hoteliana, so nothing to apply. */}
                      {line.paused && (
                        <p className="mt-1 max-w-[260px] text-xs leading-4 text-text-muted">
                          {c.pausedNote[k]}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-end">
                      {line.state === "draft" ? (
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <StatusPill tone="neutral">
                            {c.draftCreated[k]}
                          </StatusPill>
                          <Link to="/rate-calendar">
                            <Button size="sm" variant="outline">
                              {c.review[k]}
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          {/* E5 — no key, no buttons, and a line says why. */}
                          {mayApply ? (
                            <>
                              {!line.paused && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setApply(line)}
                                >
                                  {c.apply[k]}
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setDismiss(line)}
                              >
                                {c.dismiss[k]}
                              </Button>
                            </>
                          ) : (
                            <span className="text-xs text-text-muted">
                              {c.cannotApply[k]}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-border-subtle p-4">
            <p className="text-[11px] leading-4 text-text-quiet">
              {c.disappearNote[k]}
            </p>
          </div>
        </SectionCard>
      )}

      {!nothing && (
        <p className="mt-4 rounded-xl bg-[#e8f1f8] p-4 text-[11.5px] leading-5 text-text-body">
          {c.builtAutomatically[k]}
        </p>
      )}

      {apply && (
        <ApplyOverlay
          line={apply}
          onClose={() => setApply(null)}
          onCreate={() => {
            setStates((current) => ({ ...current, [apply.id]: "draft" }));
            setApply(null);
            notify.success(
              fill(applyOverlay.toast[k], {
                price: money(apply.target, lang),
                room: apply.room[k],
                dates: apply.dates[k],
              })
            );
            void navigate({
              to: "/rate-calendar",
              search: { state: "draft" },
            } as never);
          }}
        />
      )}

      {dismiss && (
        <DismissOverlay
          onClose={() => setDismiss(null)}
          onDismiss={() => {
            const id = dismiss.id;
            setStates((current) => ({ ...current, [id]: "dismissed" }));
            setDismiss(null);
            /* A1 — dismissing is undoable for ten seconds. */
            notify.success(dismissOverlay.toast[k], {
              duration: 10_000,
              action: {
                label: dismissOverlay.undo[k],
                onClick: () =>
                  setStates((current) => {
                    const next = { ...current };
                    delete next[id];
                    return next;
                  }),
              },
            });
          }}
        />
      )}

      {settings && (
        <SettingsOverlay
          mode={mode}
          onClose={() => setSettings(false)}
          onSave={(next) => {
            setMode(next);
            setBuilt(next !== "onAsk");
            setSettings(false);
          }}
        />
      )}
    </PageShell>
  );
}

function Empty({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-border-subtle bg-surface-default px-6 py-16 text-center">
      <p className="text-lg font-semibold text-text-primary">{title}</p>
      <p className="max-w-[460px] text-sm leading-6 text-text-secondary">
        {body}
      </p>
      {action}
    </div>
  );
}
