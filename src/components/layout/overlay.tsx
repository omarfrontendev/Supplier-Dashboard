import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * BR-00-08 - "\u0627\u0644\u0640 Modal \u0628\u064a\u062a\u0642\u0641\u0644 \u0628\u0640 Cancel \u0623\u0648 \u2715 \u0623\u0648 Esc. \u0627\u0644\u0636\u063a\u0637 \u0628\u0631\u0627 \u0628\u064a\u0642\u0641\u0644\u0647
 * \u0628\u0633 \u0644\u0648 \u0645\u0641\u064a\u0634 \u062d\u0627\u062c\u0629 \u0627\u062a\u0643\u062a\u0628\u062a". A modal holding typed input stays open, so the
 * work is never lost to a stray click or key - BR-00-09 then hands the screen
 * its own "Discard changes?" guard through `onGuard`.
 *
 * BR-00-07 was the opposite rule for the Drawer - \u2715 and nothing else, no
 * Esc, no click outside. It is overruled: one way out, learned once, for
 * every overlay in the portal.
 */
/**
 * Esc answers the overlay on top, and only that one.
 *
 * A guard opened over a form is two overlays listening at once, and with
 * a listener each the order they happened to mount in decided what
 * closed. They queue here instead: the last one opened is the first one
 * Esc reaches, and the one underneath is still there when it is gone.
 */
const escapeStack: Array<{ run: () => void }> = [];

function useEscape(onEscape: () => void, active = true) {
  const latest = useRef(onEscape);
  latest.current = onEscape;

  useEffect(() => {
    if (!active) return;
    /* Registered once per overlay, not once per render - a re-render
       must not shuffle the queue. */
    const entry = { run: () => latest.current() };
    escapeStack.push(entry);
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (escapeStack[escapeStack.length - 1] !== entry) return;
      entry.run();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      const at = escapeStack.indexOf(entry);
      if (at !== -1) escapeStack.splice(at, 1);
      document.removeEventListener("keydown", onKey);
    };
  }, [active]);
}

/**
 * Esc, and a click beside the panel — for every overlay in the portal.
 *
 * The scrim cannot test the click by itself. A centred panel needs a
 * wrapper to centre it, that wrapper fills the scrim, and a click in the
 * empty space lands on the wrapper rather than on the scrim - so a
 * `target === currentTarget` test on the scrim silently answered "that
 * was inside" to every click outside. The panel stops the event instead,
 * which is true however deeply it is nested.
 *
 * BR-00-08 keeps its exception: a panel holding typed input hands the
 * screen its "Discard changes?" guard rather than closing under it. That
 * is still a way out, only one that asks first.
 */
export function useDismiss({
  onClose,
  dirty = false,
  onGuard,
}: {
  onClose: () => void;
  dirty?: boolean | undefined;
  onGuard?: (() => void) | undefined;
}) {
  const dismiss = () => (dirty ? onGuard?.() : onClose());
  useEscape(dismiss);
  return {
    /** Spread on the fixed layer. */
    scrim: {
      role: "dialog" as const,
      "aria-modal": true,
      onMouseDown: dismiss,
    },
    /** Spread on the panel: a click inside it is not a click outside. */
    panel: {
      onMouseDown: (event: React.MouseEvent) => event.stopPropagation(),
    },
  };
}

/**
 * How an overlay arrives. The scrim fades, the panel rises into it, and
 * a reader who has asked for less movement gets none: the animation is
 * behind `motion-safe`, so without it the panel is simply there.
 */
export const scrimMotion =
  "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-200";
export const panelMotion =
  "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 motion-safe:slide-in-from-bottom-2 motion-safe:duration-200 motion-safe:ease-out";
/** A drawer comes in from the edge it is anchored to. */
export const drawerMotion = (dir: string) =>
  dir === "rtl"
    ? "motion-safe:animate-in motion-safe:slide-in-from-left motion-safe:duration-300 motion-safe:ease-out"
    : "motion-safe:animate-in motion-safe:slide-in-from-right motion-safe:duration-300 motion-safe:ease-out";

