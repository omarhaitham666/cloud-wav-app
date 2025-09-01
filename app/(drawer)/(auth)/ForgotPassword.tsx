import { useForgotPasswordMutation } from "@/store/api/user/user";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSendOTP = async () => {
    await forgotPassword({
      email: email,
    })
      .unwrap()
      .then((res) => {
        Toast.show({
          type: "success",
          text1: "OTP Sent Successfully",
          text2: "Please check your email for the verification code.",
        });
        router.replace({
          pathname: "/(drawer)/(auth)/ResetPassword",
          params: { email: email },
        });
      })
      .catch((e) => {
        Toast.show({
          type: "error",
          text1: "Failed to send OTP",
          text2: e?.data?.message || "Something went wrong",
        });
      });
  };

  return (
    <SafeAreaView className="flex-1 min-h-screen">
      <View className="flex-1 justify-center px-6 bg-white">
        <Text className="text-2xl font-bold text-center text-red-600 mb-6">
          Forgot Password
        </Text>
        <TextInput
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          className="border border-gray-300 rounded-md px-4 py-3 text-base text-black mb-4"
        />
        <TouchableOpacity
          className="bg-red-600 py-3 rounded-md"
          onPress={handleSendOTP}
        >
          <Text className="text-white text-center font-semibold text-base">
            {isLoading ? <ActivityIndicator color="#fff" /> : "Send OTP"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
