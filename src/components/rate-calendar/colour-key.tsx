import { useState } from "react";
import { IconModal } from "@/components/layout/overlay";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";

/** The swatch beside each line, drawn the way the cell itself is drawn. */
const SWATCH: Record<string, string> = {
  plain: "bg-status-success-bg text-status-success",
  warning: "bg-status-warning-bg text-status-warning",
  danger: "bg-status-danger-bg text-status-danger",
  draft:
    "border border-dashed border-status-warning bg-surface-default text-status-warning",
  info: "bg-status-warning-bg text-status-warning",
  weekend: "bg-surface-subtle",
  today: "border border-brand-mid bg-surface-default",
};

/** Figma OV 04.12 — what every colour in the grid means. */
export function ColourKeyDialog({
  threshold,
  onClose,
  onChangeThreshold,
}: {
  threshold: number;
  onClose: () => void;
  onChangeThreshold: () => void;
}) {
  const { lang } = useLanguage();
  const ar = lang === "ar";

  const rows = ar
    ? [
        ["24", "الغرف المتبقية", "الغرف التي ما زال يمكنك بيعها تلك الليلة", "plain"],
        ["3", `${threshold} أو أقل`, `على وشك النفاد - ${threshold} غرف أو أقل · أنت تختار هذا الرقم`, "warning"],
        ["0", "نفد", "لا غرف متبقية تلك الليلة", "danger"],
        ["520", "غير منشور", "غيّرته - لا يعمل حتى تنشره", "draft"],
        ["SS", "إيقاف البيع", "مغلق للبيع - يظهر سعر تلك الليلة مشطوبًا", "danger"],
        ["RQ", "عند الطلب", "يمكن للضيوف الطلب، وأنت تؤكد كل حجز", "info"],
        ["", "نهاية الأسبوع", "الخميس والجمعة - سعر نهاية الأسبوع", "weekend"],
        ["", "اليوم", "تاريخ اليوم", "today"],
      ]
    : [
        ["24", "Rooms left", "Rooms you can still sell that night", "plain"],
        ["3", `${threshold} or fewer`, `Almost gone - ${threshold} rooms or fewer left · you choose this number`, "warning"],
        ["0", "Sold out", "No rooms left that night", "danger"],
        ["520", "Not published", "You changed it - not live until you publish", "draft"],
        ["SS", "Stop sale", "Closed for sale - the price that night shows struck through", "danger"],
        ["RQ", "On Request", "Guests can ask; you confirm each booking", "info"],
        ["", "Weekend", "Thursday and Friday - weekend price", "weekend"],
        ["", "Today", "Today’s date", "today"],
      ];

  return (
    <IconModal
      width="660px"
      overline=""
      title={ar ? "دليل الألوان" : "Colour key"}
      onClose={onClose}
    >
      <div className="space-y-3">
        {rows.map(([sample, label, body, kind]) => (
          <div key={`${label}`} className="flex items-start gap-3">
            <span
              className={cn(
                "font-data mt-1 grid h-[18px] w-[30px] shrink-0 place-items-center rounded-[5px] text-[10px] font-semibold",
                SWATCH[kind as string]
              )}
            >
              {sample}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12.5px] font-semibold text-text-primary">
                {label}
              </p>
              <p className="mt-0.5 text-[11.5px] leading-4 text-text-muted">
                {body}
              </p>
              {kind === "warning" && (
                <button
                  type="button"
                  onClick={onChangeThreshold}
                  className="mt-1 text-[11.5px] font-medium text-brand-deep underline"
                >
                  {ar ? "تغيير الرقم ›" : "Change the number ›"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </IconModal>
  );
}

/** Figma OV 04.12T — the "almost gone" threshold. */
export function ThresholdDialog({
  value,
  onClose,
  onSave,
}: {
  value: number;
  onClose: () => void;
  onSave: (next: number) => void;
}) {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const [picked, setPicked] = useState(value);

  const options = [2, 3, 4, 5, 6, 8, 10];

  return (
    <IconModal
      width="660px"
      overline=""
      title={
        ar ? "متى تكون الليلة «على وشك النفاد»؟" : "When is a night «almost gone»?"
      }
      body={
        ar
          ? "تتحول الليلة إلى الأصفر وتنضم إلى شريحة «N أو أقل» عندما يتبقى هذا العدد من الغرف أو أقل. اختر ما يناسب فنادقك."
          : "A night turns yellow and joins the «N or fewer» chip when this many rooms or fewer are left. Pick what suits your hotels."
      }
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {ar ? "إلغاء" : "Cancel"}
          </Button>
          <Button
            onClick={() => {
              onSave(picked);
              onClose();
            }}
          >
            {ar ? "حفظ" : "Save"}
          </Button>
        </>
      }
    >
      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setPicked(option)}
            className={cn(
              "flex w-full items-center justify-between rounded-[10px] border px-3.5 py-2.5 text-[12.5px] transition-colors",
              picked === option
                ? "border-brand-deep bg-primary-subtle font-medium text-text-primary"
                : "border-border-subtle text-text-primary hover:bg-surface-subtle"
            )}
          >
            {ar
              ? `${option} غرف أو أقل${option === 4 ? " · الافتراضي" : ""}`
              : `${option} rooms or fewer${option === 4 ? " · default" : ""}`}
          </button>
        ))}
      </div>

      <p className="text-[11.5px] leading-4 text-text-muted">
        {ar
          ? "ينطبق على كل الفنادق في حسابك. الخلايا الصفراء والشريحة وفلترها تتبع الرقم الجديد فورًا - ولا يُنشر شيء ولا يتغير أي سعر."
          : "It applies to every hotel on your account. The yellow cells, the chip and its filter follow the new number right away - nothing is published and no price changes."}
      </p>
    </IconModal>
  );
}
