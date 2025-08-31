import { useVerifyCodeMutation } from "@/store/api/user/user";
import React, { useState } from "react";
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
  onVerified: () => void;
}

export default function OTPModal({
  visible,
  email,
  password,
  onVerified,
}: OTPModalProps) {
  const [otp, setOtp] = useState("");
  const [verifyCode, { isLoading }] = useVerifyCodeMutation();

  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 6) {
      Alert.alert("Error", "Please enter a valid 6-digit OTP.");
      return;
    }

    await verifyCode({ email, password, code: otp })
      .unwrap()
      .then((res) => {
        console.log(res);
        Toast.show({
          type: "success",
          text1: "Account Verified 🎉",
        });
        onVerified();
      })
      .catch((e) => {
        Toast.show({
          type: "error",
          text1: "Verification Failed",
          text2: e?.data?.message || "Something went wrong",
        });
      });
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-6 rounded-2xl w-80">
          <Text className="text-lg font-bold text-center mb-4 text-red-600">
            Verify Your Account
          </Text>
          <Text className="text-gray-600 text-center mb-4">
            Enter the 6-digit OTP sent to your email.
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
            disabled={isLoading}
            className={`py-3 rounded-md mt-4 ${
              isLoading ? "bg-gray-400" : "bg-red-600"
            }`}
            onPress={handleVerifyOTP}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-center font-semibold text-base">
                Verify
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
