import {
  forwardRef,
  useState,
  type InputHTMLAttributes,
} from "react";
import {
  Eye,
  EyeOff,
} from "lucide-react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  suffix?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      error,
      hint,
      suffix,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputId =
      id ||
      (label
        ? label.toLowerCase().replace(/\s+/g, "-")
        : undefined);

    const isPassword = type === "password";
    const inputType =
      isPassword && showPassword ? "text" : type;

    return (
      <div className={cn("space-y-2", className)}>
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
            type={inputType}
            className={cn(
              "flex h-11 w-full rounded-[10px] border bg-surface-default px-4 py-2.5 text-sm leading-[1.6] text-text-primary transition-colors",
              (suffix || isPassword) && "pe-12",
              "placeholder:text-text-muted",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20",
              "disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:text-text-muted",
              error
                ? "border-status-danger focus-visible:ring-status-danger/30"
                : "border-border-default hover:border-border-strong focus-visible:border-border-focus"
            )}
            ref={ref}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={
              error
                ? `${inputId}-error`
                : hint
                  ? `${inputId}-hint`
                  : undefined
            }
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 end-3 flex items-center text-text-muted transition-colors hover:text-text-primary"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}

          {!isPassword && suffix && (
            <span className="pointer-events-none absolute inset-y-0 end-4 flex items-center font-data text-xs font-medium text-text-muted">
              {suffix}
            </span>
          )}
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            className="text-xs text-status-danger"
          >
            {error}
          </p>
        )}

        {hint && !error && (
          <p
            id={`${inputId}-hint`}
            className="text-xs text-text-muted"
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
