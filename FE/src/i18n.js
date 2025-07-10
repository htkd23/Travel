// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import JSON (demo)
import common_vi from "./locales/vi/common.json";
import common_en from "./locales/en/common.json";

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            vi: { common: common_vi },
            en: { common: common_en },
        },
        fallbackLng: "vi",
        ns: ["common"],
        defaultNS: "common",
        interpolation: { escapeValue: false },
    });

export default i18n;
