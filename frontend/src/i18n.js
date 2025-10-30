import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "../language/en/translation.json";
import vn from "../language/vn/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      vn: { translation: vn },
    },
    lng: "vn", // Ngôn ngữ mặc định
    fallbackLng: "en", // Nếu không tìm thấy key
    interpolation: {
      escapeValue: false, // React đã tự escape
    },
    detection: {
          order: ["localStorage", "navigator"],
          caches: ["localStorage"],
    },
  });

export default i18n;