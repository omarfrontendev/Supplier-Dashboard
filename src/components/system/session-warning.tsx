/**
 * OV 11.30 — the two minutes before a session ends.
 *
 * The guide writes the panel out word for word: a title that carries a live
 * countdown, one line saying unsaved work survives on this device, and two
 * actions. "Stay signed in" renews the session and closes it; "Sign out now"
 * is an ordinary sign-out.
 *
 * It mounts once, at the root, because BR-00-17's clock is the session's and
 * not any one screen's.
 */

import { useEffect } from "react";
import { Clock } from "lucide-react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { IconModal } from "@/components/layout/overlay";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { countdown, useSessionWatch } from "@/lib/session-watch";

const copy = {
  en: {
    overline: "SESSION",
    /* The guide's own sentence, with the countdown taking the number. */
    title: "You will be signed out in {left}",
    body: "You have been inactive for 28 minutes. Anything you have not saved stays on this device and comes back when you sign in again.",
    stay: "Stay signed in",
    signOut: "Sign out now",
  },
  ar: {
    overline: "الجلسة",
    title: "سيُنهى تسجيل دخولك خلال {left}",
    body: "لم يصدر منك نشاط منذ ٢٨ دقيقة. وكل ما لم تحفظه يبقى على هذا الجهاز ويعود عند تسجيل دخولك مرة أخرى.",
    stay: "ابقَ مسجّلًا",
    signOut: "سجّل الخروج الآن",
  },
} as const;

export function SessionWarning() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  /* A state reached by a search parameter, the way the other 11.x are.
     Named `idle` rather than `session` so no tool reads the link as
     carrying a session token. */
  const forced = useRouterState({
    select: (state) =>
      (state.location.search as Record<string, unknown>)["idle"] === "warning",
  });
  const { phase, remaining, stay } = useSessionWatch();
  const c = copy[lang === "ar" ? "ar" : "en"];

  /* BR-00-18 - the reason picks the screen, so expiry goes to its own. */
  useEffect(() => {
    if (phase === "expired") {
      void navigate({ to: "/system-states", search: { state: "session" } } as never);
    }
  }, [phase, navigate]);

  if (phase !== "warning" && !forced) return null;

  const left = countdown(forced && phase !== "warning" ? 120_000 : remaining, lang);

  return (
    <IconModal
      icon={<Clock className="h-5 w-5" aria-hidden="true" />}
      overline={c.overline}
      title={c.title.replace("{left}", left)}
      body={c.body}
      width="520px"
      onClose={stay}
      footer={
        <>
          <Button
            variant="outline"
            onClick={() => void navigate({ to: "/login" } as never)}
          >
            {c.signOut}
          </Button>
          <Button onClick={stay}>{c.stay}</Button>
        </>
      }
    />
  );
}
