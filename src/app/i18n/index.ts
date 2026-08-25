import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ar from "./locales/ar.json";

const savedLanguage = localStorage.getItem("language") || "en";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    lng: savedLanguage, // 💡 Default language from localStorage
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // 💡 React already protects from XSS
    },
  });

export default i18n;

// 💡 Central i18n configuration file
