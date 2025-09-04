import { AppFonts } from "@/utils/fonts";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";

const albumSchema = z.object({
  title: z.string().min(1, "Album title is required"),
});

const getTranslatedSchema = (t: any) =>
  z.object({
    title: z.string().min(1, t("upload.validation.titleRequired")),
  });

export type AlbumFormData = z.infer<typeof albumSchema>;

type UploadType = "choose" | "song" | "album";

type Props = {
  visible: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSongUpload: (file: any) => void;
  onAlbumUpload: (data: AlbumFormData, coverImage: any) => void;
};

function UploadModal({
  visible,
  isLoading,
  onClose,
  onSongUpload,
  onAlbumUpload,
}: Props) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [uploadType, setUploadType] = useState<UploadType>("choose");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [coverImage, setCoverImage] = useState<any>(null);

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

  const pickFile = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedFile(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking file:", error);
    }
  };

  const pickCoverImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setCoverImage(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking cover image:", error);
    }
  };

  const handleSongUpload = () => {
    if (selectedFile) {
      onSongUpload(selectedFile);
      setSelectedFile(null);
    }
  };

  const handleAlbumSubmit = (data: AlbumFormData) => {
    if (coverImage) {
      onAlbumUpload(data, coverImage);
      reset();
      setCoverImage(null);
    }
  };

  const handleClose = () => {
    setUploadType("choose");
    setSelectedFile(null);
    setCoverImage(null);
    reset();
    onClose();
  };

  const renderChooseType = () => (
    <View className="space-y-4">
      <Text
        className="text-lg text-gray-800 text-center mb-6"
        style={{
          fontFamily: AppFonts.semibold,
          textAlign: isRTL ? "right" : "left",
        }}
      >
        {t("upload.chooseType")}
      </Text>
      
      <TouchableOpacity
        onPress={() => setUploadType("song")}
        className={`flex-row items-center p-4 border-2 rounded-lg ${
          isRTL ? "flex-row-reverse" : ""
        }`}
        style={{ borderColor: "#3B82F6" }}
      >
        <Ionicons name="musical-notes" size={24} color="#3B82F6" />
        <Text
          className={`text-base ${isRTL ? "mr-3" : "ml-3"}`}
          style={{
            fontFamily: AppFonts.semibold,
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {t("upload.song")}
        </Text>
      </TouchableOpacity>

             <TouchableOpacity
         onPress={() => setUploadType("album")}
         className={`flex-row items-center p-4 border-2 rounded-lg ${
           isRTL ? "flex-row-reverse" : ""
         }`}
         style={{ borderColor: "#10B981" }}
       >
         <Ionicons name="albums" size={24} color="#10B981" />
         <Text
           className={`text-base ${isRTL ? "mr-3" : "ml-3"}`}
           style={{
             fontFamily: AppFonts.semibold,
             textAlign: isRTL ? "right" : "left",
           }}
         >
           {t("upload.album")}
         </Text>
       </TouchableOpacity>


    </View>
  );

  const renderSongUpload = () => (
    <ScrollView className="flex-1">
      <View className="space-y-4">
        <Text
          className="text-xl text-gray-800 text-center"
          style={{
            fontFamily: AppFonts.semibold,
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {t("upload.songUpload.title")}
        </Text>
        
        <Text
          className="text-sm text-gray-600 text-center"
          style={{
            fontFamily: AppFonts.semibold,
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {t("upload.songUpload.subtitle")}
        </Text>

        <TouchableOpacity
          onPress={pickFile}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 items-center"
        >
          <Ionicons name="cloud-upload" size={48} color="#6B7280" />
          <Text
            className="text-base text-gray-600 mt-4 text-center"
            style={{
              fontFamily: AppFonts.semibold,
              textAlign: isRTL ? "right" : "left",
            }}
          >
            {t("upload.songUpload.browseText")}
          </Text>
          
          {selectedFile && (
            <Text
              className="text-sm text-green-600 mt-2"
              style={{
                fontFamily: AppFonts.semibold,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {selectedFile.fileName || "File selected"}
            </Text>
          )}
        </TouchableOpacity>

        <Text
          className="text-xs text-gray-500 text-center"
          style={{
            fontFamily: AppFonts.semibold,
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {t("upload.songUpload.acceptedTypes")}
        </Text>

        <Text
          className="text-xs text-gray-500 text-center"
          style={{
            fontFamily: AppFonts.semibold,
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {t("upload.songUpload.termsText")}
        </Text>

        <TouchableOpacity
          onPress={handleSongUpload}
          disabled={!selectedFile || isLoading}
          className={`py-4 rounded-full ${
            selectedFile && !isLoading ? "bg-blue-600" : "bg-gray-300"
          }`}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              className="text-white text-center text-base"
              style={{
                fontFamily: AppFonts.semibold,
              }}
            >
              {t("upload.songUpload.uploadButton")}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderAlbumUpload = () => (
    <ScrollView className="flex-1">
      <View className="space-y-4">
        <Text
          className="text-xl text-gray-800 text-center"
          style={{
            fontFamily: AppFonts.semibold,
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {t("upload.albumUpload.title")}
        </Text>

        <View>
          <Text
            className="text-gray-700 mb-2"
            style={{
              textAlign: isRTL ? "right" : "left",
              fontFamily: AppFonts.semibold,
            }}
          >
            {t("upload.albumUpload.albumTitle")}
          </Text>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder={t("upload.albumUpload.albumTitlePlaceholder")}
                value={value}
                onChangeText={onChange}
                className="border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-800"
                placeholderTextColor="#9CA3AF"
                style={{
                  textAlign: isRTL ? "right" : "left",
                  fontFamily: AppFonts.semibold,
                }}
              />
            )}
          />
          {errors.title && (
            <Text
              className="text-red-500 text-xs mt-1"
              style={{
                textAlign: isRTL ? "right" : "left",
                fontFamily: AppFonts.semibold,
              }}
            >
              {errors.title?.message}
            </Text>
          )}
        </View>

        <View>
          <Text
            className="text-gray-700 mb-2"
            style={{
              textAlign: isRTL ? "right" : "left",
              fontFamily: AppFonts.semibold,
            }}
          >
            {t("upload.albumUpload.albumCover")}
          </Text>
          
          <TouchableOpacity
            onPress={pickCoverImage}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 items-center"
          >
            {coverImage ? (
              <Image
                source={{ uri: coverImage.uri }}
                className="w-24 h-24 rounded-lg"
                resizeMode="cover"
              />
            ) : (
              <>
                <Ionicons name="image" size={32} color="#6B7280" />
                <Text
                  className="text-sm text-gray-600 mt-2"
                  style={{
                    fontFamily: AppFonts.semibold,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {t("upload.albumUpload.noFileChosen")}
                </Text>
                <Text
                  className="text-xs text-blue-600 mt-1"
                  style={{
                    fontFamily: AppFonts.semibold,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {t("upload.albumUpload.chooseFile")}
                </Text>
              </>
            )}
          </TouchableOpacity>
          
          {!coverImage && (
            <Text
              className="text-red-500 text-xs mt-1"
              style={{
                textAlign: isRTL ? "right" : "left",
                fontFamily: AppFonts.semibold,
              }}
            >
              {t("upload.validation.coverRequired")}
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={handleSubmit(handleAlbumSubmit)}
          disabled={!coverImage || isLoading}
          className={`py-4 rounded-full ${
            coverImage && !isLoading ? "bg-green-600" : "bg-gray-300"
          }`}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              className="text-white text-center text-base"
              style={{
                fontFamily: AppFonts.semibold,
              }}
            >
              {t("upload.submit")}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderContent = () => {
    switch (uploadType) {
      case "song":
        return renderSongUpload();
      case "album":
        return renderAlbumUpload();
      default:
        return renderChooseType();
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View className="flex-1 bg-black/40 justify-center items-center px-4">
        <View className="bg-white rounded-2xl w-full max-h-[90%]">
          <View
            className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200"
            style={{ flexDirection: isRTL ? "row-reverse" : "row" }}
          >
            <View className={`flex-row items-center ${isRTL ? "flex-row-reverse" : ""}`}>
              {uploadType !== "choose" && (
                <TouchableOpacity
                  onPress={() => setUploadType("choose")}
                  className={`${isRTL ? "ml-3" : "mr-3"}`}
                >
                  <Ionicons name="arrow-back" size={20} color="#6B7280" />
                </TouchableOpacity>
              )}
              <Text
                className="text-lg text-gray-800"
                style={{
                  textAlign: isRTL ? "right" : "left",
                  fontFamily: AppFonts.semibold,
                }}
              >
                {t("upload.title")}
              </Text>
            </View>
            <TouchableOpacity onPress={handleClose}>
              <Text
                className="text-xl text-gray-600"
                style={{
                  fontFamily: AppFonts.semibold,
                }}
              >
                ✕
              </Text>
            </TouchableOpacity>
          </View>

          <View className="p-4 flex-1">
            {renderContent()}
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default UploadModal;
