// RegisterScreen.tsx
import CustomHeader from "@/src/components/CustomHeader";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Image,
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
  birthDate: yup
    .string()
    .matches(/^\d{2}\/\d{2}\/\d{4}$/, "Birth Date must be mm/dd/yyyy")
    .required("Birth Date is required"),
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
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormValues) => {
    Alert.alert("Register", JSON.stringify(data, null, 2));
  };

  const renderInput = ({
    name,
    placeholder,
    secure = false,
    keyboardType = "default",
  }: {
    name: keyof FormValues;
    placeholder: string;
    secure?: boolean;
    keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
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
    <ScrollView>
      <View className="mt-8">
        <CustomHeader showLanguageSwitcher />
      </View>
      <View className="min-h-screen justify-center px-6 bg-white">
        <Image
          source={require("../../assets/register.png")}
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
        {renderInput({
          name: "birthDate",
          placeholder: "Birth Date (mm/dd/yyyy)",
          keyboardType: "numeric",
        })}
        {renderInput({
          name: "phone",
          placeholder: "Phone Number",
          keyboardType: "phone-pad",
        })}
        {renderInput({
          name: "password",
          placeholder: "Password",
          secure: true,
        })}
        {renderInput({
          name: "confirmPassword",
          placeholder: "Confirm Password",
          secure: true,
        })}

        <TouchableOpacity
          className="bg-red-600 py-3 rounded-md mb-4"
          onPress={handleSubmit(onSubmit)}
        >
          <Text className="text-white text-center font-semibold text-base">
            Sign Up
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text className="text-red-600 text-center mb-24 text-sm">
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
