import type { ReactNode } from "react";
import { useLanguage } from "@/lib/i18n";
import { BrandMark } from "@/components/layout/brand-mark";
import { LangToggle } from "@/components/layout/lang-toggle";
import { ProtectedAuth } from "./ProtectedAuth";

/** Which brand panel story the screen tells — matches the Figma variants. */
export type BrandVariant =
  | "signIn"
  | "activation"
  | "activationExpired"
  | "activationRequested"
  | "activationActive"
  | "recovery";

export function AuthLayout({
  children,
  brand = "signIn",
}: {
  children: ReactNode;
  brand?: BrandVariant;
}) {
  const { dir } = useLanguage();

  return (
    <ProtectedAuth>
      <div dir={dir} className="flex min-h-screen items-stretch bg-surface-canvas">
        <BrandPanel variant={brand} />
        <main className="relative flex flex-1 flex-col items-center justify-center px-5 py-14 sm:px-8">
          <div className="absolute end-6 top-6">
            <LangToggle />
          </div>
          {children}
        </main>
      </div>
    </ProtectedAuth>
  );
}

export function AuthCard({
  overline,
  title,
  subtitle,
  footer,
  children,
}: {
  overline: string;
  title: string;
  subtitle?: string;
  /** Replaces the default "Need help…" footer when supplied. */
  footer?: ReactNode;
  children: ReactNode;
}) {
  const { c } = useLanguage();

  return (
    <div className="w-full max-w-[440px] rounded-[20px] border border-border-subtle bg-surface-default px-6 pb-8 pt-10 shadow-card sm:px-10">
      <p className="text-[11px] font-semibold uppercase leading-[1.2] tracking-[0.06em] text-text-muted">
        {overline}
      </p>
      <h1 className="mt-2.5 text-2xl font-semibold leading-[1.3] tracking-[-0.02em] text-text-primary">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2.5 text-sm leading-[1.6] text-text-secondary">
          {subtitle}
        </p>
      )}
      <div className="mt-6 space-y-5">{children}</div>
      <div className="mt-6 space-y-1.5 text-center text-[13px] leading-[1.5] text-text-muted">
        {footer ?? (
          <>
            <p>{c.common.needHelp}</p>
            <p className="text-text-link underline">{c.common.contactSupport}</p>
          </>
        )}
      </div>
    </div>
  );
}

/** The muted note + support line that closes most auth cards. */
export function AuthFooter({
  note,
  link,
}: {
  note?: string;
  link?: string;
}) {
  const { c } = useLanguage();
  return (
    <>
      {note && <p>{note}</p>}
      <p className="text-text-link underline">{link ?? c.common.contactSupport}</p>
    </>
  );
}

export function ErrorBanner({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-status-danger/25 bg-status-danger-bg p-3.5 mb-5">
      <p className="text-[15px] font-medium text-status-danger">{title}</p>
      <p className="mt-1 text-[13px] leading-[1.5] text-text-secondary">
        {body}
      </p>
    </div>
  );
}

export function InfoBanner({
  title,
  body,
  tone = "info",
}: {
  title: string;
  body: string;
  tone?: "info" | "success" | "warning";
}) {
  const tones = {
    info: "border-status-info/25 bg-status-info-bg text-status-info",
    success: "border-status-success/25 bg-status-success-bg text-status-success",
    warning: "border-status-warning/25 bg-status-warning-bg text-status-warning",
  } as const;
  return (
    <div className={`rounded-xl border p-3.5 ${tones[tone]}`}>
      <p className="text-[15px] font-medium">{title}</p>
      <p className="mt-1 text-[13px] leading-[1.5] text-text-secondary">
        {body}
      </p>
    </div>
  );
}

function BrandPanel({ variant }: { variant: BrandVariant }) {
  const { c } = useLanguage();
  const panel = c.brandPanels[variant];

  return (
    <aside className="relative hidden w-[660px] shrink-0 flex-col justify-between overflow-hidden bg-brand-deep p-14 lg:flex">
      <div className="relative z-10 self-start">
        <BrandMark tone="light" />
      </div>

      <div className="relative z-10">
        <h2 className="whitespace-pre-line text-[40px] font-semibold leading-[1.15] tracking-[-0.015em] text-text-inverse">
          {panel.headline}
        </h2>
        <p className="mt-5 text-[15px] leading-[1.6] text-text-inverse/[0.72]">
          {panel.body}
        </p>
      </div>

      <div className="relative z-10">
        <span className="block h-0.5 w-12 rounded-[2px] bg-primary" />
        <p className="mt-3.5 whitespace-pre-wrap text-xs font-medium leading-[1.3] text-text-inverse/60">
          {panel.proof}
        </p>
      </div>

      <BrandArt />
    </aside>
  );
}

/** Concentric arches + glow + fade, rebuilt from the Figma brand art layers. */
function BrandArt() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -start-[120px] -top-[230px] h-[700px] w-[980px] rounded-full bg-primary/[0.07] blur-[120px]" />

      <svg
        className="absolute inset-0 h-full w-full text-primary"
        viewBox="0 0 660 1024"
        fill="none"
        preserveAspectRatio="xMidYMax slice"
      >
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const w = 277.2 + i * 112.2;
          const left = 330 - w / 2;
          const h = 240.1 + i * 97.2;
          const top = 1060 - h;
          const r = w / 2;
          return (
            <path
              key={i}
              d={`M${left} 1060 V${top + r} a${r} ${r} 0 0 1 ${w} 0 V1060`}
              stroke="currentColor"
              strokeOpacity={0.22 - i * 0.03}
              strokeWidth="1.5"
            />
          );
        })}
        <path
          d={`M191.4 1060 V${940 - 0} a138.6 138.6 0 0 1 277.2 0 V1060`}
          fill="currentColor"
          fillOpacity="0.05"
        />
      </svg>

      <div className="absolute bottom-0 start-0 h-[760px] w-full bg-gradient-to-b from-transparent via-[rgba(9,51,38,0.72)] to-[rgba(4,31,23,0.96)]" />
    </div>
  );
}
