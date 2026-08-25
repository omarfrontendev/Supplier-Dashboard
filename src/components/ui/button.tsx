import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-purple-600 text-primary-foreground hover:bg-purple-700 focus-visible:ring-purple-300 dark:focus-visible:ring-purple-500",

        destructive:
          "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-200 dark:focus-visible:ring-red-400",

        outline:
          "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",

        secondary:
          "bg-purple-500 text-white hover:bg-purple-700 dark:bg-purple-900/40 dark:text-purple-200 dark:hover:bg-purple-900/60",

        ghost:
          "text-slate-600 hover:bg-violet-50 hover:text-violet-700 dark:text-slate-300 dark:hover:bg-violet-900/40 dark:hover:text-violet-300",

        link:
          "text-[#6e11b0] underline-offset-4 hover:underline hover:text-[#5a0e91] dark:text-violet-400 dark:hover:text-violet-300",

        activate:
          "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-200 dark:focus-visible:ring-emerald-400",

        deactivate:
          "bg-slate-400 text-white hover:bg-slate-500 focus-visible:ring-slate-200 dark:focus-visible:ring-slate-400",

        filter:
          "bg-purple-600 text-white hover:bg-blue-700 focus-visible:ring-blue-200 dark:focus-visible:ring-blue-400",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
