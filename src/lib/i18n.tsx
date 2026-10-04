import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { dict, type Dict, type Language } from "./dict";

const STORAGE_KEY = "hoteliana-lang";

interface LanguageContextValue {
  lang: Language;
  dir: "rtl" | "ltr";
  c: Dict;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  // Read the stored preference after hydration to avoid a mismatch.
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "ar" || stored === "en") setLangState(stored);
  }, []);

  const dir: "rtl" | "ltr" = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => {
      const next: Language = prev === "ar" ? "en" : "ar";
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return (
    <LanguageContext.Provider
      value={{ lang, dir, c: dict[lang], setLang, toggleLang }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

/**
 * Replace {name} placeholders in a copy string.
 *
 * A number takes the digits of the sentence it lands in. The template is
 * already the reader's language - every caller passes the Arabic string
 * when the portal is in Arabic - so an Arabic sentence gets Arabic-Indic
 * digits and its own thousands separator, and "١٬٠٠٠ ر.س" stops coming
 * out as "1000 ر.س".
 *
 * Strings are left exactly as they are: a reference like HTL-88214, a
 * time, or a phrase a caller has already counted is a name rather than a
 * quantity, and it is not this function's business to reformat it.
 */
export function fill(
  template: string,
  vars: Record<string, string | number>
): string {
  const arabic = /[\u0600-\u06ff]/.test(template);
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const value = vars[key];
    if (value === undefined) return `{${key}}`;
    return typeof value === "number"
      ? value.toLocaleString(arabic ? "ar-EG" : "en-US")
      : String(value);
  });
}
