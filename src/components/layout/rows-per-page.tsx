import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

/* 00a70.4 proposes 25; the frames draw 20, so both are on the menu. */
const SIZES = [10, 20, 25, 50, 100] as const;

/** OV CH.5 — the rows-per-page menu every long list carries. */
export function RowsPerPage({
  value,
  onChange,
}: {
  value: number;
  onChange?: (size: number) => void;
}) {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const rows = (size: number) => (ar ? `${size} صف` : `${size} rows`);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-text-muted transition-colors hover:bg-surface-subtle hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
        >
          {ar ? `${value} لكل صفحة` : `${value} per page`}
          <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuLabel className="text-overline text-text-muted">
          {ar ? "الصفوف في الصفحة" : "Rows per page"}
        </DropdownMenuLabel>
        {SIZES.map((size) => (
          <DropdownMenuItem
            key={size}
            className="cursor-pointer justify-between"
            onSelect={() => onChange?.(size)}
          >
            <span>{rows(size)}</span>
            {size === value && <span aria-hidden="true">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
