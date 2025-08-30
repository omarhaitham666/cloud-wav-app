import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as yup from "yup";

interface LoginFormValues {
  username: string;
  password: string;
}

const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function LoginScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: LoginFormValues) => {
    Alert.alert("Login", JSON.stringify(data, null, 2));
    // TODO: call your login API here
  };

  const renderInput = ({
    name,
    placeholder,
    secure = false,
    keyboardType = "default",
    showToggle = false,
  }: {
    name: keyof LoginFormValues;
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
                !(showToggle && name === "password" ? showPassword : false)
              }
              keyboardType={keyboardType}
              className="flex-1 py-3 text-base text-black"
              placeholderTextColor="#888"
              autoCapitalize="none"
            />
            {showToggle && (
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
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
    <SafeAreaView className="flex-1 py-3 bg-white">
      <View className="flex-1  justify-center px-6">
        <Image
          source={require("../../../assets/images/login.png")}
          className="w-40 h-40 self-center mb-6"
        />
        <Text className="text-2xl font-bold text-red-600 text-center mb-6">
          Welcome to Cloud Wav
        </Text>

        {renderInput({ name: "username", placeholder: "Username" })}
        {renderInput({
          name: "password",
          placeholder: "Password",
          secure: true,
          showToggle: true,
        })}

        <TouchableOpacity
          onPress={() => router.push("/(drawer)/(auth)/ForgotPassword")}
          className="mb-4 self-end"
        >
          <Text className="text-sm text-red-600 font-medium">
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-red-600 py-3 rounded-md mb-4"
          onPress={handleSubmit(onSubmit)}
        >
          <Text className="text-white text-center font-semibold text-base">
            Sign In
          </Text>
        </TouchableOpacity>

        <Text className="text-center text-gray-500 mb-4">Or sign in with</Text>
        <TouchableOpacity
          className="flex-row items-center border border-gray-300 rounded-md bg-white px-4 py-3 shadow-sm justify-center mb-6"
          onPress={() => Alert.alert("Social Login", "Sign in with Google")}
        >
          <Ionicons name="logo-google" size={20} color="#DB4437" />
          <Text className="ml-3 text-base font-medium text-gray-800">
            Continue with Google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(drawer)/(auth)/register")}
        >
          <Text className="text-red-600 text-center text-sm">
            Don&apos;t have an account? Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
