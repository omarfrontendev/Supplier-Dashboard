/**
 * OV 10.9B — the version you sent, shown whole.
 *
 * UI 10.9 gives a rejected version one line: what was wrong with it. That
 * is not the question a supplier asks first. Before correcting anything
 * they want to see what they actually wrote, so this panel puts the page
 * itself in front of them at the size it was received, and keeps the
 * written reason underneath it rather than in its place.
 *
 * Nothing here can be edited. A version that has been sent is a record —
 * "a correction never erases the one before it" — so the only things this
 * screen offers are reading it and keeping a copy.
 */

import { IconModal } from "@/components/layout/overlay";
import { sentCopy, type DetailVersion } from "@/lib/business-exception-data";
import { downloadText } from "@/lib/download";
import { fill, useLanguage } from "@/lib/i18n";
import { notify } from "@/lib/notify";

export function VersionSent({
  version,
  onClose,
}: {
  version: DetailVersion;
  onClose: () => void;
}) {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const c = sentCopy;

  /* The row prints the version as "v2"; the title counts it in words. */
  const n = Number(version.version.replace(/\D/g, "")) || 1;
  const page = (ar ? version.sentAr : version.sent) ?? "";
  const reason = ar ? version.reasonAr : version.reason;
  const title = fill(ar ? c.titleAr : c.title, { n });

  const save = () => {
    downloadText(
      `what-you-sent-${version.version}.txt`,
      [title, ar ? version.whenAr : version.when, page, reason ?? ""]
        .filter(Boolean)
        .join("\n")
    );
    notify.success(fill(ar ? c.downloadedAr : c.downloaded, { n }));
  };

  return (
    <IconModal
      width="760px"
      overline=""
      title={title}
      body={
        <button
          type="button"
          onClick={save}
          className="underline underline-offset-2 transition-colors hover:text-text-primary"
        >
          {ar ? c.downloadAr : c.download}
        </button>
      }
      onClose={onClose}
    >
      {/* The page as it arrived — a document, not a form. */}
      <div className="flex aspect-[712/700] w-full items-center justify-center rounded-lg bg-surface-canvas px-6 text-center">
        <p className="text-[13px] font-medium leading-6 text-text-muted">
          {page}
        </p>
      </div>
      {reason && (
        <p className="text-[12.5px] leading-5 text-status-danger">{reason}</p>
      )}
    </IconModal>
  );
}
