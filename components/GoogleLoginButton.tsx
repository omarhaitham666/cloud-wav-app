import { AppFonts } from "@/utils/fonts";
import { Ionicons } from "@expo/vector-icons";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleLoginButton() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [isLoading, setIsLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      "927517909310-cehf72jvic47kl42moi8o4bcv82ef0fm.apps.googleusercontent.com",
    redirectUri: "https://api.cloudwavproduction.com/auth/google/redirect",
    scopes: ["profile", "email"],
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      setIsLoading(false);

      Alert.alert(
        t("auth.success") || (isRTL ? "نجح" : "Success"),
        t("auth.googleLoginSuccess") ||
          (isRTL ? "تم تسجيل الدخول بجوجل بنجاح!" : "Google login successful!")
      );
    } else if (response?.type === "error") {
      setIsLoading(false);

      Alert.alert(
        t("auth.error") || (isRTL ? "خطأ" : "Error"),
        t("auth.googleLoginError") ||
          (isRTL
            ? "فشل تسجيل الدخول بجوجل. يرجى المحاولة مرة أخرى."
            : "Google login failed. Please try again.")
      );
    } else if (response?.type === "cancel") {
      setIsLoading(false);
    }
  }, [response, t]);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await promptAsync();
    } catch (error) {
      setIsLoading(false);
      Alert.alert(
        t("auth.error") || (isRTL ? "خطأ" : "Error"),
        t("auth.loginInitError") ||
          (isRTL
            ? "فشل في بدء تسجيل الدخول. يرجى المحاولة مرة أخرى."
            : "Failed to initiate login. Please try again.")
      );
    }
  };

  return (
    <TouchableOpacity
      onPress={handleGoogleLogin}
      disabled={!request || isLoading}
      style={[
        styles.button,
        isRTL && styles.buttonRTL,
        (!request || isLoading) && styles.buttonDisabled,
      ]}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#DB4437" />
      ) : (
        <Ionicons name="logo-google" size={20} color="#DB4437" />
      )}

      <Text
        style={[
          styles.text,
          isRTL ? styles.textRTL : styles.textLTR,
          { fontFamily: AppFonts.semibold },
        ]}
      >
        {isLoading
          ? t("auth.loading") || (isRTL ? "جاري التحميل..." : "Loading...")
          : t("auth.login.continueWithGoogle") ||
            (isRTL ? "المتابعة مع جوجل" : "Continue with Google")}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonRTL: {
    flexDirection: "row-reverse",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    color: "#1f2937",
  },
  textLTR: {
    marginLeft: 12,
    textAlign: "left",
  },
  textRTL: {
    marginRight: 12,
    textAlign: "right",
  },
});
