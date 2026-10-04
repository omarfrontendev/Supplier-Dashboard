import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  AuthCard,
  AuthFooter,
  AuthLayout,
  ErrorBanner,
  InfoBanner,
} from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { fill, useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useVerifyOTP } from "@/components/auth/verify-otp/useVerify-otp";
import { useRequestOTP } from "@/components/auth/request-otp/useRequestOtp";

/** The code is good for three tries, and a new one can be asked for every 60s. */
const MAX_TRIES = 3;
const RESEND_SECONDS = 45;

export const Route = createFileRoute("/two-factor")({
  validateSearch: (search) => ({
    email: typeof search["email"] === "string" ? search["email"] : "",
  }),

  beforeLoad: ({ search }) => {
    if (!search.email) {
      throw redirect({
        to: "/login",
      });
    }
  },

  head: () => ({
    meta: [
      { title: "Verification code · Hoteliana Supplier Portal" },
      {
        name: "description",
        content:
          "Enter the 6-digit verification code sent to your work email to finish signing in.",
      },
      {
        property: "og:title",
        content: "Verification code · Hoteliana Supplier Portal",
      },
      {
        property: "og:description",
        content: "Two-step verification for the Hoteliana supplier portal.",
      },
    ],
  }),
  component: TwoFactorPage,
});

function clock(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function TwoFactorPage() {
  const { c } = useLanguage();
  const navigate = useNavigate();
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  // const [error, setError] = useState(false);
  const [triesLeft, setTriesLeft] = useState(MAX_TRIES - 1);
  const [resentBanner, setResentBanner] = useState(false);
  const [trusted, setTrusted] = useState(false);
  const [left, setLeft] = useState(RESEND_SECONDS);
  // const [loading, setLoading] = useState(false);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const { email } = Route.useSearch();

  // focus the first box automatically on mount
  useEffect(() => {
    inputs.current[0]?.focus();
    inputs.current[0]?.select();
  }, []);

  // Countdown that gates the resend link (UI 01.2B → UI 01.2B2).
  useEffect(() => {
    if (left <= 0) return;
    const id = window.setInterval(() => setLeft((prev) => prev - 1), 1000);
    return () => window.clearInterval(id);
  }, [left]);

  function fillFrom(index: number, raw: string) {
    const chars = raw.replace(/\D/g, "").split("");
    if (chars.length === 0) return;
    setDigits((prev) => {
      const next = [...prev];
      let i = index;
      for (const ch of chars) {
        if (i > 5) break;
        next[i] = ch;
        i += 1;
      }
      const target = Math.min(i, 5);
      requestAnimationFrame(() => {
        inputs.current[target]?.focus();
        inputs.current[target]?.select();
      });
      if (next.every((d) => d !== "")) submitCode(next.join(""));
      return next;
    });
  }

  function setDigit(index: number, value: string) {
    if (value.length > 1) {
      fillFrom(index, value);
      return;
    }
    const clean = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = clean;
      if (clean && index < 5) {
        requestAnimationFrame(() => {
          inputs.current[index + 1]?.focus();
          inputs.current[index + 1]?.select();
        });
      }
      if (clean && next.every((d) => d !== "")) submitCode(next.join(""));
      return next;
    });
  }
  const {
    mutateAsync: verifyOTP,
    isPending: isVerifyingOTP,
    error
  } = useVerifyOTP();

  async function submitCode(code: string) {
    if (code.length !== 6 || isVerifyingOTP) return;

    const verification = await verifyOTP({
      email,
      code,
    });

    const resetToken = verification.data.resetToken;

    setTimeout(() => {
      navigate({
        to: "/reset-password",
        search: { resetToken },
      });
    }, 1000);
  }

  const { mutate: requestOTP } = useRequestOTP();

  function resend() {
    setDigits(["", "", "", "", "", ""]);
    setTriesLeft(MAX_TRIES - 1);
    setResentBanner(true);
    setLeft(59);
    inputs.current[0]?.focus();
    requestOTP({ email })
  }

  return (
    <AuthLayout>
      <AuthCard
        overline={c.twoFactor.overline}
        title={c.twoFactor.title}
        subtitle={fill(c.twoFactor.subtitle, {
          email: c.twoFactor.maskedEmail,
        })}
        footer={
          <>
            <Link to="/login" className="block text-text-link hover:underline">
              {c.common.backToSignIn}
            </Link>
            <AuthFooter />
          </>
        }
      >
        {error && (
          <ErrorBanner
            title={c.twoFactor.errorTitle}
            body={fill(c.twoFactor.errorBody, { left: triesLeft })}
          />
        )}
        {resentBanner && !error && (
          <InfoBanner
            tone="success"
            title={c.twoFactor.sentTitle}
            body={fill(c.twoFactor.sentBody, {
              email: c.twoFactor.maskedEmail,
            })}
          />
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitCode(digits.join(""));
          }}
          className="space-y-5"
        >
          <div>
            <span className="text-sm font-medium text-text-primary">
              {c.twoFactor.label}
            </span>
            <div className="mt-2 flex gap-2 sm:gap-2.5" dir="ltr">
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputs.current[index] = el;
                  }}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={digit}
                  onFocus={(e) => e.currentTarget.select()}
                  onPaste={(e) => {
                    e.preventDefault();
                    fillFrom(index, e.clipboardData.getData("text"));
                  }}
                  onChange={(e) => setDigit(index, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !digit && index > 0) {
                      inputs.current[index - 1]?.focus();
                    }
                  }}
                  className={cn(
                    "font-data h-13 w-13 rounded-lg border bg-surface-default text-center text-2xl font-semibold text-text-primary outline-none transition-colors",
                    "h-[52px] w-full min-w-0 flex-1 px-0 sm:w-[52px] sm:flex-none focus:border-border-focus focus:ring-2 focus:ring-ring/20",
                    error ? "border-status-danger" : "border-border-default"
                  )}
                  aria-label={`${c.twoFactor.label} ${index + 1}`}
                />
              ))}
            </div>
            <p className="mt-2 text-xs leading-[1.5] text-text-muted">
              {c.twoFactor.helper}
            </p>
          </div>

          <label className="flex cursor-pointer items-start gap-2.5">
            <input
              type="checkbox"
              checked={trusted}
              onChange={(e) => setTrusted(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[var(--brand-deep)]"
            />
            <span className="text-[13px] leading-[1.5] text-text-secondary">
              {c.twoFactor.trust}
            </span>
          </label>

          <Button type="submit" className="h-11 w-full" loading={isVerifyingOTP} disabled={isVerifyingOTP}>
            {error ? c.twoFactor.tryAgain : c.twoFactor.submit}
          </Button>

          <div className="text-center">
            {left > 0 && !error ? (
              <span className="font-data text-[13px] text-text-muted">
                {fill(c.twoFactor.timer, { time: clock(left) })}
              </span>
            ) : (
              <button
                type="button"
                onClick={resend}
                className="text-sm text-text-link hover:underline"
              >
                {error ? c.twoFactor.resendAfterError : c.twoFactor.resend}
              </button>
            )}
          </div>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
