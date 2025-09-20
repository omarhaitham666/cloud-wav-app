import {
  useGetUserQuery,
  useLogoutMutation,
  useUpdateProfileARTISTORCREATORUserMutation,
  useUpdateUserMutation,
} from "@/store/api/user/user";
import { useAuth } from "@/store/auth-context";
import { invalidateAllQueries } from "@/store/utils";
import { AppFonts } from "@/utils/fonts";
import { deleteToken } from "@/utils/secureStore";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
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
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import UpdatePriceModal from "../modals/UpdatePriceModal";
import SplashScreen from "../SplashScreen";

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
  artist_id?: number | null;
  video_creator_id?: number | null;
  bussiness_price?: string | null;
  private_price?: string | null;
};

const ProfileUser: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { data, isLoading, error, refetch } = useGetUserQuery();
  const [updateUser, { isLoading: updateLoading }] = useUpdateUserMutation();
  const [
    updateProfileARTISTORCREATORUser,
    { isLoading: updateProfileLoading },
  ] = useUpdateProfileARTISTORCREATORUserMutation();
  const [logout] = useLogoutMutation();
  const { setUser, triggerAuthRefresh } = useAuth();

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<any>(null);
  const [UpdatePrice, setUpdatePrice] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
    } catch (error) {
      console.error("Image selection error:", error);
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

      const isRegularUser =
        userData?.role === "user" ||
        (userData?.role &&
          !userData.role.includes("artist") &&
          !userData.role.includes("videoCreator") &&
          !userData.role.includes("videoCreator,artist")) ||
        userData?.type === "user";

      const isUserOnlyWithNoIds =
        userData?.role === "user" &&
        !userData?.artist_id &&
        !userData?.video_creator_id;

      if (isRegularUser || isUserOnlyWithNoIds) {
        const payload = {
          email: formData.email.trim(),
          new_name: formData.fullName.trim(),
          type: userData?.type || "user",
          password: formData.password ?? "",
        };

        await updateUser(payload)
          .unwrap()
          .then(() => {
            Toast.show({
              type: "success",
              text1:
                t("profile.user.updateSuccess") ||
                "Profile Updated Successfully",
            });
          })
          .catch((e) => {
            Toast.show({
              type: "error",
              text1: t("profile.user.updateFailed") || "Update Failed",
              text2: e.data?.message || e.message,
            });
          });

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
        return;
      } else {
        if (imageFile && !isUserOnlyWithNoIds) {
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

              await updateProfileARTISTORCREATORUser(base64FormData)
                .unwrap()
                .then(() => {
                  Toast.show({
                    type: "success",
                    text1:
                      t("profile.user.updateSuccess") ||
                      "Profile Updated Successfully",
                  });
                })
                .catch((e) => {
                  console.log("error", e);

                  Toast.show({
                    type: "error",
                    text1: t("profile.user.updateFailed") || "Update Failed",
                    text2: e.data.message || e.data.error,
                  });
                });
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
              return;
            } catch (base64Error) {
              console.error("Base64 upload error:", base64Error);
              const payload = {
                email: formData.email.trim(),
                new_name: formData.fullName.trim(),
                type: "user",
                password: formData.password ?? "",
              };

              await updateUser(payload)
                .unwrap()
                .then(() => {
                  Toast.show({
                    type: "success",
                    text1:
                      t("profile.user.updateSuccess") ||
                      "Profile Updated Successfully",
                  });
                })
                .catch((e) => {
                  Toast.show({
                    type: "error",
                    text1: t("profile.user.updateFailed") || "Update Failed",
                    text2: e.data.message,
                  });
                });

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
                text1:
                  t("profile.user.profileUpdatedTextOnly") ||
                  "Profile Updated (Text Only)",
                text2:
                  t("profile.user.imageUploadFailed") ||
                  "Image upload failed, but text fields were updated successfully",
              });

              return;
            }
          }
        } else {
          // For artists/creators without image, update text fields only
          const payload = {
            email: formData.email.trim(),
            new_name: formData.fullName.trim(),
            type: userData?.type || "artist",
            password: formData.password ?? "",
          };

          await updateUser(payload)
            .unwrap()
            .then(() => {
              Toast.show({
                type: "success",
                text1:
                  t("profile.user.updateSuccess") ||
                  "Profile Updated Successfully",
              });
            })
            .catch((e) => {
              Toast.show({
                type: "error",
                text1: t("profile.user.updateFailed") || "Update Failed",
                text2: e.data?.message || e.message,
              });
            });

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
          return;
        }
      }
    } catch (err: any) {
      const message =
        err?.data?.message ||
        err?.data?.errors?.profile_image?.[0] ||
        err?.data?.errors?.name?.[0] ||
        err?.data?.errors?.email?.[0] ||
        err?.message ||
        "Update failed";
      console.log("message", err);
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

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      await logout().unwrap();

      await deleteToken("access_token");
      await deleteToken("refresh_token");
      await AsyncStorage.multiRemove([
        "token",
        "user",
        "auth_state",
        "refresh_token",
      ]);

      setUser(null);

      triggerAuthRefresh();

      invalidateAllQueries();

      Toast.show({
        type: "success",
        text1: t("profile.user.loggedOut") || "Logged Out",
        text2:
          t("profile.user.loggedOutMessage") ||
          "You have been successfully logged out",
      });

      router.replace("/(drawer)/(auth)/login");
    } catch (error: any) {
      console.error("Logout error:", error);
      try {
        await deleteToken("access_token");
        await deleteToken("refresh_token");
        await AsyncStorage.multiRemove([
          "token",
          "user",
          "auth_state",
          "refresh_token",
        ]);

        setUser(null);
        triggerAuthRefresh();
        invalidateAllQueries();

        Toast.show({
          type: "info",
          text1: t("profile.user.loggedOut") || "Logged Out",
          text2:
            t("profile.user.loggedOutMessage") || "You have been logged out",
        });

        router.replace("/(drawer)/(auth)/login");
      } catch (clearError) {
        console.error("Error clearing local storage:", clearError);
        Toast.show({
          type: "error",
          text1: t("profile.user.logoutError") || "Logout Error",
          text2:
            t("profile.user.logoutErrorMessage") ||
            "There was an error during logout",
        });
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getRoleDisplayName = (role?: string, type?: string) => {
    if (!role && !type) return "User";

    const roleString = role || type || "";

    if (roleString.includes("artist") && roleString.includes("videoCreator")) {
      return "Artist & Video Creator";
    } else if (roleString.includes("artist")) {
      return "Artist";
    } else if (roleString.includes("videoCreator")) {
      return "Video Creator";
    } else {
      return roleString.charAt(0).toUpperCase() + roleString.slice(1);
    }
  };

  const getRoleIcon = (role?: string, type?: string) => {
    const roleString = role || type || "";

    if (roleString.includes("artist") && roleString.includes("videoCreator")) {
      return "star";
    } else if (roleString.includes("artist")) {
      return "musical-note";
    } else if (roleString.includes("videoCreator")) {
      return "videocam";
    } else {
      return "person";
    }
  };

  const getRoleColor = (role?: string, type?: string) => {
    const roleString = role || type || "";

    if (roleString.includes("artist") && roleString.includes("videoCreator")) {
      return "#FFD700";
    } else if (roleString.includes("artist")) {
      return "#FF6B6B";
    } else if (roleString.includes("videoCreator")) {
      return "#4ECDC4";
    } else {
      return "#A0AEC0";
    }
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  if (error) {
    const isUnauthenticated =
      (error as any)?.status === 401 ||
      (error as any)?.data?.message === "Unauthenticated." ||
      (error as any)?.data?.message?.includes("Unauthenticated");

    if (isUnauthenticated) {
      return (
        <View className="flex-1 justify-center w-full items-center bg-black px-6">
          <View className="items-center mb-6">
            <Ionicons name="time-outline" size={64} color="#EF4444" />
            <Text
              className="text-red-400 text-center mb-2 text-lg"
              style={{
                fontFamily: AppFonts.bold,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("profile.user.sessionExpired") || "Session Expired"}
            </Text>
            <Text
              className="text-gray-300 text-center mb-6"
              style={{
                fontFamily: AppFonts.medium,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("profile.user.sessionExpiredMessage") ||
                "Your session has expired. Please log in again."}
            </Text>
          </View>

          <View className="w-full gap-3">
            <TouchableOpacity
              onPress={handleLogout}
              disabled={isLoggingOut}
              className="bg-red-600 px-6 py-4 rounded-lg"
            >
              {isLoggingOut ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <View className="flex-row items-center justify-center">
                  <Ionicons name="log-out-outline" size={20} color="white" />
                  <Text
                    className="text-white ml-2"
                    style={{
                      fontFamily: AppFonts.bold,
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {t("profile.user.logout") || "Logout"}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={refetch}
              className="bg-purple-600 px-6 py-4 rounded-lg"
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="refresh-outline" size={20} color="white" />
                <Text
                  className="text-white ml-2"
                  style={{
                    fontFamily: AppFonts.medium,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {t("profile.user.retry") || "Try Again"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View className="flex-1 justify-center items-center w-full bg-black px-6">
        <Text
          className="text-red-400 text-center mb-4"
          style={{
            fontFamily: AppFonts.medium,
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {t("profile.user.error") || "Something went wrong"}
        </Text>
        <TouchableOpacity
          onPress={refetch}
          className="bg-purple-600 px-6 py-3 rounded-lg"
        >
          <Text
            className="text-white"
            style={{
              fontFamily: AppFonts.medium,
              textAlign: isRTL ? "right" : "left",
            }}
          >
            {t("profile.user.retry") || "Try Again"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const userData = data as UserData;
  const isArtistOrCreator =
    userData?.role?.includes("artist") ||
    userData?.role?.includes("videoCreator") ||
    userData?.role?.includes("videoCreator,artist") ||
    userData?.role?.includes("user,artist") ||
    userData?.role?.includes("user,videoCreator") ||
    (userData?.type && userData.type !== "user");
  const isUpdating = updateLoading || updateProfileLoading;

  return (
    <SafeAreaView className="flex-1 w-full ">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <LinearGradient
        colors={["#1A1A2E", "#16213E", "#0F3460"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-6 pt-5 pb-6">
            <View className="flex-row items-center justify-between mb-4">
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <Text
                className="text-white text-xl"
                style={{
                  fontFamily: AppFonts.bold,
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {t("profile.user.editProfile") || "Edit Profile"}
              </Text>
              <View style={{ width: 24 }} />
            </View>
          </View>

          <View className="px-6 mb-8">
            {userData?.role !== "user" && (
              <View className="items-center mb-6">
                <TouchableOpacity
                  onPress={pickImage}
                  className="relative mb-4"
                  activeOpacity={0.7}
                >
                  <View className="w-36 h-36 rounded-full overflow-hidden border-4 border-purple-500 shadow-2xl">
                    {profileImage ? (
                      <Image
                        source={{ uri: profileImage }}
                        className="w-full h-full"
                        style={{ resizeMode: "cover" }}
                      />
                    ) : (
                      <LinearGradient
                        colors={["#4C1D95", "#1E3A8A"]}
                        className="w-full h-full justify-center items-center"
                      >
                        <Ionicons name="camera" size={40} color="white" />
                        <Text
                          className="text-white text-sm mt-2"
                          style={{
                            fontFamily: AppFonts.medium,
                            textAlign: isRTL ? "center" : "center",
                          }}
                        >
                          {t("profile.user.addPhoto") || "Add Photo"}
                        </Text>
                      </LinearGradient>
                    )}
                  </View>
                  {isArtistOrCreator && (
                    <View
                      className={`absolute bottom-0 ${
                        isRTL ? "-left-1" : "-right-1"
                      } bg-purple-600 p-3 rounded-full shadow-lg`}
                    >
                      <Ionicons name="camera" size={16} color="white" />
                    </View>
                  )}
                </TouchableOpacity>

                <View
                  className="flex-row items-center px-4 py-2 rounded-full mb-4"
                  style={{
                    backgroundColor:
                      getRoleColor(userData?.role, userData?.type) + "20",
                  }}
                >
                  <Ionicons
                    name={getRoleIcon(userData?.role, userData?.type)}
                    size={18}
                    color={getRoleColor(userData?.role, userData?.type)}
                  />
                  <Text
                    className="ml-2 text-sm font-medium"
                    style={{
                      fontFamily: AppFonts.medium,
                      color: getRoleColor(userData?.role, userData?.type),
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    {getRoleDisplayName(userData?.role, userData?.type)}
                  </Text>
                </View>
              </View>
            )}
            {isArtistOrCreator && (
              <View className="mb-6">
                <Text
                  className="text-white text-lg mb-4"
                  style={{
                    fontFamily: AppFonts.bold,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {t("profile.user.quickActions") || "Quick Actions"}
                </Text>
                <View className="flex-row justify-between gap-3">
                  {data?.video_creator_id && data?.artist_id && (
                    <TouchableOpacity
                      onPress={() =>
                        data?.video_creator_id &&
                        router.push({
                          pathname: "/(drawer)/artist/orders/[id]",
                          params: { id: data.video_creator_id },
                        })
                      }
                      className="flex-1"
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={["#8B5CF6", "#7C3AED"]}
                        className="p-4 items-center"
                        style={{
                          borderRadius: 10,
                        }}
                      >
                        <Ionicons name="videocam" size={24} color="white" />
                        <Text
                          className="text-white text-sm mt-2 text-center"
                          style={{
                            fontFamily: AppFonts.bold,
                            textAlign: isRTL ? "center" : "center",
                          }}
                        >
                          {t("profile.user.videoCreatorProfile") ||
                            "Video Creator Profile"}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}

                  {(userData?.role === "videoCreator" ||
                    userData?.role === "user,videoCreator") &&
                    !data?.artist_id && (
                      <TouchableOpacity
                        onPress={() => setUpdatePrice(true)}
                        className="flex-1"
                        activeOpacity={0.8}
                      >
                        <LinearGradient
                          colors={["#F59E0B", "#D97706"]}
                          className="p-4 items-center"
                          style={{
                            borderRadius: 10,
                          }}
                        >
                          <MaterialIcons
                            name="attach-money"
                            size={28}
                            color="white"
                          />
                          <Text
                            className="text-white text-sm mt-2 text-center"
                            style={{
                              fontFamily: AppFonts.bold,
                              textAlign: isRTL ? "center" : "center",
                            }}
                          >
                            {t("profile.user.updatePricing") ||
                              "Update Pricing"}
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    )}

                  {/* Show manage songs button for artists (but not if they have both roles) */}
                  {(userData?.role === "artist" ||
                    userData?.role === "user,artist") &&
                    !data?.video_creator_id && (
                      <TouchableOpacity
                        onPress={() =>
                          data?.artist_id &&
                          router.push({
                            pathname: "/(drawer)/artist/[id]",
                            params: { id: data.artist_id },
                          })
                        }
                        className="flex-1"
                        activeOpacity={0.8}
                      >
                        <LinearGradient
                          colors={["#10B981", "#059669"]}
                          className="p-4 items-center"
                          style={{
                            borderRadius: 10,
                          }}
                        >
                          <FontAwesome5 name="music" size={24} color="white" />
                          <Text
                            className="text-white text-sm mt-2 text-center"
                            style={{
                              fontFamily: AppFonts.bold,
                              textAlign: isRTL ? "center" : "center",
                            }}
                          >
                            {t("profile.user.manageSongs") || "Manage Songs"}
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    )}
                </View>
              </View>
            )}
          </View>

          <View className="px-6">
            <Text
              className="text-white text-lg mb-6"
              style={{
                fontFamily: AppFonts.bold,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("profile.user.profileInformation") || "Profile Information"}
            </Text>

            <View className="mb-4">
              <Text
                className="text-gray-300 text-sm mb-2"
                style={{
                  fontFamily: AppFonts.medium,
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {t("profile.user.fullName") || "Full Name"}
              </Text>
              <Controller
                control={control}
                name="fullName"
                rules={{
                  required:
                    t("auth.validation.fullNameRequired") ||
                    "Full name is required",
                  minLength: {
                    value: 2,
                    message:
                      t("auth.validation.fullNameMinLength") ||
                      "Name must be at least 2 characters",
                  },
                  maxLength: {
                    value: 50,
                    message:
                      t("auth.validation.fullNameMaxLength") ||
                      "Name must be less than 50 characters",
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <View className="relative">
                    <TextInput
                      placeholder={
                        t("profile.user.fullName") || "Enter your full name"
                      }
                      placeholderTextColor="#6B7280"
                      value={value}
                      onChangeText={onChange}
                      className="bg-white/5 text-white rounded-xl px-4 py-4 border border-white/10"
                      style={{
                        fontFamily: AppFonts.medium,
                        textAlign: isRTL ? "right" : "left",
                      }}
                      autoCapitalize="words"
                      returnKeyType="next"
                    />
                    <View
                      className={`absolute ${
                        isRTL ? "left-4" : "right-4"
                      } top-4`}
                    >
                      <Ionicons
                        name="person-outline"
                        size={20}
                        color="#6B7280"
                      />
                    </View>
                  </View>
                )}
              />
              {errors.fullName && (
                <Text
                  className="text-red-400 text-sm mt-2 ml-2"
                  style={{
                    fontFamily: AppFonts.medium,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {errors.fullName.message}
                </Text>
              )}
            </View>
            <View className="mb-4">
              <Text
                className="text-gray-300 text-sm mb-2"
                style={{
                  fontFamily: AppFonts.medium,
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {t("profile.user.email") || "Email Address"}
              </Text>
              <Controller
                control={control}
                name="email"
                rules={{
                  required:
                    t("auth.validation.emailRequired") || "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message:
                      t("auth.validation.invalidEmail") ||
                      "Invalid email address",
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <View className="relative">
                    <TextInput
                      placeholder={
                        t("profile.user.email") || "Enter your email"
                      }
                      placeholderTextColor="#6B7280"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      value={value}
                      onChangeText={onChange}
                      className="bg-white/5 text-white rounded-xl px-4 py-4 border border-white/10"
                      style={{
                        fontFamily: AppFonts.medium,
                        textAlign: isRTL ? "right" : "left",
                      }}
                      returnKeyType="next"
                    />
                    <View
                      className={`absolute ${
                        isRTL ? "left-4" : "right-4"
                      } top-4`}
                    >
                      <Ionicons name="mail-outline" size={20} color="#6B7280" />
                    </View>
                  </View>
                )}
              />
              {errors.email && (
                <Text
                  className="text-red-400 text-sm mt-2 ml-2"
                  style={{
                    fontFamily: AppFonts.medium,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {errors.email.message}
                </Text>
              )}
            </View>

            <View className="mb-4">
              <Text
                className="text-gray-300 text-sm mb-2"
                style={{
                  fontFamily: AppFonts.medium,
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {t("profile.user.accountType") || "Account Type"}
              </Text>
              <View className="bg-white/5 rounded-xl px-4 py-4 border border-white/10 flex-row items-center justify-between">
                <Text
                  className="text-white text-base"
                  style={{
                    fontFamily: AppFonts.medium,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {getRoleDisplayName(userData?.role, userData?.type)}
                </Text>
                <Ionicons
                  name={getRoleIcon(
                    userData?.role,
                    userData?.type as unknown as string
                  )}
                  size={20}
                  color={getRoleColor(userData?.role, userData?.type)}
                />
              </View>
            </View>

            <Text
              className="text-white text-lg mb-4 mt-6"
              style={{
                fontFamily: AppFonts.bold,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("profile.user.security") || "Security"}
            </Text>

            <View className="mb-4">
              <Text
                className="text-gray-300 text-sm mb-2"
                style={{
                  fontFamily: AppFonts.medium,
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {t("profile.user.newPasswordOptional") ||
                  "New Password (Optional)"}
              </Text>
              <Controller
                control={control}
                name="password"
                rules={{
                  minLength: {
                    value: 6,
                    message:
                      t("auth.validation.passwordMinLength") ||
                      "Password must be at least 6 characters",
                  },
                  maxLength: {
                    value: 128,
                    message:
                      t("auth.validation.passwordMaxLength") ||
                      "Password must be less than 128 characters",
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <View className="relative">
                    <TextInput
                      placeholder={
                        t("profile.user.enterNewPassword") ||
                        "Enter new password"
                      }
                      placeholderTextColor="#6B7280"
                      secureTextEntry
                      autoComplete="new-password"
                      value={value}
                      onChangeText={onChange}
                      className="bg-white/5 text-white rounded-xl px-4 py-4 border border-white/10"
                      style={{
                        fontFamily: AppFonts.medium,
                        textAlign: isRTL ? "right" : "left",
                      }}
                      returnKeyType="next"
                    />
                    <View
                      className={`absolute ${
                        isRTL ? "left-4" : "right-4"
                      } top-4`}
                    >
                      <Ionicons
                        name="lock-closed-outline"
                        size={20}
                        color="#6B7280"
                      />
                    </View>
                  </View>
                )}
              />
              {errors.password && (
                <Text
                  className="text-red-400 text-sm mt-2 ml-2"
                  style={{
                    fontFamily: AppFonts.medium,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {errors.password.message}
                </Text>
              )}
            </View>

            <View className="mb-8">
              <Text
                className="text-gray-300 text-sm mb-2"
                style={{
                  fontFamily: AppFonts.medium,
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {t("profile.user.confirmNewPassword") || "Confirm New Password"}
              </Text>
              <Controller
                control={control}
                name="confirmPassword"
                rules={{
                  validate: (val) => {
                    if (password && !val) {
                      return (
                        t("auth.validation.confirmPasswordRequired") ||
                        "Please confirm your password"
                      );
                    }
                    if (password && val !== password) {
                      return (
                        t("auth.validation.passwordsDoNotMatch") ||
                        "Passwords do not match"
                      );
                    }
                    return true;
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <View className="relative">
                    <TextInput
                      placeholder={
                        t("profile.user.confirmYourNewPassword") ||
                        "Confirm your new password"
                      }
                      placeholderTextColor="#6B7280"
                      secureTextEntry
                      autoComplete="new-password"
                      value={value}
                      onChangeText={onChange}
                      className="bg-white/5 text-white rounded-xl px-4 py-4 border border-white/10"
                      style={{
                        fontFamily: AppFonts.medium,
                        textAlign: isRTL ? "right" : "left",
                      }}
                      returnKeyType="done"
                      onSubmitEditing={handleSubmit(onSubmit)}
                    />
                    <View
                      className={`absolute ${
                        isRTL ? "left-4" : "right-4"
                      } top-4`}
                    >
                      <Ionicons
                        name="lock-closed-outline"
                        size={20}
                        color="#6B7280"
                      />
                    </View>
                  </View>
                )}
              />
              {errors.confirmPassword && (
                <Text
                  className="text-red-400 text-sm mt-2 ml-2"
                  style={{
                    fontFamily: AppFonts.medium,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {errors.confirmPassword.message}
                </Text>
              )}
            </View>
            <View className="gap-4">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleSubmit(onSubmit)}
                disabled={isUpdating || !isDirty}
              >
                <LinearGradient
                  style={{
                    borderRadius: 10,
                  }}
                  colors={
                    isUpdating || !isDirty
                      ? ["#6B7280", "#4B5563"]
                      : ["#8B5CF6", "#7C3AED"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="h-14 rounded-xl justify-center items-center shadow-lg"
                >
                  {isUpdating ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <View className="flex-row items-center">
                      <Ionicons name="save-outline" size={20} color="white" />
                      <Text
                        className="text-white text-lg ml-2"
                        style={{
                          fontFamily: AppFonts.bold,
                          textAlign: isRTL ? "right" : "left",
                        }}
                      >
                        {t("profile.user.saveChanges") || "Save Changes"}
                      </Text>
                    </View>
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
                  <View className="flex-row items-center">
                    <Ionicons name="refresh-outline" size={18} color="white" />
                    <Text
                      className="text-white ml-2"
                      style={{
                        fontFamily: AppFonts.medium,
                        textAlign: isRTL ? "right" : "left",
                      }}
                    >
                      {t("profile.user.resetChanges") || "Reset Changes"}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
            <View className="h-20" />
          </View>
        </ScrollView>
      </LinearGradient>
      <UpdatePriceModal
        visible={UpdatePrice}
        onClose={() => setUpdatePrice(false)}
        initialBusinessPrice={data?.bussiness_price ?? ""}
        initialPrivatePrice={data?.private_price ?? ""}
        video_creator_id={data?.video_creator_id ?? 0}
      />
    </SafeAreaView>
  );
};

export default ProfileUser;
