import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Check,
  ChevronRight,
  FileText,
  Hotel,
  Lock,
  ShieldCheck,
} from "lucide-react";
import {
  PageHeader,
  PageShell,
  SectionCard,
  StatusPill,
} from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { fill, useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/getting-started")({
  head: () => ({
    meta: [
      { title: "Getting started · Hoteliana Supplier Portal" },
      {
        name: "description",
        content:
          "Complete your supplier setup: account, company profile, agreement, compliance, hotels, contract, rates and go live.",
      },
      {
        property: "og:title",
        content: "Getting started · Hoteliana Supplier Portal",
      },
      {
        property: "og:description",
        content: "Eight guided steps to start selling with Hoteliana.",
      },
    ],
  }),
  component: GettingStartedPage,
});

type StepState = "done" | "next" | "upnext" | "locked";

/** UI 01.5 — a whole step row is the link, ending in a chevron. */
function Row({
  to,
  search,
  title,
  children,
}: {
  to: StepLink;
  /** UI 01.5 — two steps open a state, not just a page. */
  search?: Record<string, string> | undefined;
  title: string;
  children: React.ReactNode;
}) {
  /*
   * UI 01.5 draws the step as one row: the number, what it is, who owns
   * it, where it stands, and the chevron. That row is a desktop row - on a
   * phone the three things at the end are all `shrink-0`, so the only
   * thing left to squeeze was the text, and it went down to 71px wide and
   * 243px tall. A 268px step, eight of them.
   *
   * It wraps now. The text keeps a 12rem floor, so it claims the first
   * line and pushes the owner, the badge and the chevron onto the second
   * as a group, aligned to the end.
   */
  const inner =
    "flex flex-wrap items-center gap-x-3.5 gap-y-2 px-4 py-3";
  return to ? (
    /* `to` is a union, so the per-route search type cannot be narrowed here. */
    <Link
      to={to}
      search={(search ?? {}) as never}
      aria-label={title}
      className={inner}
    >
      {children}
    </Link>
  ) : (
    <div className={inner}>{children}</div>
  );
}

type StepLink =
  | "/agreement"
  | "/hotels"
  | "/rate-contracts"
  | "/rate-calendar"
  | null;

