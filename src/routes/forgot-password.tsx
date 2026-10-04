import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { AuthCard, AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fill, useLanguage } from "@/lib/i18n";
import { useRequestOTP } from "@/components/auth/request-otp/useRequestOtp";

/** UI 01.3 / 01.3A / 01.3B — ask, sent, and the expired link. */
type ForgotState = "ask" | "sent" | "expired";

export const Route = createFileRoute("/forgot-password")({
  validateSearch: (
    search: Record<string, unknown>
  ): { state?: "expired" } =>
    search["state"] === "expired" ? { state: "expired" } : {},
  head: () => ({
    meta: [
      { title: "Forgot password · Hoteliana Supplier Portal" },
      {
        name: "description",
        content:
          "Request a password reset link for your Hoteliana supplier portal account.",
      },
      {
        property: "og:title",
        content: "Forgot password · Hoteliana Supplier Portal",
      },
      {
        property: "og:description",
        content: "Recover access to your Hoteliana supplier account.",
      },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const { c } = useLanguage();
  const { state: initial } = Route.useSearch();
  const [state, setState] = useState<ForgotState>(initial ?? "ask");
  const [email, setEmail] = useState("operations@jewaralsafwah.com");

  const navigate = useNavigate()

  const { mutate: requestOTP, isPending } = useRequestOTP();

  const backLink = (
    <Link to="/login" className="block text-text-link hover:underline">
      {c.common.backToSignIn}
    </Link>
  );

  function send(next: ForgotState = "sent") {
    requestOTP({ email }, {
      onSuccess: () => {
        setState(next), setTimeout(() => {
          navigate({ to: `/two-factor?email=${email}` });
        }, 1000);
      }
    })
  }

  if (state === "expired") {
    const t = c.forgot.expired;
    return (
      <AuthLayout brand="recovery">
        <AuthCard
          overline={t.overline}
          title={t.title}
          subtitle={t.subtitle}
          footer={backLink}
        >
          <Button
            className="h-11 w-full"
            loading={isPending}
            onClick={() => send("sent")}
          >
            {t.submit}
          </Button>
        </AuthCard>
      </AuthLayout>
    );
  }

  if (state === "sent") {
    const t = c.forgot.sent;
    return (
      <AuthLayout brand="recovery">
        <AuthCard
          overline={t.overline}
          title={t.title}
          subtitle={fill(t.subtitle, { email })}
          footer={
            <>
              {backLink}
              <button
                type="button"
                onClick={() => send("sent")}
                className="text-text-link hover:underline"
              >
                {t.again}
              </button>
            </>
          }
        >
          <div className="space-y-5">
            <div className="flex items-start gap-3 rounded-xl border border-status-success/25 bg-status-success-bg p-4">
              <CheckCircle2
                className="mt-0.5 h-5 w-5 shrink-0 text-status-success"
                aria-hidden="true"
              />
              <p className="font-data text-sm text-text-secondary">{email}</p>
            </div>
            <Link to="/two-factor" search={{ email }} className="block">
              <Button className="h-11 w-full">{t.verifyAndReset}</Button>
            </Link>
          </div>
        </AuthCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout brand="recovery">
      <AuthCard
        overline={c.forgot.overline}
        title={c.forgot.title}
        subtitle={c.forgot.subtitle}
        footer={backLink}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!email.includes("@")) return;
            send("sent");
          }}
          className="space-y-5"
        >
          <Input
            label={c.forgot.email}
            type="email"
            placeholder={c.forgot.emailPh}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" className="h-11 w-full" loading={isPending} disabled={isPending || !email.includes("@")}>
            {c.forgot.submit}
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
