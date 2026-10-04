import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-sm font-medium leading-[1.2] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        dark: "bg-surface-inverse text-text-inverse hover:bg-black/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-surface-subtle border border-border-default",
        ghost:
          "bg-transparent text-text-secondary hover:bg-surface-subtle hover:text-text-primary",
        danger:
          "bg-status-danger-bg text-status-danger hover:bg-[#f5d9d3] border border-status-danger/20",
        /* OV 03.0I / 03.3D / 03.21 — a solid red for what cannot be undone. */
        destructive:
          "bg-button-destructive text-button-destructive-fg hover:brightness-95",
        /* OV 03.18 — amber for what hides the contract but keeps it. */
        warning: "bg-button-warning text-button-warning-fg hover:brightness-95",
        outline:
          "border border-border-default bg-surface-default text-text-primary hover:bg-surface-subtle",
        link: "text-text-link underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-9 px-3 text-[13px]",
        lg: "h-[49px] px-6",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  /**
   * BR-00-22 - "\u0645\u0645\u0646\u0648\u0639 \u0632\u0631\u0627\u0631 Disabled \u0645\u0646 \u063a\u064a\u0631 \u0633\u0628\u0628 \u0645\u0643\u062a\u0648\u0628 \u062c\u0646\u0628\u0647 \u0623\u0648 \u0641\u064a
   * Tooltip": a button that cannot be pressed has to say why. Either write
   * the reason beside it, or hand it here and it becomes the tooltip.
   *
   * When the reason is that the person lacks the permission, this is the
   * wrong tool - BR-00-21 says the button is removed, not disabled. Use
   * `<Gated>` for that.
   */
  reason?: string | undefined;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, loading, children, disabled, reason, ...props },
    ref
  ) => {
    const off = disabled || loading;

    if (import.meta.env.DEV && disabled && !loading && !reason) {
      /* Not fatal: plenty of buttons sit beside a visible reason already.
         The warning is here so a new one without any explanation is seen. */
      if (!props["aria-describedby"] && !props.title) {
        console.warn(
          "BR-00-22: a disabled button needs a reason beside it or in a " +
            "tooltip. Pass `reason`, or `aria-describedby` when the line is " +
            "already on screen.",
          typeof children === "string" ? children : props["aria-label"]
        );
      }
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        disabled={off}
        {...(off && reason ? { title: reason } : {})}
        {...props}
      >
        {loading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
