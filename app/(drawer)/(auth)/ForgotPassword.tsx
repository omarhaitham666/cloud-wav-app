import { useForgotPasswordMutation } from "@/store/api/user/user";
import { AppFonts } from "@/utils/fonts";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Toast from "react-native-toast-message";

// const { width, height } = Dimensions.get("window");

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const logoScale = useSharedValue(0);
  const formOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    logoScale.value = withSpring(1, { damping: 15, stiffness: 150 });
    formOpacity.value = withTiming(1, { duration: 800 });
  }, [logoScale, formOpacity]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const formAnimatedStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [
      { translateY: interpolate(formOpacity.value, [0, 1], [30, 0]) },
    ],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleSendOTP = async () => {
    buttonScale.value = withSpring(0.95, {}, () => {
      buttonScale.value = withSpring(1);
    });

    await forgotPassword({
      email: email,
    })
      .unwrap()
      .then((res) => {
        Toast.show({
          type: "success",
          text1: t("auth.forgotPassword.alerts.otpSent"),
          text2: t("auth.forgotPassword.alerts.otpSentMessage"),
        });
        router.replace({
          pathname: "/(drawer)/(auth)/ResetPassword",
          params: { email: email },
        });
      })
      .catch((e) => {
        Toast.show({
          type: "error",
          text1: t("auth.forgotPassword.alerts.otpFailed"),
          text2:
            e?.data?.message ||
            t("auth.forgotPassword.alerts.otpFailedMessage"),
        });
      });
  };

  return (
    <View className="flex-1">
      <LinearGradient
        colors={["#fef2f2", "#ffffff", "#fef2f2"]}
        locations={[0, 0.5, 1]}
        className="flex-1"
      >
        <SafeAreaView
          className="flex-1"
          style={{ paddingTop: 20, paddingBottom: 20 }}
        >
          <View className="flex-1 justify-center px-6">
            <Animated.View
              entering={FadeInUp.delay(100)}
              style={logoAnimatedStyle}
              className="items-center mb-8"
            >
              <View
                className="bg-white rounded-3xl p-8 mb-6"
                style={{
                  shadowColor: "#dc2626",
                  shadowOffset: { width: 0, height: 12 },
                  shadowOpacity: 0.2,
                  shadowRadius: 20,
                  elevation: 10,
                }}
              >
                <Ionicons name="key-outline" size={48} color="#dc2626" />
              </View>
              <Text
                className="text-3xl font-bold text-red-600 mb-2"
                style={{
                  fontFamily: AppFonts.bold,
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {t("auth.forgotPassword.title")}
              </Text>
              <Text
                className="text-gray-600 text-base text-center px-4"
                style={{
                  fontFamily: AppFonts.medium,
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {t("auth.forgotPassword.subtitle") ||
                  "Enter your email address and we'll send you a verification code to reset your password"}
              </Text>
            </Animated.View>

            <Animated.View style={formAnimatedStyle} className="mb-6">
              <Animated.View entering={FadeInDown.delay(200)} className="mb-6">
                <View
                  className="flex-row items-center rounded-3xl px-6 py-5 bg-white"
                  style={{
                    shadowColor: email ? "#dc2626" : "#000",
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: email ? 0.25 : 0.1,
                    shadowRadius: 16,
                    elevation: email ? 8 : 2,
                    backgroundColor: email ? "#fef2f2" : "#ffffff",
                  }}
                >
                  <View className={`mr-3 ${isRTL ? "ml-3 mr-0" : ""}`}>
                    <Ionicons
                      name="mail-outline"
                      size={22}
                      color={email ? "#dc2626" : "#9ca3af"}
                    />
                  </View>
                  <TextInput
                    placeholder={t("auth.forgotPassword.email")}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="flex-1 text-gray-800 text-base"
                    placeholderTextColor="#9CA3AF"
                    textAlignVertical="center"
                    style={{
                      textAlign: isRTL ? "right" : "left",
                      writingDirection: isRTL ? "rtl" : "ltr",
                      fontFamily: AppFonts.medium,
                    }}
                  />
                </View>
              </Animated.View>

              <Animated.View
                entering={FadeInUp.delay(400)}
                style={buttonAnimatedStyle}
              >
                <TouchableOpacity
                  className="py-5 rounded-3xl mb-6"
                  onPress={handleSendOTP}
                >
                  <LinearGradient
                    colors={["#dc2626", "#ef4444", "#dc2626"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="py-5 rounded-3xl"
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text
                        className="text-white text-center font-bold text-lg"
                        style={{
                          fontFamily: AppFonts.bold,
                        }}
                      >
                        {t("auth.forgotPassword.sendOTP")}
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View
                entering={FadeInUp.delay(600)}
                className="flex-row justify-center items-center"
              >
                <Text
                  className="text-gray-600 text-sm mr-1"
                  style={{
                    fontFamily: AppFonts.medium,
                  }}
                >
                  {t("auth.forgotPassword.rememberPassword") ||
                    "Remember your password?"}
                </Text>
                <TouchableOpacity onPress={() => router.back()}>
                  <Text
                    className="text-red-600 text-sm font-bold"
                    style={{
                      fontFamily: AppFonts.bold,
                    }}
                  >
                    {t("auth.forgotPassword.backToLogin") || "Back to Login"}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
