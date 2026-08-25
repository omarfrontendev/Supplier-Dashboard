"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "./utils";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer size-5 shrink-0 rounded-[4px] border border-gray-300 bg-gray-100  dark:border-gray-600 dark:bg-gray-800 data-[state=checked]:bg-[#6e11b0]  data-[state=checked]:border-input  data-[state=checked]:text-white focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive  disabled:cursor-not-allowed disabled:opacity-50  transition-colors outline-none",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
