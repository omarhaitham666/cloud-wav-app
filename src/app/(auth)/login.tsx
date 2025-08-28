// LoginScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import React from "react";
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
    .required(),
});

export default function LoginScreen() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: LoginFormValues) => {
    Alert.alert("Login", JSON.stringify(data, null, 2));
  };

  const renderInput = ({
    name,
    placeholder,
    secure = false,
    keyboardType = "default",
  }: {
    name: keyof LoginFormValues;
    placeholder: string;
    secure?: boolean;
    keyboardType?: "default" | "email-address" | "phone-pad";
  }) => (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View className="mb-4">
          <TextInput
            placeholder={placeholder}
            value={value}
            onChangeText={onChange}
            secureTextEntry={secure}
            keyboardType={keyboardType}
            className="border border-gray-300 rounded-md px-4 py-3 text-base text-black"
            placeholderTextColor="#888"
          />
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
    <SafeAreaView>
      <View className="min-h-screen justify-center px-6 bg-white">
        <Image
          source={require("../../assets/images/login.png")}
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
        })}

        <TouchableOpacity
          className="bg-red-600 py-3 rounded-md mb-4"
          onPress={handleSubmit(onSubmit)}
        >
          <Text className="text-white text-center font-semibold text-base">
            Sign In
          </Text>
        </TouchableOpacity>

        <Text className="text-center text-gray-500 mb-4">Or sign in with</Text>

        <View className="flex-row justify-center mb-6">
          <TouchableOpacity
            className="flex-row items-center border border-gray-300 rounded-md bg-white px-4 py-2 shadow-md"
            onPress={() => Alert.alert("Social Login", "Sign in with Google")}
          >
            <Ionicons name="logo-google" size={20} color="#DB4437" />
            <Text className="ml-2 text-base font-medium text-black">
              Google
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
          <Text className="text-red-600 text-center text-sm">
            Don&apos;t have an account? Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
