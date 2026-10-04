/**
 * OV 07.D — the finance menu, exactly where the guide puts it.
 *
 * "بيدوس على Finance → بيفتح OV 07.D تحت الزرار فيه 8px ومحاذي ليه. 3
 *  مجموعات MONEY و DOCUMENTS و SETTINGS. العنصر الحالي متعلّم active،
 *  وStatements عليه badge بعدد الكشوف اللي محتاجة مراجعة، وTax invoices
 *  عليه badge بعدد الفواتير الناقصة. بعدها بيدوس Overview."
 *
 * Two things follow from that, and both are easy to get wrong:
 *
 *   • **Finance is not a page.** Clicking it opens this menu on every screen
 *     - desktop, tablet, phone - and the Overview is reached by choosing
 *     Overview inside it. So the top-bar item never navigates on a click.
 *   • **The menu is the navigation**, so no finance page carries tabs. Which
 *     section you are in is marked here instead.
 *
 * A pointer that can hover opens it on hover as well, which is what a mega
 * menu is for; a click opens it either way.
 */

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { arabicDigits } from "@/components/ui/date-field";
import { fill, useLanguage } from "@/lib/i18n";
import { adjustments } from "@/lib/finance-pages";
import { statementCopy, statements } from "@/lib/statement-data";
import { cn } from "@/lib/utils";

/** Long enough not to flicker past the item, short enough not to feel stuck. */
const OPEN_DELAY = 90;
const CLOSE_DELAY = 220;

/**
 * A media query as state. It starts on the caller's assumption so the server
 * and the first client render agree, then settles on the real answer. The
 * panel is closed on that first render either way, so nothing can mismatch.
 */
function useMedia(query: string, initial = false): boolean {
  const [matches, setMatches] = useState(initial);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    const read = () => setMatches(mql.matches);
    read();
    mql.addEventListener("change", read);
    return () => mql.removeEventListener("change", read);
  }, [query]);
  return matches;
}

/* Hover is a bonus on a device that has it; the click path works anywhere. */
const useCanHover = () => useMedia("(hover: hover) and (pointer: fine)", true);

export interface FinanceBadge {
  count: number;
  label: string;
}

/**
 * §6 of the guide lists the counts this menu carries: statements waiting to
 * be reviewed, tax invoices still missing, and entries against you that
 * nobody has opened.
 */
export function financeBadges(lang: string): Record<string, FinanceBadge> {
  const k = lang === "ar" ? "ar" : "en";
  const toReview = statements.filter((item) => item.state === "open").length;
  const missing = statements.filter(
    (item) => item.state !== "open" && item.invoice?.state === "missing"
  ).length;
  const unopened = adjustments.filter(
    (item) => item.side === "against" && item.state === "open"
  ).length;

  const badges: Record<string, FinanceBadge> = {};
  if (toReview) {
    badges["statements"] = {
      count: toReview,
      label: fill(statementCopy.badgeStatements[k], { n: toReview }),
    };
  }
  if (missing) {
    badges["invoices"] = {
      count: missing,
      label: fill(statementCopy.badgeInvoices[k], { n: missing }),
    };
  }
  if (unopened) {
    badges["adjustments"] = {
      count: unopened,
      label: fill(statementCopy.badgeAdjustments[k], { n: unopened }),
    };
  }
  return badges;
}

/** The number the Finance item in the bar carries when something wants you. */
export function financeAttention(lang: string): number {
  return Object.values(financeBadges(lang)).reduce(
    (sum, badge) => sum + badge.count,
    0
  );
}

