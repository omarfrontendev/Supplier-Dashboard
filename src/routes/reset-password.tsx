import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Info } from "lucide-react";
import { AuthCard, AuthLayout } from "@/components/auth/auth-layout";
import {
  PasswordInput,
  PasswordRules,
  passwordMeetsRules,
} from "@/components/auth/password-field";
import { Button } from "@/components/ui/button";
import { fill, useLanguage } from "@/lib/i18n";
import { useResetPassword } from "@/components/auth/reset-password/useResetPassword";

const ACCOUNT_EMAIL = "operations@jewaralsafwah.com";

export const Route = createFileRoute("/reset-password")({
  validateSearch: (search) => ({
    resetToken: typeof search["resetToken"] === "string" ? search["resetToken"] : "",
  }),

  beforeLoad: ({ search }) => {
    if (!search.resetToken) {
      throw redirect({
        to: "/login",
      });
    }
  },

  head: () => ({
    meta: [
      { title: "Create a new password · Hoteliana Supplier Portal" },
      {
        name: "description",
        content:
          "Choose a new password for your Hoteliana supplier portal account.",
      },
      {
        property: "og:title",
        content: "Create a new password · Hoteliana Supplier Portal",
      },
      {
        property: "og:description",
        content: "Set a new password and sign back in to the supplier portal.",
      },
    ],
  }),
  component: ResetPasswordPage,
});

/** UI 01.4 / 01.4A — choose a new password from the emailed link. */
function ResetPasswordPage() {
  const { c } = useLanguage();
  // const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [mismatch, setMismatch] = useState(false);
  // const [loading, setLoading] = useState(false);
  const { resetToken } = Route.useSearch();
  const { mutate: resetPassword, isPending: isLoading } = useResetPassword();

  const rules = passwordMeetsRules(password);

  return (
    <AuthLayout brand="recovery">
      <AuthCard
        overline={c.reset.overline}
        title={c.reset.title}
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
            // setLoading(true);
            void (async () => {
              // await wait(600);
              // notify.success(c.toast.passwordUpdated);
              // setLoading(false);
              // navigate({ to: "/login" });
              resetPassword({ confirmNewPassword: confirm, newPassword: password, resetToken })
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
              {c.reset.sessions}
            </p>
          </div>

          <Button type="submit" className="h-11 w-full" loading={isLoading}>
            {c.reset.submit}
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
