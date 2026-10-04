import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Check, ChevronDown, Loader2, Search, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { fill, useLanguage } from "@/lib/i18n";

export type SelectOption = {
  value: string;
  label: string;
  hint?: string;
  disabled?: boolean;
  group?: string;
};

type Base = {
  label?: string;
  placeholder?: string;
  hint?: string;
  error?: string;
  /** Search is on by default; pass false only for very short static lists. */
  searchable?: boolean;
  /**
   * Remote (API) search. Called with the debounced search term — return the
   * matching options. When provided, filtering happens server-side.
   */
  loadOptions?: (term: string) => Promise<SelectOption[]>;
  /** Minimum characters before loadOptions runs. */
  minSearchChars?: number;
  /** Extra labels for values selected but not present in the loaded page. */
  selectedLabels?: Record<string, string>;
  clearable?: boolean;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md";
};

type SingleProps = Base & {
  mode?: "single";
  value: string;
  onChange: (value: string) => void;
  options?: SelectOption[];
};

type MultiProps = Base & {
  mode: "multi";
  value: string[];
  onChange: (value: string[]) => void;
  options?: SelectOption[];
  maxTags?: number;
};

type TagsProps = Base & {
  mode: "tags";
  value: string[];
  onChange: (value: string[]) => void;
  options?: SelectOption[];
  maxTags?: number;
};

export type SelectProps = SingleProps | MultiProps | TagsProps;

const heights = { sm: "min-h-9", md: "min-h-11" } as const;

