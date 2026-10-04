import { cva, type VariantProps } from "class-variance-authority";
import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary-hover",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-surface-subtle",
        success:
          "border-transparent bg-status-success-bg text-status-success",
        warning:
          "border-transparent bg-status-warning-bg text-status-warning",
        danger: "border-transparent bg-status-danger-bg text-status-danger",
        info: "border-transparent bg-status-info-bg text-status-info",
        neutral:
          "border-transparent bg-status-neutral-bg text-status-neutral",
        outline: "text-foreground border-border-default bg-surface-default",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
