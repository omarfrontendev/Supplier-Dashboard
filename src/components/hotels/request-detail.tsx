import { useState } from "react";
import { AlertTriangle, Check, X } from "lucide-react";
import { Drawer } from "@/components/layout/overlay";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/layout/page-shell";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { requestDetail, type DetailShape } from "@/lib/request-detail-data";
import type { Bi } from "@/lib/library-overlay-data";

/** Who sent it and who holds it — one line each. */
function Who({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-overline text-text-muted">{label}</p>
      <p className="mt-1 text-[12.5px] font-medium text-text-primary">
        {value}
      </p>
    </div>
  );
}

/**
 * OV 02.5B - 02.5F2 — one request, where it stands, and the one or two
 * things left to do about it.
 */
export function RequestDetailDrawer({
  overline,
  title,
  meta,
  shape,
  onClose,
  onPrimary,
  onSecondary,
}: {
  overline: string;
  title: string;
  meta: string;
  shape: DetailShape;
  onClose: () => void;
  onPrimary?: (() => void) | undefined;
  /** Which action - the drawer draws several and they do different things. */
  onSecondary?: ((action: Bi) => void) | undefined;
}) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const d = requestDetail;
  const [reply, setReply] = useState("");

  return (
    <Drawer
      width="560px"
      overline={overline}
      title={title}
      meta={meta}
      divider={false}
      onClose={onClose}
      footer={
        <>
          {shape.actions.map((action) => (
            <Button
              key={action.en}
              variant="outline"
              onClick={() => onSecondary?.(action)}
            >
              {action[k]}
            </Button>
          ))}
          {shape.primary && (
            <Button onClick={onPrimary ?? onClose}>{shape.primary[k]}</Button>
          )}
        </>
      }
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2.5">
          <StatusPill tone={shape.tone}>{shape.stateLabel[k]}</StatusPill>
          <span className="text-[11.5px] text-text-muted">
            {shape.stateNote[k]}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Who label={d.sentBy[k]} value={d.sentByValue[k]} />
          <Who label={d.assignedTo[k]} value={d.assignedToValue[k]} />
        </div>

        <div>
          <p className="text-overline text-text-muted">{d.timeline[k]}</p>
          <ol className="mt-2.5 space-y-3">
            {shape.timeline.map((item, index) => (
              <li key={item.title.en} className="flex gap-2.5">
                <span
                  className={cn(
                    "mt-px flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
                    item.state === "done"
                      ? "bg-brand-deep text-white"
                      : item.kind === "refused"
                        ? "bg-status-danger text-white"
                        : item.state === "active"
                          ? "bg-status-warning-bg text-status-warning"
                          : "bg-status-neutral-bg text-text-muted"
                  )}
                >
                  {/* A step that refused says so with a cross, and one
                      holding a question with a mark - a number there would
                      only say which step it is, which is not the news. */}
                  {item.state === "done" ? (
                    <Check className="h-2.5 w-2.5" aria-hidden="true" />
                  ) : item.kind === "refused" ? (
                    <X className="h-2.5 w-2.5" aria-hidden="true" />
                  ) : item.kind === "question" ? (
                    <AlertTriangle className="h-2.5 w-2.5" aria-hidden="true" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block text-[12.5px] font-semibold text-text-primary">
                    {item.title[k]}
                  </span>
                  <span className="mt-0.5 block text-[11.5px] leading-4 text-text-muted">
                    {item.note[k]}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* OV 02.5F / 5F2 — what was changed, ready to go back. */}
        {shape.fixed && (
          <div className="rounded-[12px] border border-border-subtle px-3.5 py-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <p className="text-[12.5px] font-semibold text-text-primary">
                {shape.fixed.title[k]}
              </p>
              {shape.fixed.link && (
                <button
                  type="button"
                  className="text-[12.5px] font-medium text-text-primary hover:underline"
                >
                  {shape.fixed.link[k]}
                </button>
              )}
            </div>
            <p className="mt-1 text-[11.5px] leading-4 text-text-muted">
              {shape.fixed.body[k]}
            </p>
            {shape.changed && (
              <p className="mt-2 flex items-center gap-1.5 text-[12px] font-medium text-status-success">
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                {shape.changed[k]}
              </p>
            )}
          </div>
        )}

        {shape.quote && (
          <p className="rounded-[10px] bg-surface-subtle px-3.5 py-3 text-[12px] leading-4 text-text-body">
            {shape.quote[k]}
          </p>
        )}

        {shape.list.length > 0 && (
          <div>
            <p className="text-overline text-text-muted">
              {shape.listTitle[k]}
            </p>
            <ul className="mt-2 space-y-1.5">
              {shape.list.map((line) => (
                <li
                  key={line.en}
                  className="flex items-start gap-2 text-[12.5px] leading-[18px] text-text-body"
                >
                  <Check
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-status-success"
                    aria-hidden="true"
                  />
                  {line[k]}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* OV 02.5D / 5F / 5F2 — the line back to Hoteliana. */}
        {shape.reply && (
          <div>
            <p className="text-overline text-text-muted">{d.replyTitle[k]}</p>
            <textarea
              value={reply}
              onChange={(event) => setReply(event.target.value)}
              placeholder={d.replyPlaceholder[k]}
              rows={3}
              className="mt-2 w-full rounded-[10px] border border-border-default bg-surface-default px-3.5 py-2.5 text-[12.5px] leading-[18px] text-text-primary outline-none placeholder:text-text-muted focus:border-brand-deep"
            />
          </div>
        )}

        {shape.note && (
          <p className="text-[11.5px] leading-4 text-text-muted">
            {shape.note[k]}
          </p>
        )}
      </div>
    </Drawer>
  );
}
