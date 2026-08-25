"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, X, Check, Filter as FilterIcon, Loader2Icon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Option {
  label: string;
  value: string;
}

interface SelectMenuProps {
  options: Option[];
  value: string | null;
  onChange: (value: string | number | null) => void;
  placeholder?: string;
  className?: string;
  loading?: boolean
}

export default function Filter({
  options,
  value,
  onChange,
  placeholder,
  className = "",
  loading = false
}: SelectMenuProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState<number>(-1);
  const ref = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;

    if (e.key === "ArrowDown") {
      setHighlighted((prev) => (prev + 1) % options.length);
    }

    if (e.key === "ArrowUp") {
      setHighlighted((prev) =>
        prev <= 0 ? options.length - 1 : prev - 1
      );
    }

    if (e.key === "Enter" && highlighted >= 0) {
      onChange(options[highlighted].value);
      setOpen(false);
    }

    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <div
      ref={ref}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`relative w-full ${className}`}
    >
      {/* Trigger */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className={`
          group
          flex items-center justify-between
          px-3 py-2
          rounded-xl
          border border-gray-200
          bg-white
          text-sm
          cursor-pointer
          shadow-sm
          transition-all duration-200
          hover:border-gray-300 hover:shadow
          focus-within:ring-2 focus-within:ring-blue-500/40
          ${open ? "ring-2 ring-blue-500/40 border-blue-400" : ""}
        `}
      >

        {loading ? (
          <Loader2Icon className="animate-spin mx-auto" />
        ) : (
          <>
            {/* Left side */}
            <div className="flex items-center gap-2 truncate">
              <FilterIcon
                className={`w-4 h-4 transition-colors ${open ? "text-blue-500" : "text-gray-400 group-hover:text-gray-600"
                  }`}
              />
              <span
                className={`truncate ${selectedOption ? "text-gray-800" : "text-gray-400"
                  }`}
              >
                {selectedOption?.label || placeholder || t("ui.selectPlaceholder")}
              </span>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {value && (
                <X
                  className="w-4 h-4 text-gray-400 hover:text-red-500 transition"
                  onClick={handleClear}
                />
              )}
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${open ? "rotate-180 text-blue-500" : ""
                  }`}
              />
            </div>
          </>
        )}

      </div>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute z-50 mt-2 w-full
            bg-white border border-gray-200
            rounded-xl shadow-xl
            max-h-60 overflow-auto
            animate-in fade-in zoom-in-95 duration-150
          "
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isHighlighted = index === highlighted;

            return (
              <div
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                onMouseEnter={() => setHighlighted(index)}
                className={`
                  px-3 py-2 text-sm
                  cursor-pointer
                  flex items-center justify-between
                  transition-colors
                  ${isHighlighted
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                  }
                `}
              >
                <span className="text-gray-700">
                  {option.label}
                </span>

                {isSelected && (
                  <Check className="w-4 h-4 text-blue-500" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
