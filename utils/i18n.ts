import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { I18nManager, NativeModules, Platform } from "react-native";

import ar from "../locales/ar.json";
import en from "../locales/en.json";

// Detect device language using Expo Localization
const locales = getLocales();
const lng =
  locales.length > 0 && locales[0].languageCode
    ? locales[0].languageCode
    : "en";

// --- DIRECTION HANDLING ---
// We want to allow RTL for Arabic, but keep LTR for English.
// To avoid stale direction/layout issues, we must:
// 1. Set direction on every language change
// 2. Optionally reload the app if direction changes (required for full effect)

const isRTL = (languageCode: string) => languageCode === "ar";

// Helper to set direction and reload if needed
const setAppDirection = (rtl: boolean) => {
  // Only update if direction actually changes
  if (I18nManager.isRTL !== rtl) {
    I18nManager.allowRTL(rtl);
    I18nManager.forceRTL(rtl);
    // @ts-ignore
    I18nManager.swapLeftAndRightInRTL && I18nManager.swapLeftAndRightInRTL(rtl);

    // Full reload is required for direction change to take effect everywhere
    if (Platform.OS === "android") {
      NativeModules.DevSettings.reload();
    } else if (Platform.OS === "ios") {
      NativeModules.RNRestart ? NativeModules.RNRestart.Restart() : NativeModules.DevSettings.reload();
    }
  }
};

// Set initial direction
setAppDirection(isRTL(lng));

// Function to change language and direction
export const changeLanguage = async (languageCode: string) => {
  await i18n.changeLanguage(languageCode);
  setAppDirection(isRTL(languageCode));
  // The reload will be triggered if direction changes
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

export default i18n;
