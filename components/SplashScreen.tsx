import { AppFonts } from "@/utils/fonts";
import React from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Text, View } from "react-native";

const SplashScreen = ({ isText }: { isText?: boolean }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  return (
    <View className="flex-1 justify-center items-center w-full bg-black">
      <ActivityIndicator size="large" color="#f9a826" />
      {isText && (
        <Text
          className="text-white mt-2"
          style={{
            fontFamily: AppFonts.medium,
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {t("profile.user.loading") || "Loading..."}
        </Text>
      )}
    </View>
  );
};

export default SplashScreen;
