import { AppFonts } from "@/utils/fonts";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const AuthProfile = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <View className="flex-1 bg-black">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <LinearGradient
        colors={["#4C1D95", "#1E3A8A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
      />
      <View
        className="flex-1 justify-center items-center px-8"
        style={{
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        <View className="items-center mb-16">
          <Text
            className="text-2xl text-white/80 mb-2"
            style={{
              fontFamily: AppFonts.medium,
              textAlign: isRTL ? "right" : "left",
            }}
          >
            {t("profile.auth.welcome")}
          </Text>
          <Text
            className="text-5xl text-white mb-2"
            style={{
              fontFamily: AppFonts.bold,
              textAlign: isRTL ? "right" : "left",
            }}
          >
            {t("profile.auth.appName")}
          </Text>
          <Text
            className="text-base text-white/70 text-center leading-6 mt-3"
            style={{
              fontFamily: AppFonts.regular,
              textAlign: isRTL ? "center" : "center",
            }}
          >
            {t("profile.auth.subtitle")}
          </Text>
        </View>
        <View className="w-full gap-4 mb-12">
          <TouchableOpacity
            className="w-full h-14 rounded-3xl border-2 border-white justify-center items-center"
            activeOpacity={0.8}
            onPress={() => router.push("/(drawer)/(auth)/login")}
          >
            <Text
              className="text-white text-lg"
              style={{ 
                fontFamily: AppFonts.bold,
                textAlign: isRTL ? "center" : "center"
              }}
            >
              {t("profile.auth.login")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-full h-14 rounded-3xl border-2 border-white justify-center items-center"
            activeOpacity={0.8}
            onPress={() => router.push("/(drawer)/(auth)/register")}
          >
            <Text
              className="text-white text-lg"
              style={{ 
                fontFamily: AppFonts.bold,
                textAlign: isRTL ? "center" : "center"
              }}
            >
              {t("profile.auth.register")}
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          className="text-white/60 text-xs text-center leading-5"
          style={{
            fontFamily: AppFonts.regular,
            textAlign: isRTL ? "center" : "center",
          }}
        >
          {t("profile.auth.terms")}
        </Text>
      </View>
    </View>
  );
};

export default AuthProfile;
