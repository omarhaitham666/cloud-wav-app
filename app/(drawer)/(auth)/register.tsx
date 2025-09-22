import OTPModal from "@/components/modals/OTPModal";
import { useRegisterMutation } from "@/store/api/user/user";
import { useAuth } from "@/store/auth-context";
import { AppFonts } from "@/utils/fonts";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
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
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import * as yup from "yup";

interface FormValues {
  fullName: string;
  email: string;
  birthDate: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const { width, height } = Dimensions.get("window");

function RegisterScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [otpVisible, setOtpVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [register, { isLoading }] = useRegisterMutation();
  const { setUser, triggerAuthRefresh } = useAuth();

  const logoScale = useSharedValue(0);
  const formOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    logoScale.value = withSpring(1, { damping: 15, stiffness: 150 });
    formOpacity.value = withTiming(1, { duration: 800 });
  }, [logoScale, formOpacity]);

  const schema = yup.object().shape({
    fullName: yup.string().required(t("auth.validation.fullNameRequired")),
    email: yup
      .string()
      .email(t("auth.validation.invalidEmail"))
      .required(t("auth.validation.emailRequired")),
    birthDate: yup.string().required(t("auth.validation.birthDateRequired")),
    phone: yup.string().required(t("auth.validation.phoneRequired")),
    password: yup
      .string()
      .min(6, t("auth.validation.passwordMinLength"))
      .required(t("auth.validation.passwordRequired")),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], t("auth.validation.passwordsMustMatch"))
      .required(t("auth.validation.confirmPasswordRequired")),
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    buttonScale.value = withSpring(0.95, {}, () => {
      buttonScale.value = withSpring(1);
    });

    await register({
      name: data.fullName,
      email: data.email,
      password: data.password,
      password_confirmation: data.confirmPassword,
    })
      .unwrap()
      .then((res) => {
        Toast.show({
          type: "success",
          text1: t("auth.register.alerts.registerSuccess"),
          text2: t("auth.register.alerts.registerSuccessMessage"),
        });
        setOtpVisible(true);
      })
      .catch((e) => {
        Toast.show({
          type: "error",
          text1: t("auth.register.alerts.registerFailed"),
          text2:
            e?.data?.message || t("auth.register.alerts.registerFailedMessage"),
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
        <Animated.View entering={FadeInDown.delay(200)} className="mb-5">
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
                name={
                  name === "fullName"
                    ? "person-outline"
                    : name === "email"
                    ? "mail-outline"
                    : name === "phone"
                    ? "call-outline"
                    : "lock-closed-outline"
                }
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
                !(showToggle && name === "password"
                  ? showPassword
                  : name === "confirmPassword"
                  ? showConfirmPassword
                  : false)
              }
              keyboardType={keyboardType}
              className="flex-1 text-gray-800 text-base"
              placeholderTextColor="#9CA3AF"
              textAlignVertical="center"
              style={{
                textAlign: isRTL ? "right" : "left",
                fontFamily: AppFonts.medium,
                writingDirection: isRTL ? "rtl" : "ltr",
              }}
            />
            {showToggle && (
              <TouchableOpacity
                onPress={() =>
                  name === "password"
                    ? setShowPassword(!showPassword)
                    : setShowConfirmPassword(!showConfirmPassword)
                }
                className="p-1"
              >
                <Ionicons
                  name={
                    (name === "password" && showPassword) ||
                    (name === "confirmPassword" && showConfirmPassword)
                      ? "eye-off"
                      : "eye"
                  }
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
    <View className="flex-1">
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
            <View className="px-6 py-8">
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
                    source={require("../../../assets/images/register.jpg")}
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
                  {t("auth.register.title")}
                </Text>
                <Text
                  className="text-gray-600 text-base text-center"
                  style={{
                    fontFamily: AppFonts.medium,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {t("auth.register.subtitle") ||
                    "Create your account to get started"}
                </Text>
              </Animated.View>

              <Animated.View style={formAnimatedStyle}>
                {renderInput({
                  name: "fullName",
                  placeholder: t("auth.register.fullName"),
                })}
                {renderInput({
                  name: "email",
                  placeholder: t("auth.register.email"),
                  keyboardType: "email-address",
                })}

                <Controller
                  control={control}
                  name="birthDate"
                  render={({ field: { value } }) => (
                    <Animated.View
                      entering={FadeInDown.delay(300)}
                      className="mb-5"
                    >
                      <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        className="rounded-3xl px-6 py-5 bg-white"
                        style={{
                          shadowColor: errors.birthDate
                            ? "#ef4444"
                            : value
                            ? "#dc2626"
                            : "#000",
                          shadowOffset: { width: 0, height: 8 },
                          shadowOpacity: errors.birthDate
                            ? 0.3
                            : value
                            ? 0.25
                            : 0.1,
                          shadowRadius: 16,
                          elevation: errors.birthDate || value ? 8 : 2,
                          backgroundColor: errors.birthDate
                            ? "#fef2f2"
                            : value
                            ? "#fef2f2"
                            : "#ffffff",
                        }}
                      >
                        <View className="flex-row items-center">
                          <View className={`mr-3 ${isRTL ? "ml-3 mr-0" : ""}`}>
                            <Ionicons
                              name="calendar-outline"
                              size={22}
                              color={
                                errors.birthDate
                                  ? "#ef4444"
                                  : value
                                  ? "#dc2626"
                                  : "#9ca3af"
                              }
                            />
                          </View>
                          <Text
                            className={`flex-1 text-base ${
                              value ? "text-gray-800" : "text-gray-400"
                            }`}
                            style={{
                              textAlign: isRTL ? "right" : "left",
                              fontFamily: AppFonts.medium,
                              writingDirection: isRTL ? "rtl" : "ltr",
                            }}
                          >
                            {value || t("auth.register.birthDate")}
                          </Text>
                        </View>
                      </TouchableOpacity>
                      {errors.birthDate && (
                        <Animated.Text
                          entering={FadeInDown}
                          className="text-red-500 text-sm mt-2 ml-2"
                          style={{
                            textAlign: isRTL ? "right" : "left",
                            fontFamily: AppFonts.medium,
                          }}
                        >
                          {errors.birthDate.message}
                        </Animated.Text>
                      )}
                      {showDatePicker && (
                        <DateTimePicker
                          value={value ? new Date(value) : new Date()}
                          mode="date"
                          display={
                            Platform.OS === "ios" ? "spinner" : "default"
                          }
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
                              ).padStart(
                                2,
                                "0"
                              )}/${selectedDate.getFullYear()}`;
                              setValue("birthDate", formatted);
                            }
                          }}
                        />
                      )}
                    </Animated.View>
                  )}
                />

                {renderInput({
                  name: "phone",
                  placeholder: t("auth.register.phone"),
                  keyboardType: "phone-pad",
                })}
                {renderInput({
                  name: "password",
                  placeholder: t("auth.register.password"),
                  secure: true,
                  showToggle: true,
                })}
                {renderInput({
                  name: "confirmPassword",
                  placeholder: t("auth.register.confirmPassword"),
                  secure: true,
                  showToggle: true,
                })}

                <Animated.View
                  entering={FadeInUp.delay(800)}
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
                          {t("auth.register.signUp")}
                        </Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>

                <Animated.View
                  entering={FadeInUp.delay(1000)}
                  className="flex-row justify-center items-center"
                >
                  <Text
                    className="text-gray-600 text-sm mr-1"
                    style={{
                      fontFamily: AppFonts.medium,
                    }}
                  >
                    {t("auth.register.alreadyHaveAccount") ||
                      "Already have an account?"}
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push("/(drawer)/(auth)/login")}
                  >
                    <Text
                      className="text-red-600 text-sm font-bold"
                      style={{
                        fontFamily: AppFonts.bold,
                      }}
                    >
                      {t("auth.register.signIn") || "Sign In"}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              </Animated.View>
            </View>
          </ScrollView>
        </SafeAreaView>

        <OTPModal
          visible={otpVisible}
          email={watch("email")}
          password={watch("password")}
          onVerified={(userData) => {
            setOtpVisible(false);

            setUser({
              id: "",
              name: watch("fullName"),
              email: watch("email"),
              image: "",
              role: "",
              token: "",
            });

            triggerAuthRefresh();

            router.replace("/(drawer)/(tabs)");
          }}
        />
      </LinearGradient>
    </View>
  );
}

export default RegisterScreen;
