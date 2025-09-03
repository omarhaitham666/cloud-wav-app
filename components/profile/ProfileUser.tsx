import { useGetUserQuery, useUpdateUserMutation } from "@/store/api/user/user";
import { AppFonts } from "@/utils/fonts";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

type FormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const ProfileUser = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useGetUserQuery();
  const [UpdateUser, { isLoading: updateLoading }] = useUpdateUserMutation();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (data) {
      setValue("fullName", data.name || "");
      setValue("email", data.email || "");
    }
  }, [data, setValue]);

  const onSubmit = async (formData: FormValues) => {
    await UpdateUser({
      new_name: formData.fullName,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.confirmPassword,
      type: "user",
    })
      .unwrap()
      .then((res) => {
        console.log(res);

        Toast.show({
          type: "success",
          text1: "User Updated Successfully",
        });
      })
      .catch((e) => {
        Toast.show({
          type: "error",
          text1: "Service Artist Failed",
          text2: e?.data?.message || "Something went wrong",
        });
      });
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="#f9a826" />
      </View>
    );
  }
  return (
    <View className="flex-1 bg-dark-100">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <LinearGradient
        colors={["#1E3A8A", "#4C1D95"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
      />

      <ScrollView
        className="flex-1 mt-20 px-6"
        contentContainerStyle={{ paddingTop: 80, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          className="text-white text-2xl mb-8 text-center"
          style={{ fontFamily: AppFonts.bold }}
        >
          {t("profile.user.editProfile") || "Edit Profile"}
        </Text>

        <Controller
          control={control}
          name="fullName"
          rules={{ required: "Full name is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder={t("profile.user.fullName") || "Full Name"}
              placeholderTextColor="#aaa"
              value={value}
              onChangeText={onChange}
              className="bg-white/10 text-white rounded-xl px-4 py-3 mb-2"
              style={{ fontFamily: AppFonts.medium }}
            />
          )}
        />
        {errors.fullName && (
          <Text className="text-red-400 text-sm mb-2">
            {errors.fullName.message}
          </Text>
        )}

        <Controller
          control={control}
          name="email"
          rules={{ required: "Email is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder={t("profile.user.email") || "Email Address"}
              placeholderTextColor="#aaa"
              keyboardType="email-address"
              value={value}
              onChangeText={onChange}
              className="bg-white/10 text-white rounded-xl px-4 py-3 mb-2"
              style={{ fontFamily: AppFonts.medium }}
            />
          )}
        />
        {errors.email && (
          <Text className="text-red-400 text-sm mb-2">
            {errors.email.message}
          </Text>
        )}

        <Controller
          control={control}
          name="password"
          rules={{
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder={t("profile.user.password") || "Password"}
              placeholderTextColor="#aaa"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              className="bg-white/10 text-white rounded-xl px-4 py-3 mb-2"
              style={{ fontFamily: AppFonts.medium }}
            />
          )}
        />
        {errors.password && (
          <Text className="text-red-400 text-sm mb-2">
            {errors.password.message}
          </Text>
        )}

        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            validate: (val, formValues) =>
              val === formValues.password || "Passwords do not match",
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder={
                t("profile.user.confirmPassword") || "Confirm Password"
              }
              placeholderTextColor="#aaa"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              className="bg-white/10 text-white rounded-xl px-4 py-3 mb-4"
              style={{ fontFamily: AppFonts.medium }}
            />
          )}
        />
        {errors.confirmPassword && (
          <Text className="text-red-400 text-sm mb-2">
            {errors.confirmPassword.message}
          </Text>
        )}

        <TouchableOpacity activeOpacity={0.8} onPress={handleSubmit(onSubmit)}>
          <LinearGradient
            colors={["#4C1D95", "#1E3A8A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="h-14 rounded-xl justify-center items-center"
          >
            <Text
              className="text-white text-lg"
              style={{ fontFamily: AppFonts.bold }}
            >
              {updateLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                t("profile.user.saveChanges") || "Save Changes"
              )}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ProfileUser;
