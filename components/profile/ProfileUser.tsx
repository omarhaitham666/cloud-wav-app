import {
  useGetUserQuery,
  useUpdateProfileARTISTORCREATORUserMutation,
  useUpdateUserMutation,
} from "@/store/api/user/user";
import { AppFonts } from "@/utils/fonts";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
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

type UserData = {
  name?: string;
  email?: string;
  profile_image?: string;
  role?: string;
  type?: string;
};

const ProfileUser = () => {
  const { t } = useTranslation();
  const { data, isLoading, error, refetch } = useGetUserQuery();
  const [updateUser, { isLoading: updateLoading }] = useUpdateUserMutation();
  const [
    updateProfileARTISTORCREATORUser,
    { isLoading: updateProfileLoading },
  ] = useUpdateProfileARTISTORCREATORUserMutation();

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<any>(null);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  useEffect(() => {
    if (data) {
      const userData = data as UserData;
      setValue("fullName", userData.name || "");
      setValue("email", userData.email || "");
      setProfileImage(userData.profile_image || null);
    }
  }, [data, setValue]);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Sorry, we need camera roll permissions to change your profile picture!"
        );
      }
    }
  };

  const pickImage = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        const asset = result.assets[0];
        const fileName = asset.fileName || `image_${Date.now()}.jpg`;
        const mimeType = asset.mimeType || "image/jpeg";

        setProfileImage(asset.uri);
        setImageFile({
          uri: asset.uri,
          name: fileName,
          type: mimeType,
          base64: asset.base64,
        });
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Image Selection Failed",
        text2: "Unable to select image. Please try again.",
      });
    }
  }, []);

  const onSubmit = async (formData: FormValues) => {
    try {
      const userData = data as UserData;
      
      // Fix user type detection in submission logic
      const isRegularUser =
        userData?.role === "user" || 
        (userData?.role && !userData.role.includes("artist") && !userData.role.includes("creator")) ||
        userData?.type === "user";

      if (isRegularUser) {
        const payload = {
          email: formData.email.trim(),
          new_name: formData.fullName.trim(),
          type: userData?.type || "user",
          password: formData.password ?? "",
        };
        
        await updateUser(payload).unwrap();
      } else {
        if (imageFile) {
          // Try base64 method first (most likely to work)
          if (imageFile.base64) {
            try {
              const base64FormData = new FormData();
              base64FormData.append("name", formData.fullName.trim());
              base64FormData.append("type", userData?.type || "artist");
              
              const base64File = {
                uri: `data:${imageFile.type};base64,${imageFile.base64}`,
                type: imageFile.type,
                name: imageFile.name,
              };
              
              base64FormData.append("profile_image", base64File as any);
              
              await updateProfileARTISTORCREATORUser(base64FormData).unwrap();
              
              setValue("password", "");
              setValue("confirmPassword", "");
              setImageFile(null);
              setProfileImage(null);
              reset({
                fullName: formData.fullName,
                email: formData.email,
                password: "",
                confirmPassword: "",
              });
              refetch();
              
              Toast.show({
                type: "success",
                text1: "Profile Updated Successfully (with image)",
              });
              
              return;
              
            } catch (base64Error) {
              // Fall back to regular user update if image upload fails
              const payload = {
                email: formData.email.trim(),
                new_name: formData.fullName.trim(),
                type: "user",
                password: formData.password ?? "",
              };
              
              await updateUser(payload).unwrap();
              
              setValue("password", "");
              setValue("confirmPassword", "");
              setImageFile(null);
              setProfileImage(null);
              reset({
                fullName: formData.fullName,
                email: formData.email,
                password: "",
                confirmPassword: "",
              });
              refetch();
              
              Toast.show({
                type: "info",
                text1: "Profile Updated (Text Only)",
                text2: "Image upload failed, but text fields were updated successfully",
              });
              
              return;
            }
          }
        } else {
          // No image selected, use regular user update for text-only changes
          const payload = {
            email: formData.email.trim(),
            new_name: formData.fullName.trim(),
            type: "user",
            password: formData.password ?? "",
          };
          
          await updateUser(payload).unwrap();
          
          setValue("password", "");
          setValue("confirmPassword", "");
          setImageFile(null);
          setProfileImage(null);
          reset({
            fullName: formData.fullName,
            email: formData.email,
            password: "",
            confirmPassword: "",
          });
          refetch();

          Toast.show({
            type: "success",
            text1: t("profile.user.updateSuccess") || "Profile Updated Successfully",
          });
          
          return;
        }
      }

      setValue("password", "");
      setValue("confirmPassword", "");
      setImageFile(null);
      setProfileImage(null);
      
      reset({
        fullName: formData.fullName,
        email: formData.email,
        password: "",
        confirmPassword: "",
      });
      
      refetch();

      Toast.show({
        type: "success",
        text1: t("profile.user.updateSuccess") || "Profile Updated Successfully",
      });
    } catch (err: any) {
      const message =
        err?.data?.message ||
        err?.data?.errors?.profile_image?.[0] ||
        err?.data?.errors?.name?.[0] ||
        err?.data?.errors?.email?.[0] ||
        err?.message ||
        "Update failed";

      Toast.show({
        type: "error",
        text1: t("profile.user.updateFailed") || "Update Failed",
        text2: message,
      });
    }
  };

  const resetForm = useCallback(() => {
    if (data) {
      const userData = data as UserData;
      reset({
        fullName: userData.name || "",
        email: userData.email || "",
        password: "",
        confirmPassword: "",
      });
      setProfileImage(userData.profile_image || null);
      setImageFile(null);
    }
  }, [data, reset]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="#f9a826" />
        <Text
          className="text-white mt-2"
          style={{ fontFamily: AppFonts.medium }}
        >
          {t("common.loading") || "Loading..."}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-black px-6">
        <Text
          className="text-red-400 text-center mb-4"
          style={{ fontFamily: AppFonts.medium }}
        >
          {t("common.error") || "Something went wrong"}
        </Text>
        <TouchableOpacity
          onPress={refetch}
          className="bg-purple-600 px-6 py-3 rounded-lg"
        >
          <Text className="text-white" style={{ fontFamily: AppFonts.medium }}>
            {t("common.retry") || "Try Again"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const userData = data as UserData;
  // Fix user type detection - check if role contains "artist" or "creator"
  const isArtistOrCreator =
    userData?.role?.includes("artist") || 
    userData?.role?.includes("creator") ||
    (userData?.type && userData.type !== "user");
  const isUpdating = updateLoading || updateProfileLoading;

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
        keyboardShouldPersistTaps="handled"
      >
        <Text
          className="text-white text-2xl mb-8 text-center"
          style={{ fontFamily: AppFonts.bold }}
        >
          {t("profile.user.editProfile") || "Edit Profile"}
        </Text>

        {isArtistOrCreator && (
          <View className="items-center mb-6">
            <TouchableOpacity
              onPress={pickImage}
              className="relative"
              activeOpacity={0.7}
            >
              <View className="w-32 h-32 rounded-full overflow-hidden border-2 border-purple-500">
                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    className="w-full h-full"
                    style={{ resizeMode: "cover" }}
                  />
                ) : (
                  <View className="w-full h-full bg-gray-700 justify-center items-center">
                    <Text
                      className="text-white text-sm"
                      style={{ fontFamily: AppFonts.medium }}
                    >
                      {t("profile.user.addPhoto") || "Add Photo"}
                    </Text>
                  </View>
                )}
              </View>
              <View className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full">
                <Text
                  className="text-white text-xs"
                  style={{ fontFamily: AppFonts.medium }}
                >
                  {t("common.edit") || "Edit"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        <View className="mb-4">
          <Controller
            control={control}
            name="fullName"
            rules={{
              required:
                t("validation.fullNameRequired") || "Full name is required",
              minLength: {
                value: 2,
                message:
                  t("validation.fullNameMinLength") ||
                  "Name must be at least 2 characters",
              },
              maxLength: {
                value: 50,
                message:
                  t("validation.fullNameMaxLength") ||
                  "Name must be less than 50 characters",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder={t("profile.user.fullName") || "Full Name"}
                placeholderTextColor="#aaa"
                value={value}
                onChangeText={onChange}
                className="bg-white/10 text-white rounded-xl px-4 py-4 text-base"
                style={{ fontFamily: AppFonts.medium }}
                autoCapitalize="words"
                returnKeyType="next"
              />
            )}
          />
          {errors.fullName && (
            <Text className="text-red-400 text-sm mt-1 ml-2">
              {errors.fullName.message}
            </Text>
          )}
        </View>

        <View className="mb-4">
          <Controller
            control={control}
            name="email"
            rules={{
              required: t("validation.emailRequired") || "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message:
                  t("validation.emailInvalid") || "Invalid email address",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder={t("profile.user.email") || "Email Address"}
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={value}
                onChangeText={onChange}
                className="bg-white/10 text-white rounded-xl px-4 py-4 text-base"
                style={{ fontFamily: AppFonts.medium }}
                returnKeyType="next"
              />
            )}
          />
          {errors.email && (
            <Text className="text-red-400 text-sm mt-1 ml-2">
              {errors.email.message}
            </Text>
          )}
        </View>

        <View className="mb-4">
          <Controller
            control={control}
            name="password"
            rules={{
              minLength: {
                value: 6,
                message:
                  t("validation.passwordMinLength") ||
                  "Password must be at least 6 characters",
              },
              maxLength: {
                value: 128,
                message:
                  t("validation.passwordMaxLength") ||
                  "Password must be less than 128 characters",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder={
                  t("profile.user.password") || "New Password (optional)"
                }
                placeholderTextColor="#aaa"
                secureTextEntry
                autoComplete="new-password"
                value={value}
                onChangeText={onChange}
                className="bg-white/10 text-white rounded-xl px-4 py-4 text-base"
                style={{ fontFamily: AppFonts.medium }}
                returnKeyType="next"
              />
            )}
          />
          {errors.password && (
            <Text className="text-red-400 text-sm mt-1 ml-2">
              {errors.password.message}
            </Text>
          )}
        </View>

        <View className="mb-6">
          <Controller
            control={control}
            name="confirmPassword"
            rules={{
              validate: (val) => {
                if (password && !val) {
                  return (
                    t("validation.confirmPasswordRequired") ||
                    "Please confirm your password"
                  );
                }
                if (password && val !== password) {
                  return (
                    t("validation.passwordsDoNotMatch") ||
                    "Passwords do not match"
                  );
                }
                return true;
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder={
                  t("profile.user.confirmPassword") || "Confirm New Password"
                }
                placeholderTextColor="#aaa"
                secureTextEntry
                autoComplete="new-password"
                value={value}
                onChangeText={onChange}
                className="bg-white/10 text-white rounded-xl px-4 py-4 text-base"
                style={{ fontFamily: AppFonts.medium }}
                returnKeyType="done"
                onSubmitEditing={handleSubmit(onSubmit)}
              />
            )}
          />
          {errors.confirmPassword && (
            <Text className="text-red-400 text-sm mt-1 ml-2">
              {errors.confirmPassword.message}
            </Text>
          )}
        </View>

        <View className="space-y-3">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSubmit(onSubmit)}
            disabled={isUpdating || !isDirty}
          >
            <LinearGradient
              colors={
                isUpdating || !isDirty
                  ? ["#6B7280", "#4B5563"]
                  : ["#4C1D95", "#1E3A8A"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="h-14 rounded-xl justify-center items-center"
            >
              {isUpdating ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text
                  className="text-white text-lg"
                  style={{ fontFamily: AppFonts.bold }}
                >
                  {t("profile.user.saveChanges") || "Save Changes"}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {isDirty && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={resetForm}
              disabled={isUpdating}
              className="border border-white/20 h-12 rounded-xl justify-center items-center"
            >
              <Text
                className="text-white text-base"
                style={{ fontFamily: AppFonts.medium }}
              >
                {t("common.reset") || "Reset"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <Toast />
    </View>
  );
};

export default ProfileUser;
