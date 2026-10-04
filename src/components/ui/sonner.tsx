import { Toaster as Sonner } from "sonner";
import { useLanguage } from "@/lib/i18n";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { dir } = useLanguage();

  return (
    <Sonner
      dir={dir}
      position={dir === "rtl" ? "top-left" : "top-right"}
      offset={88}
      gap={10}
      closeButton
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast pointer-events-auto flex w-full items-start gap-3 rounded-xl border border-border-subtle bg-surface-default p-4 shadow-overlay",
          title: "text-sm font-semibold text-text-primary",
          description: "mt-0.5 text-[13px] leading-5 text-text-secondary",
          icon: "mt-0.5 shrink-0",
          actionButton:
            "rounded-lg bg-surface-inverse px-3 py-1.5 text-xs font-medium text-text-inverse",
          cancelButton:
            "rounded-lg bg-surface-subtle px-3 py-1.5 text-xs font-medium text-text-secondary",
          closeButton:
            "border border-border-subtle bg-surface-default text-text-muted hover:text-text-primary",
          success: "hl-toast-success",
          error: "hl-toast-error",
          warning: "hl-toast-warning",
          info: "hl-toast-info",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
