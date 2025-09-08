import { useLoginMutation } from "@/store/api/user/user";
import { useAuth } from "@/store/auth-context";
import { invalidateAllQueries } from "@/store/utils";
import { AppFonts } from "@/utils/fonts";
import { saveToken } from "@/utils/secureStore";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import * as yup from "yup";

interface LoginFormValues {
  email: string;
  password: string;
}

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
});

function LoginScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const { setUser, triggerAuthRefresh } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    await login({
      email: data.email,
      password: data.password,
    })
      .unwrap()
      .then(async (res) => {
        await saveToken("access_token", res.access_token);
        setUser({
          id: "",
          name: "",
          email: data.email,
          image: "",
          role: "",
          token: res.access_token,
        });

        Toast.show({
          type: "success",
          text1: t("auth.login.alerts.loginSuccess"),
          text2: t("auth.login.alerts.loginSuccessMessage"),
        });

        invalidateAllQueries();
        triggerAuthRefresh();
        router.replace("/(drawer)/(tabs)");
      })
      .catch((e) => {
        Toast.show({
          type: "error",
          text1: t("auth.login.alerts.loginFailed"),
          text2: e?.data?.message || t("auth.login.alerts.loginFailedMessage"),
        });
      });
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
          <View
            className={`flex-row items-center border border-gray-300 rounded-md px-3 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
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
              style={{
                textAlign: isRTL ? "right" : "left",
                writingDirection: isRTL ? "rtl" : "ltr",
                fontFamily: AppFonts.semibold,
              }}
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
            <Text
              className="text-red-600 text-sm mt-1"
              style={{
                textAlign: isRTL ? "right" : "left",
                fontFamily: AppFonts.semibold,
              }}
            >
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
        <Text
          className="text-2xl text-red-600 text-center mb-6"
          style={{
            fontFamily: AppFonts.semibold,
          }}
        >
          {t("auth.login.title")}
        </Text>

        {renderInput({ name: "email", placeholder: t("auth.login.email") })}
        {renderInput({
          name: "password",
          placeholder: t("auth.login.password"),
          secure: true,
          showToggle: true,
        })}

        <TouchableOpacity
          onPress={() => router.push("/(drawer)/(auth)/ForgotPassword")}
          className="mb-4 self-end"
        >
          <Text
            className="text-sm text-red-600"
            style={{
              textAlign: isRTL ? "right" : "left",
              fontFamily: AppFonts.semibold,
            }}
          >
            {t("auth.login.forgotPassword")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-red-600 py-3 rounded-md mb-4"
          onPress={handleSubmit(onSubmit)}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              className="text-white text-center font-semibold text-base"
              style={{
                fontFamily: AppFonts.semibold,
              }}
            >
              {t("auth.login.signIn")}
            </Text>
          )}
        </TouchableOpacity>

        <Text
          className="text-center text-gray-500 mb-4"
          style={{
            textAlign: isRTL ? "right" : "left",
            fontFamily: AppFonts.semibold,
          }}
        >
          {t("auth.login.orSignInWith")}
        </Text>
        <TouchableOpacity
          className={`flex-row items-center border border-gray-300 rounded-md bg-white px-4 py-3 shadow-sm justify-center mb-6 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <Ionicons name="logo-google" size={20} color="#DB4437" />
          <Text
            className={`text-base text-gray-800 ${isRTL ? "mr-3" : "ml-3"}`}
            style={{
              textAlign: isRTL ? "right" : "left",
              fontFamily: AppFonts.semibold,
            }}
          >
            {t("auth.login.continueWithGoogle")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(drawer)/(auth)/register")}
        >
          <Text
            className="text-red-600 text-center text-sm"
            style={{
              fontFamily: AppFonts.semibold,
            }}
          >
            {t("auth.login.noAccount")}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default LoginScreen;
