import { AppFonts } from "@/utils/fonts";
import { Ionicons } from "@expo/vector-icons";
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import React, { useCallback, useEffect, useState } from "react";
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

  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "com.cloudwavapp",
    path: "auth",
  });
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      "877091254165-tjq8qbr8ck4hamvnkdneen0a2s537tjl.apps.googleusercontent.com",
    redirectUri,
    scopes: ["openid", "profile", "email"],
    extraParams: {
      access_type: "offline",
      prompt: "consent",
    },
  });

  const handleGoogleAuthSuccess = useCallback(
    async (authentication: any) => {
      try {
        const response = await fetch(
          "https://api.cloudwavproduction.com/auth/google",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              accessToken: authentication.accessToken,
              idToken: authentication.idToken,
            }),
          }
        );

        if (response.ok) {
          await response.json();

          Alert.alert(
            t("auth.success") || (isRTL ? "نجح" : "Success"),
            t("auth.googleLoginSuccess") ||
              (isRTL
                ? "تم تسجيل الدخول بجوجل بنجاح!"
                : "Google login successful!")
          );
        } else {
          throw new Error("Server authentication failed");
        }
      } catch (error) {
        console.error("Google auth error:", error);
        Alert.alert(
          t("auth.error") || (isRTL ? "خطأ" : "Error"),
          t("auth.googleLoginError") ||
            (isRTL
              ? "فشل تسجيل الدخول بجوجل. يرجى المحاولة مرة أخرى."
              : "Google login failed. Please try again.")
        );
      }
    },
    [t, isRTL]
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      setIsLoading(false);
      if (authentication) handleGoogleAuthSuccess(authentication);
    } else if (response?.type === "error") {
      setIsLoading(false);
      console.error("Google auth error:", response.error);

      let errorMessage =
        t("auth.googleLoginError") ||
        (isRTL
          ? "فشل تسجيل الدخول بجوجل. يرجى المحاولة مرة أخرى."
          : "Google login failed. Please try again.");

      if (response.error?.message?.includes("access_denied")) {
        errorMessage = isRTL
          ? "تم رفض الوصول. يرجى التأكد من إعدادات التطبيق في Google Console."
          : "Access denied. Please check app settings in Google Console.";
      } else if (response.error?.message?.includes("invalid_client")) {
        errorMessage = isRTL
          ? "معرف العميل غير صحيح. يرجى التحقق من إعدادات التطبيق."
          : "Invalid client ID. Please check app configuration.";
      } else if (response.error?.message?.includes("unauthorized_client")) {
        errorMessage = isRTL
          ? "التطبيق غير مصرح له. يرجى إضافة التطبيق في Google Console."
          : "App not authorized. Please add the app in Google Console.";
      }

      Alert.alert(
        t("auth.error") || (isRTL ? "خطأ" : "Error"),
        response.error?.message || errorMessage
      );
    } else if (response?.type === "cancel") {
      setIsLoading(false);
    }
  }, [response, t, isRTL, handleGoogleAuthSuccess]);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);

      if (!request) {
        throw new Error("Google auth request not ready");
      }

      await promptAsync();
    } catch (error) {
      setIsLoading(false);
      console.error("Google login error:", error);

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
    shadowOffset: { width: 0, height: 1 },
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