export function FinanceMegaMenu({
  /** The Finance item itself, rendered by the top bar so it keeps its styling. */
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { lang, dir } = useLanguage();
  const k = lang === "ar" ? ("ar" as const) : ("en" as const);
  const canHover = useCanHover();
  const narrow = useMedia("(max-width: 639px)");
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const [open, setOpen] = useState(false);
  /* Where the panel sits, in viewport coordinates - see the effect. */
  const [box, setBox] = useState({ top: 0, left: 0, right: 0 });
  const timer = useRef<number | undefined>(undefined);
  const wrap = useRef<HTMLDivElement | null>(null);

  const byKey = new Map(statementCopy.menu.map((item) => [item.key, item]));
  const badges = financeBadges(lang);

  const cancel = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = undefined;
  };
  const openSoon = () => {
    cancel();
    timer.current = window.setTimeout(() => setOpen(true), OPEN_DELAY);
  };
  const closeSoon = () => {
    cancel();
    timer.current = window.setTimeout(() => setOpen(false), CLOSE_DELAY);
  };

  /*
   * The panel is positioned in viewport coordinates and rendered `fixed`,
   * which is not a style choice: the nav rail scrolls horizontally, so it
   * carries `overflow: auto`, and an absolutely-positioned child of a
   * scroll container is clipped to it. The rail is 42px tall, so a panel
   * hanging below it was painted away entirely - present in the DOM,
   * invisible on screen.
   *
   * Wide: hangs 8px under the button, aligned to its edge. Narrow: a sheet
   * under the whole bar, so it never covers the rail it was opened from.
   */
  useEffect(() => {
    if (!open || !wrap.current) return;
    const place = () => {
      const anchor = wrap.current;
      if (!anchor) return;
      const rect = anchor.getBoundingClientRect();
      const bar = anchor.closest("header")?.getBoundingClientRect();
      setBox({
        top: Math.round((narrow ? (bar?.bottom ?? rect.bottom) : rect.bottom) + 8),
        left: Math.round(rect.left),
        /* clientWidth, not innerWidth: the latter counts the scrollbar,
           which threw the right-aligned Arabic panel off by its width. */
        right: Math.round(document.documentElement.clientWidth - rect.right),
      });
    };
    place();
    /* The rail scrolls under the pointer, so the anchor moves. */
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, narrow]);

  /* Arriving anywhere new closes it - including a link inside the panel. */
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => cancel, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!wrap.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div
      ref={wrap}
      className={cn("relative", className)}
      /* Always attached, and the handler decides: a conditional spread of
         handlers is easy to get subtly wrong, and a pointer can change kind
         mid-session on a laptop with a touchscreen. */
      onPointerEnter={(event) => {
        if (canHover && event.pointerType !== "touch") openSoon();
      }}
      onPointerLeave={(event) => {
        if (canHover && event.pointerType !== "touch") closeSoon();
      }}
      /* Tab or Shift+Tab into the item opens it too, so it is reachable. */
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setOpen(false);
        }
      }}
    >
      <div
        aria-haspopup="menu"
        aria-expanded={open}
        onClickCapture={(event) => {
          /*
           * Finance opens the menu and never a page, on every screen. The
           * item keeps its href so a middle-click or "open in a new tab"
           * still reaches the Overview - which is why this stays a Link -
           * but a plain click belongs to the menu.
           */
          if (event.metaKey || event.ctrlKey || event.shiftKey) return;
          event.preventDefault();
          event.stopPropagation();
          cancel();
          /*
           * On a pointer that hovers, hovering has already opened it by the
           * time the click lands - so a toggle here would shut the menu the
           * instant it was clicked, which reads as the button doing nothing.
           * Clicking opens; Escape, a click outside, choosing an item or
           * moving away all close. A touch device has no hover to have
           * opened it, so there a click has to toggle.
           */
          if (canHover) setOpen(true);
          else setOpen((current) => !current);
        }}
      >
        {children}
      </div>

      {open && (
        <div
          dir={dir}
          role="menu"
          aria-label={statementCopy.financeTitle[k]}
          className={cn(
            "fixed z-50 overflow-y-auto",
            narrow ? "inset-x-3" : "w-[340px] max-w-[calc(100vw-2rem)]"
          )}
          style={
            {
              top: box.top,
              maxHeight: `calc(100dvh - ${box.top}px - 1rem)`,
              /* Aligned to the button's leading edge, either direction. */
              ...(narrow
                ? {}
                : dir === "rtl"
                  ? { right: box.right }
                  : { left: box.left }),
            } as CSSProperties
          }
        >
          {/* The frame's own panel: 8px padding, 14px radius, 2px between
              children, and a 10px/30px/14% shadow. */}
          <div className="flex flex-col gap-0.5 rounded-[14px] border border-border-subtle bg-surface-default p-2 shadow-[0px_10px_30px_0px_rgba(0,0,0,0.14)]">
            {statementCopy.groups.map((group, index) => (
              <div key={group.key} className="contents">
                {/* A rule between groups, not before the first. */}
                {index > 0 && (
                  <div
                    aria-hidden="true"
                    className="my-1 h-px w-full bg-border-subtle"
                  />
                )}
                <p className="pb-1 pt-2 ps-3 text-[10px] font-semibold text-text-quiet">
                  {group.title[k]}
                </p>
                {group.items.map((key) => {
                  const item = byKey.get(key);
                  if (!item) return null;
                  const here =
                    item.to === "/finance"
                      ? pathname === "/finance"
                      : pathname.startsWith(item.to);
                  const badge = badges[key];
                  return (
                    <Link
                      key={key}
                      to={item.to}
                      search={{} as never}
                      role="menuitem"
                      aria-current={here ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-[10px] py-2.5 pe-2.5 ps-3 transition-colors hover:bg-surface-subtle",
                        here && "bg-primary-subtle hover:bg-primary-subtle"
                      )}
                    >
                      <img
                        src={`/icons/finance/${item.icon}.svg`}
                        alt=""
                        width={18}
                        height={18}
                        className="shrink-0"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13.5px] font-medium text-text-primary">
                          {item.label[k]}
                        </span>
                        <span className="mt-0.5 block text-[11px] leading-normal text-text-quiet">
                          {item.hint[k]}
                        </span>
                      </span>
                      {badge && (
                        <span
                          title={badge.label}
                          aria-label={badge.label}
                          className="shrink-0 rounded-full bg-status-warning-bg px-2.5 py-1 text-[12px] font-medium leading-[1.3] text-status-warning"
                        >
                          {arabicDigits(badge.count, k === "ar")}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * BR-07-05 — Flow 12 removed the running account and the old payments
 * pages. An old link should arrive at what replaced the screen.
 */
export const removedRoutes: Record<string, string> = {
  "/finance/account": "/finance",
  "/finance/running-account": "/finance",
  "/finance/movements": "/finance/statements",
};
