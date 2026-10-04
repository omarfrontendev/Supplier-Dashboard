import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Info } from "lucide-react";
import { AuthCard, AuthLayout } from "@/components/auth/auth-layout";
import {
  PasswordInput,
  PasswordRules,
  passwordMeetsRules,
} from "@/components/auth/password-field";
import { Button } from "@/components/ui/button";
import { notify, wait } from "@/lib/notify";
import { cn } from "@/lib/utils";
import { fill, useLanguage } from "@/lib/i18n";

/**
 * "Not me" — someone else changed the password (Figma UI 01.3N, 01.4N,
 * 01.4D, 01.4D2). Four steps: the reset link, a new password, the device
 * list, and the confirmation that the other devices are out.
 */
type Step = "sent" | "choose" | "devices" | "secured";

const ACCOUNT_EMAIL = "operations@jewaralsafwah.com";

export const Route = createFileRoute("/secure-account")({
  validateSearch: (
    search: Record<string, unknown>
  ): { step?: Exclude<Step, "sent"> } =>
    search["step"] === "choose" ||
    search["step"] === "devices" ||
    search["step"] === "secured"
      ? { step: search["step"] }
      : {},
  head: () => ({
    meta: [
      { title: "Secure your account · Hoteliana Supplier Portal" },
      {
        name: "description",
        content:
          "Take your Hoteliana supplier account back: set a new password and sign out every device that is not yours.",
      },
      {
        property: "og:title",
        content: "Secure your account · Hoteliana Supplier Portal",
      },
      {
        property: "og:description",
        content: "Recover an account someone else changed the password on.",
      },
    ],
  }),
  component: SecureAccountPage,
});

function SecureAccountPage() {
  const { c } = useLanguage();
  const navigate = useNavigate();
  const { step: initial } = Route.useSearch();
  const [step, setStep] = useState<Step>(initial ?? "sent");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [mismatch, setMismatch] = useState(false);
  const [loading, setLoading] = useState(false);

  const rules = passwordMeetsRules(password);
  const t = c.notMe;
  const devices = t.devices.list;
  const others = devices.length - 1;

  const backLink = (
    <Link to="/login" className="block text-text-link hover:underline">
      {c.common.backToSignIn}
    </Link>
  );

  if (step === "sent") {
    return (
      <AuthLayout brand="recovery">
        <AuthCard
          overline={t.sent.overline}
          title={t.sent.title}
          subtitle={fill(t.sent.subtitle, { email: ACCOUNT_EMAIL })}
          footer={
            <>
              {backLink}
              <button
                type="button"
                onClick={() => notify.success(c.toast.resetSent)}
                className="text-text-link hover:underline"
              >
                {t.sent.again}
              </button>
            </>
          }
        >
          <Button className="h-11 w-full" onClick={() => setStep("choose")}>
            {t.sent.submit}
          </Button>
        </AuthCard>
      </AuthLayout>
    );
  }

  if (step === "choose") {
    return (
      <AuthLayout brand="recovery">
        <AuthCard
          overline={t.choose.overline}
          title={t.choose.title}
          subtitle={fill(c.reset.subtitle, { email: ACCOUNT_EMAIL })}
          footer={<p>{c.reset.footerNote}</p>}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!rules.all) return;
              if (password !== confirm) {
                setMismatch(true);
                return;
              }
              setMismatch(false);
              setLoading(true);
              void (async () => {
                await wait(600);
                notify.success(c.toast.passwordUpdated);
                setLoading(false);
                setStep("devices");
              })();
            }}
            className="space-y-5"
          >
            <div className="space-y-2">
              <PasswordInput
                label={c.reset.newPassword}
                placeholder={c.reset.newPasswordPh}
                value={password}
                onChange={setPassword}
              />
              <PasswordRules value={password} />
            </div>

            <div className="space-y-2">
              <PasswordInput
                label={c.reset.confirm}
                placeholder={c.reset.confirmPh}
                value={confirm}
                onChange={(next) => {
                  setConfirm(next);
                  if (mismatch) setMismatch(false);
                }}
                error={mismatch}
              />
              {mismatch && (
                <p className="text-xs text-status-danger">{c.reset.mismatch}</p>
              )}
            </div>

            <div className="flex items-start gap-2">
              <Info
                className="mt-0.5 h-4 w-4 shrink-0 text-text-muted"
                aria-hidden="true"
              />
              <p className="text-xs leading-[1.5] text-text-secondary">
                {t.choose.info}
              </p>
            </div>

            <Button type="submit" className="h-11 w-full" loading={loading}>
              {c.reset.submit}
            </Button>
          </form>
        </AuthCard>
      </AuthLayout>
    );
  }

  const secured = step === "secured";
  const head = secured ? t.secured : t.devices;

  return (
    <AuthLayout brand="recovery">
      <AuthCard
        overline={head.overline}
        title={head.title}
        subtitle={head.subtitle}
        footer={<p>{t.devices.footerNote}</p>}
      >
        {/* UI 01.4D / 01.4D2 keep the password the step before it saved. */}
        <div className="mb-5 space-y-5">
          <div className="space-y-2">
            <PasswordInput
              label={c.reset.newPassword}
              placeholder={c.reset.newPasswordPh}
              value={password}
              onChange={setPassword}
            />
            <PasswordRules value={password} />
          </div>
          <PasswordInput
            label={c.reset.confirm}
            placeholder={c.reset.confirmPh}
            value={confirm}
            onChange={setConfirm}
          />
          <div className="flex items-start gap-2">
            <Info
              className="mt-0.5 h-4 w-4 shrink-0 text-text-muted"
              aria-hidden="true"
            />
            <p className="text-xs leading-[1.5] text-text-secondary">
              {c.reset.sessions}
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {devices.map((device, index) => {
            const current = index === 0;
            const flagged = index === 1;
            const status = current
              ? t.devices.thisDevice
              : secured
                ? t.devices.signedOut
                : flagged
                  ? t.devices.notYou
                  : t.devices.unknown;
            return (
              <div
                key={device.name}
                className={cn(
                  "flex items-center gap-3 rounded-[10px] border border-border-default px-3.5 py-3",
                  flagged && !secured
                    ? "bg-status-danger-bg"
                    : "bg-surface-default"
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-text-primary">
                    {device.name}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-text-muted">
                    {device.meta}
                  </p>
                </div>
                <span
                  className={cn(
                    "shrink-0 text-xs font-semibold",
                    current
                      ? "text-text-primary"
                      : secured
                        ? "text-text-muted"
                        : flagged
                          ? "text-status-danger"
                          : "text-text-muted"
                  )}
                >
                  {status}
                </span>
              </div>
            );
          })}
        </div>

        {secured ? (
          <Button
            className="h-11 w-full"
            onClick={() => navigate({ to: "/getting-started" })}
          >
            {t.secured.submit}
          </Button>
        ) : (
          <Button
            className="h-11 w-full"
            loading={loading}
            onClick={() => {
              setLoading(true);
              void (async () => {
                await wait(600);
                setLoading(false);
                setStep("secured");
              })();
            }}
          >
            {fill(t.devices.submit, { count: others })}
          </Button>
        )}
      </AuthCard>
    </AuthLayout>
  );
}
