import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const handleSendOTP = async () => {
    try {
      Alert.alert("OTP Sent", `Verification code sent to ${email}`);
      router.push({ pathname: "/ResetPassword", params: { email } });
    } catch (error) {
      Alert.alert("Error", "Failed to send OTP. Try again.");
    }
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
            Send Verification Code
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
