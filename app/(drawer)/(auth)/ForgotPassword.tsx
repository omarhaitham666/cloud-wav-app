import { useForgotPasswordMutation } from "@/store/api/user/user";
import { useRouter } from "expo-router";
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

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSendOTP = async () => {
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
          text2: e?.data?.message || t("auth.forgotPassword.alerts.otpFailedMessage"),
        });
      });
  };

  return (
    <SafeAreaView className="flex-1 min-h-screen">
      <View className="flex-1 justify-center px-6 bg-white">
        <Text 
          className="text-2xl font-bold text-center text-red-600 mb-6"
          style={{ textAlign: isRTL ? 'right' : 'left' }}
        >
          {t("auth.forgotPassword.title")}
        </Text>
        <TextInput
          placeholder={t("auth.forgotPassword.email")}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          className="border border-gray-300 rounded-md px-4 py-3 text-base text-black mb-4"
          style={{ 
            textAlign: isRTL ? 'right' : 'left',
            writingDirection: isRTL ? 'rtl' : 'ltr'
          }}
        />
        <TouchableOpacity
          className="bg-red-600 py-3 rounded-md"
          onPress={handleSendOTP}
        >
          <Text 
            className="text-white text-center font-semibold text-base"
          >
            {isLoading ? <ActivityIndicator color="#fff" /> : t("auth.forgotPassword.sendOTP")}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
