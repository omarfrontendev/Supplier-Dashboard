import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";

/**
 * Password input with the Figma reveal affordance: the eye is disabled while
 * the field is empty (nothing to reveal) and toggles hidden ↔ revealed.
 */
export function PasswordInput({
  label,
  value,
  onChange,
  placeholder,
  error,
  id,
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  id?: string;
}) {
  const { c } = useLanguage();
  const [revealed, setRevealed] = useState(false);
  const inputId =
    id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
  const empty = value.length === 0;

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[13px] font-medium leading-[1.3] text-text-primary"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={revealed ? "text" : "password"}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "flex h-[50px] w-full rounded-lg border bg-surface-default px-4 py-3.5 pe-12 text-sm leading-[1.6] text-text-primary transition-colors",
            "placeholder:text-text-muted",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20",
            error
              ? "border-status-danger focus-visible:ring-status-danger/30"
              : "border-border-default hover:border-border-strong focus-visible:border-border-focus"
          )}
          aria-invalid={error ? "true" : undefined}
        />
        <button
          type="button"
          disabled={empty}
          onClick={() => setRevealed((prev) => !prev)}
          aria-label={revealed ? c.common.hide : c.common.reveal}
          className={cn(
            "absolute end-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-text-muted transition-opacity",
            empty
              ? "cursor-not-allowed opacity-40"
              : "opacity-100 hover:bg-surface-subtle"
          )}
        >
          {revealed ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}

export function passwordMeetsRules(value: string) {
  return {
    length: value.length >= 8,
    uppercase: /[A-Z]/.test(value),
    lowercase: /[a-z]/.test(value),
    number: /[0-9]/.test(value),
    special: /[^A-Za-z0-9]/.test(value),

    get all() {
      return (
        this.length &&
        this.uppercase &&
        this.lowercase &&
        this.number &&
        this.special
      );
    },
  };
}

export function PasswordRules({ value }: { value: string }) {
  const { c } = useLanguage();
  const met = passwordMeetsRules(value);
  const rules = [
    { key: "length", label: c.passwordRules.length, ok: met.length },
    { key: "uppercase", label: c.passwordRules.uppercase, ok: met.uppercase },
    { key: "lowercase", label: c.passwordRules.lowercase, ok: met.lowercase },
    { key: "number", label: c.passwordRules.number, ok: met.number },
    { key: "special", label: c.passwordRules.special, ok: met.special },
  ];

  return (
    <div className="space-y-[7px]">
      {rules.map((rule) => (
        <div key={rule.key} className="flex items-center gap-2">
          <span
            className={cn(
              "h-1.5 w-1.5 shrink-0 rounded-full",
              rule.ok ? "bg-status-success" : "bg-border-strong"
            )}
            aria-hidden="true"
          />
          <span
            className={cn(
              "text-xs",
              rule.ok ? "text-status-success" : "text-text-muted"
            )}
          >
            {rule.label}
          </span>
        </div>
      ))}
    </div>
  );
}
