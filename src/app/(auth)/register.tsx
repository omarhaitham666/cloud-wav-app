import CustomHeader from "@/src/components/CustomHeader";
import OTPModal from "@/src/components/OTPModal";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as yup from "yup";

interface FormValues {
  fullName: string;
  email: string;
  birthDate: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const schema = yup.object().shape({
  fullName: yup.string().required("Full Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  birthDate: yup.string().required("Birth Date is required"),
  phone: yup.string().required("Phone Number is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

export default function RegisterScreen() {
  const router = useRouter();
  const [otpVisible, setOtpVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormValues) => {
    Alert.alert("Register", JSON.stringify(data, null, 2));
    setOtpVisible(true);
  };

  const renderInput = ({
    name,
    placeholder,
    secure = false,
    keyboardType = "default",
    showToggle = false,
  }: {
    name: keyof FormValues;
    placeholder: string;
    secure?: boolean;
    keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
    showToggle?: boolean;
  }) => (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View className="mb-4">
          <View className="flex-row items-center border border-gray-300 rounded-md px-3">
            <TextInput
              placeholder={placeholder}
              value={value}
              onChangeText={onChange}
              secureTextEntry={
                secure &&
                !(showToggle && name === "password"
                  ? showPassword
                  : name === "confirmPassword"
                  ? showConfirmPassword
                  : false)
              }
              keyboardType={keyboardType}
              className="flex-1 py-3 text-base text-black"
              placeholderTextColor="#888"
            />
            {showToggle && (
              <TouchableOpacity
                onPress={() =>
                  name === "password"
                    ? setShowPassword(!showPassword)
                    : setShowConfirmPassword(!showConfirmPassword)
                }
              >
                <Ionicons
                  name={
                    (name === "password" && showPassword) ||
                    (name === "confirmPassword" && showConfirmPassword)
                      ? "eye-off"
                      : "eye"
                  }
                  size={20}
                  color="#888"
                />
              </TouchableOpacity>
            )}
          </View>
          {errors[name] && (
            <Text className="text-red-600 text-sm mt-1">
              {errors[name]?.message}
            </Text>
          )}
        </View>
      )}
    />
  );

  return (
    <ScrollView>
      <View className="mt-8">
        <CustomHeader showLanguageSwitcher />
      </View>
      <View className="min-h-screen justify-center px-6 bg-white">
        <Image
          source={require("../../assets/images/register.png")}
          className="w-40 h-40 self-center mb-6"
        />
        <Text className="text-2xl font-bold text-red-600 text-center mb-6">
          Register on Cloud Wav
        </Text>
        {renderInput({ name: "fullName", placeholder: "Enter Your Name" })}
        {renderInput({
          name: "email",
          placeholder: "Email Address",
          keyboardType: "email-address",
        })}

        <Controller
          control={control}
          name="birthDate"
          render={({ field: { value } }) => (
            <View className="mb-4">
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="border border-gray-300 rounded-md px-4 py-3"
              >
                <Text
                  className={`text-base ${
                    value ? "text-black" : "text-gray-400"
                  }`}
                >
                  {value || "Select Birth Date"}
                </Text>
              </TouchableOpacity>
              {errors.birthDate && (
                <Text className="text-red-600 text-sm mt-1">
                  {errors.birthDate.message}
                </Text>
              )}
              {showDatePicker && (
                <DateTimePicker
                  value={value ? new Date(value) : new Date()}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(
                    event: DateTimePickerEvent,
                    selectedDate: Date | undefined
                  ) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      const formatted = `${String(
                        selectedDate.getMonth() + 1
                      ).padStart(2, "0")}/${String(
                        selectedDate.getDate()
                      ).padStart(2, "0")}/${selectedDate.getFullYear()}`;
                      setValue("birthDate", formatted);
                    }
                  }}
                />
              )}
            </View>
          )}
        />

        {renderInput({
          name: "phone",
          placeholder: "Phone Number",
          keyboardType: "phone-pad",
        })}
        {renderInput({
          name: "password",
          placeholder: "Password",
          secure: true,
          showToggle: true,
        })}
        {renderInput({
          name: "confirmPassword",
          placeholder: "Confirm Password",
          secure: true,
          showToggle: true,
        })}

        <TouchableOpacity
          className="bg-red-600 py-3 rounded-md mb-4"
          onPress={handleSubmit(onSubmit)}
        >
          <Text className="text-white text-center font-semibold text-base">
            Sign Up
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
          <Text className="text-red-600 text-center mb-24 text-sm">
            Already have an account? Login
          </Text>
        </TouchableOpacity>
        <OTPModal
          visible={otpVisible}
          email={watch("email")}
          password={watch("password")}
          onVerified={() => {
            setOtpVisible(false);
            router.push("/(drawer)/(tabs)/profile");
          }}
        />
      </View>
    </ScrollView>
  );
}
