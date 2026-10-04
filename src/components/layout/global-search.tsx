/**
 * OV CH.1 — the search the magnifying glass in the bar opens.
 *
 * One field, and the answer underneath it grouped the way the portal is
 * grouped. It searches nothing on its own: every row comes from the same
 * data its own page reads, so a result can never disagree with the page
 * it opens.
 *
 * The guide asks for two characters before it starts and a pause before
 * it answers, both for the same reason — a list that rewrites itself on
 * every keystroke is unreadable while you are still typing.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { IconModal } from "@/components/layout/overlay";
import { usePermission } from "@/components/system/permission-gate";
import { useLanguage } from "@/lib/i18n";
import { fill } from "@/lib/i18n";
import {
  MIN_CHARS,
  searchCopy,
  searchPortal,
  type Hit,
} from "@/lib/global-search";

export function GlobalSearch({ onClose }: { onClose: () => void }) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? ("ar" as const) : ("en" as const);
  const c = searchCopy;
  const navigate = useNavigate();
  const { can } = usePermission();
  const seesGuest = can("guest.pii");

  const [term, setTerm] = useState("");
  /* The field answers a pause, not a keystroke. */
  const [settled, setSettled] = useState("");
  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const id = setTimeout(() => setSettled(term), 250);
    return () => clearTimeout(id);
  }, [term]);

  useEffect(() => {
    field.current?.focus();
  }, []);

  const groups = useMemo(
    () => searchPortal(settled, { lang: k, seesGuest }),
    [settled, k, seesGuest]
  );

  const short = settled.trim().length < MIN_CHARS;
  const nothing = !short && groups.length === 0;

  const open = (hit: Hit) => {
    onClose();
    switch (hit.kind) {
      case "booking":
        return navigate({
          to: "/bookings/$bookingId",
          params: { bookingId: hit.id },
        });
      case "change":
        return navigate({
          to: "/bookings/change-requests/$requestId",
          params: { requestId: hit.id },
        });
      case "contract":
        return navigate({
          to: "/rate-contracts/$contractId",
          params: { contractId: hit.id },
        });
      case "hotel":
        /* A hotel you are not linked to has no page of its own yet. */
        return hit.linked
          ? navigate({ to: "/hotel/$hotelId", params: { hotelId: hit.id } })
          : navigate({ to: "/hotels" });
      case "rate":
        return navigate({ to: "/rate-calendar" });
    }
  };

  const seeAll = (kind: Hit["kind"]) => {
    onClose();
    switch (kind) {
      case "booking":
        return navigate({ to: "/bookings" });
      case "change":
        return navigate({ to: "/bookings/change-requests" });
      case "contract":
        return navigate({ to: "/rate-contracts" });
      case "hotel":
        return navigate({ to: "/hotels" });
      case "rate":
        return navigate({ to: "/rate-calendar" });
    }
  };

  return (
    <IconModal
      width="760px"
      overline=""
      title={c.title[k]}
      body={c.body[k]}
      onClose={onClose}
    >
      <div className="flex items-center gap-2.5 rounded-xl border-2 border-brand-deep bg-surface-default px-3.5 py-2.5">
        <Search className="h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" />
        <input
          ref={field}
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          onKeyDown={(event) => {
            /* Enter opens the first thing it found, which is what the
               field is pointing at. */
            if (event.key !== "Enter") return;
            const first = groups[0]?.hits[0];
            if (first) {
              event.preventDefault();
              open(first);
            }
          }}
          placeholder={c.placeholder[k]}
          aria-label={c.title[k]}
          className="min-w-0 flex-1 bg-transparent text-[13px] text-text-primary outline-none placeholder:text-text-muted"
        />
      </div>

      <div className="max-h-[440px] overflow-y-auto">
        {short ? (
          <p className="py-6 text-center text-[12.5px] text-text-muted">
            {c.short[k]}
          </p>
        ) : nothing ? (
          <div className="py-6 text-center">
            <p className="text-[13px] font-medium text-text-primary">
              {fill(c.emptyTitle[k], { term: settled.trim() })}
            </p>
            <p className="mt-1 text-[12.5px] text-text-muted">
              {c.emptyBody[k]}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {groups.map((group) => (
              <div key={group.kind}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-overline text-text-muted">{group.label}</p>
                  <button
                    type="button"
                    onClick={() => seeAll(group.kind)}
                    className="text-[11.5px] font-medium text-text-link hover:underline"
                  >
                    {group.more > 0
                      ? fill(c.seeAllCount[k], {
                          count: group.hits.length + group.more,
                        })
                      : c.seeAll[k]}
                  </button>
                </div>
                <div className="mt-1.5 overflow-hidden rounded-xl border border-border-subtle">
                  {group.hits.map((hit) => (
                    <button
                      key={`${hit.kind}-${hit.id}`}
                      type="button"
                      onClick={() => open(hit)}
                      className="flex w-full flex-col items-start gap-0.5 px-3.5 py-2.5 text-start transition-colors hover:bg-surface-subtle [&:not(:first-child)]:border-t [&:not(:first-child)]:border-border-subtle"
                    >
                      <span className="text-[12.5px] font-semibold text-text-primary">
                        {hit.title}
                      </span>
                      <span className="text-[11.5px] text-text-muted">
                        {hit.meta}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* The line that says why something you expected is not here. */}
      <p className="text-[11.5px] leading-4 text-text-muted">{c.scope[k]}</p>
    </IconModal>
  );
}
