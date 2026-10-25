import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

import { useLinkedHotelRooms } from "@/api/modules/hotels/useLinkedHotelRooms";
import { ChoiceRow } from "@/components/contracts/contract-parts";
import {
  DeleteRestrictionOverlay,
  RestrictionDrawer,
} from "@/components/contracts/restriction-overlays";
import { IconModal } from "@/components/layout/overlay";
import { StatusPill } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { notify } from "@/lib/notify";
import { cn } from "@/lib/utils";
import { readableDay } from "@/components/ui/date-field";
import { fill, useLanguage } from "@/lib/i18n";
import {
  removeRestriction,
  saveRestriction,
  setRestrictionsEnabled,
} from "@/store/features/contracts/contract-draft.slice";
import type { RestrictionRule } from "@/store/features/contracts/types";
import { conflictingRestriction, contractIssuesFor, restrictionConflict } from "./schema";
import { roomLabel, useAppDispatch, useContractDraft } from "./shared";

export function RestrictionsFields() {
  const { c, lang } = useLanguage();
  const t = c.builder;
  const f = t.form;
  const r = f.restrictions;
  const dispatch = useAppDispatch();
  const draft = useContractDraft();
  const { basics, restrictions } = draft;
  const { rooms } = useLinkedHotelRooms(basics.hotelId);
  const [editing, setEditing] = useState<RestrictionRule | "new" | null>(null);
  const [deleting, setDeleting] = useState<RestrictionRule | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [conflictId, setConflictId] = useState<string | null>(null);
  const [confirmNone, setConfirmNone] = useState(false);

  useEffect(() => {
    if (!savedId && !conflictId) return;
    const timer = window.setTimeout(() => {
      setSavedId(null);
      setConflictId(null);
    }, 1600);
    return () => window.clearTimeout(timer);
  }, [savedId, conflictId]);
  const issues = contractIssuesFor(draft, f.v, "restrictions");
  const sortedRules = [...restrictions.rules].sort(
    (a, b) => a.startDate.localeCompare(b.startDate) || a.endDate.localeCompare(b.endDate),
  );

  const roomOptions = rooms.map((room) => ({
    value: String(room.id),
    label: roomLabel(room, lang, f),
  }));
  const roomName = (rule: RestrictionRule) =>
    rule.roomId === null
      ? r.roomPh
      : (roomOptions.find((room) => room.value === String(rule.roomId))?.label ??
        `#${rule.roomId}`);

  const dayNames = (days: RestrictionRule["closedCheckIn"]) =>
    days.map((day) => f.days[day]).join(lang === "ar" ? "، " : ", ");
  const checksText = (rule: RestrictionRule) => {
    const parts = [
      rule.closedCheckIn.length > 0 && fill(r.closedIn, { days: dayNames(rule.closedCheckIn) }),
      rule.closedCheckOut.length > 0 && fill(r.closedOut, { days: dayNames(rule.closedCheckOut) }),
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(" · ") : r.allOpen;
  };
  const describe = (rule: RestrictionRule) =>
    `${roomName(rule)} · ${readableDay(rule.startDate, lang)} – ${readableDay(rule.endDate, lang)}`;
  const toggleActive = (rule: RestrictionRule) => {
    const next = { ...rule, active: !rule.active };
    const conflict = restrictionConflict(next, restrictions.rules, f.v, describe);
    if (conflict) {
      notify.error(conflict);
      setConflictId(conflictingRestriction(next, restrictions.rules)?.rule.id ?? null);
      return;
    }
    dispatch(saveRestriction(next));
  };

  return (
    <>
      <ChoiceRow
        value={restrictions.enabled ? "add" : "none"}
        onChange={(next) => {
          if (next === "none" && restrictions.rules.length > 0) {
            setConfirmNone(true);
            return;
          }
          dispatch(setRestrictionsEnabled(next === "add"));
        }}
        options={[
          { value: "add", label: t.addToContract },
          { value: "none", label: t.noneOnContract },
        ]}
      />
      {!restrictions.enabled && (
        <p className="mt-3 text-xs leading-relaxed text-text-muted">{t.restrictionsNone}</p>
      )}

      {restrictions.enabled && (
        <>
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={() => setEditing("new")}>
              {t.addRestriction}
            </Button>
          </div>

          {restrictions.rules.length === 0 ? (
            <p className="mt-4 text-sm text-text-muted">{r.empty}</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[820px] table-fixed border-collapse text-sm">
                <colgroup>
                  <col className="w-[22%]" />
                  <col className="w-[19%]" />
                  <col className="w-[12%]" />
                  <col />
                  <col className="w-[150px]" />
                  <col className="w-[130px]" />
                </colgroup>
                <thead>
                  <tr className="text-overline text-text-muted">
                    {[t.colApplies, t.colDates, t.colMinNights, t.colChecks, t.colStatus].map(
                      (cell) => (
                        <th key={cell} className="py-2 text-start font-semibold">
                          {cell}
                        </th>
                      ),
                    )}
                    <th className="py-2 text-end font-semibold" />
                  </tr>
                </thead>
                <tbody>
                  {sortedRules.map((rule) => (
                    <tr
                      key={rule.id}
                      className={cn(
                        "border-t border-border-subtle align-top transition-colors duration-700",
                        savedId === rule.id && "bg-primary-subtle",
                        conflictId === rule.id && "bg-status-danger-bg",
                      )}
                    >
                      <td className={cn("py-3 pe-3", !rule.active && "opacity-55")}>
                        <p className="text-text-primary">{roomName(rule)}</p>
                        {rule.appliesOn === "weekend_only" && (
                          <p className="mt-0.5 text-xs text-text-muted">{r.weekendTag}</p>
                        )}
                      </td>
                      <td className={cn("py-3 pe-3 text-text-secondary", !rule.active && "opacity-55")}>
                        {readableDay(rule.startDate, lang)} – {readableDay(rule.endDate, lang)}
                      </td>
                      <td className={cn("py-3 pe-3 text-text-secondary", !rule.active && "opacity-55")}>
                        {Number(rule.minNights) > 1
                          ? fill(r.minNights, { count: rule.minNights })
                          : r.minNone}
                      </td>
                      <td className={cn("py-3 pe-3 text-text-secondary", !rule.active && "opacity-55")}>
                        {checksText(rule)}
                      </td>
                      <td className="py-3 pe-3">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={rule.active}
                            aria-label={`${r.statusToggle} · ${describe(rule)}`}
                            onCheckedChange={() => toggleActive(rule)}
                          />
                          <span className="inline-flex min-w-[76px]">
                            <StatusPill tone={rule.active ? "success" : "neutral"}>
                              {rule.active ? t.active : t.inactive}
                            </StatusPill>
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-end">
                        <Button variant="ghost" size="sm" onClick={() => setEditing(rule)}>
                          {t.edit}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-status-danger"
                          onClick={() => setDeleting(rule)}
                        >
                          {t.delete}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="mt-2 text-xs leading-relaxed text-text-muted">{t.restrictionsNote}</p>
          {issues.length > 0 && (
            <ul className="mt-3 space-y-1">
              {issues.map((message) => (
                <li key={message} className="text-[12.5px] text-status-danger">
                  {message}
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {editing && (
        <RestrictionDrawer
          mode={editing === "new" ? "add" : "edit"}
          initial={editing === "new" ? null : editing}
          rooms={roomOptions}
          term={{ startDate: basics.startDate, endDate: basics.endDate }}
          weekendDays={basics.weekendDays}
          others={restrictions.rules}
          describe={describe}
          onConflict={setConflictId}
          onSave={(rule) => {
            dispatch(saveRestriction(rule));
            setSavedId(rule.id);
            notify.success(editing === "new" ? r.added : r.updated);
          }}
          onClose={() => setEditing(null)}
          {...(editing === "new"
            ? {}
            : {
                onDelete: () => {
                  setDeleting(editing);
                  setEditing(null);
                },
              })}
        />
      )}
      {confirmNone && (
        <IconModal
          tone="danger"
          icon={<AlertTriangle className="h-5 w-5" aria-hidden="true" />}
          overline={r.overline}
          title={fill(r.noneTitle, { count: restrictions.rules.length })}
          body={r.noneBody}
          onClose={() => setConfirmNone(false)}
          footer={
            <>
              <Button variant="outline" onClick={() => setConfirmNone(false)}>
                {r.noneKeep}
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  dispatch(setRestrictionsEnabled(false));
                  setConfirmNone(false);
                }}
              >
                {r.noneConfirm}
              </Button>
            </>
          }
        />
      )}
      {deleting && (
        <DeleteRestrictionOverlay
          onClose={() => setDeleting(null)}
          onConfirm={() => {
            dispatch(removeRestriction(deleting.id));
            setDeleting(null);
          }}
        />
      )}
    </>
  );
}
