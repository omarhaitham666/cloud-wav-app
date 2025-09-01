import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { I18nManager } from "react-native";

import ar from "../locales/ar.json"; // example Arabic
import en from "../locales/en.json";

// detect device language using Expo Localization
const locales = getLocales();
const lng = (locales.length > 0 && locales[0].languageCode) ? locales[0].languageCode : "en";

// RTL languages
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

// Function to change language and handle RTL
export const changeLanguage = (languageCode: string) => {
  const isRTL = RTL_LANGUAGES.includes(languageCode);
  
  // Force RTL/LTR layout
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(isRTL);
  
  // Change i18n language
  i18n.changeLanguage(languageCode);
  
  // Note: App restart may be required for RTL changes to take full effect
  // This is a React Native limitation
};

i18n
  .use(initReactI18next)
  .init({
    lng,
    fallbackLng: "en",
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    interpolation: { escapeValue: false },
  });

// Set initial RTL state
const isRTL = RTL_LANGUAGES.includes(lng);
I18nManager.allowRTL(true);
I18nManager.forceRTL(isRTL);

export default i18n;