function GettingStartedPage() {
  const { c, lang } = useLanguage();
  const ar = lang === "ar";
  const g = c.gettingStarted;

  const stats = [
    { key: "account", icon: <ShieldCheck className="h-4 w-4" />, data: g.stats.account },
    { key: "agreement", icon: <FileText className="h-4 w-4" />, data: g.stats.agreement },
    { key: "hotels", icon: <Hotel className="h-4 w-4" />, data: g.stats.hotels },
  ];

  /** The eight first-setup steps, in the order Figma UI 01.5 lists them. */
  const steps: Array<{
    key: string;
    search?: Record<string, string>;
    data: { title: string; body: string; owner: string; badge: string };
    state: StepState;
    to: StepLink;
  }> = [
    { key: "one", data: g.steps.one, state: "done", to: null },
    { key: "two", data: g.steps.two, state: "next", to: "/agreement" },
    {
      key: "three",
      data: g.steps.three,
      state: "upnext",
      to: "/agreement",
      /* The step opens the version waiting to be accepted, not the record. */
      search: { state: "new" },
    },
    { key: "four", data: g.steps.four, state: "upnext", to: "/agreement" },
    {
      key: "five",
      data: g.steps.five,
      state: "upnext",
      to: "/hotels",
      /* Nothing is linked during onboarding, so this is the first visit. */
      search: { state: "first" },
    },
    { key: "six", data: g.steps.six, state: "locked", to: null },
    { key: "seven", data: g.steps.seven, state: "locked", to: null },
    { key: "eight", data: g.steps.eight, state: "locked", to: null },
  ];

  const done = steps.filter((step) => step.state === "done").length;

  return (
    <PageShell>
      <PageHeader overline={g.overline} title={g.title} subtitle={g.subtitle} />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.key}
            className="flex items-center gap-2.5 rounded-[16px] border border-border-subtle bg-surface-default px-5 py-3.5 shadow-card"
          >
            <span className="shrink-0 text-text-muted">{stat.icon}</span>
            <span className="min-w-0">
              <span className="block text-overline text-text-muted">
                {stat.data.label}
              </span>
              {/* UI 01.5 — the number and what it means sit on one line. */}
              <span className="mt-1 flex flex-wrap items-baseline gap-2">
                <span className="text-[21px] font-semibold tracking-tight text-text-primary">
                  {stat.data.value}
                </span>
                <span className="text-[13px] text-text-secondary">
                  {stat.data.note}
                </span>
              </span>
            </span>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <SectionCard
          overline={g.cardOverline}
          title={g.cardTitle}
          right={
            <span className="rounded-full bg-status-neutral-bg px-3 py-1 text-[12.5px] text-text-body">
              {fill(g.progress, { done, total: steps.length })}
            </span>
          }
        >
          {/* UI 01.5 — six pixels of how far the eight steps have got. */}
          <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-status-neutral-bg">
            <div
              style={{ width: `${(done / steps.length) * 100}%` }}
              className="h-full rounded-full bg-brand-deep"
            />
          </div>
          <ol className="space-y-1.5">
            {steps.map((step, index) => (
              <li
                key={step.key}
                className={
                  step.state === "next"
                    ? "rounded-[12px] border border-brand-deep/20 bg-primary-subtle/60"
                    : "rounded-[12px] border border-border-subtle"
                }
              >
                <Row
                  to={step.to}
                  {...(step.search ? { search: step.search } : {})}
                  title={step.data.title}
                >
                <span
                  className={
                    step.state === "done"
                      ? "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-status-success-bg text-status-success"
                      : step.state === "locked"
                        ? "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-subtle text-text-muted"
                        : "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-deep text-sm font-semibold text-primary"
                  }
                >
                  {step.state === "done" ? (
                    <Check className="h-4 w-4" aria-hidden="true" />
                  ) : step.state === "locked" ? (
                    <Lock className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    /* A step number reads in the digits around it. */
                    (index + 1).toLocaleString(ar ? "ar-EG" : "en-US")
                  )}
                </span>
                <div className="min-w-0 flex-1 basis-48">
                  <p className="text-[13.5px] font-semibold text-text-primary">
                    {step.data.title}
                  </p>
                  <p className="mt-0.5 text-[12.5px] leading-[18px] text-text-secondary">
                    {step.data.body}
                  </p>
                </div>
                {/* Who owns it, where it stands, and the way in - they
                    travel together, so they wrap as one block rather than
                    three loose pieces. */}
                <div className="ms-auto flex shrink-0 items-center gap-3">
                  <p className="text-xs text-text-muted">{step.data.owner}</p>
                  <StatusPill
                    tone={
                      step.state === "done"
                        ? "success"
                        : step.state === "next"
                          ? "brand"
                          : "neutral"
                    }
                  >
                    {step.data.badge}
                  </StatusPill>
                  {step.to ? (
                    <ChevronRight
                      className="h-4 w-4 shrink-0 text-text-muted rtl:rotate-180"
                      aria-hidden="true"
                    />
                  ) : (
                    <span className="w-4 shrink-0" aria-hidden="true" />
                  )}
                </div>
                </Row>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-xs leading-relaxed text-text-muted">
            {g.footnote}
          </p>
        </SectionCard>

        <div className="h-fit rounded-2xl bg-brand-deep p-6 text-text-inverse shadow-raised">
          <p className="text-overline text-primary">{g.next.overline}</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">
            {g.next.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-white/75">
            {g.next.body}
          </p>
          <Link to="/agreement" className="mt-6 block">
            <Button className="h-11 w-full">{g.next.cta}</Button>
          </Link>
          <p className="mt-3 text-xs text-white/60">{g.next.note}</p>
        </div>
      </div>
    </PageShell>
  );
}
