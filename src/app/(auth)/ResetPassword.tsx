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

interface ResetPasswordProps {
  route: { params: { email: string } };
  navigation: any;
}

export default function ResetPassword() {
  const router = useRouter();
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const handleResetPassword = async () => {
    if (password !== passwordConfirmation) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      // Example API request (replace URL with your backend)
      // await fetch("API/reset-password", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, verification_code: verificationCode, password, password_confirmation: passwordConfirmation }),
      // });
      router.push("/(drawer)/(tabs)");
      Alert.alert("Success", "Password has been reset!");
    } catch (error) {
      Alert.alert("Error", "Failed to reset password.");
    }
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
            Reset Password
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
