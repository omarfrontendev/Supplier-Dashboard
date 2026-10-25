import { useState } from "react";

import { useLinkedHotelRooms } from "@/api/modules/hotels/useLinkedHotelRooms";
import { ChoiceRow } from "@/components/contracts/contract-parts";
import {
  DeleteRestrictionOverlay,
  RestrictionDrawer,
} from "@/components/contracts/restriction-overlays";
import { StatusPill } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { readableDay } from "@/components/ui/date-field";
import { fill, useLanguage } from "@/lib/i18n";
import {
  removeRestriction,
  saveRestriction,
  setRestrictionsEnabled,
} from "@/store/features/contracts/contract-draft.slice";
import type { RestrictionRule } from "@/store/features/contracts/types";
import { contractIssuesFor } from "./schema";
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
  const issues = contractIssuesFor(draft, f.v, "restrictions");

  const roomOptions = rooms.map((room) => ({
    value: String(room.id),
    label: roomLabel(room, lang, f),
  }));
  const roomName = (rule: RestrictionRule) =>
    rule.roomId === null
      ? r.roomPh
      : (roomOptions.find((room) => room.value === String(rule.roomId))?.label ??
        `#${rule.roomId}`);

  const checksText = (rule: RestrictionRule) => {
    const parts = [
      rule.closedCheckIn.length > 0 && fill(r.closedIn, { count: rule.closedCheckIn.length }),
      rule.closedCheckOut.length > 0 && fill(r.closedOut, { count: rule.closedCheckOut.length }),
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(" · ") : r.allOpen;
  };

  return (
    <>
      <ChoiceRow
        value={restrictions.enabled ? "add" : "none"}
        onChange={(next) => dispatch(setRestrictionsEnabled(next === "add"))}
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
              <table className="w-full min-w-[820px] border-collapse text-sm">
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
                  {restrictions.rules.map((rule) => (
                    <tr key={rule.id} className="border-t border-border-subtle align-top">
                      <td className="py-3 pe-3">
                        <p className="text-text-primary">{roomName(rule)}</p>
                        {rule.appliesOn === "weekend_only" && (
                          <p className="mt-0.5 text-xs text-text-muted">{r.weekendTag}</p>
                        )}
                      </td>
                      <td className="py-3 pe-3 text-text-secondary">
                        {readableDay(rule.startDate, lang)} – {readableDay(rule.endDate, lang)}
                      </td>
                      <td className="py-3 pe-3 text-text-secondary">
                        {fill(r.minNights, { count: rule.minNights })}
                      </td>
                      <td className="py-3 pe-3 text-text-secondary">{checksText(rule)}</td>
                      <td className="py-3 pe-3">
                        <StatusPill tone={rule.active ? "success" : "neutral"}>
                          {rule.active ? t.active : t.inactive}
                        </StatusPill>
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
          onSave={(rule) => dispatch(saveRestriction(rule))}
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
