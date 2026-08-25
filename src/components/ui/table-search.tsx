import { Search, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface TableSearch {
  onSearch: (value: string) => void;
  onClearSearch?: () => void;
  placeholder?: string;
  className?: string;
}

export default function TableSearch({
  onSearch,
  onClearSearch,
  placeholder,
  className = "",
}: TableSearch) {
  const { t } = useTranslation();
  const [value, setValue] = useState("");

  const handleChange = (val: string) => {
    setValue(val);
    onSearch(val);
  };

  const handleClear = () => {
    setValue("");
    onClearSearch();
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div
        className={`
    group
    flex items-center
    px-4 py-2.5
    rounded-2xl
    border border-slate-200
    bg-white
    text-sm
    shadow-sm
    transition-all duration-200

    focus:border-slate-400 focus-within:shadow-md
    hover:shadow-md
    focus-within:border-slate-400

    dark:bg-slate-900
    dark:border-slate-700
    dark:hover:border-slate-600
    dark:focus-within:border-violet-500
  `}
      >
        {/* Search Icon */}
        <Search className="w-4 h-4 text-slate-400 group-focus-within:text-slate-600 dark:text-slate-500 dark:group-focus-within:text-violet-400 transition-colors" />

        {/* Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder || t("ui.searchPlaceholder")}
          className="
      ml-3
      w-full
      bg-transparent
      outline-none
      text-slate-800
      placeholder:text-slate-400

      dark:text-slate-200
      dark:placeholder:text-slate-500
    "
        />

        {/* Clear */}
        {value && (
          <X
            className="w-4 h-4 text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 cursor-pointer transition-colors"
            onClick={handleClear}
          />
        )}
      </div>
    </div>
  );
}
