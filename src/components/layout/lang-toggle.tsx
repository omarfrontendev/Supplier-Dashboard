import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LangToggle({ className }: { className?: string }) {
  const { c, toggleLang } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLang}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-md border border-border-default bg-surface-default px-3 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-subtle hover:text-text-primary",
        className
      )}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
      </svg>
      {c.common.langLabel}
    </button>
  );
}
