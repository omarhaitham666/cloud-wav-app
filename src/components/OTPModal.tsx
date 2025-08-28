import React, { useState } from "react";
import {
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface OTPModalProps {
  visible: boolean;
  email: string;
  password: string;
  onVerified: () => void;
}

export default function OTPModal({
  visible,
  email,
  password,
  onVerified,
}: OTPModalProps) {
  const [otp, setOtp] = useState("");

  const handleVerifyOTP = () => {
    if (otp === "123456") {
      Alert.alert("Success", "Account verified successfully!");
      onVerified();
    } else {
      Alert.alert("Error", "Invalid OTP. Please try again.");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-6 rounded-2xl w-80">
          <Text className="text-lg font-bold text-center mb-4 text-red-600">
            Verify Your Account
          </Text>
          <Text className="text-gray-600 text-center mb-4">
            Enter the 6-digit OTP sent to your phone/email.
          </Text>
          <TextInput
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
            maxLength={6}
            placeholder="Enter OTP"
            className="border border-gray-300 rounded-md px-4 py-3 text-center text-lg tracking-widest text-black"
          />
          <TouchableOpacity
            className="bg-red-600 py-3 rounded-md mt-4"
            onPress={handleVerifyOTP}
          >
            <Text className="text-white text-center font-semibold text-base">
              Verify
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
