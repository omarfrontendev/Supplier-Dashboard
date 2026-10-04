import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Globe, UserRound } from "lucide-react";
import { PageShell, PageHeader, SectionCard, Banner } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Personal details · Hoteliana Supplier Portal" },
      {
        name: "description",
        content:
          "Update the supplier contact name, job title and mobile number used by Hoteliana and selling agents.",
      },
      { property: "og:title", content: "Personal details · Hoteliana Supplier Portal" },
      {
        property: "og:description",
        content: "Manage your personal supplier profile details and interface language.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { c, lang, toggleLang } = useLanguage();
  const [fullName, setFullName] = useState(
    lang === "ar" ? "عبدالرحمن ناجح" : "Abdullrahman Najeh"
  );
  const [jobTitle, setJobTitle] = useState(
    lang === "ar" ? "مدير العمليات" : "Operations Manager"
  );
  const [phone, setPhone] = useState("+966 55 214 8890");
  const [saved, setSaved] = useState(false);

  return (
    <PageShell>
      <PageHeader
        overline={c.account.overline}
        title={c.account.profileTitle}
        subtitle={c.account.profileSubtitle}
      />

      {saved && (
        <Banner
          tone="success"
          icon={<CheckCircle2 className="h-5 w-5" aria-hidden="true" />}
          title={c.account.saved}
        />
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <SectionCard
          icon={<UserRound className="h-4.5 w-4.5" aria-hidden="true" />}
          overline={c.account.overline}
          title={c.account.profileTitle}
        >
          <form
            className="grid gap-5 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              setSaved(true);
            }}
          >
            <Input
              label={c.account.fullName}
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setSaved(false);
              }}
            />
            <Input
              label={c.account.jobTitle}
              value={jobTitle}
              onChange={(e) => {
                setJobTitle(e.target.value);
                setSaved(false);
              }}
            />
            <Input
              label={c.account.email}
              value="operations@jewaralsafwah.com"
              readOnly
              disabled
            />
            <Input
              label={c.account.phone}
              value={phone}
              inputMode="tel"
              onChange={(e) => {
                setPhone(e.target.value);
                setSaved(false);
              }}
            />
            <p className="text-xs text-text-muted sm:col-span-2">{c.account.emailNote}</p>
            <div className="sm:col-span-2">
              <Button type="submit">{c.account.save}</Button>
            </div>
          </form>
        </SectionCard>

        <SectionCard
          icon={<Globe className="h-4.5 w-4.5" aria-hidden="true" />}
          overline={c.account.language}
          title={c.account.languageTitle}
          description={c.account.languageSubtitle}
          className="h-fit"
        >
          <Button variant="outline" onClick={toggleLang}>
            {c.common.langLabel}
          </Button>
        </SectionCard>
      </div>
    </PageShell>
  );
}
