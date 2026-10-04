import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  AuthCard,
  AuthFooter,
  AuthLayout,
  ErrorBanner,
} from "@/components/auth/auth-layout";
import {
  PasswordInput,
  passwordMeetsRules,
} from "@/components/auth/password-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { notify, wait } from "@/lib/notify";
import { fill, useLanguage } from "@/lib/i18n";

/** The four activation states drawn in Figma: UI 01.1, 01.1B, 01.1B2, 01.1C. */
type ActivateState = "default" | "expired" | "requested" | "already";

const INVITED_EMAIL = "operations@jewaralsafwah.com";

export const Route = createFileRoute("/activate")({
  validateSearch: (
    search: Record<string, unknown>
  ): { state?: Exclude<ActivateState, "default"> } =>
    search["state"] === "expired" ||
    search["state"] === "requested" ||
    search["state"] === "already"
      ? { state: search["state"] }
      : {},
  head: () => ({
    meta: [
      { title: "Activate your account · Hoteliana Supplier Portal" },
      {
        name: "description",
        content:
          "Set a password for your invited Hoteliana supplier account and start managing your hotels.",
      },
      {
        property: "og:title",
        content: "Activate your account · Hoteliana Supplier Portal",
      },
      {
        property: "og:description",
        content: "Activate the invited supplier account registered by Hoteliana.",
      },
    ],
  }),
  component: ActivatePage,
});

function ActivatePage() {
  const { state: initial } = Route.useSearch();
  const [state, setState] = useState<ActivateState>(initial ?? "default");

  if (state === "expired") return <ExpiredCard onRequest={() => setState("requested")} />;
  if (state === "requested") return <RequestedCard />;
  if (state === "already") return <AlreadyActiveCard />;
  return <CreatePasswordCard />;
}

/** UI 01.1 / 01.1A — create the password, with live rules and reveal. */
function CreatePasswordCard() {
  const { c } = useLanguage();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const rules = passwordMeetsRules(password);
  const ready = rules.all && password === confirm;

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!ready) {
      setError(true);
      return;
    }
    setError(false);
    setLoading(true);
    void (async () => {
      await wait(600);
      notify.success(c.toast.passwordUpdated);
      setLoading(false);
      navigate({ to: "/two-factor" });
    })();
  }

  return (
    <AuthLayout brand="activation">
      <AuthCard
        overline={c.activate.overline}
        title={c.activate.title}
        subtitle={c.activate.subtitle}
        footer={
          <AuthFooter
            note={c.activate.footerNote}
            link={c.activate.footerLink}
          />
        }
      >
        {error && (
          <ErrorBanner
            title={c.activate.errorTitle}
            body={c.activate.errorBody}
          />
        )}
        <form onSubmit={submit} className="space-y-5">
          <Input
            label={c.activate.email}
            value={INVITED_EMAIL}
            hint={c.activate.emailHint}
            readOnly
            disabled
          />
          <div className="space-y-2">
            <PasswordInput
              label={c.activate.newPassword}
              placeholder={c.activate.newPasswordPh}
              value={password}
              onChange={setPassword}
              error={error}
            />
          </div>
          <PasswordInput
            label={c.activate.confirm}
            placeholder={c.activate.confirmPh}
            value={confirm}
            onChange={setConfirm}
            error={error}
          />
          <Button type="submit" className="h-11 w-full" loading={loading}>
            {c.activate.submit}
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}

/** UI 01.1B — the invitation is older than 7 days. */
function ExpiredCard({ onRequest }: { onRequest: () => void }) {
  const { c } = useLanguage();
  const [loading, setLoading] = useState(false);
  const t = c.activate.expired;

  return (
    <AuthLayout brand="activationExpired">
      <AuthCard
        overline={t.overline}
        title={t.title}
        subtitle={t.subtitle}
        footer={<AuthFooter note={t.footerNote} />}
      >
        <div className="space-y-5">
          <Input
            label={c.activate.email}
            value={INVITED_EMAIL}
            hint={t.emailHint}
            readOnly
            disabled
          />
          <Button
            className="h-11 w-full"
            loading={loading}
            onClick={() => {
              setLoading(true);
              void (async () => {
                await wait(600);
                setLoading(false);
                onRequest();
              })();
            }}
          >
            {t.submit}
          </Button>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}

/** UI 01.1B2 — Hoteliana was asked for a fresh invitation. */
function RequestedCard() {
  const { c } = useLanguage();
  const t = c.activate.requested;

  return (
    <AuthLayout brand="activationRequested">
      <AuthCard
        overline={t.overline}
        title={t.title}
        subtitle={fill(t.subtitle, { email: INVITED_EMAIL })}
        footer={<AuthFooter note={t.footerNote} />}
      >
        <Link to="/login" className="block">
          <Button variant="outline" className="h-11 w-full">
            {t.submit}
          </Button>
        </Link>
      </AuthCard>
    </AuthLayout>
  );
}

/** UI 01.1C — the invitation link was already used. */
function AlreadyActiveCard() {
  const { c } = useLanguage();
  const t = c.activate.already;

  return (
    <AuthLayout brand="activationActive">
      <AuthCard
        overline={t.overline}
        title={t.title}
        subtitle={t.subtitle}
        footer={<AuthFooter note={t.footerNote} />}
      >
        <div className="space-y-5">
          <Input
            label={c.activate.email}
            value={INVITED_EMAIL}
            hint={t.emailHint}
            readOnly
            disabled
          />
          <Link to="/login" className="block">
            <Button className="h-11 w-full">{t.submit}</Button>
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
