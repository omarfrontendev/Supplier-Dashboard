/**
 * BR-00-09 / OV 03.11 — "أي Overlay أو صفحة فيها إدخال ماتحفظش، وحاول
 * المستخدم يقفلها أو يمشي، يظهر حارس التغييرات. مفيش شغل بيضيع من غير تأكيد."
 *
 * `Modal` and `IconModal` already refuse to close on a stray click or Esc
 * while they are dirty; this is the panel they hand the person instead, and
 * the hook that makes wiring it one line.
 */

import { useCallback, useState } from "react";
import { Modal } from "@/components/layout/overlay";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

const copy = {
  en: {
    title: "Discard changes?",
    body: "What you typed here has not been saved. Going back now loses it.",
    keep: "Keep editing",
    discard: "Discard changes",
  },
  ar: {
    title: "تجاهل التغييرات؟",
    body: "ما كتبته هنا لم يُحفظ. والعودة الآن تفقده.",
    keep: "تابع التحرير",
    discard: "تجاهل التغييرات",
  },
} as const;

export function DiscardGuard({
  onKeep,
  onDiscard,
}: {
  onKeep: () => void;
  onDiscard: () => void;
}) {
  const { lang } = useLanguage();
  const c = copy[lang === "ar" ? "ar" : "en"];

  return (
    <Modal
      title={c.title}
      meta={c.body}
      onClose={onKeep}
      className="max-w-[460px]"
      footer={
        <>
          <Button variant="outline" onClick={onKeep}>
            {c.keep}
          </Button>
          <Button variant="dark" onClick={onDiscard}>
            {c.discard}
          </Button>
        </>
      }
    />
  );
}

/**
 * Wires an overlay to the guard in one line:
 *
 *   const guard = useDiscardGuard(dirty, close);
 *   <Modal dirty={dirty} onGuard={guard.ask} onClose={guard.close} … />
 *   {guard.asking && <DiscardGuard … />}
 */
export function useDiscardGuard(dirty: boolean, close: () => void) {
  const [asking, setAsking] = useState(false);

  return {
    asking,
    /** The overlay calls this when a dirty panel is dismissed. */
    ask: useCallback(() => setAsking(true), []),
    /** Closing while clean needs no guard, so this is the plain path. */
    close: useCallback(() => {
      if (dirty) setAsking(true);
      else close();
    }, [dirty, close]),
    keep: useCallback(() => setAsking(false), []),
    discard: useCallback(() => {
      setAsking(false);
      close();
    }, [close]),
  };
}