export function Select(props: SelectProps) {
  const { c } = useLanguage();
  const t = c.select;
  const mode = props.mode ?? "single";
  const size = props.size ?? "md";
  const staticOptions = props.options ?? [];
  const remote = typeof props.loadOptions === "function";
  const searchable = props.searchable ?? true;
  const minChars = props.minSearchChars ?? 0;

  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [remoteOptions, setRemoteOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const options = remote ? remoteOptions : staticOptions;
  const [cursor, setCursor] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const selected: string[] =
    mode === "single"
      ? (props.value as string)
        ? [props.value as string]
        : []
      : ((props.value as string[]) ?? []);

  const filtered = useMemo(() => {
    const needle = term.trim().toLowerCase();
    if (remote || !needle) return options;
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(needle) ||
        option.value.toLowerCase().includes(needle)
    );
  }, [options, term, remote]);

  const grouped = useMemo(() => {
    const map = new Map<string, SelectOption[]>();
    for (const option of filtered) {
      const key = option.group ?? "";
      map.set(key, [...(map.get(key) ?? []), option]);
    }
    return [...map.entries()];
  }, [filtered]);

  // Debounced remote search: runs on open and on every term change.
  useEffect(() => {
    if (!remote || !open) return;
    const needle = term.trim();
    if (needle.length < minChars) {
      setRemoteOptions([]);
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const result = await props.loadOptions!(needle);
        if (alive) setRemoteOptions(result);
      } catch {
        if (alive) setRemoteOptions([]);
      } finally {
        if (alive) setLoading(false);
      }
    }, 250);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remote, open, term, minChars]);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  useEffect(() => {
    if (open && searchable) searchRef.current?.focus();
    if (!open) {
      setTerm("");
      setCursor(0);
    }
  }, [open, searchable]);

  const commit = (value: string) => {
    if (mode === "single") {
      (props.onChange as (value: string) => void)(value);
      setOpen(false);
      return;
    }
    const next = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    (props.onChange as (value: string[]) => void)(next);
    setTerm("");
  };

  const remove = (value: string) => {
    if (mode === "single") {
      (props.onChange as (value: string) => void)("");
      return;
    }
    (props.onChange as (value: string[]) => void)(
      selected.filter((item) => item !== value)
    );
  };

  const clearAll = () => {
    if (mode === "single") (props.onChange as (value: string) => void)("");
    else (props.onChange as (value: string[]) => void)([]);
  };

  const labelFor = (value: string) =>
    options.find((option) => option.value === value)?.label ??
    props.selectedLabels?.[value] ??
    value;

  const canAddTag =
    mode === "tags" &&
    term.trim().length > 0 &&
    !selected.includes(term.trim()) &&
    !filtered.some(
      (option) => option.label.toLowerCase() === term.trim().toLowerCase()
    );

  const addTag = () => {
    if (!canAddTag) return;
    (props.onChange as (value: string[]) => void)([...selected, term.trim()]);
    setTerm("");
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      if (filtered[cursor]) commit(filtered[cursor].value);
      else addTag();
      return;
    }
    if (event.key === "Backspace" && term === "" && selected.length > 0 && open) {
      const last = selected[selected.length - 1];
      if (last) remove(last);
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      setCursor((prev) => {
        const next = event.key === "ArrowDown" ? prev + 1 : prev - 1;
        if (next < 0) return Math.max(filtered.length - 1, 0);
        if (next > filtered.length - 1) return 0;
        return next;
      });
    }
  };

  const placeholder =
    props.placeholder ??
    (mode === "tags"
      ? t.tagsPlaceholder
      : mode === "multi"
        ? t.multiPlaceholder
        : t.placeholder);

  const showTags = mode !== "single" && selected.length > 0;
  const maxTags = "maxTags" in props ? props.maxTags : undefined;
  const visibleTags = maxTags ? selected.slice(0, maxTags) : selected;
  const hiddenTags = selected.length - visibleTags.length;

  return (
    <div className={cn("w-full", props.className)} ref={rootRef}>
      {props.label && (
        <span
          id={`${listId}-label`}
          className="mb-2 block text-[13px] font-medium text-text-primary"
        >
          {props.label}
        </span>
      )}

      <div className="relative">
        <button
          type="button"
          disabled={props.disabled}
          role="combobox"
          {...(props.label ? { "aria-labelledby": `${listId}-label` } : {})}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => !props.disabled && setOpen((prev) => !prev)}
          onKeyDown={onKeyDown}
          className={cn(
            "flex w-full items-center gap-2 rounded-[10px] border bg-surface-default px-4 py-2 text-start transition-colors",
            heights[size],
            props.error
              ? "border-status-danger"
              : open
                ? "border-border-focus ring-4 ring-ring/20"
                : "border-border-default hover:border-border-strong",
            props.disabled && "cursor-not-allowed bg-surface-subtle opacity-60"
          )}
        >
          <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
            {showTags ? (
              <>
                {visibleTags.map((value) => (
                  <span
                    key={value}
                    className="inline-flex max-w-full items-center gap-1.5 rounded-md bg-primary-subtle px-2 py-1 text-xs font-medium text-brand-deep"
                  >
                    <span className="truncate">{labelFor(value)}</span>
                    <span
                      role="button"
                      tabIndex={-1}
                      aria-label={t.remove}
                      onClick={(event) => {
                        event.stopPropagation();
                        remove(value);
                      }}
                      className="grid h-4 w-4 shrink-0 place-items-center rounded-full hover:bg-brand-deep/10"
                    >
                      <X className="h-3 w-3" aria-hidden="true" />
                    </span>
                  </span>
                ))}
                {hiddenTags > 0 && (
                  <span className="text-xs font-medium text-text-muted">
                    {fill(t.selectedCount, { count: hiddenTags })}
                  </span>
                )}
              </>
            ) : selected.length > 0 ? (
              <span className="truncate text-sm text-text-primary">
                {labelFor(selected[0] ?? "")}
              </span>
            ) : (
              <span className="truncate text-sm text-text-muted">
                {placeholder}
              </span>
            )}
          </span>

          {props.clearable && selected.length > 0 && (
            <span
              role="button"
              tabIndex={-1}
              aria-label={t.clear}
              onClick={(event) => {
                event.stopPropagation();
                clearAll();
              }}
              className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-text-muted hover:bg-surface-subtle"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          )}
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-text-muted transition-transform",
              open && "rotate-180"
            )}
            aria-hidden="true"
          />
        </button>

        {open && (
          <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-border-default bg-surface-default shadow-overlay">
            {(searchable || mode === "tags") && (
              <div className="flex items-center gap-2 border-b border-border-subtle px-3 py-2.5">
                {loading ? (
                  <Loader2
                    className="h-4 w-4 shrink-0 animate-spin text-text-muted"
                    aria-hidden="true"
                  />
                ) : (
                  <Search className="h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" />
                )}
                <input
                  ref={searchRef}
                  value={term}
                  onChange={(event) => {
                    setTerm(event.target.value);
                    setCursor(0);
                  }}
                  onKeyDown={onKeyDown}
                  placeholder={mode === "tags" ? t.tagsPlaceholder : t.search}
                  className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
                />
              </div>
            )}

            <ul id={listId} role="listbox" className="max-h-64 overflow-y-auto py-1">
              {loading && (
                <li className="space-y-2 px-3 py-3" aria-live="polite">
                  {[0, 1, 2, 3].map((row) => (
                    <Skeleton key={row} className="h-4 w-full" />
                  ))}
                </li>
              )}

              {!loading && remote && term.trim().length < minChars && (
                <li className="px-3 py-6 text-center text-sm text-text-muted">
                  {fill(t.typeToSearch, { count: minChars })}
                </li>
              )}

              {!loading && grouped.map(([group, items]) => (
                <li key={group || "_"}>
                  {group && (
                    <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.44px] text-text-muted">
                      {group}
                    </p>
                  )}
                  <ul>
                    {items.map((option) => {
                      const index = filtered.indexOf(option);
                      const active = selected.includes(option.value);
                      return (
                        <li key={option.value}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={active}
                            disabled={option.disabled}
                            onMouseEnter={() => setCursor(index)}
                            onClick={() => !option.disabled && commit(option.value)}
                            className={cn(
                              "flex w-full items-center gap-2 px-3 py-2.5 text-start text-sm transition-colors",
                              index === cursor
                                ? "bg-surface-subtle"
                                : "bg-transparent",
                              active
                                ? "font-medium text-text-primary"
                                : "text-text-secondary",
                              option.disabled && "cursor-not-allowed opacity-50"
                            )}
                          >
                            <span className="min-w-0 flex-1 truncate">
                              {option.label}
                              {option.hint && (
                                <span className="ms-2 text-xs text-text-muted">
                                  {option.hint}
                                </span>
                              )}
                            </span>
                            {active && (
                              <Check
                                className="h-4 w-4 shrink-0 text-brand-deep"
                                aria-hidden="true"
                              />
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}

              {canAddTag && (
                <li>
                  <button
                    type="button"
                    onClick={addTag}
                    className="flex w-full items-center gap-2 px-3 py-2.5 text-start text-sm font-medium text-text-link hover:bg-surface-subtle"
                  >
                    {fill(t.addTag, { value: term.trim() })}
                  </button>
                </li>
              )}

              {!loading &&
                filtered.length === 0 &&
                !canAddTag &&
                !(remote && term.trim().length < minChars) && (
                <li className="px-3 py-6 text-center text-sm text-text-muted">
                  {t.noResults}
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {(props.error || props.hint) && (
        <p
          className={cn(
            "mt-1.5 text-xs",
            props.error ? "text-status-danger" : "text-text-muted"
          )}
        >
          {props.error || props.hint}
        </p>
      )}
    </div>
  );
}

export function SelectRow({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}
