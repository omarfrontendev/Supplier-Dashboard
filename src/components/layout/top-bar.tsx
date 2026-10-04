import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useLanguage } from "@/lib/i18n";
import { PREF_NAV_LABELS, useStoredPref } from "@/lib/prefs";
import { arabicDigits } from "@/components/ui/date-field";
import { FinanceMegaMenu, financeAttention } from "./finance-mega-menu";
import { cn } from "@/lib/utils";
import { HotelianaWordmark } from "@/components/brand/hoteliana-logo";
import {
  IconBookings,
  IconDashboard,
  IconFinance,
  IconLanguage,
  IconNotifications,
  IconProperty,
  IconRateCalendar,
  IconSearch,
  IconTeamAccess,
  IconToggle,
} from "@/components/icons/portal-icons";
import { Building2, ChevronDown, Compass, Globe, Hotel, LifeBuoy, LogOut } from "lucide-react";
import { NotificationCenter } from "@/components/system/notification-center";
import { GlobalSearch } from "@/components/layout/global-search";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";

export function TopBar() {
  const { c, lang, toggleLang } = useLanguage();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [expanded, setExpanded] = useStoredPref<boolean>(PREF_NAV_LABELS, true);
  const desktopNavRef = useRef<HTMLElement>(null);
  const [labelsFit, setLabelsFit] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  /* OV CH.1 - the search the glass opens, and the "/" the guide asks for. */
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey) return;
      const target = event.target as HTMLElement | null;
      /* Someone typing a "/" into a field means the character. */
      const typing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;
      if (typing) return;
      event.preventDefault();
      setSearchOpen(true);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Labels are only shown when the whole nav rail can hold them; otherwise
  // items would scroll out of view and look like missing menu entries.
  useEffect(() => {
    const nav = desktopNavRef.current;
    if (!nav) return;
    const measure = () => {
      nav.dataset["measuring"] = "true";
      const fits = nav.scrollWidth <= nav.clientWidth + 1;
      delete nav.dataset["measuring"];
      setLabelsFit(fits);
    };
    measure();
    const raf = requestAnimationFrame(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(nav);
    document.fonts?.ready.then(measure).catch(() => undefined);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [lang, expanded]);

  const items = [
    { key: "dashboard", label: c.nav.dashboard, Icon: IconDashboard, to: "/dashboard" },
    { key: "bookings", label: c.nav.bookings, Icon: IconBookings, to: "/bookings" },
    { key: "rates", label: c.nav.rateCalendar, Icon: IconRateCalendar, to: "/rate-calendar" },
    { key: "property", label: c.nav.property, Icon: IconProperty, to: "/agreement" },
    { key: "finance", label: c.nav.finance, Icon: IconFinance, to: "/finance" },
    { key: "team", label: c.nav.teamAccess, Icon: IconTeamAccess, to: "/team" },
  ] as const;

  const itemBase =
    "flex shrink-0 items-center gap-2 rounded-full px-3 py-[11px] text-[13px] font-medium transition-colors";
  const itemIdle = "text-text-muted hover:bg-surface-subtle hover:text-text-primary";
  const itemActive = "bg-surface-inverse text-text-inverse [&_svg]:text-primary";
  const propertyPaths = ["/agreement", "/my-hotels", "/hotels", "/hotel", "/requests", "/rate-contracts", "/sell-status", "/information-requests"];


  function NavItems({ showLabels }: { showLabels: boolean }) {
    const labelClass = cn(
      "whitespace-nowrap",
      showLabels ? "inline" : "hidden [nav[data-measuring]_&]:inline",
    );
    return (
      <>
        {items.map(({ key, label, Icon, to }) => {
          const here =
            key === "property"
              ? propertyPaths.some(
                (p) => pathname === p || pathname.startsWith(`${p}/`)
              )
              : pathname === to || pathname.startsWith(`${to}/`);
          /* The guide puts a count on Finance when something wants you. */
          const wants = key === "finance" ? financeAttention(lang) : 0;
          const link = (
            <Link
              key={key}
              to={to}
              title={label}
              aria-label={label}
              className={cn(itemBase, here ? itemActive : itemIdle)}
            >
              <Icon />
              <span className={labelClass}>{label}</span>
              {wants > 0 && (
                <span
                  className={cn(
                    "rounded-full px-1.5 text-[10px] font-semibold",
                    here
                      ? "bg-primary text-primary-foreground"
                      : "bg-status-warning-bg text-status-warning"
                  )}
                >
                  {arabicDigits(wants, lang === "ar")}
                </span>
              )}
            </Link>
          );
          /* OV 07.D - Finance opens its eight sections from the bar itself. */
          return key === "finance" ? (
            <FinanceMegaMenu key={key} className="shrink-0">
              {link}
            </FinanceMegaMenu>
          ) : (
            link
          );
        })}
      </>
    );
  }

  const actions = (
    <>
      <ActionButton
        label={expanded ? c.nav.hideLabels : c.nav.showLabels}
        onClick={() => setExpanded((v) => !v)}
        active={expanded}
      >
        <IconToggle />
      </ActionButton>

      <ActionButton label={c.nav.search} onClick={() => setSearchOpen(true)}>
        <IconSearch />
      </ActionButton>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={`${c.nav.language} · ${c.common.langLabel}`}
            className="flex h-9 w-9 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-surface-subtle hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
          >
            <IconLanguage />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[300px]">
          <DropdownMenuLabel className="text-overline text-text-muted">{c.account.languageOverline}</DropdownMenuLabel>
          <DropdownMenuItem className="cursor-pointer gap-2.5" onSelect={() => lang !== "en" && toggleLang()}>
            <Globe className="h-4 w-4 text-text-muted" aria-hidden="true" />
            <span className="flex min-w-0 flex-col">
              <span>{c.account.languageEnglish}</span>
              <span className="text-[11px] text-text-muted">{c.account.languageEnglishHint}</span>
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer gap-2.5" onSelect={() => lang !== "ar" && toggleLang()}>
            <Globe className="h-4 w-4 text-text-muted" aria-hidden="true" />
            <span className="flex min-w-0 flex-col">
              <span>{c.account.languageArabic}</span>
              <span className="text-[11px] text-text-muted">{c.account.languageArabicHint}</span>
            </span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <p className="px-2 py-2 text-[11px] leading-4 text-text-muted">{c.account.languageNote}</p>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="relative">
        <ActionButton label={c.nav.notifications} onClick={() => setNotificationsOpen(true)}>
          <IconNotifications />
        </ActionButton>
        <span className="absolute -end-0.5 -top-0.5 h-[6px] w-[6px] rounded-full bg-destructive ring-2 ring-surface-default" />
      </div>
    </>
  );

  const profile = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={c.account.menu}
          className="flex min-w-0 max-w-full shrink-0 items-center gap-2.5 rounded-full bg-surface-subtle py-1.5 pe-2.5 ps-1.5 transition-colors hover:bg-border-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 data-[state=open]:bg-border-subtle"
        >
          <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-brand-deep text-xs font-medium text-text-inverse">
            AN
          </span>
          <span className="flex min-w-0 flex-col items-start leading-tight">
            <span className="truncate text-xs font-medium text-text-primary">
              {c.nav.profileName}
            </span>
            <span className="truncate text-[11px] text-text-muted">
              {c.common.supplierShort}
            </span>
          </span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-text-muted" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[264px]">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-text-primary">{c.nav.profileName}</span>
          <span className="text-xs font-normal text-text-muted">{c.account.ownerLine}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link to="/agreement" className="cursor-pointer gap-2.5">
            <Building2 className="h-4 w-4 text-text-muted" aria-hidden="true" />
            <span className="flex min-w-0 flex-col">
              <span>{c.account.companyMenu}</span>
              <span className="text-[11px] text-text-muted">{c.account.companyHint}</span>
            </span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to="/getting-started" className="cursor-pointer gap-2.5">
            <Compass className="h-4 w-4 text-text-muted" aria-hidden="true" />
            <span className="flex min-w-0 flex-col">
              <span>{c.account.gettingStarted}</span>
              <span className="text-[11px] text-text-muted">{c.account.gettingStartedHint}</span>
            </span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to="/cases" className="cursor-pointer gap-2.5">
            <LifeBuoy className="h-4 w-4 text-text-muted" aria-hidden="true" />
            <span className="flex min-w-0 flex-col">
              <span>{c.account.cases}</span>
              <span className="text-[11px] text-text-muted">{c.account.casesHint}</span>
            </span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to="/hotels" className="cursor-pointer gap-2.5">
            <Hotel className="h-4 w-4 text-text-muted" aria-hidden="true" />
            <span className="flex min-w-0 flex-col">
              <span>{c.account.hotels}</span>
              <span className="text-[11px] text-text-muted">{c.account.hotelsHint}</span>
            </span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Button
            onClick={() => {
              localStorage.removeItem("authToken");
              navigate({ to: "/login" });
            }}
            className="cursor-pointer gap-2.5 text-status-danger bg-transparent flex justify-start w-full">
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span className="flex min-w-0 flex-col">
              <span className="text-start">{c.account.signOut}</span>
              <span className="text-[11px] text-text-muted">{c.account.signOutHint}</span>
            </span>
          </Button>
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border-subtle bg-surface-default">
        {/* Mobile / tablet: brand and profile, actions, then an independently scrollable nav rail */}
        <div className="flex flex-col gap-3 px-4 py-3 md:hidden">
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border-subtle pb-3">
            <Link
              to="/getting-started"
              className="min-w-0 justify-self-start text-brand-deep"
              aria-label={c.common.brand}
            >
              <HotelianaWordmark height={18} className="max-w-full" />
            </Link>

            <div className="min-w-0 max-w-[168px] justify-self-end">{profile}</div>
          </div>

          <div className="flex items-center justify-center gap-2">
            {actions}
          </div>

          <nav
            className="scrollbar-none -mx-4 min-w-0 overflow-x-auto overscroll-x-contain border-t border-border-subtle px-4 pt-3 touch-pan-x"
            aria-label={c.common.supplierPortal}
          >
            <div className="flex w-max min-w-full items-center gap-1.5">
              <NavItems showLabels={expanded} />
            </div>
          </nav>
        </div>

        {/* Desktop */}
        <div className="hidden h-[72px] items-center gap-3 px-4 sm:px-7 md:flex">
          <Link to="/getting-started" className="shrink-0 text-brand-deep">
            <HotelianaWordmark height={22} />
            <span className="sr-only">{c.common.brand}</span>
          </Link>

          <nav
            ref={desktopNavRef}
            className="scrollbar-none flex min-w-0 flex-1 items-center justify-center gap-1.5 overflow-x-auto"
            aria-label={c.common.supplierPortal}
          >
            <NavItems showLabels={expanded && labelsFit} />
          </nav>

          <div className="flex shrink-0 items-center gap-1.5">
            {actions}
            {profile}
          </div>
        </div>
      </header>
      {notificationsOpen && <NotificationCenter onClose={() => setNotificationsOpen(false)} />}
      {searchOpen && <GlobalSearch onClose={() => setSearchOpen(false)} />}
    </>
  );
}

function ActionButton({
  label,
  onClick,
  active,
  children,
}: {
  label: string;
  onClick?: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full transition-colors",
        active
          ? "bg-surface-inverse text-primary"
          : "bg-surface-subtle text-text-secondary hover:bg-border-subtle hover:text-text-primary"
      )}
    >
      {children}
    </button>
  );
}
