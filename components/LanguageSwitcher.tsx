import { AppFonts } from "@/utils/fonts";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Pressable, Text, View } from "react-native";
import Feather from "react-native-vector-icons/Feather";

export default function LanguageSwitcher() {
  const { i18n, ready } = useTranslation();
  const [isReady, setIsReady] = useState(ready);
  const [scaleValue] = useState(new Animated.Value(1));
  const isArabic = i18n.language === "ar";

  const activeColors = useMemo(
    () => ({
      primary: "#4f46e5",
      primaryText: "#ffffff",
      mutedBg: "#f3f4f6",
      mutedBorder: "#e5e7eb",
      text: "#111827",
      subText: "#6b7280",
    }),
    []
  );

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
    await i18n.changeLanguage(newLang);
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <Pressable
        onPress={toggleLanguage}
        style={{
          flexDirection: isArabic ? "row-reverse" : "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: isArabic ? "row-reverse" : "row",
            alignItems: "center",
          }}
        >
          <Feather
            name="globe"
            size={20}
            color={activeColors.text}
            style={isArabic ? { marginLeft: 10 } : { marginRight: 10 }}
          />
          <View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: activeColors.text,
                textAlign: isArabic ? "right" : "left",
                fontFamily: AppFonts.semibold,
              }}
            >
              {isArabic ? "العربية" : "English"}
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
