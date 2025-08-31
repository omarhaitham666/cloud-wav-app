import { useResetPasswordMutation } from "@/store/api/user/user";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function ResetPassword() {
  const router = useRouter();
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const { email } = useLocalSearchParams<{ email?: string }>();

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleResetPassword = async () => {
    if (password !== passwordConfirmation) {
      Toast.show({
        type: "error",
        text1: "Passwords do not match",
        text2: "Please try again",
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
          text1: "Password Reset Successfully",
          text2: "Please check your email for the verification code.",
        });
        router.replace("/(drawer)/(auth)/login");
      })
      .catch((e) => {
        Toast.show({
          type: "error",
          text1: "Password Reset Failed",
          text2: e?.data?.message || "Something went wrong",
        });
      });
  };

  return (
    <SafeAreaView className="flex-1 min-h-screen bg-white">
      <View className="flex-1 justify-center px-6 bg-white">
        <Text className="text-2xl font-bold text-center text-red-600 mb-6">
          Reset Password
        </Text>
        <TextInput
          placeholder="Verification Code"
          value={verificationCode}
          onChangeText={setVerificationCode}
          keyboardType="numeric"
          className="border border-gray-300 rounded-md px-4 py-3 text-base text-black mb-4"
        />
        <TextInput
          placeholder="New Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="border border-gray-300 rounded-md px-4 py-3 text-base text-black mb-4"
        />
        <TextInput
          placeholder="Confirm Password"
          value={passwordConfirmation}
          onChangeText={setPasswordConfirmation}
          secureTextEntry
          className="border border-gray-300 rounded-md px-4 py-3 text-base text-black mb-4"
        />
        <TouchableOpacity
          className="bg-red-600 py-3 rounded-md"
          onPress={handleResetPassword}
        >
          <Text className="text-white text-center font-semibold text-base">
            {isLoading ? "Resetting..." : "Reset Password"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
