import { useResetPasswordMutation } from "@/store/api/user/user";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Toast from "react-native-toast-message";

export default function ResetPassword() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const { email } = useLocalSearchParams<{ email?: string }>();

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleResetPassword = async () => {
    if (password !== passwordConfirmation) {
      Toast.show({
        type: "error",
        text1: t("auth.resetPassword.alerts.passwordMismatch"),
        text2: t("auth.resetPassword.alerts.passwordMismatchMessage"),
      });
      return;
    }

    await resetPassword({
      email: email || "",
      verification_code: verificationCode,
      password: password,
      password_confirmation: passwordConfirmation,
    })
      .unwrap()
      .then((res) => {
        Toast.show({
          type: "success",
          text1: t("auth.resetPassword.alerts.resetSuccess"),
          text2: t("auth.resetPassword.alerts.resetSuccessMessage"),
        });
        router.replace("/(drawer)/(auth)/login");
      })
      .catch((e) => {
        Toast.show({
          type: "error",
          text1: t("auth.resetPassword.alerts.resetFailed"),
          text2: e?.data?.message || t("auth.resetPassword.alerts.resetFailedMessage"),
        });
      });
  };

  return (
    <SafeAreaView className="flex-1 min-h-screen bg-white">
      <View className="flex-1 justify-center px-6 bg-white">
        <Text 
          className="text-2xl font-bold text-center text-red-600 mb-6"
          style={{ textAlign: isRTL ? 'right' : 'left' }}
        >
          {t("auth.resetPassword.title")}
        </Text>
        <TextInput
          placeholder={t("auth.resetPassword.verificationCode")}
          value={verificationCode}
          onChangeText={setVerificationCode}
          keyboardType="numeric"
          className="border border-gray-300 rounded-md px-4 py-3 text-base text-black mb-4"
          style={{ 
            textAlign: isRTL ? 'right' : 'left',
            writingDirection: isRTL ? 'rtl' : 'ltr'
          }}
        />
        <TextInput
          placeholder={t("auth.resetPassword.newPassword")}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="border border-gray-300 rounded-md px-4 py-3 text-base text-black mb-4"
          style={{ 
            textAlign: isRTL ? 'right' : 'left',
            writingDirection: isRTL ? 'rtl' : 'ltr'
          }}
        />
        <TextInput
          placeholder={t("auth.resetPassword.confirmPassword")}
          value={passwordConfirmation}
          onChangeText={setPasswordConfirmation}
          secureTextEntry
          className="border border-gray-300 rounded-md px-4 py-3 text-base text-black mb-4"
          style={{ 
            textAlign: isRTL ? 'right' : 'left',
            writingDirection: isRTL ? 'rtl' : 'ltr'
          }}
        />
        <TouchableOpacity
          className="bg-red-600 py-3 rounded-md"
          onPress={handleResetPassword}
        >
          <Text 
            className="text-white text-center font-semibold text-base"
          >
            {isLoading ? <ActivityIndicator color="#fff" /> : t("auth.resetPassword.resetPassword")}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
