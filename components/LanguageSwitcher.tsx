import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  I18nManager,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function LanguageSwitcher() {
  const { i18n, ready } = useTranslation();
  const [isReady, setIsReady] = useState(ready);
  const [scaleValue] = useState(new Animated.Value(1));

  useEffect(() => {
    if (i18n.isInitialized && !isReady) {
      setIsReady(true);
    }
  }, [i18n.isInitialized, isReady]);

  if (!isReady) return null;

  const toggleLanguage = async () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    const newLang = i18n.language === "en" ? "ar" : "en";

    if (newLang === "ar") {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
    } else {
      I18nManager.allowRTL(false);
      I18nManager.forceRTL(false);
    }

    await i18n.changeLanguage(newLang);

    // if (Updates.reloadAsync) {
    //   await Updates.reloadAsync();
    // }
  };

  const isArabic = i18n.language === "ar";

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        onPress={toggleLanguage}
        activeOpacity={0.8}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderRadius: 30,
          backgroundColor: "#ffffff",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 1,
          borderWidth: 1,
          borderColor: "#fff",
          minWidth: 110,
        }}
      >
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: isArabic ? "#1e7e34" : "#dc3545",
            alignItems: "center",
            justifyContent: "center",
            marginRight: isArabic ? 0 : 8,
            marginLeft: isArabic ? 8 : 0,
          }}
        >
          <Text style={{ fontSize: 12, color: "white", fontWeight: "bold" }}>
            {isArabic ? "AR" : "EN"}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 14,
            color: "#1f2937",
            fontWeight: "600",
            letterSpacing: 0.5,
            marginLeft: isArabic ? 8 : 0,
          }}
        >
          {isArabic ? "English" : "العربية"}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
