import { useVerifyCodeMutation } from "@/store/api/user/user";
import { useAuth } from "@/store/auth-context";
import { AppFonts } from "@/utils/fonts";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

interface OTPModalProps {
  visible: boolean;
  email: string;
  password: string;
  onVerified: (userData?: any) => void;
}

export default function OTPModal({
  visible,
  email,
  password,
  onVerified,
}: OTPModalProps) {
  const { t, i18n } = useTranslation();
  const [otp, setOtp] = useState("");
  const [verifyCode, { isLoading }] = useVerifyCodeMutation();
  const { triggerAuthRefresh } = useAuth();
  const isArabic = i18n.language === "ar";

  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 6) {
      Alert.alert(t("otp.alerts.errorTitle"), t("otp.alerts.invalidOTP"));
      return;
    }

    await verifyCode({ email, password, code: otp })
      .unwrap()
      .then((res) => {
        console.log(res);
        Toast.show({
          type: "success",
          text1: t("otp.alerts.verificationSuccess"),
        });
        triggerAuthRefresh();
        onVerified(res.message || res);
      })
      .catch((e) => {
        Toast.show({
          type: "error",
          text1: t("otp.alerts.verificationFailed"),
          text2: e?.data?.message || t("otp.alerts.verificationFailedMessage"),
        });
      });
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-center items-center bg-black/50">
        <View
          className="bg-white p-6 rounded-2xl w-80"
          style={{
            alignItems: isArabic ? "flex-end" : "flex-start",
          }}
        >
          <Text
            className="text-lg font-bold text-center mb-4 text-red-600"
            style={{
              fontFamily: AppFonts.bold,
              width: "100%",
            }}
          >
            {t("otp.title")}
          </Text>
          <Text
            className="text-gray-600 text-center mb-4"
            style={{
              fontFamily: AppFonts.regular,
              width: "100%",
            }}
          >
            {t("otp.subtitle")}
          </Text>
          <TextInput
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
            maxLength={6}
            placeholder={t("otp.placeholder")}
            className="border border-gray-300 rounded-md px-4 py-3 text-center text-lg tracking-widest text-black"
            style={{
              fontFamily: AppFonts.medium,
            }}
          />
          <TouchableOpacity
            disabled={isLoading}
            className={`py-3 rounded-md mt-4 ${
              isLoading ? "bg-gray-400" : "bg-red-600"
            }`}
            onPress={handleVerifyOTP}
            style={{ width: "100%" }}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text
                className="text-white text-center font-semibold text-base"
                style={{ fontFamily: AppFonts.semibold }}
              >
                {t("otp.verifyButton")}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
