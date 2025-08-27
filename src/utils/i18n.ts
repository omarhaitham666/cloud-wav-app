import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import ar from "../locales/ar.json";
import en from "../locales/en.json";

export const languageResources = {
  en: { translation: en },
  ar: { translation: ar },
};

i18next.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  resources: languageResources,
});

export default i18next;
