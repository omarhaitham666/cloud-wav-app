import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, I18nManager } from "react-native";

export default function LanguageSwitcher() {
  const { i18n, ready } = useTranslation();
  const [isReady, setIsReady] = useState(ready);

  useEffect(() => {
    if (i18n.isInitialized && !isReady) {
      setIsReady(true);
    }
  }, [i18n.isInitialized, isReady]);

  if (!isReady) {
    return null;
  }

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";

    if (newLang === "ar") {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
    } else {
      I18nManager.allowRTL(false);
      I18nManager.forceRTL(false);
    }
    i18n.changeLanguage(newLang);
  };

  return (
    <Button
      title={i18n.language === "en" ? "Switch to Arabic" : "Switch to English"}
      onPress={toggleLanguage}
    />
  );
}
