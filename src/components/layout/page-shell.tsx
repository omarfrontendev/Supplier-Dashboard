import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { TopBar } from "./top-bar";
import { statusLabel } from "@/lib/status-tones";
import { PropertyTabs, usePropertyBar } from "./property-tabs";
import { cn } from "@/lib/utils";
import { ProtectedRoute } from "./ProtectedRoute";

export function PageShell({ children }: { children: ReactNode }) {
  const { dir } = useLanguage();

  return (
    <div dir={dir} className="min-h-screen overflow-x-clip bg-surface-canvas">
      <TopBar />
      <main className="mx-auto max-w-[1440px] px-4 pb-16 pt-6 sm:px-6 lg:px-10 lg:pt-7">
        <ProtectedRoute>
          {children}
        </ProtectedRoute>
      </main>
    </div>
  );
}

export function BackLink({
  to,
  label,
  inline = false,
}: {
  to: string;
  label: string;
  /** UI 04.1 - the header that keeps the back button on the title's own row. */
  inline?: boolean | undefined;
}) {
  const { dir } = useLanguage();
  const Icon = dir === "rtl" ? ArrowRight : ArrowLeft;
  /* Some frames write the arrow into the label, so it is not drawn twice. */
  const written = /^[\u2190\u2192]/.test(label);

  return (
    <Link
      to={to}
      className={cn(
        "inline-flex h-11 shrink-0 items-center gap-2 rounded-[10px] border border-border-default bg-surface-default px-5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-subtle hover:text-text-primary",
        !inline && "mb-6"
      )}
    >
      {!written && <Icon className="h-4 w-4" aria-hidden="true" />}
      {label}
    </Link>
  );
}

export function PageHeader({
  overline,
  title,
  subtitle,
  pill,
  right,
}: {
  overline: string;
  title: string;
  subtitle?: string;
  /** Sits beside the title, for counts like "2 waiting on you". */
  pill?: ReactNode;
  right?: ReactNode;
}) {
  /* The Property section's tabs belong under the title and its sentence,
     and they belong there on every page that carries them - so the header
     renders them rather than each route pasting them in wherever. */
  const withTabs = usePropertyBar();

  return (
    <>
      <div
        className={cn(
          "grid gap-4 sm:flex sm:flex-wrap sm:items-start sm:justify-between",
          withTabs ? "mb-4" : "mb-6"
        )}
      >
        <div className="min-w-0">
          <p className="text-overline text-text-muted">{overline}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold leading-tight tracking-tight text-text-primary sm:text-[28px]">
              {title}
            </h1>
            {pill}
          </div>
          {subtitle && (
            <p className="mt-2 max-w-4xl text-sm text-text-secondary">{subtitle}</p>
          )}
        </div>
        {right && (
          <div className="flex flex-wrap items-center gap-3">{right}</div>
        )}
      </div>
      {withTabs && <PropertyTabs />}
    </>
  );
}

export function SectionCard({
  icon,
  overline,
  title,
  description,
  right,
  children,
  className,
  bodyClassName,
}: {
  icon?: ReactNode;
  overline?: string;
  title?: string;
  description?: string;
  right?: ReactNode;
  children?: ReactNode;
  className?: string;
  /** For the frames that set their own padding, such as UI 04.1. */
  bodyClassName?: string | undefined;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border-subtle bg-surface-default shadow-card",
        className
      )}
    >
      {(title || overline) && (
        <div className="flex items-start gap-3 p-6 pb-4">
          {icon && (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-subtle text-text-primary">
              {icon}
            </span>
          )}
          <div className="min-w-0 flex-1">
            {overline && (
              <p className="text-overline text-text-muted">{overline}</p>
            )}
            {title && (
              <h2 className="mt-1 text-lg font-semibold tracking-tight text-text-primary">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-text-secondary">{description}</p>
            )}
          </div>
          {right && <div className="flex items-center gap-2">{right}</div>}
        </div>
      )}
      <div
        className={cn(
          title || overline ? "px-6 pb-6" : "p-6",
          bodyClassName
        )}
      >
        {children}
      </div>
    </section>
  );
}

const bannerTones = {
  warning: "border-status-warning/25 bg-status-warning-bg text-status-warning",
  info: "border-status-info/25 bg-status-info-bg text-status-info",
  success: "border-status-success/25 bg-status-success-bg text-status-success",
  danger: "border-status-danger/25 bg-status-danger-bg text-status-danger",
  neutral: "border-border-subtle bg-surface-subtle text-text-secondary",
} as const;

export function Banner({
  tone = "info",
  icon,
  title,
  body,
  action,
}: {
  tone?: keyof typeof bannerTones;
  icon?: ReactNode;
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "mb-6 flex flex-wrap items-center gap-4 rounded-xl border p-4",
        bannerTones[tone]
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        {body && (
          <p className="mt-0.5 text-sm text-text-secondary">{body}</p>
        )}
      </div>
      {action}
    </div>
  );
}

const pillTones = {
  success: "bg-status-success-bg text-status-success",
  warning: "bg-status-warning-bg text-status-warning",
  danger: "bg-status-danger-bg text-status-danger",
  info: "bg-status-info-bg text-status-info",
  neutral: "bg-status-neutral-bg text-status-neutral",
  brand: "bg-primary-subtle text-brand-deep",
} as const;

export function StatusPill({
  tone,
  status,
  children,
  className,
}: {
  tone?: keyof typeof pillTones | undefined;
  /**
   * BR-00-27 — one badge component, five colours, and the colour comes from
   * the status dictionary rather than the call site. "أي حالة مش في القاموس
   * ماتاخدش Badge رمادي، وتتكتب كنص عادي": a status the table does not list
   * is not quietly painted grey - it is written as plain text instead.
   */
  status?: string;
  children?: ReactNode;
  className?: string;
}) {
  const { lang } = useLanguage();
  const fromTable = status ? statusLabel(status, lang) : null;

  if (status && !fromTable?.tone) {
    return (
      <span className={cn("text-xs text-text-secondary", className)}>
        {children ?? fromTable?.label ?? status}
      </span>
    );
  }

  const painted = tone ?? fromTable?.tone ?? "neutral";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        pillTones[painted],
        className
      )}
    >
      {children ?? fromTable?.label}
    </span>
  );
}

export function DataRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 border-b border-border-subtle py-3 last:border-b-0 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
      <span className="text-sm text-text-secondary sm:w-48 sm:shrink-0">{label}</span>
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 [&_*]:break-words">
        {children}
      </div>
    </div>
  );
}
