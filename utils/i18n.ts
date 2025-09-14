import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { I18nManager } from "react-native";

import ar from "../locales/ar.json"; // example Arabic
import en from "../locales/en.json";

// detect device language using Expo Localization
const locales = getLocales();
const lng =
  locales.length > 0 && locales[0].languageCode
    ? locales[0].languageCode
    : "en";

// Force the UI direction to always be LTR regardless of language
I18nManager.allowRTL(false);
I18nManager.forceRTL(false);
// Ensure no auto mirroring of left/right styles
// @ts-ignore - older React Native types may not include this API
I18nManager.swapLeftAndRightInRTL && I18nManager.swapLeftAndRightInRTL(false);

// Function to change language only (no direction changes)
export const changeLanguage = (languageCode: string) => {
  i18n.changeLanguage(languageCode);
};

i18n.use(initReactI18next).init({
  lng,
  fallbackLng: "en",
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  interpolation: { escapeValue: false },
  react: {
    useSuspense: false,
  },
});

// Direction is locked to LTR above; no further init needed

export default i18n;
