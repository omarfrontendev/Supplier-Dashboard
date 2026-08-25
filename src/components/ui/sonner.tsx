"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import { useTranslation } from "react-i18next";

const Toaster = (props: React.ComponentProps<typeof Sonner>) => {
  const { theme = "system" } = useTheme();
  const { i18n } = useTranslation();

  const toastPosition = i18n.dir() === 'rtl' ? 'top-left' : 'top-right';

  return (
    <Sonner
      theme={theme as "light" | "dark" | "system"}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      closeButton
      position={toastPosition}
      {...props}
    />
  );
};

export { Toaster };
