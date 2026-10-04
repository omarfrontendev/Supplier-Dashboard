import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";

/** The five tabs of the Property section, in the order the frame draws them. */
const TABS = [
  "/my-hotels",
  "/rate-contracts",
  "/hotels",
  "/requests",
  "/agreement",
] as const;

/**
 * Every page that carries the bar: the five tabs, plus two pages reached
 * from inside them. Neither is a tab of its own, but both belong to the
 * section and need the way back.
 *
 * Matched exactly, so a page below a tab - a single contract, say - does
 * not carry it. Those pages have a back link instead.
 */
const BAR = [...TABS, "/sell-status", "/information-requests"] as string[];

/** Whether this route carries the Property bar. `PageHeader` asks. */
export function usePropertyBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return BAR.includes(pathname);
}

/**
 * The Property section's tabs.
 *
 * `PageHeader` renders this, not the routes - that is the whole point. It
 * used to be pasted into each page by hand and sat above the title on six
 * of them and below it on the seventh, so the section's own navigation
 * moved as you walked through the section. Now it has one place: under
 * the title and its sentence, on every page that carries it.
 *
 * The active tab is filled directly. It used to be a measured pill that
 * slid between tabs, which meant a ResizeObserver, a font-ready callback
 * and a 300ms animation - all of it to move a rectangle the eye had
 * already found.
 */
export function PropertyTabs() {
  const { c } = useLanguage();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const tabs = [
    { to: TABS[0], label: c.nav.myHotels },
    { to: TABS[1], label: c.contracts.tab },
    { to: TABS[2], label: c.nav.hotelLibrary },
    { to: TABS[3], label: c.requests.tab },
    { to: TABS[4], label: c.nav.agreement },
  ] as const;

  /* A page below a tab keeps its tab lit, so the section still says
     where you are even where the bar itself is not drawn. */
  const activeTo = tabs.find(
    (tab) => pathname === tab.to || pathname.startsWith(`${tab.to}/`)
  )?.to;

  return (
    <nav className="scrollbar-none mb-6 flex max-w-full items-center gap-1 overflow-x-auto rounded-xl border border-border-subtle bg-surface-default p-1 shadow-card sm:w-fit">
      {tabs.map((tab) => {
        const isActive = tab.to === activeTo;
        return (
          <Link
            key={tab.to}
            to={tab.to}
            className={cn(
              "shrink-0 whitespace-nowrap rounded-lg px-4 py-2 text-sm",
              isActive
                ? "bg-surface-inverse font-semibold text-text-inverse"
                : "font-medium text-text-secondary hover:text-text-primary"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