/** Centered modal, matching the overlay pattern in the Figma MVP screens. */
export function Modal({
  overline,
  title,
  meta,
  onClose,
  children,
  footer,
  className,
  dirty = false,
  onGuard,
}: {
  overline?: string;
  title: string;
  meta?: string;
  onClose: () => void;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
  /** BR-00-08 - something has been typed, so a click outside must not close. */
  dirty?: boolean | undefined;
  /** BR-00-09 - what to show instead: the screen's "Discard changes?" guard. */
  onGuard?: (() => void) | undefined;
}) {
  const { c, dir } = useLanguage();

  /* BR-00-08 - Esc and the scrim close a clean modal, and warn on a
     dirty one. */
  const dismiss = useDismiss({ onClose, dirty, onGuard });

  return (
    <div
      dir={dir}
      {...dismiss.scrim}
      className={cn(
        "fixed inset-0 z-50 overflow-y-auto bg-brand-deep/40 p-4",
        scrimMotion
      )}
    >
      {/* Centred, but a panel taller than the screen still scrolls to its top. */}
      <div className="flex min-h-full items-center justify-center">
      <div
        {...dismiss.panel}
        className={cn(
          "w-full max-w-xl rounded-[16px] bg-surface-default p-6 shadow-overlay",
          panelMotion,
          className
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {overline && (
              <p className="text-overline text-text-muted">{overline}</p>
            )}
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-text-primary">
              {title}
            </h2>
            {meta && <p className="mt-1 text-sm text-text-secondary">{meta}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={c.common.close}
            className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-surface-subtle hover:text-text-primary"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        {children && <div className="mt-5">{children}</div>}
        {footer && (
          <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

/**
 * OV 01.6B / 01.6J / 01.6K — the overlay that opens with a tinted icon tile
 * beside its title, a wider body and its actions at the foot.
 */
export function IconModal({
  icon,
  tone = "brand",
  overline,
  title,
  body,
  onClose,
  children,
  footer,
  width = "660px",
  dirty = false,
  onGuard,
}: {
  /** Some panels open with a tinted tile, some with the title alone. */
  icon?: ReactNode;
  tone?: "brand" | "danger";
  overline: string;
  title: string;
  /* OV 10.9B - the description slot sometimes carries a control rather
     than a sentence, so it takes a node as readily as a string. */
  body?: ReactNode;
  onClose: () => void;
  children?: ReactNode;
  footer?: ReactNode;
  width?: string;
  /** BR-00-08 - see `Modal`; this panel obeys the same rule. */
  dirty?: boolean | undefined;
  onGuard?: (() => void) | undefined;
}) {
  const { c, dir } = useLanguage();

  const dismiss = useDismiss({ onClose, dirty, onGuard });

  return (
    <div
      dir={dir}
      {...dismiss.scrim}
      className={cn(
        "fixed inset-0 z-50 overflow-y-auto bg-brand-deep/40 p-4",
        scrimMotion
      )}
    >
      {/* Centred, but a panel taller than the screen still scrolls to its top. */}
      <div className="flex min-h-full items-center justify-center">
      <div
        {...dismiss.panel}
        style={{ maxWidth: width }}
        className={cn(
          "flex w-full flex-col gap-[14px] rounded-[16px] bg-surface-default px-6 py-[22px] shadow-overlay",
          panelMotion
        )}
      >
        <div className="flex items-start gap-3">
          {icon && (
            <span
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]",
                tone === "danger"
                  ? "bg-status-danger-bg text-status-danger"
                  : "bg-primary-subtle text-brand-deep"
              )}
            >
              {icon}
            </span>
          )}
          <div className="min-w-0 flex-1 space-y-2">
            {overline && (
              <p className="text-overline text-brand-deep">{overline}</p>
            )}
            <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
              {title}
            </h2>
            {body && (
              <p className="whitespace-pre-line text-[13px] leading-5 text-text-secondary">
                {body}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={c.common.close}
            className="shrink-0 rounded-lg bg-surface-subtle px-2.5 py-1.5 text-xs font-medium text-text-primary transition-colors hover:bg-border-subtle"
          >
            ✕
          </button>
        </div>
        {children}
        {footer && (
          <div className="flex flex-wrap justify-end gap-2.5">{footer}</div>
        )}
      </div>
      </div>
    </div>
  );
}

/** The tinted box the overlays list their detail in. */
export function OverlaySummary({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-1.5 rounded-[10px] border border-border-subtle bg-surface-subtle px-3.5 py-3">
      {children}
    </div>
  );
}

/** Side drawer used for request details and the add-room flow. */
export function Drawer({
  overline,
  title,
  meta,
  onClose,
  children,
  footer,
  width = "520px",
  divider = true,
}: {
  overline?: string;
  title: string;
  meta?: string;
  onClose: () => void;
  children?: ReactNode;
  footer?: ReactNode;
  width?: string;
  /** OV 04.7 draws its head and foot with no rule across them. */
  divider?: boolean;
}) {
  const { c, dir } = useLanguage();

  /* BR-00-07 made the drawer's scrim inert - \u2715 and nothing else. The
     rule is overruled: every overlay in the portal now answers Esc and a
     click beside it, because a drawer that traps you where a modal lets
     you out is the kind of difference nobody can learn. */
  const dismiss = useDismiss({ onClose });

  return (
    <div
      dir={dir}
      {...dismiss.scrim}
      className={cn("fixed inset-0 z-50 flex bg-brand-deep/40", scrimMotion)}
    >
      <div aria-hidden="true" className="flex-1" />
      <aside
        {...dismiss.panel}
        style={{ width }}
        className={cn(
          "flex h-full max-w-full flex-col bg-surface-default shadow-drawer",
          drawerMotion(dir)
        )}
      >
        {/* OV 03.16 / 03.17 — the drawer head the frames draw. */}
        <div
          className={cn(
            "flex items-start justify-between gap-4 p-6",
            divider && "border-b border-border-subtle"
          )}
        >
          <div className="min-w-0">
            {overline && (
              <p className="text-[10px] font-medium uppercase tracking-[0.04em] text-status-success">
                {overline}
              </p>
            )}
            <h2 className="mt-1 text-[22px] font-semibold tracking-tight text-text-primary">
              {title}
            </h2>
            {meta && (
              <p className="mt-1 text-[12.5px] leading-5 text-text-muted">
                {meta}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={c.common.close}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-status-neutral-bg text-text-body transition-colors hover:bg-border-subtle"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-6">{children}</div>
        {footer && (
          <div
            className={cn(
              "flex flex-wrap items-center justify-end gap-3 p-6",
              divider && "border-t border-border-subtle"
            )}
          >
            {footer}
          </div>
        )}
      </aside>
    </div>
  );
}

/** Small vertical timeline shared by decision and request screens. */
export function Timeline({
  items,
}: {
  items: Array<{ title: string; note: string; state: "done" | "active" | "waiting" }>;
}) {
  return (
    <ol className="space-y-4">
      {items.map((item) => (
        <li key={item.title} className="flex gap-3">
          <span
            className={cn(
              "mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full",
              item.state === "done"
                ? "bg-status-success"
                : item.state === "active"
                  ? "bg-status-warning"
                  : "bg-border-default"
            )}
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-primary">{item.title}</p>
            <p className="mt-0.5 text-sm text-text-secondary">{item.note}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
