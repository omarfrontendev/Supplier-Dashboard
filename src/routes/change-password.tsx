import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, KeyRound } from "lucide-react";
import { PageShell, PageHeader, SectionCard, Banner } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/change-password")({
  head: () => ({
    meta: [
      { title: "Change password · Hoteliana Supplier Portal" },
      {
        name: "description",
        content:
          "Set a new sign-in password for your Hoteliana supplier portal account.",
      },
      { property: "og:title", content: "Change password · Hoteliana Supplier Portal" },
      {
        property: "og:description",
        content: "Update the password used to sign in to the Hoteliana supplier portal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ChangePasswordPage,
});

function ChangePasswordPage() {
  const { c } = useLanguage();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setDone(false);
    if (!current) {
      setError(c.account.passwordMissingCurrent);
      return;
    }
    if (next.length < 8) {
      setError(c.account.passwordShort);
      return;
    }
    if (next !== confirm) {
      setError(c.account.passwordMismatch);
      return;
    }
    setError(null);
    setDone(true);
    setCurrent("");
    setNext("");
    setConfirm("");
  }

  return (
    <PageShell>
      <PageHeader
        overline={c.account.overline}
        title={c.account.passwordTitle}
        subtitle={c.account.passwordSubtitle}
      />

      {done && (
        <Banner
          tone="success"
          icon={<CheckCircle2 className="h-5 w-5" aria-hidden="true" />}
          title={c.account.passwordUpdated}
        />
      )}
      {error && (
        <Banner
          tone="warning"
          icon={<AlertTriangle className="h-5 w-5" aria-hidden="true" />}
          title={error}
        />
      )}

      <SectionCard
        icon={<KeyRound className="h-4.5 w-4.5" aria-hidden="true" />}
        overline={c.account.overline}
        title={c.account.passwordTitle}
        className="max-w-[560px]"
      >
        <form className="grid gap-5" onSubmit={handleSubmit}>
          <Input
            label={c.account.currentPassword}
            type="password"
            value={current}
            autoComplete="current-password"
            onChange={(e) => setCurrent(e.target.value)}
          />
          <Input
            label={c.account.newPassword}
            type="password"
            value={next}
            autoComplete="new-password"
            onChange={(e) => setNext(e.target.value)}
          />
          <Input
            label={c.account.confirmPassword}
            type="password"
            value={confirm}
            autoComplete="new-password"
            onChange={(e) => setConfirm(e.target.value)}
          />
          <div>
            <Button type="submit">{c.account.updatePassword}</Button>
          </div>
        </form>
      </SectionCard>
    </PageShell>
  );
}
