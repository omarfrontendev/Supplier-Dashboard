import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  AuthCard,
  AuthFooter,
  AuthLayout,
  ErrorBanner,
} from "@/components/auth/auth-layout";
import { PasswordInput } from "@/components/auth/password-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { notify, wait } from "@/lib/notify";
import { fill, useLanguage } from "@/lib/i18n";
import { useLogin } from "@/api/modules/auth/hooks/useLogin";

/** Five wrong attempts lock sign-in for 15 minutes (UI 01.2A → UI 01.2D). */
const MAX_ATTEMPTS = 5;
const UNLOCK_AT = "14:35";

export const Route = createFileRoute("/login")({
  validateSearch: (
    search: Record<string, unknown>
  ): { state?: "locked" } =>
    search["state"] === "locked" ? { state: "locked" } : {},
  head: () => ({
    meta: [
      { title: "Sign in · Hoteliana Supplier Portal" },
      {
        name: "description",
        content:
          "Sign in to the Hoteliana supplier portal to manage hotels, rate contracts and bookings.",
      },
      { property: "og:title", content: "Sign in · Hoteliana Supplier Portal" },
      {
        property: "og:description",
        content: "Secure supplier sign in for Hoteliana partners.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { c } = useLanguage();
  // const navigate = useNavigate();
  const { state } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [failed, setFailed] = useState(0);
  const [error, setError] = useState(false);
  const { mutate, isPending: isLoading } = useLogin();

  const locked = state === "locked" || failed >= MAX_ATTEMPTS;

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.includes("@") || password.length < 8) {
      setError(true);
      setFailed((prev) => prev + 1);
      return;
    }
    setError(false);
    mutate({ email, password });
  }

  if (locked) {
    return (
      <AuthLayout>
        <AuthCard
          overline={c.login.overline}
          title={c.login.locked.title}
          footer={<AuthFooter />}
        >
          <ErrorBanner
            title={c.login.locked.bannerTitle}
            body={fill(c.login.locked.bannerBody, { time: UNLOCK_AT })}
          />
          <div className="space-y-3">
            <Link to="/forgot-password" className="block">
              <Button className="h-11 w-full">{c.login.locked.reset}</Button>
            </Link>
            <Link
              to="/login"
              className="block text-center text-sm text-text-link hover:underline"
              onClick={() => setFailed(0)}
            >
              {c.common.backToSignIn}
            </Link>
          </div>
        </AuthCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthCard
        overline={c.login.overline}
        title={c.login.title}
        footer={<AuthFooter note={c.common.needHelp} />}
      >
        {error && (
          <ErrorBanner
            title={c.login.errorTitle}
            body={fill(c.login.errorBody, { left: MAX_ATTEMPTS - failed })}
          />
        )}
        <form onSubmit={submit} className="space-y-5">
          <Input
            label={c.login.email}
            type="email"
            value={email}
            placeholder={c.login.emailPh}
            onChange={(e) => setEmail(e.target.value)}
            {...(error ? { error: " " } : {})}
          />
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-sm font-medium text-text-primary">
                {c.login.password}
              </span>
              <Link
                to="/forgot-password"
                className="text-sm text-text-link hover:underline"
              >
                {c.login.forgot}
              </Link>
            </div>
            <PasswordInput
              value={password}
              placeholder={c.login.passwordPh}
              onChange={setPassword}
              error={error}
            />
          </div>
          <Button type="submit" className="h-11 w-full" loading={isLoading}>
            {c.login.submit}
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
