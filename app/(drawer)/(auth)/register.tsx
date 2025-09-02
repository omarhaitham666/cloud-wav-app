import OTPModal from "@/components/OTPModal";
import { useRegisterMutation } from "@/store/api/user/user";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import * as yup from "yup";
import { AppFonts } from "@/utils/fonts";


interface FormValues {
  fullName: string;
  email: string;
  birthDate: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [otpVisible, setOtpVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [register, { isLoading }] = useRegisterMutation();

  const schema = yup.object().shape({
    fullName: yup.string().required(t("auth.validation.fullNameRequired")),
    email: yup.string().email(t("auth.validation.invalidEmail")).required(t("auth.validation.emailRequired")),
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
          text2: e?.data?.message || t("auth.register.alerts.registerFailedMessage"),
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
          <View className={`flex-row items-center border border-gray-300 rounded-md px-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
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
              style={{
                textAlign: isRTL ? 'right' : 'left',
                fontFamily: AppFonts.semibold,
                writingDirection: isRTL ? 'rtl' : 'ltr'
              }}
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
            <Text
              className="text-red-600 text-sm mt-1"
              style={{
                textAlign: isRTL ? 'right' : 'left',
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
    <SafeAreaView className="flex-1 py-3 bg-gray-50">
      <ScrollView className="flex-1 px-4">
        <View className="min-h-screen justify-center px-6 ">
          <Image
            source={require("../../../assets/images/register.png")}
            className="w-40 h-40 self-center mb-6"
          />
          <Text
            className="text-2xl text-red-600 text-center mb-6"
            style={{
              fontFamily: AppFonts.semibold,
            }}
          >
            {t("auth.register.title")}
          </Text>
          {renderInput({ name: "fullName", placeholder: t("auth.register.fullName") })}
          {renderInput({
            name: "email",
            placeholder: t("auth.register.email"),
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
                    className={`text-base ${value ? "text-black" : "text-gray-400"
                      }`}
                    style={{ textAlign: isRTL ? 'right' : 'left',
                      fontFamily: AppFonts.semibold,
                     }}
                  >
                    {value || t("auth.register.birthDate")}
                  </Text>
                </TouchableOpacity>
                {errors.birthDate && (
                  <Text
                    className="text-red-600 text-sm mt-1"
                    style={{ textAlign: isRTL ? 'right' : 'left',
                      fontFamily: AppFonts.semibold,
                     }}
                  >
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

          <TouchableOpacity
            className="bg-red-600 py-3 rounded-md mb-4"
            onPress={handleSubmit(onSubmit)}
          >
            <Text
              className="text-white text-center text-base"
              style={{
                fontFamily: AppFonts.semibold,
              }}
            >
              {isLoading ? <ActivityIndicator color="#fff" /> : t("auth.register.signUp")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(drawer)/(auth)/login")}
          >
            <Text
              className="text-red-600 text-center mb-24 text-sm"
              style={{
                fontFamily: AppFonts.semibold,
              }}
            >
              {t("auth.register.haveAccount")}
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
    </SafeAreaView>
  );
}
