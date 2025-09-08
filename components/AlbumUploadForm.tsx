import { useAddAlbumMutation } from "@/store/api/global/albums";
import { AppFonts } from "@/utils/fonts";
import { getToken } from "@/utils/secureStore";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

const albumSchema = z.object({
  title: z.string().min(1, "Album title is required"),
});

export type AlbumFormData = z.infer<typeof albumSchema>;

type Props = {
  isRTL: boolean;
};

const AlbumUploadForm: React.FC<Props> = ({ isRTL }) => {
  const { t } = useTranslation();
  const [coverImage, setCoverImage] = useState<any>(null);
  const [, { isLoading: isAddAlbumLoading }] = useAddAlbumMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AlbumFormData>({
    resolver: zodResolver(albumSchema),
    defaultValues: {
      title: "",
    },
  });

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "We need access to your media library to upload files."
        );
      }
    }
  };

  const pickCoverImage = async () => {
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

        const imageFile = {
          uri: asset.uri,
          name: fileName,
          type: mimeType,
          base64: asset.base64,
        };

        setCoverImage(imageFile);
        Toast.show({
          type: "success",
          text1: "Cover Image Selected",
          text2: "Album cover uploaded successfully",
        });
      }
    } catch (err) {
      console.log("Image picker error:", err);
      Toast.show({
        type: "error",
        text1: "Selection Failed",
        text2: "Unable to select cover image. Please try again.",
      });
    }
  };

  const handleAlbumSubmitForm = async (data: AlbumFormData) => {
    if (!coverImage) {
      Toast.show({
        type: "error",
        text1: "No Cover Image",
        text2: "Please select a cover image for the album",
      });
      return;
    }

    try {
      // إنشاء FormData بنفس طريقة ProfileUser
      const albumFormData = new FormData();
      albumFormData.append("title", data.title);

      if (coverImage.base64) {
        const base64File = {
          uri: `data:${coverImage.type};base64,${coverImage.base64}`,
          type: coverImage.type,
          name: coverImage.name,
        };
        albumFormData.append("album_cover", base64File as any);
        console.log("Using base64 file:", base64File);
      } else {
        const regularFile = {
          uri: coverImage.uri,
          type: coverImage.type || "image/jpeg",
          name: coverImage.name || `album_cover_${Date.now()}.jpg`,
        };
        albumFormData.append("album_cover", regularFile as any);
      }

      const token = await getToken("access_token");
      const response = await fetch(
        "https://api.cloudwavproduction.com/api/albums",
        {
          method: "POST",
          body: albumFormData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }
      Toast.show({
        type: "success",
        text1: "Album Created",
        text2: "Your album has been created successfully",
      });
      reset();
      setCoverImage(null);
    } catch (error: any) {
      console.log("Upload error:", error);

      Toast.show({
        type: "error",
        text1: "Upload Failed",
        text2:
          error?.data?.message ||
          error?.message ||
          "Failed to create album. Please try again.",
      });
    }
  };

  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View className="space-y-6">
        <Text
          className="text-xl text-white text-center"
          style={{
            fontFamily: AppFonts.bold,
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {t("upload.albumUpload.title") || "Create New Album"}
        </Text>

        <View>
          <Text
            className="text-gray-300 mb-3"
            style={{
              fontFamily: AppFonts.medium,
              textAlign: isRTL ? "right" : "left",
            }}
          >
            Album Cover *
          </Text>
          <TouchableOpacity
            onPress={pickCoverImage}
            className="border-2 border-dashed border-green-400/50 rounded-xl p-6 items-center bg-white/5"
          >
            {coverImage ? (
              <View className="items-center">
                <Image
                  source={{ uri: coverImage.uri }}
                  className="w-24 h-24 rounded-xl mb-3"
                  resizeMode="cover"
                />
                <Text
                  className="text-green-400 text-sm"
                  style={{
                    fontFamily: AppFonts.medium,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  Cover image selected
                </Text>
                <Text className="text-gray-400 text-xs mt-1">
                  Tap to change image
                </Text>
              </View>
            ) : (
              <View className="items-center">
                <Ionicons name="image-outline" size={48} color="#10B981" />
                <Text
                  className="text-green-400 text-base mt-3"
                  style={{
                    fontFamily: AppFonts.medium,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {t("upload.albumUpload.chooseFile") || "Select Album Cover"}
                </Text>
                <Text
                  className="text-gray-400 text-xs mt-2"
                  style={{
                    fontFamily: AppFonts.medium,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  Recommended: 1:1 aspect ratio, min 500x500px
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View>
          <Text
            className="text-gray-300 mb-2"
            style={{
              fontFamily: AppFonts.medium,
              textAlign: isRTL ? "right" : "left",
            }}
          >
            Album Title *
          </Text>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder={
                  t("upload.albumUpload.albumTitlePlaceholder") ||
                  "Enter album title"
                }
                value={value}
                onChangeText={onChange}
                className="bg-white/5 text-white rounded-xl px-4 py-4 text-base border border-white/10"
                placeholderTextColor="#6B7280"
                style={{
                  textAlign: isRTL ? "right" : "left",
                  fontFamily: AppFonts.medium,
                }}
              />
            )}
          />
          {errors.title && (
            <Text
              className="text-red-400 text-sm mt-1"
              style={{
                textAlign: isRTL ? "right" : "left",
                fontFamily: AppFonts.medium,
              }}
            >
              {errors.title.message}
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={handleSubmit(handleAlbumSubmitForm)}
          disabled={!coverImage || isAddAlbumLoading}
          activeOpacity={0.8}
          className="mt-6 mb-10"
        >
          <LinearGradient
            colors={
              coverImage && !isAddAlbumLoading
                ? ["#10B981", "#059669"]
                : ["#6B7280", "#4B5563"]
            }
            className="py-4 rounded-xl items-center"
          >
            {isAddAlbumLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <View className="flex-row items-center">
                <Ionicons name="albums" size={20} color="white" />
                <Text
                  className="text-white text-lg ml-2"
                  style={{ fontFamily: AppFonts.bold }}
                >
                  {t("upload.submit") || "Create Album"}
                </Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AlbumUploadForm;
