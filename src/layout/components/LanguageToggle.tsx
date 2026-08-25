import { useTranslation } from "react-i18next";

export function LanguageToggle({ className = "text-primary" }: { className?: string }) {
    const { i18n, t } = useTranslation();

    const changeLanguage = (lang: "en" | "ar") => {
        i18n.changeLanguage(lang);
        localStorage.setItem("language", lang);

        // 💡 Handle RTL/LTR direction
        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = lang;
    };

    return (
        <div className={`flex gap-2 ${className}`}>
            {i18n.language === "ar" ? (
                <button onClick={() => changeLanguage("en")}>{t("language.englishShort")}</button>
            ) : (
                <button onClick={() => changeLanguage("ar")}>{t("language.arabicShort")}</button>
            )}
        </div>
    );
}
