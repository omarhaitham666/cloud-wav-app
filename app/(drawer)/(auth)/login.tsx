import ExpoGoogleLoginButton from "@/components/ExpoGoogleLoginButton";
import { useLoginMutation } from "@/store/api/user/user";
import { useAuth } from "@/store/auth-context";
import { invalidateAllQueries } from "@/store/utils";
import { AppFonts } from "@/utils/fonts";
import { saveToken } from "@/utils/secureStore";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Animated, {
  FadeInDown,
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Toast from "react-native-toast-message";
import * as yup from "yup";

interface LoginFormValues {
  email: string;
  password: string;
}

function LoginScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const { setUser, triggerAuthRefresh } = useAuth();

  const schema = yup.object().shape({
    email: yup
      .string()
      .email(t("auth.validation.invalidEmail"))
      .required(t("auth.validation.emailRequired")),
    password: yup
      .string()
      .min(8, t("auth.validation.passwordMinLength"))
      .required(t("auth.validation.passwordRequired")),
  });

  const logoScale = useSharedValue(0);
  const formOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    logoScale.value = withSpring(1, { damping: 15, stiffness: 150 });
    formOpacity.value = withTiming(1, { duration: 800 });
  }, [logoScale, formOpacity]);

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
    buttonScale.value = withSpring(0.95, {}, () => {
      buttonScale.value = withSpring(1);
    });

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

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const formAnimatedStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [
      { translateY: interpolate(formOpacity.value, [0, 1], [30, 0]) },
    ],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

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
        <Animated.View entering={FadeInDown.delay(200)} className="mb-6">
          <View
            className={`flex-row items-center rounded-3xl px-6 py-5 bg-white ${
              isRTL ? "flex-row-reverse" : ""
            }`}
            style={{
              shadowColor: errors[name]
                ? "#ef4444"
                : value
                ? "#dc2626"
                : "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: errors[name] ? 0.3 : value ? 0.25 : 0.1,
              shadowRadius: 16,
              elevation: errors[name] || value ? 8 : 2,
              backgroundColor: errors[name]
                ? "#fef2f2"
                : value
                ? "#fef2f2"
                : "#ffffff",
            }}
          >
            <View className={`mr-3 ${isRTL ? "ml-3 mr-0" : ""}`}>
              <Ionicons
                name={name === "email" ? "mail-outline" : "lock-closed-outline"}
                size={22}
                color={errors[name] ? "#ef4444" : value ? "#dc2626" : "#9ca3af"}
              />
            </View>
            <TextInput
              placeholder={placeholder}
              value={value}
              onChangeText={onChange}
              secureTextEntry={
                secure &&
                !(showToggle && name === "password" ? showPassword : false)
              }
              keyboardType={keyboardType}
              className="flex-1 text-gray-800 text-base"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              textAlignVertical="center"
              style={{
                textAlign: isRTL ? "right" : "left",
                writingDirection: isRTL ? "rtl" : "ltr",
                fontFamily: AppFonts.medium,
              }}
            />
            {showToggle && (
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="p-1"
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={22}
                  color="#6b7280"
                />
              </TouchableOpacity>
            )}
          </View>
          {errors[name] && (
            <Animated.Text
              entering={FadeInDown}
              className="text-red-500 text-sm mt-2 ml-2"
              style={{
                textAlign: isRTL ? "right" : "left",
                fontFamily: AppFonts.medium,
              }}
            >
              {errors[name]?.message}
            </Animated.Text>
          )}
        </Animated.View>
      )}
    />
  );

  return (
    <View className="flex-1 py-7">
      <LinearGradient
        colors={["#fef2f2", "#ffffff", "#fef2f2"]}
        locations={[0, 0.5, 1]}
        className="flex-1"
      >
        <SafeAreaView
          className="flex-1"
          style={{ paddingTop: 20, paddingBottom: 20 }}
        >
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            <View className="flex-1 justify-center px-6">
              <Animated.View
                entering={FadeInUp.delay(100)}
                style={logoAnimatedStyle}
                className="items-center mb-8"
              >
                <View
                  className="bg-white rounded-3xl p-8 mb-6"
                  style={{
                    shadowColor: "#dc2626",
                    shadowOffset: { width: 0, height: 12 },
                    shadowOpacity: 0.2,
                    shadowRadius: 20,
                    elevation: 10,
                  }}
                >
                  <Image
                    source={require("../../../assets/images/login.png")}
                    className="w-24 h-24"
                    resizeMode="contain"
                  />
                </View>
                <Text
                  className="text-3xl font-bold text-red-600 mb-2"
                  style={{
                    fontFamily: AppFonts.bold,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {t("auth.login.title")}
                </Text>
                <Text
                  className="text-gray-600 text-base text-center"
                  style={{
                    fontFamily: AppFonts.medium,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {t("auth.login.subtitle") ||
                    "Welcome back! Please sign in to your account"}
                </Text>
              </Animated.View>

              <Animated.View style={formAnimatedStyle} className="mb-6">
                {renderInput({
                  name: "email",
                  placeholder: t("auth.login.email"),
                  keyboardType: "email-address",
                })}
                {renderInput({
                  name: "password",
                  placeholder: t("auth.login.password"),
                  secure: true,
                  showToggle: true,
                })}

                <Animated.View
                  entering={FadeInDown.delay(400)}
                  className="mb-6"
                >
                  <TouchableOpacity
                    onPress={() =>
                      router.push("/(drawer)/(auth)/ForgotPassword")
                    }
                    className="self-end"
                  >
                    <Text
                      className="text-red-600 text-sm font-medium"
                      style={{
                        fontFamily: AppFonts.medium,
                      }}
                    >
                      {t("auth.login.forgotPassword")}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              </Animated.View>

              <Animated.View
                entering={FadeInUp.delay(600)}
                style={buttonAnimatedStyle}
              >
                <TouchableOpacity
                  className="py-5 rounded-3xl mb-6"
                  onPress={handleSubmit(onSubmit)}
                >
                  <LinearGradient
                    colors={["#dc2626", "#ef4444", "#dc2626"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="py-5 rounded-3xl"
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text
                        className="text-white text-center font-bold text-lg"
                        style={{
                          fontFamily: AppFonts.bold,
                        }}
                      >
                        {t("auth.login.signIn")}
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View
                entering={FadeInUp.delay(800)}
                className="flex-row items-center mb-6"
              >
                <View className="flex-1 h-px bg-gray-300" />
                <Text
                  className="mx-4 text-gray-500 text-sm"
                  style={{
                    fontFamily: AppFonts.medium,
                  }}
                >
                  {t("auth.login.orSignInWith")}
                </Text>
                <View className="flex-1 h-px bg-gray-300" />
              </Animated.View>

              <Animated.View entering={FadeInUp.delay(1000)} className="mb-6">
                <ExpoGoogleLoginButton />
              </Animated.View>

              <Animated.View
                entering={FadeInUp.delay(1200)}
                className="flex-row justify-center items-center"
              >
                <Text
                  className="text-gray-600 text-sm mr-1"
                  style={{
                    fontFamily: AppFonts.medium,
                  }}
                >
                  {t("auth.login.dontHaveAccount") || "Don't have an account?"}
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/(drawer)/(auth)/register")}
                >
                  <Text
                    className="text-red-600 text-sm font-bold"
                    style={{
                      fontFamily: AppFonts.bold,
                    }}
                  >
                    {t("auth.login.signUp") || "Sign Up"}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

export default LoginScreen;
